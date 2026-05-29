<template lang="">
  <div>
    <PageHead title="数据分析">
      <template #button>
        <el-button type="primary" color="#fff">查询</el-button>
      </template>
    </PageHead>
    <TableSearch :formItems="formItems" @search="handleSearch" />
  </div>
</template>
<script setup="ts">
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'

const formItems = [
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  {
    comp: 'select',
    prop: 'categoryId',
    label: '分类',
    placeholder: '请选择分类',
    options: [
      {
        label: '心理健康基础',
        value: '1',
      },
      {
        label: '情绪管理',
        value: '2',
      },
    ],
  },
]

const handleSearch = (formData) => {
  // 这里可以发起请求，获取表单数据
  console.log(formData, 'formData')
}
</script>
<style lang=""></style>
