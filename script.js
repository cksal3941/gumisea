// ── 햄버거 메뉴 토글 ──────────────────────────────────────
const navToggle    = document.getElementById('nav-toggle');
const mobileNav    = document.getElementById('mobile-nav');
const mobileClose  = document.getElementById('mobile-nav-close');

function openMobileNav() {
  mobileNav.classList.add('is-open');
  mobileNav.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
  mnavReset();
}

function closeMobileNav() {
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (navToggle) navToggle.addEventListener('click', openMobileNav);
if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileNav);
  });
}

// ─────────────────────────────────────────────────────────
//  CAROUSEL_CONFIG
// ─────────────────────────────────────────────────────────
const CAROUSEL_CONFIG = {
  defaultDuration:                 1100,
  defaultEasing:                   'cubic-bezier(0.25, 0.1, 0.25, 1)',

  mobileBreakpoint:                768,

  autoplayEnabled:   true,
  autoplayDelay:     2200,
  resumeDelay:       2200,
  pauseWhenHidden:   true,

  defaultFloatX:         7,
  defaultFloatY:        -12,
  defaultFloatRotation:  1.0,
  defaultFloatDuration:  2800,
  defaultFloatDelay:     200,

  pauseOnHover:            true,
  pauseOnFocus:            true,
  hoverScale:              1.05,
  hoverDuration:           300,
  hoverTextOffset:        -3,
  hoverLetterSpacing:      '0.02em',
  interactionResumeDelay:  1200,

  // 양쪽 끝 미리보기 (peek)
  // 물고기 중심이 뷰포트 가장자리에 걸치도록 → 정확히 절반이 보임
  peekScale:   0.75,   // 중앙 대비 크기 비율
  peekOpacity: 1,      // 불투명도
  peekYOffset: 0.30,   // vh 비율 — 왼쪽 peek 위로, 오른쪽 peek 아래로
};

// ─────────────────────────────────────────────────────────
//  PRODUCTS
// ─────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'octo-pop', displayName: 'OCTO POP',
    image: 'images/hero-sey-octopus.png', alt: 'OCTO POP 문어 젤리',
    scale: 1.15, centerX: 0, centerY: 0.02, centerRotation: 0,
    duration: null, easing: null,
    floatX: 5, floatY: -8, floatRotation: 0.7, floatDuration: 3200, floatDelay: 200,
  },
  {
    id: 'goldie-pop', displayName: 'GOLDIE POP',
    image: 'images/hero-goldie-pop.png', alt: 'GOLDIE POP 금붕어 젤리',
    scale: 1.2, centerX: 0, centerY: 0, centerRotation: 0,
    duration: null, easing: null,
    floatX: null, floatY: null, floatRotation: null, floatDuration: null, floatDelay: null,
  },
  {
    id: 'tangy-blue', displayName: 'TANGY BLUE',
    image: 'images/hero-tangy-blue.png', alt: 'TANGY BLUE 블루탱 젤리',
    scale: 1.1, centerX: 0, centerY: 0, centerRotation: -3,
    duration: null, easing: null,
    floatX: 10, floatY: -10, floatRotation: 1.0, floatDuration: 2600, floatDelay: 200,
  },
  {
    id: 'seahorsey', displayName: 'SEAHORSEY',
    image: 'images/seahorse.png', alt: 'SEAHORSEY 해마 젤리',
    scale: 1.1, centerX: 0, centerY: -0.04, centerRotation: -5,
    duration: null, easing: null,
    floatX: 7, floatY: -12, floatRotation: 0.5, floatDuration: 3000, floatDelay: 200,
  },
  {
    id: 'tutti-fish', displayName: 'TUTTI FISH',
    image: 'images/tropical-fish.png', alt: 'TUTTI FISH 열대어 젤리',
    scale: 1.15, centerX: 0, centerY: 0, centerRotation: 2,
    duration: null, easing: null,
    floatX: 7, floatY: -15, floatRotation: 1.0, floatDuration: 2400, floatDelay: 200,
  },
];

// ─────────────────────────────────────────────────────────
//  VIEWPORT
// ─────────────────────────────────────────────────────────
let vw = window.innerWidth;
let vh = window.innerHeight;
window.addEventListener('resize', () => { vw = window.innerWidth; vh = window.innerHeight; });

// ─────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────
let currentIndex  = 1;      // GOLDIE POP
let isAnimating   = false;
let autoplayTimer = null;
let resumeTimer   = null;
let isHovered     = false;
let isFocused     = false;

