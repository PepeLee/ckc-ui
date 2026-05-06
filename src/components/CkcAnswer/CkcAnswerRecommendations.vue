<template>
  <div 
    class="ckc-ui-recommendation"
    v-for="message in messages" 
    @click="clickRecomendation(message)"
    :key="message">
    <div class="ckc-ui-content">{{ message }}</div>
  </div>
</template>

<script setup lang="ts">
  const { messages } = defineProps<{
      messages: string[];
  }>();
  const emit = defineEmits<{  
    (e: 'clickRecomendation', message: string) : void 
  }>();
  function clickRecomendation(message: string) {
    emit('clickRecomendation', message);
  }
</script>

<style lang="scss">
@use "../../styles/index.scss" as *;

.#{$ckcUiPrefix}-recommendation {
    display: flex;
    flex-direction: row;
    align-items: center;
  .#{$ckcUiPrefix}-content{
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 0 1 auto;
    border-radius: 8px;
    height: 34px;
    padding: 0 12px;
    border: 1px solid #E5EAEE;
    font-size: 13px;
    margin-bottom: 8px;
    cursor: pointer;
  }
}
</style>
