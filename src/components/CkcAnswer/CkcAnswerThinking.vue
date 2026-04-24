<template>
  <div>
    <MarkdownRender 
        :content= prop.message 
        :custom-html-tags="prop.customHtmlTags" 
        :loading="true"
        :custom-id="prop.renderCustomId" />
  </div>
</template>

<script setup lang="ts">
    import { MarkdownRender } from 'markstream-vue';
    const prop = defineProps<{
        message: string;
        renderCustomId?: string;
        customHtmlTags?: string[];
    }>();
</script>

<style lang="scss">

</style>
