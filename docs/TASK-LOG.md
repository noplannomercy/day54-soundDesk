# SoundDesk — Wave 1 Task Log

## 팀 구성

| 역할 | 모델 | 담당 태스크 |
|------|------|------------|
| lead (orchestrator) | Sonnet 4.6 | 조율, TASK-LOG, git commit, TeamDelete |
| coder-a | Opus 4.6 | T1-1 (init), T1-2 (types), T1-3 (storage) |
| coder-b | Opus 4.6 | T1-4 (seed), T1-5 (layout + stubs) |
| reviewer | Haiku 4.5 | T1-6 (코드 리뷰) |
| tester | Sonnet 4.6 | T1-7 (Playwright + build) |

## 실행 순서 (계획)

```
coder-a: T1-1 → T1-2 → T1-3
                           ↓
coder-b:             T1-4 → T1-5
                               ↓
reviewer + tester (병렬): T1-6 || T1-7
                               ↓
lead: T1-8 (log + commit + TeamDelete)
```

---

## Wave 1 태스크 배분

| ID | 태스크 | 담당 | 모델 | 유형 |
|----|--------|------|------|------|
| T1-1 | 프로젝트 초기화 (create-next-app + shadcn + deps) | coder-a | Opus | 코딩 |
| T1-2 | 타입 정의 (src/types/index.ts) | coder-a | Opus | 코딩 |
| T1-3 | localStorage 유틸 (src/lib/storage.ts) | coder-a | Opus | 코딩 |
| T1-4 | 시드 데이터 (src/lib/seed.ts) | coder-b | Opus | 코딩 |
| T1-5 | 레이아웃 + 스텁 페이지 (Sidebar/Header/MainLayout + 18라우트) | coder-b | Opus | 코딩 |
| T1-6 | 코드 리뷰 | reviewer | Haiku | 비코딩 |
| T1-7 | Playwright 테스트 + build | tester | Sonnet | 비코딩 |
| T1-8 | TASK-LOG + git commit + TeamDelete | lead | Sonnet | 비코딩 |

---

## Plan vs Actual

### T1-1: 프로젝트 초기화

**Plan:**
- create-next-app@latest with --typescript --tailwind --app --src-dir --import-alias "@/*"
- npx shadcn@latest init (style: default, base: slate)
- npm install recharts lucide-react
- npx shadcn@latest add button input label select dialog table badge card tabs progress alert-dialog

**Actual:**
- 완료: ✅
- Next.js 16.1.6, React 19, Tailwind v4, shadcn/ui 컴포넌트 11개
- recharts ^3.7.0, lucide-react ^0.575.0 설치
- 이슈: 디렉터리명 대문자(`day54-soundDesk`) 문제 → 임시 디렉터리 우회 처리. sounddesk-temp 잔여 디렉터리 발생 (정리 완료)

---

### T1-2: 타입 정의

**Plan:**
- 14개 엔티티 타입, Union type literals, STORAGE_KEYS 15개

**Actual:**
- 완료: ✅
- 14개 인터페이스 + 12개 union type + AppSettings + STORAGE_KEYS(15개) 구현
- 리뷰 결과: PASS (requirements.md와 100% 매칭)

---

### T1-3: localStorage 유틸

**Plan:**
- getAll, getById, save, generateId

**Actual:**
- 완료: ✅
- 7개 함수 구현 (getAll, getById, save, generateId, getObject, saveObject, removeKey)
- SSR 안전 가드(`typeof window === 'undefined'`) 전 함수 적용
- 리뷰 결과: PASS

---

### T1-4: 시드 데이터

**Plan:**
- initializeSeedData(), Studio 1, Room 3, Artist 3, Member 2, Equipment 5, Album 2, Track 5

**Actual:**
- 완료: ✅
- Studio 1, Room 3, Artist 3, Member 2, Equipment 6(Yamaha HS8 x2 개별 처리), Album 2, Track 5, AppSettings 1
- 멱등성 확인: 각 키 비어있을 때만 초기화
- 리뷰 결과: PASS

---

### T1-5: 레이아웃 + 스텁 페이지

**Plan:**
- Sidebar(4그룹 15링크), Header, MainLayout, layout.tsx들, 18개 스텁

**Actual:**
- 완료: ✅
- 3개 레이아웃 컴포넌트 + app/layout.tsx + (main)/layout.tsx + page.tsx
- 스텁 페이지 20개 (동적 라우트 5개 포함, async params 패턴 사용)
- 리뷰 결과: PASS

