<template>
  <div class="ckc-ui-documents">
    <div
      @click="clickDocument(message.content as unknown as Document)"
      class="ckc-ui-document"
      v-for="(message, index) in visibleDocuments"
      :key="index"
      :class="{
        'ckc-ui-document--fade': !expanded && index > 0 && documents.length > 3,
        'ckc-ui-document--fade-2': !expanded && index === 1 && documents.length > 3,
        'ckc-ui-document--fade-3': !expanded && index === 2 && documents.length > 3
      }"
      :style="{ animationDelay: `${index * 0.05}s` }"
    >
      <component :is="getIcon(message.content as unknown as Document)" class="ckc-ui-document--img" />
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
import uploadDefault from '../../assets/imgs/ckcDocuments/upload-default.svg'
import uploadExcel from '../../assets/imgs/ckcDocuments/upload-excel.svg'
import uploadImage from '../../assets/imgs/ckcDocuments/upload-image.svg'
import uploadMarkdown from '../../assets/imgs/ckcDocuments/upload-markdown.svg'
import uploadPdf from '../../assets/imgs/ckcDocuments/upload-pdf.svg'
import uploadPpt from '../../assets/imgs/ckcDocuments/upload-ppt.svg'
import uploadTxt from '../../assets/imgs/ckcDocuments/upload-txt.svg'
import uploadWord from '../../assets/imgs/ckcDocuments/upload-word.svg'
import uploadZip from '../../assets/imgs/ckcDocuments/upload-zip.svg'

const { meassageGroupView } = defineProps<{
  meassageGroupView: MessageViewInfo;
}>();
function getIcon(message: Document) {
  const fileExtension = message.fileName.split('.').pop();
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

const expanded = ref(false);
const documents = computed(() => meassageGroupView.messageGroupInfo || []);
const visibleDocuments = computed(() =>
  expanded.value || documents.value.length <= 3
    ? documents.value
    : documents.value.slice(0, 3)
);
const showMoreButton = computed(() => documents.value.length > 3);
const emit = defineEmits<{  
  (e: 'clickDocument', message: Document) : void 
}>();
function clickDocument(message: Document) {
  emit('clickDocument', message);
}
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
.ckc-ui-document {
  display: flex;
  align-items: center;
}
.ckc-ui-document--img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
}
</style>
