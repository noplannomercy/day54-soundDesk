# SoundDesk Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Next.js 16 + TypeScript 기반 음악 스튜디오 관리 시스템 구축 (localStorage 저장, shadcn/ui UI)

**Architecture:** App Router + Route Groups로 레이아웃 분리, 서비스 레이어(src/services/)가 localStorage CRUD 담당, 컴포넌트는 서비스만 호출. 모든 상태는 localStorage에 JSON 직렬화.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Recharts, lucide-react, localStorage

---

## 프로젝트 디렉터리 구조 (전체)

```
day54-soundDesk/
├── src/
│   ├── types/
│   │   └── index.ts                  # 전체 엔티티 타입 정의
│   ├── lib/
│   │   ├── storage.ts                # localStorage 기본 유틸
│   │   └── seed.ts                   # 초기 시드 데이터
│   ├── services/
│   │   ├── studioService.ts
│   │   ├── roomService.ts
│   │   ├── artistService.ts
│   │   ├── albumService.ts
│   │   ├── trackService.ts
│   │   ├── sessionService.ts
│   │   ├── equipmentService.ts
│   │   ├── memberService.ts
│   │   ├── invoiceService.ts
│   │   ├── contractService.ts
│   │   ├── playlistService.ts
│   │   ├── reviewService.ts
│   │   ├── tagService.ts
│   │   └── dashboardService.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── studio/
│   │   │   └── StudioForm.tsx
│   │   ├── rooms/
│   │   │   ├── RoomCard.tsx
│   │   │   └── RoomForm.tsx
│   │   ├── artists/
│   │   │   ├── ArtistCard.tsx
│   │   │   └── ArtistForm.tsx
│   │   ├── albums/
│   │   │   ├── AlbumCard.tsx
│   │   │   └── AlbumForm.tsx
│   │   ├── tracks/
│   │   │   ├── TrackList.tsx
│   │   │   └── TrackForm.tsx
│   │   ├── members/
│   │   │   ├── MemberCard.tsx
│   │   │   └── MemberForm.tsx
│   │   ├── sessions/
│   │   │   ├── SessionForm.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   └── TimelineView.tsx
│   │   ├── equipment/
│   │   │   ├── EquipmentCard.tsx
│   │   │   └── EquipmentForm.tsx
│   │   ├── invoices/
│   │   │   ├── InvoiceForm.tsx
│   │   │   └── InvoiceDetail.tsx
│   │   ├── contracts/
│   │   │   ├── ContractCard.tsx
│   │   │   └── ContractForm.tsx
│   │   ├── playlists/
│   │   │   ├── PlaylistForm.tsx
│   │   │   └── TrackPicker.tsx
│   │   ├── reviews/
│   │   │   ├── ReviewForm.tsx
│   │   │   └── StarRating.tsx
│   │   ├── tags/
│   │   │   ├── TagForm.tsx
│   │   │   ├── TagBadge.tsx
│   │   │   └── TagSelector.tsx
│   │   ├── dashboard/
│   │   │   ├── SessionTimeline.tsx
│   │   │   ├── RoomAvailability.tsx
│   │   │   ├── RevenueCard.tsx
│   │   │   ├── AlbumProgressCard.tsx
│   │   │   └── ActivityTimeline.tsx
│   │   └── reports/
│   │       ├── RevenueChart.tsx
│   │       ├── RoomUtilizationChart.tsx
│   │       ├── ArtistRevenueChart.tsx
│   │       ├── EquipmentValueChart.tsx
│   │       └── EngineerActivityChart.tsx
│   └── app/
│       ├── layout.tsx                # 루트 레이아웃
│       ├── page.tsx                  # / → /dashboard 리다이렉트
│       └── (main)/
│           ├── layout.tsx            # MainLayout 적용
│           ├── dashboard/page.tsx
│           ├── studio/page.tsx
│           ├── rooms/
│           │   ├── page.tsx
│           │   └── [id]/page.tsx
│           ├── artists/
│           │   ├── page.tsx
│           │   └── [id]/page.tsx
│           ├── albums/
│           │   ├── page.tsx
│           │   └── [id]/page.tsx
│           ├── sessions/
│           │   ├── page.tsx
│           │   └── [id]/page.tsx
│           ├── equipment/page.tsx
│           ├── members/page.tsx
│           ├── invoices/
│           │   ├── page.tsx
│           │   └── [id]/page.tsx
│           ├── contracts/page.tsx
│           ├── playlists/page.tsx
│           ├── reviews/page.tsx
│           ├── tags/page.tsx
│           ├── reports/page.tsx
│           └── settings/page.tsx
└── docs/
    ├── requirements.md
    └── IMPLEMENTATION.md
```

---

## Wave 1: 공통 기반