---

### T1-6: 코드 리뷰

**Plan:**
- TypeScript 정확성, CLAUDE.md 컨벤션, 의존성 단방향

**Actual:**
- 완료: ✅ 담당: reviewer (Haiku)
- 결과: **전체 PASS** — critical/major 이슈 없음
- 'use client' 규칙, SSR 가드, STORAGE_KEYS, 멱등성, 네이밍 모두 확인

---

### T1-7: Playwright 테스트

**Plan (max 10):**
- playwright 설치 + 테스트 10개 + 실행

**Actual:**
- 부분 완료: playwright.config.ts + tests/e2e/wave1.spec.ts 생성됨
- `npx playwright install chromium` 다운로드 과다 시간 소요 → 사용자 요청으로 에이전트 중단
- **build 검증으로 대체**: `npm run build` PASS ✅
- 테스트 파일 유지 (Wave 1 이후 playwright 실행 가능 상태)

---

### T1-8: 최종 정리

**Plan:**
- TASK-LOG 기록, git commit, TeamDelete

**Actual:**
- 완료: ✅ 2026-02-21
- build: **PASS** (19개 정적 페이지, 5개 동적 라우트, TypeScript 에러 없음)
- playwright: 파일 생성됨, 브라우저 설치 미완료 (별도 실행 가능)
- commit hash: (하단 참조)

---

## Wave 1 완료 기준 체크리스트

- [x] npm run build 통과 ✅
- [x] / → /dashboard 리다이렉트 (정적 빌드에서 확인)
- [x] 사이드바 15개 링크 렌더링 (코드 리뷰 확인)
- [x] localStorage seed 초기화 로직 존재 (멱등성 검증)
- [x] TypeScript 에러 없음
- [x] 코드 리뷰 전체 PASS
- [ ] Playwright 브라우저 테스트 (별도 실행 필요: `npx playwright install && npx playwright test`)

---

# SoundDesk — Wave 2 Task Log

## 팀 구성

| 역할 | 모델 | 담당 태스크 |
|------|------|------------|
| lead (orchestrator) | Sonnet 4.6 | 조율, TASK-LOG, TeamDelete |
| coder-a | Opus 4.6 | T2-1 (studioService + roomService) → T2-4 (Room CRUD) → T2-3 (Studio page) |
| coder-b | Opus 4.6 | T2-2 (4개 서비스) → T2-5 (Artist CRUD) → T2-7 (Member CRUD) |
| coder-c | Opus 4.6 | T2-6 (Album + Track CRUD) — T2-2 완료 후 시작 |
| reviewer | Haiku 4.5 | T2-8 (코드 리뷰) |
| tester | Sonnet 4.6 | T2-9 (build + Playwright) |

## 실행 순서 (계획)

```
coder-a: T2-1 → T2-4 → T2-3
coder-b: T2-2 → T2-5 → T2-7
                ↓ (T2-2 완료 시)
coder-c: T2-6
                    ↓ (모두 완료 후 병렬)
reviewer: T2-8 || tester: T2-9
                    ↓
lead: T2-10 (log + build + TeamDelete)
```

---

## Wave 2 태스크 배분

| ID | 태스크 | 담당 | 모델 | 유형 |
|----|--------|------|------|------|
| T2-1 | studioService.ts + roomService.ts | coder-a | Opus | 코딩 |
| T2-2 | artistService + albumService + trackService + memberService | coder-b | Opus | 코딩 |
| T2-3 | Studio 페이지 (studio/page.tsx + StudioForm.tsx) | coder-a | Opus | 코딩 |
| T2-4 | Room CRUD (RoomCard + RoomForm + rooms pages) | coder-a | Opus | 코딩 |
| T2-5 | Artist CRUD (ArtistCard + ArtistForm + artist pages) | coder-b | Opus | 코딩 |
| T2-6 | Album+Track CRUD (Album* + Track* + album pages) | coder-c | Opus | 코딩 |
| T2-7 | Member CRUD (MemberCard + MemberForm + members page) | coder-b | Opus | 코딩 |
| T2-8 | 코드 리뷰 | reviewer | Haiku | 비코딩 |
| T2-9 | npm run build + Playwright 테스트 | tester | Sonnet | 비코딩 |
| T2-10 | TASK-LOG Actual 기록 + TeamDelete | lead | Sonnet | 비코딩 |

