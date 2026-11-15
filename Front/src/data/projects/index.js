import gridTravel from './grid-travel';
import hellox from './hellox';
import bluesio from './bluesio';
import mindfulSleepCoach from './mindful-sleep-coach';

/** WorkGrid card order (top-left → bottom-right) */
export const PROJECT_ORDER = [
  'bluesio',
  'mindful-sleep-coach',
  'hellox',
  'grid-travel',
];

const EXTRA = {
  bluesio: {
    tagline:
      "Europe's next hyperscale AI data center campus — made clear for investors and partners.",
    summary:
      'A corporate site that turns a multi-phase 710 MW hyperscale campus into a clear story — scale, timeline, and credibility without the noise.',
    meta: [
      { label: 'Client', value: 'Bluesio / IRIS' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'UI/UX, Development' },
      { label: 'Type', value: 'Data Infrastructure · Corporate' },
    ],
    stats: [
      { value: '710 MWe', label: 'Campus Electrical Power' },
      { value: '440 MWit', label: 'Deployable IT Capacity' },
      { value: '11', label: 'Planned Facilities' },
      { value: '110 MWe', label: 'Phase 1 PV Solar' },
    ],
    techStack: ['React', 'GSAP', 'Tailwind CSS'],
  },
  'mindful-sleep-coach': {
    tagline: 'Warm, trust-led web design for sleep-deprived parents.',
    summary:
      'A warm, trust-led coaching website that helps sleep-deprived parents feel understood fast — then guides them from browsing to booking a free intro call.',
    meta: [
      { label: 'Client', value: 'The Mindful Sleep Coach' },
      { label: 'Year', value: '2024' },
      { label: 'Role', value: 'UI/UX, Development' },
      { label: 'Type', value: 'Coaching · Business Website' },
    ],
    techStack: ['React', 'GSAP', 'Tailwind CSS'],
  },
  hellox: {
    tagline: 'A premier design portfolio for modern elegance and flair.',
    summary:
      'A vibrant agency portfolio where creatives can showcase bold campaigns, attract top brands, and highlight their vision in an expressive but structured interface.',
    meta: [
      { label: 'Client', value: 'HelloX' },
      { label: 'Year', value: '2024' },
      { label: 'Role', value: 'Design & Dev' },
      { label: 'Type', value: 'Design Agency' },
    ],
    techStack: ['React', 'GSAP', 'Tailwind CSS'],
  },
  'grid-travel': {
    tagline: 'Walking routes made by real travelers.',
    summary:
      'GridTravel is a community-driven travel app that helps people discover cities through walking routes created by real travelers.',
    meta: [
      { label: 'Client', value: 'GridTravel' },
      { label: 'Year', value: '2025' },
      { label: 'Role', value: 'UI/UX, Development' },
      { label: 'Type', value: 'Travel Tech · Mobile App' },
    ],
    techStack: ['React Native', 'Mapbox', 'Node.js'],
  },
};

function liveFrom(data) {
  const primary = data.hero?.ctas?.find((c) => c.variant === 'primary');
  if (!primary?.href || primary.href === '#') return '';
  return primary.href;
}

