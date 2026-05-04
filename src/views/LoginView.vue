<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-primary-600">vue-framework</h1>
        <p class="mt-1 text-sm text-gray-500">계정에 로그인하세요</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleLogin">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700" for="email">이메일</label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            :aria-invalid="!!errors.email"
            required
          />
          <p v-if="errors.email" class="text-sm text-destructive">{{ errors.email }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700" for="password">비밀번호</label>
          <Input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            :aria-invalid="!!errors.password"
            required
          />
          <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
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
  import { isEmail, isRequired } from '@/utils/validators'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'

  const { login } = useAuth()
  const toast = useToast()

  const form = reactive({ email: '', password: '' })
  const errors = reactive({ email: '', password: '' })
  const isLoading = ref(false)

  function validate(): boolean {
    errors.email = ''
    errors.password = ''
    if (!isRequired(form.email)) {
      errors.email = '이메일을 입력해주세요.'
      return false
    }
    if (!isEmail(form.email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.'
      return false
    }
    if (!isRequired(form.password)) {
      errors.password = '비밀번호를 입력해주세요.'
      return false
    }
    return true
  }

  async function handleLogin() {
    if (!validate()) return
    isLoading.value = true
    try {
      await login({ email: form.email, password: form.password })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '로그인에 실패했습니다.')
    } finally {
      isLoading.value = false
    }
  }
</script>
