<template>
  <!--
    数据流第 1 步：父组件 dashboard.vue 用 <AddDialogs v-model:modelValue="dialogVisible" /> 控制弹窗显示。
    这里不要直接修改 props.modelValue，而是使用下面脚本里的 dialogVisible 计算属性，
    它会通过 emit('update:modelValue', false) 通知父组件关闭弹窗。
  -->
  <el-dialog
    title="新增文章"
    v-model="dialogVisible"
    width="70%"
    :before-close="handleBeforeClose"
    class="add-article-dialog"
  >
    <!--
      数据流第 2 步：用户在表单中输入的内容，都会通过 v-model 存进 form。
      例如：文章标题输入框 -> form.title，摘要输入框 -> form.summary，正文输入区 -> form.content。
      后续接新增文章接口时，只需要把 handleSubmit 里的 payload 发给后端即可。
    -->
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="add-article-form"
    >
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
        <el-select v-model="form.categoryId" placeholder="请选择分类" class="form-control-full">
          <!--
            数据来源：dashboard.vue 先请求分类接口 categoryOption()，
            再把分类数组通过 :categories="categories" 传给当前组件。
            当前组件只负责展示这些分类，并把用户选中的 id 存入 form.categoryId。
          -->
          <el-option
            v-for="item in props.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="form.summary"
          type="textarea"
          placeholder="请输入文章摘要（可选）"
          maxlength="1000"
          show-word-limit
          :rows="4"
        />
      </el-form-item>

      <el-form-item label="标签" prop="tagArry">
        <el-select
          v-model="form.tagArry"
          multiple
          filterable
          allow-create
          placeholder="请输入或选择标签"
          class="form-control-full"
        >
          <!-- 标签是前端预设的，也允许用户手动输入新标签。 -->
          <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>

      <el-form-item label="封面图片" prop="coverImage">
        <!--
          数据流第 3 步：用户选择图片 -> beforeUpload 做类型/大小校验 -> handleUpload 调上传接口。
          上传接口返回图片路径后，handleUpload 会同时更新：
          1. imageURL：只负责页面预览图片。
          2. form.coverImage：负责将来提交给新增文章接口。
        -->
        <div class="cover-row">
          <div class="cover-upload">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="handleUpload"
              accept="image/*"
            >
              <div v-if="!imageURL" class="cover-placeholder">
                <p>点击上传封面</p>
              </div>
              <img v-else :src="imageURL" class="cover-image" alt="封面图片" />
            </el-upload>
          </div>

          <!--
            移除图片的数据流：
            点击按钮 -> handleRemoveCover() -> 清空 imageURL 和 form.coverImage。
            imageURL 清空后，页面重新显示“点击上传封面”；form.coverImage 清空后，提交文章时不会带旧封面地址。
          -->
          <el-button v-if="imageURL" type="danger" plain @click="handleRemoveCover">
            移除图片
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="文章内容" prop="content" required>
        <div class="editor-box">
          <!--
            这里先做一个轻量的“富文本编辑器外观”。
            这些按钮会往正文 textarea 里插入简单标记，方便新手理解：
            点击按钮 -> insertContentText 修改 form.content -> textarea 自动显示变化。
            后续如果要接 wangEditor / Quill，也只需要把编辑器内容同步到 form.content。
          -->
          <div class="editor-toolbar">
            <button type="button" @click="insertContentText('**加粗文字**')">B</button>
            <button type="button" @click="insertContentText('*斜体文字*')"><i>I</i></button>
            <button type="button" @click="insertContentText('<u>下划线文字</u>')"><u>U</u></button>
            <button type="button" @click="insertContentText('> 引用内容\n')">“</button>
            <button type="button" @click="insertContentText('[链接文字](https://)')">Link</button>
            <button type="button" @click="insertContentText('\n# 一级标题\n')">H1</button>
            <button type="button" @click="insertContentText('\n## 二级标题\n')">H2</button>
            <button type="button" @click="insertContentText('\n### 三级标题\n')">H3</button>
            <button type="button" @click="insertContentText('\n- 列表项\n')">UL</button>
            <button type="button" @click="insertContentText('\n1. 列表项\n')">OL</button>
          </div>

          <el-input
            v-model="form.content"
            type="textarea"
            class="content-editor"
            placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容。"
            :rows="18"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存并关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fileInfo } from '@/api/admin'
import { fileRoadURL } from '@/config/index.js'

// ------------------------------
// 1. 父子组件通信
// ------------------------------
// props 是父组件传进来的数据：
// - modelValue：控制弹窗是否显示。
// - categories：分类下拉框的数据，来自 dashboard.vue 调用分类接口后的结果。
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

// emit 用来“通知父组件”。
// 当前组件不能自己直接修改 props.modelValue，所以关闭弹窗时要通知父组件改 dialogVisible。
const emit = defineEmits(['update:modelValue', 'submit'])

