<script setup lang="ts">
import {reactive} from 'vue'
import {Offer, State as OfferState} from '../entity/Offer'
import {State as AnswerState} from '../entity/Answer'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {Answer} from '../entity/Answer'
import {AxiosError} from 'axios'
import {User} from '../entity/User'
import Post from '../components/Post.vue'
import {useRouter} from 'vue-router'
import Card from '../components/Card.vue'
import {answerStateLabels} from '../labels'
import {useDateFormat} from '@vueuse/core'

const props = defineProps({
    id: {
        type: [Number, String],
        required: true,
    },
})

const router = useRouter()

const offer = reactive(new Offer())
;(offer as any).id = Number(props.id)
const answers = reactive<Answer[]>([])

async function init(offer: Offer, answers: Answer[]) {
    const o: Record<string, any> = await api.getOffer(offer.id)
    o.user = new User()
    o.user.id = o.userId
    delete o.userId
    Object.assign(offer, o)
    const as = await Promise.all(offer.answerIds.map(id => api.getAnswer(id)))
    answers.push(...as.filter(isShowing))
    for (const answer of answers) {
        api.getPublicProfile(answer.user.id)
            .then(profile => {
                answer.user = profile
            })
    }
}

init(offer, answers).catch(e => {
    ElMessage.error({
        showClose: true,
        message: e.message,
    })
    console.error(e)
})

function isShowing({state}: Answer) {
    return state === AnswerState.pending || state === AnswerState.accepted
}

function publishAnswer(answer: Answer) {
    answers.push(answer)
}

async function onAccept(i: number) {
    const answer = answers[i]
    try {
        await api.accept(answer.id)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        console.error(e)
    }
    answer.state = AnswerState.accepted
    offer.state = OfferState.fulfilled
}

async function onReject(i: number) {
    const answer = answers[i]
    try {
        await api.reject(answer.id)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        console.error(e)
    }
    answer.state = AnswerState.rejected
    answers.splice(i, 1)
}
</script>

<template>
    <main class="main">
        <Post
            :base="offer"
            @publish="publishAnswer"
            class="article"
        />
        <aside class="aside">
            <h3 class="aside-header">欢迎来列表</h3>
            <ul v-if="answers.length" class="list">
                <li
                    v-for="(answer, i) of answers"
                    :key="answer.id"
                    class="answer-preview"
                >
                    <Card
                        :base="answer"
                        @accept="onAccept(i)"
                        @reject="onReject(i)"
                        shadow="hover"
                    >
                        <template #footer>
                            <span>
                                {{ useDateFormat(answer.ctime, 'YYYY-MM-DD HH:mm').value }}
                            </span>
                            <el-tooltip :content="`状态：${answerStateLabels[answer.state]}`">
                                <span
                                    class="state"
                                    :class="AnswerState[answer.state]"
                                >
                                    {{ answerStateLabels[answer.state] }}
                                </span>
                            </el-tooltip>
                        </template>
                    </Card>
                </li>
            </ul>
            <el-empty
                v-else
                description="列表为空"
                :image-size="100"
            />
        </aside>
    </main>
</template>

<style scoped>
.main {
    display: flex;
}

.article {
    flex: 1;
    height: calc(100vh - 2em - 3.2em - 2em);
    overflow-y: auto;
    padding: 0 2em 0 3em;
}

.aside {
    width: 300px;
    padding: 0 1em;
}

.aside-header {
    height: 2em;
}

.list {
    height: calc(100vh - 2em - 3.2em - 2em - 1em - 1em);
    overflow-x: hidden;
    overflow-y: auto;
}

.answer-preview {
    margin-top: 1em;
    cursor: pointer;
}

.answer-preview:hover {
    transform: scale(1.02);
    transition: transform .2s;
}

.state {
    padding: .4em;
    border-radius: var(--el-border-radius-base);
    color: #fff;
}
</style>
