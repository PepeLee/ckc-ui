<template>
  <div >
    {{  message }}
  </div>
</template>

<script setup lang="ts">
  const { message } = defineProps<{
      message: string[];
  }>();

</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-tool {
    font-size: 14px;
    color: #17204D;
    margin: 10px 0;;

}
</style>
