import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import chatgptImg from '../assets/tech-icons/chatgpt.jpg';
import claudeImg from '../assets/tech-icons/claude.jpg';
import cursorImg from '../assets/tech-icons/cursor.jpg';
import codexImg from '../assets/tech-icons/codex.jpg';
import geminiImg from '../assets/tech-icons/gemini.jpg';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { name: 'ChatGPT', img: chatgptImg },
  { name: 'Claude', img: claudeImg },
  { name: 'Cursor', img: cursorImg },
  { name: 'Codex', img: codexImg },
  { name: 'Gemini', img: geminiImg },
];

const ToolsSection = () => {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const headings = root.querySelectorAll('.tools-heading');
      const icons = root.querySelectorAll('.tool-icon');

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
          },
        );
      }

      if (icons.length) {
        gsap.fromTo(
          icons,
          { opacity: 0, scale: 0.6, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: icons[0],
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="relative w-full py-10 md:py-32"
      style={{ backgroundColor: '#040617' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col mb-10 md:mb-16">
          <p
            className="tools-heading mb-4 md:mb-6 text-center md:text-left text-[13px] md:text-[15px] font-semibold tracking-[0.18em] uppercase text-white/70"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            Our Process
          </p>
          <p
            className="mb-6 md:mb-10 max-w-2xl text-center md:text-left text-[16px] md:text-[22px] font-medium tracking-tight text-white/80"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            From your idea to launch—powered by the tools we ship with every day. Fast, efficient, and performance-focused.
          </p>
          <div className="overflow-hidden mb-3 md:mb-8 text-center md:text-left">
            <h2
              className="tools-heading text-white font-medium tracking-tight leading-[1.05] pb-[0.12em]"
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: 'clamp(56px, 9vw, 110px)',
                letterSpacing: '-0.04em',
              }}
            >
              Our Process &
            </h2>
          </div>

          <div
            className="flex flex-wrap items-end justify-center gap-x-[12px] gap-y-3 md:gap-[23px] my-0 md:my-2 relative z-10 min-h-[56px] md:h-[120px] pb-1 md:pb-0"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {tools.map((tool, index) => {
              const isHovered = hoveredIndex === index;
              const isAdjacent =
                hoveredIndex === index - 1 || hoveredIndex === index + 1;
              const isFar = hoveredIndex !== null && !isHovered && !isAdjacent;

              const baseSize = 'w-[48px] h-[48px] md:w-[73px] md:h-[73px]';
              const adjacentSize = 'w-[56px] h-[56px] md:w-[84px] md:h-[84px]';
              const hoveredSize = 'w-[64px] h-[64px] md:w-[104px] md:h-[104px]';

              const currentSizeClass = isHovered
                ? hoveredSize
                : isAdjacent
                  ? adjacentSize
                  : baseSize;

              return (
                <div
                  key={tool.name}
                  className="tool-icon relative group flex flex-col items-center justify-end md:h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                >
                  <div
                    className={`${currentSizeClass} rounded-[14px] md:rounded-[22px] flex items-center justify-center cursor-pointer overflow-hidden bg-white`}
                    style={{
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isHovered
                        ? '0 16px 32px rgba(0,0,0,0.45)'
                        : isAdjacent
                          ? '0 8px 20px rgba(0,0,0,0.35)'
                          : '0 4px 12px rgba(0,0,0,0.25)',
                      transform: isHovered
                        ? 'translateY(-12px)'
                        : isAdjacent
                          ? 'translateY(-6px)'
                          : 'translateY(0)',
                      opacity: isFar ? 0.85 : 1,
                    }}
                  >
                    <img
                      src={tool.img}
                      alt={tool.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div
                    className="absolute top-full mt-3 pointer-events-none z-30"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isHovered
                        ? 'translateY(0) scale(1)'
                        : 'translateY(-10px) scale(0.95)',
                    }}
                  >
                    <span className="bg-[#123A6B] text-white text-[11px] font-bold py-[6px] px-[12px] rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.4)] border border-white/10 whitespace-nowrap tracking-wide">
                      {tool.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-0 overflow-hidden flex justify-center md:justify-end w-full mt-3 md:mt-8">
            <h2
              className="tools-heading text-white font-medium tracking-tight leading-[1.05] pb-[0.12em] text-center md:text-left"
              style={{
                fontFamily: 'Switzer, sans-serif',
                fontSize: 'clamp(56px, 9vw, 110px)',
                letterSpacing: '-0.04em',
              }}
            >
              Your Launch.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
