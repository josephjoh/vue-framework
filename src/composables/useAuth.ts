import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { LoginRequest } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userRole = computed(() => authStore.userRole)
  const userType = computed(() => authStore.userType)
  const memberType = computed(() => authStore.memberType)
  const isFullMember = computed(() => authStore.isFullMember)

  async function login(credentials: LoginRequest) {
    await authStore.login(credentials)

    const redirect = router.currentRoute.value.query.redirect as string | undefined

    if (authStore.user?.memberType === 'SEMI') {
      // 준회원: 정회원 인증 화면으로 이동 (원래 경로 보존)
      router.push({ name: 'MemberCert', query: { redirect: redirect ?? '/' } })
    } else {
      // 정회원: 원래 가려던 특정 페이지로 이동
      router.push(redirect ?? { name: 'Home' })
    }
  }

  async function logout() {
    await authStore.logout()
    router.push({ name: 'Login' })
  }

  return {
    isAuthenticated,
    user,
    userRole,
    userType,
    memberType,
    isFullMember,
    login,
    logout,
  }
}
