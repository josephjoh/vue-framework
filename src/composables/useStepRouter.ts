import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useStepRouter(totalSteps: number) {
  const route = useRoute()
  const router = useRouter()

  const step = computed(() => {
    const q = Number(route.query.step)
    return q >= 1 && q <= totalSteps ? q : 1
  })

  function goStep(n: number) {
    if (n >= 1 && n <= totalSteps) {
      router.push({ query: { step: n } })
    }
  }

  function pushNext() {
    goStep(step.value + 1)
  }

  function goBack() {
    router.go(-1)
  }

  // ── 결제 모달 popstate 처리 ──────────────────────
  const isPaymentOpen = ref(false)
  const paymentStep = ref(1)
  const totalPaymentSteps = ref<number | null>(null)

  function openPayment(steps?: number) {
    isPaymentOpen.value = true
    paymentStep.value = 1
    totalPaymentSteps.value = steps ?? null
    window.history.pushState({ payment: true, payStep: 1 }, '')
  }

  function nextPaymentStep() {
    // totalPaymentSteps가 없으면 범위 체크 skip (호출자가 판단)
    if (totalPaymentSteps.value === null || paymentStep.value < totalPaymentSteps.value) {
      paymentStep.value++
      window.history.pushState({ payment: true, payStep: paymentStep.value }, '')
    }
  }

  function closePayment() {
    isPaymentOpen.value = false
    paymentStep.value = 1
  }

  function handlePopState() {
    if (isPaymentOpen.value) {
      if (paymentStep.value > 1) {
        paymentStep.value--
      } else {
        closePayment()
      }
    }
  }

  onMounted(() => window.addEventListener('popstate', handlePopState))
  onBeforeUnmount(() => window.removeEventListener('popstate', handlePopState))

  return {
    step, goStep, pushNext, goBack,
    isPaymentOpen, paymentStep, totalPaymentSteps,
    openPayment, nextPaymentStep, closePayment,
  }
}
