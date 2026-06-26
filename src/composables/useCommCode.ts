import { ref } from 'vue'
import { useCommCodeStore } from '@/stores/commCode'
import { useServiceApi } from '@/composables/useServiceApi'
import type { CommCodeItem, CommCodeRequest, CommCodeResponse } from '@/types'

// 동일 groupCd 동시 요청 시 API 중복 호출 방지
const pending = new Map<string, Promise<CommCodeItem[]>>()

export function useCommCode() {
  const store = useCommCodeStore()
  const { callPostApi } = useServiceApi()

  async function load(groupCd: string): Promise<CommCodeItem[]> {
    if (store.has(groupCd)) return store.get(groupCd)

    if (!pending.has(groupCd)) {
      const promise = (async () => {
        try {
          const res = await callPostApi<CommCodeRequest, CommCodeResponse>(
            'COMMON_CODE_INQUIRY',
            { groupCd },
          )
          const list = res.REQ_DAT?.codeList ?? []
          store.set(groupCd, list)
          return list
        } finally {
          pending.delete(groupCd)
        }
      })()

      pending.set(groupCd, promise)
    }

    return pending.get(groupCd)!
  }

  function useCodeGroup(groupCd: string) {
    const items = ref<CommCodeItem[]>(store.get(groupCd))
    const isLoading = ref(false)

    async function fetch() {
      if (store.has(groupCd)) {
        items.value = store.get(groupCd)
        return
      }
      isLoading.value = true
      try {
        items.value = await load(groupCd)
      } finally {
        isLoading.value = false
      }
    }

    return { items, isLoading, fetch }
  }

  return { load, useCodeGroup }
}
