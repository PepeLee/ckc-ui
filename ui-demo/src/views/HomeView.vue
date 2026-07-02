<template>
  <div class="about">
    <!-- useSource="mobile" -->
    <CkcAnswer 
      ref="ckcAnswerRef"
      :messages="messages"  
      :historyMessages="historyMessages"
      render-custom-id="docs" 
      :custom-html-tags="['custom-data']"
      @click-recomendation="recomendationAsk"
      @click-document="documentClick">
      <template #actions="actionsProps">
        <button @click="alterMessages(actionsProps)">清空消息</button>
      </template>
    </CkcAnswer>
    <button @click="stopChat()">清空消息</button>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import CkcAnswer from '../../../src/components/CkcAnswer/index.ts';
  import type { Message, Document } from '../../../src/components/types/message';
  import { message } from '../const/mock-data/message-anl';
  import { setCustomComponents } from 'markstream-vue';
  import CustomComp from '../components/customComp.vue';

  setCustomComponents('docs', {
    'custom-data': CustomComp,
  })
  const ckcAnswerRef = ref<InstanceType<typeof CkcAnswer> | null>(null)
  const messages = ref<Message[]>([]);
  const historyMessages = ref<Message[]>([]);
  function alterMessages(actionsProps: any) {
    console.log('actionsProps', actionsProps)
  }
  function stopChat() {
    ckcAnswerRef.value?.stopChat();
  }
  function recomendationAsk(message: string) {
    console.log('recomendationAsk', message)
  }
  function documentClick(message: Document) {
    console.log('documentClick', message)
  }
  onMounted(() => {
    let index = 0;
    const addMessage = () => {
      if (index < message.length) {
        messages.value.push(message[index] as Message);
        index++;
        setTimeout(addMessage, 20); // 每200毫秒添加一条消息，模拟流式返回
      }
    };
    addMessage();
  });
  // onMounted(() => {
  //   // messages.value = message as Message[];
  //   historyMessages.value = message as Message[];
  // });
</script>

<style>

</style>