// ─────────────────────────────────────────────────────────
//  INDEX HELPERS
// ─────────────────────────────────────────────────────────
function getCurrentProduct()  { return PRODUCTS[currentIndex]; }
function getPreviousProduct() { return PRODUCTS[(currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length]; }
function getNextProduct()     { return PRODUCTS[(currentIndex + 1) % PRODUCTS.length]; }

// ─────────────────────────────────────────────────────────
//  MOTION CHECK
// ─────────────────────────────────────────────────────────
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─────────────────────────────────────────────────────────
//  TRANSFORM HELPERS
// ─────────────────────────────────────────────────────────

// 중앙 배치: 상품별 scale/centerX/Y/Rotation 반영
function getCenterTransform(p) {
  const s   = p.scale ?? 1;
  const cx  = p.centerX ?? 0;
  const cy  = p.centerY ?? 0;
  const rot = p.centerRotation ?? 0;
  const tx  = cx === 0 ? '-50%' : `calc(-50% + ${Math.round(cx * vw)}px)`;
  const ty  = cy === 0 ? '-50%' : `calc(-50% + ${Math.round(cy * vh)}px)`;
  return rot === 0
    ? `translate3d(${tx}, ${ty}, 0) scale(${s})`
    : `translate3d(${tx}, ${ty}, 0) scale(${s}) rotate(${rot}deg)`;
}

// 좌우 peek: 물고기 중심을 화면 가장자리에 걸쳐 정확히 절반만 노출
// side = +1 (오른쪽 하단), -1 (왼쪽 상단)
function getPeekTransform(p, side) {
  const s   = (p.scale ?? 1) * CAROUSEL_CONFIG.peekScale;
  const rot = p.centerRotation ?? 0;
  const dx  = Math.round(side * vw * 0.50);
  const dy  = Math.round(side * vh * CAROUSEL_CONFIG.peekYOffset);  // 왼쪽:-Y(위), 오른쪽:+Y(아래)
  const rotStr = rot === 0 ? '' : ` rotate(${rot}deg)`;
  return `translate3d(calc(-50% + ${dx}px), calc(-50% + ${dy}px), 0) scale(${s})${rotStr}`;
}

// 완전히 화면 밖 (전환 시 퇴장 레이어가 사라질 목적지)
// side = +1 (오른쪽 바깥), -1 (왼쪽 바깥)
function getOffScreenTransform(side) {
  const dx = Math.round(side * vw * 1.10);
  return `translate3d(calc(-50% + ${dx}px), -50%, 0)`;
}

// ─────────────────────────────────────────────────────────
//  FLOAT HELPERS
// ─────────────────────────────────────────────────────────
function applyFloatVars(floatEl, product) {
  floatEl.style.setProperty('--float-x',        `${product.floatX        ?? CAROUSEL_CONFIG.defaultFloatX}px`);
  floatEl.style.setProperty('--float-y',        `${product.floatY        ?? CAROUSEL_CONFIG.defaultFloatY}px`);
  floatEl.style.setProperty('--float-rotation', `${product.floatRotation ?? CAROUSEL_CONFIG.defaultFloatRotation}deg`);
  floatEl.style.setProperty('--float-duration', `${product.floatDuration ?? CAROUSEL_CONFIG.defaultFloatDuration}ms`);
  floatEl.style.setProperty('--float-delay',    `${product.floatDelay    ?? CAROUSEL_CONFIG.defaultFloatDelay}ms`);
}

function startFloat(floatEl, product) {
  if (prefersReducedMotion()) return;
  stopFloat(floatEl);
  applyFloatVars(floatEl, product);
  floatEl.classList.add('is-floating');
}

function stopFloat(floatEl) {
  floatEl.classList.remove('is-floating');
}

function startSwimAnimation(floatEl, dur) {
  if (prefersReducedMotion()) return;
  floatEl.animate(
    [
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
      { transform: 'translate3d(0, -4px, 0) rotate(0.8deg)' },
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
      { transform: 'translate3d(0, 4px, 0) rotate(-0.8deg)' },
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
    ],
    { duration: dur / 2, iterations: 2, easing: 'ease-in-out', fill: 'none' }
  );
}

// ─────────────────────────────────────────────────────────
//  PRELOAD
// ─────────────────────────────────────────────────────────
function preloadProductImages() {
  return new Promise(resolve => {
    let remaining = PRODUCTS.length;
    if (remaining === 0) { resolve(); return; }
    PRODUCTS.forEach(p => {
      const img = new Image();
      img.onload  = () => { if (--remaining === 0) resolve(); };
      img.onerror = () => {
        console.warn(`[Gumi Sea] 이미지 로드 실패 — "${p.displayName}" : ${p.image}`);
        if (--remaining === 0) resolve();
      };
      img.src = p.image;
    });
  });
}

// ─────────────────────────────────────────────────────────
//  DOM 요소 참조
// ─────────────────────────────────────────────────────────
const textNodes = [
  document.getElementById('text-0'),
  document.getElementById('text-1'),
  document.getElementById('text-2'),
  document.getElementById('text-3'),
];

const motionA = document.getElementById('fish-motion-a');
const motionB = document.getElementById('fish-motion-b');
const motionC = document.getElementById('fish-motion-c');
const floatA  = document.getElementById('fish-float-a');
const floatB  = document.getElementById('fish-float-b');
const floatC  = document.getElementById('fish-float-c');
const hoverA  = document.getElementById('fish-hover-a');
const hoverB  = document.getElementById('fish-hover-b');
const hoverC  = document.getElementById('fish-hover-c');
const imgA    = document.getElementById('fish-a');
const imgB    = document.getElementById('fish-b');
const imgC    = document.getElementById('fish-c');
const liveEl  = document.getElementById('carousel-live');

// ── 3-layer 구조 ─────────────────────────────────────────
//  prevLayer  : 왼쪽 peek (절반 노출)
//  activeLayer: 중앙 (전체 노출, float + hover 활성)
//  nextLayer  : 오른쪽 peek (절반 노출)
// ─────────────────────────────────────────────────────────
const fishNodes = [
  { motion: motionA, float: floatA, hover: hoverA, img: imgA },
  { motion: motionB, float: floatB, hover: hoverB, img: imgB },
  { motion: motionC, float: floatC, hover: hoverC, img: imgC },
];

let prevLayer   = fishNodes[2];   // 초기: 왼쪽 peek
let activeLayer = fishNodes[0];   // 초기: 중앙
let nextLayer   = fishNodes[1];   // 초기: 오른쪽 peek

// slotNodes 배열 순서: [PREV, CURRENT, NEXT, OFF_RIGHT]
let slotNodes = [...textNodes];

// ─────────────────────────────────────────────────────────
//  ARIA-LIVE
// ─────────────────────────────────────────────────────────
function announceLive(text) {
  if (!liveEl) return;
  liveEl.textContent = '';
  requestAnimationFrame(() => { liveEl.textContent = text; });
}

// ─────────────────────────────────────────────────────────
//  TEXT SLOT 위치
// ─────────────────────────────────────────────────────────
const SLOT_TRANSFORM = {
  OFF_LEFT:  'translateX(calc(-100vw - 600px))       translateY(-50%)',
  PREV:      'translateX(-16px)                       translateY(-50%)',
  CURRENT:   'translateX(calc(50vw - 50%))            translateY(-50%)',
  NEXT:      'translateX(calc(100vw + 40px - 100%))   translateY(-50%)',
  OFF_RIGHT: 'translateX(calc(100vw + 600px))         translateY(-50%)',
};

const SLOT_TRANSFORM_MOBILE = {
  OFF_LEFT:  'translateY(-150vh)',
  PREV:      'translateY(16vh)',
  CURRENT:   'translateY(44vh)',
  NEXT:      'translateY(72vh)',
  OFF_RIGHT: 'translateY(150vh)',
};

function isMobile() { return vw <= CAROUSEL_CONFIG.mobileBreakpoint; }

function setPosition(el, slotKey, animate, dur, ease) {
  const d = dur  ?? CAROUSEL_CONFIG.defaultDuration;
  const e = ease ?? CAROUSEL_CONFIG.defaultEasing;
  if (animate) {
    el.style.transition = `transform ${d}ms ${e}, color ${d}ms ${e}`;
  } else {
    el.style.transition = 'none';
    void el.offsetWidth;
  }
  el.style.transform = isMobile() ? SLOT_TRANSFORM_MOBILE[slotKey] : SLOT_TRANSFORM[slotKey];
}

// ─────────────────────────────────────────────────────────
//  HOVER VISUAL HELPERS
// ─────────────────────────────────────────────────────────
function applyHoverVisuals() {
  if (isAnimating) return;
  activeLayer.hover.classList.add('is-hovered');
  const curText = slotNodes[1];
  const d = CAROUSEL_CONFIG.hoverDuration;
  const e = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
  curText.style.transition = `top ${d}ms ${e}, letter-spacing ${d}ms ${e}`;
  void curText.offsetWidth;
  curText.style.top           = `calc(52% + ${CAROUSEL_CONFIG.hoverTextOffset}px)`;
  curText.style.letterSpacing = CAROUSEL_CONFIG.hoverLetterSpacing;
}

function removeHoverVisuals(animate) {
  [hoverA, hoverB, hoverC].forEach(h => h.classList.remove('is-hovered'));
  const d = CAROUSEL_CONFIG.hoverDuration;
  const e = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
  if (animate) {
    textNodes.forEach(el => {
      el.style.transition = `top ${d}ms ${e}, letter-spacing ${d}ms ${e}`;
    });
    void document.body.offsetWidth;
    textNodes.forEach(el => { el.style.top = ''; el.style.letterSpacing = ''; });
  } else {
    textNodes.forEach(el => {
      el.style.transition = 'none'; el.style.top = ''; el.style.letterSpacing = '';
    });
  }
}

// ─────────────────────────────────────────────────────────
//  INTERACTION STATE
// ─────────────────────────────────────────────────────────
function isInteracting() { return isHovered || isFocused; }

function stopResumeTimer() {
  if (resumeTimer !== null) { clearTimeout(resumeTimer); resumeTimer = null; }
}

function scheduleResume() {
  stopResumeTimer();
  resumeTimer = setTimeout(() => {
    resumeTimer = null;
    if (!isInteracting() && !document.hidden && CAROUSEL_CONFIG.autoplayEnabled) {
      startAutoplay();
    }
  }, CAROUSEL_CONFIG.interactionResumeDelay);
}

// ─────────────────────────────────────────────────────────
//  HOVER · FOCUS 이벤트 핸들러
// ─────────────────────────────────────────────────────────
function onFishHoverStart(e) {
  if (e.currentTarget !== activeLayer.hover)            return;
  if (!CAROUSEL_CONFIG.pauseOnHover)                    return;
  if (isAnimating)                                      return;
  if (!window.matchMedia('(hover: hover)').matches)     return;
  if (isHovered)                                        return;
  isHovered = true;
  stopResumeTimer(); stopAutoplay();
  applyHoverVisuals();
}

function onFishHoverEnd(e) {
  if (e.currentTarget !== activeLayer.hover) return;
  if (!isHovered)                            return;
  isHovered = false;
  removeHoverVisuals(true);
  if (!isInteracting()) scheduleResume();
}

function onFishFocusIn(e) {
  if (e.currentTarget !== activeLayer.hover) return;
  if (!CAROUSEL_CONFIG.pauseOnFocus)         return;
  if (isFocused)                             return;
  try { if (!e.target.matches(':focus-visible')) return; } catch (_) {}
  isFocused = true;
  stopResumeTimer(); stopAutoplay();
  applyHoverVisuals();
}

function onFishFocusOut(e) {
  if (e.currentTarget !== activeLayer.hover)           return;
  if (e.currentTarget.contains(e.relatedTarget))       return;
  if (!isFocused)                                      return;
  isFocused = false;
  removeHoverVisuals(true);
  if (!isInteracting()) scheduleResume();
}

// ─────────────────────────────────────────────────────────
//  POINTER-EVENTS 관리 (active 레이어만 클릭·호버 수신)
// ─────────────────────────────────────────────────────────
function activateHoverPointer() {
  activeLayer.hover.style.pointerEvents = 'auto';
  prevLayer.hover.style.pointerEvents   = 'auto';
  nextLayer.hover.style.pointerEvents   = 'auto';
}

// ─────────────────────────────────────────────────────────
//  공통 레이어 설정 (transition:none + 즉시 배치)
// ─────────────────────────────────────────────────────────
function placeFishInstant(layer, product, transformStr, opacity, zIdx) {
  layer.motion.style.transition = 'none';
  layer.motion.style.transform  = transformStr;
  layer.motion.style.opacity    = String(opacity);
  layer.motion.style.zIndex     = String(zIdx);
  void layer.motion.offsetWidth;
}

// ─────────────────────────────────────────────────────────
//  RENDER 초기 DOM 상태
// ─────────────────────────────────────────────────────────
function renderInitialProducts() {
  const n       = PRODUCTS.length;
  const current = getCurrentProduct();
  const next    = getNextProduct();
  const prev    = getPreviousProduct();

  // 텍스트 슬롯
  const initText = (el, slotKey, product) => {
    el.textContent = product.displayName;
    el.dataset.productId = product.id;
    el.classList.toggle('slot-current', slotKey === 'CURRENT');
    setPosition(el, slotKey, false);
  };
  initText(slotNodes[0], 'PREV',      prev);
  initText(slotNodes[1], 'CURRENT',   current);
  initText(slotNodes[2], 'NEXT',      next);
  initText(slotNodes[3], 'OFF_RIGHT', PRODUCTS[(currentIndex + 2) % n]);

  // 물고기 3레이어 배치
  activeLayer.img.src = current.image;
  activeLayer.img.alt = '';
  activeLayer.hover.dataset.productId = current.id;
  placeFishInstant(activeLayer, current, getCenterTransform(current), 1, 3);

  nextLayer.img.src = next.image;
  nextLayer.img.alt = '';
  nextLayer.hover.dataset.productId = next.id;
  placeFishInstant(nextLayer, next, getPeekTransform(next, +1), CAROUSEL_CONFIG.peekOpacity, 1);

  prevLayer.img.src = prev.image;
  prevLayer.img.alt = '';
  prevLayer.hover.dataset.productId = prev.id;
  placeFishInstant(prevLayer, prev, getPeekTransform(prev, -1), CAROUSEL_CONFIG.peekOpacity, 1);

  // 접근성
  activeLayer.hover.setAttribute('aria-label', current.displayName);
  activeLayer.hover.tabIndex = 0;
  prevLayer.hover.setAttribute('aria-label', '');
  prevLayer.hover.tabIndex = -1;
  nextLayer.hover.setAttribute('aria-label', '');
  nextLayer.hover.tabIndex = -1;
  activateHoverPointer();

  startFloat(activeLayer.float, current);

  console.log(`[Gumi Sea] 초기 렌더링 | CURRENT: ${current.displayName}`);
}

// ─────────────────────────────────────────────────────────
//  AUTOPLAY
// ─────────────────────────────────────────────────────────
function stopAutoplay() {
  if (autoplayTimer !== null) { clearTimeout(autoplayTimer); autoplayTimer = null; }
}

function scheduleNextSlide() {
  if (autoplayTimer !== null) return;
  if (!CAROUSEL_CONFIG.autoplayEnabled) return;
  autoplayTimer = setTimeout(() => {
    autoplayTimer = null;
    nextSlide({ source: 'autoplay' }).then(result => {
      if (result && result.skipped) return;
      if (CAROUSEL_CONFIG.autoplayEnabled && !document.hidden && !isInteracting()) {
        scheduleNextSlide();
      }
    });
  }, CAROUSEL_CONFIG.autoplayDelay);
}

function startAutoplay() {
  if (!CAROUSEL_CONFIG.autoplayEnabled) return;
  stopAutoplay();
  scheduleNextSlide();
  console.log('[Gumi Sea] 자동 반복 시작');
}

function handleVisibilityChange() {
  if (!CAROUSEL_CONFIG.pauseWhenHidden) return;
  if (document.hidden) {
    stopAutoplay(); stopResumeTimer();
    console.log('[Gumi Sea] 탭 비활성 → 자동 반복 정지');
  } else {
    if (!CAROUSEL_CONFIG.autoplayEnabled || isInteracting()) return;
    stopAutoplay();
    autoplayTimer = setTimeout(() => {
      autoplayTimer = null;
      if (!isInteracting()) scheduleNextSlide();
    }, CAROUSEL_CONFIG.resumeDelay);
    console.log(`[Gumi Sea] 탭 복귀 → ${CAROUSEL_CONFIG.resumeDelay}ms 후 재개`);
  }
}

// ─────────────────────────────────────────────────────────
//  changeSlide(direction)
//
//  방향 +1 (next):
//    leaving  = prevLayer  (왼쪽peek → 화면 완전 바깥 왼쪽)
//    outgoing = activeLayer (중앙    → 왼쪽peek)
//    incoming = nextLayer   (오른쪽peek → 중앙)
//    cleanup: leaving 재활용 → 오른쪽peek (다음다음 상품)
//    swap: [prev, active, next] = [outgoing, incoming, leaving_recycled]
//
//  방향 -1 (prev):
//    leaving  = nextLayer   (오른쪽peek → 화면 완전 바깥 오른쪽)
//    outgoing = activeLayer (중앙    → 오른쪽peek)
//    incoming = prevLayer   (왼쪽peek → 중앙)
//    cleanup: leaving 재활용 → 왼쪽peek (이전이전 상품)
//    swap: [prev, active, next] = [leaving_recycled, incoming, outgoing]
// ─────────────────────────────────────────────────────────
function changeSlide(direction, options = {}) {
  const { source = 'manual' } = options;
  if (isAnimating) return Promise.resolve({ skipped: true });
  isAnimating = true;

  const n        = PRODUCTS.length;
  const newIndex = ((currentIndex + direction) + n) % n;
  const currProd = PRODUCTS[currentIndex];
  const targProd = PRODUCTS[newIndex];
  const dur      = targProd.duration ?? CAROUSEL_CONFIG.defaultDuration;
  const ease     = targProd.easing   ?? CAROUSEL_CONFIG.defaultEasing;

  // 호버·포커스 강제 초기화
  if (isHovered || isFocused) {
    isHovered = false; isFocused = false;
    removeHoverVisuals(false);
    stopResumeTimer();
  }

  // ── 텍스트 슬롯 ──────────────────────────────────────
  const [a, b, c, d] = slotNodes;
  if (direction > 0) {
    b.classList.remove('slot-current');
    c.classList.add('slot-current');
    setPosition(a, 'OFF_LEFT', true, dur, ease);
    setPosition(b, 'PREV',     true, dur, ease);
    setPosition(c, 'CURRENT',  true, dur, ease);
    setPosition(d, 'NEXT',     true, dur, ease);
  } else {
    const newPrevIdx = ((newIndex - 1) + n) % n;
    d.textContent = PRODUCTS[newPrevIdx].displayName;
    d.dataset.productId = PRODUCTS[newPrevIdx].id;
    d.classList.remove('slot-current');
    b.classList.remove('slot-current');
    a.classList.add('slot-current');
    setPosition(d, 'OFF_LEFT', false);
    setPosition(d, 'PREV',      true, dur, ease);
    setPosition(a, 'CURRENT',   true, dur, ease);
    setPosition(b, 'NEXT',      true, dur, ease);
    setPosition(c, 'OFF_RIGHT', true, dur, ease);
  }

  // ── 물고기 3레이어 전환 ──────────────────────────────
  const leaving  = direction > 0 ? prevLayer : nextLayer;
  const outgoing = activeLayer;
  const incoming = direction > 0 ? nextLayer : prevLayer;

  // 전환 중 hover 효과만 제거 — leaving만 클릭 차단 (화면 밖으로 나감)
  [leaving, outgoing, incoming].forEach(l => l.hover.classList.remove('is-hovered'));
  leaving.hover.style.pointerEvents  = 'none';
  outgoing.hover.style.pointerEvents = 'auto';
  incoming.hover.style.pointerEvents = 'auto';

  stopFloat(outgoing.float);

  startSwimAnimation(leaving.float,  dur);
  startSwimAnimation(outgoing.float, dur);
  startSwimAnimation(incoming.float, dur);

  const tx = `transform ${dur}ms ${ease}, opacity ${dur}ms ${ease}`;

  // leaving: 현재 peek → 화면 완전 바깥 (fade out)
  leaving.motion.style.transition = tx;
  leaving.motion.style.transform  = getOffScreenTransform(direction > 0 ? -1 : +1);
  leaving.motion.style.opacity    = '0';
  leaving.motion.style.zIndex     = '1';

  // outgoing: 중앙 → 반대쪽 peek (zoom-out + fade)
  outgoing.motion.style.transition = tx;
  outgoing.motion.style.transform  = getPeekTransform(currProd, direction > 0 ? -1 : +1);
  outgoing.motion.style.opacity    = String(CAROUSEL_CONFIG.peekOpacity);
  outgoing.motion.style.zIndex     = '2';

  // incoming: peek → 중앙 (zoom-in)
  incoming.motion.style.transition = tx;
  incoming.motion.style.transform  = getCenterTransform(targProd);
  incoming.motion.style.opacity    = '1';
  incoming.motion.style.zIndex     = '3';

  // ── 전환 완료 후 정리 ─────────────────────────────────
  return new Promise(resolve => {
    setTimeout(() => {
      currentIndex = newIndex;

      // 텍스트 슬롯 정리
      if (direction > 0) {
        a.textContent = PRODUCTS[(currentIndex + 2) % n].displayName;
        a.dataset.productId = PRODUCTS[(currentIndex + 2) % n].id;
        a.classList.remove('slot-current');
        setPosition(a, 'OFF_RIGHT', false);
        slotNodes = [b, c, d, a];
      } else {
        slotNodes = [d, a, b, c];
      }

      announceLive(PRODUCTS[currentIndex].displayName);

      // incoming 트랜지션 정리 (새 중앙 확정)
      incoming.motion.style.transition = 'none';
      void incoming.motion.offsetWidth;

      // outgoing 트랜지션 정리 (새 peek 확정)
      outgoing.motion.style.transition = 'none';
      void outgoing.motion.offsetWidth;

      // leaving 재활용 → 반대쪽 peek 로 순간이동 + 새 이미지
      const recycleSide = direction > 0 ? +1 : -1;
      const recycleIdx  = direction > 0
        ? (currentIndex + 1) % n
        : (currentIndex - 1 + n) % n;
      leaving.img.src = PRODUCTS[recycleIdx].image;
      leaving.img.alt = '';
      leaving.hover.dataset.productId = PRODUCTS[recycleIdx].id;
      leaving.motion.style.transition = 'none';
      leaving.motion.style.transform  = getPeekTransform(PRODUCTS[recycleIdx], recycleSide);
      leaving.motion.style.opacity    = String(CAROUSEL_CONFIG.peekOpacity);
      leaving.motion.style.zIndex     = '1';
      void leaving.motion.offsetWidth;

      // 레이어 포인터 교체
      if (direction > 0) {
        [prevLayer, activeLayer, nextLayer] = [outgoing, incoming, leaving];
      } else {
        [prevLayer, activeLayer, nextLayer] = [leaving, incoming, outgoing];
      }

      // 새 activeLayer 설정
      activeLayer.motion.style.zIndex = '3';
      prevLayer.motion.style.zIndex   = '1';
      nextLayer.motion.style.zIndex   = '1';

      activeLayer.hover.setAttribute('aria-label', PRODUCTS[currentIndex].displayName);
      activeLayer.hover.tabIndex = 0;
      prevLayer.hover.setAttribute('aria-label', '');
      prevLayer.hover.tabIndex = -1;
      nextLayer.hover.setAttribute('aria-label', '');
      nextLayer.hover.tabIndex = -1;
      activateHoverPointer();

      startFloat(activeLayer.float, PRODUCTS[currentIndex]);

      isAnimating = false;

      const arrow = direction > 0 ? '→' : '←';
      console.log(`[Gumi Sea] ${source} ${arrow} ${PRODUCTS[currentIndex].displayName} (${currentIndex})`);

      resolve({ source, currentIndex, direction });
    }, dur + 50);
  });
}

// ─────────────────────────────────────────────────────────
//  nextSlide / previousSlide 래퍼
// ─────────────────────────────────────────────────────────
function nextSlide(options = {})     { return changeSlide( 1, options); }
function previousSlide(options = {}) { return changeSlide(-1, options); }

// ─────────────────────────────────────────────────────────
//  handleManualSlide (키보드·수동 조작)
// ─────────────────────────────────────────────────────────
function handleManualSlide(direction, source) {
  if (isAnimating) return;
  stopAutoplay();
  stopResumeTimer();
  changeSlide(direction, { source }).then(result => {
    if (result && result.skipped) return;
    if (!isInteracting() && !document.hidden && CAROUSEL_CONFIG.autoplayEnabled) {
      scheduleResume();
    }
  });
}

// ─────────────────────────────────────────────────────────
//  CSS 변수 동기화
// ─────────────────────────────────────────────────────────
function syncConfigToCSSVars() {
  document.documentElement.style.setProperty('--fish-hover-scale', CAROUSEL_CONFIG.hoverScale);
  document.documentElement.style.setProperty('--hover-duration',   `${CAROUSEL_CONFIG.hoverDuration}ms`);
}

// ─────────────────────────────────────────────────────────
//  EVENT BINDINGS
// ─────────────────────────────────────────────────────────

[hoverA, hoverB, hoverC].forEach(el => {
  el.addEventListener('mouseenter', onFishHoverStart);
  el.addEventListener('mouseleave', onFishHoverEnd);
  el.addEventListener('focusin',    onFishFocusIn);
  el.addEventListener('focusout',   onFishFocusOut);
  el.addEventListener('click', (e) => {
    const productId = e.currentTarget.dataset.productId;
    if (!productId) return;
    console.log(`[Gumi Sea] 상품 선택: ${productId}`);
    openProductPage(productId);
  });
});

// 텍스트 클릭 → 상품 페이지
textNodes.forEach(el => {
  el.addEventListener('click', () => {
    const productId = el.dataset.productId;
    if (!productId) return;
    openProductPage(productId);
  });
});

// 터치: hover 고착 방지
document.addEventListener('touchstart', () => {
  if (isHovered) { isHovered = false; removeHoverVisuals(false); if (!isInteracting()) scheduleResume(); }
}, { passive: true });

// 키보드: 히어로 영역 포커스 시 방향키
const heroEl = document.querySelector('.hero');
heroEl.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const tag = (document.activeElement?.tagName ?? '').toLowerCase();
  if (['input', 'textarea', 'select'].includes(tag)) return;
  if (document.activeElement?.isContentEditable) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); handleManualSlide( 1, 'keyboard'); }
  else if (e.key === 'ArrowLeft')  { e.preventDefault(); handleManualSlide(-1, 'keyboard'); }
});

