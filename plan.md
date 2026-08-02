# 상세 화면 및 스크롤 개선 계획

사용자 요청 사항:
1. **상세화면 비디오 플레이어 상단 고정**: 상세 화면에서 좌측 비디오 플레이어(또는 관련 영역)가 스크롤 시에도 상단에 고정되도록 설정.
2. **하단 추천 리스트/상세 스크롤 최상단 초기화**: 비디오를 선택해 상세 화면 진입 시 또는 추천 비디오 변경 시 하단 및 관련 리스트의 스크롤 위치가 최상단(`top: 0`)으로 이동하도록 수정.
3. **목록 ↔ 상세 이동 시 목록 스크롤 위치 유지**: 목록 화면에서 스크롤을 내리다 비디오를 클릭하여 상세 화면에 들어갔다 다시 목록으로 돌아왔을 때, 이전 목록의 스크롤 위치가 유지되도록 처리.

## User Review Required
> [!NOTE]
> 데스크톱(lg 이상) 화면 기준 비디오 플레이어를 상단 고정(`sticky top-20`)하고, 우측 추천 리스트 및 비디오 선택 시 `window.scrollTo({ top: 0 })` 및 추천 목록 `scrollTop = 0` 처리를 수행합니다.
> 목록 화면 스크롤 위치 유지를 위해 `gridScrollPos` 상태나 `ref`를 보관하고, 목록으로 복귀할 때 해당 위치로 복원합니다.

## Proposed Changes

### [web] `src/App.tsx`
#### [MODIFY] [App.tsx](file:///Users/youngkyunjung/Desktop/git/kaori-player/src/App.tsx)
- `scrollPositionRef` 추가 (목록 화면 스크롤 Y값 저장)
- `sidebarListRef` 추가 (우측 추천 동영상 목록 container ref)
- `handleSelectVideo` 함수 수정:
  - `viewMode === 'grid'`일 때 현재 `window.scrollY`를 저장.
  - 비디오 선택 시 `window.scrollTo(0, 0)` 실행 및 `sidebarListRef.current.scrollTop = 0`으로 스크롤 최상단 초기화.
- `handleBackToList` / `setViewMode('grid')` 시:
  - `viewMode`를 `'grid'`로 변경 후 `requestAnimationFrame` 또는 `setTimeout`을 통해 이전에 저장된 Y 위치로 스크롤 복원.
- 상세 화면 비디오 플레이어 영역(`lg:col-span-8` 내부 또는 플레이어 컨테이너)에 `sticky top-16` / `z-20` 설정하여 스크롤 시 비디오 플레이어가 상단에 고정되도록 개선.

## Verification Plan
### Manual Verification
- 목록 화면에서 아래로 스크롤 후 비디오 클릭 -> 상세 화면 진입 시 비디오 플레이어가 상단 고정되어 있는지 확인.
- 상세 화면에서 좌측/우측 콘텐츠 스크롤 시 플레이어 및 최상단 상태 확인.
- 뒤로가기 / '목록으로' 버튼 클릭 시 이전 스크롤 위치로 원복되는지 확인.
