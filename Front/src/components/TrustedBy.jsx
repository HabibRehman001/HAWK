const ROW_A = [
  {
    src: 'https://framerusercontent.com/images/JyqAuIoXmLcKdAxD864b03uG6o.png?width=280&height=47',
    alt: 'Client logo 1',
    w: 280,
    h: 47,
  },
  {
    src: 'https://framerusercontent.com/images/Ouvnp1Xpc4TqO0w4KouA4u1tQBI.png?width=217&height=186',
    alt: 'Client logo 2',
    w: 217,
    h: 186,
  },
  {
    src: 'https://framerusercontent.com/images/HGuGcZjCH20V8XLyhxC6wVtubio.png?width=183&height=106',
    alt: 'Client logo 3',
    w: 183,
    h: 106,
  },
  {
    src: 'https://framerusercontent.com/images/YH0cKlH6kYRu9ZAOB1uuNBVA.png?width=215&height=126',
    alt: 'Client logo 4',
    w: 215,
    h: 126,
  },
  {
    src: 'https://framerusercontent.com/images/9iKPLM3OiOBckKfCJ94khp5ttU.svg?width=518&height=119',
    alt: 'Client logo 5',
    w: 518,
    h: 119,
  },
];

const ROW_B = [
  {
    src: 'https://framerusercontent.com/images/uKEwIjIBqxceEDP63YQ6QocuiU.png?width=617&height=404',
    alt: 'Client logo 6',
    w: 617,
    h: 404,
  },
  {
    src: 'https://framerusercontent.com/images/27gDqSVp20VpFq5zkKQ1m1TycQ.png?width=736&height=339',
    alt: 'Client logo 7',
    w: 736,
    h: 339,
  },
  {
    src: 'https://framerusercontent.com/images/i96NYYV2SugXQQhqjAn6Y5g3WuE.png?width=690&height=361',
    alt: 'Client logo 8',
    w: 690,
    h: 361,
  },
];

/** Repeat logos until a segment is long enough to fill ~90vw without gaps. */
function buildSegment(items, minCount = 12) {
  const segment = [];
  while (segment.length < minCount) {
    segment.push(...items);
  }
  return segment;
}

function LogoMark({ logo }) {
  return (
    <div className="shrink-0 flex items-center justify-center px-8 sm:px-10 md:px-12 h-16 sm:h-[72px] md:h-20">
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.w}
        height={logo.h}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-8 sm:h-10 md:h-11 w-auto max-w-[160px] sm:max-w-[200px] md:max-w-[220px] object-contain opacity-90"
      />
    </div>
  );
}

function MarqueeRow({ items, reverse = false, duration = 40 }) {
  // Two identical halves — CSS translateX(-50%) loops seamlessly with no gaps
  const segment = buildSegment(items, 12);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`flex w-max items-center ${reverse ? 'animate-marquee-slider-reverse' : 'animate-marquee-slider'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">
          {segment.map((logo, i) => (
            <LogoMark key={`a-${logo.src}-${i}`} logo={logo} />
          ))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {segment.map((logo, i) => (
            <LogoMark key={`b-${logo.src}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}

const EDGE_FADE = {
  maskImage:
    'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
};

const TrustedBy = () => {
  return (
    <section
      data-snap-section
      className="relative w-full bg-[#040617] text-white pt-4 pb-10 sm:pb-14 md:pb-16"
    >
      <div className="w-[90vw] mx-auto flex flex-col items-center">
        <p
          className="m-0 text-center text-[11px] sm:text-[12px] md:text-[13px] font-semibold tracking-[0.22em] uppercase text-[#25A9E0]"
          style={{ fontFamily: 'Switzer, sans-serif' }}
        >
          Trusted by ambitious teams
        </p>
        <p
          className="m-0 mt-3 mb-8 sm:mb-10 text-center text-[14px] sm:text-[16px] md:text-[18px] font-medium tracking-tight text-white/75 max-w-xl"
          style={{ fontFamily: 'Switzer, sans-serif' }}
        >
          A selection of brands and businesses we&apos;ve helped bring to life.
        </p>

        <div className="w-full overflow-hidden" style={EDGE_FADE}>
          <div className="py-3 sm:py-4">
            <MarqueeRow items={ROW_A} duration={38} />
          </div>
          <div className="py-3 sm:py-4">
            <MarqueeRow items={ROW_B} reverse duration={42} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
