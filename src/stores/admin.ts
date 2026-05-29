import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
  const isAdmin = ref(false)
  const toggleAdmin = () => {
    isAdmin.value = !isAdmin.value
  }
  return { isAdmin, toggleAdmin }
})
