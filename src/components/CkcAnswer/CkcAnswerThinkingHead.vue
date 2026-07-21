<template>
  <div v-if="isShow && messageGroupView.isExpanded" :class="['ckc-ui-think-head', 'is-expanded', { 'is-mobile': useSource !== 'pc' }]">
    <div class="ckc-ui-think-left" @click="toggleFold()">
      <template v-if="useSource==='pc'">
        <img v-if="loading" class="ckc-ui-think-img" src="../../assets/imgs/deepThink.gif" alt="avatar" />
        <DeepThink v-if="isSuccess"></DeepThink>
      </template>
      <template v-else>
        <img v-if="loading" class="ckc-ui-think-img" src="../../assets/imgs/mobileThink.gif" alt="avatar" />
        <MobileDeepThink v-if="isSuccess"></MobileDeepThink>
      </template>
      <template v-if="loading">
        思考中...
        <!-- 思考中... -->
      </template>
      <template v-if="isSuccess">
        已深度思考
        <!-- 已深度思考 -->
      </template>
      <template v-if="isBreak">
        思考终止
        <!-- 已终止 -->
      </template>
    </div>
    <button class="ckc-ui-think-btn" @click="toggleFold()">
      <img v-if="buttonExpanded" src="../../assets/imgs/arrow-down.png" alt="avatar" />
      <img v-else src="../../assets/imgs/arrow-right.png" alt="avatar" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MessageType, type MessageViewInfo } from '../types/message';
import DeepThink from '../svg/deepThink.vue';
import MobileDeepThink from '../svg/mobileThink.vue';

const { messageGroupView } = defineProps<{
    messageGroupView: MessageViewInfo;
    currentMessageViewInfo: MessageViewInfo[];
    useSource: string;
}>();
const thinkingMessage = computed(() =>
  messageGroupView.messageGroupInfo.find((item) => item.type === MessageType.THINKING)
);
// const isLastGroup = computed(() => {
//   const groupIndex = currentMessageViewInfo.indexOf(messageGroupView);
//   return (
//     groupIndex === currentMessageViewInfo.length - 1 ||
//     (groupIndex === currentMessageViewInfo.length - 2 &&
//       currentMessageViewInfo[currentMessageViewInfo.length - 1].messageGroupInfo[0].type === MessageType.DOCUMENTS)
//   );
// });
const buttonExpanded = computed(() =>
  !!thinkingMessage.value?.thinkingIsExpanded
);
const toggleFold = () => {
  if (!thinkingMessage.value) {
    return;
  }
  thinkingMessage.value.thinkingIsExpanded = !thinkingMessage.value.thinkingIsExpanded;

  // const groupIndex = currentMessageViewInfo.indexOf(messageGroupView);
  // if (groupIndex < 0) {
  //   return;
  // }
  // const nextGroupExpandState = !messageGroupView.isExpanded;

  // // 非最后一个历史组：切换组展开状态，并同步 thinking 消息的折叠状态
  // if (!isLastGroup.value) {
  //   messageGroupView.isExpanded = nextGroupExpandState;
  // }

  // // 最后一个组：保留组状态，仅切换思考消息的展开状态
  // if (thinkingMessage.value) {
  //   thinkingMessage.value.thinkingIsExpanded = isLastGroup.value
  //     ? !thinkingMessage.value.thinkingIsExpanded
  //     : nextGroupExpandState;
  // }
}
const isShow = computed(() => {
  const thinkingMessage = messageGroupView.messageGroupInfo.find(
    (item) => item.type === MessageType.THINKING
  );
  return !!thinkingMessage;
});
const loading = computed(() => messageGroupView.thinkState === 'loading');
const isSuccess = computed(() => messageGroupView.thinkState === 'success');
const isBreak = computed(() => messageGroupView.thinkState === 'break');
</script>

<style lang="scss">
  @use "../../styles/index.scss" as *;

  .#{$ckcUiPrefix}-think-head {
    @include thinkStyle;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    width: auto;

    // &.is-expanded {
    //   // display: flex;
    //   // width: 100%;
    // }

    // &.is-mobile {
    //   justify-content: space-between;
    //   width: 100%;
    // }

    .ckc-ui-think-left {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      cursor: pointer;
    }

    .#{$ckcUiPrefix}-think-img {
      width: 16px;
      height: 16px;
      display: inline-block;
      position: static;
      top: auto;
    }

    .#{$ckcUiPrefix}-think-btn {
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
  }
</style>
