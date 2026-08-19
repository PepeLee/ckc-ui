<template>
  <div
    class="ckc-ui-think-main"
    ref="scrollContainer"
    @scroll="handleScroll"
  >
    <component
      :is="markdownComponent"
      :content="prop.message"
      :custom-html-tags="prop.customHtmlTags"
      :code-block-props="{ showFontSizeButtons: false, showTooltips: false, showExpandButton: false }"
      :loading="true"
      :custom-id="prop.renderCustomId"
      :final="false"
      :fade="false"
      :typewriter="false"
      :max-live-nodes="0"
      smooth-streaming="auto"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, inject } from 'vue';
import { MarkdownRender } from 'markstream-vue';

const prop = defineProps<{
  message: string;
  renderCustomId?: string;
  customHtmlTags?: string[];
}>();

// 注入外部传入的组件，如果没有则使用默认的 MarkdownRender
const markdownComponent = inject('markdownComponent', MarkdownRender);

const scrollContainer = ref<HTMLElement | null>(null);
const shouldAutoScroll = ref(true);

const scrollToBottom = () => {
  const el = scrollContainer.value;
  if (!el) {
    return;
  }
  el.scrollTop = el.scrollHeight;
};

const isScrolledToBottom = (el: HTMLElement) => {
  const threshold = 2; // 容差，避免像素误差导致误判
  return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
};

const handleScroll = () => {
  const el = scrollContainer.value;
  if (!el) {
    return;
  }
  shouldAutoScroll.value = isScrolledToBottom(el);
};

watch(
  () => prop.message,
  async () => {
    await nextTick();
    if (shouldAutoScroll.value) {
      scrollToBottom();
    }
  }
);

onMounted(async () => {
  await nextTick();
  scrollToBottom();
});
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-think-main {
  max-height: 120px;
  overflow-y: auto;
  word-break: break-word;
  border-left: 2px solid #bbc3da;
  padding: 10px 16px;
  margin-left: 5px;
  margin-top: 4px;
  @include thinkStyle;
  .markstream-vue {
    --ms-text-body: 12px;
  }
}
</style>
