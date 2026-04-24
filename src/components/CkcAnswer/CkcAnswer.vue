<template>
  <div v-for="meassageGroupView in currentMeassageViewInfo" >
    <template v-if="meassageGroupView.isExpanded">  
      <div v-for="message in meassageGroupView.messageGroupInfo">
        <MarkdownRender 
          :content= message.content 
          :custom-html-tags="prop.customHtmlTags" 
          :loading="true"
          :custom-id="prop.renderCustomId" />
      </div>
    </template>
    <hr />
  </div>
</template>

<script setup lang="ts">
  import { watch, ref } from 'vue';
  import type { CkcAnswerProps } from '../types/ckc-answer-props';
  import { MarkdownRender } from 'markstream-vue';
  import { MessageType, type Message, type MessageViewInfo } from '../types/message';
  const prop = defineProps<CkcAnswerProps>();

  const currentMeassageViewInfo = ref<MessageViewInfo[]>([
    {
      isExpanded: true,
      messageGroupInfo: [
      ]
    }
  ]);
  const handleData = (message: Message) => {
    // 安全保护，避免空消息导致异常
    if (!message) {
      return;
    }

    // 获取当前显示组的最后一项，如果不存在则创建默认组
    const lastMeassageViewInfo = currentMeassageViewInfo.value[currentMeassageViewInfo.value.length - 1];
    const lastItemMessageGroupInfo = lastMeassageViewInfo.messageGroupInfo;

    // 获取当前组中的最后一条消息，用于判断是否可合并
    const previousMessage = lastItemMessageGroupInfo[lastItemMessageGroupInfo.length - 1];

    // 如果当前组为空，则直接将新消息添加到当前组
    if (!previousMessage) {
      lastItemMessageGroupInfo.push({ ...message });
      return;
    }

    // 判断当前消息是否与上一条消息来源一致，可进行内容合并
    const isSameTrace = previousMessage.traceId === message.traceId;
    const isSameSession = previousMessage.sessionId === message.sessionId;
    const isSameType = previousMessage.type === message.type;

    // 只有在 trace/session/type 都一致时，才将内容追加到上一条消息中
    if (isSameTrace && isSameSession && isSameType) {
      previousMessage.content += message.content;
      return;
    }

    // THINKING 后紧跟 ANSWER 时，保持在同一个展开分组内展示
    if (
      lastItemMessageGroupInfo.length === 1 &&
      previousMessage.type === MessageType.THINKING &&
      message.type === MessageType.ANSWER
    ) {
      lastItemMessageGroupInfo.push({ ...message });
      return;
    }

    // 其他情况下，将当前分组折叠，并创建一个新的展开分组用于新消息
    lastMeassageViewInfo.isExpanded = false;
    currentMeassageViewInfo.value.push({
      isExpanded: true,
      messageGroupInfo: [{ ...message }]
    });
  }

  watch(() => prop.messages.length, (val) => {
    if (val <= 0) {
      return;
    }
    handleData(prop.messages[val - 1]);
    // console.log('currentMeassageViewInfo', currentMeassageViewInfo.value)
  });
</script>

<style lang="scss">

</style>
