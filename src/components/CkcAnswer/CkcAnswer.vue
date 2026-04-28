<template>
  <div v-for="meassageGroupView in currentMeassageViewInfo" >
    <div><button @click="toggleFold(meassageGroupView)">group折叠</button></div>
    <template v-if="meassageGroupView.isExpanded">  
      <div v-for="message in meassageGroupView.messageGroupInfo">
          <template v-if="message.thinkingIsExpanded">
            <CkcAnswerThinking 
              v-if="message.type === MessageType.THINKING" 
              :message="message.content"
              :renderCustomId="prop.renderCustomId" 
              :customHtmlTags="prop.customHtmlTags" />
            <CkcAnswerToolUse 
              v-if="message.type === MessageType.TOOL_USE" 
              :message="message.content" />
            <CkcAnswerContent 
              v-if="message.type === MessageType.ANSWER" 
              :message="message.content"
              :renderCustomId="prop.renderCustomId" 
              :customHtmlTags="prop.customHtmlTags" />
          </template>
        </div>
      </template>
      <hr />
    </div>
  </template>

<script setup lang="ts">
import { watch } from 'vue';
import type { CkcAnswerProps } from '../types/ckc-answer-props';
import { MessageType, type MessageViewInfo } from '../types/message';
import { useMessageView } from '../composables/useMessageView';
import CkcAnswerThinking from './CkcAnswerThinking.vue';
import CkcAnswerToolUse from './CkcAnswerToolUse.vue';
import CkcAnswerContent from './CkcAnswerContent.vue';
const prop = defineProps<CkcAnswerProps>();
const { currentMeassageViewInfo, handleData } = useMessageView();

const toggleFold = (messageGroupView: MessageViewInfo) => {
  const groupIndex = currentMeassageViewInfo.value.indexOf(messageGroupView);
  if (groupIndex < 0) {
    return;
  }

  const isLastGroup = groupIndex === currentMeassageViewInfo.value.length - 1;
  const nextGroupExpandState = !messageGroupView.isExpanded;
  const thinkingMessage = messageGroupView.messageGroupInfo.find(
      (item) => item.type === MessageType.THINKING
  );

  // 非最后一个历史组：切换组展开状态，并同步 thinking 消息的折叠状态
  if (!isLastGroup) {
    messageGroupView.isExpanded = nextGroupExpandState;
  }

  // 最后一个组：保留组状态，仅切换思考消息的展开状态
  if (thinkingMessage) {
    thinkingMessage.thinkingIsExpanded = isLastGroup
      ? !thinkingMessage.thinkingIsExpanded
      : nextGroupExpandState;
  }
}


watch(() => prop.messages.length, (val) => {
  if (val <= 0) {
    return;
  }
  handleData(prop.messages[val - 1]);
  // console.log('currentMeassageViewInfo', currentMeassageViewInfo.value)
});
</script>

<style lang="scss"></style>
