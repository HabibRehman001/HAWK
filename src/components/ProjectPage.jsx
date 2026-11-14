import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import AnimatedHeroTitle from './landing/AnimatedHeroTitle';
import { HERO_TITLE_SIZE } from './landing/PageHero';

/**
 * PROPS
 * category      string   "Travel Tech · Mobile App"
 * title         string   "Grid Travel"
 * tagline       string   one sentence under the title
 * liveUrl       string   external demo link (button hidden if empty)
 * contactHref   string   route for "Get in touch" / "Book a call"
 * backHref      string   route back to all projects
 * heroImage     string   main image (shown at its natural ratio, never cropped)
 * heroImageAlt  string
 * meta          [{ label, value }]     Client, Year, Role, Timeline...
 * summary       string   2-3 sentence project statement, shown large
 * stats         [{ value, label }]
 * sections      [{ title, body, bullets?, image?, imageAlt?, caption? }]
 *                body: string (blank line = new paragraph) or string[]
 * gallery       [{ src, alt?, caption? }]
 * techStack     string[]
 * ctaTitle, ctaText   string
 * nextProject   { title, href, image?, category? }
 */

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const paragraphs = (b) =>
  (Array.isArray(b) ? b : String(b || '').split(/\n\n+/)).filter(Boolean);

