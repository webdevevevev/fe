<script setup lang="ts">
import {useStore} from 'vuex'
import {reactive, ref} from 'vue'
import {Offer} from '../entity/Offer'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {AxiosError} from 'axios'

const store = useStore()

const pageSize = 20

const offers = reactive<Offer[]>([])
const total = ref(0)
loadPage(1)

const typeLabels = [
    '钓鱼',
    '老少皆宜休闲',
    '农家院',
    '温泉度假',
    '僻静休闲',
    '游乐场',
    '其他',
]
const stateLabels = [
    '已完成',
    '待响应',
    '已取消',
    '到期未达成',
]

async function loadPage(pageNo = 1) {
    const start = (pageNo - 1) * pageSize
    const end = pageNo * pageSize
    let data: { list: Offer[], total: number }
    try {
        data = await api.findOffers(start, end)
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

const offerToPublish = reactive(new Offer())
</script>

<template>
    <nav class="nav">
        <h1 class="title">好去处</h1>
        <div>{{ store.state.nickname }}
            <span class="vip-icon">VIP</span>
        </div>
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
                <el-select
                    v-model="offerToPublish.type"
                >
                    <el-option
                        v-for="(label, i) in typeLabels"
                        :key="label"
                        :label="label"
                        :value="i"
                    />
                </el-select>
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
            <el-button type="primary" @click="publishDialogVisible = false">
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
            <el-card class="card">
                <h3 class="card-title">{{ offer.title }}</h3>
                <p class="desc">{{ offer.desc }}</p>
                <div class="card-footer">
                    <span class="offer-type">类型：{{ typeLabels[offer.type] }}</span>
                    <span class="offer-state">状态：{{ stateLabels[offer.state] }}</span>
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

.title {
}

.vip-icon {
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

.tabs :deep(a) {
    color: unset;

    &:hover {
        color: var(--el-color-primary);
    }
}

.list {
    margin: 20px 0;
}

.card-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.desc {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    margin: 20px 0 10px 0;
    border-bottom: 1px solid #666;
}

.card-footer {
    display: flex;
    justify-content: space-between;
}

.list {
    display: grid;
    grid-template: 5fr/4fr;
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
</style>
