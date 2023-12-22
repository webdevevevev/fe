<script setup lang="ts">
import {reactive, ref} from 'vue'
import {SortBy, SortState} from 'element-plus'
import {TableV2SortOrder} from 'element-plus'
import * as api from '../api'
import {Deal} from '../entity/Deal'
import {SortOrder} from 'element-plus/es/components/table-v2/src/constants'

const conditions = reactive<{
    city: number
    start?: Date
    end?: Date
}>({
    city: 100000,
    start: undefined,
    end: undefined,
})

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
    api.getDeals(conditions.city, conditions.start?.getTime(), conditions.end?.getTime())
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
                    v-model="conditions.start"
                    type="date"
                    placeholder="起始日期"
                    format="YYYY/MM/DD"
                />
            </el-form-item>
            <el-form-item class="tool">
                <el-date-picker
                    v-model="conditions.end"
                    type="date"
                    placeholder="终止日期"
                    format="YYYY/MM/DD"
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
