<template>
  <div class="wrapper">
    <!-- useSource="mobile" -->
     <div class="main">
      <CkcAnswer 
        ref="ckcAnswerRef"
        :messages="messages"  
        :historyMessages="historyMessages"
        render-custom-id="docs" 
        :custom-html-tags="['custom-data']"
        @click-recomendation="recomendationAsk"
        :markdown-component="MarkdownRender"
        @click-document="documentClick">
        <template #confirm="confirmProps">
          {{ confirmProps.confirmInfo }}
          <button @click="alterMessages(confirmProps)">确认信息</button>
        </template>
        <template #taskList="taskListProps">
          {{ taskListProps.taskListInfo }}
        </template>
        <template #actions="actionsProps">
          <button @click="alterMessages(actionsProps)">清空消息</button>
        </template>
      </CkcAnswer>
     </div>

    <!-- <button @click="stopChat()">清空消息</button> -->
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue';
  import CkcAnswer from '../../../src/components/CkcAnswer/index.ts';
  import {CustomData, CustomDataArray } from '../../../src/components/CompForAnswer/index.ts';
  import mitt from 'mitt';
  import type { Message, Document } from '../../../src/components/types/message';
  import { message } from '../const/mock-data/message2';
  import { setCustomComponents, MarkdownCodeBlockNode, CodeBlockNode } from 'markstream-vue';
  import { MarkdownRender } from 'markstream-vue';
  // import CustomComp from '../components/customComp.vue';

  const cardEmitter = mitt();
  provide('cardEmitter', cardEmitter);
  cardEmitter.on('schedule-card-click', (event) => {
    console.log('schedule-card-click', event)
  })
  cardEmitter.on('meeting-card-click', (event) => {
    console.log('meeting-card-click', event)
  })
  cardEmitter.on('file-card-click', (event) => {
    console.log('file-card-click', event)
  })
  CustomData.useSource = 'mobile';
  CustomDataArray.useSource = 'mobile';
  setCustomComponents('docs', {
    'custom-data': CustomData,
    'custom-data-array': CustomDataArray,
    // 'markdown': MarkdownCodeBlockNode,
    'code_block': CodeBlockNode
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
  .wrapper {
    display: flex;
    justify-content: center;
    background-color: burlywood;
  }
  .main {
    width: 800px;
  }
</style>

