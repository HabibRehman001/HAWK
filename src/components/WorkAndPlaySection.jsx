import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMG } from '../lib/unsplash';

gsap.registerPlugin(ScrollTrigger);

const images = IMG.play;

/** Wrap index distance into shortest signed offset for a circular carousel */
function carouselOffset(index, active, total) {
  let d = index - active;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

const WorkAndPlaySection = () => {
  const containerRef = useRef(null);
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    dragging: false,
    locked: false,
  });
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Mobile: auto-advance every 5s (pauses while dragging)
  useEffect(() => {
    if (!isMobile || paused) return undefined;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [isMobile, paused, active]);

  const goNext = () => setActive((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setActive((prev) => (prev - 1 + images.length) % images.length);

  const onPointerDown = (e) => {
    if (e.button != null && e.button !== 0) return;
    const d = dragRef.current;
    d.pointerId = e.pointerId;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.lastX = e.clientX;
    d.dragging = false;
    d.locked = false;
    setPaused(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      // Prefer horizontal carousel over vertical page scroll
      d.locked = Math.abs(dx) >= Math.abs(dy);
      if (!d.locked) return;
      d.dragging = true;
    }
    if (!d.dragging) return;
    d.lastX = e.clientX;
    e.preventDefault();
  };

  const endDrag = (e) => {
    const d = dragRef.current;
    if (d.pointerId != null && e.pointerId !== d.pointerId) return;
    const dx = d.lastX - d.startX;
    if (d.dragging && Math.abs(dx) > 40) {
      // Drag left → next (RTL); drag right → previous
      if (dx < 0) goNext();
      else goPrev();
    }
    d.pointerId = null;
    d.dragging = false;
    d.locked = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* already released */
    }
    setPaused(false);
  };

  // Desktop: stack → line → scatter, pinned scrub
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray(root.querySelectorAll('.scatter-image'));
      if (slides.length !== 4) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        gsap.set(slides, {
          xPercent: -50,
          yPercent: -50,
          left: '50%',
          top: '58%',
          x: 0,
          y: 0,
          scale: 0.88,
          rotation: 0,
          opacity: 1,
          force3D: true,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=160%',
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(slides[0], { x: () => -window.innerWidth * 0.28, rotation: -2, duration: 1 }, 'line')
          .to(slides[1], { x: () => -window.innerWidth * 0.1, rotation: 1, duration: 1 }, 'line')
          .to(slides[2], { x: () => window.innerWidth * 0.1, rotation: -1, duration: 1 }, 'line')
          .to(slides[3], { x: () => window.innerWidth * 0.28, rotation: 2, duration: 1 }, 'line');

        tl.to(
          slides[0],
          {
            x: () => -window.innerWidth * 0.34,
            y: () => -window.innerHeight * 0.06,
            scale: 1,
            rotation: -4,
            duration: 1.2,
          },
          'scatter'
        )
          .to(
            slides[1],
            {
              x: () => -window.innerWidth * 0.14,
              y: () => window.innerHeight * 0.12,
              scale: 1,
              rotation: 2,
              duration: 1.2,
            },
            'scatter'
          )
          .to(
            slides[2],
            {
              x: () => window.innerWidth * 0.14,
              y: () => -window.innerHeight * 0.1,
              scale: 1,
              rotation: 5,
              duration: 1.2,
            },
            'scatter'
          )
          .to(
            slides[3],
            {
              x: () => window.innerWidth * 0.34,
              y: () => window.innerHeight * 0.04,
              scale: 1,
              rotation: -2,
              duration: 1.2,
            },
            'scatter'
          );

        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-black text-white overflow-x-clip lg:overflow-x-clip">
      <div
        ref={containerRef}
        className="relative w-full lg:h-[100vh] min-h-0 lg:min-h-[100vh] h-auto flex flex-col items-center justify-start pt-10 md:pt-16 lg:pt-[18vh] pb-16 md:pb-24 lg:pb-0 overflow-visible lg:overflow-hidden text-white"
        style={{ color: '#ffffff' }}
      >
        <style>{`
          @media (min-width: 1024px) and (max-width: 1300px) {
            .scatter-image {
              width: 220px !important;
              height: 220px !important;
            }
          }
        `}</style>

        <h2
          className="relative z-10 text-center font-medium leading-[1.05] tracking-tight px-4"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontSize: 'clamp(40px, 8vw, 68px)',
            letterSpacing: '-0.04em',
            color: '#ffffff',
          }}
        >
          Ready to see what<br />your website could become?
        </h2>

        {/* —— Mobile / tablet: 3D depth carousel (RTL every 5s) ——
            Right (small, back in Z) → center (scale up) → left (scale down, back in Z) */}
        <div className="lg:hidden relative z-20 mt-8 mb-4 w-full overflow-x-hidden overflow-y-visible">
          <div
            className="relative mx-auto w-full h-[62vw] max-h-[360px] min-h-[260px] cursor-grab active:cursor-grabbing select-none"
            style={{
              perspective: '1000px',
              perspectiveOrigin: '50% 50%',
              touchAction: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {images.map((src, index) => {
              const offset = carouselOffset(index, active, images.length);
              const abs = Math.abs(offset);
              const isMain = offset === 0;

              // X: peek left/right · Z: sides sit deeper so they “come forward”
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
                // Entering from right — small, pushed back in Z
                translateX = 58;
                translateZ = -160;
                scale = 0.62;
                opacity = 0.9;
                z = 20;
              } else if (offset === -1) {
                // Exiting to left — shrink back into Z
                translateX = -58;
                translateZ = -160;
                scale = 0.62;
                opacity = 0.9;
                z = 20;
              } else {
                // Furthest back (next-in-line behind)
                translateX = offset > 0 ? 78 : -78;
                translateZ = -280;
                scale = 0.48;
                opacity = 0.35;
                z = 5;
              }

              if (abs > 2) opacity = 0;

              return (
                <div
                  key={src}
                  className="absolute left-1/2 top-1/2 w-[52%] max-w-[220px] aspect-square"
                  style={{
                    transform: `translate3d(-50%, -50%, 0) translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`,
                    transformStyle: 'preserve-3d',
                    transition:
                      'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.85s ease',
                    opacity,
                    zIndex: z,
                    pointerEvents: 'none',
                    willChange: 'transform, opacity',
                  }}
                >
                  <img
                    src={src}
                    alt={`Work and Play ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="w-full h-full object-cover rounded-[18px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] pointer-events-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* —— Desktop: scatter stage —— */}
        <div className="hidden lg:block absolute inset-0 z-20 pointer-events-none w-full overflow-hidden">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Work and Play ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="scatter-image absolute w-[300px] h-[300px] min-[1301px]:w-[320px] min-[1301px]:h-[320px] object-cover rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] will-change-transform"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkAndPlaySection;
