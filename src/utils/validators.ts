/** 이메일 유효성 검사 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** 비밀번호: 최소 8자, 영문+숫자 포함 */
export function isStrongPassword(value: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value)
}

/** 한국 휴대폰 번호 */
export function isPhoneNumber(value: string): boolean {
  return /^01[0-9]-?\d{3,4}-?\d{4}$/.test(value)
}

/** 필수값 확인 */
export function isRequired(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

/** 최소 길이 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

/** 최대 길이 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}

/** URL 형식 검사 */
export function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}