> **목표:** 프로젝트 초기화, 타입 정의, localStorage 서비스, 레이아웃 + 네비게이션

### 파일 목록

| 파일 | 역할 |
|------|------|
| `package.json` + 설정 파일들 | Next.js 16, TypeScript, Tailwind, shadcn/ui 설정 |
| `src/types/index.ts` | 전체 엔티티 타입 (14개) |
| `src/lib/storage.ts` | localStorage get/set/remove/clear 유틸 |
| `src/lib/seed.ts` | 샘플 데이터 (Studio 1개, Room 3개, Artist 3개 등) |
| `src/components/layout/Sidebar.tsx` | 사이드바 네비게이션 |
| `src/components/layout/Header.tsx` | 상단 헤더 (페이지 제목, 브레드크럼) |
| `src/components/layout/MainLayout.tsx` | Sidebar + Header 합성 레이아웃 |
| `src/app/layout.tsx` | 루트 HTML 레이아웃 |
| `src/app/page.tsx` | / → /dashboard redirect |
| `src/app/(main)/layout.tsx` | MainLayout 적용 |

### 파일별 의존성

```
storage.ts          → (없음, 순수 유틸)
types/index.ts      → (없음, 순수 타입)
seed.ts             → storage.ts, types/index.ts
Sidebar.tsx         → lucide-react, next/link
Header.tsx          → lucide-react
MainLayout.tsx      → Sidebar.tsx, Header.tsx
app/layout.tsx      → (없음)
app/(main)/layout.tsx → MainLayout.tsx
```

### 태스크 분해

#### Task 1-1: 프로젝트 초기화
1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"` 실행
2. shadcn/ui 초기화: `npx shadcn@latest init` (style: default, base color: slate)
3. 패키지 설치: `npm install recharts lucide-react`
4. 필요한 shadcn 컴포넌트 추가: `npx shadcn@latest add button input label select dialog table badge card tabs`

#### Task 1-2: 타입 정의 (`src/types/index.ts`)
- Studio, Room, Artist, Album, Track 타입
- Session, Equipment, Member 타입
- Invoice, Contract, Playlist, Review, Tag, EntityTag 타입
- 각 엔티티의 union type 리터럴 (status, role, category 등)
- localStorage 키 상수 (`STORAGE_KEYS` 객체)

#### Task 1-3: localStorage 서비스 (`src/lib/storage.ts`)
- `getAll<T>(key: string): T[]` — JSON.parse, 기본값 []
- `getById<T extends {id: string}>(key, id): T | undefined`
- `save<T>(key, items: T[]): void` — JSON.stringify
- `generateId(): string` — `crypto.randomUUID()` 또는 timestamp+random

#### Task 1-4: 시드 데이터 (`src/lib/seed.ts`)
- `initializeSeedData()` 함수: 각 STORAGE_KEY에 데이터 없을 때만 초기화
- 샘플: Studio 1개, Room 3개(recording/mixing/mastering), Artist 3개, Member 2개(engineer), Equipment 5개, Album 2개, Track 5개

#### Task 1-5: 레이아웃 컴포넌트
- `Sidebar.tsx`: 18개 페이지 링크, 그룹 구분 (스튜디오/아티스트/비즈니스/설정)
  - 그룹 1: Dashboard, Studio, Rooms, Sessions, Equipment
  - 그룹 2: Artists, Albums, Members
  - 그룹 3: Invoices, Contracts, Playlists, Reviews, Tags
  - 그룹 4: Reports, Settings
- `Header.tsx`: props로 `title: string` 받아서 표시
- `MainLayout.tsx`: `children` + Sidebar 좌측, Header + content 우측
- `app/layout.tsx`: html, body, font 설정
- `app/(main)/layout.tsx`: MainLayout 적용, seed 초기화 호출
- `app/page.tsx`: `redirect('/dashboard')` 반환

---

## Wave 2: 핵심 CRUD

> **목표:** Studio, Room, Artist, Album, Track, Member CRUD 페이지 + 서비스

### 파일 목록

| 서비스 파일 | 함수 수 |
|-------------|---------|
| `src/services/studioService.ts` | 4 (getStudio, createStudio, updateStudio, deleteStudio) |
| `src/services/roomService.ts` | 5 (getRooms, getRoomById, createRoom, updateRoom, deleteRoom) |
| `src/services/artistService.ts` | 5 (getArtists, getArtistById, createArtist, updateArtist, deleteArtist) |
| `src/services/albumService.ts` | 6 (getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum, updateAlbumStatus) |
| `src/services/trackService.ts` | 6 (getTracks, getTrackById, createTrack, updateTrack, deleteTrack, updateTrackStatus) |
| `src/services/memberService.ts` | 4 (getMembers, createMember, updateMember, deleteMember) |

