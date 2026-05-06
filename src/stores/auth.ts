import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/services/auth'
import { useMenuStore } from '@/stores/menu'
import type { User, LoginRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role ?? '1')

  async function login(credentials: LoginRequest) {
    // TODO: 백엔드 응답 구조 확인 후 복원
    // const response = await authApi.login(credentials)
    // user.value = response.user // 서버가 Set-Cookie로 토큰 생성

    // 임시 mock
    void credentials
    user.value = {
      id: 1,
      name: '테스트 사용자',
      email: 'test@example.com',
      role: '1',
      createdAt: new Date().toISOString(),
    }
    await useMenuStore().fetchMenus(user.value.role)
  }

  async function logout() {
    try {
      await authApi.logout() // 서버가 쿠키 삭제
    } finally {
      _clearAuth()
      useMenuStore().clearMenus()
    }
  }

  async function fetchMe() {
    user.value = await authApi.me()
  }

  async function initAuth() {
    try {
      await fetchMe() // 쿠기 자동 전송으로 유효성 검증
    } catch {
      // 쿠키 만료 -> refresh 시도
      try {
        await authApi.refresh() // 쿠키 자동 전송
        await fetchMe()
      } catch {
        _clearAuth() // 만료 -> 비인증상태
      }
    }
  }

  function _clearAuth() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    userRole,
    login,
    logout,
    fetchMe,
    initAuth,
    clearAuth: _clearAuth
  }
}, {
  persist: true
})
