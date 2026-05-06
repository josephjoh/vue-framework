<template>
  <RouterView />
  <Toaster />
</template>

<script setup lang="ts">
  import { Toaster } from '@/components/ui/sonner'
  // import { onMounted } from 'vue'
  // import { useAuthStore } from '@/stores/auth'

  // const authStore = useAuthStore()
  // onMounted(async () => {
  //   await authStore.initAuth() // 쿠키 유효성 서버 검증 후 user 세팅
  // })
</script>
