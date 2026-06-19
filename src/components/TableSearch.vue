//仔细阅读这个代码，重复性很强，可以抽象成一个组件，减少重复代码

<template lang="">
  <!-- 在 <script> 中通过 const formFormRef = ref() 声明。Vue 挂载时，会自动将 <el-form> 的组件实例赋值给它。 -->
  <el-form ref="formFormRef" :model="formData">
    <el-row :gutter="20">
      <!-- item 数据来源于dashboard.vue的formItems -->
      <template v-for="item in formItemAtter" :key="item.prop">
        <el-col v-bind="item.col">
          <!-- :prop="item.prop"表单校验 -->
          <!-- 比如你想让「文章标题不能为空」，表单必须通过 prop="title" 找到 formData.title 去检查对错。 -->
          <el-form-item :label="item.label" :prop="item.prop">
            <template v-if="item.comp === 'input'">
              <el-input v-model="formData[item.prop]" :placeholder="item.placeholder" />
            </template>
            <!-- 文章分类 -->
            <template v-else-if="item.comp === 'select'">
              <el-select v-model="formData[item.prop]" :placeholder="item.placeholder">
                <el-option
                  v-for="option in item.options ?? []"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <!-- 数据来自于dashboard.vue中的  formItems.value[1].options = categories.value  和 const formItems = ref([ -->

              <!--静态 status：在父组件定义时就有 options，所以 TableSearch 首次渲染时即能生成这些 el-option，下拉立即可见。  -->
              <!--动态 categoryId：首次渲染时 item.options 可能为空（显示 “No data”）；当 categoryOption() 返回并执行 formItems.value[1].options = categories.value，因为 formItems 是 ref（响应的），Vue 会检测到这次属性修改并重新渲染，el-option 列表随之出现。 -->
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
