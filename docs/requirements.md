# SoundDesk - 음악 스튜디오 관리 시스템

## 기술 스택
- Next.js 16 + TypeScript (App Router)
- localStorage (클라이언트 저장)
- Tailwind CSS + shadcn/ui
- Recharts (차트)
- lucide-react (아이콘)

## 엔티티

### Studio (스튜디오)
- id, name, description, address, phone, email, openTime, closeTime, createdAt, updatedAt

### Room (녹음실)
- id, studioId(FK), name, type(recording/mixing/mastering/rehearsal), hourlyRate, capacity, equipment(JSON string - 보유 장비 ID 목록), isAvailable, createdAt, updatedAt

### Artist (아티스트)
- id, name, email, phone, genre, label, bio, avatar, createdAt, updatedAt

### Album (앨범)
- id, artistId(FK), title, genre, releaseDate(nullable), status(planning/recording/mixing/mastering/released), coverArt(URL string, nullable), totalTracks, createdAt, updatedAt

### Track (트랙)
- id, albumId(FK), title, duration(초), trackNumber, status(pending/recording/recorded/mixing/mixed/mastered/final), bpm(nullable), key(nullable), notes, createdAt, updatedAt

### Session (세션 예약)
- id, roomId(FK), artistId(FK), albumId(FK, nullable), trackId(FK, nullable), engineerId(FK→Member), date, startTime, endTime, status(scheduled/in-progress/completed/cancelled), notes, createdAt, updatedAt

### Equipment (장비)
- id, name, category(microphone/headphone/monitor/mixer/interface/instrument/cable/other), brand, model, serialNumber, purchaseDate, purchasePrice, condition(excellent/good/fair/poor), location(FK→Room, nullable), isAvailable, createdAt, updatedAt

### Member (스태프)
- id, name, email, phone, role(owner/engineer/assistant/intern), speciality(recording/mixing/mastering/general), hourlyRate, avatar, createdAt, updatedAt

### Invoice (인보이스)
- id, artistId(FK), sessionIds(JSON string - 세션 ID 목록), items(JSON string - 항목별 금액), subtotal, tax, total, currency(KRW/USD), status(draft/sent/paid/overdue/cancelled), dueDate, paidDate(nullable), notes, createdAt, updatedAt

### Contract (계약)
- id, artistId(FK), albumId(FK, nullable), type(session/album/retainer), startDate, endDate, totalValue, terms, status(draft/active/completed/terminated), signedDate(nullable), createdAt, updatedAt

### Playlist (플레이리스트)
- id, name, description, trackIds(JSON string), isPublic, createdBy(FK→Member), createdAt, updatedAt

### Review (리뷰)
- id, artistId(FK), sessionId(FK, nullable), rating(1-5), comment, createdAt

### Tag (태그)
- id, name, color, createdAt

### EntityTag (엔티티-태그 연결)
- id, entityType(artist/album/track/equipment), entityId, tagId(FK)

## 페이지 및 피처

### 1. 대시보드 (/dashboard)
- 오늘/이번 주 세션 일정 요약
- 룸별 가용 현황 (타임라인 바)
- 이번 달 매출 요약 (인보이스 기준)
- 진행 중인 앨범 프로젝트 현황
- 최근 활동 타임라인

### 2. 스튜디오 관리 (/studio)
- 스튜디오 정보 CRUD
- 운영 시간 설정
- 전체 룸 목록 + 상태 표시

### 3. 녹음실 관리 (/rooms)
- 룸 CRUD
- 룸별 장비 목록 표시
- 룸별 예약 현황 (일간 타임라인)
- 타입별 필터 (recording/mixing/mastering/rehearsal)
- 시간당 요금 설정

### 4. 아티스트 관리 (/artists)
- 아티스트 CRUD
- 장르별 필터
- 검색 (이름, 레이블)
- 아티스트별 앨범 수, 세션 수, 총 매출 표시

### 5. 아티스트 상세 (/artists/:id)
- 아티스트 정보 편집
- 소속 앨범 목록
- 세션 이력
- 인보이스 목록
- 계약 목록
- 리뷰 목록

### 6. 앨범 관리 (/albums)
- 앨범 CRUD
- 상태별 필터 (planning → recording → mixing → mastering → released)
- 장르별 필터
- 아티스트별 필터
- 앨범별 트랙 수, 진행률 표시

