<template>
  <div
    class="ckc-ui-think-main"
    ref="scrollContainer"
    @scroll="handleScroll"
  >
    <MarkdownRender
      :content="prop.message"
      :custom-html-tags="prop.customHtmlTags"
      :loading="true"
      :custom-id="prop.renderCustomId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { MarkdownRender } from 'markstream-vue';

const prop = defineProps<{
  message: string;
  renderCustomId?: string;
  customHtmlTags?: string[];
}>();

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
  @include thinkStyle;
  .markstream-vue {
    --ms-text-body: 13px;
  }
}
</style>
