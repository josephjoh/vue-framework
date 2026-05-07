import { get, post } from '@/api/request'
import type { LoginRequest, LoginResponse } from '@/types'

export const authApi = {
  login(payload: LoginRequest) {
    return post<LoginResponse>('/service/auth/login', payload)
  },

  logout() {
    // 쿠키 삭제
    return post<null>('/auth/logout')
  },

  refresh() {
    // 쿠키 갱신
    return post<void>('/auth/refresh')
  },

  me() {
    // 쿠키 유효성 확인 + user 정보 복원
    return get<LoginResponse['user']>('/auth/me')
  },
}
