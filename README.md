# Kissjav Kaori Xoxo 수집 및 플레이어 웹 애플리케이션

본 프로젝트는 `kissjav.li` 사이트에서 `[Myfans] Kaori Xoxo 모음 fansly ({:숫자})` 게시물을 수집하여, 썸네일 리스트 및 비디오 플레이어를 구현한 독자적인 웹 애플리케이션입니다.

---

## 프로젝트 구조

```text
kaori-player/
├── src/
│   ├── data/
│   │   └── videos.ts        # 48개 수집 영상 (타이틀, 미디어 URL, 썸네일 URL)
│   ├── App.tsx              # 비디오 플레이어 UI 컴포넌트
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
└── tsconfig.json
```

---

## 실행 방법

```bash
cd kaori-player
nvm use 20
npm run dev
```
