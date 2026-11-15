import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createImageMorph } from '../lib/imageMorph';
import { IMG } from '../lib/unsplash';

const heroCardImg = IMG.hero;
const heroCardSrcSet = IMG.heroSrcSet;
const saucedImg = IMG.work1;
const saucedSrcSet = IMG.work1SrcSet;
const jerseyImg = IMG.work2;
const jerseySrcSet = IMG.work2SrcSet;
const jersey2Img = IMG.work3;
const jersey2SrcSet = IMG.work3SrcSet;

gsap.registerPlugin(ScrollTrigger);

const WorkGrid = ({ heroImageRef }) => {
  const sectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card1ImageRef = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  const [morphComplete, setMorphComplete] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    let cleanup = null;

    const setup = () => {
      cleanup?.();
      cleanup = null;

      // Hero card is hidden on mobile — show grid image directly
      if (!mq.matches || !heroImageRef?.current || !card1Ref.current || !sectionRef.current) {
        setMorphComplete(true);
        return;
      }

      setMorphComplete(false);
      cleanup = createImageMorph({
        heroImg: heroImageRef.current,
        targetEl: card1Ref.current,
        triggerEl: sectionRef.current,
        cloneClass: 'workgrid-morph-clone',
        src: heroCardImg,
        alt: 'Vantage Project',
        start: 'top 90%',
        end: 'top 10%',
        scrub: 0.3,
        startRadius: 16,
        endRadius: 32,
        onCompleteChange: setMorphComplete,
      });
    };

    setup();
    mq.addEventListener('change', setup);
    return () => {
      mq.removeEventListener('change', setup);
      cleanup?.();
    };
  }, [heroImageRef]);

  // Scroll scrub animation: Images scale from small to large on scroll (same as ProjectsGrid)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current];
      cards.forEach((card) => {
        if (!card) return;

        gsap.set(card, { scale: 0.72, yPercent: 8, force3D: true });

        gsap.to(card, {
          scale: 1,
          yPercent: 0,
          force3D: true,
          ...(coarse
            ? { ease: 'power2.out', duration: 0.55 }
            : { ease: 'none' }),
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
            end: 'top 35%',
            invalidateOnRefresh: true,
            ...(coarse
              ? { toggleActions: 'play none none none' }
              : { scrub: 0.45 }),
          },
        });
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh(true);
    const onLoad = () => refresh();

    const images = section.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onLoad, { once: true });
    });

    requestAnimationFrame(refresh);
    const refreshTimers = [150, 600, 1200].map((ms) =>
      window.setTimeout(refresh, ms)
    );

    return () => {
      refreshTimers.forEach((id) => window.clearTimeout(id));
      images.forEach((img) => img.removeEventListener('load', onLoad));
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work-grid"
      data-snap-section
      className="relative z-20 pt-4 md:pt-16 pb-8 px-5 sm:px-6 md:px-10 lg:px-16 max-w-[1400px] mx-auto"

    >
      {/* 2x2 Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 justify-items-center">

        {/* Card 1 — Bluesio */}
        <Link
          ref={card1Ref}
          to="/projects/bluesio"
          className="w-[90%] max-w-[595px] h-[468px] sm:h-[585px] lg:h-[724px] rounded-[32px] relative overflow-hidden group cursor-pointer bg-[#0A0D14] will-change-transform origin-center block no-underline"
        >
          <img
            ref={card1ImageRef}
            src={heroCardImg}
            srcSet={heroCardSrcSet}
            sizes="(min-width: 768px) 45vw, 90vw"
            alt="Bluesio — Corporate Website"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ opacity: morphComplete ? 1 : 0 }}
          />
        </Link>

        {/* Card 2 — The Mindful Sleep Coach */}
        <Link
          ref={card2Ref}
          to="/projects/mindful-sleep-coach"
          className="w-[90%] max-w-[595px] h-[468px] sm:h-[585px] lg:h-[724px] rounded-[32px] relative overflow-hidden group cursor-pointer bg-[#0A0D14] will-change-transform origin-center block no-underline"
        >
          <img
            src={saucedImg}
            srcSet={saucedSrcSet}
            sizes="(min-width: 768px) 45vw, 90vw"
            alt="The Mindful Sleep Coach — Website Design"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Card 3 — HelloX */}
        <Link
          ref={card3Ref}
          to="/projects/hellox"
          className="w-[90%] max-w-[595px] h-[468px] sm:h-[585px] lg:h-[724px] rounded-[32px] relative overflow-hidden group cursor-pointer bg-[#0A0D14] will-change-transform origin-center block no-underline"
        >
          <img
            src={jerseyImg}
            srcSet={jerseySrcSet}
            sizes="(min-width: 768px) 45vw, 90vw"
            alt="HelloX Website — Design & Dev"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Card 4 — Grid Travel */}
        <Link
          ref={card4Ref}
          to="/projects/grid-travel"
          className="w-[90%] max-w-[595px] h-[468px] sm:h-[585px] lg:h-[724px] rounded-[32px] relative overflow-hidden group cursor-pointer bg-[#0A0D14] will-change-transform origin-center block no-underline"
        >
          <img
            src={jersey2Img}
            srcSet={jersey2SrcSet}
            sizes="(min-width: 768px) 45vw, 90vw"
            alt="Grid Travel — Travel App"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

      </div>
    </section>
  );
};

export default WorkGrid;

