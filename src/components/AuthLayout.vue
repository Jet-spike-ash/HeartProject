<!-- 登录/注册布局（左品牌区 + 右表单区） -->
<template>
  <div class="auth-layout">
    <div class="left-section">
      <div class="content">
        <h2 class="title">心理AI助手</h2>
        <p class="text">
          每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天
        </p>
        <div class="robot">
          <el-image style="width: 100px; height: 100px" :src="imgurl2" alt="心理AI助手" />
        </div>
      </div>
    </div>
    <div class="right-section">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup="ts">
const imgurl2 = new URL('@/assets/images/LoginLogo.png', import.meta.url).href
</script>
<style lang="scss" scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
}

.left-section {
  flex: 1;
  background: linear-gradient(180deg, #5fa68a 0%, #4a8d74 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.content {
  width: 100%;
  max-width: 420px;
  text-align: center;
  color: #ffffff;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 14px;
}

.text {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.92);
}

.robot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.robot img,
.robot .el-image__inner {
  width: 100px;
  height: 100px;
}

.right-section {
  flex: 1;
  padding: 40px 32px;
  background-color: #ffffff;
}
</style>
