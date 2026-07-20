<template>
  <div class="ckc-ui-upload-heart" v-if="uploadHeartInfo && currentMeassageViewInfo.length === 0">
    {{ uploadHeartInfo.task }} 
  </div>
  <div>
    <div v-if="end" class="ckc-ui-progress-head" @click="triggerProgress()">
      所有执行过程
      <button class="ckc-ui-progress-btn">
        <img v-if="progressShow" src="../../assets/imgs/arrow-down.png" alt="avatar" />
        <img v-else src="../../assets/imgs/arrow-right.png" alt="avatar" />
      </button>
    </div>
    <template v-for="(meassageGroupView, index) in currentMeassageViewInfo" :key="index">
      <div  v-if="meassageGroupView.messageGroupInfo.length > 0">
        <div class="ckc-ui-group-title" :class="[{ 'isProgress': meassageGroupView.isProgress }]">
          {{ meassageGroupView.groupTitle }}
        </div>
        <CkcAnswerThinkingHead 
          :messageGroupView="meassageGroupView" 
          :currentMessageViewInfo="currentMeassageViewInfo" 
          :useSource="prop.useSource"/>
        <CkcAnswerDocuments 
          v-if="meassageGroupView.isDocumentGroup" 
          :meassageGroupView="meassageGroupView"
          @clickDocument="clickDocument" />
        <template v-else>
          <div v-show="meassageGroupView.isExpanded">  
            <div v-for="message in meassageGroupView.messageGroupInfo">
                <div v-show="message.thinkingIsExpanded">
                  <CkcAnswerThinking 
                    v-if="message.type === MessageType.THINKING" 
                    :message="message.content as string"
                    :renderCustomId="prop.renderCustomId" 
                    :customHtmlTags="prop.customHtmlTags" />
                  <CkcAnswerToolUse 
                    v-if="message.type === MessageType.TOOL_USE" 
                    :toolUseComplete="meassageGroupView.toolUseComplete"
                    :message="message.content as string" />
                  <CkcAnswerToolUseSilent
                    v-if="message.type === MessageType.TOOL_USE_SILENT"
                    :toolUseComplete="meassageGroupView.toolUseComplete"
                    :message="message.content as string" />
                  <CkcAnswerContent 
                    v-if="message.type === MessageType.ANSWER || message.type === MessageType.EXCEPTION" 
                    :message="message.content as string"
                    :renderCustomId="prop.renderCustomId" 
                    :customHtmlTags="prop.customHtmlTags" />  
                </div>
              </div>
            </div>
        </template>
      </div>
    </template>
    <div v-if="humanConfirmMessage && $slots.confirm">
      <slot name="confirm" :confirmInfo="humanConfirmMessage"></slot>
    </div>
    <div v-if="taskListMessage && $slots.taskList">
      <slot name="taskList" :taskListInfo="taskListMessage"></slot>
    </div>
    <div class="ckc-ui-task-run-tip" v-if="!end && prop.messages && prop.messages.length > 0">
      <img class="ckc-ui-task-run-tip-loading" src="../../assets/imgs/loading1.png" alt="avatar" />
      任务执行中...
    </div>
    <div v-if="end && $slots.actions">
      <slot name="actions" :messageViewInfo="currentMeassageViewInfo"></slot>
    </div>
  </div>
  <CkcAnswerRecommendations  @clickRecomendation="clickRecomendation" v-if="recommendations.length > 0" :messages="recommendations"  />
</template>

<script setup lang="ts">
import { watch, ref, provide, computed } from 'vue';
import type { CkcAnswerProps } from '../types/ckc-answer-props';
import { MessageType, type Document } from '../types/message';
import { useMessageView } from '../composables/useMessageView';
import CkcAnswerThinking from './CkcAnswerThinking.vue';
import CkcAnswerToolUse from './CkcAnswerToolUse.vue';
import CkcAnswerToolUseSilent from './CkcAnswerToolUseSilent.vue';
import CkcAnswerContent from './CkcAnswerContent.vue';
import CkcAnswerThinkingHead from './CkcAnswerThinkingHead.vue';
import CkcAnswerDocuments from './CkcAnswerDocuments.vue';
import CkcAnswerRecommendations from './CkcAnswerRecommendations.vue';
const prop = withDefaults(defineProps<CkcAnswerProps>(), {
  useSource: 'pc'
});

