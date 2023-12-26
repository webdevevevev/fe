<script setup lang="ts">
import {Delete, Edit, Select, CloseBold} from '@element-plus/icons-vue'
import {Answer, State as AnswerState} from '../entity/Answer'
import {Offer} from '../entity/Offer'
import {useRouter} from 'vue-router'
import {computed} from 'vue'
import {useStore} from 'vuex'

const props = defineProps<{
    base: Offer | Answer
}>()

const emits = defineEmits<{
    (event: 'edit-offer', offer: Offer): void
    (event: 'delete-offer', offer: Offer): void
    (event: 'accept', answer: Answer): void
    (event: 'reject', answer: Answer): void
    (event: 'cancel', answer: Answer): void
}>()

const store = useStore()

const isOwn = computed(() => props.base.user?.id === store.getters.userId)

const router = useRouter()

const href = `/${props.base instanceof Offer ? 'offer' : 'answer'}/${props.base.id}`

const title = computed(() => props.base instanceof Offer
    ? props.base.title
    : props.base.user.nickname)
</script>

<template>
    <el-card
        @click="router.push(href)"
    >
        <template #header>
            <h4 class="card-title">{{ title }}</h4>
            <el-button-group
                size="small"
                @click.stop
            >
                <template v-if="base instanceof Offer">
                    <el-tooltip content="删除">
                        <el-button
                            class="delete-btn"
                            @click="emits('delete-offer', base)"
                        >
                            <el-icon color="red">
                                <Delete/>
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑">
                        <el-button :icon="Edit" @click="emits('edit-offer', base)"/>
                    </el-tooltip>
                </template>
                <template v-else-if="isOwn">
                    <el-tooltip content="取消">
                        <el-button
                            class="reject-btn"
                            @click="emits('cancel', base)"
                            :disabled="base.state !== AnswerState.pending"
                        >
                            <el-icon color="red">
                                <CloseBold/>
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </template>
                <template v-else>
                    <el-tooltip content="接受">
                        <el-button
                            :icon="Select"
                            @click="emits('accept', base)"
                            :disabled="base.state !== AnswerState.pending"
                        />
                    </el-tooltip>
                    <el-tooltip content="拒绝">
                        <el-button
                            class="reject-btn"
                            @click="emits('reject', base)"
                            :disabled="base.state !== AnswerState.pending"
                        >
                            <el-icon color="red">
                                <CloseBold/>
                            </el-icon>
                        </el-button>
                    </el-tooltip>
                </template>
            </el-button-group>
        </template>
        <el-text :line-clamp="2" class="desc">{{ base.desc }}</el-text>
        <template #footer>
            <slot name="footer"/>
        </template>
    </el-card>
</template>

<style scoped>
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

.desc {
    height: 3em;
}

:deep(.el-card__footer) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: .4em;
    padding-bottom: .4em;
    color: var(--el-text-color-regular);
}

.card-title {
    flex: 1;
    margin-right: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-btn:hover {
    background-color: var(--el-color-danger-light-7);
    border-color: var(--el-color-danger-light-3);
}

.delete-btn:active {
    background-color: var(--el-color-danger-light-3);
    border-color: var(--el-color-danger);
}
</style>
