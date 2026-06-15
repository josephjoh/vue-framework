<template>
  <Dialog :open="isWarningVisible">
    <DialogContent :show-close-button="false" class="max-w-sm text-center">
      <DialogHeader>
        <DialogTitle>세션 만료 안내</DialogTitle>
        <DialogDescription>
          장시간 사용하지 않으셨습니다.<br />
          <span class="font-semibold text-destructive">{{ formattedCountdown }}</span> 후 자동 로그아웃됩니다.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter class="flex-col gap-2 sm:flex-col">
        <Button class="w-full" @click="extendSession">세션 연장</Button>
        <Button variant="outline" class="w-full" @click="forceLogout">로그아웃</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { useSessionTimeout } from '@/composables/useTimeout'

  const { isWarningVisible, countdown, extendSession, forceLogout } = useSessionTimeout()

  const formattedCountdown = computed(() => {
    const m = Math.floor(countdown.value / 60)
    const s = countdown.value % 60
    return m > 0 ? `${m}분 ${s}초` : `${s}초`
  })
</script>
