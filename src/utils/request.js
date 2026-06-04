import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建实例
const service = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token') // 从本地存储获取token
    if (token) {
      config.headers['token'] = token // 将token添加到请求头
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data, config } = response
    if (data.code === '200') {
      return data.data // 返回响应数据
    } else {
      if (data.code === '-1') {
        if (!config.url?.includes('/login')) {
          ElMessage.error(data.msg || '登录状态已过期，请重新登录') // 显示错误消息

          // 清除本地存储中的token
          localStorage.removeItem('token')
          //清除用户信息
          localStorage.removeItem('userInfo')
          window.location.href = './auth/login' // 跳转到登录页
        } else {
          ElMessage.error(data.msg || '登录失败') // 显示错误消息
          return Promise.reject('网络登录失败') // 返回一个错误对象
        }
      }
    }
    return response
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

// 导出请求方法
export default service