export default function ProjectPage({
  category = '',
  title = '',
  tagline = '',
  liveUrl = '',
  contactHref = '/contact',
  backHref = '/',
  heroImage = '',
  heroImageAlt = '',
  meta = [],
  summary = '',
  stats = [],
  sections = [],
  gallery = [],
  techStack = [],
  ctaTitle = "Let's build something like this for your business.",
  ctaText =
    "Book a free strategy call. We'll look at your goals and show you how we'd approach them.",
  nextProject = null,
}) {
  const root = useRef(null);
  const [active, setActive] = useState(sections[0] ? slug(sections[0].title) : '');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let io;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.pp-title', { opacity: 0, y: 28, duration: 1 })
        .from('.pp-intro', { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, '-=0.55')
        .from('.pp-hero-img', { opacity: 0, y: 48, duration: 1.2 }, '-=0.6');

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            gsap.to(e.target, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
            io.unobserve(e.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px' }
      );
      gsap.utils.toArray('.pp-fade').forEach((el) => {
        gsap.set(el, { opacity: 0, y: 28 });
        io.observe(el);
      });
    }, root);

    return () => {
      io?.disconnect();
      ctx.revert();
    };
  }, [title]);

  useEffect(() => {
    if (sections.length < 2) return;
    const els = sections.map((s) => document.getElementById(slug(s.title))).filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-25% 0px -65% 0px' }
    );
    els.forEach((el) => spy.observe(el));
    return () => spy.disconnect();
  }, [sections]);

  const jump = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const container = 'mx-auto w-full max-w-[1280px] px-6 md:px-10';
  const hairline = 'border-[#a0cdff]/[0.14]';
  const btnPrimary =
    'inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-[#1597ff] to-[#0057ff] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_26px_rgba(0,100,255,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,100,255,0.55)]';
  const showLive = liveUrl && liveUrl !== '#';

  return (
    <main
      ref={root}
      className="relative overflow-x-clip bg-[#040617] text-[#cfe6ff] antialiased selection:bg-[#1e8fff]/40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(30,143,255,0.16),transparent_70%)]"
      />

      <header className={`${container} relative pt-32 md:pt-40`}>
        <Link
          to={backHref}
          className="pp-intro inline-flex items-center gap-2 text-sm text-[#7f98bd] transition-colors hover:text-[#cfe6ff]"
        >
          <ArrowLeft size={15} /> All projects
        </Link>

        <div className="pp-title mt-8 w-full">
          <AnimatedHeroTitle
            text={title}
            size={HERO_TITLE_SIZE}
            fitViewport
            className="!tracking-[-1.4px]"
          />
        </div>

        <div className="mt-10 grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            {category && <p className="pp-intro mb-3 text-sm text-[#4aa3ff]">{category}</p>}
            {tagline && (
              <p
                className="pp-intro max-w-xl text-[24px] sm:text-[28px] lg:text-[35px] leading-[1.2] font-semibold tracking-[-1px] text-white"
                style={{ fontFamily: 'Switzer, sans-serif', fontWeight: 600 }}
              >
                {tagline}
              </p>
            )}
          </div>
          <div className="pp-intro flex flex-wrap items-center gap-6 md:col-span-5 md:justify-end">
            {showLive && (
              <a href={liveUrl} target="_blank" rel="noreferrer" className={btnPrimary}>
                View live demo <ArrowUpRight size={17} />
              </a>
            )}
            <Link
              to={contactHref}
              className="text-[15px] font-medium underline decoration-[#1e8fff]/60 underline-offset-[6px] transition hover:decoration-[#cfe6ff]"
            >
              Get in touch
            </Link>
          </div>
        </div>

        {meta.length > 0 && (
          <dl className={`pp-intro mt-14 grid grid-cols-2 border-y ${hairline} md:grid-cols-4`}>
            {meta.map((m, i) => (
              <div
                key={m.label}
                className={`py-5 pr-4 ${i > 0 ? `md:border-l md:pl-6 ${hairline}` : ''}`}
              >
                <dt className="mb-1 text-sm text-[#7f98bd]">{m.label}</dt>
                <dd className="text-[15px] font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {heroImage && (
          <div
            className={`pp-hero-img mt-12 overflow-hidden rounded-2xl border ${hairline} bg-[#070d26] shadow-[0_50px_120px_-40px_rgba(30,143,255,0.45)]`}
          >
            <img src={heroImage} alt={heroImageAlt || title} className="block h-auto w-full" />
          </div>
        )}
      </header>

      {summary && (
        <section className={`${container} grid gap-6 py-28 md:grid-cols-12 md:py-36`}>
          <p className="pp-fade text-sm text-[#7f98bd] md:col-span-3">Overview</p>
          <p className="pp-fade text-[clamp(24px,3.2vw,44px)] font-medium leading-[1.2] tracking-[-0.025em] md:col-span-9">
            {summary}
          </p>
        </section>
      )}

      {stats.length > 0 && (
        <section className={container}>
          <div className={`grid grid-cols-2 border-y ${hairline} md:grid-cols-4`}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`pp-fade px-0 py-10 md:px-8 ${i > 0 ? `md:border-l ${hairline}` : 'md:pl-0'}`}
              >
                <p className="text-[clamp(40px,5vw,68px)] font-semibold leading-none tracking-[-0.04em]">
                  {s.value}
                </p>
                <p className="mt-3 max-w-[16rem] text-sm text-[#8ba5c9]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <div className={`${container} grid gap-12 py-28 md:py-36 lg:grid-cols-12`}>
          {sections.length > 1 && (
            <nav aria-label="Project contents" className="hidden lg:col-span-3 lg:block">
              <ul className="sticky top-28 space-y-1">
                {sections.map((s) => {
                  const id = slug(s.title);
                  const on = active === id;
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={jump(id)}
                        className={`relative block border-l py-2 pl-5 text-[15px] transition-colors ${
                          on
                            ? 'border-[#1e8fff] text-[#cfe6ff]'
                            : `${hairline} text-[#6f88ad] hover:text-[#cfe6ff]`
                        }`}
                      >
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div className={`space-y-28 ${sections.length > 1 ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
            {sections.map((s) => (
              <section key={s.title} id={slug(s.title)} className="scroll-mt-28">
                <h2 className="pp-fade text-[clamp(30px,3.6vw,48px)] font-semibold leading-[1.05] tracking-[-0.035em]">
                  {s.title}
                </h2>

                <div className="mt-6 space-y-5">
                  {paragraphs(s.body).map((p, k) => (
                    <p key={k} className="pp-fade max-w-[64ch] text-[18px] leading-[1.7] text-[#a9c3e6]">
                      {p}
                    </p>
                  ))}
                </div>

                {s.bullets?.length > 0 && (
                  <ul className={`pp-fade mt-8 max-w-[64ch] border-t ${hairline}`}>
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className={`flex items-baseline gap-4 border-b py-4 text-[17px] ${hairline}`}
                      >
                        <span className="h-px w-4 shrink-0 translate-y-[-4px] bg-[#1e8fff]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {s.image && (
                  <figure className="pp-fade mt-12">
                    <div className={`overflow-hidden rounded-2xl border ${hairline} bg-[#070d26]`}>
                      <img
                        src={s.image}
                        alt={s.imageAlt || s.title}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    </div>
                    {s.caption && (
                      <figcaption className="mt-3 text-sm text-[#7f98bd]">{s.caption}</figcaption>
                    )}
                  </figure>
                )}
              </section>
            ))}
          </div>
        </div>
      )}

      {gallery.length > 0 && (
        <section className={`${container} pb-28 md:pb-36`}>
          <h2 className="pp-fade mb-10 text-[clamp(30px,3.6vw,48px)] font-semibold tracking-[-0.035em]">
            Selected screens
          </h2>
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {gallery.map((g, i) => (
              <figure key={g.src + i} className={`pp-fade ${i % 3 === 0 ? 'md:col-span-2' : ''}`}>
                <div className={`overflow-hidden rounded-2xl border ${hairline} bg-[#070d26]`}>
                  <img
                    src={g.src}
                    alt={g.alt || ''}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
                {g.caption && (
                  <figcaption className="mt-3 text-sm text-[#7f98bd]">{g.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {techStack.length > 0 && (
        <section className={`${container} pb-28 md:pb-36`}>
          <div className={`pp-fade grid gap-6 border-t pt-10 md:grid-cols-12 ${hairline}`}>
            <h2 className="text-sm text-[#7f98bd] md:col-span-3">Technology</h2>
            <p className="text-[clamp(20px,2.2vw,28px)] leading-[1.5] tracking-[-0.01em] md:col-span-9">
              {techStack.map((t, i) => (
                <span key={t}>
                  {t}
                  {i < techStack.length - 1 && <span className="mx-3 text-[#1e8fff]">/</span>}
                </span>
              ))}
            </p>
          </div>
        </section>
      )}

      <section className={`border-t ${hairline}`}>
        <div className={`${container} py-28 md:py-40`}>
          <h2 className="pp-fade max-w-5xl text-[clamp(38px,6.2vw,96px)] font-semibold leading-[0.98] tracking-[-0.05em]">
            {ctaTitle}
          </h2>
          <div className="pp-fade mt-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-lg text-[#a9c3e6]">{ctaText}</p>
            <Link to={contactHref} className={btnPrimary}>
              Book a call <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {nextProject && (
        <Link
          to={nextProject.href}
          className={`group relative block overflow-hidden border-t ${hairline}`}
        >
          {nextProject.image && (
            <img
              src={nextProject.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-[0.22]"
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#040617] via-[#040617]/60 to-[#040617]"
            aria-hidden
          />
          <div
            className={`${container} relative flex items-center justify-between gap-6 py-16 md:py-24`}
          >
            <div>
              <p className="mb-3 text-sm text-[#7f98bd]">
                Next project{nextProject.category ? ` · ${nextProject.category}` : ''}
              </p>
              <p className="text-[clamp(40px,7vw,112px)] font-semibold leading-none tracking-[-0.05em]">
                {nextProject.title}
              </p>
            </div>
            <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#a0cdff]/30 transition duration-300 group-hover:border-[#1e8fff] group-hover:bg-[#1e8fff]">
              <ArrowUpRight
                size={24}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </span>
          </div>
        </Link>
      )}
    </main>
  );
}
