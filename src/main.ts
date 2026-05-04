import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// import { useAuthStore } from '@/stores/auth'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// const authStore = useAuthStore()
// await authStore.initAuth() // 쿠키 유효성 서버 검증 후 user 세팅

app.use(router)
app.mount('#app')
