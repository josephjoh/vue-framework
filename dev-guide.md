# Vue Framework 표준 개발 가이드

> Vue 3.x 기반 공통 프레임워크의 개발 표준을 정의합니다.
> 모든 신규 기능 개발 시 이 가이드를 따릅니다.

---

## 목차

1. [기술 스택](#1-기술-스택)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [Vue 컴포넌트 작성 규칙](#3-vue-컴포넌트-작성-규칙)
4. [API 레이어](#4-api-레이어)
5. [Pinia 스토어](#5-pinia-스토어)
6. [Composables](#6-composables)
7. [TypeScript 타입 관리](#7-typescript-타입-관리)
8. [라우터](#8-라우터)
9. [UI 컴포넌트 (shadcn-vue)](#9-ui-컴포넌트-shadcn-vue)
10. [유틸리티 함수](#10-유틸리티-함수)
11. [스타일 가이드 (Tailwind CSS)](#11-스타일-가이드-tailwind-css)
12. [코드 컨벤션](#12-코드-컨벤션)
13. [환경변수](#13-환경변수)
14. [주요 명령어](#14-주요-명령어)

---

## 1. 기술 스택

| 항목 | 버전 | 용도 |
|------|------|------|
| Vue | 3.x | 프레임워크 (Composition API + `<script setup>`) |
| TypeScript | ~5.9 | 정적 타입 |
| Vite | 8.x | 빌드 도구 |
| Pinia | 3.x | 전역 상태 관리 |
| Vue Router | 4.x | 라우팅 |
| Axios | 1.x | HTTP 클라이언트 |
| Tailwind CSS | 4.x | 유틸리티 CSS |
| shadcn-vue | latest | UI 컴포넌트 라이브러리 |
| reka-ui | 2.x | shadcn-vue 헤드리스 UI 기반 |
| vue-sonner | 2.x | 토스트 알림 |

---

## 2. 프로젝트 구조

```
src/
├── api/
│   ├── index.ts              # Axios 인스턴스 + interceptor
│   ├── request.ts            # HTTP 메서드 래퍼 (get/post/put/del/postList)
│   └── services/             # 도메인별 API 서비스
│       ├── auth.ts
│       └── example.ts        # 서비스 작성 참고용 예시
├── assets/
│   └── main.css              # Tailwind CSS + 디자인 토큰
├── components/
│   ├── layout/               # 레이아웃 컴포넌트
│   │   ├── AppLayout.vue
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   └── ui/                   # shadcn-vue 컴포넌트 (수정 금지)
│       ├── button/
│       ├── input/
│       ├── dialog/
│       └── ...
├── composables/              # Vue Composables
│   ├── useApi.ts
│   ├── useAuth.ts
│   └── useToast.ts
├── lib/
│   └── utils.ts              # cn() 유틸리티 (shadcn-vue 전용)
├── router/
│   └── index.ts              # Vue Router + navigation guard
├── stores/                   # Pinia 스토어
│   ├── auth.ts
│   └── ui.ts
├── types/                    # TypeScript 타입 정의
│   ├── api.ts
│   ├── auth.ts
│   └── index.ts
├── utils/                    # 순수 유틸리티 함수
│   ├── date.ts
│   ├── format.ts
│   └── validators.ts
└── views/                    # 페이지 컴포넌트
    ├── HomeView.vue
    ├── LoginView.vue
    └── NotFoundView.vue
```

---

## 3. Vue 컴포넌트 작성 규칙

### 블록 순서

`<template>` → `<script>` → `<style>` 순서로 작성합니다.

```vue
<template>
  <div>...</div>
</template>

<script setup lang="ts">
// 로직
</script>

<style scoped>
/* 필요한 경우만 */
</style>
```

### script setup 내부 순서

```vue
<script setup lang="ts">
// 1. 외부 라이브러리 import
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. 내부 import (타입은 import type으로 분리)
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

// 3. Props / Emits 정의
const props = defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()

// 4. 스토어 / Composables
const authStore = useAuthStore()
const router = useRouter()

// 5. 반응형 상태
const isOpen = ref(false)

// 6. Computed
const isAdmin = computed(() => authStore.userRole === 'admin')

// 7. 함수
function handleClose() {
  emit('close')
}
</script>
```

### 컴포넌트 네이밍

| 종류 | 규칙 | 예시 |
|------|------|------|
| 페이지 컴포넌트 | `View` 접미사 | `HomeView.vue`, `UserListView.vue` |
| 레이아웃 컴포넌트 | `App` 접두사 | `AppHeader.vue`, `AppSidebar.vue` |
| 도메인 컴포넌트 | PascalCase | `UserCard.vue`, `PostTable.vue` |
| shadcn-vue (ui/) | 그대로 유지 | `Button.vue`, `Dialog.vue` |

### style scoped

Tailwind로 처리할 수 없는 경우에만 `<style scoped>` 사용합니다.
가능하면 Tailwind 클래스만으로 스타일링합니다.

---

## 4. API 레이어

### 구조 개요

```
views / composables
    ↓ useApi() 또는 직접 호출
api/services/xxx.ts     ← 도메인별 API 함수
    ↓
api/request.ts          ← HTTP 래퍼 (res.data.data 언래핑)
    ↓
api/index.ts            ← Axios 인스턴스 (interceptor)
    ↓
백엔드 API
```

### HTTP 래퍼 (`src/api/request.ts`)

`res.data.data` 언래핑을 일괄 처리합니다. 서비스 파일에서는 래퍼만 사용합니다.

```ts
import { get, post, put, del, postList } from '@/api/request'

get<T>(url, params?)          // GET → res.data.data 반환
post<T>(url, body?)           // POST → res.data.data 반환
put<T>(url, body)             // PUT → res.data.data 반환
del<T>(url)                   // DELETE → res.data.data 반환
postList<T>(url, body?)       // POST 목록 → PaginatedResponse<T> 반환 (meta 포함)
```

> **페이지네이션 GET** 처럼 `meta`가 필요한 경우 `http`를 직접 사용합니다.
> ```ts
> import http from '@/api'
> const res = await http.get<PaginatedResponse<T>>(url, { params })
> return res.data
> ```

### 서비스 파일 작성 (`src/api/services/`)

파일명: `도메인명.ts` (소문자)
export명: `도메인명Api` (camelCase)

```ts
// src/api/services/user.ts
import { get, post, put, del, postList } from '@/api/request'
import type { User, CreateUserRequest, PaginationParams } from '@/types'

export const userApi = {
  getList: (params?: PaginationParams) => {
    // meta 필요 시 http 직접 사용
    return http.get<PaginatedResponse<User>>('/users', { params }).then(r => r.data)
  },
  getById: (id: number) => get<User>(`/users/${id}`),
  create: (payload: CreateUserRequest) => post<User>('/users', payload),
  update: (id: number, payload: Partial<CreateUserRequest>) => put<User>(`/users/${id}`, payload),
  delete: (id: number) => del(`/users/${id}`),
}
```

### Axios Interceptor 주의사항

`useAuthStore()`는 interceptor **콜백 내부**에서만 호출합니다.
모듈 최상위에서 호출하면 순환 참조 초기화 오류가 발생합니다.

```ts
// ✅ 올바름 — 런타임 호출
http.interceptors.request.use((config) => {
  const authStore = useAuthStore()  // 콜백 내부
  ...
})

// ❌ 잘못됨 — 모듈 초기화 시점
const authStore = useAuthStore()  // 최상위
http.interceptors.request.use(...)
```

---

## 5. Pinia 스토어

### 작성 규칙

- **Setup store** 형식만 사용합니다 (Options store 사용 금지).
- 내부 전용 함수는 `_` 접두사를 붙입니다.
- 파일명: `도메인명.ts` (소문자)

```ts
// src/stores/example.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // state
  const items = ref<Item[]>([])
  const isLoading = ref(false)

  // getters
  const count = computed(() => items.value.length)

  // actions
  async function fetchItems() {
    isLoading.value = true
    try {
      items.value = await itemApi.getList()
    } finally {
      isLoading.value = false
    }
  }

  // 내부 전용
  function _reset() {
    items.value = []
  }

  return { items, isLoading, count, fetchItems }
})
```

### 기존 스토어 API

**auth 스토어** (`src/stores/auth.ts`)

```ts
const authStore = useAuthStore()

authStore.user            // User | null
authStore.accessToken     // string | null
authStore.isAuthenticated // computed boolean
authStore.userRole        // 'admin' | 'user' | 'guest'

await authStore.login({ email, password })
await authStore.logout()
await authStore.fetchMe()
```

**ui 스토어** (`src/stores/ui.ts`)

```ts
const uiStore = useUiStore()

uiStore.isLoading          // boolean
uiStore.setLoading(true)   // 전역 로딩 오버레이

// 토스트는 useToast() composable로 사용
```

---

## 6. Composables

파일명과 함수명 모두 `use` 접두사를 사용합니다.

### useToast

```ts
const toast = useToast()

toast.success('저장되었습니다.')
toast.error('오류가 발생했습니다.')
toast.warning('주의가 필요합니다.')
toast.info('안내 메시지입니다.')
```

### useAuth

```ts
const { isAuthenticated, user, userRole, login, logout } = useAuth()

await login({ email, password })  // 성공 시 Home(또는 redirect) 이동
await logout()                    // 로그인 페이지 이동
```

### useApi

API 호출의 로딩·에러 상태를 관리합니다.

```ts
const { data, error, isLoading, execute } = useApi<User>()

await execute(() => userApi.getById(1))
// data.value → 결과
// error.value → 에러 메시지
// isLoading.value → 로딩 여부
```

전역 로딩 오버레이 연동:

```ts
const { execute } = useApi<User>({ globalLoading: true })
```

### Composable 작성 규칙

```ts
// src/composables/useExample.ts
import { ref } from 'vue'

export function useExample() {
  const value = ref('')

  function reset() {
    value.value = ''
  }

  return { value, reset }
}
```

---

## 7. TypeScript 타입 관리

### 위치

- **API 공통 타입**: `src/types/api.ts`
- **인증 타입**: `src/types/auth.ts`
- **도메인 타입**: 각 `src/api/services/도메인.ts` 파일 내 또는 `src/types/` 추가
- **전체 re-export**: `src/types/index.ts`

### 공통 API 타입

```ts
// 단건 응답
ApiResponse<T>      // { success, data: T, message?, code? }

// 목록 응답 (페이지네이션)
PaginatedResponse<T> // { success, data: T[], meta: PaginationMeta }
PaginationMeta       // { page, pageSize, total, totalPages }
PaginationParams     // { page?, pageSize?, sort?, order? }

// 에러
ApiError             // { success: false, message, code, errors? }
```

### import 규칙

타입과 값 import를 반드시 분리합니다.

```ts
// ✅ 올바름
import type { User, LoginRequest } from '@/types'
import { useAuthStore } from '@/stores/auth'

// ❌ 잘못됨
import { type User, useAuthStore } from '@/stores/auth'
```

---

## 8. 라우터

### 라우트 메타 옵션

```ts
meta: { requiresAuth: true }  // 미인증 시 /login 이동
meta: { guestOnly: true }     // 인증 상태에서 접근 시 / 이동
meta: { title: '페이지 제목' } // document.title 자동 설정
```

### 새 라우트 추가

인증이 필요한 페이지는 기존 레이아웃 라우트의 `children`에 추가합니다.

```ts
// src/router/index.ts
{
  path: '/',
  component: () => import('@/components/layout/AppLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    {
      path: 'users',
      name: 'Users',
      component: () => import('@/views/UsersView.vue'),
      meta: { title: '사용자 관리', requiresAuth: true },
    },
  ],
}
```

### 페이지 컴포넌트 작성

```vue
<!-- src/views/UsersView.vue -->
<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">사용자 관리</h1>
    ...
  </div>
</template>

<script setup lang="ts">
// 로직
</script>
```

---

## 9. UI 컴포넌트 (shadcn-vue)

### 원칙

- `src/components/ui/` 하위 파일은 **직접 수정하지 않습니다**.
- `npx shadcn-vue@latest add <컴포넌트명>` 으로만 추가합니다.

### 설치된 컴포넌트

| 컴포넌트 | import 경로 |
|---------|------------|
| Button | `@/components/ui/button` |
| Input | `@/components/ui/input` |
| Label | `@/components/ui/label` |
| Dialog | `@/components/ui/dialog` |
| Select | `@/components/ui/select` |
| Checkbox | `@/components/ui/checkbox` |
| Separator | `@/components/ui/separator` |
| Accordion | `@/components/ui/accordion` |
| Badge | `@/components/ui/badge` |
| Breadcrumb | `@/components/ui/breadcrumb` |
| Card | `@/components/ui/card` |
| Collapsible | `@/components/ui/collapsible` |
| DropdownMenu | `@/components/ui/dropdown-menu` |
| Table | `@/components/ui/table` |
| Tabs | `@/components/ui/tabs` |
| Toaster (Sonner) | `@/components/ui/sonner` |

### 주요 사용 예시

**Button**

```vue
<Button>기본</Button>
<Button variant="secondary">보조</Button>
<Button variant="destructive">삭제</Button>
<Button variant="ghost">텍스트</Button>
<Button variant="outline">아웃라인</Button>
<Button size="sm">작게</Button>
<Button size="lg">크게</Button>
<Button :disabled="isLoading">비활성화</Button>
```

**Input + Label (폼 필드)**

```vue
<div class="space-y-1">
  <Label for="email">이메일</Label>
  <Input id="email" v-model="email" type="email" :aria-invalid="!!error" />
  <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
</div>
```

**Dialog**

```vue
<Dialog v-model:open="isOpen">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
    </DialogHeader>
    <p>본문 내용</p>
    <DialogFooter>
      <Button variant="secondary" @click="isOpen = false">취소</Button>
      <Button @click="handleConfirm">확인</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Card**

```vue
<Card>
  <CardHeader>
    <CardTitle>카드 제목</CardTitle>
    <CardDescription>카드 설명</CardDescription>
  </CardHeader>
  <CardContent>
    <p>내용</p>
  </CardContent>
  <CardFooter>
    <Button>액션</Button>
  </CardFooter>
</Card>
```

**Tabs**

```vue
<Tabs default-value="tab1">
  <TabsList>
    <TabsTrigger value="tab1">탭 1</TabsTrigger>
    <TabsTrigger value="tab2">탭 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">탭 1 내용</TabsContent>
  <TabsContent value="tab2">탭 2 내용</TabsContent>
</Tabs>
```

**Select**

```vue
<Select v-model="selected">
  <SelectTrigger>
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">옵션 A</SelectItem>
    <SelectItem value="b">옵션 B</SelectItem>
  </SelectContent>
</Select>
```

**Toast (Sonner)**

`useToast()` composable을 통해서만 사용합니다. `Toaster`는 `App.vue`에 전역 등록되어 있습니다.

```ts
const toast = useToast()
toast.success('저장되었습니다.')
toast.error('오류가 발생했습니다.')
```

---

## 10. 유틸리티 함수

### 날짜 (`src/utils/date.ts`)

```ts
import { formatDate, timeAgo, diffDays } from '@/utils/date'

formatDate('2024-01-15T10:30:00')              // '2024-01-15'
formatDate('2024-01-15T10:30:00', 'YYYY-MM-DD HH:mm') // '2024-01-15 10:30'
timeAgo('2024-01-14T10:00:00')                // '1일 전'
diffDays('2024-01-01', '2024-01-15')          // 14
```

### 포맷 (`src/utils/format.ts`)

```ts
import { formatNumber, formatCurrency, formatBytes, truncate } from '@/utils/format'

formatNumber(1234567)       // '1,234,567'
formatCurrency(50000)       // '₩50,000'
formatBytes(1048576)        // '1 MB'
truncate('긴 문자열입니다', 8) // '긴 문자...'
```

### 유효성 검사 (`src/utils/validators.ts`)

```ts
import { isEmail, isRequired, isStrongPassword, isPhoneNumber, minLength, maxLength, isUrl } from '@/utils/validators'

isEmail('test@example.com')    // true
isRequired('')                 // false
isStrongPassword('pass1234')   // true
isPhoneNumber('010-1234-5678') // true
minLength('abc', 3)            // true
maxLength('abc', 2)            // false
isUrl('https://example.com')   // true
```

---

## 11. 스타일 가이드 (Tailwind CSS)

### 기본 원칙

- 인라인 style 속성 사용 금지, Tailwind 클래스로만 스타일링합니다.
- 반복되는 클래스 조합은 컴포넌트로 추출합니다.
- shadcn-vue 컴포넌트 커스터마이징은 `class` prop으로 전달합니다.

### 디자인 토큰

CSS 변수로 정의된 시맨틱 토큰을 사용합니다.

```
bg-background / text-foreground     기본 배경/텍스트
bg-card / text-card-foreground      카드
bg-primary / text-primary-foreground 주요 강조
bg-secondary / text-secondary-foreground 보조
bg-muted / text-muted-foreground    흐린 텍스트
bg-destructive                      위험/삭제
border-border                       테두리
```

### cn() 유틸리티

조건부 클래스 조합 및 Tailwind 충돌 해결에 사용합니다.

```ts
import { cn } from '@/lib/utils'

cn('px-4 py-2', isActive && 'bg-primary text-primary-foreground')
cn('text-sm', props.class)  // props.class로 외부 클래스 병합
```

### 다크 모드

`dark:` variant로 다크 모드 스타일을 정의합니다. 시맨틱 토큰을 사용하면 자동으로 적용됩니다.

```vue
<div class="bg-background text-foreground">  <!-- 자동 다크 모드 -->
<div class="bg-white dark:bg-gray-900">      <!-- 직접 지정 시 -->
```

---

## 12. 코드 컨벤션

### 파일 & 디렉토리

| 대상 | 규칙 |
|------|------|
| Vue 컴포넌트 | PascalCase (`UserCard.vue`) |
| TypeScript 파일 | camelCase (`useAuth.ts`, `auth.ts`) |
| 디렉토리 | kebab-case (`dropdown-menu/`) |

### 함수 & 변수

| 대상 | 규칙 | 예시 |
|------|------|------|
| 일반 함수/변수 | camelCase | `handleSubmit`, `isLoading` |
| 스토어 내부 전용 | `_` 접두사 | `_clearAuth()` |
| Composable | `use` 접두사 | `useToast()` |
| API 서비스 객체 | `Api` 접미사 | `userApi`, `authApi` |
| 타입/인터페이스 | PascalCase | `User`, `LoginRequest` |

### import 순서

```ts
// 1. 외부 라이브러리 (vue, vue-router, pinia, ...)
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. 내부 타입 (import type 으로 분리)
import type { User } from '@/types'

// 3. 내부 모듈 (@/ 절대경로)
import { useAuthStore } from '@/stores/auth'
import { userApi } from '@/api/services/user'
import { Button } from '@/components/ui/button'

// 4. 상대경로 import
import MyChild from './MyChild.vue'
```

### 금지 사항

- `any` 타입 사용 금지 → `unknown` 또는 구체적인 타입 사용
- Options API 사용 금지 → Composition API + `<script setup>` 사용
- `src/components/ui/` 파일 직접 수정 금지
- 인라인 style 속성 사용 금지 (Tailwind 사용)

---

## 13. 환경변수

`.env` 파일에 정의하며, Vite를 통해 `import.meta.env`로 접근합니다.

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080   # API 서버 주소
VITE_APP_NAME=vue-framework               # 앱 이름
VITE_APP_VERSION=1.0.0
```

```ts
// 코드에서 접근
const apiBase = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME
```

> `VITE_` 접두사가 없는 변수는 클라이언트에 노출되지 않습니다.
> 민감한 정보(시크릿 키 등)는 절대 `VITE_` 접두사로 선언하지 않습니다.

---

## 14. 주요 명령어

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # TypeScript 검사 + 프로덕션 빌드
npm run lint     # ESLint 검사 및 자동 수정
npm run format   # Prettier 코드 포맷

# shadcn-vue 컴포넌트 추가
npx shadcn-vue@latest add <컴포넌트명>

# 예시
npx shadcn-vue@latest add tooltip
npx shadcn-vue@latest add alert-dialog
```
