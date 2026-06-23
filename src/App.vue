<template>
  <RouterView />
  <Toaster />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
onMounted(async () => {
  await authStore.initAuth() // 전체 메뉴 적재 + 쿠키 검증 + 사용자 메뉴 재적재
})
</script>