| 페이지 파일 | 피처 |
|------------|------|
| `src/app/(main)/studio/page.tsx` | 스튜디오 정보 + 편집 폼 + 룸 목록 |
| `src/app/(main)/rooms/page.tsx` | 룸 목록 + 필터(타입) + 생성 |
| `src/app/(main)/rooms/[id]/page.tsx` | 룸 상세 + 편집 + 장비 목록 |
| `src/app/(main)/artists/page.tsx` | 아티스트 목록 + 검색 + 필터(장르) |
| `src/app/(main)/artists/[id]/page.tsx` | 아티스트 상세 탭 (앨범/세션/인보이스/계약/리뷰) |
| `src/app/(main)/albums/page.tsx` | 앨범 목록 + 필터(상태/장르/아티스트) |
| `src/app/(main)/albums/[id]/page.tsx` | 앨범 상세 + 트랙 리스트 + 태그 |
| `src/app/(main)/members/page.tsx` | 스태프 목록 + 필터(역할/전문분야) |

| 컴포넌트 파일 | 역할 |
|--------------|------|
| `src/components/studio/StudioForm.tsx` | 스튜디오 생성/편집 폼 (Dialog) |
| `src/components/rooms/RoomCard.tsx` | 룸 카드 (타입 뱃지, 요금, 가용 여부) |
| `src/components/rooms/RoomForm.tsx` | 룸 생성/편집 폼 (Dialog) |
| `src/components/artists/ArtistCard.tsx` | 아티스트 카드 (장르, 레이블, 통계) |
| `src/components/artists/ArtistForm.tsx` | 아티스트 생성/편집 폼 (Dialog) |
| `src/components/albums/AlbumCard.tsx` | 앨범 카드 (상태 뱃지, 진행률 바) |
| `src/components/albums/AlbumForm.tsx` | 앨범 생성/편집 폼 (Dialog) |
| `src/components/tracks/TrackList.tsx` | 트랙 테이블 (순서, 상태, 시간) |
| `src/components/tracks/TrackForm.tsx` | 트랙 생성/편집 폼 (Dialog) |
| `src/components/members/MemberCard.tsx` | 스태프 카드 (역할, 전문분야) |
| `src/components/members/MemberForm.tsx` | 스태프 생성/편집 폼 (Dialog) |

### 파일별 의존성

```
studioService.ts    → storage.ts, types/index.ts
roomService.ts      → storage.ts, types/index.ts
artistService.ts    → storage.ts, types/index.ts
albumService.ts     → storage.ts, types/index.ts
trackService.ts     → storage.ts, types/index.ts
memberService.ts    → storage.ts, types/index.ts

RoomCard.tsx        → types/index.ts, shadcn/badge
RoomForm.tsx        → types/index.ts, shadcn/dialog, shadcn/input, shadcn/select
ArtistCard.tsx      → types/index.ts, shadcn/badge, shadcn/card
ArtistForm.tsx      → types/index.ts, shadcn/dialog, shadcn/input
AlbumCard.tsx       → types/index.ts, shadcn/badge, shadcn/card
AlbumForm.tsx       → types/index.ts, shadcn/dialog, artistService.ts
TrackList.tsx       → types/index.ts, trackService.ts, TrackForm.tsx
TrackForm.tsx       → types/index.ts, shadcn/dialog, shadcn/input

rooms/page.tsx      → roomService.ts, RoomCard.tsx, RoomForm.tsx
artists/page.tsx    → artistService.ts, ArtistCard.tsx, ArtistForm.tsx
artists/[id]/page.tsx → artistService.ts, albumService.ts, ArtistForm.tsx
albums/page.tsx     → albumService.ts, artistService.ts, AlbumCard.tsx, AlbumForm.tsx
albums/[id]/page.tsx → albumService.ts, trackService.ts, TrackList.tsx, AlbumForm.tsx
members/page.tsx    → memberService.ts, MemberCard.tsx, MemberForm.tsx
```

### 태스크 분해

#### Task 2-1: 서비스 레이어 (Studio, Room)
- `studioService.ts`: localStorage key `sounddesk_studio`, 단일 객체(배열 아님)
  - getStudio → 저장된 studio 반환 (없으면 null)
  - createStudio/updateStudio → 단일 객체 저장
  - deleteStudio → 키 삭제
- `roomService.ts`: key `sounddesk_rooms`, 배열
  - getRooms(filters?: `{ type?, isAvailable? }`) → 필터 적용 후 반환
  - getRoomById, createRoom, updateRoom, deleteRoom

#### Task 2-2: 서비스 레이어 (Artist, Album, Track, Member)
- `artistService.ts`: key `sounddesk_artists`
  - getArtists(filters?: `{ genre?, search? }`) → 이름/레이블 검색 지원
