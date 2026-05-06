<template>
  <div class="ckc-ui-documents">
    <div
      class="ckc-ui-document"
      v-for="(message, index) in visibleDocuments"
      :key="index"
      :class="{
        'ckc-ui-document--fade': !expanded && index > 0,
        'ckc-ui-document--fade-2': !expanded && index === 1,
        'ckc-ui-document--fade-3': !expanded && index === 2
      }"
      :style="{ animationDelay: `${index * 0.05}s` }"
    >
      {{ (message.content as unknown as Document).fileName }}
    </div>

    <div v-if="showMoreButton" class="ckc-ui-documents__more">
      <button type="button" @click="expanded = !expanded">
        <template v-if="expanded">
          收起
        </template>
        <template v-else>
          展开全部文档{{ documents.length }}个
        </template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MessageViewInfo, Document } from '../types/message';
const { meassageGroupView } = defineProps<{
  meassageGroupView: MessageViewInfo;
}>();

const expanded = ref(false);
const documents = computed(() => meassageGroupView.messageGroupInfo || []);
const visibleDocuments = computed(() =>
  expanded.value || documents.value.length <= 3
    ? documents.value
    : documents.value.slice(0, 3)
);
const showMoreButton = computed(() => documents.value.length > 3);
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;
.#{$ckcUiPrefix}-documents {
  .#{$ckcUiPrefix}-document {
    position: relative;
    color: $linkColor;
    font-size: 14px;
    background: #F7F7F7;
    padding: 4px 12px;
    margin-bottom: 12px;
    cursor: pointer;
    overflow: hidden;
    opacity: 0;
    transform: translateY(6px);
    animation: fadeInUp 220ms ease-out forwards;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    &--fade::after {
      background: rgba(255, 255, 255, 0.08);
    }

    &--fade-2::after {
      background: rgba(255, 255, 255, 0.38);
    }

    &--fade-3::after {
      background: rgba(255, 255, 255, 0.68);
    }
  }

  &__more {
    display: flex;
    justify-content: center;
    margin-top: 4px;

    button {
      border: none;
      background: transparent;
      color: #7E849F;
      padding: 6px 12px;
      cursor: pointer;
      border: none;
      outline: none;
      &:hover {
        color: $linkColor;
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
