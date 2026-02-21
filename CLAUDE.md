# SoundDesk — AI Agent 가이드

## 프로젝트 개요
음악 스튜디오 관리 시스템. 스튜디오/룸/아티스트/앨범/세션/장비/인보이스를 localStorage에서 관리하는 Next.js 앱.

## 기술 스택
- Next.js 16, TypeScript, App Router
- Tailwind CSS + shadcn/ui (style: default, base: slate)
- Recharts (차트), lucide-react (아이콘)
- localStorage (백엔드 없음, 클라이언트 전용)

## 빌드 명령어
```
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 디렉터리 규칙
```
src/types/index.ts          # 전체 엔티티 타입 — 여기만 수정
src/lib/storage.ts          # localStorage 유틸 — 직접 사용 금지, 서비스 통해서
src/lib/seed.ts             # 초기 데이터
src/services/*.ts           # 엔티티별 CRUD 서비스
src/components/<entity>/    # 엔티티별 컴포넌트 (Form, Card 등)
src/components/layout/      # Sidebar, Header, MainLayout
src/app/(main)/             # Route Group — MainLayout 자동 적용
```

## 코딩 컨벤션
- 컴포넌트: PascalCase, 파일명 = 컴포넌트명
- 서비스 함수: camelCase (`getArtists`, `createArtist`)
- 타입: `src/types/index.ts` 한 곳에서만 정의, import는 `@/types`
- `'use client'` 디렉티브: localStorage 접근하는 모든 컴포넌트/페이지에 필수
- 날짜: `YYYY-MM-DD` 문자열, 시간: `HH:mm` 문자열
- ID 생성: `crypto.randomUUID()`
- 금액: KRW는 `toLocaleString('ko-KR')`, USD는 Intl.NumberFormat

## localStorage 사용 패턴
- **직접 접근 금지** — 반드시 `src/services/*.ts` 통해서만
- 키 네이밍: `sounddesk_<entity>` (예: `sounddesk_rooms`)
- 모든 엔티티는 JSON 배열로 저장 (Studio 제외 — 단일 객체)
- FK는 ID 문자열 저장, 조인은 서비스 레이어에서 처리
- JSON 배열 필드 (sessionIds, trackIds 등): JSON.stringify/parse 처리

## 폼 컴포넌트 패턴
shadcn Dialog + props: `open`, `onOpenChange`, `onSuccess`, `initialData?`
성공 콜백 후 부모에서 서비스 재호출로 목록 갱신.

## 구현 계획
`docs/IMPLEMENTATION.md` 참조 (Wave 1→2→3→4 순서 준수)
