<script setup lang="ts">
import {Delete, Edit} from '@element-plus/icons-vue'
import {deleteOffer} from '../api'
import {offerStateLabels, typeLabels} from '../labels'
import {Offer, State as OfferState} from '../entity/Offer'
import OfferTypeSelect from '../components/OfferTypeSelect.vue'
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import * as api from '../api'
import axios, {AxiosError} from 'axios'
import {useThrottleFn} from '@vueuse/core'
import router from '../router'

const pageSize = 12

const offers = reactive<Offer[]>([])
const total = ref(0)
onMounted(loadPage)

const enum Menu {
    offer,
    local,
    answer,
}

const menuLabels = [
    '寻去处',
    '欢迎来',
    '我的响应',
]

const selectedMenu = ref(Menu.offer)

function onSelectMenu(selectedStr: string) {
    const selected = parseInt(selectedStr)
    if (selected !== selectedMenu.value) {
        selectedMenu.value = selected
        conditions.local = selected === Menu.local
        loadPage()
    }
}

const conditions = reactive({
    type: -1,
    title: '',
    local: false,
})

let source = axios.CancelToken.source()

const loadingPage = ref(false)

async function loadPage(pageNo = 1) {
    const start = (pageNo - 1) * pageSize
    const end = pageNo * pageSize
    let data: {
        list: Offer[],
        total: number
    }

    loadingPage.value = true
    source.cancel()
    source = axios.CancelToken.source()
    try {
        data = await api.findOffers(start, end, conditions, source.token)
    } catch (e) {
        if (!axios.isCancel(e)) {
            ElMessage.error({
                showClose: true,
                message: (e as AxiosError).message,
            })
        }
        return console.error(e)
    } finally {
        loadingPage.value = false
    }
    offers.splice(0, offers.length, ...data.list)
    total.value = data.total
}

const throttledLoadPage = useThrottleFn(loadPage, 300, true)

const enum DialogType {
    publish,
    edit,
}

const dialogTypeLabel = [
    '发布',
    '编辑',
]

let offerToPublish = reactive(new Offer())

const dialogVisible = ref(false)
const dialogType = ref(DialogType.publish)
const dialogOffer = ref(offerToPublish)

async function publishOffer() {
    const id = await api.publishOffer(offerToPublish)
    const offer = offerToPublish
    offerToPublish = new Offer()
    ;(offer as any).id = id
    total.value++
    if (offers.length < pageSize) {
        offers.push(offer)
        return
    }
}

function matches(offer: Offer, conditions: { type: number, title: string }) {
    return (conditions.type < 0 || offer.type === conditions.type)
        && offer.title.includes(conditions.title)
}

async function editOffer() {
    const offer = dialogOffer.value

    await api.updateOffer(offer)

    if (!matches(offer, conditions)) {
        await loadPage()
    }
}

function onSubmit() {
    dialogVisible.value = false
    try {
        if (dialogType.value === DialogType.publish) {
            publishOffer()
        } else {
            editOffer()
        }
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    }
}

const processingIdx = ref(-1)

async function deleteOffer(index: number) {
    const offer = offers[index]
    if (offer.state !== OfferState.pending) {
        const message = '只能删除未响应的请求'
        ElMessage.error({
            showClose: true,
            message,
        })
        return console.error(message)
    }
    try {
        await ElMessageBox.confirm('确认删除？', undefined, {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        })
    } catch {
        return
    }
    if (processingIdx.value >= 0) {
        ElMessage.error({
            showClose: true,
            message: '正在删除中，请稍后再试',
        })
        return console.log('processingIdx', processingIdx)
    }
    processingIdx.value = index
    try {
        await api.deleteOffer(offer.id)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    } finally {
        processingIdx.value = -1
    }
    offers.splice(index, 1)
    total.value--
}

function onPublishOffer() {
    dialogVisible.value = true
    dialogType.value = DialogType.publish
    dialogOffer.value = offerToPublish
}

function onEditOffer(offer: Offer) {
    dialogVisible.value = true
    dialogType.value = DialogType.edit
    dialogOffer.value = offer
}
</script>

