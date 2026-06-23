import { post } from '@/api/request'
import type { LoginRequest, LoginResponse, ApiError } from '@/types'
import { useServiceApi } from '@/composables/useServiceApi'

const { callPostApi } = useServiceApi()

export const authApi = {
  login: async (payload: LoginRequest) => {
    try {
      const serviceId = ''
      payload = {
        email: 'as',
        password: 'ss',
      }

      const result = await callPostApi<LoginRequest, LoginResponse>(
        serviceId,
        payload
      )
      // return post<LoginResponse>('/service/auth/login', payload)
      return result
    } catch (e: unknown) {
      const err = e as ApiError
      console.log('err >>> ', err.errorCode)
    }
  },

  logout() {
    // 쿠키 삭제
    return post<null>('/auth/logout')
  },

  // refresh() {
  //   // 쿠키 갱신
  //   return post<void>('/auth/refresh')
  // },

  upgradeMembership() {
    // 준회원 → 정회원 전환
    return post<void>('/auth/membership/upgrade')
  },
}
