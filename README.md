# vue-framework

Vue 3.x 기반 공통 프레임워크

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Node | 24.x |
| Vue | 3.x (Composition API + `<script setup>`) |
| TypeScript | ~5.9 |
| Vite | 8.x |
| Pinia | 3.x |
| Vue Router | 4.x |
| Axios | 1.x |
| Tailwind CSS | 4.x |
| shadcn-vue | latest |
| ESLint | 10.x (flat config) |
| Prettier | 3.x |

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# ESLint 검사 및 자동 수정
npm run lint

# Prettier 포맷
npm run format
```

---

## 환경변수

`.env` 파일을 생성하고 아래 변수를 설정합니다.

```bash
VITE_API_BASE_URL=http://localhost:8080   # API 서버 주소
VITE_APP_NAME=vue-framework               # 앱 이름
VITE_APP_VERSION=1.0.0
```

---

## 프로젝트 구조

```
src/
├── api/
│   ├── index.ts              # Axios 인스턴스 + interceptor
│   ├── request.ts            # HTTP 메서드 래퍼 (get/post/put/del/postList)
│   └── services/             # 도메인별 API 서비스
├── assets/
│   └── main.css              # Tailwind CSS + 디자인 토큰
├── components/
│   ├── layout/               # 레이아웃 컴포넌트
│   └── ui/                   # shadcn-vue 컴포넌트
├── composables/              # Vue Composables (useApi, useAuth, useToast)
├── router/                   # Vue Router + navigation guard
├── stores/                   # Pinia 스토어 (auth, ui)
├── types/                    # TypeScript 공통 타입
├── utils/                    # 순수 유틸리티 함수 (date, format, validators)
└── views/                    # 페이지 컴포넌트
```

---

## 주요 기능

### 인증 (Auth)

JWT 기반 인증이 내장되어 있습니다. 토큰은 `localStorage`에 저장되며, Axios interceptor를 통해 모든 요청에 자동 첨부됩니다. 401 응답 시 refreshToken으로 자동 재발급 후 원래 요청을 재시도합니다.

```ts
const { login, logout, isAuthenticated, user } = useAuth()

await login({ email, password })  // 성공 시 Home으로 이동
await logout()                    // 로그인 페이지로 이동
```

### 라우터 가드

```ts
meta: { requiresAuth: true }  // 미인증 시 /login 이동
meta: { guestOnly: true }     // 인증 상태에서 접근 시 / 이동
meta: { title: '페이지 제목' } // document.title 자동 설정
```

### 토스트 알림

```ts
const toast = useToast()

toast.success('저장되었습니다.')
toast.error('오류가 발생했습니다.')
toast.warning('주의가 필요합니다.')
toast.info('안내 메시지입니다.')
```

### API 호출

```ts
// 로딩/에러 상태 자동 관리
const { data, error, isLoading, execute } = useApi<User>()
await execute(() => userApi.getById(1))

// 직접 호출
import { get, post, put, del } from '@/api/request'
```

---

## 개발 가이드

상세한 개발 표준은 [dev-guide.md](./dev-guide.md)를 참고하세요.
