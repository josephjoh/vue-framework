# Error Fix Log

개발 중 발생한 에러와 수정 내용을 기록합니다.

---

## [2026-03-25] 프로젝트 초기 생성

### 에러 1: `npm create vite@latest . -- --template vue-ts` 실행 시 `Operation cancelled`

**원인**: `npm create vite`가 이미 존재하는 디렉토리를 감지해 대화형 확인 요청 — stdin 파이핑 불가.

**해결**: 임시 디렉토리(`/tmp/vue-framework-temp`)에 생성 후 파일 복사.

```bash
cd /tmp && npx --yes create-vite@latest vue-framework-temp --template vue-ts
cp -r /tmp/vue-framework-temp/. /workspace/vue-framework/
```

---

## [2026-03-25] AppHeader.vue 빌드 에러

### 에러 2: `Property '$env' does not exist on type`

**에러 내용**:
```
src/components/layout/AppHeader.vue(23,12): error TS2339: Property '$env' does not exist on type ...
```

**원인**: Vue 템플릿에서 `$env`는 존재하지 않는 속성. `import.meta.env`는 `<script>` 블록에서만 사용 가능.

**해결**: `<script setup>`에서 변수로 선언 후 템플릿에 바인딩.

```ts
// 변경 전 (template)
{{ $env?.VITE_APP_NAME || 'vue-framework' }}

// 변경 후 (script setup)
const appName = import.meta.env.VITE_APP_NAME || 'vue-framework'
// template
{{ appName }}
```

**변경 파일**: `src/components/layout/AppHeader.vue`

---

## [2026-03-25] VSCode에서 vue/css import 빨간줄

### 에러 3: `.vue` 파일 및 `import './assets/main.css'` 빨간줄

**에러 내용**: VSCode에서 `.vue` 파일 import 및 CSS 사이드이펙트 import에 빨간 밑줄 표시

**원인 1**: `src/vite-env.d.ts` 파일 누락 → TypeScript가 `.vue` 모듈 타입을 인식하지 못함

**원인 2**: `tsconfig.app.json`의 `noUncheckedSideEffectImports: true` 옵션 → `import './assets/main.css'` 같은 사이드이펙트 import를 오류로 처리

**해결**:
1. `src/vite-env.d.ts` 생성 — `.vue` 모듈 타입 및 CSS 모듈 선언 추가
2. `tsconfig.app.json`에서 `noUncheckedSideEffectImports` 옵션 제거

**변경 파일**: `src/vite-env.d.ts` (신규), `tsconfig.app.json`

---

## 에러 발생 시 아래 형식으로 추가 기록

```
## [날짜] 에러 제목

**에러 내용**:
\`\`\`
에러 메시지
\`\`\`

**원인**: 원인 분석

**해결**: 해결 방법 및 변경 파일
```