---

## Plan vs Actual

### T2-1: studioService.ts + roomService.ts

**Plan:**
- studioService: getStudio, createStudio, updateStudio, deleteStudio (singleton)
- roomService: getRooms(filters), getRoomById, createRoom, updateRoom, deleteRoom

**Actual:**
- 완료: ✅ 담당: coder-a (Opus)
- studioService: 4개 함수, singleton 패턴 (getObject/saveObject)
- roomService: 5개 함수, 배열 패턴, type/isAvailable 필터 지원

---

### T2-2: 4개 서비스

**Plan:**
- artistService: getArtists(filters: genre/search), getArtistById, createArtist, updateArtist, deleteArtist
- albumService: getAlbums(filters: status/genre/artistId), getAlbumById, createAlbum, updateAlbum, deleteAlbum, updateAlbumStatus
- trackService: getTracks(albumId), getTrackById, createTrack, updateTrack, deleteTrack, updateTrackStatus
- memberService: getMembers(filters: role/speciality), createMember, updateMember, deleteMember

**Actual:**
- 완료: ✅ 담당: coder-b (Opus)
- 4개 서비스 모두 구현, getMemberById 추가 (계획에 없었으나 필요)
- useMemo 최적화 포함, 필터 로직 완전 구현

---

### T2-3: Studio 페이지

**Plan:**
- studio/page.tsx: getStudio → 스튜디오 없으면 생성 유도, 하단에 getRooms() 결과 목록
- StudioForm.tsx: Dialog, 모든 Studio 필드

**Actual:**
- 완료: ✅ 담당: coder-a (Opus)
- StudioForm: Dialog, 모든 필드 (openTime/closeTime 포함)
- studio/page.tsx: 스튜디오 없음 상태 처리, RoomCard 그리드 표시

---

### T2-4: Room CRUD

**Plan:**
- RoomCard.tsx: 타입 뱃지(색상별), 시간당 요금, 가용 여부 토글 버튼
- RoomForm.tsx: type select, hourlyRate number input, capacity number input
- rooms/page.tsx: 타입별 필터 탭, 룸 카드 그리드
- rooms/[id]/page.tsx: 룸 상세 + 편집 폼

**Actual:**
- 완료: ✅ 담당: coder-a (Opus)
- RoomCard: 타입별 색상 뱃지, 가용 토글, AlertDialog 삭제
- rooms/page.tsx: 5개 필터 버튼(All + 4타입), 그리드
- rooms/[id]/page.tsx: useParams() 패턴, Wave 3 장비 placeholder

---

### T2-5: Artist CRUD

**Plan:**
- ArtistCard.tsx: 아바타(이니셜 fallback), 장르 뱃지
- ArtistForm.tsx: name/email/phone/genre/label/bio
- artists/page.tsx: 검색바 + 장르 필터
- artists/[id]/page.tsx: Tabs 컴포넌트

**Actual:**
- 완료: ✅ 담당: coder-b (Opus)
- ArtistCard: 이니셜 아바타 (단어 첫글자), 장르 Badge, AlertDialog 삭제
- artists/page.tsx: 검색(이름/레이블) + 장르 Select 필터
- artists/[id]/page.tsx: 5개 탭 (앨범 탭만 실데이터, 나머지 placeholder)
- 버그 수정: SelectItem value="" → "all" (Radix UI 호환)

---

### T2-6: Album + Track CRUD

**Plan:**
- AlbumCard.tsx: 상태 뱃지, 진행률 바
- AlbumForm.tsx: title/genre/releaseDate/status/artistId select
- albums/page.tsx: 필터, 카드 그리드
- albums/[id]/page.tsx: 앨범 정보 + TrackList
- TrackList.tsx: 테이블 형태
- TrackForm.tsx: Dialog

**Actual:**
- 완료: ✅ 담당: coder-c (Opus)
- AlbumCard: Music 아이콘(lucide), 상태별 색상 Badge, Progress 바
- TrackList: Table, mm:ss 포맷, 상태 Badge, 인라인 편집/삭제
- albums/[id]/page.tsx: 진행률 바, TrackList, Wave 3/4 placeholder

---

### T2-7: Member CRUD

