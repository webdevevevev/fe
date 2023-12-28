<script setup lang="ts">
import {reactive} from 'vue'
import * as api from '../api'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

const store = useStore()
const router = useRouter()

const form = reactive({
    name: '',
    pwd: '',
})

async function onSubmit() {
    let signOrMsg: { sign: string, nickname: string } | string
    try {
        signOrMsg = await api.signin(form.name, form.pwd)
    } catch {
        ElMessage.error({
            showClose: true,
            message: '密码错误',
        })
        return
    }
    if (typeof signOrMsg === 'object') {
        const {sign} = signOrMsg
        store.commit('signin', {nickname: form.name, sign})
        localStorage.setItem('sign', sign)
        store.dispatch('getNickname')

        const href = store.getters.isAdmin ? '/admin' : '/'
        router.push(href)
    } else {
        ElMessage.error({
            showClose: true,
            message: signOrMsg,
        })
    }
}
</script>

<template>
    <el-form class="form" :model="form" label-width="80px">
        <h2 class="header">登录</h2>
        <el-form-item label="用户名">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="密码">
            <el-input
                v-model="form.pwd"
                type="password"
                show-password
                @keydown.enter="onSubmit"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
        <el-form-item>
            <router-link to="signup" class="link">没有账号？点此注册</router-link>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.form {
    max-width: 600px;
    margin: 0 auto;
}

.header {
    margin: 2em 0;
}

.link {
    color: #666;
    text-decoration: underline;
}
</style>
