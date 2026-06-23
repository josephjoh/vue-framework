import { defineStore } from 'pinia'
import { ref } from 'vue'
import { menuApi } from '@/api/services/menu'
import type { MenuItems } from '@/types/menu'
import type { UserRole, UserType } from '@/types/auth'

export const useMenuStore = defineStore('menu', () => {
  const allMenus = ref<MenuItems[]>([]) // 전체 메뉴 원본 (최초 접속 시 적재)
  const menus = ref<MenuItems[]>([])    // 현재 사용자에게 보여줄 메뉴
  const isLoading = ref(false)

  // ① 최초 접속: 전체 메뉴 로드 (서버 통신 O)
  async function fetchAllMenus() {
    isLoading.value = true
    try {
      const res = await menuApi.getAllMenus()
      allMenus.value = res.menus
      menus.value = res.menus // 비로그인 상태: 전체 메뉴 표시
    } finally {
      isLoading.value = false
    }
  }

  // ② 로그인 후: 사용자 유형에 따라 메뉴 결정
  async function loadMenusForUser(userType: UserType, userRole?: UserRole) {
    if (userRole === 'DLGE') {
      // 수임자: 서버 API 재통신 (수임 범위 메뉴만 반환)
      isLoading.value = true
      try {
        const res = await menuApi.getDelegateeMenus()
        menus.value = res.menus
      } finally {
        isLoading.value = false
      }
    } else {
      // 그 외 (개인·개인사업자·법인·위임자): userType으로 메모리 필터링
      menus.value = _filterByUserType(allMenus.value, userType)
    }
  }

  // 새로고침 등 allMenus 유실 시 복구
  async function recoverMenus(userType: UserType, userRole?: UserRole) {
    await fetchAllMenus()
    await loadMenusForUser(userType, userRole)
  }

  function clearMenus() {
    menus.value = allMenus.value
  }

  function _filterByUserType(list: MenuItems[], userType: UserType): MenuItems[] {
    return list
      .filter((m) => m.userGbn?.split(' ').includes(userType))
      .map((m) => ({
        ...m,
        children: m.children ? _filterByUserType(m.children, userType) : undefined,
      }))
  }

  return { allMenus, menus, isLoading, fetchAllMenus, loadMenusForUser, recoverMenus, clearMenus }
})
