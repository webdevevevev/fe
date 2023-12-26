<script setup lang="ts">
import {User} from '../entity/User'
import type {User as UserEntity} from '../entity/User'
import {reactive} from 'vue'
import * as api from '../api'

const IDCardTypeLabels = [
    '中华人民共和国居民身份证',
]

interface User extends UserEntity {
    ctime: Date
    city?: string
    province?: string
}

const user = reactive<User>(new User())

async function loadData() {
    const profile = await api.profile()
    Object.assign(user, profile)
    user.mtime = new Date(user.mtime)
    user.ctime = new Date(user.ctime)
    const provinceName = await api.getCityName(user.provinceId, user.provinceId)
    const cityName = await api.getCityName(user.provinceId, user.cityId)
    Object.assign(user, {
        province: provinceName,
        city: cityName,
    })
}

loadData()

function fmtNum(n: number) {
    return n.toString().padStart(2, '0')
}

function fmtDate(date: Date) {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const h = date.getHours()
    const mi = date.getMinutes()
    return `${y}年${m}月${d}日 ${fmtNum(h)}:${fmtNum(mi)}`
}
</script>

<template>
    <el-form class="form" v-model="user" label-width="5em">
        <el-form-item label="ID">{{ user.id }}</el-form-item>
        <el-form-item label="用户名">{{ user.nickname }}</el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="user.pwd"/>
        </el-form-item>
        <el-form-item label="用户类型">{{ user.isAdmin ? '系统管理员' : '普通用户' }}</el-form-item>
        <el-form-item label="姓名">{{ user.name }}</el-form-item>
        <el-form-item label="证件类型">{{ IDCardTypeLabels[user.IDCardType] }}</el-form-item>
        <el-form-item label="证件号码">{{ user.IDCardNo }}</el-form-item>
        <el-form-item label="手机号码">
            <el-input v-model="user.phone"/>
        </el-form-item>
        <el-form-item label="用户级别">{{ user.isVIP ? 'VIP' : '一般' }}</el-form-item>
        <el-form-item label="用户简介">
            <el-input v-model="user.intro" type="textarea"/>
        </el-form-item>
        <el-form-item label="注册城市">{{ user.province }} {{ user.city }}</el-form-item>
        <el-form-item label="注册时间" v-if="user.ctime">{{ fmtDate(user.ctime) }}</el-form-item>
        <el-form-item label="修改时间" v-if="user.mtime">{{ fmtDate(user.mtime) }}</el-form-item>
        <el-form-item>
            <el-button type="primary">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.form {
    width: 60%;
    min-width: 400px;
    margin: 0 auto;
}
</style>
