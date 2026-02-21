# SoundDesk — Architecture

## 프로젝트 구조

```
src/
├── types/
│   └── index.ts              # 전체 엔티티 타입 + STORAGE_KEYS 상수
├── lib/
│   ├── storage.ts            # localStorage 원시 유틸 (getAll, save, generateId)
│   └── seed.ts               # 초기 시드 데이터 (앱 최초 실행 시 1회)
├── services/                 # 엔티티별 비즈니스 로직 + localStorage CRUD
│   ├── studioService.ts
│   ├── roomService.ts
│   ├── artistService.ts
│   ├── albumService.ts
│   ├── trackService.ts
│   ├── sessionService.ts
│   ├── equipmentService.ts
│   ├── memberService.ts
│   ├── invoiceService.ts
│   ├── contractService.ts
│   ├── playlistService.ts
│   ├── reviewService.ts
│   ├── tagService.ts
│   └── dashboardService.ts
├── components/               # 재사용 가능한 UI 컴포넌트
│   ├── layout/               # Sidebar, Header, MainLayout
│   ├── <entity>/             # 엔티티별 Form, Card 컴포넌트
│   ├── dashboard/            # 대시보드 위젯
│   └── reports/              # Recharts 차트 컴포넌트
└── app/
    ├── layout.tsx            # 루트 HTML 레이아웃 (font, html, body)
    ├── page.tsx              # / → redirect('/dashboard')
    └── (main)/               # Route Group — MainLayout 공유
        ├── layout.tsx        # MainLayout 적용 + seed 초기화 실행
        ├── dashboard/page.tsx
        ├── studio/page.tsx
        ├── rooms/page.tsx + [id]/page.tsx
        ├── artists/page.tsx + [id]/page.tsx
        ├── albums/page.tsx + [id]/page.tsx
        ├── sessions/page.tsx + [id]/page.tsx
        ├── equipment/page.tsx
        ├── members/page.tsx
        ├── invoices/page.tsx + [id]/page.tsx
        ├── contracts/page.tsx
        ├── playlists/page.tsx
        ├── reviews/page.tsx
        ├── tags/page.tsx
        ├── reports/page.tsx
        └── settings/page.tsx
```

---

## 라우팅

### Route Group `(main)`
- `src/app/(main)/layout.tsx`가 모든 주요 페이지에 `MainLayout` 자동 적용
- URL에는 `(main)` 경로 미포함 (`/rooms`, `/artists` 등으로 접근)
- `(main)/layout.tsx`에서 `initializeSeedData()` 한 번 호출

### 동적 라우트
- `/rooms/[id]` — 룸 상세/편집 + 장비 목록
- `/artists/[id]` — 아티스트 탭 뷰 (앨범/세션/인보이스/계약/리뷰)
- `/albums/[id]` — 앨범 상세 + 트랙 리스트 + 태그
- `/sessions/[id]` — 세션 상세 + 상태 전이 + 엔지니어 배정
- `/invoices/[id]` — 인보이스 상세 + 상태 전이

---

## 상태 관리

**외부 상태 관리 라이브러리 없음.** 모든 상태는 컴포넌트 로컬 상태.

### 패턴
```
페이지 마운트
  → useEffect(() => setItems(서비스.getAll()), [])
  → 필터 변경 시 클라이언트 사이드 filter/sort
  → CRUD 후 서비스 재호출로 목록 갱신 (전체 re-fetch)
```

### 이유
- localStorage는 동기 API → useEffect에서 안전하게 읽기 가능
- 전역 상태 없이 단순 로컬 상태로 충분
- `'use client'` 디렉티브 필수 (서버 컴포넌트에서 localStorage 접근 불가)

---

## 컴포넌트 계층 구조

```
app/(main)/layout.tsx
└── MainLayout
    ├── Sidebar               (18개 링크, 4개 그룹)
    └── 콘텐츠 영역
        ├── Header            (페이지 제목)
        └── <page content>
            ├── 필터 바 / 검색
            ├── 목록 (Card 그리드 or 테이블)
            │   └── <EntityCard> (반복)
            └── <EntityForm> (Dialog, open 상태로 조건부 렌더)
```

### 컴포넌트 종류

| 종류 | 예시 | 역할 |
|------|------|------|
| `<Entity>Card` | `ArtistCard`, `RoomCard` | 목록에서 단일 항목 표시 |
| `<Entity>Form` | `ArtistForm`, `RoomForm` | 생성/편집 Dialog 폼 |
| 특수 뷰 | `CalendarView`, `TrackList` | 복잡한 표시 전용 |
| 차트 | `RevenueChart`, `PieChart` | Recharts 래퍼 |
| 위젯 | `RevenueCard`, `SessionTimeline` | 대시보드 전용 |

---

## localStorage 서비스 설계 패턴

### 계층 구조

```
페이지/컴포넌트
    ↓ (서비스 함수 호출)
src/services/<entity>Service.ts
    ↓ (storage 유틸 호출)
src/lib/storage.ts
    ↓
localStorage
```

### storage.ts 인터페이스

| 함수 | 역할 |
|------|------|
| `getAll<T>(key)` | key의 JSON 배열 파싱, 없으면 `[]` 반환 |
| `getById<T>(key, id)` | 배열에서 id 매칭 항목 반환 |
| `save<T>(key, items)` | 배열 전체를 JSON.stringify로 저장 |
| `generateId()` | `crypto.randomUUID()` |

### 서비스 함수 시그니처 규칙

- `getXxx(filters?)` — 전체 조회 + 옵셔널 필터 객체
- `getXxxById(id)` — 단건 조회
- `createXxx(data)` — id/createdAt/updatedAt 자동 생성 후 저장
- `updateXxx(id, data)` — updatedAt 갱신 후 저장
- `deleteXxx(id)` — filter out 후 저장
- `updateXxxStatus(id, status)` — 상태만 변경하는 특수 업데이트

### 관계 처리 (JOIN 대신)

```
// 서비스 내부에서 수동 조인
const sessions = getSessions({ roomId })
const room = getRoomById(sessions[0].roomId)  // 필요 시 lookup
```

FK는 ID 문자열로 저장, 표시 시 서비스 호출로 연결 데이터 조회.
N:M 관계는 JSON 배열 문자열 (`sessionIds`, `trackIds`, `equipment`).

---

## 의존성 흐름 (단방향)

```
types/index.ts
    ↑
lib/storage.ts
    ↑
services/*.ts
    ↑
components/<entity>/*.tsx
    ↑
app/(main)/<page>/page.tsx
```

상위 레이어가 하위를 import. 역방향 import 금지.
