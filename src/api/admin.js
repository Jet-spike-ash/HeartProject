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
