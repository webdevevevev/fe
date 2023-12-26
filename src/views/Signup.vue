<script setup lang="ts">
import {reactive, ref} from 'vue'
import * as api from '../api'
import {IDCardType, User} from '../entity/User'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
import {validate} from 'class-validator'
import {AxiosError} from 'axios'
import {useRouter} from 'vue-router'
import CitySelect from '../components/CitySelect.vue'

const router = useRouter()

const store = useStore<{
    user?: User
    provinces: { id: number, name: string, cities: { id: number, name: string }[] }[]
}>()

const user = reactive(new User())

const userProvinceIdx = ref(-1)
const userCityIdx = ref(-1)
const repetitionPwd = ref('')

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
</script>

<template>
    <el-form class="form" :model="user" label-width="80px">
        <h2 class="header">注册</h2>
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
            <CitySelect
                v-model:province="userProvinceIdx"
                v-model:city="userCityIdx"
            />
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
