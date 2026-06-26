// Axios 封装：baseURL、拦截器、token 注入、错误处理
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 创建实例
const service = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
//在发送任何网络请求之前，拦截该请求，自动从本地存储中获取用户的身份凭证，并将其附加到请求头中，然后再将请求发送出去。
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

// config的内容：
// {
//   // 1. 核心地址（必填）
//   url: '/user',                          // 接口相对/绝对路径
//   baseURL: 'https://api.example.com/v1',// 基础地址，自动拼到 url 前

//   // 2. 请求方法
//   method: 'post',                         // get / post / put / delete / patch 等

//   // 3. 请求头（Token、Content-Type 等）
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: 'Bearer ' + token
//   },

//   // 4. URL 查询参数（拼在 ? 后，常用于 GET）
//   params: { id: 123, name: 'test' },

//   // 5. 请求体数据（POST/PUT/PATCH）
//   data: { username: 'admin', password: '123' },

//   // 6. 超时（毫秒，0=无超时）
//   timeout: 5000,

//   // 7. 跨域是否带 Cookie
//   withCredentials: false,

//   // 8. 响应数据类型
//   responseType: 'json', // arraybuffer / blob / document / text / stream

//   // 9. 身份认证（Basic Auth）
//   auth: { username: 'xxx', password: 'yyy' },

//   // 10. 取消请求
//   cancelToken: new CancelToken(cancel => {}),

//   // 11. 数据预处理
//   transformRequest: [data => data], // 请求前修改 data
//   transformResponse: [data => data] // 响应后修改 data
// }

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    //response就是后端里一层一层又一层的数据
    // 对响应数据做点什么
    const { data, config } = response
    if (data.code === '200') {
      return data.data // 返回响应数据
      //先取出后端返回的核心数据（脱掉 axios 的外衣）
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