<template>
    <div class="local-nav">
        <el-menu
            mode="horizontal"
            class="tabs"
            :default-active="Menu.offer.toString()"
            @select="onSelectMenu"
        >
            <el-menu-item
                v-for="(label, i) of menuLabels"
                :index="i.toString()"
            >
                {{ label }}
            </el-menu-item>
        </el-menu>
        <ul class="toolbar">
            <li>
                <el-input
                    v-model="conditions.title"
                    @input="throttledLoadPage(1)"
                    placeholder="搜索标题"
                />
            </li>
            <li class="condition-type-box">
                <label>筛选类型</label>
                <OfferTypeSelect
                    class="condition-type"
                    v-model="conditions.type"
                    @update:model-value="loadPage(1)"
                    prepend-label="无"
                />
            </li>
            <li>
                <el-button
                    type="primary"
                    class="publish-btn"
                    @click="onPublishOffer"
                >
                    发布请求
                </el-button>
            </li>
        </ul>
    </div>
    <ul v-if="offers.length" class="list" v-loading="loadingPage">
        <li
            class="offer-preview"
            v-for="(offer, i) in offers"
            :key="offer.id"
        >
            <el-card
                shadow="always"
                v-loading="processingIdx === i"
                @click="router.push(`offer/${offer.id}`)"
            >
                <template #header>
                    <h3 class="card-title">{{ offer.title }}</h3>
                    <el-button-group
                        v-if="selectedMenu === Menu.offer"
                        size="small"
                        @click.stop
                    >
                        <el-tooltip content="删除">
                            <el-button
                                class="delete-btn"
                                @click="deleteOffer(i)"
                            >
                                <el-icon color="red">
                                    <Delete/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑">
                            <el-button :icon="Edit" @click="onEditOffer(offer)"/>
                        </el-tooltip>
                    </el-button-group>
                </template>
                <el-text :line-clamp="2" class="desc">{{ offer.desc }}</el-text>
                <div class="card-footer">
                    <el-tooltip :content="`类型：${typeLabels[offer.type]}`">
                        {{ typeLabels[offer.type] }}
                    </el-tooltip>
                    <el-tooltip :content="`状态：${offerStateLabels[offer.state]}`">
                        <el-badge
                            :value="offer.answerIds.length"
                            v-if="offer.state === OfferState.pending"
                        >
                            <span
                                class="offer-state"
                                :class="OfferState[offer.state]"
                            >
                                {{ offerStateLabels[offer.state] }}
                            </span>
                        </el-badge>
                        <span
                            class="offer-state"
                            :class="OfferState[offer.state]"
                            v-else
                        >
                            {{ offerStateLabels[offer.state] }}
                        </span>
                    </el-tooltip>
                </div>
            </el-card>
        </li>
    </ul>
    <el-empty v-else description="列表为空"/>
    <el-pagination
        class="pagination"
        @current-change="loadPage"
        layout="prev, pager, next"
        :default-page-size="pageSize"
        :total="total"
        background
    />
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTypeLabel[dialogType] + '请求'"
    >
        <el-form
            :model="dialogOffer"
            class="publish-form"
            label-width="80px"
        >
            <el-form-item label="主题名称">
                <el-input
                    v-model="dialogOffer.title"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    v-model="dialogOffer.desc"
                    type="textarea"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="去处类型">
                <OfferTypeSelect v-model="dialogOffer.type"/>
            </el-form-item>
            <el-form-item label="价格">
                <el-input-number v-model="dialogOffer.price" class="price-ipt"/>
                <span class="unit">元</span>
            </el-form-item>
            <el-form-item label="过期时间">
                <el-date-picker
                    v-model="dialogOffer.expire"
                    type="datetime"
                    placeholder="选择日期及时间"
                    format="YYYY/MM/DD HH:mm:ss"
                />
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">
              提交
            </el-button>
          </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.local-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.publish-btn {
    height: calc(var(--el-menu-horizontal-height) - 1em);
}

.tabs {
    flex: 1;
}

.tabs :deep(a) {
    color: unset;

    &:hover {
        color: var(--el-color-primary);
    }
}

.toolbar {
    display: flex;
    align-items: center;
}

.condition-type-box {
    margin: 0 2em;
}

.condition-type {
    margin-left: 1em;
    min-width: 8em;
}

.list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, auto));
    gap: 1em;
    margin: 20px auto 10px;
}

.offer-preview {
    cursor: pointer;
}

.offer-preview:hover {
    transform: scale(1.02);
    transition: transform .2s;
}

:deep(.el-card__header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    padding-top: 1em;
    padding-bottom: 1em;

    background-color: var(--el-color-primary-dark-2);
    color: #fff;
}

.card-title {
    flex: 1;
    margin-right: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-btn:hover {
    background-color: var(--el-color-danger-light-7);
    border-color: var(--el-color-danger-light-3);
}

.delete-btn:active {
    background-color: var(--el-color-danger-light-3);
    border-color: var(--el-color-danger);
}

.desc {
    height: 3em;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .6em;
    padding-top: .4em;
    height: 2em;
    border-top: 1px solid #ccc;
}

.pagination {
    justify-content: center;
}

.publish-form {
    padding: 0 20px;
}

.price-ipt {
    width: calc(100% - 2.2em);
}

.unit {
    margin-left: 1em;
}

.offer-state {
    padding: .4em;
    border-radius: var(--el-border-radius-base);
    color: #fff;
}

.fulfilled {
    background-color: var(--el-color-success);
}

.pending {
    background-color: var(--el-color-primary);
}

.canceled {
    background-color: var(--el-color-warning);
}

.expired {
    background-color: var(--el-color-info);
}
</style>