- `albumService.ts`: key `sounddesk_albums`
  - getAlbums(filters?: `{ status?, genre?, artistId? }`)
  - updateAlbumStatus → status 필드만 업데이트
- `trackService.ts`: key `sounddesk_tracks`
  - getTracks(albumId) → albumId로 필터
  - updateTrackStatus → status 필드만 업데이트
- `memberService.ts`: key `sounddesk_members`
  - getMembers(filters?: `{ role?, speciality? }`)

#### Task 2-3: Studio 페이지
- `studio/page.tsx`: useEffect로 getStudio 호출, 스튜디오 없으면 생성 유도
- `StudioForm.tsx`: 모든 Studio 필드 입력 폼, Dialog 방식
- 스튜디오 페이지 하단에 getRooms() 결과 목록 표시 (RoomCard 재사용)

#### Task 2-4: Room CRUD
- `RoomCard.tsx`: 타입 뱃지(색상별), 시간당 요금, 가용 여부 토글 버튼
- `RoomForm.tsx`: type select, hourlyRate number input, capacity number input
- `rooms/page.tsx`: 타입별 필터 탭, 룸 카드 그리드, "새 룸 추가" 버튼
- `rooms/[id]/page.tsx`: 룸 상세 + 편집 폼 + 해당 룸의 장비 목록 (장비는 Wave 3에서 연결)

#### Task 2-5: Artist CRUD
- `ArtistCard.tsx`: 아바타(없으면 이니셜), 장르 뱃지, 앨범 수, 세션 수
- `ArtistForm.tsx`: name, email, phone, genre, label, bio 입력
- `artists/page.tsx`: 검색바 + 장르 필터 Select + 카드 그리드
- `artists/[id]/page.tsx`: Tabs 컴포넌트 (앨범/세션/인보이스/계약/리뷰 탭, Wave 3에서 채움)

#### Task 2-6: Album + Track CRUD
- `AlbumCard.tsx`: 커버아트(없으면 기본), 상태 뱃지, 트랙 진행률 바 (final 트랙 / 전체)
- `AlbumForm.tsx`: title, genre, releaseDate, status select, artistId select (getArtists 사용)
- `albums/page.tsx`: 상태별/장르별/아티스트별 필터, 카드 그리드
- `albums/[id]/page.tsx`:
  - 상단: 앨범 정보 + 편집 버튼 + 전체 진행률 바
  - 중단: TrackList (trackNumber 순 정렬, status 뱃지, duration mm:ss)
  - 하단: 연결된 세션 목록 (Wave 3에서 채움), 태그 관리 (Wave 4에서 채움)
- `TrackList.tsx`: 테이블 형태, 행 클릭 → 인라인 편집 or Dialog
- `TrackForm.tsx`: title, trackNumber, duration(초), bpm, key, notes, status select

#### Task 2-7: Member CRUD
- `MemberCard.tsx`: 이름, 역할 뱃지, 전문분야, 시간당 요금
- `MemberForm.tsx`: name, email, phone, role select, speciality select, hourlyRate
- `members/page.tsx`: 역할별 + 전문분야별 필터, 카드 그리드, 이번 달 세션 수(Wave 3에서 연결)

---

## Wave 3: 세션 + 비즈니스

> **목표:** Session, Equipment, Invoice, Contract CRUD + 충돌 방지 + 금액 계산

### 파일 목록

| 서비스 파일 | 함수 수 |
|-------------|---------|
| `src/services/sessionService.ts` | 7 (getSessions, getSessionById, createSession, updateSession, deleteSession, checkRoomAvailability, updateSessionStatus) |
| `src/services/equipmentService.ts` | 5 (getEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment) |
| `src/services/invoiceService.ts` | 6 (getInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, calculateInvoiceFromSessions) |
| `src/services/contractService.ts` | 5 (getContracts, getContractById, createContract, updateContract, deleteContract) |

| 페이지 파일 | 피처 |
|------------|------|
| `src/app/(main)/sessions/page.tsx` | 캘린더 뷰 / 리스트 뷰 토글, 필터, 생성 |
| `src/app/(main)/sessions/[id]/page.tsx` | 세션 상세 + 상태 전이 + 엔지니어 배정 |
| `src/app/(main)/equipment/page.tsx` | 장비 목록 + 필터 + 가용 토글 |
| `src/app/(main)/invoices/page.tsx` | 인보이스 목록 + 매출 차트 |
| `src/app/(main)/invoices/[id]/page.tsx` | 인보이스 상세 + 상태 전이 |
| `src/app/(main)/contracts/page.tsx` | 계약 목록 + 필터 + 만료 하이라이트 |

