<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-primary-600">vue-framework</h1>
        <p class="mt-1 text-sm text-gray-500">계정에 로그인하세요</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleLogin">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700" for="napId">napId</label>
          <Input
            id="napId"
            v-model="form.napId"
            type="text"
            placeholder="napId를 입력하세요"
            :aria-invalid="!!errors.napId"
            required
          />
          <p v-if="errors.napId" class="text-sm text-destructive">{{ errors.napId }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700" for="napNm">napNm</label>
          <Input
            id="napNm"
            v-model="form.napNm"
            type="text"
            placeholder="napNm을 입력하세요"
            :aria-invalid="!!errors.napNm"
            required
          />
          <p v-if="errors.napNm" class="text-sm text-destructive">{{ errors.napNm }}</p>
        </div>

        <Button type="submit" class="w-full" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { useAuth } from '@/composables/useAuth'
  import { useToast } from '@/composables/useToast'
  import { isRequired } from '@/utils/validators'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import type { LoginRequest } from '@/types'

  const { login } = useAuth()
  const toast = useToast()

  const form = reactive<LoginRequest>({ napId: '', napNm: '' })
  const errors = reactive<LoginRequest>({ napId: '', napNm: '' })
  const isLoading = ref(false)

  function validate(): boolean {
    errors.napId = ''
    errors.napNm = ''
    if (!isRequired(form.napId)) {
      errors.napId = 'napId를 입력해주세요.'
      return false
    }
    if (!isRequired(form.napNm)) {
      errors.napNm = 'napNm을 입력해주세요.'
      return false
    }
    return true
  }

  async function handleLogin() {
    if (!validate()) return
    isLoading.value = true
    try {
      await login({ ...form })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '로그인에 실패했습니다.')
    } finally {
      isLoading.value = false
    }
  }
</script>
