<template>
  <RouterView />
  <Toaster />
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { initAuth } = useAuth()
onMounted(async () => {
  await initAuth() // 전체 메뉴 적재 + 쿠키 검증 + 사용자 메뉴 재적재
})
</script>