| 컴포넌트 파일 | 역할 |
|--------------|------|
| `src/components/sessions/SessionForm.tsx` | 세션 생성/편집 (룸 선택 → 가용 시간 표시) |
| `src/components/sessions/CalendarView.tsx` | 주간 캘린더 (날짜 × 룸 그리드) |
| `src/components/sessions/TimelineView.tsx` | 리스트 뷰 (오늘/이번주/예정/완료 탭) |
| `src/components/equipment/EquipmentCard.tsx` | 장비 카드 (카테고리, 상태, 위치) |
| `src/components/equipment/EquipmentForm.tsx` | 장비 생성/편집 폼 |
| `src/components/invoices/InvoiceForm.tsx` | 인보이스 생성 (세션 다중 선택 → 자동 계산) |
| `src/components/invoices/InvoiceDetail.tsx` | 인보이스 상세 뷰 (항목 테이블, 합계) |
| `src/components/contracts/ContractCard.tsx` | 계약 카드 (만료일 D-day, 상태 뱃지) |
| `src/components/contracts/ContractForm.tsx` | 계약 생성/편집 폼 |

### 파일별 의존성

```
sessionService.ts   → storage.ts, types/index.ts, roomService.ts (충돌 체크용)
equipmentService.ts → storage.ts, types/index.ts
invoiceService.ts   → storage.ts, types/index.ts, sessionService.ts, roomService.ts, memberService.ts
contractService.ts  → storage.ts, types/index.ts

SessionForm.tsx     → sessionService.ts, roomService.ts, artistService.ts, memberService.ts, albumService.ts, trackService.ts
CalendarView.tsx    → sessionService.ts, types/index.ts
TimelineView.tsx    → sessionService.ts, types/index.ts
EquipmentForm.tsx   → types/index.ts, roomService.ts (위치 선택)
InvoiceForm.tsx     → sessionService.ts, artistService.ts, invoiceService.ts
ContractForm.tsx    → artistService.ts, albumService.ts, types/index.ts

sessions/page.tsx   → sessionService.ts, CalendarView.tsx, TimelineView.tsx, SessionForm.tsx
sessions/[id]/page.tsx → sessionService.ts, memberService.ts, equipmentService.ts
equipment/page.tsx  → equipmentService.ts, EquipmentCard.tsx, EquipmentForm.tsx
invoices/page.tsx   → invoiceService.ts, InvoiceForm.tsx, Recharts
invoices/[id]/page.tsx → invoiceService.ts, InvoiceDetail.tsx
contracts/page.tsx  → contractService.ts, ContractCard.tsx, ContractForm.tsx
```

### 태스크 분해

#### Task 3-1: sessionService.ts
- getSessions(filters?: `{ roomId?, artistId?, engineerId?, status?, dateFrom?, dateTo? }`)
- getSessionById
- checkRoomAvailability(roomId, date, startTime, endTime, excludeSessionId?) → 충돌 세션 배열 반환
  - 로직: 같은 roomId + 같은 date + 시간 겹침 검사 (`startA < endB && endA > startB`)
- createSession: 저장 전 checkRoomAvailability 호출, 충돌 있으면 throw
- updateSession: 충돌 체크 포함
- deleteSession, updateSessionStatus

#### Task 3-2: SessionForm + 캘린더 뷰
- `SessionForm.tsx`:
  - roomId select → 선택 시 해당 날짜의 예약된 시간대 표시 (checkRoomAvailability 시각화)
  - date, startTime, endTime 입력 → 실시간 충돌 경고
  - artistId, albumId(nullable), trackId(nullable), engineerId select
- `CalendarView.tsx`: 7일 × 룸 수 그리드, 세션 블록 표시 (색상 = 상태)
- `TimelineView.tsx`: 탭(오늘/이번주/예정/완료), 세션 리스트
- `sessions/page.tsx`: 뷰 토글(캘린더/리스트), 필터 사이드바, 신규 세션 버튼
- `sessions/[id]/page.tsx`: 상태 전이 버튼, 엔지니어 편집, 관련 장비 목록 표시

#### Task 3-3: equipmentService.ts + 페이지
- getEquipment(filters?: `{ category?, condition?, roomId?, isAvailable? }`)
- `EquipmentCard.tsx`: 카테고리 아이콘(lucide), condition 색상(excellent=green, poor=red), 위치 룸명
- `EquipmentForm.tsx`: 모든 필드, location은 getRooms() 결과 select (nullable)
- `equipment/page.tsx`: 카테고리 탭 + 상태/위치 필터, 전체 자산 가치 표시 (purchasePrice 합산)
- Wave 2에서 만든 `rooms/[id]/page.tsx`에 해당 룸의 장비 목록 섹션 추가

