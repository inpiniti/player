# Tokyomotion kaori_xoxo 동영상 데이터 수집 및 플레이어 통합 계획

## 개요
`https://www.tokyomotion.net/search?search_query=kaori_xoxo&search_type=videos` 검색 결과에서 동영상 정보(타이틀, 썸네일, 실제 미디어 MP4 URL)를 수집하여 기존 [videos.ts](file:///Users/youngkyunjung/Desktop/git/kaori-player/src/data/videos.ts) 데이터 세트에 추가 통합합니다.

## User Review Required
> [!NOTE]
> 수집 스크립트 실행 후 수집된 데이터를 기존 `KAORI_VIDEOS` 목록에 병합합니다.

## Proposed Changes

### [NEW] `scripts/crawl_tokyomotion.py`
- `tokyomotion.net` 검색 결과 페이지 및 상세 페이지를 크롤링하여 동영상 메타데이터(타이틀, mp4 비디오 URL, 썸네일 URL)를 파싱하는 Python 스크립트 작성 및 실행.

### [MODIFY] [videos.ts](file:///Users/youngkyunjung/Desktop/git/kaori-player/src/data/videos.ts)
- 수집된 Tokyomotion 동영상 항목들을 기존 `KAORI_VIDEOS` 배열에 추가.

## Verification Plan
### Automated Verification
- 수집 스크립트 실행 후 데이터 추출 결과 검증.
- `npm run build` 실행하여 TypeScript 타잎 검사 및 빌드 검증.
