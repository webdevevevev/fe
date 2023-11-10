<script setup lang="ts">
import {useStore} from 'vuex'

const store = useStore()

/*function getSignPayload(): Readonly<{
    id: number
    admin: boolean
    iat: number
    exp: number
}> {
    const sign = localStorage.getItem('sign')!
    const signPayloadA = sign.split('.', 2)[1]
    const json = atob(signPayloadA)
    return JSON.parse(json)
}*/
</script>

<template>
    home {{ store.state.nickname }}
</template>

<style scoped>

</style>
