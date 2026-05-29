//仔细阅读这个代码，重复性很强，可以抽象成一个组件，减少重复代码

<template lang="">
  <el-form ref="formFormRef" :model="formData">
    <el-row :gutter="20">
      <template v-for="item in formItemAtter" :key="item.prop">
        <el-col v-bind="item.col">
          <!-- :prop="item.prop"表单校验 -->
          <!-- 比如你想让「文章标题不能为空」，表单必须通过 prop="title" 找到 formData.title 去检查对错。 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <template v-if="item.comp === 'input'">
              <el-input v-model="formData[item.prop]" :placeholder="item.placeholder" />
            </template>
            <template v-else-if="item.comp === 'select'">
              <el-select v-model="formData[item.prop]" :placeholder="item.placeholder">
                <el-option
                  v-for="option in item.options ?? []"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row>
      <el-button type="primary" color="#efde1c" @click="handleSearch1">查询</el-button>
      <el-button type="primary" color="#82d1f9" @click="handleReset(formFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>
<script setup="ts">
import { reactive, computed, ref } from 'vue'

const formFormRef = ref()

const emit = defineEmits(['search'])

const formData = reactive({})

const props = defineProps({
  formItems: {
    type: Array,
    default: () => [],
  },
})

const handleSearch1 = () => {
  // 这里可以发起请求，获取表单数据
  console.log('搜索条件1：', formData)
  emit('search', formData)
}

const formItemAtter = computed(() => {
  return props.formItems.map((item) => ({
    ...item,
    col: { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 },
  }))
})

const handleReset = (formEL) => {
  //先重置，再查询
  if (!formEL) return
  formEL.resetFields()
  emit('search', formData)
}
</script>
<style lang=""></style>
