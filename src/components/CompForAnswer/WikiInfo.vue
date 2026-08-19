<template>
  <span class="ckc-ui-wiki-info" @click="handleClick">
    {{ props.meetingData.filename }}
  </span>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import mitt, { type Emitter } from 'mitt';

interface CardEventMap {
  [event: string]: unknown;
  [event: symbol]: unknown;
  customEvent: any;
}
interface WikiInfoProps {
  meetingData: {
    type: string;
    filename: string;
    url: string;
    [key: string]: any;
  };
  cardTraceId: string;
  useSource: string;
}
const emitter = inject<Emitter<CardEventMap>>('cardEmitter', mitt<CardEventMap>());
const props = defineProps<WikiInfoProps>();
const handleClick = () => {
  emitter.emit('wiki-info-click', {
    type: props.meetingData.type,
    fileName: props.meetingData.filename,
    url: props.meetingData.url,
    cardTraceId: props.cardTraceId,
    rawData: props.meetingData,
  });
};
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-wiki-info {
  color: $linkColor;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 200ms ease;

  &:hover {
    opacity: 0.8;
  }
}
</style>
