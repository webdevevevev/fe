<script setup>
import {isSignedIn} from './utils'
import {useStore} from 'vuex'

const store = useStore()

if (isSignedIn()) {
    store.dispatch('getNickname')
}
</script>

<template>
    <router-view></router-view>
</template>

<style scoped>
</style>
