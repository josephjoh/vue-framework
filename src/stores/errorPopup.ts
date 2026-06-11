import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorPopupStore = defineStore('errorPopup', () => {
  const isVisible = ref(false)
  const title = ref('오류')
  const message = ref('')
  const detail = ref('')

  function show(msg: string, titleText = '오류', detailText = '') {
    title.value = titleText
    message.value = msg
    detail.value = detailText
    isVisible.value = true
  }

  function hide() {
    isVisible.value = false
  }

  return { isVisible, title, message, detail, show, hide }
})
