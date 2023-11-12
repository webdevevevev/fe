<script setup lang="ts">
import {reactive, ref} from 'vue'
import * as api from '../api'
import {IDCardType, User} from '../entity/User'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
import {validate} from 'class-validator'
import {AxiosError} from 'axios'
import {useRouter} from 'vue-router'

const router = useRouter()

const store = useStore<{
    user?: User
    provinces: { id: number, name: string, cities: { id: number, name: string }[] }[]
}>()

const user = reactive(new User())

const userProvinceIdx = ref(-1)
const userCityIdx = ref(-1)
const repetitionPwd = ref('')
const loadingProvinces = ref(true)
const loadingCities = ref(false)

store.dispatch('getProvinces')
    .then(() => loadingProvinces.value = false)

async function signup() {
    const validationErrors = await validate(user)
    if (validationErrors.length) {
        for (const {constraints} of validationErrors) {
            if (constraints) {
                for (const message of Object.values(constraints)) {
                    ElMessage.error({
                        showClose: true,
                        message,
                    })
                }
            }
        }
        return console.error(validationErrors)
    }
    if (userProvinceIdx.value < 0) {
        ElMessage.error({
            showClose: true,
            message: '请选择省份',
        })
        return
    }
    if (userCityIdx.value < 0) {
        ElMessage.error({
            showClose: true,
            message: '请选择城市',
        })
        return
    }
    if (repetitionPwd.value !== user.pwd) {
        ElMessage.error({
            showClose: true,
            message: '密码不一致',
        })
        return
    }
    const province = store.state.provinces[userProvinceIdx.value]
    user.provinceId = province.id
    user.cityId = province.cities[userCityIdx.value].id

    let userOrMsg: User | string
    try {
        userOrMsg = await api.signup(user, false)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    }
    if (userOrMsg instanceof User) {
        store.commit('signin', userOrMsg)
        ElMessage.success({
            showClose: true,
            message: '注册成功',
        })
        router.push({name: 'signin'})
    } else {
        ElMessage.error({
            showClose: true,
            message: userOrMsg,
        })
    }
}

async function onProvinceChange() {
    userCityIdx.value = -1
    if (userProvinceIdx.value < 0) {
        return
    }
    loadingCities.value = true
    try {
        await store.dispatch('getCities', store.state.provinces[userProvinceIdx.value].id)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        console.error(e)
    } finally {
        loadingCities.value = false
    }
}
</script>

<template>
    <h2>注册</h2>
    <el-form :model="user" label-width="80px">
        <el-form-item label="用户名">
            <el-input v-model="user.nickname"/>
        </el-form-item>
        <el-form-item label="密码">
            <el-input
                v-model="user.pwd"
                type="password"
                show-password
            />
        </el-form-item>
        <el-form-item label="重复密码">
            <el-input
                v-model="repetitionPwd"
                type="password"
                show-password
            />
        </el-form-item>
        <el-form-item label="姓名">
            <el-input v-model="user.name"/>
        </el-form-item>
        <el-form-item label="证件类型">
            <el-select v-model="user.IDCardType">
                <el-option
                    label="中华人民共和国居民身份证"
                    :value="IDCardType.zhCN"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
            <el-input v-model="user.IDCardNo"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
            <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户简介">
            <el-input v-model="user.intro"></el-input>
        </el-form-item>
        <el-form-item label="注册城市">
            <el-select v-model="userProvinceIdx" @change="onProvinceChange">
                <el-option
                    label="请选择省份"
                    :value="-1"
                />
                <el-option
                    v-for="(province, i) in store.state.provinces"
                    :key="province.id"
                    :label="province.name"
                    :value="i"
                />
            </el-select>
            <el-select
                v-model="userCityIdx"
                filterable
                :loading="loadingCities"
            >
                <el-option
                    label="请选择城市"
                    :value="-1"
                />
                <el-option
                    v-if="userProvinceIdx >= 0"
                    v-for="(city, i) in store.state.provinces[userProvinceIdx].cities"
                    :key="city.id"
                    :label="city.name"
                    :value="i"
                />
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="signup">注册</el-button>
        </el-form-item>
        <el-form-item>
            <router-link to="/signin" class="link">已有账号？点此登录</router-link>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.link {
    color: #666;
    text-decoration: underline;
}
</style>
