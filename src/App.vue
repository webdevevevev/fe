<script setup>
import {useStore} from 'vuex'
import {ArrowDown, Avatar} from '@element-plus/icons-vue'

const store = useStore()
const sign = store.state.sign

if (store.state.sign) {
    store.dispatch('getNickname')
}
</script>

<template>
    <nav class="nav">
        <h1 class="title">
            <router-link to="/">
                <span>好去处</span>
            </router-link>
        </h1>
        <el-dropdown
            class="dropdown"
            trigger="click"
            v-if="store.state.sign"
        >
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
                        <router-link to="/profile">
                            账号设置
                        </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item divided>
                        <router-link
                            to="/welcome"
                            @click="store.commit('removeSign')"
                        >
                            退出
                        </router-link>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <span v-else>
            <router-link to="/signin">登录</router-link>
            |
            <router-link to="/signup">注册</router-link>
        </span>
    </nav>

    <router-view/>
</template>

<style scoped>
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1em;
}

.title a {
    display: inline-block;
    height: 2em;
    color: unset;
    font-weight: unset;
    background: url("../public/logoc.png") center / cover no-repeat;
}

.title span {
    opacity: 0;
}

.dropdown {
    cursor: pointer;
}

.dropdown-menu a {
    width: 100%;
    color: unset;
}

.avatar-icon {
    margin-left: 1em;
    padding: .5em;
    border-radius: .2em .5em;
    background-color: #ddd;
    color: #333;
}
</style>
