<script setup lang="ts">
import {reactive} from 'vue'
import * as api from '../api'
import {User} from '../entity/User'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'

const store = useStore()

const form = reactive({
    name: '',
    pwd: '',
})

async function onSubmit() {
    let userOrMsg: User | string
    try {
        userOrMsg = await api.signin(form.name, form.pwd)
    } catch (e: any) {
        ElMessage.error({
            showClose: true,
            message: e,
        })
        return console.error(e)
    }
    if (userOrMsg instanceof User) {
        store.commit('signin', userOrMsg)
    } else {
        ElMessage.error({
            showClose: true,
            message: userOrMsg,
        })
    }
}
</script>

<template>
    <h2>登录</h2>
    <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="密码">
            <el-input
                v-model="form.pwd"
                type="password"
                show-password
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
        <el-form-item>
            <router-link to="/signup" class="link">没有账号？点此注册</router-link>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.link {
    color: #666;
    text-decoration: underline;
}
</style>
