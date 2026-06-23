<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <svg class="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-11a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900">정회원 인증</h1>
        <p class="mt-2 text-sm text-gray-500">
          현재 <span class="font-semibold text-amber-600">준회원</span> 상태입니다.<br />
          서비스 이용을 위해 정회원 인증이 필요합니다.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleCert">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700" for="phone">휴대폰 번호</label>
          <Input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="010-0000-0000"
            :aria-invalid="!!errors.phone"
            required
          />
          <p v-if="errors.phone" class="text-sm text-destructive">{{ errors.phone }}</p>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700" for="certCode">인증번호</label>
          <div class="flex gap-2">
            <Input
              id="certCode"
              v-model="form.certCode"
              type="text"
              placeholder="인증번호 6자리"
              :aria-invalid="!!errors.certCode"
              maxlength="6"
            />
            <Button
              type="button"
              variant="outline"
              class="shrink-0"
              :disabled="isSending"
              @click="handleSendCode"
            >
              {{ isSending ? '발송 중...' : codeSent ? '재발송' : '발송' }}
            </Button>
          </div>
          <p v-if="codeSent" class="text-xs text-blue-600">인증번호가 발송되었습니다. (mock: 123456)</p>
          <p v-if="errors.certCode" class="text-sm text-destructive">{{ errors.certCode }}</p>
        </div>

        <Button type="submit" class="w-full" :disabled="isLoading || !codeSent">
          {{ isLoading ? '인증 중...' : '정회원 인증 완료' }}
        </Button>
      </form>

      <button
        class="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600"
        @click="handleLogout"
      >
        다른 계정으로 로그인
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()
const toast = useToast()

const form = reactive({ phone: '', certCode: '' })
const errors = reactive({ phone: '', certCode: '' })
const isLoading = ref(false)
const isSending = ref(false)
const codeSent = ref(false)

function validate(): boolean {
  errors.phone = ''
  errors.certCode = ''
  if (!form.phone) {
    errors.phone = '휴대폰 번호를 입력해주세요.'
    return false
  }
  if (!codeSent.value) {
    errors.certCode = '인증번호를 발송해주세요.'
    return false
  }
  if (!form.certCode) {
    errors.certCode = '인증번호를 입력해주세요.'
    return false
  }
  return true
}

async function handleSendCode() {
  if (!form.phone) {
    errors.phone = '휴대폰 번호를 입력해주세요.'
    return
  }
  errors.phone = ''
  isSending.value = true
  try {
    // TODO: 실제 인증번호 발송 API 연동
    await new Promise((resolve) => setTimeout(resolve, 800))
    codeSent.value = true
    toast.success('인증번호가 발송되었습니다.')
  } finally {
    isSending.value = false
  }
}

async function handleCert() {
  if (!validate()) return

  // TODO: 실제 인증번호 검증은 mock 코드(123456) 확인으로 대체
  if (form.certCode !== '123456') {
    errors.certCode = '인증번호가 올바르지 않습니다.'
    return
  }

  isLoading.value = true
  try {
    await authStore.upgradeMembership()
    toast.success('정회원 인증이 완료되었습니다.')

    const redirect = route.query.redirect as string | undefined
    router.push(redirect ?? { name: 'Home' })
  } catch {
    toast.error('인증에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  await logout()
}
</script>
