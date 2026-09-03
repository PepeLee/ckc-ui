<script setup lang="ts">
import { computed, inject, ref, watch, type Ref, getCurrentInstance } from 'vue';
import FileCard from './FileCard.vue';
import { parseCustomDataJson } from '../utils/parseCustomData';
import WikiInfo from './WikiInfo.vue';
import WikiLink from './WikiLink.vue';
import MeetingCard from './MeetingCard.vue';
import ScheduleCard from './ScheduleCard.vue';
type ComponentKey = 'schedule' | 'meeting' | 'fileinfo' | 'wikiinfo' | 'wikilink'
const customDataArray = ref<any>([]);
const customDataInfos = ref<any[]>([])

// 注入 traceId
const traceId = inject<Ref<string>>('traceId', ref(''));
const instance = getCurrentInstance()
const useSource = (instance?.type as any).useSource || 'pc'

const customComponentMap: Record<ComponentKey, any> = {
    schedule: ScheduleCard,
    meeting: MeetingCard,
    fileinfo: FileCard,
    wikiinfo: WikiInfo,
    wikilink: WikiLink,
}

const props = defineProps<{
  node: {
    type: string
    content?: string
    loading?: boolean
  }
  customId?: string
  isDark?: boolean
}>()


const findCustomComponent = (data: any) => {
    if (!data || !data.type) {
        return 'schedule'
    }
    if (data.type === 'schedule') {
        return 'schedule'
    } 
    if (data.type === 'meeting') {
        return 'meeting'
    }
    if (data.type === 'fileinfo') {
        return 'fileinfo'
    }
    if (data.type === 'wikiinfo') {
        return 'wikiinfo'
    }
    if (data.type === 'wikilink') {
        return 'wikilink'
    }
    return 'schedule'
}

const isWikiArray = computed(() =>
    customDataInfos.value.length > 0
    && customDataInfos.value.every(item => findCustomComponent(item.customData) === 'wikiinfo')
)

watch(
    () => props.node.content as string,
    (content) => {
        if (!content) return
        const parsed = parseCustomDataJson(content)
        if (!Array.isArray(parsed)) return
        customDataArray.value = parsed
        customDataInfos.value = parsed.map(cd => ({ customData: cd }))
    },
    { immediate: true }
)
</script>

<template>
    <div
        v-if="isWikiArray"
        class="ckc-ui-custom-data-array ckc-ui-custom-data-array--wiki"
    >
        <component
            v-for="(customDatainfo, index) in customDataInfos"
            :key="index"
            :is="customComponentMap.wikiinfo"
            :meeting-data="customDatainfo.customData"
            :card-trace-id="traceId"
            :use-source="useSource"
        />
    </div>
    <div v-else class="ckc-ui-custom-data-array">
        <component
            v-for="(customDatainfo, index) in customDataInfos"
            :key="index"
            :is="customComponentMap[findCustomComponent(customDatainfo.customData)]"
            :meeting-data="customDatainfo.customData"
            :card-trace-id="traceId"
            :use-source="useSource"
        />
    </div>
</template>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-custom-data-array--wiki {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
