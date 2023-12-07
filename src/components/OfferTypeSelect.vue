<script setup>
const typeLabels = [
    '钓鱼',
    '老少皆宜休闲',
    '农家院',
    '温泉度假',
    '僻静休闲',
    '游乐场',
    '其他',
]

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})
</script>

<template>
    <el-select
        v-model="value"
    >
        <el-option
            v-for="(label, i) in typeLabels"
            :key="label"
            :label="label"
            :value="i"
        />
    </el-select>
</template>

<style scoped>
</style>
