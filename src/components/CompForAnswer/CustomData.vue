<script setup lang="ts">
import { inject, ref, watch, type Ref } from 'vue';
import JSON5 from 'json5';
import FileCard from './FileCard.vue';
import MeetingCard from './MeetingCard.vue';
import ScheduleCard from './ScheduleCard.vue';
type ComponentKey = 'schedule' | 'meeting' | 'fileinfo'
const customData = ref<any>({});
let customComponent:any = null
// 注入 traceId
const traceId = inject<Ref<string>>('traceId', ref(''));

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
        if (!content) return;
        try {
            if (!content.startsWith('{') || !content.endsWith('}')) {
                return
            }
            customData.value = JSON5.parse(content)
            const componentKey = findCustomComponent(customData.value)
            customComponent = customComponentMap[componentKey]
        } catch (error) {
            console.info('Failed to parse custom-data:', error)
        }
    },
    { immediate: true }
)
</script>

<template>
    <div v-if="customData.type">
        <component :is="customComponent" :meeting-data="customData" :card-trace-id="traceId"/>
    </div>
</template>
