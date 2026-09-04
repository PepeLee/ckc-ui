<template>
  <div class="ckc-ui-file-card" @click="cardClick">
    <div class="ckc-ui-file-card__left">
        <component class="ckc-ui-file--img" :is="getIcon()"></component>
      <div class="ckc-ui-file-card__content">
        <div class="ckc-ui-file-card__title" :title="props.meetingData.filename">{{props.meetingData.filename}}</div>
      </div>
    </div>
    <div ref="moreElRef" class="ckc-ui-file-card__more" @click.stop="handleMoreClick">
      <button class="ckc-ui-file-card__action" type="button" aria-label="更多操作">
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="19" r="1.7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import mitt, { type Emitter } from 'mitt';
import { toggleFileCardPopover } from '../composables/useFileCardPopover';
import uploadDefault from '../../assets/imgs/ckcDocuments/upload-default.svg'
import uploadExcel from '../../assets/imgs/ckcDocuments/upload-excel.svg'
import uploadImage from '../../assets/imgs/ckcDocuments/upload-image.svg'
import uploadMarkdown from '../../assets/imgs/ckcDocuments/upload-markdown.svg'
import uploadPdf from '../../assets/imgs/ckcDocuments/upload-pdf.svg'
import uploadPpt from '../../assets/imgs/ckcDocuments/upload-ppt.svg'
import uploadTxt from '../../assets/imgs/ckcDocuments/upload-txt.svg'
import uploadWord from '../../assets/imgs/ckcDocuments/upload-word.svg'
import uploadZip from '../../assets/imgs/ckcDocuments/upload-zip.svg'

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

// 更多按钮：渲染与定位统一交给单例 popover 服务处理
const moreElRef = ref<HTMLElement | null>(null);

const handleMoreClick = () => {
    if (!moreElRef.value) return;
    toggleFileCardPopover({
        anchorEl: moreElRef.value,
        showDownload: props.useSource !== 'mobile',
        onDownload: downloadFile,
        onSave: () => {
            emitter.emit('file-save', {
                fileName: props.meetingData.filename,
                url: props.meetingData.url
            });
        },
    });
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

function getIcon() {
  const fileExtension = props.meetingData.filename.split('.').pop();
  switch (fileExtension) {
    case 'pdf':
      return uploadPdf;
    case 'docx':
    case 'doc':
    case 'docm':
    case 'dotx':
    case 'dotm':
      return uploadWord;
    case 'xlsx':
    case 'xls':
    case 'xlsm':
    case 'xltx':
    case 'xltm':
      return uploadExcel;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return uploadImage;
    case 'md':
      return uploadMarkdown;
    case 'txt':
      return uploadTxt;
    case 'zip':
      return uploadZip;
    case 'pptx':
    case 'ppt':
    case 'pptm':
      return uploadPpt;
    default:
      return uploadDefault;
  }
}
</script>

<style lang="scss">
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
  margin-right: 12px;
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
}

.#{$ckcUiPrefix}-file--img {
    width: 36px;
    height: 36px;
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
.#{$ckcUiPrefix}-file-card__more {
  position: relative;
  display: inline-flex;
  align-items: center;
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