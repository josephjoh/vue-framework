<template>
  <div class="mx-auto max-w-3xl space-y-6 p-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">뒤로가기 시나리오 샘플</h1>
      <p class="mt-1 text-sm text-gray-500">브라우저 뒤로가기 · 새로고침 처리 패턴 4가지</p>
    </div>

    <!-- 탭 -->
    <div class="flex gap-1 border-b border-gray-200">
      <button
        v-for="(s, i) in scenarios"
        :key="i"
        @click="selectScenario(i)"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="activeScenario === i
          ? 'border-b-2 border-blue-600 text-blue-600'
          : 'text-gray-500 hover:text-gray-700'"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- ① URL query step 네비게이션 -->
    <section v-if="activeScenario === 0" class="space-y-4">
      <div class="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>동작:</strong> 다음 버튼 → URL query에 step 쌓음.
        브라우저 뒤로가기 → 이전 step 이동.
        새로고침(F5) → 현재 step 유지.
      </div>

      <!-- 현재 URL -->
      <div class="rounded bg-gray-900 px-4 py-2 font-mono text-sm text-green-400">
        {{ route.fullPath }}
      </div>

      <!-- Step 인디케이터 -->
      <div class="flex items-center gap-2">
        <template v-for="n in 5" :key="n">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors"
            :class="step === n
              ? 'bg-blue-600 text-white'
              : step > n
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-400'"
          >{{ n }}</div>
          <div v-if="n < 5" class="h-px flex-1 bg-gray-200" />
        </template>
      </div>

      <!-- Step 컨텐츠 -->
      <div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p class="text-xl font-semibold text-gray-700">Step {{ step }}</p>
        <p class="mt-1 text-sm text-gray-400">{{ stepDescs[step - 1] }}</p>
      </div>

      <!-- 훅 로그 -->
      <div class="max-h-36 overflow-y-auto rounded bg-gray-900 p-4 font-mono text-xs space-y-1">
        <div
          v-for="(log, i) in stepLogs"
          :key="i"
          :class="log.type === 'hook' ? 'text-yellow-400' : 'text-gray-400'"
        >{{ log.msg }}</div>
      </div>

      <!-- 버튼 -->
      <div class="flex justify-between">
        <button
          @click="goBack"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >← 이전</button>
        <button
          v-if="step < 5"
          @click="handleStepNext"
          class="rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >다음 →</button>
        <span v-else class="rounded-md border border-green-500 bg-white px-4 py-2 text-sm font-medium text-green-600">완료 ✓</span>
      </div>
    </section>

    <!-- ② 결제 모달 뒤로가기 -->
    <section v-if="activeScenario === 1" class="space-y-4">
      <div class="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>동작:</strong> 결제창 오픈 및 각 단계 이동 시 <code class="rounded bg-blue-100 px-1">history.pushState</code> 쌓음.
        브라우저 뒤로가기 → <code class="rounded bg-blue-100 px-1">popstate</code> 인터셉트 → 이전 결제 단계 이동.
        결제 step1 에서 뒤로가기 → 결제창 닫힘 (메인 step 이동 없음).
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-6 text-center space-y-3">
        <p class="text-gray-600">결제 금액: <strong class="text-gray-900">100,000원</strong></p>
        <button
          @click="handleOpenPayment"
          :disabled="isPaymentOpen"
          class="rounded-md border border-blue-600 bg-white px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
        >결제하기</button>
      </div>

      <!-- 훅 로그 -->
      <div class="max-h-36 overflow-y-auto rounded bg-gray-900 p-4 font-mono text-xs space-y-1">
        <div
          v-for="(log, i) in paymentLogs"
          :key="i"
          :class="log.type === 'hook' ? 'text-yellow-400' : 'text-gray-400'"
        >{{ log.msg }}</div>
      </div>

      <!-- 결제 모달 (3단계) -->
      <Teleport to="body">
        <div
          v-if="isPaymentOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div class="w-96 rounded-xl bg-white p-6 shadow-xl space-y-5">
            <h3 class="text-center text-lg font-bold text-gray-800">💳 결제 모듈</h3>

            <!-- 결제 단계 인디케이터 -->
            <div class="flex items-center gap-2">
              <template v-for="n in 3" :key="n">
                <div
                  class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
                  :class="paymentStep === n
                    ? 'bg-blue-600 text-white'
                    : paymentStep > n
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-400'"
                >{{ n }}</div>
                <div v-if="n < 3" class="h-px flex-1 bg-gray-200" />
              </template>
            </div>

            <!-- 단계별 컨텐츠 -->
            <div class="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 text-center">
              <template v-if="paymentStep === 1">
                <p class="font-semibold">카드 정보 입력</p>
                <p class="mt-1 text-gray-400">카드 번호 · 유효기간 · CVC</p>
              </template>
              <template v-else-if="paymentStep === 2">
                <p class="font-semibold">결제 금액 확인</p>
                <p class="mt-2 text-xl font-bold text-gray-900">100,000원</p>
              </template>
              <template v-else>
                <p class="font-semibold">최종 승인</p>
                <p class="mt-1 text-gray-400">결제를 최종 승인하시겠습니까?</p>
              </template>
            </div>

            <p class="text-center text-xs text-gray-400">
              브라우저 뒤로가기 → 이전 결제 단계 / step1에서 뒤로가기 → 결제창 닫힘
            </p>

            <div class="flex gap-2">
              <button
                @click="cancelPayment"
                class="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >취소</button>
              <button
                v-if="paymentStep < 3"
                @click="handleNextPaymentStep"
                class="flex-1 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >다음 →</button>
              <button
                v-else
                @click="confirmPayment"
                class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >결제 승인</button>
            </div>
          </div>
        </div>
      </Teleport>
    </section>

    <!-- ③ 웹뷰 브릿지 -->
    <section v-if="activeScenario === 2" class="space-y-4">
      <div class="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>동작:</strong> 웹뷰 환경에서 뒤로가기 시 <code class="rounded bg-blue-100 px-1">postMessage</code>로 네이티브에 위임.
        결제 결과는 <code class="rounded bg-blue-100 px-1">message</code> 이벤트로 수신.
      </div>

      <!-- 웹뷰 모드 토글 -->
      <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <span class="text-sm text-gray-600">웹뷰 환경 시뮬레이션</span>
        <button
          @click="isWebViewMode = !isWebViewMode"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          :class="isWebViewMode ? 'bg-blue-600' : 'bg-gray-300'"
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
            :class="isWebViewMode ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
        <span class="text-xs font-semibold" :class="isWebViewMode ? 'text-blue-600' : 'text-gray-400'">
          {{ isWebViewMode ? '웹뷰 ON' : '일반 브라우저' }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          @click="webviewGoBack"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >← 뒤로가기</button>
        <button
          @click="webviewOpenPayment"
          class="rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >결제 모듈 열기</button>
        <button
          @click="simulateNativeResult('success')"
          class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >네이티브 → 결제성공</button>
        <button
          @click="simulateNativeResult('cancel')"
          class="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
        >네이티브 → 결제취소</button>
      </div>

      <!-- 브릿지 로그 -->
      <div class="max-h-48 overflow-y-auto rounded bg-gray-900 p-4 font-mono text-xs space-y-1">
        <div v-if="bridgeLogs.length === 0" class="text-gray-500">메시지 로그...</div>
        <div
          v-for="(log, i) in bridgeLogs"
          :key="i"
          :class="{
            'text-blue-400':   log.dir === 'web→native',
            'text-green-400':  log.dir === 'native→web',
            'text-yellow-400': log.dir === 'system',
          }"
        >
          <span class="text-gray-600">{{ log.time }}</span>
          {{ log.dir === 'web→native' ? ' ▶ ' : log.dir === 'native→web' ? ' ◀ ' : ' ⚙ ' }}
          {{ log.msg }}
        </div>
      </div>
    </section>

    <!-- ④ 이탈 방지 -->
    <section v-if="activeScenario === 3" class="space-y-4">
      <div class="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>동작:</strong> 미저장 내용이 있을 때 라우트 이탈 시 confirm.
        새로고침(F5) 시 <code class="rounded bg-blue-100 px-1">beforeunload</code> 경고창.
      </div>

      <div class="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">내용 입력</label>
          <textarea
            v-model="draftContent"
            rows="4"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="내용을 입력하면 이탈 방지가 활성화됩니다..."
          />
        </div>

        <div class="flex items-center gap-2 text-sm">
          <span
            class="h-2 w-2 rounded-full"
            :class="hasUnsavedChanges ? 'bg-orange-400' : 'bg-green-400'"
          />
          <span :class="hasUnsavedChanges ? 'text-orange-600' : 'text-green-600'">
            {{ hasUnsavedChanges ? '미저장 변경사항 — 이탈 방지 활성' : '저장됨 — 이탈 가능' }}
          </span>
        </div>

        <div class="flex gap-2">
          <button
            @click="saveContent"
            class="rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >저장</button>
          <button
            @click="testLeave"
            class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >다른 페이지로 이동 (이탈 테스트)</button>
        </div>
      </div>

      <!-- 코드 힌트 -->
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs">
        <p class="mb-2 font-semibold uppercase tracking-wide text-gray-500">적용 코드</p>
        <pre class="text-gray-700">// 라우트 이탈 인터셉트