#### Task 3-4: invoiceService.ts + 페이지
- calculateInvoiceFromSessions(sessionIds):
  - 각 세션의 시간(분) × 룸 hourlyRate → 룸 사용료
  - 엔지니어 memberService.hourlyRate × 시간 → 엔지니어 비용
  - items 배열로 구성, subtotal 합산
- `InvoiceForm.tsx`:
  - artistId select → 해당 아티스트의 paid 안 된 세션 목록 체크박스
  - 세션 선택 시 calculateInvoiceFromSessions 호출 → 항목별 금액 자동 입력
  - tax 입력 → total 자동 계산
- `InvoiceDetail.tsx`: 항목 테이블, 소계/세금/합계, 상태 전이 버튼
- `invoices/page.tsx`: 목록 + 아티스트/상태 필터, 상단에 월별 매출 BarChart(Recharts)
- `invoices/[id]/page.tsx`: InvoiceDetail 렌더링

#### Task 3-5: contractService.ts + 페이지
- getContracts(filters?: `{ artistId?, type?, status? }`)
- 만료 임박 여부: `daysUntilExpiry = (endDate - today) / 86400000`, ≤ 30이면 경고
- `ContractCard.tsx`: D-day 표시, status 뱃지, totalValue 포맷
- `ContractForm.tsx`: artistId, albumId(nullable), type, startDate, endDate, totalValue, terms textarea, status
- `contracts/page.tsx`: 필터, 만료 임박 계약 상단에 하이라이트 섹션 추가

#### Task 3-6: Wave 2 연결 작업
- `artists/[id]/page.tsx` 탭 채우기:
  - 앨범 탭: getAlbums({artistId}) → AlbumCard 목록
  - 세션 탭: getSessions({artistId}) → TimelineView 재사용
  - 인보이스 탭: getInvoices({artistId}) → 테이블
  - 계약 탭: getContracts({artistId}) → ContractCard 목록
- `members/page.tsx` 이번 달 세션 수 표시: getSessions({engineerId, dateFrom, dateTo})

---

## Wave 4: 고급 기능

> **목표:** Playlist, Review, Tag, Report, Dashboard(완성), Settings

### 파일 목록

| 서비스 파일 | 함수 수 |
|-------------|---------|
| `src/services/playlistService.ts` | 5 (getPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist) |
| `src/services/reviewService.ts` | 4 (getReviews, createReview, updateReview, deleteReview) |
| `src/services/tagService.ts` | 6 (getTags, createTag, updateTag, deleteTag, addTagToEntity, removeTagFromEntity) |
| `src/services/dashboardService.ts` | 3 (getDashboardData, getRevenueData, getRoomUtilization) |

| 페이지 파일 | 피처 |
|------------|------|
| `src/app/(main)/playlists/page.tsx` | 플레이리스트 목록 + 트랙 순서 변경 |
| `src/app/(main)/reviews/page.tsx` | 리뷰 목록 + 평점 필터 + 평균 표시 |
| `src/app/(main)/tags/page.tsx` | 태그 CRUD + 사용 수 표시 |
| `src/app/(main)/reports/page.tsx` | 5개 차트 섹션 |
| `src/app/(main)/dashboard/page.tsx` | 대시보드 완성 |
| `src/app/(main)/settings/page.tsx` | 앱 설정 + 데이터 초기화 + 다크모드 |

| 컴포넌트 파일 | 역할 |
|--------------|------|
| `src/components/playlists/PlaylistForm.tsx` | 플레이리스트 생성/편집 |
| `src/components/playlists/TrackPicker.tsx` | 트랙 검색 + 선택 + 순서 변경 |
| `src/components/reviews/ReviewForm.tsx` | 리뷰 작성 폼 |
| `src/components/reviews/StarRating.tsx` | 별점 입력/표시 컴포넌트 |
| `src/components/tags/TagForm.tsx` | 태그 이름 + 색상 선택 |
| `src/components/tags/TagBadge.tsx` | 색상 적용된 뱃지 |
| `src/components/tags/TagSelector.tsx` | 엔티티에 태그 추가/제거 Dialog |
| `src/components/dashboard/SessionTimeline.tsx` | 오늘/이번 주 세션 타임라인 |
| `src/components/dashboard/RoomAvailability.tsx` | 룸별 가용 현황 바 |
| `src/components/dashboard/RevenueCard.tsx` | 이번 달 매출 카드 |
| `src/components/dashboard/AlbumProgressCard.tsx` | 진행 중 앨범 카드 |
| `src/components/dashboard/ActivityTimeline.tsx` | 최근 활동 피드 |
| `src/components/reports/RevenueChart.tsx` | 월별 매출 라인 차트 |
| `src/components/reports/RoomUtilizationChart.tsx` | 룸 가동률 바 차트 |
| `src/components/reports/ArtistRevenueChart.tsx` | 아티스트 매출 랭킹 바 차트 |
| `src/components/reports/EquipmentValueChart.tsx` | 카테고리별 자산 파이 차트 |
| `src/components/reports/EngineerActivityChart.tsx` | 엔지니어 활동 바 차트 |

