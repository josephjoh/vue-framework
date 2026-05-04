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

  async function login(credentials: LoginRequest) {
    await authStore.login(credentials)
    const redirect = router.currentRoute.value.query.redirect as string | undefined
    router.push(redirect || { name: 'Home' })
  }

  async function logout() {
    await authStore.logout()
    router.push({ name: 'Login' })
  }

  return {
    isAuthenticated,
    user,
    userRole,
    login,
    logout,
  }
}
