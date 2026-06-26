import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CommonCodeItem } from '@/types'

export const useCommonCodeStore = defineStore('commonCode', () => {
  const codeMap = ref<Map<string, CommonCodeItem[]>>(new Map())

  function get(groupCd: string): CommonCodeItem[] {
    return codeMap.value.get(groupCd) ?? []
  }

  function set(groupCd: string, items: CommonCodeItem[]) {
    codeMap.value.set(groupCd, items)
  }

  function has(groupCd: string): boolean {
    return codeMap.value.has(groupCd)
  }

  return { get, set, has }
})
