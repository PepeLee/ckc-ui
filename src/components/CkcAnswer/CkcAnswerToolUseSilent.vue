<template>
  <div class="ckc-ui-tool-silent" v-if="formattedJson && formattedJson.name">
    {{  formattedJson?.name }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import json5 from 'json5';
  const prop = defineProps<{
      message: string;
  }>();

  const formattedJson = computed(() => {
    try {
        console.log(json5.parse(prop.message))
      return json5.parse(prop.message);
    } catch {
      return null;
    }
  });
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;
  .#{$ckcUiPrefix}-tool-silent {
      font-size: 14px;
      color: #17204D;
      margin: 10px 0;
  }
</style>
