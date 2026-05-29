<template lang="">
  <el-aside width="isAdmin ? '64px' : '264px'" height="100%">
    <el-col style="height: 100%">
      <el-menu style="height: 100%" :collapse="isAdmin" :collapse-transition="false">
        <div class="brand" v-show="!isAdmin">
          <el-image
            style="width: 60px; height: 60px; margin-right: 25px"
            :src="imgurl1"
            alt="logo"
          ></el-image>
          <div class="title">
            <h1 class="big-title">心理健康助手</h1>
            <p class="small-title">管理后台</p>
          </div>
        </div>
        <el-sub-menu
          v-for="items in router.options.routes[0].children"
          :key="items.path"
          :index="items.path"
          @click="routerConnect(items)"
        >
          <template #title>
            <el-icon><component :is="items.meta.icon"></component></el-icon>
            <span>{{ items.meta.title }}</span>
          </template>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-aside>
</template>
<script setup="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
const router = useRouter()
const routerConnect = (item) => {
  console.log(item, 'item')
  const currentRoute = router.options.routes[0]
  router.push(`${currentRoute.path}/${item.path}`)
}
console.log(router, 'router')

const imgurl1 = new URL('@/assets/images/logo.png', import.meta.url).href

// 计算属性，获取 adminStore 中的 isAdmin 状态
const isAdmin = computed(() => useAdminStore().isAdmin)
</script>
<style lang="scss">
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  .title {
    .big-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #1f2937;
    }
    .small-title {
      font-size: 14px;
      color: #6b7280;
    }
  }
}
</style>
