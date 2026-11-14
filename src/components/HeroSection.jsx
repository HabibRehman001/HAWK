import PageHero, { HERO_SECTION_CLASS, HERO_INNER_CLASS } from './landing/PageHero';
import { lazy, Suspense, useEffect, useState } from 'react';

import { IMG } from '../lib/unsplash';

// Same URL as the HTML <link rel="preload"> — no hashed chunk delay.
const HERO_IMG = IMG.hero;
const HERO_IMG_SRCSET = IMG.heroSrcSet;

const HeroWaves = lazy(() => import('./HeroWaves'));

const WAVE_FALLBACK = {
  width: '100%',
  height: '100%',
  background:
    'radial-gradient(ellipse at 50% 60%, rgba(21, 101, 216, 0.45) 0%, #000000 70%)',
};

function DeferredHeroWaves() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId = null;
    let timeoutId = null;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enable, 200);
    }

    return () => {
      cancelled = true;
      if (idleId != null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) {
    return <div aria-hidden="true" style={WAVE_FALLBACK} />;
  }

  return (
    <Suspense fallback={<div aria-hidden="true" style={WAVE_FALLBACK} />}>
      <HeroWaves />
    </Suspense>
  );
}

const HeroSection = ({ heroImageRef }) => {
  return (
    <section
      id="home"
      data-snap-section
      className={HERO_SECTION_CLASS}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DeferredHeroWaves />
      </div>
      <div className={HERO_INNER_CLASS}>
        <PageHero
          title="BlueHawk"
          layout="split"
          spread
          showDot
          hideChildrenOnMobile
          className="md:flex-1"
          subtitle="Your Website Should Close Deals While You Sleep."
        >
          <a
            href="https://cal.com/blue-hawke/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[430.82px] h-[216.86px] rounded-[15px] p-[10px] relative overflow-hidden group cursor-pointer flex flex-row items-stretch no-underline"
            style={{
              width: '430.82px',
              maxWidth: '100%',
              height: '216.86px',
              background: '#0A0A0A',
              border: '1px solid #FFFFFF66',
              borderRadius: '15px',
              opacity: 1,
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, transparent 30%, rgba(26, 122, 248, 0.05) 50%, transparent 70%)',
              }}
            />

            <div className="flex flex-col justify-between flex-1 relative z-10 pl-3 pr-2 py-1.5 h-full">
              <div className="flex flex-col">
                <span
                  className="text-white select-none"
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontWeight: 500,
                    fontSize: '20px',
                    lineHeight: '26px',
                    letterSpacing: '-0.02em',
                    wordSpacing: '0.15em',
                    verticalAlign: 'middle',
                  }}
                >
                  Book a call
                </span>
                <h3
                  className="mt-2.5 select-none"
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '26px',
                    letterSpacing: '-1px',
                    verticalAlign: 'middle',
                    color: '#FFFFFF66',
                  }}
                >
                  Premium websites for startups, SaaS, AI companies, and ambitious brands ready to scale.
                </h3>
              </div>

              <div className="flex justify-start mt-auto z-20 relative">
                <div
                  className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center transition-all duration-300 group-hover:scale-105 hover:!scale-110"
                  style={{
                    background: '#1399e8',
                    boxShadow: '0 2px 10px rgba(19, 153, 232, 0.3)',
                  }}
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path
                      d="M4 12L12 4M12 4H5.33M12 4V10.67"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="relative flex-shrink-0 z-30 overflow-hidden"
              style={{
                width: '162.16px',
                height: '197.3px',
                borderRadius: '15px',
              }}
            >
              <img
                ref={heroImageRef}
                src={HERO_IMG}
                srcSet={HERO_IMG_SRCSET}
                sizes="162px"
                alt="Our work - Designing a bold voice"
                width={162}
                height={197}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 z-50 relative will-change-transform origin-center"
                style={{
                  width: '162.16px',
                  height: '197.3px',
                  borderRadius: '15px',
                  opacity: 1,
                }}
              />
            </div>
          </a>
        </PageHero>
      </div>

      {/* Bottom gradient fade for smooth transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,36,72,0.55) 55%, #000000 100%)',
        }}
      />
    </section>
  );
};

export default HeroSection;
