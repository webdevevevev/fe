<script setup lang="ts">
import {ref} from 'vue'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
import {AxiosError} from 'axios'

defineProps<{
    province: number
    city: number
}>()

const emits = defineEmits<{
    (event: 'update:province', province: number): void
    (event: 'update:city', city: number): void
}>()

const store = useStore()

const loadingProvinces = ref(true)
const loadingCities = ref(false)

store.dispatch('getProvinces')
    .then(() => loadingProvinces.value = false)

async function onProvinceChange(province: number) {
    emits('update:province', province)
    emits('update:city', -1)
    if (province < 0) {
        return
    }
    loadingCities.value = true
    try {
        await store.dispatch('getCities', store.state.provinces[province].id)
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
    <el-select :model-value="province" @change="onProvinceChange">
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
        :model-value="city"
        filterable
        :loading="loadingCities"
        @change="$emit('update:city', $event)"
    >
        <el-option
            label="请选择城市"
            :value="-1"
        />
        <el-option
            v-if="province >= 0"
            v-for="(city, i) in store.state.provinces[province].cities"
            :key="city.id"
            :label="city.name"
            :value="i"
        />
    </el-select>
</template>

<style scoped>

</style>
