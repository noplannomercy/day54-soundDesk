# SoundDesk — UI Design

## 전체 레이아웃 구조

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (w-64, 고정)  │  Header (h-14, 고정 상단)  │
│                         │─────────────────────────── │
│  [로고/앱명]            │                             │
│                         │  <page content>             │
│  그룹 1: 운영           │                             │
│   - Dashboard           │  (스크롤 가능)              │
│   - Studio              │                             │
│   - Rooms               │                             │
│   - Sessions            │                             │
│   - Equipment           │                             │
│                         │                             │
│  그룹 2: 아티스트       │                             │
│   - Artists             │                             │
│   - Albums              │                             │
│   - Members             │                             │
│                         │                             │
│  그룹 3: 비즈니스       │                             │
│   - Invoices            │                             │
│   - Contracts           │                             │
│   - Playlists           │                             │
│   - Reviews             │                             │
│   - Tags                │                             │
│                         │                             │
│  그룹 4:                │                             │
│   - Reports             │                             │
│   - Settings            │                             │
└─────────────────────────────────────────────────────┘
```

---

## 페이지별 레이아웃 구조

### Dashboard (`/dashboard`)
```
┌─ Header: "Dashboard" ────────────────────────────────┐
│                                                        │
│  [RevenueCard]  [오늘 세션 수]  [진행 중 앨범 수]    │
│                                                        │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ SessionTimeline  │  │ RoomAvailability          │  │
│  │ (오늘/이번 주)   │  │ (룸별 오늘 타임라인 바)   │  │
│  └──────────────────┘  └──────────────────────────┘  │
│                                                        │
│  ┌──────────────────┐  ┌──────────────────────────┐  │
│  │ AlbumProgressCard│  │ ActivityTimeline          │  │
│  │ (진행 중 앨범)   │  │ (최근 10개 활동 피드)     │  │
│  └──────────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 목록 페이지 공통 구조 (Rooms, Artists, Albums, Equipment, Members 등)
```
┌─ Header: "<페이지명>" ────── [+ 새로 추가] 버튼 ───┐
│                                                       │
│  [검색바]  [필터1 Select]  [필터2 Select]  ...      │
│                                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ Card │ │ Card │ │ Card │ │ Card │                │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│  (그리드 레이아웃, 반응형 2~4열)                     │
│                                                       │
│  [EntityForm Dialog — open 시 오버레이]              │
└───────────────────────────────────────────────────────┘
```

### 상세 페이지 공통 구조 (`/artists/[id]`, `/albums/[id]` 등)
```
┌─ Header: "<항목명>" ────── [편집] [삭제] 버튼 ───┐
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 항목 정보 카드 (주요 필드 표시)              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [탭1] [탭2] [탭3] ...                            │
│  ─────────────────────────────────────────────      │
│  탭 콘텐츠 (관련 목록 또는 상세 섹션)              │
└─────────────────────────────────────────────────────┘
```

### Studio (`/studio`)
- 스튜디오 정보 표시 카드 + 편집 버튼
- 하단: 전체 룸 목록 (RoomCard 그리드)

### Sessions (`/sessions`)
```
[캘린더 뷰] [리스트 뷰]  토글 버튼          [+ 새 세션]

캘린더 뷰:
┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ 월   │ 화   │ 수   │ 목   │ 금   │ 토   │ 일   │
├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
│룸A   │      │[세션]│      │      │      │      │
│룸B   │[세션]│      │[세션]│      │      │      │
│룸C   │      │      │      │[세션]│      │      │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┘

리스트 뷰:
[오늘] [이번 주] [예정] [완료] 탭
세션 카드 목록
```

### Reports (`/reports`)
- 5개 차트를 세로로 배치, 각 섹션에 제목 + 기간 선택기

### Invoices (`/invoices`)
- 상단: 월별 매출 BarChart
- 하단: 인보이스 테이블 (아티스트, 금액, 상태, 기한)

---

## 공통 컴포넌트 목록

### 레이아웃
| 컴포넌트 | 역할 |
|----------|------|
| `Sidebar` | 좌측 네비게이션, active 링크 하이라이트 |
| `Header` | `title` prop 표시, 현재 페이지명 |
| `MainLayout` | Sidebar + Header + content 영역 합성 |

### 카드류
| 컴포넌트 | 표시 정보 |
|----------|----------|
| `RoomCard` | 타입 뱃지, 시간당 요금, 가용 여부 토글 |
| `ArtistCard` | 이니셜 아바타, 장르, 레이블, 앨범/세션 수 |
| `AlbumCard` | 커버아트, 상태 뱃지, 트랙 진행률 바 |
| `MemberCard` | 역할 뱃지, 전문분야, 시간당 요금 |
| `EquipmentCard` | 카테고리 아이콘, condition 색상, 위치 룸 |
| `ContractCard` | 타입, D-day 만료 표시, 상태 뱃지, 총액 |

### 폼 Dialog류 (모두 `open/onOpenChange/onSuccess/initialData` props)
`StudioForm`, `RoomForm`, `ArtistForm`, `AlbumForm`, `TrackForm`, `MemberForm`, `SessionForm`, `EquipmentForm`, `InvoiceForm`, `ContractForm`, `PlaylistForm`, `ReviewForm`, `TagForm`

### 특수 컴포넌트
| 컴포넌트 | 역할 |
|----------|------|
| `TrackList` | 트랙 테이블 (순서, 상태 뱃지, mm:ss) |
| `StarRating` | 1-5 별점 입력/표시 (interactive/static 모드) |
| `TagBadge` | HEX 색상 적용 뱃지 |
| `TagSelector` | 태그 추가/제거 Dialog |
| `TrackPicker` | 앨범 선택 → 트랙 체크박스 + 순서 변경 |
| `InvoiceDetail` | 항목 테이블 + 소계/세금/합계 |

