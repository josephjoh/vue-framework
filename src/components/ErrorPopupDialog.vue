<template>
  <Dialog :open="store.isVisible">
    <DialogContent :show-close-button="false" class="max-w-sm">
      <DialogHeader>
        <DialogTitle>{{ store.title }}</DialogTitle>
        <DialogDescription>{{ store.message }}</DialogDescription>
      </DialogHeader>

      <p v-if="store.detail" class="text-muted-foreground text-sm">{{ store.detail }}</p>

      <DialogFooter>
        <Button class="w-full" @click="store.hide()">확인</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { useErrorPopupStore } from '@/stores/errorPopup'

  const store = useErrorPopupStore()
</script>
