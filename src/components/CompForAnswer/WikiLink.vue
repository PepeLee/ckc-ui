<template>
  <span class="ckc-ui-wiki-link" @click="handleClick">
    <span class="ckc-ui-wiki-link__text">{{ displayText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import mitt, { type Emitter } from 'mitt';

interface CardEventMap {
  [event: string]: unknown;
  [event: symbol]: unknown;
  customEvent: any;
}
type PageItem = string | number;
interface WikiLinkProps {
  meetingData: {
    type: string;
    filename: string;
    url: string;
    /** 页面展示名称，缺省时回退到 filename */
    displayName?: string;
    /** PDF 对应页码信息，支持单值或数组（如 3、[3,5,8]、"3,5,8"） */
    page?: PageItem | PageItem[];
    [key: string]: any;
  };
  cardTraceId: string;
  useSource: string;
}
const emitter = inject<Emitter<CardEventMap>>('cardEmitter', mitt<CardEventMap>());
const props = defineProps<WikiLinkProps>();

const displayText = computed(() => {
  return props.meetingData.displayName || props.meetingData.filename;
});

/** 统一解析为页码数组，兼容 number / string / (number|string)[] / "3,5,8" 逗号分隔 */
const pages = computed<PageItem[]>(() => {
  const raw = props.meetingData.page;
  if (raw == null || raw === '') return [];
  if (Array.isArray(raw)) {
    return raw.filter((p) => p != null && p !== '');
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');
  }
  return [raw];
});

const handleClick = () => {
  emitter.emit('wiki-link-click', {
    type: props.meetingData.type,
    fileName: props.meetingData.filename,
    displayName: props.meetingData.displayName,
    url: props.meetingData.url,
    page: pages.value.length ? Math.min(...(pages.value.map(Number))) : props.meetingData.page,
    pages: pages.value,
    cardTraceId: props.cardTraceId,
    rawData: props.meetingData,
  });
};

</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-wiki-link {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 2px 6px;
  color: $linkColor;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.8;
  }

  &__text {
    white-space: normal;
  }

  &__page {
    flex: none;
    font-size: 11px;
    color: $linkColor;
    opacity: 0.7;
    text-decoration: none;
    font-weight: 400;
    white-space: nowrap;
    line-height: 1;
    vertical-align: baseline;
  }
}
</style>
