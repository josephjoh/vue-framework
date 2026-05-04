import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { menuApi } from '@/api/services/menu'
import type { MenuItems } from '@/types/menu'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuItems[]>([])
  const isLoading = ref(false)

  // to(경로) → 허용 역할 목록 flat map (라우터 가드 권한 체크용)
  const permissionMap = computed(() => {
    const map = new Map<string, string[]>()
    buildMap(menus.value, map)
    return map
  })

  function buildMap(items: MenuItems[], map: Map<string, string[]>) {
    for (const item of items) {
      if (item.to && item.roles) {
        map.set(item.to, item.roles)
      }
      if (item.children?.length) {
        buildMap(item.children, map)
      }
    }
  }

  async function fetchMenu(role: string) {
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

  return { menus, isLoading, permissionMap, fetchMenu, clearMenus }
})