document.addEventListener('visibilitychange', handleVisibilityChange);
window.addEventListener('pagehide', () => { stopAutoplay(); stopResumeTimer(); });

// ─────────────────────────────────────────────────────────
//  상품 페이지 전환
// ─────────────────────────────────────────────────────────
const PRODUCT_PAGE_MAP = {
  'goldie-pop':  'goldie-page',
  'octo-pop':    'octo-page',
  'tangy-blue':  'tangyblue-page',
  'seahorsey':   'seahorsey-page',
  'tutti-fish':  'tuttifish-page',
};

function openProductPage(productId) {
  const pageId = PRODUCT_PAGE_MAP[productId];
  if (!pageId) return;
  const page = document.getElementById(pageId);
  if (!page) return;

  stopAutoplay();
  document.body.style.overflow = 'hidden';

  // 페이지 페이드인
  page.classList.add('is-visible');
  page.removeAttribute('aria-hidden');

  // 짧은 딜레이 후 원 확장 시작
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      page.classList.add('is-expanded');
    });
  });
}

function closeProductPage(pageId) {
  const page = document.getElementById(pageId);
  if (!page) return;

  // 페이지 페이드아웃
  page.classList.remove('is-visible');

  // 페이지가 가려진 후 원과 클래스 초기화 (애니메이션 없이)
  setTimeout(() => {
    const circle = page.querySelector('.gp-bg-circle');
    if (circle) circle.style.transition = 'none';
    page.classList.remove('is-expanded');
    void page.offsetWidth;
    if (circle) circle.style.transition = '';
    page.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (CAROUSEL_CONFIG.autoplayEnabled) startAutoplay();
  }, 300);
}

