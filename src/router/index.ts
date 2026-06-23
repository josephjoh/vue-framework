import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNativeBridge } from '@/composables/useNativeBridge'
import { pubRoutes } from './modules/pub'
import { payRoutes } from './modules/pay'
import { sampleRoutes } from './modules/sample'


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
      ...payRoutes,
      ...pubRoutes,
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '로그인', guestOnly: true },
  },
  {
    path: '/member/cert',
    name: 'MemberCert',
    component: () => import('@/views/MemberCertView.vue'),
    meta: { title: '정회원 인증', requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '페이지를 찾을 수 없습니다' },
  },
  ...sampleRoutes,
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
  // 네이티브 화면 분기 — WebView 내비게이션 취소
  if (to.meta.nativeScreen) {
    const { postMessage } = useNativeBridge()
    postMessage('OPEN_NATIVE_SCREEN', {
      screenId: to.meta.nativeScreen.screenId,
      ...to.meta.nativeScreen.payload,
    })
    return false
  }

  const authStore = useAuthStore()

  // 페이지 타이틀 설정
  document.title = to.meta.title
    ? `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`
    : import.meta.env.VITE_APP_NAME

  // 인증 필요한 페이지 → 비로그인 시 login 이동
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // 정회원 전용 페이지 → 준회원이면 인증 화면으로
  if (to.meta.requiresFullMember && authStore.user?.memberType === 'SEMI') {
    return { name: 'MemberCert', query: { redirect: to.fullPath } }
  }

  // 정회원이 인증 화면 직접 접근 시 홈으로
  if (to.name === 'MemberCert' && authStore.user?.memberType === 'FULL') {
    return { name: 'Home' }
  }

})

export default router
