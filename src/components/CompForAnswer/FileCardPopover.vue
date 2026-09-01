<template>
  <div v-if="state.visible" class="ckc-ui-file-card__popover" :style="popoverStyle" @click.stop>
    <button v-if="state.showDownload" class="ckc-ui-file-card__menu-item" type="button" @click="handleDownload">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M8 10L12 14L16 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 18H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      <span>下载</span>
    </button>
    <button class="ckc-ui-file-card__menu-item" type="button" @click="handleSave">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V18.5C20 19.33 19.33 20 18.5 20H5.5C4.67 20 4 19.33 4 18.5V6.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        <path d="M8 5V9H16V5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        <path d="M8 14H16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <path d="M12 14V18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <path d="M10 18H14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <span>保存到个人知识库</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
// 仅类型导入，编译期擦除，避免与 useFileCardPopover 形成运行时循环依赖
import type { FileCardPopoverState } from '../composables/useFileCardPopover';

const props = defineProps<{
  state: FileCardPopoverState;
  onClose: () => void;
}>();

const popoverStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  top: `${props.state.top}px`,
  left: `${props.state.left}px`,
}));

const handleDownload = () => {
  const fn = props.state.onDownload;
  props.onClose();
  fn?.();
};

const handleSave = () => {
  const fn = props.state.onSave;
  props.onClose();
  fn?.();
};
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-file-card__popover {
  z-index: 1000;
  width: 190px;
  padding: 6px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e8edf5;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.14);
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
}

.#{$ckcUiPrefix}-file-card__menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  text-align: left;
  transition: background-color 200ms ease;
}

.#{$ckcUiPrefix}-file-card__menu-item:hover {
  background: #f0f4ff;
  color: #2563eb;
}

.#{$ckcUiPrefix}-file-card__menu-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: currentColor;
}

.#{$ckcUiPrefix}-file-card__menu-item span {
  white-space: nowrap;
}
</style>
