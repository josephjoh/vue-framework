// import { ref } from 'vue'
// import { useUiStore } from '@/stores/ui'

// interface UseApiOptions {
//   globalLoading?: boolean
// }

// export function useApi<T>(options: UseApiOptions = {}) {
//   const { globalLoading = false } = options
//   const uiStore = useUiStore()

//   const data = ref<T | null>(null)
//   const error = ref<string | null>(null)
//   const isLoading = ref(false)

//   async function execute(apiFn: () => Promise<{ data: { data: T } }>) {
//     isLoading.value = true
//     error.value = null
//     if (globalLoading) uiStore.setLoading(true)

//     try {
//       const response = await apiFn()
//       data.value = response.data.data
//       return data.value
//     } catch (e) {
//       error.value = e instanceof Error ? e.message : '오류가 발생했습니다.'
//       throw e
//     } finally {
//       isLoading.value = false
//       if (globalLoading) uiStore.setLoading(false)
//     }
//   }

//   return { data, error, isLoading, execute }
// }
