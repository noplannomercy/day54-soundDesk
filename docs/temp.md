# Wave 4 재개 가이드

## 현재 상태
Wave 4 코딩 완료. 빌드 검증 + 테스트 + 마무리 대기 중.

## 팀 정보
- Team name: `wave4-sounddesk` (아직 삭제 안 됨)

## 재개 시 할 일 (순서대로)

### 1. npm run build
```bash
npm run build
```
빌드 오류 있으면 수정.

### 2. Wave 4 Playwright 테스트 작성
- 파일: `tests/e2e/wave4.spec.ts`
- 최대 25개 테스트
- 기존 wave1/2/3.spec.ts 패턴 참고
- 대상 페이지: /dashboard, /tags, /reviews, /playlists, /reports, /settings

### 3. npx playwright test 실행
```bash
npx playwright test
```
실패 3개 초과 시 해당 테스트 삭제.

### 4. TeamDelete
```
wave4-sounddesk 팀 삭제
```

## Wave 4에서 구현된 것

### 신규 서비스
- `src/services/tagService.ts`
- `src/services/reviewService.ts`
- `src/services/playlistService.ts`
- `src/services/dashboardService.ts`

### 신규 컴포넌트
- `src/components/tags/` — TagBadge, TagSelector, TagForm
- `src/components/reviews/` — StarRating, ReviewForm
- `src/components/playlists/` — TrackPicker, PlaylistForm
- `src/components/dashboard/` — SessionTimeline, RoomAvailability, RevenueCard, AlbumProgressCard, ActivityTimeline
- `src/components/reports/` — RevenueChart, RoomUtilizationChart, ArtistRevenueChart, EquipmentValueChart, EngineerActivityChart

### 완성된 페이지 (placeholder → 실제 구현)
- `src/app/(main)/tags/page.tsx`
- `src/app/(main)/reviews/page.tsx`
- `src/app/(main)/playlists/page.tsx`
- `src/app/(main)/dashboard/page.tsx`
- `src/app/(main)/reports/page.tsx`
- `src/app/(main)/settings/page.tsx`

### 기존 파일 통합 수정
- `src/app/(main)/albums/[id]/page.tsx` — TagSelector 연결
- `src/app/(main)/artists/[id]/page.tsx` — reviews 탭 연결