# Day 54 실행 가이드 - SoundDesk

## Day 54 핵심 실험: 자율 팀 구성

### Day 52-53 vs Day 54

```
Day 52-53 (팀원 지정):
"developer-a (Opus), developer-b (Opus), tester (Sonnet), da (Haiku), documenter (Sonnet)"
→ 사람이 역할/인원/모델 결정

Day 54 (자율 구성):
"팀을 자율 구성해. 코딩=Opus, 비코딩=Sonnet/Haiku"
→ 리드가 역할/인원/모델 결정
```

### 적용할 개선 포인트 (전부 검증 완료)
1. documenter 복원 (plan approval 면제) → TASK-LOG 자동 생성
2. 범용 프롬프트 (IMPLEMENTATION.md 기반 자동 배분)
3. superpowers 자동 선택 허용
4. 사후 테스트(PIV) 방식
5. 비코딩 모델 최적화: Sonnet/Haiku
6. da + tester 병렬화
7. 테스트 실패 3개 초과 시 삭제
8. 🆕 팀원 자율 구성

---

## 세션 1: Phase A - 계획 (Plan Mode)

```
docs/requirements.md를 읽고 docs/IMPLEMENTATION.md를 작성해줘.

Wave 단위로 구분:
- Wave 1: 공통 기반 (레이아웃, 타입, localStorage 서비스, 네비게이션)
- Wave 2: 핵심 CRUD (Studio, Room, Artist, Album, Track, Member)
- Wave 3: 세션 + 비즈니스 (Session, Equipment, Invoice, Contract)
- Wave 4: 고급 기능 (Playlist, Review, Tag, Report, Dashboard, Settings)

각 Wave별로:
- 생성할 파일 목록
- 파일별 의존성
- 태스크 분해

코드 작성하지 마. 계획만.
```

---

## 세션 1.5: Phase B - 문서화

```
docs/requirements.md와 docs/IMPLEMENTATION.md를 읽고 다음을 생성해줘:

1. CLAUDE.md (60줄 이내)
   - 프로젝트 개요, 기술 스택, 빌드 명령어
   - 파일 구조 규칙, 코딩 컨벤션
   - localStorage 사용 패턴

2. docs/ARCHITECTURE.md
   - 프로젝트 구조, 라우팅, 상태관리
   - 컴포넌트 계층 구조
   - localStorage 서비스 설계 패턴

3. docs/DATABASE.md
   - 전체 엔티티 관계도 (Mermaid ERD)
   - 엔티티별 필드 정의
   - localStorage 키 네이밍 규칙
   - 관계 처리 방식

4. docs/UI-DESIGN.md
   - 페이지별 레이아웃 구조
   - 공통 컴포넌트 목록
   - 페이지 간 네비게이션 흐름
   - 주요 UI 패턴 (캘린더, 타임라인, 모달, 폼, 차트)

코드 작성하지 마. 문서만.
```

---

## 세션 2-5: Phase C - Wave 1~4 (자율 팀 구성)

### 공통 프롬프트 템플릿

Wave 번호와 테스트 상한만 바꿔서 사용:

```
CLAUDE.md와 docs/ 전체 문서를 읽고 Wave 4를 실행해.
IMPLEMENTATION.md 기준으로 팀을 자율 구성하고 태스크를 배분해.

제약:
- 코딩 역할은 Opus 사용
- 비코딩 역할(테스트/리뷰/문서)은 Sonnet 또는 Haiku 사용
- 문서 담당을 반드시 포함: 변경사항 반영이 필요한 docs/ 문서를 업데이트
- 테스트는 최대 25개, 실패 3개 초과 시 삭제
- 기존 Wave 코드 수정 금지
- 완료 후 npm run build + npx playwright test 검증 후 TeamDelete
```

### Wave별 적용 값

| 세션 | Wave | 테스트 상한 | {번호} | {상한} |
|------|------|-----------|--------|--------|
| 세션 2 | Wave 1 | 10개 | 1 | 10 |
| 세션 3 | Wave 2 | 20개 | 2 | 20 |
| 세션 4 | Wave 3 | 15개 | 3 | 15 |
| 세션 5 | Wave 4 | 25개 | 4 | 25 |

---

## 세션 6: Phase D - QA

```
먼저 npm run build 확인. 실패하면 수정 우선.

CLAUDE.md와 docs/ 문서를 읽고 최종 QA를 실행해.
팀을 자율 구성해.

제약:
- 비코딩 역할만 (Sonnet/Haiku)
- Step 1: 기존 테스트 전체 실행 + 실패 수정. 신규 테스트 작성 금지.
- Step 2: 통합 테스트 작성 (최대 8개)
  - 아티스트 → 앨범 생성 → 트랙 추가 → 세션 예약 → 인보이스 발행
  - 룸 예약 → 충돌 검증 → 세션 완료 → 장비 가용성
  - 앨범 진행률 → 트랙 상태 전이 → released
  - 계약 생성 → 세션 연결 → 매출 보고서 반영
- 실패 3개 초과 시 해당 테스트 삭제
- 최종 npm run build + npx playwright test 전체 실행 후 TeamDelete
```

---

## Day 50-54 비교 체크리스트

| 항목 | Day 50 | Day 51 | Day 52 | Day 53 | Day 54 |
|------|--------|--------|--------|--------|--------|
| 앱 | JobTools | GoalFlow | WikiFlow | SalesPipe | SoundDesk |
| 엔티티 | 없음 | 7개 | 11개 | 14개 | 14개 |
| 피처 수 | 10도구 | 25피처 | 33피처 | 45피처 | 45피처 |
| 서비스 함수 | - | - | 33개 | 50개 | 57개 |
| Wave 수 | 3 | 3 | 3 | 4 | 4 |
| 팀원 구성 | 하드코딩 | 하드코딩 | 하드코딩 | 지정+모델최적화 | 🆕 자율 |
| 프롬프트 길이 | ~30줄 | ~25줄 | ~20줄 | ~18줄 | 🆕 ~10줄 |
| documenter | 멈춤 | 제거 | ✅ 복원 | ✅ | ✅ |
| TASK-LOG | ❌ | ❌ | ✅ | ✅ | ✅ |
| superpowers | ❌ | ❌ | 자동 | 자동 | 자동 |
| 토큰 | 100% | ~50% | 100% | 98% | 목표: 70% |