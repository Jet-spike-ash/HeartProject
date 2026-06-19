<template lang="">
  <div class="container">
    <div class="head-container">
      <el-icon><Back /></el-icon>
      <span>返回首页</span>
    </div>
    <div class="title-text">
      <h2>登录您的账户！</h2>
      <p>请输入您的账户信息以继续</p>
    </div>
    <div class="form-container">
      <el-form ref="loginForm" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或者邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名或者邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <div class="button-container">
          <el-button class="btn" type="primary" @click="submitForm(loginForm)">登录</el-button>
          <!-- <el-button type="text">忘记密码？</el-button> -->
        </div>
        <div class="footer-text">
          <p>没有账户？ <router-link to="/auth/register">立即注册</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="">
import { ref, reactive } from 'vue'
import { Back } from '@element-plus/icons-vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const loginForm = ref()

//登陆

// 创建一个router实例
const router = useRouter()
// 表单验证
// Vue 在渲染时，会把 <el-form> 组件的实例赋值给 formRef 这个变量。
// const submitForm = async (formEl) => {
//   //判断表单是否存在
//   if (!formEl) return
//   // 下为了检查rules中的验证规则是否都通过，如果通过则返回true，否则返回false
//   await formEl.validate((valid) => {
//     // 回调函数默认直接执行了，没有等login传入数据就直接开始执行下一步，所以需要用async await来等待login传入数据
//     if (valid) {
//       // login(formData) 调用 API
//       login(formData).then((data) => {
//         //判断token是否存在
//         if (!data.token) {
//           return console.error('登录失败')
//         }
//         //登陆成功，将token存储到localStorage中，保存token和用户信息
//         localStorage.setItem('token', data.token)
//         localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
//         //根据用户角色来决定的跳转页面
//         //后台人员admin data.userInfo.userType === 2
//         if (data.userInfo.userType === 2) {
//           router.push('/back/dashboard')
//         } else {
//           //用户登陆，等待改进
//         }
//       })
//     }
//   })
// }

const submitForm = async (formEl) => {
  // 1. 判断表单实例是否存在
  if (!formEl) return

  try {
    // 2. 纯 Promise 写法验证表单。如果不通过，会直接抛出异常进入 catch，不会往下走
    await formEl.validate()

    // 3. 表单验证通过，发起登录请求
    const data = await login(formData)

    // 4. 判断业务逻辑是否成功（是否返回 token）
    if (!data.token) {
      // 登录失败，给用户弹窗提示，并阻断后续代码执行
      ElMessage.error(data.message || '登录失败，请检查账号密码')
      return
    }

    // 5. 登录成功，存储信息
    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

    // 6. 根据角色跳转
    ElMessage.success('登录成功') // 给个成功提示体验更好
    if (data.userInfo.userType === 2) {
      router.push('/back/dashboard')
    } else {
      // 普通用户跳转逻辑，等待改进
      router.push('/')
    }
  } catch (error) {
    // 统一错误处理区
    // 如果是表单验证失败，error 是 false 或者包含验证字段的信息
    if (error === false) {
      ElMessage.warning('请完善表单信息')
    } else {
      // 如果是 API 请求失败（网络错误、服务器 500 等）
      console.error('请求出错:', error)
      ElMessage.error(error.message || '网络异常，请稍后重试')
    }
  }
}

const formData = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
</script>
<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 24px;
  background: #ffffff;
}

.head-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 460px;
  margin-bottom: 36px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}

.head-container span {
  color: #333333;
}

.title-text {
  width: 100%;
  max-width: 460px;
  text-align: center;
  margin-bottom: 36px;
}

.title-text h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #111111;
}

.title-text p {
  margin: 12px auto 0;
  color: #777777;
  font-size: 14px;
  line-height: 1.7;
}

.form-container {
  width: 100%;
  max-width: 460px;
  padding: 40px 32px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-form-item__label {
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.el-input {
  width: 100%;
}

.el-input__inner {
  border-radius: 10px;
  height: 46px;
}

.button-container {
  margin-top: 16px;
}

.btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
}

.footer-text {
  margin-top: 20px;
  text-align: center;
  color: #666666;
  font-size: 14px;
}

.footer-text a {
  color: #409eff;
  font-weight: 600;
}
</style>
