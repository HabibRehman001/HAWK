import AnimatedHeroTitle from './AnimatedHeroTitle';

/** Shared hero typography — keep every page hero on the same tokens. */
export const HERO_TITLE_SIZE = 'clamp(48px, 12vw, 180px)';
export const HERO_TITLE_CLASS = '!tracking-[-1.4px] my-auto';
/** Shared hero subtitle — same size/weight on Home, Services, About, etc. */
export const HERO_SUBTITLE_CLASS =
  'text-[24px] sm:text-[28px] lg:!text-[35px] leading-[1.2] font-semibold tracking-[-1px] text-white text-left';
export const HERO_SUBTITLE_CONTAINER = 'max-w-xl lg:max-w-2xl';
export const HERO_SUBTITLE_STYLE = {
  fontFamily: 'Switzer, sans-serif',
  fontWeight: 600,
  letterSpacing: '-1px',
  verticalAlign: 'middle',
};

/** Mobile-first section shell — same on Home, About, Services, Portfolio, etc. */
export const HERO_SECTION_CLASS =
  'relative min-h-0 md:min-h-[100svh] flex flex-col justify-start md:justify-between pt-24 pb-6 md:pt-28 md:pb-12 px-5 sm:px-6 md:px-10 lg:px-16 overflow-visible z-10';
export const HERO_INNER_CLASS = 'relative z-10 w-full md:flex-1 flex flex-col';

/**
 * Landing hero — content paints immediately (no GSAP on critical path).
 * Soft CSS motion only for the accent dot / footer float.
 *
 * Mobile standard (all pages): title top-left → tight gap → subtitle (+ optional card).
 * Desktop: spread keeps title top / footer bottom when `spread` is set.
 */
const PageHero = ({
  title,
  subtitle,
  align = 'left',
  layout = 'stack',
  titleSize = HERO_TITLE_SIZE,
  showDot = false,
  spread = false,
  fullWidthTitle = false,
  animateFooter = true,
  fitViewport = true,
  hideChildrenOnMobile = false,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  subtitleContainerClassName = HERO_SUBTITLE_CONTAINER,
  /** Overrides default split footer spacing (title → subtitle/children row). */
  splitFooterClassName = '',
  subtitleStyle = {},
  children,
}) => {
  const isCenter = align === 'center';
  const isSplit = layout === 'split';
  // All spread heroes share the same compact mobile packing (Home/About standard)
  const compactMobile = spread;
  // Portfolio / Services / etc. — 40px between subtitle and hero card on mobile
  const cardOnMobile = Boolean(children) && !hideChildrenOnMobile;

  const subtitleEl = subtitle && (
    <p
      className={subtitleClassName || HERO_SUBTITLE_CLASS}
      style={{ ...HERO_SUBTITLE_STYLE, ...subtitleStyle }}
    >
      {subtitle}
    </p>
  );

  const dotEl = showDot && (
    <div
      className={`w-3 h-3 bg-white mc-hero-dot ${isCenter ? 'mx-auto' : ''}`}
      style={{ boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.3)' }}
    />
  );

  const titleSpacing = compactMobile
    ? '!tracking-[-1.4px] my-0 md:my-auto'
    : HERO_TITLE_CLASS;

  return (
    <section
      className={`relative overflow-visible ${spread ? 'flex flex-col md:flex-1' : ''} ${className}`}
    >
      <div
        className={`w-full max-w-[1400px] mr-auto relative z-10 ${
          isCenter ? 'flex flex-col items-center text-center mx-auto' : ''
        } ${
          spread
            ? compactMobile
              ? 'flex flex-col md:flex-1 md:h-full justify-start md:justify-between gap-8 md:gap-0'
              : 'flex flex-col flex-1 h-full justify-between'
            : ''
        }`}
      >
        <AnimatedHeroTitle
          text={title}
          size={titleSize}
          fitViewport={fitViewport}
          className={`${
            isSplit ? (spread ? 'mb-0' : 'mb-12 md:mb-16') : ''
          } ${fullWidthTitle ? 'max-w-full' : ''} ${titleSpacing} ${
            compactMobile ? 'pr-2 md:pr-0' : ''
          } ${titleClassName}`}
        />

        {isSplit ? (
          <div
            className={`w-full flex flex-col md:flex-row items-start md:items-center justify-between ${
              cardOnMobile ? 'gap-[40px] md:gap-12' : 'gap-4 md:gap-12'
            } ${
              splitFooterClassName ||
              (spread
                ? compactMobile
                  ? 'mt-6 pt-2 md:mt-auto md:pt-16'
                  : 'mt-auto pt-10 md:pt-16'
                : 'mt-8 md:mt-12')
            }`}
          >
            <div
              className={`flex flex-col gap-4 md:gap-6 text-left ${subtitleContainerClassName} ${
                compactMobile
                  ? `${hideChildrenOnMobile ? 'mb-6 md:mb-0' : 'mb-0'} max-w-xl`
                  : ''
              }`}
            >
              {dotEl}
              {subtitleEl}
            </div>
            {children && (
              <div
                className={`${hideChildrenOnMobile ? 'hidden md:block' : ''} w-full md:w-auto md:max-w-[480px] lg:max-w-[520px] ${
                  animateFooter ? 'mc-hero-float' : ''
                }`}
              >
                {children}
              </div>
            )}
          </div>
        ) : (
          <>
            {showDot && !isSplit && (
              <div className={isCenter ? 'mt-8 md:mt-10' : 'mt-8'}>{dotEl}</div>
            )}
            {subtitleEl}
            {children && (
              <div
                className={`${hideChildrenOnMobile ? 'hidden md:block' : ''} w-full ${isCenter
                    ? 'flex justify-center mt-12 md:mt-16 lg:mt-20'
                    : 'mt-8 md:mt-12'
                  } ${animateFooter ? 'mc-hero-float' : ''}`}
              >
                {children}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PageHero;
