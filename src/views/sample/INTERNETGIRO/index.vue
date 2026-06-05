<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-semibold">인터넷지로 납부 샘플</h2>

    <p class="text-sm text-muted-foreground">
      서버 API로부터 납부 파라미터를 받아 giro.or.kr 납부 팝업을 호출하는 샘플입니다.
    </p>

    <!-- 요청 파라미터 -->
    <section class="space-y-4">
      <h3 class="text-base font-medium">요청 파라미터</h3>
      <div class="grid gap-3">
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm font-medium">납부번호 (reqCode)</label>
          <input
            v-model="request.reqCode"
            type="text"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            placeholder="납부번호"
          />
        </div>
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm font-medium">시스템코드 (sysCode)</label>
          <select
            v-model="request.sysCode"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm w-44"
          >
            <option value="ETAX">ETAX — 이택스</option>
            <option value="STAX">STAX — 지방세</option>
          </select>
        </div>
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm font-medium">서비스코드 (sc)</label>
          <input
            v-model="request.sc"
            type="text"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            placeholder="서비스코드"
          />
        </div>
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm font-medium">기관코드 (gc)</label>
          <input
            v-model="request.gc"
            type="text"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            placeholder="기관코드"
          />
        </div>
      </div>
    </section>

    <!-- 납부 실행 -->
    <section class="space-y-3">
      <button
        :disabled="!isFormValid || isLoading"
        class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="handlePay"
      >
        <span v-if="isLoading">서버 조회 중...</span>
        <span v-else>인터넷지로 납부</span>
      </button>

      <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

      <p class="text-xs text-muted-foreground">
        팝업 차단이 설정된 경우 브라우저에서 팝업 허용 후 다시 시도하세요.
      </p>
    </section>

    <!-- 서버 응답 파라미터 -->
    <section v-if="giroParams" class="space-y-4 border-t pt-4">
      <h3 class="text-base font-medium">서버 응답 파라미터</h3>
      <div class="grid gap-3">
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm text-muted-foreground">전자납부번호 (tc)</label>
          <span class="text-sm font-mono break-all">{{ giroParams.tc }}</span>
        </div>
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm text-muted-foreground">참조코드 (rc)</label>
          <span class="text-sm font-mono break-all">{{ giroParams.rc }}</span>
        </div>
        <div class="grid grid-cols-[140px_1fr] items-center gap-3">
          <label class="text-sm text-muted-foreground">납부 URL</label>
          <span class="text-sm font-mono break-all">{{ payUrl }}</span>
        </div>
      </div>
    </section>

    <!-- 납부 완료 처리 -->
    <section v-if="giroParams && !isPaid" class="space-y-2 border-t pt-4">
      <p class="text-sm text-muted-foreground">팝업에서 납부를 완료한 후 아래 버튼을 눌러주세요.</p>
      <button
        class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
        @click="isPaid = true"
      >
        납부 완료 확인
      </button>
    </section>

    <section v-if="isPaid" class="rounded-md border border-green-200 bg-green-50 p-4 space-y-1">
      <p class="text-sm font-semibold text-green-700">납부가 완료되었습니다.</p>
      <p class="text-xs text-green-600">참조코드: {{ giroParams?.rc }}</p>
      <button
        class="mt-2 text-xs text-muted-foreground underline"
        @click="reset"
      >
        초기화
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useInternetGiro } from '@/composables/useInternetGiro'
import type { InternetGiroParams } from '@/types/InternetGiro'

const { pay } = useInternetGiro()

const request = reactive({
  reqCode: '20260602102714',
  sysCode: 'ETAX',
  sc: '11',
  gc: '1500169',
})

const isLoading = ref(false)
const error = ref('')
const giroParams = ref<InternetGiroParams | null>(null)
const payUrl = ref('')
const isPaid = ref(false)

const isFormValid = computed(() => !!request.reqCode)

async function handlePay() {
  isLoading.value = true
  error.value = ''
  try {
    const result = await pay({ reqCode: request.reqCode, sysCode: request.sysCode, sc: request.sc, gc: request.gc })
    giroParams.value = result.params
    payUrl.value = result.url
  } catch (e) {
    error.value = e instanceof Error ? e.message : '서버 통신 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

function reset() {
  isPaid.value = false
  giroParams.value = null
  payUrl.value = ''
  error.value = ''
}
</script>