document.getElementById('goldie-back').addEventListener('click',     () => closeProductPage('goldie-page'));
document.getElementById('octo-back').addEventListener('click',       () => closeProductPage('octo-page'));
document.getElementById('tangyblue-back').addEventListener('click',  () => closeProductPage('tangyblue-page'));
document.getElementById('seahorsey-back').addEventListener('click',  () => closeProductPage('seahorsey-page'));
document.getElementById('tuttifish-back').addEventListener('click',  () => closeProductPage('tuttifish-page'));

// ─────────────────────────────────────────────────────────
//  FUN #1 : 물고기 젤리 흔들림 (anime.js)
// ─────────────────────────────────────────────────────────
function wobbleGpFish(fish) {
  fish.style.animation = 'none';
  anime({
    targets: fish,
    keyframes: [
      { scaleX: 1.20, scaleY: 0.82, rotate: '-5deg' },
      { scaleX: 0.86, scaleY: 1.16, rotate:  '6deg' },
      { scaleX: 1.12, scaleY: 0.90, rotate: '-4deg' },
      { scaleX: 0.93, scaleY: 1.08, rotate:  '3deg' },
      { scaleX: 1.05, scaleY: 0.96, rotate: '-1deg' },
      { scaleX: 1.00, scaleY: 1.00, rotate:  '0deg' },
    ],
    duration: 680,
    easing: 'easeInOutSine',
    complete() { fish.style.animation = ''; },
  });
}

