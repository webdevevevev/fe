<script setup lang="ts">
import {reactive, ref} from 'vue'
import {SortBy, SortState} from 'element-plus'
import {TableV2SortOrder} from 'element-plus'
import * as api from '../api'
import {Deal} from '../entity/Deal'
import {SortOrder} from 'element-plus/es/components/table-v2/src/constants'
import CitySelect from '../components/CitySelect.vue'

const conditions = reactive<{
    province: number
    city: number
    monthRange: Date[]
}>({
    province: -1,
    city: -1,
    monthRange: [],
})

const shortcuts = [{
    text: '本月',
    value: [new Date(), new Date()],
}, {
    text: '本年',
    value() {
        const end = new Date()
        const start = new Date(new Date().getFullYear(), 0)
        return [start, end]
    },
}, {
    text: '过去6个月',
    value() {
        const end = new Date()
        const start = new Date()
        start.setMonth(start.getMonth() - 6)
        return [start, end]
    },
}]

const width = 200
const columns = [{
    key: 'time',
    dataKey: 'time',
    title: '达成日期',
    width,
    sortable: true,
}, {
    key: 'offerId',
    dataKey: 'offerId',
    title: '请求标识',
    width,
}, {
    key: 'offerPrice',
    dataKey: 'offerPrice',
    title: '发布者支付中介费',
    width,
}, {
    key: 'answerPrice',
    dataKey: 'answerPrice',
    title: '响应者支付中介费',
    width,
}, {
    key: 'price',
    dataKey: 'price',
    title: '中介费',
    width,
    // sortable: true,
}]

const deals = ref<Deal[]>([])

function load() {
    api.getDeals(
        conditions.city,
        conditions.monthRange[0]?.getTime(),
        conditions.monthRange[1]?.getTime()
    )
        .then(data => {
            for (const deal of data) {
                deal.price = deal.offerPrice + deal.answerPrice
            }
            deals.value = data
            onSort({
                key: 'time',
                order: SortOrder.DESC,
            })
        })
}

load()

const sortState = ref<SortState>({
    'time': TableV2SortOrder.DESC,
    'price': TableV2SortOrder.ASC,
})

const onSort = ({key, order}: SortBy) => {
    sortState.value[key] = order
    const ascCmp = key === 'time'
        ? (a, b) => a.time.localeCompare(b.time)
        : (a, b) => a - b
    const cmp = order === SortOrder.ASC
        ? ascCmp
        : (a, b) => ascCmp(b, a)
    deals.value.sort(cmp)
}
</script>

<template>
    <header class="header">
        <h2>
            共{{ deals.length }}条
        </h2>
        <el-form class="toolbar">
            <el-form-item class="tool">
                <el-date-picker
                    v-model="conditions.monthRange"
                    type="monthrange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="起始月份"
                    end-placeholder="终止月份"
                    :shortcuts="shortcuts"
                />
            </el-form-item>
            <el-form-item class="tool">
                <CitySelect
                    v-model:province="conditions.province"
                    v-model:city="conditions.city"
                />
            </el-form-item>
            <el-form-item class="tool">
                <el-button
                    type="primary"
                    class="btn"
                    @click=""
                >
                    搜索
                </el-button>
            </el-form-item>
        </el-form>
    </header>

    <el-table-v2
        v-model:sort-state="sortState"
        :columns="columns"
        :data="deals"
        :width="width * 5"
        :height="600"
        fixed
        @column-sort="onSort"
        class="list"
    />
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin: 0 16em;
    border-bottom: var(--el-border);
}

.toolbar {
    display: flex;
}

.tool {
    margin-left: 20px;
}

.list {
    margin: 0 auto;
}
</style>
