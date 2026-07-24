<template>
  <div class="ckc-ui-tool-wrapper">
    <div class="ckc-ui-tool" @click="triggerExpanded" v-if="formattedJson && formattedJson.name">
      <Tool class="ckc-ui-toolicon" v-if="toolUseComplete" />
      <img v-else class="ckc-ui-tool-loading" src="../../assets/imgs/loading.png" alt="avatar" />
      {{  formattedJson?.name }}
      <button class="ckc-ui-progress-btn"  v-if="command">
        <img v-if="messageInfo.toolIsExpanded" src="../../assets/imgs/arrow-down.png" alt="avatar" />
        <img v-else src="../../assets/imgs/arrow-right.png" alt="avatar" />
      </button>
    </div>
    <div class="ckc-ui-tool-comman" v-if="command && messageInfo.toolIsExpanded">
      {{  command }}
    </div>
  </div>

</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import Tool from '../../assets/imgs/tool.svg';
  import json5 from 'json5';
  import type { MessageForView } from '../types/message';
  const prop = defineProps<{
      message: string;
      command?: string;
      toolUseComplete: boolean | undefined;
      messageInfo: MessageForView;
  }>();

  const formattedJson = computed(() => {
    try {
      return json5.parse(prop.message);
    } catch {
      return null;
    }
  });
  const triggerExpanded = () => {
    prop.messageInfo.toolIsExpanded = !prop.messageInfo.toolIsExpanded
  }
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-tool-wrapper {
    font-size: 14px;
    color: #17204D;
    margin-top: 4px;
}
.#{$ckcUiPrefix}-tool {
    // font-size: 14px;
    // color: #17204D;
    display: flex;
    align-items: center;
    margin-top: 2px;
    cursor: pointer;

    font-size: 13px;
    color: #7E849F;
    gap: 6px;
    flex-wrap: wrap;
    width: auto;
}
.#{$ckcUiPrefix}-toolicon {
  position: relative;
  top: 2px;
  left: -1px;
  // margin-right: 8px;
}
.#{$ckcUiPrefix}-tool-loading {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    animation: ckc-ui-spin 1s linear infinite;
}

.#{$ckcUiPrefix}-tool-comman {
    max-height: 120px;
    overflow-y: auto;
    word-break: break-word;
    border-left: 2px solid #bbc3da;
    padding: 10px 16px;
    margin-left: 5px;
    font-size: 13px;
    color: #7E849F;
    margin-top: 4px;
}
</style>