// Element Plus 的 el-dialog 使用 v-model 时，需要一个可读可写的变量。
// get：父组件传进来的 modelValue 变了，弹窗跟着变。
// set：弹窗内部关闭时，把新值发回父组件。
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 表单组件实例，用来调用 validate() 校验必填项。
const formRef = ref(null)

// ------------------------------
// 2. 表单数据：页面上所有输入最终都汇总到 form
// ------------------------------
const form = reactive({
  title: '',
  categoryId: '',
  summary: '',
  tagArry: [],
  tags: '',
  coverImage: '',
  content: '',
  id: '',
})

// 表单校验规则：点击“保存并关闭”时会先检查这些规则。
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题不能超过200个字符', trigger: 'blur' },
  ],
  categoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
})

// 标签候选项：页面会展示这些，也允许用户自己输入新标签。
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

// imageURL 只用于封面预览；真正提交给后端的是 form.coverImage。
const imageURL = ref('')

// ------------------------------
// 3. 弹窗关闭与表单重置
// ------------------------------
const handleBeforeClose = (done) => {
  handleCancel()
  done?.()
}

const resetForm = () => {
  form.title = ''
  form.categoryId = ''
  form.summary = ''
  form.tagArry = []
  form.tags = ''
  form.coverImage = ''
  form.content = ''
  form.id = ''
  imageURL.value = ''
  formRef.value?.clearValidate?.()
}

const handleCancel = () => {
  resetForm()
  dialogVisible.value = false
}

// ------------------------------
// 4. 上传封面图片
// ------------------------------
// 后端上传接口的返回字段可能不完全一样，所以这里做兼容：
// 如果返回 filePath/url/path，或者包在 data 里面，都能取到。
const getUploadFilePath = (files) => {
  if (typeof files === 'string') return files
  return (
    files?.filePath || files?.url || files?.path || files?.data?.filePath || files?.data?.url || ''
  )
}

// 如果后端返回完整 http 地址，直接使用；如果只返回相对路径，就拼接服务器地址。
const resolveImageURL = (filePath) => {
  if (/^https?:\/\//.test(filePath)) return filePath
  return `${fileRoadURL}/${String(filePath).replace(/^\/+/, '')}`
  // 自动消除 filePath 开头多余斜杠，避免出现 base//file 这种双斜杠 URL，防止资源 404。
}
//清空图片
const handleRemoveCover = () => {
  imageURL.value = ''
  form.coverImage = ''
  ElMessage.success('已移除封面图片')
}

const handleUpload = async ({ file }) => {
  try {
    const businessId = window.crypto.randomUUID()
    const files = await fileInfo(file, { businessId })
    const filePath = getUploadFilePath(files)

    if (!filePath) {
      ElMessage.error('上传成功，但未获取到图片地址')
      return
    }

    imageURL.value = resolveImageURL(String(filePath))
    form.coverImage = imageURL.value
    ElMessage.success('封面上传成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('封面图片上传失败')
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

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

// ------------------------------
// 5. 正文编辑与提交
// ------------------------------
const insertContentText = (text) => {
  form.content = `${form.content || ''}${text}`
}

const buildSubmitPayload = () => {
  // 数据流第 4 步：点击保存时，把页面 form 整理成后端需要的 payload。
  // tagArry 是数组，方便 el-select 多选；tags 是字符串，方便后端保存。
  form.tags = form.tagArry.join(',')

  return {
    id: form.id,
    title: form.title,
    categoryId: form.categoryId,
    summary: form.summary,
    tags: form.tags,
    coverImage: form.coverImage,
    content: form.content,
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate?.().catch(() => false)
  if (!valid) return

  const payload = buildSubmitPayload()

  // 这里先不直接调用新增文章接口，因为你还没给新增文章的 Apifox 路径。
  // 等接口确定后，可以在这里 import createArticle，然后 createArticle(payload)。
  emit('submit', payload)
  console.log('新增文章提交数据：', payload)
  ElMessage.success('表单已整理完成，等待接入新增文章接口')
  handleCancel()
}
</script>

<style scoped>
.add-article-form {
  max-height: 75vh;
  overflow: auto;
  padding-right: 12px;
}

.form-control-full,
.editor-box {
  width: 100%;
}

.cover-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.cover-upload {
  width: 240px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e5e9ef;
  color: #8f9aa7;
  background: #f6fafb;
  cursor: pointer;
}

.cover-upload:hover {
  border-color: #409eff;
  color: #409eff;
}

.avatar-uploader,
.cover-placeholder {
  width: 100%;
  height: 100%;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.editor-box {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  min-height: 58px;
  padding: 10px 14px;
  border-bottom: 1px solid #edf0f5;
  background: #fbfcfd;
}

.editor-toolbar button {
  min-width: 36px;
  height: 32px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #7b8794;
  cursor: pointer;
  font-weight: 700;
}

.editor-toolbar button:hover {
  background: #edf3ff;
  color: #409eff;
}

.content-editor :deep(.el-textarea__inner) {
  min-height: 420px !important;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  resize: vertical;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
