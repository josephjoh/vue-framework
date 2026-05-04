import type { RouteRecordRaw } from 'vue-router'

const pubFiles = import.meta.glob('@/views/pub/**/*.vue')
export const pubRoutes: RouteRecordRaw[] = Object.keys(pubFiles).map((filePath) => {
  const path = filePath.replace('/src/views/', '').replace('.vue', '').replace(/\/index$/, '')
  return {
    path: 'screen/' + path,
    name: path.replace(/\//g, '-'),
    component: pubFiles[filePath],
    meta: {
      title: `퍼블 - ${path.split('/').pop()}`,
      requiresAuth: false
    }
  }
})