<template>
  <div v-for="meassageGroupView in currentMeassageViewInfo" >
    <template v-if="meassageGroupView.isExpanded">  
      <div>{{ meassageGroupView.isExpanded }}</div>
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
  const handleData = (message :Message) => {
    // 取最后一条消息的 messageGroupInfo
    const lastMeassageViewInfo = currentMeassageViewInfo.value[currentMeassageViewInfo.value.length - 1];
    const lastItemMessageGroupInfo = lastMeassageViewInfo.messageGroupInfo;
    let messageComb = {
      type: message.type,
      traceId: message.traceId,
      sessionId: message.sessionId,
      content: message.content
    }
    // 如果 lastItemMessageGroupInfo 为空，则直接 push messageComb，
    // 否则比较 messageComb 和 lastItemMessageGroupInfo 中最后一项的 traceId、 sessionId、 type 是否相同，
    // 如果相同则合并 content，否则 push messageComb
    if (lastItemMessageGroupInfo.length === 0) {
      lastItemMessageGroupInfo.push(messageComb);
      return;
    } 
    messageComb = lastItemMessageGroupInfo[lastItemMessageGroupInfo.length - 1];
    if (messageComb.type === message.type) {
      messageComb.content += message.content;
      return;
    }
    if (lastItemMessageGroupInfo.length === 1) {
      if (messageComb.type === MessageType.THINKING && message.type === MessageType.ANSWER) {
        lastItemMessageGroupInfo.push(message);
        return;
      } else {
        lastMeassageViewInfo.isExpanded = false;
        currentMeassageViewInfo.value.push({
          isExpanded: true,
          messageGroupInfo: [message]
        });
        return;
      }
    }
    if (lastItemMessageGroupInfo.length === 2) {
      lastMeassageViewInfo.isExpanded = false;
      currentMeassageViewInfo.value.push({
        isExpanded: true,
        messageGroupInfo: [message]
      });
      return;
    }
  }
  watch(() => prop.messages.length, (val) => {
    handleData(prop.messages[val -1]);
    // console.log('currentMeassageViewInfo', currentMeassageViewInfo.value)
  });
</script>

<style lang="scss">

</style>
