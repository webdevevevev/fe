<script setup lang="ts">
import {answerStateLabels, offerStateLabels, typeLabels} from '../labels'
import {Offer, State as OfferState} from '../entity/Offer'
import {Answer, State as AnswerState} from '../entity/Answer'
import {computed, reactive, ref} from 'vue'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {AxiosError} from 'axios'
import {useStore} from 'vuex'
import {CloseBold, Select} from '@element-plus/icons-vue'
import {User} from '../entity/User'

const props = defineProps<{
    base: Offer | Answer
}>()

const emits = defineEmits<{
    (event: 'publish', answer: Answer): void
}>()

const store = useStore()

const stateLabels = props.base instanceof Offer
    ? offerStateLabels
    : answerStateLabels

const State = props.base instanceof Offer
    ? OfferState
    : AnswerState

const btnDisabled = computed(() => props.base.state === AnswerState.accepted)

const isOwn = computed(() => props.base.user?.id === store.getters.userId)

const dialogVisible = ref(false)
let dialogAnswer = reactive(
    props.base instanceof Offer
        ? newAnswer()
        : props.base,
)
const publishDisabled = computed(() => {
    return isOwn.value || props.base.state !== State.pending
})

function newAnswer() {
    const answer: Record<string, any> = new Answer()
    answer.userId = store.getters.userId
    answer.user.id = answer.userId
    answer.offerId = props.base.id
    answer.offer = new Offer()
    answer.offer.id = answer.offerId
    return answer as Answer
}

function submitDialog() {
    return isOwn
        ? updateAnswer(props.base as Answer)
        : publishAnswer()
}

function updateAnswer(answer: Answer) {
    dialogVisible.value = false

    try {
        return api.updateAnswer(answer)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    }
}

async function publishAnswer() {
    dialogVisible.value = false

    let id: number
    try {
        id = await api.publishAnswer(dialogAnswer)
    } catch (e) {
        ElMessage.error({
            showClose: true,
            message: (e as AxiosError).message,
        })
        return console.error(e)
    }
    const answer: Record<string, any> = dialogAnswer
    dialogAnswer = reactive(newAnswer())
    answer.id = id
    answer.user = new User()
    answer.user.nickname = store.state.nickname
    emits('publish', answer as Answer)
}

async function onAccept() {
    const answer = props.base as Answer
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
}

async function onReject() {
    const answer = props.base
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
}
</script>

<template>
    <article>
        <header class="header">
            <h2 class="title">{{ base?.title }}</h2>
            <div class="spans">
                <el-tooltip
                    v-if="isFinite(base.type)"
                    :content="`类型：${typeLabels[base.type]}`"
                >
                    {{ typeLabels[base.type] }}
                </el-tooltip>
                <el-tooltip :content="`状态：${stateLabels[base.state]}`">
                    <span
                        class="state"
                        :class="State[base.state]"
                    >
                        {{ stateLabels[base.state] }}
                    </span>
                </el-tooltip>
                <span class="price">{{ base?.price }}元</span>
            </div>
            <el-button
                v-if="base instanceof Offer"
                type="primary"
                class="action-btn"
                :disabled="publishDisabled"
                @click="dialogVisible = true"
            >
                发布响应
            </el-button>
            <el-button
                v-else-if="isOwn"
                type="primary"
                class="action-btn"
                @click="dialogVisible = true"
            >
                修改响应
            </el-button>
            <el-button-group
                v-else
                size="small"
                @click.stop
                class="action-btn"
            >
                <el-tooltip content="接受">
                    <el-button
                        :icon="Select"
                        @click="onAccept"
                        :disabled="btnDisabled"
                    />
                </el-tooltip>
                <el-tooltip content="拒绝">
                    <el-button
                        class="reject-btn"
                        @click="onReject"
                        :disabled="btnDisabled"
                    >
                        <el-icon color="red">
                            <CloseBold/>
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </el-button-group>
        </header>
        <div class="time">
            <span class="ctime">发布于{{ base.ctime }}</span>
            <span class="mtime">修改于{{ base.mtime }}</span>
            <p class="expire">过期于{{ base?.expire }}</p>
        </div>
        <p class="desc">{{ base.desc }}</p>
        <p
            v-for="file in base.files"
            :key="file"
        >
            <el-image v-if="/\.(?:(?:pn|jpe?)g|webp)$/.test(file)" :src="file" :alt="file"/>
            <video v-else-if="/\.(?:webm|mp4)$/.test(file)" :src="file" controls/>
            <span v-else>{{ file }}</span>
        </p>
        <el-dialog
            v-model="dialogVisible"
            :title="`${isOwn ? '修改' : '发布'}响应`"
        >
            <el-form
                :model="dialogAnswer"
                class="publish-form"
                label-width="80px"
            >
                <el-form-item label="描述">
                    <el-input
                        v-model="dialogAnswer.desc"
                        type="textarea"
                        autocomplete="off"
                    />
                </el-form-item>
                <el-form-item label="文件列表">
                    <el-upload
                        v-model:file-list="dialogAnswer.files"
                        class="upload"
                        :auto-upload="false"
                        multiple
                    >
                        <template #trigger>
                            <el-button type="primary">选择文件</el-button>
                        </template>

                        <template #tip>
                            <div class="el-upload__tip">
                                支持上传图片和视频
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitDialog">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </article>
</template>

<style scoped>
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

.action-btn {
    margin-left: 3em;
}

.time {
    margin-top: 1em;
    color: var(--el-text-color-regular);
}

.mtime {
    margin-left: 1em;
}

.desc {
    margin-bottom: 1em;
}

.state {
    padding: .4em;
    border-radius: var(--el-border-radius-base);
    color: #fff;
}

.upload {
    width: 100%;
}
</style>
