import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// NOTE: useAuthStore를 interceptor 콜백 내부에서 호출하는 이유:
// api/index.ts → stores/auth.ts → api/services/auth.ts → api/index.ts 순환 참조를
// 모듈 초기화 시점이 아닌 런타임 호출 시점으로 늦춰서 회피합니다.
import { useAuthStore } from '@/stores/auth'

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

// Request interceptor: Pinia 스토어에서 토큰 첨부
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const authStore = useAuthStore()
    // if (authStore.accessToken) {
    //   config.headers.Authorization = `Bearer ${authStore.accessToken}`
    // }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: 비즈니스 코드 검사 + 공통 에러 처리
http.interceptors.response.use(
  (response) => {
    const apiResponse = response.data
    // HTTP 200이지만 비즈니스 실패인 경우 처리
    // RES_COM.tranState === 'Y' 성공
    if (apiResponse.RES_COM?.tranState !== undefined && apiResponse.RES_COM.tranState !== 'Y') {
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
          // await authApi.refresh() // 쿠키 자동 전송
          await axios.post(`${BASE_URL}/auth/refresh`, {}, {
            withCredentials: true
          })
          return http(originalRequest)
        } catch {
          authStore.clearAuth()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }

      const statusGroup = Math.floor(status / 100) * 100
      switch(statusGroup) {
        case 400:
        case 500:
          return Promise.reject({
            RES_ERR: {
              errorCode: '400500',
              errorMsg: '400500에러',
              errorAddMsg: '400500에러 발생',
            }
          })
        default:
          return Promise.reject(error.response.data.RES_ERR)
      }
    } else {
      return Promise.reject({
        RES_ERR: {
          errorCode: '!400500',
          errorMsg: '!400500에러 알 수 없는 오류가 발생했습니다.',
          errorAddMsg: '!400500에러 알 수 없는 오류 추가가 발생했습니다.',
        }
      })
    }
  //   const originalRequest = error.config

  //   // 401: 토큰 만료 → refresh 시도 후 재요청
  //   if (error.response?.status === 401 && !originalRequest._retry) {
  //     originalRequest._retry = true

  //     const authStore = useAuthStore()
  //     const refreshToken = authStore.refreshToken

  //     if (refreshToken) {
  //       try {
          // const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
          // const newToken: string = data.data.accessToken
          // authStore.accessToken = newToken
          // localStorage.setItem('accessToken', newToken)
          // originalRequest.headers.Authorization = `Bearer ${newToken}`
          // return http(originalRequest)
  //       } catch {
  //         authStore.logout()
  //         window.location.href = '/login'
  //         return Promise.reject(error)
  //       }
  //     } else {
  //       authStore.logout()
  //       window.location.href = '/login'
  //     }
  //   }

  //   const message =
  //     error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.'
  //   return Promise.reject(new Error(message))
  }
)

export default http
