import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { pubRoutes } from './modules/pub'

// const pubFiles = import.meta.glob('@/views/pub/**/*.vue')
// const pubRoutes: RouteRecordRaw[] = Object.keys(pubFiles).map((filePath) => {
//   const path = filePath.replace('/src/views/', '').replace('.vue', '').replace(/\/index$/, '')
//   return {
//     path: path,
//     name: path.replace(/\//g, '-'),
//     component: pubFiles[filePath],
//     meta: {
//       title: `퍼블 - ${path.split('/').pop()}`,
//       requiresAuth: false
//     }
//   }
// })

// declare module 'vue-router' {
//   interface RouteMeta {
//     requiresAuth?: boolean
//     guestOnly?: boolean
//     title?: string
//   }
// }

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    // meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '홈' },
      },
      {
        path: '/pay/num/PAYNUM000B01M',
        name: 'PAYNUM000B01M',
        component: () => import('@/views/pay/num/PAYNUM000B01M.vue'),
        meta: { title: '홈' },
      },
      ...pubRoutes
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '로그인', guestOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '페이지를 찾을 수 없습니다' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// Navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const menuStore = useMenuStore()

  // 페이지 타이틀 설정
  document.title = to.meta.title
    ? `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME

  // 인증 필요한 페이지 → 비로그인 시 login 이동
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // 메뉴 미로드 시 fetch (새로고침 대비 — AppLayout onMounted보다 먼저 실행됨)
  if (to.name !== 'Login' && to.name !== 'NotFound' && menuStore.menus.length === 0) {
    await menuStore.fetchMenu(authStore.userRole)
  }

  // 메뉴 권한 체크: permissionMap에 등록된 경로만 검사
  if (to.name !== 'Login' && to.name !== 'NotFound') {
    const allowedRoles = menuStore.permissionMap.get(to.path)
    if (allowedRoles !== undefined && !allowedRoles.includes(authStore.userRole)) {
      alert('해당 메뉴에 대한 접근 권한이 없습니다.')
      return authStore.isAuthenticated ? { name: 'Home' } : { name: 'Login' }
    }
  }
})

export default router
