import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import LOGO_SRC from '../assets/logo.png';
import { getScrollY, getLenis, subscribeScroll } from '../lib/scrollBus';
import { PROJECT_ORDER, PROJECTS } from '../data/projects';
import StarBorder from './StarBorder';

const PROJECT_LINKS = PROJECT_ORDER.map((slug) => ({
  label: PROJECTS[slug].title,
  to: `/projects/${slug}`,
}));

const NAV_LINKS = [
  { label: 'Projects', dropdown: PROJECT_LINKS },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
];

const CALENDLY_URL = 'https://cal.com/blue-hawke/30min';

const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    className="-rotate-45"
  >
    <path
      d="M1 7H13M13 7L7 1M13 7L7 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const menuBtnRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const projectsDesktopRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);

  const releaseMenuFocus = () => {
    const panel = mobilePanelRef.current;
    const active = document.activeElement;
    if (panel && active instanceof HTMLElement && panel.contains(active)) {
      active.blur();
      menuBtnRef.current?.focus?.({ preventScroll: true });
    }
  };

  useEffect(() => {
    releaseMenuFocus();
    setMenuOpen(false);
    setProjectsOpen(false);
    setMobileProjectsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!projectsOpen) return undefined;
    const onPointerDown = (e) => {
      if (projectsDesktopRef.current?.contains(e.target)) return;
      setProjectsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setProjectsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [projectsOpen]);

  useEffect(() => {
    if (!menuOpen) releaseMenuFocus();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const scrollY = getScrollY();
    const html = document.documentElement;
    const body = document.body;
    const lenis = getLenis();

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    try {
      lenis?.stop?.();
    } catch {
      /* ignore */
    }

    const onTouchMove = (e) => {
      if (e.target?.closest?.('[data-menu-scroll]')) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchmove', onTouchMove);

      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;

      try {
        lenis?.start?.();
      } catch {
        /* ignore */
      }

      window.scrollTo(0, scrollY);
      try {
        lenis?.scrollTo?.(scrollY, { immediate: true });
      } catch {
        /* ignore */
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    let lastScrollY = getScrollY();
    let isHidden = false;
    let ticking = false;

    setHidden(false);
    isHidden = false;
    lastScrollY = getScrollY();

    const showNav = () => {
      if (!isHidden) return;
      isHidden = false;
      setHidden(false);
    };

    const hideNav = () => {
      if (isHidden || menuOpen) return;
      isHidden = true;
      setHidden(true);
    };

    const onScroll = (currentScrollY) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = typeof currentScrollY === 'number' ? currentScrollY : getScrollY();
        const delta = y - lastScrollY;

        if (y <= 40) {
          showNav();
        } else if (delta > 6 && y > 90) {
          hideNav();
        } else if (delta < -6) {
          showNav();
        }

        lastScrollY = y;
        ticking = false;
      });
    };

    return subscribeScroll(onScroll);
  }, [location.pathname, menuOpen]);

  const isActive = (to) =>
    location.pathname === to ||
    (to !== '/' && !to.includes('#') && location.pathname.startsWith(to));

  const isProjectsActive =
    location.pathname.startsWith('/projects/') || location.hash === '#work-grid';

  const closeMenu = () => {
    releaseMenuFocus();
    setMenuOpen(false);
    setProjectsOpen(false);
    setMobileProjectsOpen(false);
  };
  const toggleMenu = () => {
    setMenuOpen((open) => {
      if (open) releaseMenuFocus();
      return !open;
    });
  };

  return createPortal(
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] flex justify-center pt-3 sm:pt-4 md:pt-5 px-3 sm:px-4 will-change-transform transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !menuOpen
            ? '-translate-y-[120%] pointer-events-none'
            : 'translate-y-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-[min(90vw,500px)] xl:w-[min(90vw,920px)] rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
            hidden && !menuOpen ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
          style={{
            background: 'rgba(10, 36, 72, 0.94)',
          }}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-3 xl:gap-4 pl-3 pr-2 sm:pl-4 sm:pr-2.5 xl:pl-5 xl:pr-3 py-2 xl:py-2.5 min-w-0">
            <Link
              to="/"
              className="flex items-center cursor-pointer select-none no-underline shrink-0 min-w-0 max-w-[42%] xl:max-w-none"
              onClick={closeMenu}
            >
              <img
                src={LOGO_SRC}
                alt="BlueHawk"
                className="h-[28px] sm:h-[32px] xl:h-[36px] w-auto max-w-full object-contain object-left"
                decoding="async"
                draggable={false}
              />
            </Link>

            <div className="hidden xl:flex items-center justify-evenly flex-1 min-w-0 px-6 2xl:px-10">
              {NAV_LINKS.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    ref={projectsDesktopRef}
                    className="relative shrink-0"
                    onMouseEnter={() => setProjectsOpen(true)}
                    onMouseLeave={() => setProjectsOpen(false)}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 text-[13px] 2xl:text-[15px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 px-1 bg-transparent border-none cursor-pointer ${
                        isProjectsActive || projectsOpen
                          ? 'text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                      aria-expanded={projectsOpen}
                      aria-haspopup="menu"
                      onClick={() => setProjectsOpen((o) => !o)}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${projectsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <div
                      className={`absolute left-1/2 top-full z-[70] w-[240px] -translate-x-1/2 pt-2 transition-[opacity,visibility] duration-200 ${
                        projectsOpen
                          ? 'visible opacity-100 pointer-events-auto'
                          : 'invisible opacity-0 pointer-events-none'
                      }`}
                    >
                      <div
                        role="menu"
                        className="rounded-2xl border border-white/10 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                        style={{ background: 'rgba(10, 36, 72, 0.98)' }}
                      >
                        {item.dropdown.map((project) => (
                          <Link
                            key={project.to}
                            to={project.to}
                            role="menuitem"
                            className={`block rounded-xl px-3.5 py-2.5 text-[13px] font-medium no-underline transition-colors ${
                              location.pathname === project.to
                                ? 'bg-white/10 text-white'
                                : 'text-white/75 hover:bg-white/8 hover:text-white'
                            }`}
                            onClick={() => setProjectsOpen(false)}
                          >
                            {project.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`text-[13px] 2xl:text-[15px] font-medium tracking-wide whitespace-nowrap no-underline transition-colors duration-300 shrink-0 px-1 ${
                      isActive(item.to)
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            <div className="hidden xl:block shrink-0">
              <StarBorder
                as="a"
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                theme="dark"
                radius={999}
                thickness={1}
                duration={4}
                trailLength={0.3}
                glow={0.6}
                hover="lap"
                className="h-9 2xl:h-10 px-4 2xl:px-5 text-[13px] 2xl:text-[14px]"
              >
                Get Started
                <ArrowIcon />
              </StarBorder>
            </div>

            <button
              ref={menuBtnRef}
              type="button"
              className="xl:hidden relative flex items-center justify-center w-10 h-10 mr-0.5 cursor-pointer bg-transparent border-none rounded-full hover:bg-white/5 shrink-0"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className="relative block h-[14px] w-5" aria-hidden>
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-5 origin-center rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen ? 'translate-y-[6px] rotate-45' : 'translate-y-0 rotate-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-[6px] block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 top-[12px] block h-0.5 origin-center rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    menuOpen
                      ? 'w-5 -translate-y-[6px] -rotate-45'
                      : 'w-3.5 translate-y-0 rotate-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={mobilePanelRef}
        className={`xl:hidden fixed inset-0 z-[55] bg-[#0a0a0a] overscroll-none transition-[opacity,visibility,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <div className="flex h-full flex-col px-6 pt-[5.5rem] pb-8 sm:px-8">
          <nav
            data-menu-scroll
            className="flex flex-1 flex-col justify-start gap-0 min-h-0 overflow-y-auto overscroll-contain pt-2"
          >
            {NAV_LINKS.map((item, i) => (
              <div
                key={item.label}
                className={`border-b border-white/10 transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-3 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${80 + i * 55}ms` : '0ms' }}
              >
                {item.dropdown ? (
                  <div>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between gap-3 bg-transparent border-none py-3.5 sm:py-4 text-left text-[clamp(1.6rem,7vw,2.5rem)] font-semibold leading-none tracking-tight cursor-pointer transition-colors duration-300 ${
                        isProjectsActive || mobileProjectsOpen
                          ? 'text-white'
                          : 'text-white/55 hover:text-white'
                      }`}
                      aria-expanded={mobileProjectsOpen}
                      onClick={() => setMobileProjectsOpen((o) => !o)}
                    >
                      {item.label}
                      <ChevronDown
                        size={22}
                        className={`shrink-0 transition-transform duration-200 ${
                          mobileProjectsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        mobileProjectsOpen
                          ? 'grid-rows-[1fr] opacity-100 pb-3'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        {item.dropdown.map((project) => (
                          <Link
                            key={project.to}
                            to={project.to}
                            className={`block py-2.5 pl-1 text-[17px] font-medium no-underline ${
                              location.pathname === project.to
                                ? 'text-white'
                                : 'text-white/60 hover:text-white'
                            }`}
                            onClick={closeMenu}
                          >
                            {project.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.to}
                    className={`block py-3.5 sm:py-4 text-[clamp(1.6rem,7vw,2.5rem)] font-semibold leading-none tracking-tight no-underline transition-colors duration-300 ${
                      isActive(item.to) ? 'text-white' : 'text-white/55 hover:text-white'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <StarBorder
            as="a"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            theme="dark"
            radius={999}
            thickness={1}
            duration={4}
            trailLength={0.3}
            glow={0.6}
            hover="lap"
            className={`mt-6 shrink-0 w-full h-12 sm:h-14 text-[15px] sm:text-[16px] transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? `${80 + NAV_LINKS.length * 55}ms` : '0ms' }}
            onClick={closeMenu}
          >
            Get Started
            <ArrowIcon />
          </StarBorder>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default Navbar;
