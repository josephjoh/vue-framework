import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CommCodeItem } from '@/types'

export const useCommCodeStore = defineStore('commCode', () => {
  const codeMap = ref<Map<string, CommCodeItem[]>>(new Map())

  function get(groupCd: string): CommCodeItem[] {
    return codeMap.value.get(groupCd) ?? []
  }

  function set(groupCd: string, items: CommCodeItem[]) {
    codeMap.value.set(groupCd, items)
  }

  function has(groupCd: string): boolean {
    return codeMap.value.has(groupCd)
  }

  return { get, set, has }
})
