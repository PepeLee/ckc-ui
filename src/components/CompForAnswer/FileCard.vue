<template>
  <div class="ckc-ui-file-card" @click="cardClick">
    <div class="ckc-ui-file-card__left">
      <div class="ckc-ui-file-card__content">
        <div class="ckc-ui-file-card__title" :title="props.meetingData.filename">{{props.meetingData.filename}}</div>
      </div>
    </div>
    <button v-if="props.useSource !== 'mobile'"  class="ckc-ui-file-card__action" type="button" @click.stop="downloadFile">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M8 10L12 14L16 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 18H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import mitt, { type Emitter } from 'mitt';

interface CardEventMap {
  [event: string]: unknown;
  [event: symbol]: unknown;
  customEvent: any;
}
interface FileCardProps {
    meetingData: {
        filename: string;
        url: string;
    },
    useSource: string
}
const emitter = inject<Emitter<CardEventMap>>('cardEmitter', mitt<CardEventMap>());
const prefix = `http://${window.location.host}`;
const props = defineProps<FileCardProps>();
const cardClick = () => {
    emitter.emit('file-card-click', { 
        fileName: props.meetingData.filename, 
        url: props.meetingData.url
    })
}
const downloadFile = async () => {
  try {
    const url = props.meetingData.url.startsWith('/')
      ? `${prefix}${props.meetingData.url}`
      : `${prefix}/${props.meetingData.url}`;
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`下载失败，状态码：${response.status}`);
    }
    const blob = await response.blob();
    const dataUrl = await blobToDataURL(blob);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = props.meetingData.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // console.log(props.meetingData.url)
  } catch (error) {
    console.error('Download failed:', error);
  }
}

function blobToDataURL(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('转换 DataURL 失败'));
    };
    reader.readAsDataURL(blob);
  });
}
</script>

<style lang="scss" scoped>
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-file-card {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #e8edf5;
  background: #ffffff;
  box-shadow: 0 3px 14px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  width: fit-content;
  max-width: 400px;
  margin-top: 12px;
}

.#{$ckcUiPrefix}-file-card:hover {
  transform: translateY(-1px);
  border-color: #d2dbe8;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
}

.#{$ckcUiPrefix}-file-card__left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 8px 0;
}

.#{$ckcUiPrefix}-file-card__content {
  min-width: 0;
}

.#{$ckcUiPrefix}-file-card__title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.#{$ckcUiPrefix}-file-card__action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 12px;
  background: #f8faff;
  color: #2563eb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 200ms ease, transform 200ms ease;
}

.#{$ckcUiPrefix}-file-card__action:hover {
  background: #e0ecff;
  transform: translateY(-1px);
}

.#{$ckcUiPrefix}-file-card__action svg {
  width: 18px;
  height: 18px;
}
</style>