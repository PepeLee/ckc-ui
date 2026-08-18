<template>
  <div class="ckc-ui-content">
    <component 
        :is="markdownComponent" 
        :content="prop.message" 
        :custom-html-tags="prop.customHtmlTags" 
        :code-block-props="{ showFontSizeButtons: false, showTooltips: false, showExpandButton: false }"
        :loading="true"
        :custom-id="prop.renderCustomId"
        :final="false"
        :fade="false"
        :typewriter="true"
        :max-live-nodes="0"
        smooth-streaming="auto"
     />
  </div>
</template>

<script setup lang="ts">
    import { inject } from 'vue';
    import { MarkdownRender } from 'markstream-vue';
    
    const prop = defineProps<{
        message: string;
        renderCustomId?: string;
        customHtmlTags?: string[];
    }>();

    // 注入外部传入的组件，如果没有则使用默认的 MarkdownRender
    const markdownComponent = inject('markdownComponent', MarkdownRender);
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-content {
    font-size: 14px;
    color: $contentFontColor;
    line-height: 24px;
    .markstream-vue {
        --ms-text-body: 14px;
    }
}
</style>
