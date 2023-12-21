<script setup lang="ts">
import {ref} from 'vue'
import {TableV2SortOrder} from 'element-plus'
import type {SortBy, SortState} from 'element-plus'
import * as api from '../api'
import {Deal} from '../entity/Deal'

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
    sortable: true,
}]

const deals = ref<Deal[]>([])
api.getDeals().then(data => {
    for (const deal of data) {
        deal.price = deal.offerPrice + deal.answerPrice
    }
    deals.value = data
})

const sortState = ref<SortState>({
    'time': TableV2SortOrder.DESC,
    'price': TableV2SortOrder.ASC,
})

const onSort = ({key, order}: SortBy) => {
    sortState.value[key] = order
    deals.value = deals.value.reverse()
}
</script>

<template>
    <el-table-v2
        v-model:sort-state="sortState"
        :columns="columns"
        :data="deals"
        :width="700"
        :height="400"
        fixed
        @column-sort="onSort"
    />
</template>

<style scoped>

</style>
