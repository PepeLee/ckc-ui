<script setup lang="ts">
import { inject, ref, watch, type Ref, getCurrentInstance } from 'vue';
import FileCard from './FileCard.vue';
import { parseCustomDataJson } from '../utils/parseCustomData';
import MeetingCard from './MeetingCard.vue';
import ScheduleCard from './ScheduleCard.vue';
type ComponentKey = 'schedule' | 'meeting' | 'fileinfo'
const customData = ref<any>({});
let customComponent:any = null
// 注入 traceId
const traceId = inject<Ref<string>>('traceId', ref(''));
const instance = getCurrentInstance()
const useSource = (instance?.type as any).useSource || 'pc'

const customComponentMap: Record<ComponentKey, any> = {
    schedule: ScheduleCard,
    meeting: MeetingCard,
    fileinfo: FileCard,
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
    return 'schedule'
}
watch(
    () => props.node.content as string,
    (content) => {
        if (!content) return
        const parsed = parseCustomDataJson(content)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return
        }
        customData.value = parsed
        const componentKey = findCustomComponent(customData.value)
        customComponent = customComponentMap[componentKey]
    },
    { immediate: true }
)
</script>

<template>
    <div v-if="customData.type">
        <component :is="customComponent" :meeting-data="customData" :card-trace-id="traceId" :use-source="useSource"/>
    </div>
</template>
