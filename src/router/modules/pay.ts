import type { RouteRecordRaw, RouteMeta } from 'vue-router'

const payFiles = import.meta.glob('@/views/pay/**/*.vue')

const metaOverrides: Record<string, RouteMeta> = {
  // 기본값과 다른 화면만 정의
  'pay/num/PAYNUM000B01M': { requiresAuth: true, title: '전자번호 납부' },
  'pay/num/PAYNUM000B01M/complete': { requiresAuth: true, title: '납부 완료' },
}

export const payRoutes: RouteRecordRaw[] = Object.keys(payFiles).map((filePath) => {
  const parts = filePath.replace('/src/views/', '').replace('.vue', '').split('/')
  const path = parts.join('/').replace(/\/index$/, '')
  return {
    path: 'screen/' + path,
    name: parts.slice(-2).filter((p) => p !== 'index').join('-'),
    component: payFiles[filePath],
    meta: metaOverrides[path] ?? { requiresAuth: false },
  }
})
