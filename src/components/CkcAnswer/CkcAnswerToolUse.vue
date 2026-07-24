<template>
  <div class="ckc-ui-tool" v-if="formattedJson && formattedJson.name">
    <Tool class="ckc-ui-toolicon" v-if="toolUseComplete" />
    <img v-else class="ckc-ui-tool-loading" src="../../assets/imgs/loading.gif" alt="avatar" />
    {{  formattedJson?.name }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  // import ToolIcon from '../svg/tool.vue';
  import Tool from '../../assets/imgs/tool.svg';
  import json5 from 'json5';
  const prop = defineProps<{
      message: string;
      toolUseComplete: boolean | undefined;
  }>();

  const formattedJson = computed(() => {
    try {
      return json5.parse(prop.message);
    } catch {
      console.error('Failed to parse JSON5:', prop.message);
      return null;
    }
  });
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-tool {
    font-size: 14px;
    color: #17204D;
    display: flex;
    align-items: center;
    margin-top: 2px;
}
.#{$ckcUiPrefix}-toolicon {
  position: relative;
  top: 2px;
  margin-right: 8px;
}
.#{$ckcUiPrefix}-tool-loading {
    width: 20px;
    height: 20px;
    margin-right: 8px;
}
</style>
