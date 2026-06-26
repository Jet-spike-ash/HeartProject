import { ref } from 'vue'
import { defineStore } from 'pinia'

// 侧边栏折叠状态（isAdmin）
export const useAdminStore = defineStore('admin', () => {
  const isAdmin = ref(false)
  const toggleAdmin = () => {
    isAdmin.value = !isAdmin.value
  }
  return { isAdmin, toggleAdmin }
})
