import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../lib/scrollBus';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    name: 'Alpesh Patel',
    role: 'Founder',
    video: 'https://framerusercontent.com/assets/Z9aWRVr5X63AuwLKWabimWDzgg.mp4',
    thumb:
      'https://framerusercontent.com/images/UkbugPjKPK82W1biLwkYM009E.jpg?width=683&height=1024',
  },
  {
    name: 'Justin',
    role: 'Founder',
    video: 'https://framerusercontent.com/assets/FcIo3ql8TZ7kXJaHIJHsEqu8rE.mp4',
    thumb:
      'https://framerusercontent.com/images/hWFo1OqmGnM2jcBA8JRFiQyv3uk.jpg?width=729&height=767',
  },
  {
    name: 'Reyna Harilela',
    role: 'Founder',
    video: 'https://framerusercontent.com/assets/uZSb7Tqla5Ce8WxEBNDLbaaAJFY.mp4',
    thumb:
      'https://framerusercontent.com/images/W4zDBl8UI5sM3OF1cVaea3hBAss.jpg?scale-down-to=512&width=1024&height=1024',
  },
];

/** Wrap index distance into shortest signed offset for a circular carousel */
function carouselOffset(index, active, total) {
  let d = index - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M8 5.14v13.72L19 12 8 5.14z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const TeamSection = ({ roundedTop = false }) => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const lightboxRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const closeBtnRef = useRef(null);
  const counter1Ref = useRef(null);
  const counter2Ref = useRef(null);
  const counter3Ref = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const lightboxOpen = lightboxIndex != null;
  const lightboxSlide = lightboxOpen ? SLIDES[lightboxIndex] : null;

  // Auto-advance every 5s (pauses while lightbox open)
  useEffect(() => {
    if (paused || lightboxOpen) return undefined;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, active, lightboxOpen]);

  const closeLightbox = useCallback(() => {
    const overlay = lightboxRef.current;
    const video = lightboxVideoRef.current;
    const closeBtn = closeBtnRef.current;
    video?.pause();

    if (!overlay) {
      setLightboxIndex(null);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setLightboxIndex(null),
    });
    if (closeBtn) {
      tl.to(closeBtn, { scale: 0.85, opacity: 0, duration: 0.18, ease: 'power2.in' }, 0);
    }
    tl.to(
      overlay.querySelector('[data-lightbox-panel]'),
      { scale: 0.96, opacity: 0, y: 8, duration: 0.2, ease: 'power2.in' },
      0
    );
    tl.to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0);
  }, []);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setPaused(true);
  }, []);

  // Lock scroll without body position:fixed (that jumps Lenis / scrollY to top)
  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const lenis = getLenis();
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    try {
      lenis?.stop?.();
    } catch {
      /* ignore */
    }

    const blockScroll = (e) => {
      if (e.target?.closest?.('[data-lightbox-panel]')) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      try {
        lenis?.start?.();
      } catch {
        /* ignore */
      }
      setPaused(false);
    };
  }, [lightboxOpen]);

  // Enter animation + play video when lightbox mounts
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const overlay = lightboxRef.current;
    const panel = overlay?.querySelector('[data-lightbox-panel]');
    const closeBtn = closeBtnRef.current;
    const video = lightboxVideoRef.current;
    if (!overlay || !panel) return undefined;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(panel, { scale: 0.94, opacity: 0, y: 12 });
    if (closeBtn) gsap.set(closeBtn, { scale: 0.7, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(overlay, { opacity: 1, duration: 0.22, ease: 'power2.out' })
      .to(panel, { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, 0.04)
      .to(closeBtn, { scale: 1, opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.08);

    const play = video?.play();
    if (play?.catch) play.catch(() => {});

    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, lightboxIndex, closeLightbox]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const headings = root.querySelectorAll('.team-heading');

      if (headings.length) {
        gsap.fromTo(
          headings,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headings[0],
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 80, opacity: 0, rotationX: 15 },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      const animateCounter = (ref, target, prefix = '', suffix = '', padZero = false) => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current || root,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            if (!ref.current) return;
            let currentVal = Math.floor(obj.val);
            let displayVal = currentVal.toString();
            if (padZero && currentVal < 10) {
              displayVal = `0${currentVal}`;
            }
            ref.current.innerText = `${prefix}${displayVal}${suffix}`;
          },
        });
      };

      animateCounter(counter1Ref, 35);
      animateCounter(counter2Ref, 6, '', '', true);
      animateCounter(counter3Ref, 5, '', '+');
    }, root);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className={`relative w-full pt-5 pb-12 md:py-32 md:mt-5 ${roundedTop ? 'rounded-t-[40px] md:rounded-t-[80px]' : ''}`}
      style={{
        backgroundColor: '#000000',
        zIndex: roundedTop ? 20 : 1,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col mb-6 md:mb-24 max-w-[800px] mx-auto items-center md:items-stretch text-center md:text-left">
          <h2
            className="team-heading text-white font-medium tracking-[-0.04em] leading-[1.1] whitespace-nowrap"
            style={{ fontFamily: 'Switzer, sans-serif', fontSize: 'clamp(28px, 8.5vw, 84px)' }}
          >
            Founders Who
          </h2>
          <h2
            className="team-heading text-white font-medium tracking-[-0.04em] leading-[1.1] whitespace-nowrap self-center md:self-end md:pr-12 mt-1 md:mt-4"
            style={{ fontFamily: 'Switzer, sans-serif', fontSize: 'clamp(28px, 8.5vw, 84px)' }}
          >
            Trust BlueHawk.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-center">
          <div className="md:col-span-5 w-full overflow-x-hidden overflow-y-visible">
            <div
              className="relative mx-auto w-full h-[78vw] max-h-[480px] min-h-[340px] md:h-[420px] md:max-h-none select-none"
              style={{
                perspective: '1100px',
                perspectiveOrigin: '50% 50%',
              }}
            >
              {SLIDES.map((slide, index) => {
                const offset = carouselOffset(index, active, SLIDES.length);
                const abs = Math.abs(offset);
                const isMain = offset === 0;

                let translateX = 0;
                let translateZ = 0;
                let scale = 1;
                let opacity = 1;
                let z = 10;

                if (isMain) {
                  translateX = 0;
                  translateZ = 40;
                  scale = 1;
                  opacity = 1;
                  z = 40;
                } else if (offset === 1) {
                  translateX = 62;
                  translateZ = -160;
                  scale = 0.62;
                  opacity = 0.9;
                  z = 20;
                } else if (offset === -1) {
                  translateX = -62;
                  translateZ = -160;
                  scale = 0.62;
                  opacity = 0.9;
                  z = 20;
                } else {
                  translateX = offset > 0 ? 82 : -82;
                  translateZ = -280;
                  scale = 0.48;
                  opacity = 0.35;
                  z = 5;
                }

                if (abs > 2) opacity = 0;

                return (
                  <button
                    type="button"
                    key={slide.video}
                    aria-label={`Play ${slide.name} video`}
                    onClick={() => openLightbox(index)}
                    className="absolute left-1/2 top-1/2 w-[58%] max-w-[260px] md:w-[62%] md:max-w-[280px] aspect-[3/4] border-0 p-0 bg-transparent cursor-pointer"
                    style={{
                      transform: `translate3d(-50%, -50%, 0) translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`,
                      transformStyle: 'preserve-3d',
                      transition:
                        'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease',
                      opacity,
                      zIndex: z,
                      pointerEvents: abs <= 1 ? 'auto' : 'none',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-[22px] shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-black pointer-events-none">
                      <img
                        src={slide.thumb}
                        alt={slide.name}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.75) 100%)',
                        }}
                      />

                      <span
                        className="absolute top-3.5 right-3.5 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white"
                        style={{
                          background: 'rgba(255,255,255,0.22)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          paddingLeft: 2,
                        }}
                        aria-hidden
                      >
                        <PlayIcon />
                      </span>

                      <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                        <p
                          className="m-0 text-white text-[14px] md:text-[16px] font-semibold leading-tight tracking-tight"
                          style={{ fontFamily: 'Switzer, sans-serif' }}
                        >
                          {slide.name}
                        </p>
                        <p
                          className="m-0 mt-0.5 text-white/70 text-[12px] md:text-[13px] font-medium leading-tight"
                          style={{ fontFamily: 'Switzer, sans-serif' }}
                        >
                          {slide.role}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-7 flex justify-end">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.05)] w-full max-w-[600px] p-8 md:p-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center justify-between pt-12 pb-5 ">
                <span className="text-[#111] text-[16px] md:text-[30px] font-medium tracking-tight">
                  Team Members
                </span>
                <span
                  ref={counter1Ref}
                  className="text-[#23b3e8] text-[24px] md:text-[35px] font-medium min-w-[50px] text-right"
                >
                  0
                </span>
              </div>
              <div className="w-full h-[1px] bg-[#808385]"></div>

              <div className="flex items-center justify-between pt-12 pb-5">
                <span className="text-[#111] text-[16px] md:text-[30px] font-medium tracking-tight">
                  Core Disciplines
                </span>
                <span
                  ref={counter2Ref}
                  className="text-[#23b3e8] text-[24px] md:text-[35px] font-medium min-w-[50px] text-right"
                >
                  00
                </span>
              </div>
              <div className="w-full h-[1px] bg-[#808385]"></div>

              <div className="flex items-center justify-between pt-12 pb-5">
                <span className="text-[#111] text-[16px] md:text-[30px] font-medium tracking-tight">
                  Combined Years Of Experience
                </span>
                <span
                  ref={counter3Ref}
                  className="text-[#23b3e8] text-[24px] md:text-[35px] font-medium min-w-[50px] text-right"
                >
                  0+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen &&
        lightboxSlide &&
        createPortal(
          <div
            ref={lightboxRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${lightboxSlide.name} video`}
          >
            <button
              type="button"
              aria-label="Close video"
              className="absolute inset-0 border-0 cursor-pointer bg-black/75"
              onClick={closeLightbox}
            />

            <div
              data-lightbox-panel
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close"
                onClick={closeLightbox}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white border-0 cursor-pointer shrink-0 bg-white/20"
              >
                <CloseIcon />
              </button>

              <div className="relative w-[min(72vw,320px)] sm:w-[min(42vw,360px)] aspect-[9/16] max-h-[min(78vh,640px)] overflow-hidden rounded-[20px] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
                <video
                  ref={lightboxVideoRef}
                  key={lightboxSlide.video}
                  src={lightboxSlide.video}
                  poster={lightboxSlide.thumb}
                  controls
                  playsInline
                  autoPlay
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default TeamSection;
