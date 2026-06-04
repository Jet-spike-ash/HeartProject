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
const loginForm = ref()

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      login(formData).then((data) => {
        //判断token是否存在
        if (!data.token) {
          return console.error('登录失败')
        }
        //将token存储到localStorage中
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
      })
    }
  })
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
