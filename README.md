# Gumi Sea 🌊

> 바다 속 구미 젤리 브랜드 랜딩 페이지

**Live** → [gumisea.vercel.app](https://gumisea.vercel.app)  
**Design** → [Figma](https://www.figma.com/design/A30eIW3rdki0A2bae7D4Nl/%EA%B5%AC%EB%AF%B8%EC%94%A8-%EB%A0%8C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80?node-id=0-1&t=hGNAqqpy65ut0i4d-1)

---

## Tech Stack

| 구분 | 사용 기술 |
|---|---|
| 마크업 | HTML5 |
| 스타일 | CSS3 (clamp, custom properties, keyframes) |
| 인터랙션 | Vanilla JavaScript (ES6+) |
| 애니메이션 | [anime.js](https://animejs.com/) v3.2.1 |
| 폰트 | Google Fonts — Outfit · Gravitas One · Limelight |
| 배포 | [Vercel](https://vercel.com) |

---

## Features

### Desktop
- **Hero 영상 배경** — MP4 자동재생(음소거·반복), 이미지 폴백 없음
- **3-레이어 물고기 캐러셀** — 좌우 peek 노출 + 키보드/클릭 탐색 + 자동 슬라이드
- **물고기 hover 효과** — scale · brightness 전환, 텍스트 미세 이동
- **상품 상세 페이지** — 원형 배경 expand 애니메이션, 5개 상품 개별 페이지

### Mobile (≤ 768px)
- **풀스크린 원형 호 메뉴** — 물고기 이미지가 원호 위를 따라 배치
- **무한 슬라이드** — 4개 항목(SHOP · OUR STORY · JOURNAL · CONTACT) 순환
- **자동 회전** — 3초 간격, 드래그 중 일시 정지
- **터치 + 마우스 드래그** — 스냅·탄성 지원
- **스크롤 그라데이션 헤더** — 10px 스크롤 시 흰색 그라데이션 등장

### 공통
- **반응형** — `clamp()` 기반 유동 폰트·패딩, 768px 브레이크포인트
- **섹션 앵커 이동** — 헤더/모바일 메뉴 클릭 시 smooth scroll
- **접근성** — `aria-label`, `aria-hidden`, `aria-live`, `focus-visible`, `prefers-reduced-motion`

---

## Project Structure

```
gumisea/
├── index.html          # 단일 HTML — 전체 페이지 + 모달 상품 페이지
├── style.css           # 전체 스타일 (데스크탑 우선, 768px 모바일 분기)
├── script.js           # 캐러셀 · 모바일 메뉴 · 스크롤 등 모든 인터랙션
└── images/
    ├── hero-pool-background.mp4   # 히어로 배경 영상
    ├── hero-goldie-pop.png        # 금붕어 (SHOP)
    ├── hero-sey-octopus.png       # 문어 (CONTACT)
    ├── hero-tangy-blue.png        # 블루탱 (OUR STORY)
    ├── tropical-fish.png          # 열대어 (JOURNAL)
    ├── seahorse.png               # 해마
    └── ...                        # 장식·갤러리·상품 이미지
```

---

## Getting Started

별도 빌드 없이 정적 파일로 동작합니다.

```bash
# 로컬 미리보기 (VS Code Live Server 또는 아래 방법)
npx serve .
```

브라우저에서 `http://localhost:3000` 접속

---

## Design Reference

피그마 시안을 기반으로 제작되었습니다.  
→ [Figma 디자인 파일 열기](https://www.figma.com/design/A30eIW3rdki0A2bae7D4Nl/%EA%B5%AC%EB%AF%B8%EC%94%A8-%EB%A0%8C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80?node-id=0-1&t=hGNAqqpy65ut0i4d-1)
