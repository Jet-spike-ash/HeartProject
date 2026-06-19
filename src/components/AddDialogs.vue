<template>
  <el-dialog
    title="新增文章"
    v-model="props.modelValue"
    width="70%"
    :before-close="handleBeforeClose"
  >
    <!-- 整体表单容器，使用 Element Plus 的栅格布局近似图片样式 -->
    <el-form :model="form" :rules="rules" label-width="120px" class="add-article-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文章标题" prop="title" required>
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
              maxlength="200"
              show-word-limit
              clearable
            />
          </el-form-item>

          <el-form-item label="所属分类" prop="categoryId" required>
            <el-select v-model="form.categoryId" placeholder="请选择所属分类">
              <!-- 在dashboard中定义了新的映射：  代码140行 -->
              <el-option
                v-for="item in props.categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="标签" prop="tags">
            <!-- 可输入或选择多个标签 -->
            <el-select
              v-model="form.tagArry"
              multiple
              filterable
              allow-create
              placeholder="请输入或选择标签"
            >
              <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
            </el-select>
          </el-form-item>

          <el-form-item label="封面图片">
            <div class="cover-upload">
              <el-upload
                class="avatar-uploader"
                action="#"
                :before-upload="beforeUpload"
                :http-request="handleUpload"
                accept="image/*"
              >
                <div v-if="!imageURL" class="cover-placeholder">
                  <p>点击上传封面</p>
                </div>
                <img v-else :src="imageURL" class="cover-image" alt="图片" />
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 
      底部操作按钮
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存并关闭</el-button>
        </span>
      </template> -->
    </el-form>
  </el-dialog>
</template>

<script setup lang="">
// import { getRandomValues } from 'crypto'
import { ElMessage } from 'element-plus'
import { fileInfo } from '@/api/admin'
import { reactive, ref } from 'vue'
import crypto from 'crypto'
import axios from 'axios'
import { fileRoadURL } from '@/config/index.js'

// 获取父组件传递的值

// 组件接收的 props（是否显示对话框）
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
})

// 触发父组件事件：用于控制对话框显隐
const emit = defineEmits(['update:modelValue'])

// 表单数据结构：把需要持久化的字段都放在这里
const form = reactive({
  title: '',
  content: '',
  coverImage: '',
  categoryId: 1,
  summary: '',
  tags: '',
  id: '',
})

//定义rules
const rules = reactive({
  title: [
    {
      required: 'true',
      message: '请输入文章标题',
      trigger: 'blur',
    },
    {
      max: 200,
      message: '文章标题不能超过200个字符',
      trigger: 'blur',
    },
  ],
})

// 定义新增中的标签
const tagOptions = ref([
  '情绪管理',
  '焦虑',
  '压力',
  '睡眠',
  '冥想',
  '正念',
  '放松',
  '心理健康',
  '自我成长',
  '人际关系',
  '工作压力',
  '学习方法',
  '生活技巧',
])

//定义一个图片url路劲
const imageURL = ref('')

//定义一个上传图片时候的方法
const handleUpload = async ({ file }) => {
  //创建UUID
  const bussinessId = window.crypto.randomUUID()
  //图片这里id返回的是字符串
  //用一个fileRoadURL来拼接 服务器（地址）+ bussinessId+文件名
  console.log(bussinessId)
  const files = await fileInfo(file, { bussinessId: bussinessId })
  console.log(files)
  imageURL.value = `${fileRoadURL}/${files.filePath}`
}

//定义一个上传图片之前的方法
const beforeUpload = (file) => {
  console.log(file)
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1014 / 1014 < 5
  if (!isImage) {
    ElMessage.error('上传封面图片，请选择图片文件')
    return false
  }

  if (!isLt5M) {
    ElMessage.error('上传封面图片，图片大小不能超过5MB')
    return false
  }

  return true
}
</script>

<style scoped>
.add-article-form {
  max-height: 75vh;
  overflow: auto;
}
.cover-box {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #eaeaea;
  color: #999;
  background: #fafafa;
}
.cover-preview {
  max-width: 100%;
  max-height: 180px;
  display: block;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cover-upload {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #eaeaea;
  color: #999;
  background: #fafafa;
  cursor: pointer;
}

.cover-upload:hover {
  border-color: #409eff;
  color: #409eff;
}
</style>