### 파일별 의존성

```
playlistService.ts  → storage.ts, types/index.ts, trackService.ts
reviewService.ts    → storage.ts, types/index.ts
tagService.ts       → storage.ts, types/index.ts (EntityTag 포함)
dashboardService.ts → sessionService.ts, invoiceService.ts, albumService.ts, roomService.ts, trackService.ts

TrackPicker.tsx     → trackService.ts, albumService.ts
PlaylistForm.tsx    → playlistService.ts, memberService.ts, TrackPicker.tsx
TagBadge.tsx        → types/index.ts
TagSelector.tsx     → tagService.ts, TagBadge.tsx
StarRating.tsx      → (없음, 순수 UI)
ReviewForm.tsx      → artistService.ts, sessionService.ts, StarRating.tsx

SessionTimeline.tsx → sessionService.ts, roomService.ts
RoomAvailability.tsx → roomService.ts, sessionService.ts
RevenueCard.tsx     → invoiceService.ts
AlbumProgressCard.tsx → albumService.ts, trackService.ts
ActivityTimeline.tsx → sessionService.ts, invoiceService.ts, albumService.ts

RevenueChart.tsx    → invoiceService.ts, Recharts LineChart
RoomUtilizationChart.tsx → sessionService.ts, roomService.ts, Recharts BarChart
ArtistRevenueChart.tsx → invoiceService.ts, artistService.ts, Recharts BarChart
EquipmentValueChart.tsx → equipmentService.ts, Recharts PieChart
EngineerActivityChart.tsx → sessionService.ts, memberService.ts, Recharts BarChart

dashboard/page.tsx  → dashboardService.ts, 모든 dashboard/* 컴포넌트
reports/page.tsx    → 모든 reports/* 컴포넌트
```

### 태스크 분해

#### Task 4-1: tagService.ts + Tag 컴포넌트
- getTags(), createTag, updateTag, deleteTag (key: `sounddesk_tags`)
- addTagToEntity(entityType, entityId, tagId) → EntityTag 생성 (key: `sounddesk_entity_tags`)
- removeTagFromEntity(entityType, entityId, tagId) → EntityTag 삭제
- `TagBadge.tsx`: `style={{ backgroundColor: tag.color }}` 적용, 텍스트 대비 자동 처리
- `TagSelector.tsx`: 현재 태그 목록 + X 버튼, 태그 검색 + 클릭 추가 Dialog
- `TagForm.tsx`: name input + color picker (input type="color")
- `tags/page.tsx`: 태그 카드 목록, 각 태그별 entityTag 수 표시, CRUD

#### Task 4-2: albums/[id]/page.tsx에 TagSelector 연결
- 앨범 상세 하단에 TagSelector 추가
- entityType='album', entityId=album.id

#### Task 4-3: reviewService.ts + Review 페이지
- getReviews(filters?: `{ artistId?, rating? }`)
- `StarRating.tsx`: 1-5 별 표시, interactive(입력) / static(표시) 모드
- `ReviewForm.tsx`: artistId select, sessionId select(nullable, 해당 아티스트 세션), rating StarRating, comment textarea
- `reviews/page.tsx`: 평균 평점 상단 표시, 아티스트/평점 필터, 리뷰 카드 목록
- `artists/[id]/page.tsx` 리뷰 탭: getReviews({artistId}) 연결

#### Task 4-4: playlistService.ts + Playlist 페이지
- trackIds: JSON string으로 저장 (순서 있는 배열)
- `TrackPicker.tsx`: 앨범 select → 트랙 목록, 체크박스 선택, DnD 순서 변경(mouse up/down 이벤트)
  - DnD: `@dnd-kit/core` 설치 (`npm install @dnd-kit/core @dnd-kit/sortable`) 또는 단순 up/down 버튼
- `PlaylistForm.tsx`: name, description, isPublic toggle, createdBy(member select), TrackPicker
- `playlists/page.tsx`: 플레이리스트 카드 목록, 총 재생 시간(초 합산 → mm:ss), 공개/비공개 필터

#### Task 4-5: dashboardService.ts
- getDashboardData():
  - todaySessions: getSessions({dateFrom: today, dateTo: today})
  - weekSessions: getSessions({dateFrom: weekStart, dateTo: weekEnd})
  - monthRevenue: getInvoices() → paid 합산
  - activeAlbums: getAlbums({status: 'recording' | 'mixing' | 'mastering'})
  - recentActivities: 최근 세션 5개 + 최근 인보이스 3개 날짜 정렬
