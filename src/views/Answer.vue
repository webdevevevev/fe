<script setup lang="ts">
import Post from '../components/Post.vue'
import {reactive} from 'vue'
import {Answer} from '../entity/Answer'
import * as api from '../api'
import {User} from '../entity/User'

const props = defineProps<{
    id: number | string
}>()
const answer = reactive(new Answer())
;(answer as any).id = Number(props.id)

async function init(answer: Answer) {
    const o: Record<string, any> = await api.getOffer(answer.id)
    o.user = new User()
    o.user.id = o.userId
    delete o.userId
    Object.assign(answer, o)
}

init(answer)
</script>

<template>
    <Post
        :base="answer"
        class="post"
    />
</template>

<style scoped>
.post {
    padding: 0 3em;
}
</style>
