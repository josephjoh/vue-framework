/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// CSS 모듈 타입 선언
declare module '*.css' {
  const content: Record<string, string>
  export default content
}

import 'axios'
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }

  interface AxiosRequestConfig {
    _skipGlobalError?: boolean
  }
}
