export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}

// export type UserRole = 'admin' | 'user' | 'guest'
export type UserRole = '1' | '2' | '3'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}
