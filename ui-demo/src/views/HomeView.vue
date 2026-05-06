<template>
  <div class="about">
    <CkcAnswer 
      :messages="messages"  
      render-custom-id="docs" 
      :custom-html-tags="['custom-data']"
      @click-recomendation="recomendationAsk">
      <template #actions="actionsProps">
        <button @click="alterMessages(actionsProps)">清空消息</button>
      </template>
    </CkcAnswer>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import CkcAnswer from '../../../src/components/CkcAnswer/index.ts';
  import type { Message } from '../../../src/components/types/message';
  import { message } from '../const/mock-data/message8';
  import { setCustomComponents } from 'markstream-vue';
  import CustomComp from '../components/customComp.vue';

  setCustomComponents('docs', {
    'custom-data': CustomComp,
  })
  const messages = ref<Message[]>([]);
  function alterMessages(actionsProps: any) {
    console.log('actionsProps', actionsProps)
  }
  function recomendationAsk(message: string) {
    console.log('recomendationAsk', message)
  }
  onMounted(() => {
    let index = 0;
    const addMessage = () => {
      if (index < message.length) {
        messages.value.push(message[index] as Message);
        index++;
        setTimeout(addMessage, 50); // 每秒添加一条消息，模拟流式返回
      }
    };
    addMessage();
  });
</script>

<style>

</style>

