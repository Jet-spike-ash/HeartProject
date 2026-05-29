<template lang="">
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="handleToggle">
        <el-icon><Expand /></el-icon>
      </el-button>
      <span class="page-title">心情日记</span>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="user-trigger">
          <el-avatar icon="User" />
          <p class="user-name">管理员</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup="ts">
import { useAdminStore } from '@/stores/admin'

const handleCommand = (command) => {
  if (command === 'profile') {
    // 跳转到个人中心
  } else if (command === 'settings') {
    // 跳转到设置页面
  } else if (command === 'logout') {
    // 执行退出登录操作
  }
}

const handleToggle = () => {
  //实例化 adminStore 并调用 toggleAdmin 方法
  useAdminStore().toggleAdmin()
}
</script>
<style lang="css">
.navbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
}

.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  margin-left: 20px;
  font-size: 26px;
  font-weight: bold;
  color: #1f2937;
}

.user-name {
  margin-left: 10px;
  font-size: 16px;
  color: #090909;
}

.user-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
