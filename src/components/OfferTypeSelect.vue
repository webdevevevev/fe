<script setup>
import {typeLabels} from '../labels'
import {computed} from 'vue'

const props = defineProps({
    modelValue: {
        type: Number,
    },
    prependLabel: {
        type: String,
    },
    prependValue: {
        type: Number,
        default: -1,
    },
})
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
    <el-select v-model="value">
        <el-option
            v-if="typeof prependLabel === 'string'"
            :label="prependLabel"
            :value="prependValue"
        />
        <el-option
            v-for="(label, i) in typeLabels"
            :key="label"
            :label="label"
            :value="i"
        />
    </el-select>
</template>
