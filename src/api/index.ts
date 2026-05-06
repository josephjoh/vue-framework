import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'vue-sonner'

// NOTE: useAuthStore, useUiStore를 interceptor 콜백 내부에서 호출하는 이유:
// api/index.ts → stores/auth.ts → api/services/auth.ts → api/index.ts 순환 참조를
// 모듈 초기화 시점이 아닌 런타임 호출 시점으로 늦춰서 회피합니다.
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ko',
  },
})

// _skipGlobalError 미설정 / false : 공통에서 로딩 시작/종료 + 공통 에러 메시지 처리
// _skipGlobalError: true           : 업무단에서 직접 처리

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const authStore = useAuthStore()
    // if (authStore.accessToken) {
    //   config.headers.Authorization = `Bearer ${authStore.accessToken}`
    // }
    if (!config._skipGlobalError) {
      useUiStore().startLoading()
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: 비즈니스 코드 검사 + 공통 에러 처리
http.interceptors.response.use(
  (response) => {
    if (!response.config._skipGlobalError) {
      useUiStore().stopLoading()
    }
    const apiResponse = response.data
    // HTTP 200이지만 비즈니스 실패인 경우
    if (apiResponse.RES_COM?.tranState !== undefined && apiResponse.RES_COM.tranState !== 'Y') {
      if (!response.config._skipGlobalError) {
        toast.error(apiResponse.RES_ERR?.errorMsg ?? '오류가 발생했습니다.')
      }
      return Promise.reject(apiResponse.RES_ERR)
    }
    return response
  },
  async (error) => {
    if (error.response) {
      const status = error.response?.status
      const originalRequest = error.config

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const authStore = useAuthStore()

        try {
          await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })
          // 재시도 요청이 request interceptor를 다시 타므로 stopLoading 호출하지 않음
          return http(originalRequest)
        } catch {
          if (!originalRequest._skipGlobalError) useUiStore().stopLoading()
          authStore.clearAuth()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }

      if (!originalRequest?._skipGlobalError) {
        useUiStore().stopLoading()
      }

      const statusGroup = Math.floor(status / 100) * 100
      let rejectedError
      switch (statusGroup) {
        case 400:
        case 500:
          rejectedError = {
            errorCode: '400500',
            errorMsg: '400500에러',
            errorAddMsg: '400500에러 발생',
          }
          break
        default:
          rejectedError = error.response.data.RES_ERR
      }

      if (!originalRequest?._skipGlobalError) {
        toast.error(rejectedError?.errorMsg ?? '오류가 발생했습니다.')
      }

      return Promise.reject(rejectedError)
    } else {
      const noResponseError = {
        errorCode: '!400500',
        errorMsg: '알 수 없는 오류가 발생했습니다.',
        errorAddMsg: '알 수 없는 오류가 발생했습니다.',
      }
      if (!error.config?._skipGlobalError) {
        useUiStore().stopLoading()
        toast.error(noResponseError.errorMsg)
      }
      return Promise.reject(noResponseError)
    }
  }
)

export default http
