<template>
  <div v-for="meassageGroupView in currentMeassageViewInfo" >
    <div><button @click="toggleFold(meassageGroupView)">折叠</button></div>
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
  import { watch } from 'vue';
  import type { CkcAnswerProps } from '../types/ckc-answer-props';
  import { MarkdownRender } from 'markstream-vue';
  import { type MessageViewInfo } from '../types/message';
  import { useMessageView } from '../composables/useMessageView';
  const prop = defineProps<CkcAnswerProps>();
  const { currentMeassageViewInfo, handleData } = useMessageView();

  const toggleFold = (messageGroupView: MessageViewInfo) => {
    messageGroupView.isExpanded = !messageGroupView.isExpanded;
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
