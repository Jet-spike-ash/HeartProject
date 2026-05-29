<template lang="">
  <div class="page-head">
    <div class="page-head-title">{{ props.title }}</div>
    <div class="page-head-button">
      <slot name="button"></slot>
    </div>
  </div>
</template>
<script setup="ts">
// 定义组件的 props
//作为子组件，PageHead 接收一个 title 属性，用于显示页面标题。父组件（如 dashboard.vue、knowledge.vue、mood.vue 和 consolation.vue）通过 props 将标题传递给 PageHead 组件，从而实现页面标题的动态显示。
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
<style lang="css">
.page-head {
  display: flex;
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #eca2a2;
}
.page-head-title {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}
</style>
