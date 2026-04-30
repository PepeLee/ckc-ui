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
        {{ expanded ? '收起' : '展开更多' }}
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
    margin-bottom: 4px;
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
      background: rgba(255, 255, 255, 0.18);
    }

    &--fade-3::after {
      background: rgba(255, 255, 255, 0.28);
    }
  }

  &__more {
    display: flex;
    justify-content: center;
    margin-top: 8px;

    button {
      border: none;
      background: #ffffff;
      color: $linkColor;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      transition: background 0.2s ease, transform 0.2s ease;

      &:hover {
        background: #f2f2f2;
        transform: translateY(-1px);
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
