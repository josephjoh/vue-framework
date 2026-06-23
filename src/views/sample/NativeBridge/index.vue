<template>
  <div class="p-6 space-y-6">
    <h2 class="text-xl font-semibold">Native Bridge 샘플</h2>

    <p class="text-sm text-muted-foreground">
      현재 환경: <span class="font-medium">{{ platform }}</span>
    </p>

    <!-- 생체인식 -->
    <section class="space-y-2">
      <h3 class="text-base font-medium">생체인식 (Biometric)</h3>
      <button
        class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
        @click="requestBiometric"
      >
        생체인식 요청
      </button>
      <p v-if="biometricResult" :class="biometricResult.success ? 'text-green-600' : 'text-destructive'" class="text-sm">
        {{ biometricResult.success ? '인증 성공' : `인증 실패: ${biometricResult.reason}` }}
      </p>
    </section>

    <!-- 카메라 -->
    <section class="space-y-2">
      <h3 class="text-base font-medium">카메라 (Camera)</h3>
      <button
        class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
        @click="openCamera"
      >
        카메라 열기
      </button>
      <img v-if="cameraImageUrl" :src="cameraImageUrl" class="max-w-xs rounded-md border" alt="촬영 이미지" />
    </section>

    <!-- 위치 -->
    <!-- <section class="space-y-2">
      <h3 class="text-base font-medium">위치 (Location)</h3>
      <button
        class="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
        @click="getLocation"
      >
        위치 요청
      </button>
      <p v-if="location" class="text-sm text-muted-foreground">
        위도: {{ location.lat }} / 경도: {{ location.lng }}
      </p>
    </section> -->

    <!-- 수신 로그 -->
    <section class="space-y-2">
      <h3 class="text-base font-medium">수신 로그</h3>
      <pre class="text-xs bg-muted rounded p-3 max-h-48 overflow-auto">{{ logText }}</pre>

      <!-- 개발 환경용 응답 시뮬레이터 -->
      <div class="space-y-2 border rounded-md p-3">
        <p class="text-xs text-muted-foreground">개발 환경 응답 시뮬레이터 (브라우저 전용)</p>
        <div class="flex gap-2 flex-wrap">
          <button class="text-xs px-3 py-1 rounded border hover:bg-accent" @click="simulate('BIOMETRIC_RESULT', { success: true })">생체인식 성공</button>
          <button class="text-xs px-3 py-1 rounded border hover:bg-accent" @click="simulate('BIOMETRIC_RESULT', { success: false, reason: '인증 취소' })">생체인식 실패</button>
          <button class="text-xs px-3 py-1 rounded border hover:bg-accent" @click="simulate('CAMERA_RESULT', { imageUrl: 'https://placehold.co/300x200' })">카메라 결과</button>
          <!-- <button class="text-xs px-3 py-1 rounded border hover:bg-accent" @click="simulate('LOCATION_RESULT', { lat: 37.5665, lng: 126.9780 })">위치 결과</button> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNativeBridge, type BridgeAction } from '@/composables/useNativeBridge'

const { postMessage, onMessage, removeListener, isIos, isAndroid } = useNativeBridge()

const platform = computed(() => {
  if (isIos()) return 'iOS'
  if (isAndroid()) return 'Android'
  return '브라우저 (개발 환경)'
})

const biometricResult = ref<{ success: boolean; reason?: string } | null>(null)
const cameraImageUrl = ref<string | null>(null)
const location = ref<{ lat: number; lng: number } | null>(null)
const logs = ref<string[]>([])
const logText = computed(() => logs.value.join('\n') || '수신된 메시지 없음')

function addLog(action: string, payload: unknown) {
  logs.value.unshift(`[${new Date().toLocaleTimeString()}] ${action}: ${JSON.stringify(payload)}`)
}

function requestBiometric() {
  biometricResult.value = null
  postMessage('BIOMETRIC_AUTH', { reason: '본인 확인이 필요합니다' })
}

function openCamera() {
  cameraImageUrl.value = null
  postMessage('OPEN_CAMERA', { quality: 'high' })
}

// function getLocation() {
//   location.value = null
//   postMessage('GET_LOCATION')
// }

// 개발 환경 시뮬레이터 — 네이티브 응답을 직접 주입
function simulate(action: BridgeAction, payload: unknown) {
  window.onNativeMessage?.(JSON.stringify({ action, payload }))
}

onMounted(() => {
  onMessage('BIOMETRIC_RESULT', (payload: unknown) => {
    addLog('BIOMETRIC_RESULT', payload)
    biometricResult.value = payload as { success: boolean; reason?: string }
  })
  onMessage('CAMERA_RESULT', (payload: unknown) => {
    addLog('CAMERA_RESULT', payload)
    cameraImageUrl.value = (payload as { imageUrl: string }).imageUrl
  })
  onMessage('LOCATION_RESULT', (payload: unknown) => {
    addLog('LOCATION_RESULT', payload)
    location.value = payload as { lat: number; lng: number }
  })
})

onUnmounted(() => {
  removeListener('BIOMETRIC_RESULT')
  removeListener('CAMERA_RESULT')
  removeListener('LOCATION_RESULT')
})
</script>
