<script setup lang="ts">
import { inject, ref, watch, type Ref, getCurrentInstance } from 'vue';
import JSON5 from 'json5';
import FileCard from './FileCard.vue';
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
watch(
    () => props.node.content as string,
    (content) => {
        if (!content) return;
        try {
            customDataArray.value = JSON5.parse(content)
            if (Array.isArray(customDataArray.value)) {
                customDataArray.value.forEach( cd => {
                    customDataInfos.value.push({customData: cd})
                })
            }

        } catch (error) {
            console.info('Failed to parse custom-data:', error)
        }
    },
    { immediate: true }
)
</script>

<template>
    <div >
        <template v-for="customDatainfo in customDataInfos">
            <component :is="customComponentMap[findCustomComponent(customDatainfo.customData)]" :meeting-data="customDatainfo.customData" :card-trace-id="traceId" :use-source="useSource"/>
        </template>  
    </div>
</template>