**Plan:**
- MemberCard.tsx: 역할 뱃지, 전문분야, 시간당 요금
- MemberForm.tsx: name/email/phone/role/speciality/hourlyRate
- members/page.tsx: 역할별 + 전문분야별 필터

**Actual:**
- 완료: ✅ 담당: coder-b (Opus)
- MemberCard: 역할별 색상 Badge (owner=gold, engineer=blue, assistant=green, intern=gray)
- MemberForm: role/speciality Select 포함
- members/page.tsx: role + speciality 이중 필터
- 버그 수정: SelectItem value="" → "all" (Radix UI 호환)

---

### T2-8: 코드 리뷰

**Plan:**
- TypeScript 정확성, CLAUDE.md 컨벤션, Wave 1 파일 수정 여부 확인

**Actual:**
- 완료: ✅ 담당: reviewer (Haiku) — 전체 **PASS**
- Critical 이슈: 없음
- Minor 이슈 3건: RoomForm hardcoded equipment:'[]', unused updateAlbumStatus, 음수 유효성 검사 부재 (non-blocking)
- Wave 1 파일 미수정 확인, TypeScript 위반 없음

---

### T2-9: Build + Playwright 테스트

**Plan:**
- npm run build PASS
- npx playwright test (최대 20개, 실패 3개 초과 시 삭제)

**Actual:**
- 완료: ✅ 담당: tester (Sonnet)
- npm run build: **PASS** (TypeScript 오류 없음, 19개 라우트)
- tests/e2e/wave2.spec.ts 생성: **10/10 통과** (8.1s)
- 런타임 버그 1건 발견 및 수정: Radix UI SelectItem value="" → "all" (artists + members pages)

---

## Wave 2 완료 기준 체크리스트

- [x] npm run build 통과 ✅
- [x] Studio CRUD 동작 ✅
- [x] Room CRUD 동작 (타입별 필터 포함) ✅
- [x] Artist CRUD 동작 (검색/필터 포함) ✅
- [x] Album + Track CRUD 동작 ✅
- [x] Member CRUD 동작 ✅
- [x] 코드 리뷰 PASS ✅
- [x] Playwright 테스트 10/10 통과 ✅

## Wave 2 완료: 2026-02-21

생성 파일 목록:
- src/services/: studioService, roomService, artistService, albumService, trackService, memberService (6개)
- src/components/: studio/StudioForm, rooms/RoomCard+RoomForm, artists/ArtistCard+ArtistForm, albums/AlbumCard+AlbumForm, tracks/TrackList+TrackForm, members/MemberCard+MemberForm (11개)
- src/app/(main)/: studio, rooms, rooms/[id], artists, artists/[id], albums, albums/[id], members (8개 페이지)
- tests/e2e/wave2.spec.ts (10개 테스트)

---

# SoundDesk — Wave 3 Task Log

## 팀 구성

| 역할 | 모델 | 담당 태스크 |
|------|------|------------|
| lead (orchestrator) | Sonnet 4.6 | 조율, TASK-LOG, build 검증, TeamDelete |
| coder-a | Opus 4.6 | T3-1 (sessionService) → T3-2 (Session UI/pages) |
| coder-b | Opus 4.6 | T3-3 (equipment) + T3-5 (contract) 병렬 |
| coder-c | Opus 4.6 | T3-4 (invoice) + T3-6 (Wave2 connections) |
| tester | Sonnet 4.6 | T3-7 (build + Playwright 테스트) |

## 실행 순서 (계획)

```
coder-a:  T3-1 → T3-2
coder-b:  T3-3 → T3-5            (병렬)
coder-c:  T3-4 → T3-6            (병렬, invoiceService는 sessionService 먼저 필요)
                      ↓ (모두 완료 후)
tester:   T3-7 (build + playwright)
                      ↓
lead:     T3-8 (log 기록 + TeamDelete)
```

---

## Wave 3 태스크 배분