document.querySelectorAll('.gp-fish').forEach(fish => {
  fish.addEventListener('click', () => wobbleGpFish(fish));
});


// ─────────────────────────────────────────────────────────
//  상품 카드 클릭 → 상품 페이지
// ─────────────────────────────────────────────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    const productId = card.dataset.productId;
    if (productId) openProductPage(productId);
  });
});

// ─────────────────────────────────────────────────────────
//  무한 자동 슬라이더 — 카드 클로닝
// ─────────────────────────────────────────────────────────
(function initInfiniteSlider() {
  const track = document.querySelector('.cards-track');
  if (!track) return;

  const originals = [...track.querySelectorAll('.product-card')];
  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.addEventListener('click', () => {
      const productId = clone.dataset.productId;
      if (productId) openProductPage(productId);
    });
    track.appendChild(clone);
  });
})();

// ─────────────────────────────────────────────────────────
//  전역 노출 (콘솔 테스트)
// ─────────────────────────────────────────────────────────
window.nextSlide     = nextSlide;
window.previousSlide = previousSlide;
window.changeSlide   = changeSlide;
window.startAutoplay = startAutoplay;
window.stopAutoplay  = stopAutoplay;

// ─────────────────────────────────────────────────────────
//  MOBILE NAV WHEEL — 원호(arc) 인터랙티브 휠
//
//  원 파라미터:
//    R  = 380px  (반지름)
//    CX = 320px  (원 중심까지의 왼쪽 거리, 화면 바깥)
//    중심 x = -320px, active item text at x = -320+380 = 60px
//    ±STEP°: x = -320+380·cos(STEP°)≈37px, y = ±380·sin(STEP°)≈±130px
// ─────────────────────────────────────────────────────────
const MNAV = {
  R:       380,   // 원 반지름 (px)
  CX:      200,   // 원 중심 = 화면 왼쪽으로 CX px 밖
  STEP:     20,   // 항목 간 각도 (deg)
  FONT_A:   48,   // 활성 fontSize (px)
  FONT_I:   22,   // 비활성 fontSize (px)
  FISH_A:   76,   // 활성 물고기 높이 (px)
  FISH_I:   44,   // 비활성 물고기 높이 (px)
  FISH_LA: -84,   // 활성 물고기 left (px)
  FISH_LI: -50,   // 비활성 물고기 left (px)
  OPA_A:   1.00,  // 활성 opacity
  OPA_I:   0.65,  // 비활성 opacity
  DUR:      380,  // 스냅 애니메이션 (ms)
  DRAG_MIN:   8,  // 드래그 판정 최소 px
};

