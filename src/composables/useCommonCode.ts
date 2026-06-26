import { ref } from 'vue'
import { useCommonCodeStore } from '@/stores/commonCode'
import { useServiceApi } from '@/composables/useServiceApi'
import type { CommonCodeItem, CommonCodeRequest, CommonCodeResponse } from '@/types'

// 동일 groupCd 동시 요청 시 API 중복 호출 방지
const pending = new Map<string, Promise<CommonCodeItem[]>>()

export function useCommonCode() {
  const store = useCommonCodeStore()
  const { callPostApi } = useServiceApi()

  async function load(groupCd: string): Promise<CommonCodeItem[]> {
    if (store.has(groupCd)) return store.get(groupCd)

    if (!pending.has(groupCd)) {
      const promise = (async () => {
        try {
          const res = await callPostApi<CommonCodeRequest, CommonCodeResponse>(
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
    const items = ref<CommonCodeItem[]>(store.get(groupCd))
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
