import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Globe } from 'lucide-react';
import './GlobalPartners.css';

const REGIONS = [
  { code: 'us', name: 'United States', desc: 'Startups & growing businesses' },
  { code: 'eu', name: 'Europe', desc: 'Digital-first companies' },
  { code: 'ae', name: 'GCC', desc: 'Ambitious regional brands' },
  { code: 'au', name: 'Australia', desc: 'Service-led businesses' },
];

// Coarse world land mask (. = ocean, # = land). Stretched across the panel.
const MASK = [
  '............####......##.....#...##########................',
  '......#########.....###...####.################............',
  '.....###########....####..#######################..........',
  '....############.....##..##########################.........',
  '....###########.........############################........',
  '.....##########.........###.########################.......',
  '......########..........#####.#####################........',
  '.......#######...........###...###########.#####..#.........',
  '.........#####...........####....########..###..###........',
  '..........###.............#####....######....#....##........',
  '...........##.....##.......#####....####........###.........',
  '..................####.....#######.....##.......####........',
  '..................#####....########..............######.....',
  '...................#####...#######..............#######.....',
  '...................#####....######..............#######.....',
  '....................####.....#####...............####.......',
  '....................###......####.................##........',
  '....................##.......###...........................',
  '....................#........##............................',
];
const MW = 60;
const MH = MASK.length;
const isLand = (u, v) => {
  const c = Math.min(MW - 1, Math.floor(u * MW));
  const r = Math.min(MH - 1, Math.floor(v * MH));
  return MASK[r][c] === '#';
};

const quad = (a, c, b, t) => {
  const m = 1 - t;
  return {
    x: m * m * a.x + 2 * m * t * c.x + t * t * b.x,
    y: m * m * a.y + 2 * m * t * c.y + t * t * b.y,
  };
};

export default function GlobalPartners() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const flagRefs = useRef([]);
  const cardRefs = useRef([]);

  // Canvas: living dot-map, flowing arcs, travelling pulses
  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = panelRef.current;
    if (!canvas || !panel) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let nodes = [];
    let raf = 0;
    let visible = true;
    const STEP = 10;

    const measure = () => {
      const r = panel.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = flagRefs.current.filter(Boolean).map((el) => {
        const b = el.getBoundingClientRect();
        return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 };
      });
    };

    const arcs = () => {
      const out = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i];
        const b = nodes[i + 1];
        if (Math.abs(a.y - b.y) > 20) continue;
        const mx = (a.x + b.x) / 2;
        out.push({ a, b, c: { x: mx, y: a.y - h * 0.3 }, i, main: true });
        out.push({ a, b, c: { x: mx, y: a.y + h * 0.12 }, i, main: false });
      }
      return out;
    };

    const draw = (time) => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = reduce ? 0 : time / 1000;
      ctx.clearRect(0, 0, w, h);
      const A = arcs();

      const heads = A.filter((s) => s.main).map((s) => {
        const p = (t * 0.22 + s.i * 0.31) % 1;
        return quad(s.a, s.c, s.b, 0.08 + p * 0.84);
      });

      for (let x = STEP / 2; x < w; x += STEP) {
        for (let y = STEP / 2; y < h; y += STEP) {
          const u = x / w;
          const v = y / h;
          const land = isLand(u, v);
          const wave = 0.5 + 0.5 * Math.sin(x * 0.018 - t * 1.4 + y * 0.025);
          let a = land ? 0.1 + wave * 0.28 : 0.025 + wave * 0.03;
          let r = land ? 1.2 : 0.7;
          for (const p of heads) {
            const d = Math.hypot(x - p.x, y - p.y);
            if (d < 70) {
              const k = 1 - d / 70;
              a += k * 0.6;
              r += k * 0.9;
            }
          }
          const edge = Math.min(u, 1 - u, v * 2.2, (1 - v) * 2.2, 0.12) / 0.12;
          ctx.fillStyle = `rgba(125,195,255,${Math.min(a, 1) * edge})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 6.283);
          ctx.fill();
        }
      }

      for (const s of A) {
        const N = 38;
        for (let k = 0; k < N; k++) {
          const u = 0.08 + 0.84 * (((k / N) + t * 0.04) % 1);
          const p = quad(s.a, s.c, s.b, u);
          const edge = Math.sin(Math.PI * ((u - 0.08) / 0.84));
          ctx.fillStyle = `rgba(160,215,255,${(s.main ? 0.75 : 0.28) * edge})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s.main ? 1.4 : 1, 0, 6.283);
          ctx.fill();
        }
        if (s.main) {
          const p0 = (t * 0.22 + s.i * 0.31) % 1;
          for (let k = 0; k < 14; k++) {
            const u = 0.08 + Math.max(0, p0 - k * 0.012) * 0.84;
            const p = quad(s.a, s.c, s.b, u);
            ctx.fillStyle = `rgba(90,175,255,${(1 - k / 14) * 0.9})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.2 - k * 0.18, 0, 6.283);
            ctx.fill();
          }
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    measure();
    raf = requestAnimationFrame(draw);
    if (reduce) draw(0);

    const ro = new ResizeObserver(() => {
      measure();
      if (reduce) draw(0);
    });
    ro.observe(panel);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(panel);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, y: 22 });
      gsap.set(panelRef.current, { opacity: 0, scale: 0.97 });
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          gsap
            .timeline()
            .to(panelRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' })
            .to(
              cardRefs.current.filter(Boolean),
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
              '-=0.5'
            );
        },
        { threshold: 0.25 }
      );
      if (rootRef.current) io.observe(rootRef.current);

      flagRefs.current.filter(Boolean).forEach((el, i) => {
        gsap.to(el, {
          y: -5,
          duration: 2 + i * 0.35,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.25,
        });
      });

      return () => io.disconnect();
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="gp" data-snap-section>
      <h2 className="gp-title">BLUE HAWKE</h2>

      <p className="gp-eyebrow">
        <Globe size={16} strokeWidth={1.6} />
        Global client partnerships
      </p>
      <h3 className="gp-headline">Built remotely. Trusted across borders.</h3>
      <p className="gp-sub">
        Partnering with ambitious businesses across the United States, Europe, the GCC and Australia.
      </p>

      <div ref={panelRef} className="gp-panel">
        <canvas ref={canvasRef} className="gp-canvas" aria-hidden="true" />
        <ul className="gp-grid">
          {REGIONS.map((r, i) => (
            <li key={r.code} ref={(el) => (cardRefs.current[i] = el)} className="gp-card">
              <div ref={(el) => (flagRefs.current[i] = el)} className="gp-flag">
                <span className="gp-ping" />
                <span className="gp-ring gp-ring--a" />
                <span className="gp-ring gp-ring--b" />
                <img
                  src={`https://flagcdn.com/w80/${r.code}.png`}
                  alt=""
                  width="54"
                  height="54"
                />
              </div>
              <h4>{r.name}</h4>
              <p>{r.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
