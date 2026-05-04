<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        안녕하세요, {{ authStore.user?.name ?? '사용자' }}님!
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Vue Framework 공통 프레임워크에 오신 것을 환영합니다.
      </p>
    </div>

    <!-- 컴포넌트 데모 -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="mb-4 text-lg font-semibold text-gray-800">공통 컴포넌트 데모</h2>
      <div class="flex flex-wrap gap-3">
        <Button @click="toast.success('성공 메시지입니다!')">성공 Toast</Button>
        <Button variant="destructive" @click="toast.error('오류 메시지입니다!')">에러 Toast</Button>
        <Button variant="secondary" @click="toast.warning('경고 메시지입니다!')">경고 Toast</Button>
        <Button variant="ghost" @click="toast.info('안내 메시지입니다.')">정보 Toast</Button>
        <Button variant="secondary" @click="showModal = true">모달 열기</Button>
      </div>
    </div>

    <!-- Modal 예시 -->
    <Dialog v-model:open="showModal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예시 모달</DialogTitle>
        </DialogHeader>
        <p class="text-gray-700">이것은 shadcn-vue Dialog 컴포넌트 예시입니다.</p>
        <DialogFooter>
          <Button variant="secondary" @click="showModal = false">취소</Button>
          <Button
            @click="
              () => {
                toast.success('확인 버튼 클릭!')
                showModal = false
              }
            "
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useToast } from '@/composables/useToast'
  import { Button } from '@/components/ui/button'
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'

  const authStore = useAuthStore()
  const toast = useToast()
  const showModal = ref(false)

  console.log('base_url >> ', import.meta.env.VITE_API_BASE_URL)
</script>