// CONTACT=-20°, SHOP=0°(center), OUR STORY=+20°
const mnavEls = [
  document.querySelector('.mnav-contact'),
  document.querySelector('.mnav-shop'),
  document.querySelector('.mnav-story'),
];
const mnavBaseAngles = [-MNAV.STEP, 0, MNAV.STEP];

let mnavOffset   = 0;
let mnavDragY0   = null;
let mnavOffset0  = 0;
let mnavDragging = false;
let mnavSnapRAF  = null;

function mnavPos(deg) {
  const r = deg * Math.PI / 180;
  return { x: -MNAV.CX + MNAV.R * Math.cos(r), y: MNAV.R * Math.sin(r) };
}

function mnavApply(offset) {
  mnavEls.forEach((el, i) => {
    if (!el) return;
    const angle = mnavBaseAngles[i] + offset;
    const { x, y } = mnavPos(angle);
    const dist = Math.min(Math.abs(angle) / MNAV.STEP, 1);

    const opacity  = MNAV.OPA_A  - dist * (MNAV.OPA_A  - MNAV.OPA_I);
    const fontSize = MNAV.FONT_A - dist * (MNAV.FONT_A - MNAV.FONT_I);
    const fishH    = MNAV.FISH_A - dist * (MNAV.FISH_A - MNAV.FISH_I);
    const fishL    = MNAV.FISH_LA - dist * (MNAV.FISH_LA - MNAV.FISH_LI);

    el.style.transform = `translateX(${x.toFixed(1)}px) translateY(calc(-50% + ${y.toFixed(1)}px))`;
    el.style.opacity   = opacity.toFixed(3);

    const span = el.querySelector('span');
    if (span) span.style.fontSize = `${Math.round(fontSize)}px`;

    const fish = el.querySelector('.mnav-fish');
    if (fish) {
      fish.style.height = `${Math.round(fishH)}px`;
      fish.style.left   = `${Math.round(fishL)}px`;
    }
  });
}

