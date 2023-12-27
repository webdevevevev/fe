<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {Column, SortBy, SortState, TableV2SortOrder} from 'element-plus'
import * as api from '../api'
import {Deal} from '../entity/Deal'
import {SortOrder} from 'element-plus/es/components/table-v2/src/constants'
import CitySelect from '../components/CitySelect.vue'
import * as echarts from 'echarts'
import type {ECBasicOption} from 'echarts/types/src/util/types'
import {User} from '../entity/User'

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
const columns: Column[] = [{
    key: 'time',
    dataKey: 'time',
    title: '达成日期',
    width,
    sortable: true,
    align: 'center',
}, {
    key: 'offerId',
    dataKey: 'offerId',
    title: '请求标识',
    width,
    align: 'center',
}, {
    key: 'offerPrice',
    dataKey: 'offerPrice',
    title: '发布者支付中介费',
    width,
    align: 'center',
}, {
    key: 'answerPrice',
    dataKey: 'answerPrice',
    title: '响应者支付中介费',
    width,
    align: 'center',
}, {
    key: 'price',
    dataKey: 'price',
    title: '中介费',
    width,
    // sortable: true,
    align: 'center',
}]

const deals = ref<Deal[]>([])

function loadDeals() {
    api.getDeals(
        conditions.city,
        conditions.monthRange[0]?.getTime(),
        conditions.monthRange[1]?.getTime(),
    ).then(data => {
        for (const deal of data) {
            const price = Number(deal.offerPrice) + Number(deal.answerPrice)
            deal.price = price.toFixed(2).toString()
        }
        deals.value = data
        onSort({
            key: 'time',
            order: SortOrder.DESC,
        })
    })
}

loadDeals()

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
    updateChart(deals.value, order)
}

function updateChart(deals: ReadonlyArray<Deal>, order: SortOrder) {
    if (deals.length <= 0) {
        return []
    }
    const dealsASC = order === SortOrder.ASC ? deals : [...deals].reverse()
    const {x, price, count} = chartDataASC(dealsASC)
    option.series[0].data = count.map((n, i) => [x[i], n])
    option.series[1].data = price.map((n, i) => [x[i], n])
    myChart.setOption(option)
}

function chartDataASC(deals: ReadonlyArray<Deal>) {
    const minDate = new Date(deals[0].time)
    let year = minDate.getFullYear()
    let month = minDate.getMonth()
    const x = [new Date(year, month).getTime()]
    const price: number[] = [deals[0].price]
    const count = [1]
    for (let i = 1; i < deals.length; i++) {
        const deal = deals[i]
        const time = new Date(deal.time)
        const timeMonth = time.getMonth()
        const timeYear = time.getFullYear()
        if (timeYear === year && timeMonth === month) {
            price[price.length - 1] += deal.price
            count[count.length - 1]++
        } else {
            price.push(deal.price)
            count.push(1)
            const [nextYear, nextMonth] = timeMonth >= 12
                ? [timeYear + 1, 0]
                : [timeYear, month + 1]
            x.push(new Date(timeYear, timeMonth).getTime())
            year = nextYear
            month = nextMonth
        }
    }
    return {x, price, count}
}

const chartDom = ref(null)
const option: ECBasicOption = {
    tooltip: {
        trigger: 'axis',
        position(pointerPos: any[]) {
            pointerPos[1] = '10%'
            return pointerPos
        },
    },
    title: {
        text: '成交单数及中介费金额图',
        left: 'center',
    },
    toolbox: {
        feature: {
            restore: {},
        },
    },
    legend: {
        data: ['成交单数', '中介费'],
        left: 10,
    },
    xAxis: {
        type: 'time',
        boundaryGap: false,
    },
    yAxis: [{
        name: '成交单数',
        type: 'value',
        boundaryGap: [0, '100%'],
    }, {
        name: '中介费（元）',
        nameLocation: 'end',
        alignTicks: true,
        type: 'value',
    }],
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100,
    }, {
        start: 0,
        end: 20,
    }],
    series: [{
        name: '成交单数',
        type: 'line',
        symbol: 'none',
        yAxisIndex: 0,
    }, {
        name: '中介费',
        type: 'line',
        symbol: 'none',
        yAxisIndex: 1,
    }],
}
let myChart: echarts.ECharts
onMounted(() => {
    myChart = echarts.init(chartDom.value, null, {locale: 'ZH'})
})

const collapseItems = ['table', 'chart', 'users']

const userColumns: Column[] = [{
    key: 'id',
    dataKey: 'id',
    title: 'ID',
    width,
    align: 'center',
}, {
    key: 'nickname',
    dataKey: 'nickname',
    title: '用户名',
    width,
    align: 'center',
}, {
    key: 'isAdmin',
    dataKey: 'isAdmin',
    title: '用户类型',
    width,
    align: 'center',
}, {
    key: 'isVIP',
    dataKey: 'isVIP',
    title: '用户级别',
    width,
    align: 'center',
}]

const users = reactive<User[]>([])

function loadUsers() {
    api.allUsers()
        .then(data => {
            for (const user of data) {
                user.isAdmin = user.isAdmin ? '管理员' : '普通用户'
                user.isVIP = user.isVIP ? 'VIP' : '一般'
            }
            users.push(...data)
        })
}

loadUsers()
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
                    @click="loadDeals"
                >
                    搜索
                </el-button>
            </el-form-item>
        </el-form>
    </header>

    <el-collapse class="body" v-model="collapseItems">
        <el-collapse-item name="table">
            <template #title>
                <h3>统计表</h3>
            </template>
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
        </el-collapse-item>

        <el-collapse-item name="chart">
            <template #title>
                <h3>统计图</h3>
            </template>
            <div ref="chartDom" class="chart"></div>
        </el-collapse-item>

        <el-collapse-item name="users">
            <template #title>
                <h3>用户信息</h3>
            </template>
            <el-table-v2
                :columns="userColumns"
                :data="users"
                :width="width * 5"
                :height="600"
                fixed
                class="list"
            />
        </el-collapse-item>
    </el-collapse>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-bottom: var(--el-border);
}

.header,
.body {
    max-width: 1000px;
    margin: 0 auto;
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
}

.tool {
    margin-left: 20px;
}

.list {
    margin: 0 auto;

    &:hover {
        box-shadow: var(--el-box-shadow-light);
    }
}

.chart {
    width: 800px;
    height: 600px;
    margin: 6em auto;

    &:hover {
        box-shadow: var(--el-box-shadow-light);
    }
}
</style>
