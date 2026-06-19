import service from '@/utils/request'

// 获取管理员列表
export function login(data) {
  return service.post('/user/login', data)
}

//获取分类
export function categoryOption() {
  return service.get('/knowledge/category/tree')
}

// 获取文章列表
export function articleList(params) {
  return service.get('/knowledge/article/page', { params })
}

//获取文件信息
export function fileInfo(file, businessInfo) {
  // 创建一个 FormData 实例，并将文件信息放入
  const formData = new FormData()
  formData.append('file', file)
  // 与调用处保持字段名一致（bussinessId）
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  // 让浏览器/axios 自动设置 Content-Type（包括 boundary）
  return service.post('/file/upload', formData)
}
