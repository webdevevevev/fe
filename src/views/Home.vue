<script setup lang="ts">
import {useStore} from 'vuex'
import {reactive, ref} from 'vue'
import {Offer, Type as OfferType, State as OfferState} from '../entity/Offer'
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
console.log(OfferState)

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
</script>

<template>
    <nav class="nav">
        <h1 class="title">好去处</h1>
        <div>{{ store.state.nickname }}
            <span class="vip-icon">VIP</span>
        </div>
    </nav>
    <el-menu
        mode="horizontal"
        class="tabs"
        default-active="offer"
    >
        <el-menu-item index="offer">寻去处</el-menu-item>
        <el-menu-item index="answer">欢迎来</el-menu-item>
    </el-menu>
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

.tabs {
    margin-top: 20px;
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
</style>
