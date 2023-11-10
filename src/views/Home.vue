<script setup lang="ts">
import {useStore} from 'vuex'

const store = useStore()

const pageSize = 20

function onPageChange(pageNo: number) {
    const begin = (pageNo - 1) * pageSize
    const end = pageNo * pageSize
    // todo fetch data
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
        router
        default-active="offer"
    >
        <el-menu-item index="offer">寻去处</el-menu-item>
        <el-menu-item index="answer">欢迎来</el-menu-item>
    </el-menu>
    <router-view></router-view>
    <el-pagination
        class="pagination"
        @current-change="onPageChange"
        layout="prev, pager, next"
        :default-page-size="pageSize"
        :total="1000"
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

.pagination {
    justify-content: center;
}
</style>