onBeforeRouteLeave(() => {
  if (hasUnsavedChanges.value) {
    const ok = confirm('변경사항이 있습니다. 나가시겠습니까?')
    if (!ok) return false
  }
})

// 새로고침 경고
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges.value) e.preventDefault()
})</pre>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStepRouter } from '@/composables/useStepRouter'


const route = useRoute()
const router = useRouter()

// ── 탭 ────────────────────────────────────────────
const scenarios = [
  { label: '① URL query step' },
  { label: '② 결제 모달 뒤로가기' },
  { label: '③ 웹뷰 브릿지' },
  { label: '④ 이탈 방지' },
]
const activeScenario = ref(0)

function selectScenario(i: number) {
  activeScenario.value = i
  if (route.query.step) router.replace({ query: {} })
}

// ── ① URL query step + ② 결제 모달 (popstate는 composable 내부 처리) ──
const { step, pushNext, goBack, isPaymentOpen, paymentStep, openPayment, nextPaymentStep, closePayment } = useStepRouter(5)

const stepDescs = ['기본 정보 입력', '약관 동의', '결제 수단 선택', '결제 진행', '완료']

interface Log { type: 'info' | 'hook'; msg: string }
const stepLogs = ref<Log[]>([])

watch(step, (cur, prev) => {
  if (prev === undefined) {
    stepLogs.value.push({ type: 'hook', msg: `[watch immediate] step = ${cur} (초기 진입 또는 새로고침)` })
  } else {
    const dir = cur > prev ? '▶ pushNext' : '◀ 뒤로가기'
    stepLogs.value.push({ type: 'hook', msg: `[watch] ${dir}: step ${prev} → ${cur}` })
  }
}, { immediate: true })

