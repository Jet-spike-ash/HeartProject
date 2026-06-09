<template lang="">
  <div>
    <PageHead title="数据分析">
      <template #button>
        <el-button type="primary" color="#fff" @click="handleAdd">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItems="formItems" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" width="200" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><Timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><Timer /></el-icon>
            <span>{{ categoryMaps[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150"> </el-table-column>
      <el-table-column prop="readCount" label="阅读量" width="150"> </el-table-column>
      <el-table-column prop="updatedAt" label="发布时间" width="200"> </el-table-column>
      <el-table-column label="管理" width="250" fixed="right">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button text type="primary">编辑</el-button>
            <el-button v-if="scope.row.status !== 3" text type="danger">删除</el-button>
            <el-button v-if="scope.row.status === 1 || scope.row.status === 0" text type="success"
              >发布</el-button
            >
            <el-button v-if="scope.row.status === 2" text type="warning">下线</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :page-size="pagination.size"
      :total="pagination.total"
      @change="handlePageChange"
      style="margin-top: 20px; display: flex; justify-content: left"
    />
    <AddDialogs v-model:modelValue="dialogVisible" />
  </div>
</template>
<script setup="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryOption, articleList } from '@/api/admin'
import { Timer } from '@element-plus/icons-vue'
import AddDialogs from '@/components/AddDialogs.vue'

const formItems = [
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  {
    comp: 'select',
    prop: 'categoryId',
    label: '分类',
    placeholder: '请选择分类',
  },
  {
    comp: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '0' },
      { label: '草稿', value: 1 },
      { label: '已发布', value: 2 },
      { label: '已删除', value: 3 },
    ],
  },
]

//定义一个tableData的响应式对象，用于存储表格数据
const tableData = ref([])
//用ref定义一个响应式对象，存储表格数据，初始值是一个空数组。tableData.value就是表格数据，可以在组件中使用tableData.value来访问和修改表格数据。

//分页数据和业务数据？进行一个封装，分页数据是后端返回的，业务数据是前端需要展示的。分页数据包含了总条数、当前页码、每页条数等信息，业务数据包含了具体的文章列表等信息。我们可以将分页数据和业务数据封装成一个对象，方便在组件中使用。
const pagination = reactive({
  total: 0,
  currentPage: 1,
  size: 10,
})

const dialogVisible = ref(false)

//点击新增按钮，显示添加文章的对话框
const handleAdd = () => {
  dialogVisible.value = true
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}

//定义后在这里面（因为点击要查询的时候需要访问数据，还有onmount的时候也要查询）
const handleSearch = async (formData) => {
  //封装params对象，包含了分页数据和表单数据
  const params = {
    ...pagination,
    ...formData,
    //...扩展运算符，将pagination对象和formData对象的属性合并成一个新的对象，作为请求参数发送给后端
  }

  //调用接口，获取文章列表数据
  const { records, total } = await articleList(params)
  tableData.value = records
  pagination.total = total
}

// ref([]) 定义的是一个响应式的数组，不是普通对象。别用数组去存键值对映射，数组不是干这个的。
const categoryMaps = reactive({}) // 用reactive定义一个响应式对象，用于存储分类id和分类名称的映射关系

const categories = ref([])

onMounted(async () => {
  const data = await categoryOption()
  //map一个新的数组，返回label和value

  categories.value = data.map((item) => {
    categoryMaps[item.id] = item.categoryName

    //映射成一个新的对象，key是item.id，value是item.categoryName
    //将item.id作为一个key，item.categoryName作为value存储到categoryMaps中
    return {
      label: item.categoryName,
      value: item.id,
    }
  })
  formItems[1].options = categories.value

  //调用方法获取文章列表数据
  handleSearch()
  //在 onMounted 里调用 handleSearch()，是为了页面一加载就自动把文章列表显示出来。
})
</script>
<style lang=""></style>
