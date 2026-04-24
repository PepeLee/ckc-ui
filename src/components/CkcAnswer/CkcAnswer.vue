<template>
  <div>
    <MarkdownRender 
      :content="messageString" 
      :custom-html-tags="prop.customHtmlTags" 
      :loading="true"
      :custom-id="prop.renderCustomId" />
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import type { CkcAnswerProps } from '../types/ckc-answer-props';
  import { MarkdownRender } from 'markstream-vue';
  // import type { Message } from '../types/message';
  const prop = defineProps<CkcAnswerProps>();

  const messageString = computed(() => {
    const content = prop.messages.map(m => m.content).join('');
    return content;
  });
  // const currentMeassageViewInfo = [
  //   {
  //     isExpand: false,
  //     massageGroupInfo: [
  //     ]
  //   }
  // ]
  // const handleData = (message :Message) => {
  //   currentMeassageViewInfo[currentMeassageViewInfo.length - 1].massageGroupInfo;
    
  // }
  watch(() => prop.messages.length, (val) => {
    console.log('prop.messages.length:', val);
  }, { immediate: true });
</script>

<style lang="scss">

</style>