function handleStepNext() {
  stepLogs.value.push({ type: 'info', msg: `> step${step.value} DB 저장 후 다음으로` })
  pushNext()
}

// ── ② 결제 모달 뒤로가기 ──────────────────────────
const paymentLogs = ref<Log[]>([{ type: 'info', msg: '> 결제하기 버튼을 눌러보세요.' }])

function handleOpenPayment() {
  openPayment(3)  // 결제 3단계
  paymentLogs.value.push({ type: 'hook', msg: '[history.pushState] payStep:1 추가 — 결제창 열림' })
  paymentLogs.value.push({ type: 'info', msg: '> 브라우저 뒤로가기로 단계 이동을 테스트해보세요.' })
}

function handleNextPaymentStep() {
  nextPaymentStep()  // composable: paymentStep++ + pushState
  paymentLogs.value.push({ type: 'hook', msg: `[history.pushState] payStep:${paymentStep.value} 추가` })
}

function cancelPayment() {
  closePayment()
  paymentLogs.value.push({ type: 'info', msg: '> 결제 취소 (UI 버튼)' })
}

function confirmPayment() {
  closePayment()
  paymentLogs.value.push({ type: 'info', msg: '> 결제 승인 완료 ✓' })
}

// popstate로 이전 단계 이동 감지 (뒤로가기 = 감소)
watch(paymentStep, (cur, prev) => {
  if (isPaymentOpen.value && cur < prev) {
    paymentLogs.value.push({ type: 'hook', msg: `[popstate] 결제 step ${prev} → ${cur}` })
  }
})

