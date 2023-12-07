<script setup lang="ts">
import {Delete, Edit, Avatar, ArrowDown} from '@element-plus/icons-vue'
import {useStore} from 'vuex'
import {onMounted, reactive, ref} from 'vue'
import {Offer, State as OfferState, Type as OfferType} from '../entity/Offer'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {AxiosError} from 'axios'
import OfferTypeSelect from '../components/OfferTypeSelect.vue'
import {typeLabels} from '../labels'

const store = useStore()

const pageSize = 12

const offers = reactive<Offer[]>([])
const total = ref(0)
onMounted(loadPage)

const stateLabels = [
    '已完成',
    '待响应',
    '已取消',
    '到期未达成',
]

const conditions = reactive({
    type: -1,
    title: '',
})

async function loadPage(pageNo = 1) {
    const start = (pageNo - 1) * pageSize
    const end = pageNo * pageSize
    let data: {
        list: Offer[],
        total: number
    }
    try {
        data = await api.findOffers(start, end, conditions)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    }
    offers.splice(0, offers.length, ...data.list)
    total.value = data.total
}

const publishDialogVisible = ref(false)

let offerToPublish = reactive(new Offer())

async function onSubmit() {
    publishDialogVisible.value = false
    let id: number
    try {
        id = await api.publishOffer(offerToPublish)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    }
    const offer = offerToPublish
    offerToPublish = new Offer()
    ;(offer as any).id = id
    total.value++
    if (offers.length < pageSize) {
        offers.push(offer)
        return
    }
}
</script>

<template>
    <nav class="nav">
        <h1 class="title">好去处</h1>
        <el-dropdown class="dropdown" trigger="click">
            <span class="dropdown-link">
                {{ store.state.nickname }}
                <el-icon size="large" class="avatar-icon">
                    <Avatar/>
                </el-icon>
                <el-icon>
                    <ArrowDown/>
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu class="dropdown-menu">
                    <el-dropdown-item>
                        <router-link to="profile">
                            账号设置
                        </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <router-link
                            to="welcome"
                            @click="localStorage.removeItem('sign')"
                        >
                            退出
                        </router-link>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </nav>
    <div class="local-nav">
        <el-menu
            mode="horizontal"
            class="tabs"
            default-active="offer"
        >
            <el-menu-item index="offer">寻去处</el-menu-item>
            <el-menu-item index="answer">欢迎来</el-menu-item>
        </el-menu>
        <ul class="toolbar">
            <li>
                <el-input
                    v-model="conditions.title"
                    @change="loadPage(1)"
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
                    @click="publishDialogVisible = true"
                >
                    发布请求
                </el-button>
            </li>
        </ul>
    </div>
    <el-dialog v-model="publishDialogVisible" title="发布新请求">
        <el-form
            :model="offerToPublish"
            class="publish-form"
            label-width="80px"
        >
            <el-form-item label="主题名称">
                <el-input
                    v-model="offerToPublish.title"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    v-model="offerToPublish.desc"
                    type="textarea"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="去处类型">
                <OfferTypeSelect v-model="offerToPublish.type"/>
            </el-form-item>
            <el-form-item label="价格">
                <el-input-number v-model="offerToPublish.price" class="price-ipt"/>
                <span class="unit">元</span>
            </el-form-item>
            <el-form-item label="过期时间">
                <el-date-picker
                    v-model="offerToPublish.expire"
                    type="datetime"
                    placeholder="选择日期及时间"
                    format="YYYY/MM/DD HH:mm:ss"
                />
            </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="publishDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">
              提交
            </el-button>
          </span>
        </template>
    </el-dialog>
    <ul class="list">
        <li
            class="offer-preview"
            v-for="offer in offers"
            :key="offer.id"
        >
            <el-card
                class="card"
                shadow="always"
            >
                <template #header>
                    <h3 class="card-title">{{ offer.title }}</h3>
                    <el-button-group size="small" class="btn-group">
                        <el-button :icon="Delete"/>
                        <el-button :icon="Edit"/>
                    </el-button-group>
                </template>
                <el-text :line-clamp="2" class="desc">{{ offer.desc }}</el-text>
                <div class="card-footer">
                    <el-tooltip :content="`类型：${typeLabels[offer.type]}`">
                        {{ typeLabels[offer.type] }}
                    </el-tooltip>
                    <el-tooltip :content="`状态：${stateLabels[offer.state]}`">
                        <span
                            class="offer-state"
                            :class="OfferState[offer.state]"
                        >
                            {{ stateLabels[offer.state] }}
                        </span>
                    </el-tooltip>
                </div>
            </el-card>
        </li>
    </ul>
    <el-pagination
        class="pagination"
        @current-change="loadPage"
        layout="prev, pager, next"
        :default-page-size="pageSize"
        :total="total"
        background
    />
</template>

<style scoped>
.nav {
    display: flex;
    justify-content: space-between;
}

.dropdown {
    cursor: pointer;
}

.dropdown-menu a {
    color: unset;
}

.avatar-icon {
    margin-left: 1em;
    padding: .5em;
    border-radius: .2em .5em;
    background-color: #ddd;
    color: #333;
}

.local-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
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
    width: 14em;
}

.list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1em;
    margin: 20px auto 10px;
}

.offer-preview {
    min-width: 280px;
    cursor: pointer;

    &:hover {
        transform: scale(1.02);
        transition: transform .2s;
    }
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

.btn-group {
    flex: none;
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
