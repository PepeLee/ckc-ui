<template>
  <div class="wrapper">
    <!-- useSource="mobile" -->
     <div class="main">
       <!-- <ai-report-panel items="[{&quot;type&quot;:&quot;markdown&quot;,&quot;name&quot;:&quot;来自父页面的消息&quot;,&quot;value&quot;:&quot;这是通过 `postMessage` 从父页面触发的 **AI 报告面板** 渲染测试。&quot;},{&quot;type&quot;:&quot;alertcard&quot;,&quot;name&quot;:&quot;&quot;,&quot;value&quot;:&quot;&quot;,&quot;object&quot;:{&quot;title&quot;:&quot;提示&quot;,&quot;score&quot;:&quot;99&quot;,&quot;desc&quot;:&quot;当前为父页面主动下发的测试数据，用于验证跨 iframe 通信。&quot;,&quot;alert&quot;:[&quot;事项一：确认 iframe 内能收到消息&quot;,&quot;事项二：确认 Web Component 或 Portal 能正确渲染&quot;]}}]"></ai-report-panel> -->
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
  import { ExtCustomTag } from '../../../src/components/ExtCompForAnswer/index.ts';
  import mitt from 'mitt';
  import type { Message, Document } from '../../../src/components/types/message';
  import { message } from '../const/mock-data/message-ext';
  import { setCustomComponents } from 'markstream-vue';
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
  // CustomData.useSource = 'mobile';
  setCustomComponents('docs', {
    'custom-data': CustomData,
    'custom-data-array': CustomDataArray,
    'ext-custom-tag': ExtCustomTag,
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

