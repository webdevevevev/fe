<script setup lang="ts">
import {reactive} from 'vue'
import {Offer, State as OfferState} from '../entity/Offer'
import * as api from '../api'
import {ElMessage} from 'element-plus'
import {stateLabels, typeLabels} from '../labels'

const props = defineProps({
    id: {
        type: [Number, String],
        required: true,
    },
})

const offer = reactive(new Offer())
api.getOffer(Number(props.id))
    .then(o => Object.assign(offer, o))
    .catch(e => {
        ElMessage.error({
            showClose: true,
            message: e.message,
        })
        console.error(e)
    })
</script>

<template>
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
    <main class="main">
        <div class="time">
            <span class="ctime">发布于{{ offer.ctime }}</span>
            <span class="mtime">修改于{{ offer.mtime }}</span>
            <p class="expire">过期于{{ offer.expire }}</p>
        </div>
        <article class="article">
            <p class="desc">{{ offer.desc }}</p>
            <p
                v-for="file in offer.files"
                :key="file"
            >
                {{ file }}
            </p>
        </article>
    </main>
</template>

<style scoped>
.header,
.main {
    max-width: 1280px;
    margin: 0 auto;
}

.header {
    display: flex;
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
    margin-top: 1.5em;
}

.desc {
    margin-bottom: 1em;
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
