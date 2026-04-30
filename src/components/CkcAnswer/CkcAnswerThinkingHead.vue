<template>
  <div v-if="isShow" class="ckc-ui-think-head">
    <img class="ckc-ui-think-img" src="../../assets/imgs/deepThink.gif" alt="avatar" />
    执行完成({{ meassageGroupView.thinkState }})
    <button class="ckc-ui-think-btn" @click="toggleFold(meassageGroupView)">
      <img src="../../assets/imgs/arrow-down.png" alt="avatar" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MessageType, type MessageViewInfo } from '../types/message';
const { meassageGroupView, currentMeassageViewInfo } = defineProps<{
    meassageGroupView: MessageViewInfo;
    currentMeassageViewInfo: MessageViewInfo[];
}>();
const toggleFold = (messageGroupView: MessageViewInfo) => {
  const groupIndex = currentMeassageViewInfo.indexOf(messageGroupView);
  if (groupIndex < 0) {
    return;
  }

  const isLastGroup = (groupIndex === currentMeassageViewInfo.length - 1) 
                      || (groupIndex === currentMeassageViewInfo.length - 2 
                          && currentMeassageViewInfo[currentMeassageViewInfo.length - 1].messageGroupInfo[0].type === MessageType.DOCUMENTS
                        );
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
const isShow = computed(() => {
  const thinkingMessage = meassageGroupView.messageGroupInfo.find(
    (item) => item.type === MessageType.THINKING
  );
  return !!thinkingMessage;
});
</script>

<style lang="scss">
  @use "../../styles/index.scss" as *;

  .#{$ckcUiPrefix}-think-head {
    @include thinkStyle;
    .#{$ckcUiPrefix}-think-img {
      width: 12px;
      height: 12px;
    }
    .#{$ckcUiPrefix}-think-btn {
      background: none;
      border: none;
      cursor: pointer;
      outline: none;
    }
  }
</style>
