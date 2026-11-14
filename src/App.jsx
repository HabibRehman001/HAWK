import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import DocumentTitle from './components/DocumentTitle'
import ScrollToTopButton from './components/ScrollToTopButton'
import { setLenis, getLenis } from './lib/scrollBus'
import { initSectionSnap, shouldEnableSectionSnap } from './lib/magneticSnap'

const Home = lazy(() => import('./pages/Home'))

function goToPageTop() {
  const page = document.querySelector('.page-top')
  const lenis = getLenis()
  const html = document.documentElement
  const prevBehavior = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'

  if (lenis) {
    lenis.scrollTo(page || 0, { immediate: true, offset: 0 })
  }

  if (page) {
    page.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  html.scrollTop = 0
  document.body.scrollTop = 0
  window.scrollTo(0, 0)
  html.style.scrollBehavior = prevBehavior
}

function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (hash) return undefined

    goToPageTop()
    const raf = requestAnimationFrame(goToPageTop)
    const t1 = window.setTimeout(goToPageTop, 0)
    const t2 = window.setTimeout(goToPageTop, 120)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [pathname, hash])

  return null
}

function ScrollRig({ useLenis, ScrollTrigger }) {
  const lenis = useLenis()
  const location = useLocation()
  const snapRef = useRef(null)

  useEffect(() => {
    setLenis(lenis ?? null)
    return () => setLenis(null)
  }, [lenis])

  useEffect(() => {
    if (!lenis || !ScrollTrigger) return undefined
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    ScrollTrigger.defaults({ scroller: undefined })
    return () => lenis.off('scroll', onScroll)
  }, [lenis, ScrollTrigger])

  useEffect(() => {
    if (!ScrollTrigger) return undefined
    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    const timers = [200, 700, 1400].map((ms) => window.setTimeout(refresh, ms))

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [location.pathname, ScrollTrigger])

  useEffect(() => {
    snapRef.current?.()
    snapRef.current = null

    if (!shouldEnableSectionSnap(location.pathname)) return undefined

    const t = window.setTimeout(() => {
      goToPageTop()
      snapRef.current = initSectionSnap({ offset: 88 })
    }, 600)

    return () => {
      window.clearTimeout(t)
      snapRef.current?.()
      snapRef.current = null
    }
  }, [location.pathname])

  useEffect(() => {
    if (!ScrollTrigger) return undefined
    let timer = null
    const ro = new ResizeObserver(() => {
      if (timer != null) window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)
    return () => {
      if (timer != null) window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [ScrollTrigger])

  return null
}

function AppTree({ smooth }) {
  return (
    <>
      <DocumentTitle />
      <ScrollToTopOnNavigate />
      {smooth ? (
        <ScrollRig useLenis={smooth.useLenis} ScrollTrigger={smooth.ScrollTrigger} />
      ) : null}
      <ScrollToTopButton />
      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]">
            <div className="w-12 h-12 border-4 border-[#25A9E0] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  )
}

const INTERACTION_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown']

const App = () => {
  const [smooth, setSmooth] = useState(null)

  useEffect(() => {
    if (window.hideBlueHawkLoader) {
      window.hideBlueHawkLoader()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let idleId = null
    let timeoutId = null
    let started = false

    const onInteraction = () => loadSmooth()

    const cleanupListeners = () => {
      INTERACTION_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, onInteraction)
      })
      if (idleId != null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
        idleId = null
      }
      if (timeoutId != null) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    function loadSmooth() {
      if (started || cancelled) return
      started = true
      cleanupListeners()

      const coarse =
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (coarse) {
        Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
          ([gsapMod, stMod]) => {
            if (cancelled) return
            const gsap = gsapMod.default
            const ScrollTrigger = stMod.ScrollTrigger
            gsap.registerPlugin(ScrollTrigger)
            gsap.ticker.lagSmoothing(0)
            setSmooth({
              ReactLenis: null,
              useLenis: () => null,
              ScrollTrigger,
            })
          }
        )
        return
      }

      Promise.all([
        import('lenis/react'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]).then(([lenisMod, gsapMod, stMod]) => {
        if (cancelled) return
        const gsap = gsapMod.default
        const ScrollTrigger = stMod.ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)
        gsap.ticker.lagSmoothing(0)
        setSmooth({
          ReactLenis: lenisMod.ReactLenis,
          useLenis: lenisMod.useLenis,
          ScrollTrigger,
        })
      })
    }

    INTERACTION_EVENTS.forEach((evt) => {
      window.addEventListener(evt, onInteraction, { once: true, passive: true })
    })

    const scheduleIdle = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(loadSmooth, { timeout: 12000 })
      } else {
        timeoutId = window.setTimeout(loadSmooth, 12000)
      }
    }

    if (document.readyState === 'complete') {
      scheduleIdle()
    } else {
      window.addEventListener('load', scheduleIdle, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', scheduleIdle)
      cleanupListeners()
    }
  }, [])

  const tree = <AppTree smooth={smooth} />
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  if (!smooth) {
    return <BrowserRouter basename={basename}>{tree}</BrowserRouter>
  }

  const { ReactLenis } = smooth

  if (!ReactLenis) {
    return <BrowserRouter basename={basename}>{tree}</BrowserRouter>
  }

  return (
    <BrowserRouter basename={basename}>
      <ReactLenis
        root
        options={{
          lerp: 0.12,
          duration: 1.1,
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 1,
          anchors: true,
          autoRaf: true,
        }}
      >
        {tree}
      </ReactLenis>
    </BrowserRouter>
  )
}

export default App