### 7. 앨범 상세 (/albums/:id)
- 앨범 정보 편집
- 트랙 리스트 (순서 표시, 상태 뱃지)
- 트랙 CRUD
- 트랙 상태 전이 (pending → recording → ... → final)
- 앨범 진행률 바 (전체 트랙 대비 완료 비율)
- 연결된 세션 목록
- 태그 관리

### 8. 세션 예약 (/sessions)
- 세션 CRUD
- 캘린더 뷰 (주간, 날짜별 타임라인)
- 리스트 뷰 (오늘/이번 주/예정/완료)
- 룸 선택 시 가용 시간 표시
- 충돌 방지 (동일 룸 + 시간 중복 차단)
- 필터: 룸별, 아티스트별, 엔지니어별, 상태별

### 9. 세션 상세 (/sessions/:id)
- 세션 정보 편집
- 상태 전이 (scheduled → in-progress → completed/cancelled)
- 연결된 트랙 표시
- 사용 장비 표시
- 엔지니어 배정

### 10. 장비 관리 (/equipment)
- 장비 CRUD
- 카테고리별 필터
- 상태별 필터 (excellent/good/fair/poor)
- 위치별 필터 (어느 룸에 있는지)
- 가용 여부 토글
- 장비 가치 총액 표시

### 11. 스태프 관리 (/members)
- 멤버 CRUD
- 역할별 필터
- 전문분야별 필터
- 멤버별 이번 달 세션 수, 총 시간 표시

### 12. 인보이스 관리 (/invoices)
- 인보이스 CRUD
- 세션 선택 → 자동 금액 계산 (시간 × 룸 요금 + 엔지니어 요금)
- 상태 전이: draft → sent → paid/overdue
- 아티스트별 필터
- 상태별 필터
- 월별 매출 차트

### 13. 계약 관리 (/contracts)
- 계약 CRUD
- 타입별 필터 (session/album/retainer)
- 상태별 필터
- 만료 예정 계약 하이라이트
- 아티스트별 필터

### 14. 플레이리스트 (/playlists)
- 플레이리스트 CRUD
- 트랙 추가/제거 (검색으로 선택)
- 순서 변경
- 공개/비공개 토글
- 총 재생 시간 표시

### 15. 리뷰 (/reviews)
- 리뷰 CRUD
- 아티스트별 필터
- 평점별 필터
- 평균 평점 표시

### 16. 태그 관리 (/tags)
- 태그 CRUD (이름, 색상)
- 태그별 엔티티 수 표시

### 17. 보고서 (/reports)
- 매출 보고서: 월별 인보이스 매출 (라인 차트)
- 룸 가동률: 룸별 예약 시간/가용 시간 (바 차트)
- 아티스트별 매출: 아티스트 매출 랭킹 (바 차트)
- 장비 가치: 카테고리별 자산 가치 (파이 차트)
- 엔지니어 활동: 멤버별 세션 수/시간 (바 차트)

### 18. 설정 (/settings)
- 앱 설정 (기본 통화, 세율)
- 데이터 초기화
- 다크모드

## 데이터 서비스 (~57개 함수)

### Studio (4)
- getStudio, createStudio, updateStudio, deleteStudio

### Room (5)
- getRooms(filters), getRoomById, createRoom, updateRoom, deleteRoom

### Artist (5)
- getArtists(filters), getArtistById, createArtist, updateArtist, deleteArtist

### Album (6)
- getAlbums(filters), getAlbumById, createAlbum, updateAlbum, deleteAlbum, updateAlbumStatus

### Track (6)
- getTracks(albumId), getTrackById, createTrack, updateTrack, deleteTrack, updateTrackStatus

### Session (7)
- getSessions(filters), getSessionById, createSession, updateSession, deleteSession, checkRoomAvailability, updateSessionStatus

### Equipment (5)
- getEquipment(filters), getEquipmentById, createEquipment, updateEquipment, deleteEquipment

### Member (4)
- getMembers(filters), createMember, updateMember, deleteMember

### Invoice (6)
- getInvoices(filters), getInvoiceById, createInvoice, updateInvoice, deleteInvoice, calculateInvoiceFromSessions

### Contract (5)
- getContracts(filters), getContractById, createContract, updateContract, deleteContract

### Playlist (5)
- getPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist

### Review (4)
- getReviews(filters), createReview, updateReview, deleteReview

### Tag (4)
- getTags, createTag, updateTag, deleteTag

### EntityTag (2)
- addTagToEntity, removeTagFromEntity

### Dashboard (3)
- getDashboardData, getRevenueData, getRoomUtilization