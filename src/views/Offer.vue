<script setup lang="ts">
import {reactive} from 'vue'
import {Offer, State as OfferState} from '../entity/Offer'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {stateLabels, typeLabels} from '../labels'
import {Answer} from '../entity/Answer'
import {Select, CloseBold} from '@element-plus/icons-vue'

const props = defineProps({
    id: {
        type: [Number, String],
        required: true,
    },
})

const offer = reactive(new Offer())
;(offer as any).id = Number(props.id)
const answers = reactive<Answer[]>([])

async function init(offer: Offer, answers: Answer[]) {
    const o = await api.getOffer(offer.id)
    Object.assign(offer, o)
    const as = await Promise.all(o.answerIds.map(id => api.getAnswer(id)))
    answers.push(...as)
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
                    v-for="answer of answers"
                    :key="answer.id"
                    class="answer-preview"
                >
                    <el-card
                        shadow="hover"
                    >
                        <template #header>
                            <h4 class="card-title">{{ answer.user.nickname }}</h4>
                            <el-button-group size="small" @click.stop>
                                <el-tooltip content="接受">
                                    <el-button :icon="Select" @click=""/>
                                </el-tooltip>
                                <el-tooltip content="拒绝">
                                    <el-button
                                        class="reject-btn"
                                        @click=""
                                    >
                                        <el-icon color="red">
                                            <CloseBold/>
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </el-button-group>
                        </template>
                        <el-text :line-clamp="2" class="answer-desc">{{ answer.desc }}</el-text>
                        <template #footer>
                            <div class="card-footer">
                                {{ answer.ctime }}
                            </div>
                        </template>
                    </el-card>
                </li>
            </ul>
        </aside>
    </main>
</template>

<style scoped>
.main {
    display: flex;
    padding-left: 3em;
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
}

.time,
.card-footer {
    color: var(--el-text-color-regular);
}

.mtime {
    margin-left: 1em;
}

.article {
    flex: 1;
    height: calc(100vh - 2em - 3.2em - 2em);
    padding-right: 2em;
    overflow-y: auto;
}

.desc {
    margin-bottom: 1em;
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

:deep(.el-card__header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    padding-top: 1em;
    padding-bottom: 1em;

    background-color: var(--el-color-primary-dark-2);
    color: #fff;
}

.card-title {
    flex: 1;
    margin-right: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.reject-btn:hover {
    background-color: var(--el-color-danger-light-7);
    border-color: var(--el-color-danger-light-3);
}

.reject-btn:active {
    background-color: var(--el-color-danger-light-3);
    border-color: var(--el-color-danger);
}

.answer-desc {
    height: 3em;
}

:deep(.el-card__footer) {
    padding-top: 0;
    padding-bottom: .4em;
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