- getRoomUtilization(month):
  - 해당 월 세션 → 룸별 총 시간(분) 계산
  - 가용 시간 = 30일 × 운영시간(studio.closeTime - openTime)
- getRevenueData(year): 월별(1-12) paid 인보이스 합산

#### Task 4-6: Dashboard 완성
- `SessionTimeline.tsx`: 오늘 세션 + 이번 주 세션 리스트, 룸명, 아티스트명, 시간
- `RoomAvailability.tsx`: 룸별 오늘 타임라인 바 (예약된 시간 블록 시각화)
- `RevenueCard.tsx`: 이번 달 총매출 숫자, 전월 대비 증감%
- `AlbumProgressCard.tsx`: 활성 앨범 목록, 각 진행률 바
- `ActivityTimeline.tsx`: 최근 10개 활동 (아이콘 + 설명 + 시간)
- `dashboard/page.tsx`: 2열 그리드 레이아웃으로 모든 컴포넌트 배치

#### Task 4-7: Reports 페이지
- 각 차트 컴포넌트 독립 구현 (Recharts 사용)
- `RevenueChart.tsx`: LineChart, x=월, y=매출(KRW), year select
- `RoomUtilizationChart.tsx`: BarChart, x=룸명, y=가동률%, month/year select
- `ArtistRevenueChart.tsx`: BarChart, x=아티스트명, y=총매출, 상위 10명
- `EquipmentValueChart.tsx`: PieChart, 카테고리별 purchasePrice 합산
- `EngineerActivityChart.tsx`: BarChart, x=멤버명, y=세션 수 / 총 시간, month/year select
- `reports/page.tsx`: 차트 5개 섹션 배치

#### Task 4-8: Settings 페이지
- `settings/page.tsx`:
  - 앱 설정 섹션: defaultCurrency(KRW/USD) select, taxRate number input → `sounddesk_settings` key로 저장
  - 다크모드 섹션: shadcn의 ThemeProvider 활용 또는 `document.documentElement.classList.toggle('dark')`
  - 데이터 초기화 섹션: "전체 데이터 삭제" 버튼 → confirm dialog → localStorage.clear() 후 seed 재초기화

---

## 공통 패턴 및 컨벤션

### localStorage 키 네이밍
```
sounddesk_studio
sounddesk_rooms
sounddesk_artists
sounddesk_albums
sounddesk_tracks
sounddesk_sessions
sounddesk_equipment
sounddesk_members
sounddesk_invoices
sounddesk_contracts
sounddesk_playlists
sounddesk_reviews
sounddesk_tags
sounddesk_entity_tags
sounddesk_settings
```

### 서비스 함수 시그니처 패턴
- create 함수: `{ ...fields }` 받고 내부에서 `id`, `createdAt`, `updatedAt` 생성
- update 함수: `id` + partial 필드 받고 `updatedAt` 갱신
- delete 함수: id로 filter out, 저장

### 폼 컴포넌트 패턴
- shadcn `Dialog` 안에 폼 렌더링
- props: `open`, `onOpenChange`, `onSuccess`, `initialData?(편집용)`
- 성공 시 `onSuccess()` 콜백 → 부모에서 목록 리페치

### 페이지 상태 관리 패턴
- `useState` + `useEffect` (마운트 시 localStorage에서 fetch)
- 변경 후 `setItems(서비스 호출 결과)` 재fetch 방식 (단순성 우선)
- 필터는 클라이언트 사이드 filter (전체 fetch 후 필터링)

### 날짜/시간 처리
- 날짜: `YYYY-MM-DD` 문자열 (ISO)
- 시간: `HH:mm` 문자열
- 비교: Date 객체 변환 후 비교
- 외부 라이브러리 없이 처리

### 금액 포맷
- KRW: `toLocaleString('ko-KR')` + '원'
- USD: `toLocaleString('en-US', { style: 'currency', currency: 'USD' })`

---

## Wave별 완료 기준

| Wave | 완료 기준 |
|------|-----------|
| Wave 1 | `npm run dev` 실행 후 /dashboard 리다이렉트, 사이드바 18개 링크 모두 동작, localStorage seed 초기화 확인 |
| Wave 2 | Studio/Room/Artist/Album/Track/Member 각 페이지에서 CRUD 동작, 브라우저 새로고침 후 데이터 유지 |
| Wave 3 | Session 생성 시 충돌 방지 동작, Invoice 자동 계산 동작, Contract 만료 하이라이트 동작 |
| Wave 4 | Dashboard 데이터 표시, Reports 5개 차트 렌더링, Settings 데이터 초기화 동작 |
