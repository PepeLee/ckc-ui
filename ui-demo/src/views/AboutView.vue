<template>
  <div class="file-download-card" @click="onCardClick">
    <div class="file-download-card__left">
      <div class="file-download-card__content">
        <div class="file-download-card__title" title="对话日志查询模块需求规对话日志查询模块需求规.md">对话日志查询模块需求规对话日志查询模块需求规.md</div>
      </div>
    </div>
    <button class="file-download-card__action" type="button" @click.stop="onDownloadClick">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M8 10L12 14L16 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M6 18H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const url = 'https://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280';
function onCardClick() {
  console.log('card clicked');
}

async function onDownloadClick() {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'downloaded-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
}
</script>

<style lang="scss">
.file-download-card {
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
  max-width: 200px;
}

.file-download-card:hover {
  transform: translateY(-1px);
  border-color: #d2dbe8;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
}

.file-download-card__left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.file-download-card__icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eef6ff;
}

.file-download-card__content {
  min-width: 0;
}

.file-download-card__title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-download-card__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  color: #6b7280;
  font-size: 13px;
}

.file-download-card__status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

.file-download-card__date {
  color: #9ca3af;
}

.file-download-card__action {
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

.file-download-card__action:hover {
  background: #e0ecff;
  transform: translateY(-1px);
}

.file-download-card__action svg {
  width: 18px;
  height: 18px;
}
</style>