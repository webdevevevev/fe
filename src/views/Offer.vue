<script setup lang="ts">
import {reactive} from 'vue'
import {Offer, State as OfferState} from '../entity/Offer'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {stateLabels, typeLabels} from '../labels'
import {Answer} from '../entity/Answer'

const props = defineProps({
    id: {
        type: [Number, String],
        required: true,
    },
})

const offer = reactive(new Offer())
;(offer as any).id = Number(props.id)
const answers = reactive<Answer[]>([])

function init(offer: Offer, answers: Answer[]) {
    return api.getOffer(offer.id)
        .then(o => {
            Object.assign(offer, o)
            return Promise.all(o.answerIds.map(id => api.getAnswer(id)))
        })
        .then(as => answers.push(...as))
}

init(offer, answers).catch(e => {
    ElMessage.error({
        showClose: true,
        message: e.message,
    })
    console.error(e)
})
</script>

<template>
    <main class="main">
        <article class="article">
            <header class="header">
                <h2 class="title">{{ offer.title }}</h2>
                <div class="spans">
                    <el-tooltip :content="`类型：${typeLabels[offer.type]}`">
                        {{ typeLabels[offer.type] }}
                    </el-tooltip>
                    <el-tooltip :content="`状态：${stateLabels[offer.state]}`">
                <span
                    class="state"
                    :class="OfferState[offer.state]"
                >
                    {{ stateLabels[offer.state] }}
                </span>
                    </el-tooltip>
                    <span class="price">{{ offer.price }}元</span>
                </div>
            </header>
            <div class="time">
                <span class="ctime">发布于{{ offer.ctime }}</span>
                <span class="mtime">修改于{{ offer.mtime }}</span>
                <p class="expire">过期于{{ offer.expire }}</p>
            </div>
            <p class="desc">{{ offer.desc }}</p>
            <p
                v-for="file in offer.files"
                :key="file"
            >
                {{ file }}
            </p>
        </article>
        <aside class="aside">
            <h3 class="aside-header">欢迎来列表</h3>
            <ul class="list">
                <li
                    v-for="(answer, i) of answers"
                    :key="answer.id"
                >
                    <el-card
                        shadow="hover"
                        header="nickname"
                    >
                        <el-text :line-clamp="2" class="desc">{{ answer.desc }}</el-text>
                    </el-card>
                </li>
            </ul>
        </aside>
    </main>
</template>

<style scoped>
.main {
    display: flex;
    gap: 2em;
    padding: 0 3em;
}

.header {
    display: flex;
    height: 2em;
}

.title {
    flex: 1;
}

.spans {
    display: flex;
    align-items: center;
    gap: 1em;
}

.state {
    padding: .4em;
    border-radius: var(--el-border-radius-base);
    color: #fff;
}

.time {
    margin-top: 1em;
    color: var(--el-text-color-regular);
}

.mtime {
    margin-left: 1em;
}

.article {
    flex: 1;
}

.desc {
    margin-bottom: 1em;
}

.aside {
    width: 300px;
}

.aside-header {
    height: 2em;
}

.list {
    margin-top: 1em;
}

.fulfilled {
    background-color: var(--el-color-success);
}

.pending {
    background-color: var(--el-color-primary);
}

.canceled {
    background-color: var(--el-color-warning);
}

.expired {
    background-color: var(--el-color-info);
}
</style>
