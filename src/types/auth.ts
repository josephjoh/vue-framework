// DLGR=위임자, DLGE=수임자
export type UserRole = 'DLGR' | 'DLGE'

// INDV=개인, SOPR=개인사업자, CORP=법인
export type UserType = 'INDV' | 'SOPR' | 'CORP'

// SEMI=준회원, FULL=정회원
export type MemberType = 'SEMI' | 'FULL'

export interface User {
  id: number
  email: string
  name: string
  userRole?: UserRole
  userType: UserType
  memberType: MemberType
  avatar?: string
  createdAt: string
}

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
