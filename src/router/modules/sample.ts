import type { RouteRecordRaw } from 'vue-router'

const sampleFiles = import.meta.glob('@/views/sample/**/*.vue')

export const sampleRoutes: RouteRecordRaw[] = Object.keys(sampleFiles).map((filePath) => {
  const path = filePath
    .replace('/src/views/', '')
    .replace('.vue', '')
    .replace(/\/index$/, '')
  return {
    path: '/screen/' + path,
    name: path.split('/').slice(1).join('-'),
    component: sampleFiles[filePath],
  }
})
