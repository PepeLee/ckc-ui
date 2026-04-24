<script setup lang="ts">
const props = defineProps<{
  node: {
    type: string
    content?: string
    loading?: boolean
  }
  customId?: string
  isDark?: boolean
}>()
</script>

<template>
  <div>
     {{ node.loading }}
      ddddd
  </div>
</template>