| ID | 태스크 | 담당 | 모델 | 유형 |
|----|--------|------|------|------|
| T3-1 | sessionService.ts (충돌 방지 포함) | coder-a | Opus | 코딩 |
| T3-2 | Session UI: SessionForm + CalendarView + TimelineView + sessions pages | coder-a | Opus | 코딩 |
| T3-3 | Equipment: equipmentService + EquipmentCard + EquipmentForm + equipment/page + rooms/[id] update | coder-b | Opus | 코딩 |
| T3-4 | Invoice: invoiceService (자동계산) + InvoiceForm + InvoiceDetail + invoices pages | coder-c | Opus | 코딩 |
| T3-5 | Contract: contractService + ContractCard + ContractForm + contracts/page | coder-b | Opus | 코딩 |
| T3-6 | Wave2 연결: artists/[id] 탭 채우기 + members 세션수 | coder-c | Opus | 코딩 |
| T3-7 | npm run build + Playwright 테스트 (max 15개) | tester | Sonnet | 비코딩 |
| T3-8 | TASK-LOG Actual 기록 + TeamDelete | lead | Sonnet | 비코딩 |

---

## Plan vs Actual

### T3-1: sessionService.ts

**Plan:**
- getSessions(filters: roomId/artistId/engineerId/status/dateFrom/dateTo)
- getSessionById, updateSessionStatus, deleteSession
- checkRoomAvailability(roomId, date, startTime, endTime, excludeId?): 충돌 세션 배열 반환
- createSession/updateSession: 충돌 체크 후 throw on conflict

**Actual:**
- 완료: ✅ 담당: coder-a (Opus)
- 7개 함수 전부 구현
- checkRoomAvailability: 동일 roomId+date+시간겹침+status!='cancelled' 조건 완전 구현
- createSession/updateSession: 충돌 시 Error('Room is already booked for this time slot') throw
- updateSessionStatus: 가용성 체크 bypass (시간 슬롯 변경 없음)

---

### T3-2: Session UI

**Plan:**
- SessionForm.tsx: roomId select → 예약 시간대 시각화, 실시간 충돌 경고
- CalendarView.tsx: 7일 × 룸 수 그리드, 상태별 색상 블록
- TimelineView.tsx: 탭(오늘/이번주/예정/완료) 세션 리스트
- sessions/page.tsx: 캘린더/리스트 토글, 필터, 신규 버튼
- sessions/[id]/page.tsx: 상태 전이, 엔지니어 편집, 관련 장비

**Actual:**
- 완료: ✅ 담당: coder-a (Opus)
- SessionForm: 실시간 충돌 경고, 충돌 시 Submit 비활성화
- CalendarView: 7일×룸 그리드, 상태별 색상(scheduled=blue, in-progress=yellow, completed=green, cancelled=gray)
- TimelineView: 탭 4개, 행 클릭 → /sessions/[id] 이동
- sessions/page.tsx: 캘린더/리스트 토글, 4개 필터, SessionForm Dialog
- sessions/[id]/page.tsx: 상태 전이 버튼, 인라인 엔지니어 Select, Delete AlertDialog
- 추가: src/components/ui/textarea.tsx 생성 (missing shadcn component)

---

### T3-3: Equipment

**Plan:**
- equipmentService: getEquipment(filters: category/condition/roomId/isAvailable), CRUD
- EquipmentCard.tsx: 카테고리 아이콘(lucide), condition 색상, 위치 룸명
- EquipmentForm.tsx: 모든 필드, location = getRooms() select
- equipment/page.tsx: 카테고리 탭 + 필터, 전체 자산 가치
- rooms/[id]/page.tsx: 장비 목록 섹션 추가

**Actual:**
- 완료: ✅ 담당: coder-b (Opus)
- equipmentService: 5개 함수, category/condition/roomId/isAvailable 필터 지원
- EquipmentCard: lucide 카테고리 아이콘 8종, condition 색상(excellent=green, good=blue, fair=yellow, poor=red), KRW 포맷
- EquipmentForm: 모든 필드, isAvailable checkbox, getRooms() location select
- equipment/page.tsx: 9개 카테고리 탭, 전체 자산가치 합산 표시
- rooms/[id]/page.tsx: 보유 장비 섹션 추가 (getEquipment({roomId}))
- 추가: src/components/ui/checkbox.tsx 생성 (npx shadcn 설치)

---

### T3-4: Invoice

**Plan:**
- invoiceService: calculateInvoiceFromSessions(sessionIds) → 시간×룸요금 + 엔지니어비용
- InvoiceForm.tsx: 아티스트 → 미청구 세션 체크박스 → 자동 계산 → tax → total
- InvoiceDetail.tsx: 항목 테이블, 소계/세금/합계, 상태 전이
- invoices/page.tsx: 목록 + 필터 + 월별 매출 BarChart
- invoices/[id]/page.tsx: InvoiceDetail 렌더링