watch(isPaymentOpen, (val, prev) => {
  if (prev === true && val === false) {
    paymentLogs.value.push({ type: 'hook', msg: '[popstate] 결제창 닫힘 — 메인 step 이동 없음' })
  }
})

// ── ③ 웹뷰 브릿지 ────────────────────────────────
const isWebViewMode = ref(false)

interface BridgeLog {
  dir: 'web→native' | 'native→web' | 'system'
  msg: string
  time: string
}
const bridgeLogs = ref<BridgeLog[]>([])

function now() {
  return new Date().toLocaleTimeString('ko-KR', { hour12: false })
}

function postToNative(action: string, payload?: object) {
  const msg = JSON.stringify({ action, ...payload })
  bridgeLogs.value.push({ dir: 'web→native', msg, time: now() })
  // 실제 환경: (window as any).ReactNativeWebView?.postMessage(msg)
}

function webviewGoBack() {
  if (isWebViewMode.value) {
    postToNative('goBack')
    bridgeLogs.value.push({ dir: 'system', msg: '뒤로가기를 네이티브에 위임', time: now() })
  } else {
    bridgeLogs.value.push({ dir: 'system', msg: '일반 브라우저 — router.go(-1) 실행', time: now() })
    router.go(-1)
  }
}

function webviewOpenPayment() {
  postToNative('openPayment', { orderId: 'ORD-001', amount: 100000 })
  bridgeLogs.value.push({ dir: 'system', msg: '네이티브 결제 모듈 실행 중...', time: now() })
}

function simulateNativeResult(result: 'success' | 'cancel') {
  const msg = JSON.stringify({ action: 'paymentResult', result })
  bridgeLogs.value.push({ dir: 'native→web', msg, time: now() })
  bridgeLogs.value.push({
    dir: 'system',
    msg: result === 'success' ? '결제 성공 → pushNext()' : '결제 취소 → 현재 step 유지',
    time: now(),
  })
}

function handleNativeMessage(e: MessageEvent) {
  if (activeScenario.value !== 2) return
  try {
    const data = JSON.parse(e.data)
    bridgeLogs.value.push({ dir: 'native→web', msg: e.data, time: now() })
    if (data.action === 'hardwareBack') webviewGoBack()
  } catch {}
}

// ── ④ 이탈 방지 ──────────────────────────────────
const draftContent = ref('')
const savedContent = ref('')
const hasUnsavedChanges = computed(() => draftContent.value !== savedContent.value)

function saveContent() {
  savedContent.value = draftContent.value
}

function testLeave() {
  router.push('/')
}

onBeforeRouteLeave(() => {
  if (activeScenario.value === 3 && hasUnsavedChanges.value) {
    const ok = confirm('변경사항이 있습니다. 페이지를 나가시겠습니까?')
    if (!ok) return false
  }
})

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (activeScenario.value === 3 && hasUnsavedChanges.value) {
    e.preventDefault()
  }
}

// ── 라이프사이클 ──────────────────────────────────
onMounted(() => {
  window.addEventListener('message', handleNativeMessage)
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleNativeMessage)
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>
