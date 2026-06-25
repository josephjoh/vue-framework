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
      router.push({ name: 'MemberCert', query: { redirect: redirect ?? '/' } })
    } else {
      router.push(redirect ?? { name: 'Home' })
    }
  }

  async function logout() {
    await authStore.logout()
    router.push({ name: 'Login' })
  }

  async function upgradeMembership() {
    await authStore.upgradeMembership()
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    router.push(redirect ?? { name: 'Home' })
  }

  async function initAuth() {
    await authStore.initAuth()
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
    upgradeMembership,
    initAuth,
  }
}
