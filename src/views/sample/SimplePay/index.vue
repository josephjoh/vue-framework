<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-semibold">간편결제 샘플</h2>

    <p class="text-sm text-muted-foreground">
      서울시 간편결제 New API 호출 샘플 (테스트 서버: tetax2.seoul.go.kr)
    </p>

    <!-- 공통 파라미터 -->
    <section class="space-y-4">
      <h3 class="text-base font-medium">공통 파라미터</h3>
      <div class="grid gap-3">

        <div class="grid grid-cols-[150px_1fr] items-center gap-3">
          <label class="text-sm font-medium">결제금액 (req_amt)</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="form.reqAmt"
              type="number"
              min="1"
              class="rounded-md border border-input bg-background px-3 py-2 text-sm w-36"
            />
            <span class="text-sm">원</span>
          </div>
        </div>

        <div class="grid grid-cols-[150px_1fr] items-center gap-3">
          <label class="text-sm font-medium">거래번호 (req_code)</label>
          <div class="flex items-center gap-2">
            <input
              v-model="form.reqCode"
              type="text"
              maxlength="13"
              class="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono w-44"
              :class="reqCodeClass"
              placeholder="13자리"
            />
            <span class="text-xs" :class="reqCodeClass">{{ form.reqCode.length }}/13</span>
          </div>
        </div>

        <div class="grid grid-cols-[150px_1fr] items-center gap-3">
          <label class="text-sm font-medium">sys_code</label>
          <select
            v-model="form.sysCode"
            class="rounded-md border border-input bg-background px-3 py-2 text-sm w-44"
          >
            <option value="STX">STX — 지방세 (STAX)</option>
            <option value="ETM">ETM — 이택스모바일</option>
          </select>
        </div>

      </div>
    </section>

    <!-- 결제 버튼 -->
    <section class="space-y-3">
      <h3 class="text-base font-medium">간편결제 수단 (New)</h3>
      <p v-if="!isFormValid" class="text-xs text-destructive">거래번호 13자리를 입력하세요.</p>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="item in payMethods"
          :key="item.method"
          :disabled="!isFormValid"
          class="inline-flex items-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handlePay(item.method)"
        >
          {{ item.label }}
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useSimplePay, type SimplePayMethod } from '@/composables/useSimplePay'

const { pay } = useSimplePay()

const form = reactive({
  reqAmt:  1000,
  reqCode: '2606021652511',
  sysCode: 'STX' as 'STX' | 'ETM',
})

const isFormValid = computed(() => form.reqCode.length === 13 && form.reqAmt > 0)

const reqCodeClass = computed(() =>
  form.reqCode.length === 13 ? 'text-green-600 border-green-400' : 'text-destructive'
)

const payMethods: { method: SimplePayMethod; label: string }[] = [
  { method: 'KAKAOPAY',      label: '카카오페이' },
  { method: 'SSG',           label: 'SSG페이' },
  { method: 'PAYCO',         label: 'PAYCO(페이코)' },
  { method: 'NAVERPAY',      label: 'Naver페이' },
  { method: 'LPAY',          label: 'L.페이' },
  { method: 'SAMSUNGPAY',    label: '삼성페이' },
  { method: 'TOSSPAY',       label: '토스페이' },
  { method: 'HANAPAY',       label: '하나페이' },
  { method: 'KBPAY',         label: 'KBpay' },
  { method: 'SHINHANSOLPAY', label: '신한SOL페이' },
  { method: 'BCPAYBOOK',        label: 'BC페이북' },
  { method: 'HYUNDAI_APPCARD', label: '현대앱카드' },
  { method: 'SAMSUNG_APPCARD', label: '삼성앱카드' },
  { method: 'LOTTE_APPCARD',   label: '롯데앱카드' },
  { method: 'WOORI_APPCARD',   label: '우리앱카드' },
]

function handlePay(method: SimplePayMethod) {
  pay(method, { reqAmt: form.reqAmt, reqCode: form.reqCode, sysCode: form.sysCode })
}
</script>
