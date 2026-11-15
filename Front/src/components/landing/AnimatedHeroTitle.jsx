import { forwardRef, useLayoutEffect, useRef } from 'react';

const TITLE_SIZES = {
  xl: 'clamp(40px, 12vw, 200px)',
  lg: 'clamp(2.5rem, 10vw, 11rem)',
};

const FIT_MAX_PX = 180;
const FIT_MIN_PX = 28;
/** Leave a little breathing room inside the content box. */
const FIT_INSET_PX = 8;

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') ref(node);
      else ref.current = node;
    });
  };
}

function fitTitleToContainer(el) {
  if (!el || typeof window === 'undefined') return;

  const parent = el.parentElement;
  const available = parent?.clientWidth || window.innerWidth;
  const target = Math.max(available - FIT_INSET_PX, FIT_MIN_PX);

  // Measure natural width unconstrained, then scale to the content box.
  const prevMax = el.style.maxWidth;
  const prevWhiteSpace = el.style.whiteSpace;
  el.style.maxWidth = 'none';
  el.style.whiteSpace = 'nowrap';
  el.style.fontSize = `${FIT_MAX_PX}px`;

  const measured = el.scrollWidth;
  el.style.maxWidth = prevMax;
  el.style.whiteSpace = prevWhiteSpace;

  if (!measured) return;

  const next = Math.max(
    FIT_MIN_PX,
    Math.min(FIT_MAX_PX, (target / measured) * FIT_MAX_PX),
  );
  el.style.fontSize = `${next}px`;
}

/**
 * Per-letter hover bold — same as Home hero heading.
 * Single-line titles auto-size to the parent content width (left-aligned).
 */
const AnimatedHeroTitle = forwardRef(function AnimatedHeroTitle(
  { text, size = 'lg', className = '', fitViewport = true },
  ref
) {
  const localRef = useRef(null);
  const hasBreaks = text.includes('\n');
  const shouldFit = fitViewport && !hasBreaks;

  useLayoutEffect(() => {
    const el = localRef.current;
    if (!el || !shouldFit) return undefined;

    const run = () => fitTitleToContainer(el);
    run();

    const parent = el.parentElement;
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(run)
        : null;
    if (parent) ro?.observe(parent);
    else ro?.observe(document.documentElement);
    window.addEventListener('resize', run);

    document.fonts?.ready?.then(run);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', run);
    };
  }, [text, shouldFit, size, className]);

  return (
    <h1
      ref={mergeRefs(localRef, ref)}
      className={`leading-[0.9] tracking-[-0.04em] text-white text-left w-full max-w-full ${
        hasBreaks ? '' : 'whitespace-nowrap'
      } ${className}`}
      style={{
        fontFamily: 'Switzer, sans-serif',
        fontSize: shouldFit
          ? `${FIT_MAX_PX}px`
          : TITLE_SIZES[size] || size || TITLE_SIZES.lg,
        textAlign: 'left',
      }}
    >
      {text.split('').map((char, i) =>
        char === '\n' ? (
          <br key={`br-${i}`} />
        ) : (
          <span
            key={`${char}-${i}`}
            className="inline-block font-semibold cursor-default transition-[font-weight] duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ fontWeight: 600 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.fontWeight = '800';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.fontWeight = '600';
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      )}
    </h1>
  );
});

export default AnimatedHeroTitle;
