<template>
  <header class="border-b border-gray-200 bg-white shadow-sm">
    <div
      class="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-primary-600">
        <svg class="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        </svg>
        {{ appName }}
      </router-link>

      <!-- User area -->
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
        <Button variant="secondary" size="sm" @click="handleLogout">로그아웃</Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'
  import { Button } from '@/components/ui/button'

  const authStore = useAuthStore()
  const router = useRouter()
  const appName = import.meta.env.VITE_APP_NAME || 'vue-framework'

  async function handleLogout() {
    await authStore.logout()
    router.push({ name: 'Login' })
  }
</script>
