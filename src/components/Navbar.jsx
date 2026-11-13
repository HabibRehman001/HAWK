import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import LOGO_SRC from '../assets/logo.png';
import { getScrollY, getLenis, subscribeScroll } from '../lib/scrollBus';
import StarBorder from './StarBorder';

const NAV_LINKS = [
  { label: 'Projects', to: '/portfolio' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
];

const CALENDLY_URL = '#contact';

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
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
  }, [location.pathname]);

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

  const closeMenu = () => {
    releaseMenuFocus();
    setMenuOpen(false);
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
              {NAV_LINKS.map((item) => (
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
              ))}
            </div>

            <div className="hidden xl:block shrink-0">
              <StarBorder
                as="a"
                href={CALENDLY_URL}
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
                <Link
                  to={item.to}
                  className={`block py-3.5 sm:py-4 text-[clamp(1.6rem,7vw,2.5rem)] font-semibold leading-none tracking-tight no-underline transition-colors duration-300 ${
                    isActive(item.to) ? 'text-white' : 'text-white/55 hover:text-white'
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>

          <StarBorder
            as="a"
            href={CALENDLY_URL}
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
