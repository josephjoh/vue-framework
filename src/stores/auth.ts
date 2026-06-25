import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/services/auth'
import { useMenuStore } from '@/stores/menu'
import type { User, LoginRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.userRole)
  const userType = computed(() => user.value?.userType ?? 'INDV')
  const memberType = computed(() => user.value?.memberType ?? 'SEMI')
  const isFullMember = computed(() => user.value?.memberType === 'FULL')

  async function login(credentials: LoginRequest) {
    // TODO: 백엔드 응답 구조 확인 후 복원
    // const response = await authApi.login(credentials)
    // user.value = response.user

    // 임시 mock — memberType 'SEMI'/'FULL' 변경으로 분기 테스트 가능
    void credentials
    user.value = {
      id: 1,
      name: '테스트 사용자',
      email: 'test@example.com',
      userType: 'INDV',
      memberType: 'SEMI',
      createdAt: new Date().toISOString(),
    }
    const menuStore = useMenuStore()
    if (menuStore.allMenus.length === 0) {
      await menuStore.recoverMenus(user.value.userType, user.value.userRole)
    } else {
      await menuStore.loadMenusForUser(user.value.userType, user.value.userRole)
    }
  }

  async function upgradeMembership() {
    // TODO: 실제 API 연동 시 복원
    // await authApi.upgradeMembership()
    if (user.value) {
      user.value = { ...user.value, memberType: 'FULL' }
    }
  }

  async function logout() {
    try {
      await authApi.logout() // 서버가 쿠키 삭제
    } finally {
      _clearAuth()
      useMenuStore().clearMenus()
    }
  }

  async function initAuth() {
    if (user.value) {
      await useMenuStore().recoverMenus(user.value.userType, user.value.userRole)
    } else {
      await useMenuStore().fetchAllMenus()
    }
  }

  function _clearAuth() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    userRole,
    userType,
    memberType,
    isFullMember,
    login,
    upgradeMembership,
    logout,
    initAuth,
    clearAuth: _clearAuth,
  }
}, {
  persist: true,
})
