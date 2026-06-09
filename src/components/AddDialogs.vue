<template lang="">
  <el-dialog title="添加文章" v-model="props.modelValue" width="50%" @close="handleClose">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="文章标题">
        <el-input v-model="form.name" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="所属分类">
        <el-select v-model="form.region" placeholder="请选择分类">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布日期">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" placeholder="Pick a time" style="width: 100%" />
        </el-col>
      </el-form-item>
      <el-form-item label="文章摘要">
        <el-input v-model="form.desc" type="textarea" placeholder="请输入文章摘要" />
      </el-form-item>
    </el-form>

    <!-- 不能删除 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleClose">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="">
import { reactive } from 'vue'

const form = reactive({})

const handleClose = () => {
  emit('update:modelValue', false)
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
</script>
<style lang="css"></style>