function flattenSections(data) {
  const out = [];
  for (const s of data.sections || []) {
    if (s.items?.length) {
      out.push({
        title: s.heading,
        body: s.body || '',
        bullets: s.items.map((item) => item.heading),
      });
      for (const item of s.items) {
        out.push({ title: item.heading, body: item.body });
      }
      continue;
    }
    out.push({
      title: s.heading,
      body: s.body || '',
      bullets: s.bullets,
      image: s.image,
      imageAlt: s.imageAlt,
    });
  }

  // Attach section images from mockups / first gallery shot where helpful
  if (data.slug === 'bluesio' && data.mockupHighlights) {
    const byId = Object.fromEntries(data.mockupHighlights.map((m) => [m.id, m]));
    for (const section of out) {
      if (section.title === 'Campus Overview' && byId['hero-stats']?.image) {
        section.image = byId['hero-stats'].image;
      }
      if (section.title === 'Roadmap & Location' && byId.infrastructure?.image) {
        section.image = byId.infrastructure.image;
      }
    }
    const green = byId['greener-future'];
    if (green) {
      out.push({
        title: green.heading,
        body: '',
        bullets: green.features?.map((f) => f.title) || [],
        image: green.image,
      });
    }
  }

  if (data.slug === 'grid-travel' && data.gallery?.desktop) {
    const explore = out.find((s) => s.title === 'Explore Cities Like a Local');
    if (explore) explore.image = data.gallery.desktop;
  }

  if (data.slug === 'mindful-sleep-coach' && data.gallery?.comparison) {
    const goal = out.find((s) => s.title === 'Project Goal');
    if (goal) goal.image = data.gallery.comparison;
  }

  if (data.slug === 'hellox' && data.gallery?.landing) {
    const goal = out.find((s) => s.title === 'Project Goal');
    if (goal) goal.image = data.gallery.landing;
  }

  return out;
}

function flattenGallery(data) {
  const items = [];
  const g = data.gallery || {};
  const imgs = data.images || {};

  if (data.slug === 'grid-travel') {
    for (const m of g.mobiles || []) {
      if (m.image) items.push({ src: m.image, caption: m.label, alt: m.label });
    }
  } else if (data.slug === 'hellox') {
    if (g.tiledGrid) items.push({ src: g.tiledGrid, caption: 'Responsive layouts' });
    for (const [i, src] of (g.closeups || []).entries()) {
      if (src) items.push({ src, caption: `Detail ${i + 1}` });
    }
  } else if (data.slug === 'bluesio') {
    if (g.mockup1) items.push({ src: g.mockup1, caption: 'Campus hero & stats' });
    if (g.mockup2) items.push({ src: g.mockup2, caption: 'Infrastructure & connectivity' });
    if (g.mockup3) items.push({ src: g.mockup3, caption: 'Greener future' });
  } else if (data.slug === 'mindful-sleep-coach') {
    if (g.desktopHero) items.push({ src: g.desktopHero, caption: 'Homepage hero' });
    if (g.devices) items.push({ src: g.devices, caption: 'Responsive screens' });
  }

  // Fallback: any leftover image URLs not already used
  if (!items.length) {
    for (const [key, src] of Object.entries(imgs)) {
      if (key === 'hero' || !src) continue;
      items.push({ src, alt: key });
    }
  }

  return items;
}

/** Map raw project data → ProjectPage props (without nextProject). */
export function toProjectPageProps(data) {
  const extra = EXTRA[data.slug] || {};
  return {
    category: data.hero?.badge || data.category || '',
    title: data.title,
    tagline: extra.tagline || data.hero?.subtitle || '',
    summary: extra.summary || '',
    liveUrl: liveFrom(data),
    contactHref: '/contact',
    backHref: '/',
    heroImage: data.hero?.image || data.images?.hero || '',
    heroImageAlt: data.title,
    meta: extra.meta || [],
    stats: extra.stats || [],
    sections: flattenSections(data),
    gallery: flattenGallery(data),
    techStack: extra.techStack || [],
  };
}

const RAW = {
  [bluesio.slug]: bluesio,
  [mindfulSleepCoach.slug]: mindfulSleepCoach,
  [hellox.slug]: hellox,
  [gridTravel.slug]: gridTravel,
};

export const PROJECTS = RAW;

export function getProject(slug) {
  return RAW[slug] || null;
}

export function getProjectPageProps(slug) {
  const data = getProject(slug);
  if (!data) return null;

  const props = toProjectPageProps(data);
  const idx = PROJECT_ORDER.indexOf(slug);
  const nextSlug = PROJECT_ORDER[(idx + 1) % PROJECT_ORDER.length];
  const next = RAW[nextSlug];

  props.nextProject = {
    title: next.title,
    href: `/projects/${next.slug}`,
    image: next.hero?.image || next.images?.hero || '',
    category: next.category,
  };

  return props;
}
