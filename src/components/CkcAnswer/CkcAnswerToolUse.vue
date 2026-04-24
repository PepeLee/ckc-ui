<template>
  <div>
    {{  prop.message}}
  </div>
</template>

<script setup lang="ts">
    const prop = defineProps<{
        message: string;
    }>();
</script>

<style lang="scss">

</style>
