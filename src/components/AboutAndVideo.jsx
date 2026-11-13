import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TrustedBy from './TrustedBy';

gsap.registerPlugin(ScrollTrigger);

const AboutAndVideo = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      // Instant scrub on touch (tracks finger, reverses on scroll-back).
      // Soft scrub on desktop only.
      const scrubOpt = coarse ? true : 0.5;

      // 1. Heading reveal — word-level on mobile (fewer nodes), char on desktop
      const headingElement = headingRef.current;
      if (headingElement) {
        const text =
          'We turn ambitious ideas into scalable digital products businesses rely on.';
        headingElement.innerHTML = '';

        // Desktop-only indent — keeps mobile heading truly centered
        const spacer = document.createElement('span');
        spacer.className = 'hidden md:inline-block md:w-28 lg:w-36';
        spacer.setAttribute('aria-hidden', 'true');
        headingElement.appendChild(spacer);

        const words = text.split(/\s+/).filter(Boolean);
        const animTargets = [];

        words.forEach((word) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'inline-block mr-[0.28em] whitespace-nowrap';

          if (coarse) {
            wordSpan.classList.add('about-heading-unit');
            wordSpan.style.opacity = '0.15';
            wordSpan.style.color = '#FFFFFF';
            wordSpan.textContent = word;
            animTargets.push(wordSpan);
          } else {
            for (const char of word) {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              charSpan.className = 'about-heading-char about-heading-unit';
              charSpan.style.opacity = '0.15';
              charSpan.style.color = '#FFFFFF';
              wordSpan.appendChild(charSpan);
              animTargets.push(charSpan);
            }
          }
          headingElement.appendChild(wordSpan);
        });

        gsap.to(animTargets, {
          opacity: 1,
          stagger: coarse ? 0.04 : 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: headingElement,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: scrubOpt,
          },
        });
      }

      // 2. About us paragraph reveal (same pattern — reverses on scroll-back)
      const paraElement = paragraphRef.current;
      if (paraElement) {
        paraElement.innerHTML = '';

        const bodyText =
          "Your business doesn't need another pretty website. It needs a digital system that attracts attention, builds trust, and drives sales. BlueHawk crafts conversion-focused websites, apps, and platforms built for real-world performance.";

        const animTargets = [];
        const segWords = bodyText.split(/\s+/).filter(Boolean);
        segWords.forEach((word) => {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'inline-block mr-[0.28em] whitespace-nowrap';

          if (coarse) {
            wordSpan.classList.add('about-para-unit');
            wordSpan.style.opacity = '0.2';
            wordSpan.style.fontWeight = '500';
            wordSpan.style.color = '#FFFFFF';
            wordSpan.textContent = word;
            animTargets.push(wordSpan);
          } else {
            for (const char of word) {
              const charSpan = document.createElement('span');
              charSpan.textContent = char;
              charSpan.className = 'about-para-char about-para-unit';
              charSpan.style.opacity = '0.2';
              charSpan.style.fontWeight = '500';
              charSpan.style.color = '#FFFFFF';
              wordSpan.appendChild(charSpan);
              animTargets.push(charSpan);
            }
          }
          paraElement.appendChild(wordSpan);
        });

        gsap.to(animTargets, {
          opacity: 1,
          stagger: coarse ? 0.025 : 0.01,
          ease: 'none',
          scrollTrigger: {
            trigger: paraElement,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: scrubOpt,
          },
        });
      }

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="about-us"
      data-snap-section
      className="relative z-10 w-full bg-transparent overflow-hidden pt-6 md:pt-16 pb-8 md:pb-16"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* (All Work) Label */}
        <div className="w-full text-center mb-8 sm:mb-10 md:mb-14">
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-[0.12em] text-[#25A9E0] transition-transform duration-300 hover:scale-95 cursor-pointer pb-[0.1em] no-underline"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(42px, 6.5vw, 91px)',
              lineHeight: '1.13',
              letterSpacing: '-3.4px',
              backgroundImage:
                'linear-gradient(to right, rgba(37, 169, 224, 1) 0%, rgba(37, 169, 224, 0.45) 60%, rgba(37, 169, 224, 0) 100%)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left bottom',
              backgroundSize: '100% 3.5px',
            }}
          >
            <span>Our Work</span>
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0 translate-y-[-0.06em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-1"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      <TrustedBy />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 mb-0">
        {/* Large Statement Heading */}
        <h3
          ref={headingRef}
          className="text-white text-center md:text-left max-w-[1300px] mb-8 md:mb-16 mx-auto md:mx-0"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(36px, 5.8vw, 91px)',
            lineHeight: '1.15',
            letterSpacing: '-0.035em',
          }}
        >
          <span className="hidden md:inline-block md:w-28 lg:w-36" aria-hidden="true" />
          Built for ambitious businesses ready to look the part.
        </h3>

        {/* Bottom Split Description Grid */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16">
          {/* Left Column: About Paragraph & CTA Button */}
          <div className="w-full lg:max-w-[740px] flex flex-col gap-6 md:gap-10 items-center lg:items-start px-2 sm:px-0">
            <div
              ref={paragraphRef}
              className="w-full text-center md:text-left text-[#9ca3af]"
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(18px, 1.85vw, 26px)',
                lineHeight: '1.45',
                letterSpacing: '-0.02em',
              }}
            >
              Your business doesn&apos;t need another pretty website. It needs a digital system that attracts attention, builds trust, and drives sales. BlueHawk crafts conversion-focused websites, apps, and platforms built for real-world performance.
            </div>

            {/* Figma Pixel-Perfect Button */}
            <div>
              <a
                href="https://calendly.com/saarang-bluehawk/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-[15px] text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer no-underline"
                style={{
                  width: '223.65px',
                  height: '52.88px',
                  borderRadius: '15px',
                  background: '#25A9E0',
                  boxShadow: '0 4px 20px rgba(37, 169, 224, 0.3)',
                  fontFamily: 'Switzer, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '30px',
                  letterSpacing: '-0.5px',
                }}
              >
                {/* Arrow Icon 19.08px x 19.08px */}
                <svg
                  width="19.08"
                  height="19.08"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Book a call</span>
              </a>
            </div>
          </div>

          {/* Right Column: Secondary Description */}
          <div className="w-full lg:max-w-[340px] lg:pt-2">
            <p
              className="text-[#9ca3af] text-center lg:text-left"
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontWeight: 500,
                fontSize: 'clamp(16px, 1.45vw, 26px)',
                lineHeight: '1.4',
                letterSpacing: '-0.02em',
              }}
            >
              We&apos;re modular, sleek, and scalable. We give your brand the look it deserves to attract the high-quality customers and talent you need to reach your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAndVideo;