**Actual:**
- 완료: ✅ 담당: coder-c (Opus)
- invoiceService: 6개 함수, calculateInvoiceFromSessions: 룸요금+엔지니어비용 자동 계산
- getMemberById 이미 memberService.ts에 존재 → 수정 불필요
- InvoiceForm: 아티스트 선택→미청구세션 체크박스→자동계산 표시→tax→total
- InvoiceDetail: 항목 테이블, 상태 전이 버튼, KRW/USD 금액 포맷
- invoices/page.tsx: Recharts BarChart 월별 매출, 필터, 테이블
- invoices/[id]/page.tsx: InvoiceDetail 렌더링

---

### T3-5: Contract

**Plan:**
- contractService: getContracts(filters: artistId/type/status), getContractById, CRUD
- 만료 임박 D-day: (endDate - today) ≤ 30일 경고
- ContractCard.tsx: D-day, status badge, totalValue 포맷
- ContractForm.tsx: artistId/albumId/type/startDate/endDate/totalValue/terms/status
- contracts/page.tsx: 필터, 만료 임박 상단 하이라이트 섹션

**Actual:**
- 완료: ✅ 담당: coder-b (Opus)
- contractService: 5개 함수 + getDaysUntilExpiry helper
- ContractCard: type 색상별 badge, D-day 표시(≤30일=orange, 만료=red), KRW totalValue
- ContractForm: artistId/albumId select, type/status select, 모든 날짜 필드
- contracts/page.tsx: "만료 임박 계약" orange 하이라이트 섹션, 아티스트/타입/상태 필터

---

### T3-6: Wave 2 연결

**Plan:**
- artists/[id]/page.tsx: sessions탭(getSessions({artistId})), invoices탭(getInvoices({artistId})), contracts탭(getContracts({artistId})) 채우기
- members/page.tsx: 이번 달 세션 수 표시

**Actual:**
- 완료: ✅ 담당: coder-c (Opus)
- artists/[id]/page.tsx: sessions탭(세션 리스트+상태badge), invoices탭(테이블+KRW금액), contracts탭(type/status badge+날짜범위) 연결
- members/page.tsx: getSessions({engineerId, dateFrom, dateTo})로 이번달 세션수 계산 → MemberCard 아래 표시
- 기존 albums 탭, reviews 탭, 아티스트 정보 카드 구조 유지

---

### T3-7: Build + Playwright

**Plan:**
- npm run build PASS
- wave3.spec.ts (max 15개 테스트)
- npx playwright test

**Actual:**
- 완료: ✅ 담당: tester (Sonnet)
- 초기 빌드 실패: invoices/page.tsx Recharts Tooltip formatter value 타입 오류(number → number|string|undefined)
- 수정 후 빌드 **PASS** (19개 페이지 정적 생성)
- tests/e2e/wave3.spec.ts: 15개 테스트 작성
- npx playwright test: **15/15 PASS** (13.5s)

---

## Wave 3 완료 기준 체크리스트

- [x] npm run build 통과 ✅
- [x] Session 생성 시 충돌 방지 동작 ✅ (checkRoomAvailability + throw on conflict)
- [x] Invoice 자동 계산 동작 ✅ (calculateInvoiceFromSessions)
- [x] Contract 만료 하이라이트 동작 ✅ (D-day + 만료 임박 섹션)
- [x] Equipment 전체 자산 가치 표시 ✅ (purchasePrice 합산)
- [x] Playwright 테스트 통과 ✅ (15/15 PASS)

## Wave 3 완료: 2026-02-21

생성 파일 목록:
- src/services/: sessionService, equipmentService, invoiceService, contractService (4개)
- src/components/: sessions/SessionForm+CalendarView+TimelineView, equipment/EquipmentCard+EquipmentForm, invoices/InvoiceForm+InvoiceDetail, contracts/ContractCard+ContractForm (9개)
- src/components/ui/: textarea, checkbox (2개 shadcn 컴포넌트)
- src/app/(main)/: sessions, sessions/[id], equipment, invoices, invoices/[id], contracts (6개 페이지)
- 수정: rooms/[id]/page.tsx (장비 섹션 추가), artists/[id]/page.tsx (탭 연결), members/page.tsx (세션수 표시), invoices/page.tsx (TS 타입 수정)
- tests/e2e/wave3.spec.ts (15개 테스트)
