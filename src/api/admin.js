import service from '@/utils/request'

// 获取管理员列表
export function login(data) {
  return service.post('/user/Login', data)
}
