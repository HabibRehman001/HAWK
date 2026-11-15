import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { CAL_URL_OVERLAY as CAL_URL } from '../lib/links';

const FAQS = [
  {
    q: 'How fast can you ship a website or app?',
    a: 'Most websites are delivered within 7 days. Timelines mainly depend on feedback speed, approvals, and the overall project scope. If responses or revisions are delayed, delivery timelines naturally shift as well — but our team moves quickly once everything is aligned.\n\nFor mobile apps, development usually takes a few months depending on the features, complexity, integrations, and overall functionality required. More advanced apps with custom systems, subscriptions, GPS, dashboards, or real-time features may require additional development time to ensure everything is built properly and smoothly.',
  },
  {
    q: 'Do you use templates?',
    a: 'No. Every website, app, and dashboard is custom designed and custom built. We design in Figma and develop on modern stacks with scalable architecture. We don’t deliver copy-paste websites.',
  },
  {
    q: 'What about hosting and ongoing maintenance?',
    a: 'You own everything — designs, source files, assets, and code. We can also continue as your long-term tech partner through a monthly retainer for updates, maintenance, scaling, and product growth.',
  },
  {
    q: 'What if I’m not technical?',
    a: 'Most clients aren’t — and that’s completely fine. You focus on your business and vision, while we translate everything into simple, clear communication without technical confusion.',
  },
  {
    q: 'Will my website be optimized for mobile devices?',
    a: 'Yes. Every product we build is fully responsive across desktop, tablet, and mobile devices with performance-focused optimization.',
  },
  {
    q: 'What happens after the project is launched?',
    a: 'We help with deployment, testing, launch support, optimization, and scaling guidance. Our goal isn’t just to finish a project — it’s to help your product succeed after launch too.',
  },
  {
    q: 'Why choose Blue Hawke over another agency?',
    a: 'Because you work directly with creatives and builders — not just project managers passing messages around. The people designing and building your product are the same people speaking with you, understanding your vision, and executing it.',
  },
  {
    q: 'Can you build on my preferred stack?',
    a: 'Yes. We can work with Webflow, Framer, Next.js, React, WordPress, Shopify, and other modern technologies depending on your business goals and scalability requirements.',
  },
  {
    q: 'How do you understand my product deeply?',
    a: 'That happens during onboarding. We conduct strategy calls to understand your audience, business model, positioning, customer behavior, and goals before we start designing or building anything.',
  },
  {
    q: 'Can you redesign my existing website or SaaS product?',
    a: 'Absolutely. We frequently redesign outdated platforms, improve UX/UI, optimize conversion flows, and modernize products without losing your existing brand identity.',
  },
  {
    q: 'Do you only build websites?',
    a: 'No. We also design and develop SaaS platforms, mobile applications, dashboards, internal systems, MVPs, and complete digital product ecosystems.',
  },
  {
    q: 'Who will I actually be working with?',
    a: 'You’ll work directly with creative heads, designers, and developers building your product — not random PM layers or sales teams.\n\nNo fluff. No gimmicks.\nJust real people who understand products and know how to ship.',
  },
];

/** Phone: first 4 · Tablet: first 8 · Laptop+: all */
function itemVisibility(index) {
  if (index >= 8) return 'hidden lg:block';
  if (index >= 4) return 'hidden md:block';
  return 'block';
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div
      className="min-w-0 rounded-2xl"
      style={{
        background:
          'linear-gradient(180deg, rgba(1, 5, 19, 0.1) 0%, rgb(1, 5, 19) 100%)',
        boxShadow:
          'rgba(116, 176, 253, 0.08) 0px -16px 64px 0px inset, rgba(212, 232, 255, 0.04) 0px 3px 12px 0px inset, rgba(212, 232, 255, 0.12) 0px 0.5px 0.5px 0px inset',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-2 bg-transparent border-none px-3 py-4 text-left cursor-pointer sm:gap-4 sm:px-5 sm:py-5 md:px-6"
      >
        <span
          className="text-[13px] sm:text-[16px] md:text-[17px] font-medium leading-snug text-[#f0f8ff]"
          style={{ fontFamily: 'Switzer, sans-serif' }}
        >
          {item.q}
        </span>
        <span className="mt-0.5 grid size-6 sm:size-7 shrink-0 place-items-center text-[#cfe6ff]">
          {open ? <Minus size={18} strokeWidth={2} /> : <Plus size={18} strokeWidth={2} />}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
            {item.a.split('\n\n').map((p, i) => (
              <p
                key={i}
                className={`text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-[#cfe6ff]/85 whitespace-pre-line ${
                  i > 0 ? 'mt-3' : ''
                }`}
                style={{ fontFamily: 'Switzer, sans-serif' }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(0);

  // Two independent stacks so opening one FAQ never stretches its neighbor
  const left = FAQS.map((item, i) => ({ item, i })).filter(({ i }) => i % 2 === 0);
  const right = FAQS.map((item, i) => ({ item, i })).filter(({ i }) => i % 2 === 1);

  const renderColumn = (entries) => (
    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
      {entries.map(({ item, i }) => (
        <div key={item.q} className={itemVisibility(i)}>
          <FaqItem
            item={item}
            open={openId === i}
            onToggle={() => setOpenId((cur) => (cur === i ? -1 : i))}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section
      id="faq"
      data-snap-section
      className="relative overflow-hidden bg-[#040617] px-5 py-20 sm:px-6 md:px-10 lg:px-16 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(40,105,254,0.35),transparent_70%)] blur-[57px]"
      />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-5 inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-1.5">
            <span
              className="text-[13px] font-medium tracking-wide text-[#0099ff]"
              style={{ fontFamily: 'Switzer, sans-serif' }}
            >
              FAQ
            </span>
          </div>

          <h2
            className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#cfe6ff]"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            Frequently questioned,
            <br />
            clearly answered.
          </h2>

          <p
            className="mx-auto mt-5 max-w-xl text-[15px] md:text-[17px] leading-relaxed text-[#cfe6ff]/80"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            If you’re considering working together, these are a few things teams usually want
            clarity on before moving forward.
          </p>
        </div>

        {/* Phone 2×2 (4) · Tablet 2×4 (8) · Laptop all — columns are independent */}
        <div className="grid grid-cols-2 items-start gap-2 sm:gap-3 md:gap-4">
          {renderColumn(left)}
          {renderColumn(right)}
        </div>

        <div className="mt-12 text-center md:mt-16">
          <p
            className="text-[16px] md:text-[17px] font-semibold text-[#f0f8ff]"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            Didn’t find the answer you were looking for?
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[16px] md:text-[17px] font-semibold italic text-[#008fcb] underline decoration-[#008fcb]/50 underline-offset-4 transition hover:text-[#25A9E0] hover:decoration-[#25A9E0]"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            Book a quick call with our team
          </a>
        </div>
      </div>
    </section>
  );
}