### 대시보드 위젯
`SessionTimeline`, `RoomAvailability`, `RevenueCard`, `AlbumProgressCard`, `ActivityTimeline`

### 차트 (Recharts 래퍼)
| 컴포넌트 | 차트 타입 |
|----------|----------|
| `RevenueChart` | LineChart — 월별 매출 |
| `RoomUtilizationChart` | BarChart — 룸별 가동률% |
| `ArtistRevenueChart` | BarChart — 아티스트 매출 랭킹 |
| `EquipmentValueChart` | PieChart — 카테고리별 자산 가치 |
| `EngineerActivityChart` | BarChart — 엔지니어별 세션 수/시간 |

---

## 페이지 간 네비게이션 흐름

```
/dashboard
  → /sessions (세션 클릭)
  → /albums (앨범 클릭)

/rooms
  → /rooms/[id] (룸 카드 클릭)

/artists
  → /artists/[id] (아티스트 카드 클릭)
    탭: 앨범 → /albums/[id]
        세션 → /sessions/[id]
        인보이스 → /invoices/[id]

/albums
  → /albums/[id] (앨범 카드 클릭)
    트랙 편집은 /albums/[id] 내 인라인 처리

/sessions
  → /sessions/[id] (세션 클릭)

/invoices
  → /invoices/[id] (인보이스 클릭)
```

---

## 주요 UI 패턴

### 1. 캘린더 뷰 (Sessions)
- 7열(요일) × N행(룸) 그리드
- 각 셀에 해당 날짜+룸의 세션 블록 표시
- 세션 블록: 색상 = 상태 (scheduled=blue, in-progress=yellow, completed=green, cancelled=gray)
- 주 이동: 이전/다음 화살표 버튼
- 블록 클릭 → `/sessions/[id]`

### 2. 타임라인 뷰 (Sessions 리스트)
- 탭: 오늘 / 이번 주 / 예정 / 완료
- 각 세션: 시간 + 룸명 + 아티스트명 + 엔지니어명 + 상태 뱃지
- 상태 전이 버튼 인라인 표시

### 3. 모달 폼 패턴 (Dialog)
```
[목록 페이지]
  → [+ 새로 추가] 클릭 → Dialog open (빈 폼)
  → [카드 편집] 클릭 → Dialog open (initialData 채워진 폼)
  → 저장 → onSuccess() → Dialog close → 목록 재조회
  → 취소/ESC → Dialog close
```
- shadcn `Dialog` + `DialogContent` + `DialogHeader` + `DialogFooter`
- 폼 유효성: 필수 필드 빈 값 시 submit 비활성 또는 인라인 에러

### 4. 필터 패턴
- shadcn `Select` 컴포넌트로 단일 값 선택
- 검색은 `Input` + 클라이언트 사이드 filter
- 필터 값 변경 → `useState` 갱신 → 파생 계산으로 filtered 배열 생성
- URL 쿼리 파라미터 사용 안 함 (localStorage 앱 특성)

### 5. 상태 뱃지 패턴
- shadcn `Badge` 사용
- 상태별 색상 매핑 (variant 또는 className으로 지정):

| 도메인 | 상태 → 색상 |
|--------|------------|
| Album status | planning=slate, recording=blue, mixing=yellow, mastering=orange, released=green |
| Track status | pending=slate, recording=blue, recorded=cyan, mixing=yellow, mixed=orange, mastered=purple, final=green |
| Session status | scheduled=blue, in-progress=yellow, completed=green, cancelled=gray |
| Invoice status | draft=slate, sent=blue, paid=green, overdue=red, cancelled=gray |
| Contract status | draft=slate, active=green, completed=blue, terminated=red |
| Equipment condition | excellent=green, good=blue, fair=yellow, poor=red |

### 6. 진행률 바 패턴 (Album)
```
전체 트랙 수: N
final 상태 트랙 수: M
진행률: (M / N) × 100%

→ shadcn Progress 컴포넌트 또는 div width 스타일
```

### 7. 차트 패턴 (Recharts)
- 모든 차트는 `ResponsiveContainer width="100%" height={300}` 래핑
- 툴팁: `<Tooltip formatter={(value) => 금액 포맷}>`
- 빈 데이터 시 "데이터 없음" 텍스트 표시

### 8. 인보이스 자동 계산 흐름
```
아티스트 선택
  → 해당 아티스트의 미청구 세션 목록 표시 (체크박스)
  → 세션 선택
  → calculateInvoiceFromSessions(selectedIds) 자동 호출
  → items 배열 생성 (룸 사용료, 엔지니어 비용 행 분리)
  → subtotal 자동 입력
  → taxRate 입력 → total = subtotal × (1 + taxRate/100) 자동 계산
```

### 9. 다크모드
- `document.documentElement.classList.toggle('dark')` 방식
- shadcn/ui의 dark 클래스 기반 색상 자동 전환
- 설정 저장: `sounddesk_settings.darkMode` boolean

### 10. 데이터 초기화 확인 Dialog
```
[데이터 초기화] 버튼 클릭
  → shadcn AlertDialog 표시: "모든 데이터가 삭제됩니다. 계속하시겠습니까?"
  → [취소] 또는 [삭제 확인]
  → 확인 시: localStorage.clear() → initializeSeedData() → 페이지 새로고침
```
