<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
    <h1 class="text-8xl font-extrabold text-primary-600">404</h1>
    <p class="mt-4 text-xl font-semibold text-gray-800">페이지를 찾을 수 없습니다</p>
    <p class="mt-2 text-sm text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
    <div class="mt-8 flex gap-3">
      <Button variant="secondary" @click="router.back()">뒤로가기</Button>
      <Button @click="router.push('/')">홈으로</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Button } from '@/components/ui/button'

  const router = useRouter()
</script>
