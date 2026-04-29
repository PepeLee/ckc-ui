<template>
  <template v-for="(meassageGroupView, index) in currentMeassageViewInfo" :key="index">
    <div  v-if="meassageGroupView.messageGroupInfo.length > 0">
      <CkcAnswerThinkingHead 
        :meassageGroupView="meassageGroupView" 
        :currentMeassageViewInfo="currentMeassageViewInfo" />
      <div v-show="meassageGroupView.isExpanded">  
        <div v-for="message in meassageGroupView.messageGroupInfo">
            <div v-show="message.thinkingIsExpanded">
              <CkcAnswerThinking 
                v-if="message.type === MessageType.THINKING" 
                :message="message.content"
                :renderCustomId="prop.renderCustomId" 
                :customHtmlTags="prop.customHtmlTags" />
              <CkcAnswerToolUse 
                v-if="message.type === MessageType.TOOL_USE" 
                :message="message.content" />
              <CkcAnswerToolUseSilent
                v-if="message.type === MessageType.TOOL_USE_SILENT"
                :message="message.content" />
              <CkcAnswerContent 
                v-if="message.type === MessageType.ANSWER" 
                :message="message.content"
                :renderCustomId="prop.renderCustomId" 
                :customHtmlTags="prop.customHtmlTags" />
            </div>
          </div>
        </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import type { CkcAnswerProps } from '../types/ckc-answer-props';
import { MessageType } from '../types/message';
import { useMessageView } from '../composables/useMessageView';
import CkcAnswerThinking from './CkcAnswerThinking.vue';
import CkcAnswerToolUse from './CkcAnswerToolUse.vue';
import CkcAnswerToolUseSilent from './CkcAnswerToolUseSilent.vue';
import CkcAnswerContent from './CkcAnswerContent.vue';
import CkcAnswerThinkingHead from './CkcAnswerThinkingHead.vue';
const prop = defineProps<CkcAnswerProps>();
const { currentMeassageViewInfo, handleData } = useMessageView();


watch(() => prop.messages.length, (val) => {
  if (val <= 0) {
    return;
  }
  handleData(prop.messages[val - 1]);
  console.log('currentMeassageViewInfo', currentMeassageViewInfo.value)
});
</script>

<style lang="scss">

</style>
