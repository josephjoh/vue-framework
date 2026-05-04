// import { defineStore } from 'pinia'
// import { ref } from 'vue'

// export type ToastType = 'success' | 'error' | 'warning' | 'info'

// export interface Toast {
//   id: string
//   type: ToastType
//   message: string
//   duration?: number
// }

// export const useUiStore = defineStore('ui', () => {
//   const isLoading = ref(false)
//   const toasts = ref<Toast[]>([])

//   function setLoading(value: boolean) {
//     isLoading.value = value
//   }

//   function addToast(toast: Omit<Toast, 'id'>) {
//     const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
//     const duration = toast.duration ?? 3000
//     toasts.value.push({ ...toast, id, duration })

//     if (duration > 0) {
//       setTimeout(() => removeToast(id), duration)
//     }
//   }

//   function removeToast(id: string) {
//     const index = toasts.value.findIndex((t) => t.id === id)
//     if (index !== -1) toasts.value.splice(index, 1)
//   }

//   // 편의 메서드
//   const toast = {
//     success: (message: string, duration?: number) =>
//       addToast({ type: 'success', message, duration }),
//     error: (message: string, duration?: number) => addToast({ type: 'error', message, duration }),
//     warning: (message: string, duration?: number) =>
//       addToast({ type: 'warning', message, duration }),
//     info: (message: string, duration?: number) => addToast({ type: 'info', message, duration }),
//   }

//   return {
//     isLoading,
//     toasts,
//     setLoading,
//     addToast,
//     removeToast,
//     toast,
//   }
// })
