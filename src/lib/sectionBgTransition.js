import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Dark-blue midpoint used when sections scrub past each other */
export const SECTION_VIA_BLUE = '#0A2448'

/**
 * Scrub a section's backgroundColor (and optional child colors) from `from` → `to`
 * as the section enters the viewport. Pass `via` (or omit and set `useBlueVia: true`)
 * to travel through a dark-blue touch so scroll feels blue between components.
 *
 * @param {HTMLElement | null} section
 * @param {{
 *   from: string,
 *   to: string,
 *   via?: string | null,
 *   useBlueVia?: boolean,
 *   start?: string,
 *   end?: string,
 *   scrub?: number | boolean,
 *   colorTargets?: Array<{ selector: string, from: string, to: string }>
 * }} options
 */
export function initSectionBgTransition(section, options = {}) {
  if (!section) return () => {}

  const {
    from,
    to,
    via = null,
    useBlueVia = true,
    start = 'top 90%',
    end = 'top 40%',
    scrub = 1.2,
    colorTargets = [],
  } = options

  if (!from || !to) return () => {}

  const mid = via ?? (useBlueVia ? SECTION_VIA_BLUE : null)

  gsap.set(section, { backgroundColor: from })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start,
      end,
      scrub,
    },
  })

  if (mid && mid.toLowerCase() !== from.toLowerCase() && mid.toLowerCase() !== to.toLowerCase()) {
    // Black/cream ↔ cream/black passes through dark blue for a scroll “blue touch”
    tl.fromTo(
      section,
      { backgroundColor: from },
      { backgroundColor: mid, ease: 'none', duration: 0.45 },
      0,
    )
    tl.to(section, { backgroundColor: to, ease: 'none', duration: 0.55 }, 0.45)
  } else {
    tl.fromTo(
      section,
      { backgroundColor: from },
      { backgroundColor: to, ease: 'none', duration: 1 },
      0,
    )
  }

  colorTargets.forEach(({ selector, from: cFrom, to: cTo }) => {
    const nodes = section.querySelectorAll(selector)
    if (!nodes.length || !cFrom || !cTo) return
    gsap.set(nodes, { color: cFrom })
    tl.fromTo(
      nodes,
      { color: cFrom },
      { color: cTo, ease: 'none', duration: 1 },
      0,
    )
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
