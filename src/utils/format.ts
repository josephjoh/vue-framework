/**
 * 숫자를 천 단위 구분자로 포맷
 * @example formatNumber(1234567) => '1,234,567'
 */
export function formatNumber(value: number, locale = 'ko-KR'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * 숫자를 통화 포맷으로 변환
 * @example formatCurrency(50000) => '₩50,000'
 */
export function formatCurrency(value: number, currency = 'KRW', locale = 'ko-KR'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

/**
 * 바이트 크기를 사람이 읽기 쉬운 단위로 변환
 * @example formatBytes(1048576) => '1 MB'
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * 문자열 truncate (말줄임)
 * @example truncate('hello world', 8) => 'hello...'
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}

/**
 * camelCase → 한글 레이블 변환 (기본 fallback)
 * @example camelToLabel('userName') => 'User Name'
 */
export function camelToLabel(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}
