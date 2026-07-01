import type { RouteRecordRaw, RouteMeta } from 'vue-router'

const manFiles = import.meta.glob('@/views/man/**/index.vue')

// 루트(/)로도 접근시킬 화면
const HOME_PATH = 'man/MAN000000A01M'

const metaOverrides: Record<string, RouteMeta> = {
  // 기본값과 다른 화면만 정의
}

export const manRoutes: RouteRecordRaw[] = Object.keys(manFiles).map((filePath) => {
  const parts = filePath.replace('/src/views/', '').replace('.vue', '').split('/')
  const path = parts.join('/').replace(/\/index$/, '')
  const filtered = parts.filter((p) => p !== 'index')
  const screenIdIdx = filtered.findIndex((p) => /^[A-Z]{2,}/.test(p))
  const name = (screenIdIdx >= 0 ? filtered.slice(screenIdIdx) : filtered.slice(-1)).join('-')
  return {
    path: 'screen/' + path,
    name,
    component: manFiles[filePath],
    meta: metaOverrides[path] ?? { requiresAuth: false },
    ...(path === HOME_PATH ? { alias: '/' } : {}),
  }
})
