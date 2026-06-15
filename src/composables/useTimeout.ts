import { ref, readonly } from 'vue'
import { useAuthStore } from '@/stores/auth'

const INACTIVITY_TIMEOUT = (Number(import.meta.env.VITE_SESSION_TIMEOUT_MIN) || 2) * 60 * 1000
const WARNING_DURATION = (Number(import.meta.env.VITE_SESSION_WARNING_MIN) || 1) * 60

const isWarningVisible = ref(false)
const countdown = ref(WARNING_DURATION)

let inactivityTimer: ReturnType<typeof setTimeout> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null

const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'] as const

function resetInactivityTimer() {
  if (!isWarningVisible.value) {
    _clearTimers()
    inactivityTimer = setTimeout(_showWarning, INACTIVITY_TIMEOUT)
  }
}

function _showWarning() {
  isWarningVisible.value = true
  countdown.value = WARNING_DURATION
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      _forceLogout()
    }
  }, 1000)
}

function _clearTimers() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

async function _forceLogout() {
  stopTracking()
  await useAuthStore().logout()
}

function extendSession() {
  isWarningVisible.value = false
  _clearTimers()
  inactivityTimer = setTimeout(_showWarning, INACTIVITY_TIMEOUT)
}

function startTracking() {
  stopTracking()
  ACTIVITY_EVENTS.forEach((event) => document.addEventListener(event, resetInactivityTimer, { passive: true }))
  inactivityTimer = setTimeout(_showWarning, INACTIVITY_TIMEOUT)
}

function stopTracking() {
  _clearTimers()
  isWarningVisible.value = false
  ACTIVITY_EVENTS.forEach((event) => document.removeEventListener(event, resetInactivityTimer))
}

export function useSessionTimeout() {
  return {
    isWarningVisible: readonly(isWarningVisible),
    countdown: readonly(countdown),
    startTracking,
    stopTracking,
    extendSession,
    forceLogout: _forceLogout,
  }
}
