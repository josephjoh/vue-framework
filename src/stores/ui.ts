import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const pendingCount = ref(0)
  const isLoading = computed(() => pendingCount.value > 0)

  function startLoading() { pendingCount.value++ }
  function stopLoading() { pendingCount.value = Math.max(0, pendingCount.value - 1) }

  return { isLoading, startLoading, stopLoading }
})