// 提供 markdown 渲染组件，默认使用 markstream-vue，也可外部传入
if (prop.markdownComponent) {
  provide('markdownComponent', prop.markdownComponent);
}
const emit = defineEmits<{  
  (e: 'clickRecomendation', message: string) : void 
  (e: 'clickDocument', message: Document) : void 
}>();
const { 
  currentMeassageViewInfo,
  recommendations,
  end, 
  handleData, 
  uploadHeartInfo, 
  progressShow,
  humanConfirmMessage,
  taskListMessage
} = useMessageView();
const lastProcessedIndex = ref(0);
const lastProcessedHistoryIndex = ref(0);

function clickRecomendation(message: string) {
  emit('clickRecomendation', message);
}

function clickDocument(message: Document) {
  emit('clickDocument', message);
}
const stopChat = () => {
  end.value = true;
  currentMeassageViewInfo.value.forEach(info => {
    if (info.thinkState === 'loading') {
      info.thinkState = 'break';
    }
  });
  // console.log('stopChat called');
}
const triggerProgress = () => {
  progressShow.value = !progressShow.value;
  triggerfoldProgress(progressShow.value);
};
// 折叠执行过程
const triggerfoldProgress = (show: boolean) => {
  if (currentMeassageViewInfo.value.length > 0) {
    currentMeassageViewInfo.value.forEach(info => {
      if (info.isProgress) {
        info.isExpanded = show
      }
    });
  }
}

defineExpose({
  stopChat
})

const showProgressHead = computed(() => {
  return end.value && currentMeassageViewInfo.value.some(info => info.isProgress);
})

watch(end, (newVal) => {
  if (newVal) {
    console.log('end changed', newVal);
    progressShow.value = false;
    // triggerfoldProgress(progressShow.value)
  }
})
watch(() => prop.messages, (newVal) => {
  if (newVal && newVal.length > lastProcessedIndex.value) {
    for (let i = lastProcessedIndex.value; i < newVal.length; i++) {
      handleData(newVal[i]);
    }
    lastProcessedIndex.value = newVal.length;
  }
  console.log('prop.messages', currentMeassageViewInfo.value);
}, { deep: true, immediate: true });

watch(() => prop.historyMessages, (newVal) => {
  if (newVal && newVal.length > lastProcessedHistoryIndex.value) {
    for (let i = lastProcessedHistoryIndex.value; i < newVal.length; i++) {
      handleData(newVal[i]);
    }
    lastProcessedHistoryIndex.value = newVal.length;
  }
}, { deep: true, immediate: true });
</script>

<style lang="scss">
  @use "../../styles/index.scss" as *;
  .#{$ckcUiPrefix}-upload-heart {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    .#{$ckcUiPrefix}-loading {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .#{$ckcUiPrefix}-task-run-tip {
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.26rem 0.7rem;
    border-radius: 999px;
    letter-spacing: 0.03em;
    font-weight: 500;
    animation: ckc-ui-pulse 1.4s ease-in-out infinite;
  }
  .#{$ckcUiPrefix}-group-title {
    font-size: 14px;
    color: #7E849F;
    margin: 10px 0;
    &.isProgress {
      // color: red;
      font-weight: 500;
    }
  }
  .#{$ckcUiPrefix}-task-run-tip-loading {
    width: 20px;
    height: 20px;
    animation: ckc-ui-spin 1s linear infinite;
  }
  .#{$ckcUiPrefix}-progress-head {
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    color: #7E849F;
    cursor: pointer;
  }
  .#{$ckcUiPrefix}-progress-btn {
      background: none;
      border: none;
      cursor: pointer;
      outline: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      img {
        width: 16px;
        height: 16px;
      }
  }

  @keyframes ckc-ui-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes ckc-ui-pulse {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-1px);
    }
  }
</style>