function mnavSnapTo(from, to) {
  if (mnavSnapRAF) cancelAnimationFrame(mnavSnapRAF);
  const start = performance.now();
  (function tick(now) {
    const t     = Math.min((now - start) / MNAV.DUR, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    mnavOffset  = from + (to - from) * eased;
    mnavApply(mnavOffset);
    mnavSnapRAF = t < 1 ? requestAnimationFrame(tick) : null;
    if (t >= 1) mnavOffset = to;
  })(start);
}

function mnavElastic(v, lo, hi) {
  if (v > hi) return hi + (v - hi) * 0.3;
  if (v < lo) return lo + (v - lo) * 0.3;
  return v;
}

function mnavReset() {
  if (mnavSnapRAF) { cancelAnimationFrame(mnavSnapRAF); mnavSnapRAF = null; }
  mnavOffset   = 0;
  mnavDragging = false;
  mnavDragY0   = null;
  mnavApply(0);
}

if (mobileNav) {
  mobileNav.addEventListener('touchstart', e => {
    if (mnavSnapRAF) { cancelAnimationFrame(mnavSnapRAF); mnavSnapRAF = null; }
    mnavDragY0  = e.touches[0].clientY;
    mnavOffset0 = mnavOffset;
    mnavDragging = false;
  }, { passive: true });

  mobileNav.addEventListener('touchmove', e => {
    if (mnavDragY0 === null) return;
    const dy = e.touches[0].clientY - mnavDragY0;
    if (!mnavDragging && Math.abs(dy) > MNAV.DRAG_MIN) mnavDragging = true;
    if (!mnavDragging) return;
    e.preventDefault();
    const degPerPx = 180 / (Math.PI * MNAV.R);  // ≈ 0.15 deg/px
    const raw = mnavOffset0 + dy * degPerPx;
    mnavOffset = mnavElastic(raw, -MNAV.STEP, MNAV.STEP);
    mnavApply(mnavOffset);
  }, { passive: false });

  mobileNav.addEventListener('touchend', () => {
    mnavDragY0 = null;
    if (!mnavDragging) return;
    mnavDragging = false;
    const snap   = Math.round(mnavOffset / MNAV.STEP) * MNAV.STEP;
    const target = Math.max(-MNAV.STEP, Math.min(MNAV.STEP, snap));
    mnavSnapTo(mnavOffset, target);
  }, { passive: true });
}

// 초기 배치 적용
mnavApply(0);

// ─────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────
syncConfigToCSSVars();
renderInitialProducts();
preloadProductImages().then(() => {
  console.log('[Gumi Sea] preload 완료 → 자동 반복 시작');
  startAutoplay();
});
