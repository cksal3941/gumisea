<div align="center">

# 🌊 Gumi Sea

**바다 물고기를 모티브로 한 가상의 유기농 구미 젤리 브랜드 랜딩 페이지**

[![Vercel](https://img.shields.io/badge/LIVE-gumisea.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://gumisea.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-cksal3941%2Fgumisea-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cksal3941/gumisea)
[![Figma](https://img.shields.io/badge/Design-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/A30eIW3rdki0A2bae7D4Nl/%EA%B5%AC%EB%AF%B8%EC%94%A8-%EB%A0%8C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80?node-id=0-1&t=hGNAqqpy65ut0i4d-1)

![GitHub last commit](https://img.shields.io/github/last-commit/cksal3941/gumisea?style=flat-square&color=FF6B6B)
![GitHub repo size](https://img.shields.io/github/repo-size/cksal3941/gumisea?style=flat-square&color=4ECDC4)
![GitHub stars](https://img.shields.io/github/stars/cksal3941/gumisea?style=flat-square&color=FFE66D)

![Duration](https://img.shields.io/badge/기간-2026.07.23%20~%2007.25%20(3일)-A29BFE?style=flat-square)

</div>

---

## About

Gumi Sea는 바닷속 물고기 캐릭터에서 영감을 받은 **가상의 구미 젤리 브랜드**입니다.  
금붕어, 문어, 블루탱, 해마, 열대어 등 5종의 물고기 캐릭터가 각각 고유한 유기농 과일 맛을 대표합니다.

| 캐릭터 | 제품명 | 맛 |
|---|---|---|
| 🐠 금붕어 | GOLDIE POP | Organic Tangerine |
| 🐟 블루탱 | TANGY BLUE | Organic Blueberry |
| 🐙 문어 | OCTO POP | Organic Strawberry |
| 🐴 해마 | SEAHORSEY | Organic Green Grape |
| 🐡 열대어 | TUTTI FISH | Organic Mixed Fruit |

---

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=google&logoColor=white)
![anime.js](https://img.shields.io/badge/anime.js-FF6B6B?style=for-the-badge&logoColor=white)

---

## Features

### 🖥️ Desktop
- **Hero 영상 배경** — MP4 자동재생(음소거·반복)
- **3-레이어 물고기 캐러셀** — 좌우 peek 노출 + 키보드/클릭 탐색 + 자동 슬라이드
- **물고기 hover 효과** — scale · brightness 전환
- **상품 상세 페이지** — 원형 배경 expand 애니메이션, 5개 상품 개별 페이지

### 📱 Mobile (≤ 768px)
- **풀스크린 원형 호 메뉴** — 물고기 이미지가 원호 위를 따라 배치
- **무한 슬라이드** — 4개 항목 순환, 3초 자동 회전
- **터치 + 마우스 드래그** — 스냅·탄성 지원
- **스크롤 그라데이션 헤더** — 스크롤 시 흰색 그라데이션 등장

### ✨ 공통
- **반응형** — `clamp()` 기반 유동 폰트·패딩
- **섹션 앵커 이동** — smooth scroll
- **접근성** — aria-label, focus-visible, prefers-reduced-motion

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
npx serve .
# → http://localhost:3000
```

---

## Asset Credits

| 에셋 | 제작 도구 |
|---|---|
| 물고기·캐릭터 이미지 | ![ChatGPT](https://img.shields.io/badge/ChatGPT-74AA9C?style=flat-square&logo=openai&logoColor=white) DALL·E 이미지 생성 |
| 히어로 배경 영상 | ![Google](https://img.shields.io/badge/Google_Flow-4285F4?style=flat-square&logo=google&logoColor=white) AI 영상 생성 |
| UI 디자인 시안 | ![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white) 디자인 시안 |
