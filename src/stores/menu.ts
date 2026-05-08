import { defineStore } from 'pinia'
import { ref } from 'vue'
import { menuApi } from '@/api/services/menu'
import type { MenuItems } from '@/types/menu'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuItems[]>([])
  const isLoading = ref(false)

  async function fetchMenus(role?: string) {
    isLoading.value = true
    try {
      const res = await menuApi.getMenus(role)
      menus.value = res.menus
    } finally {
      isLoading.value = false
    }
  }

  function clearMenus() {
    menus.value = []
  }

  return { menus, isLoading, fetchMenus, clearMenus }
})
