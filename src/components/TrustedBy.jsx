const ROW_A = [
  'BLUESIO technologies',
  '@PESH.MODE',
  'THE MINDFUL SLEEP COACH',
  'GRAD',
  'Aani studio',
];

const ROW_B = [
  'MUNAY',
  'SOHO EDITORS',
  'THE BOAT BROKERS',
  'MUNAY',
  'SOHO EDITORS',
];

function LogoMark({ label }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center px-6 sm:px-8 h-14 sm:h-16 md:h-[72px] min-w-[140px] sm:min-w-[180px]"
      title={label}
    >
      <span
        className="text-white/85 whitespace-nowrap tracking-wide uppercase select-none"
        style={{
          fontFamily: 'Switzer, sans-serif',
          fontWeight: 600,
          fontSize: label.length > 18 ? 'clamp(11px, 1.6vw, 15px)' : 'clamp(13px, 2vw, 18px)',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function MarqueeRow({ items, reverse = false, duration = 40 }) {
  const track = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={`flex w-max items-center ${reverse ? 'animate-marquee-slider-reverse' : 'animate-marquee-slider'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((label, i) => (
          <LogoMark key={`${label}-${i}`} label={label} />
        ))}
      </div>
    </div>
  );
}

const TrustedBy = () => {
  return (
    <section
      data-snap-section
      className="relative w-full bg-black text-white px-4 sm:px-6 md:px-10 lg:px-16 pt-4 pb-16 sm:pb-20 md:pb-28"
    >
      <div className="max-w-[1100px] mx-auto w-full flex flex-col items-center">
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

        <div
          className="w-full rounded-[18px] sm:rounded-[22px] border border-[#25A9E0]/45 overflow-hidden"
          style={{
            boxShadow:
              '0 0 0 1px rgba(37,169,224,0.12), 0 0 40px rgba(37,169,224,0.18), inset 0 0 60px rgba(37,169,224,0.06)',
            background:
              'linear-gradient(180deg, rgba(10,36,72,0.35) 0%, rgba(0,0,0,0.85) 100%)',
          }}
        >
          <div className="py-3 sm:py-4">
            <MarqueeRow items={ROW_A} duration={38} />
          </div>
          <div className="h-px w-full bg-[#25A9E0]/40" />
          <div className="py-3 sm:py-4">
            <MarqueeRow items={ROW_B} reverse duration={42} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
