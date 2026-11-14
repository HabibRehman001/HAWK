/** Project data for /projects/mindful-sleep-coach */
const framer = (id, query = '') =>
  `https://framerusercontent.com/images/${id}.png${query ? `?${query}` : ''}`;

const mindfulSleepCoach = {
  slug: 'mindful-sleep-coach',
  title: 'The Mindful Sleep Coach',
  category: 'Coaching · Business Website',
  breadcrumb: null,

  hero: {
    title: 'The Mindful Sleep Coach',
    badge: 'Coaching · Business Website',
    subtitle: 'Warm, trust-led web design for sleep-deprived parents.',
    ctas: [
      { label: 'View Live Demo', href: '#', variant: 'primary' },
      { label: 'Get In Touch', href: '/contact', variant: 'secondary' },
    ],
    image: framer('10WmC8J9zNUpOrF26QNUNyyEAhs'),
  },

  sections: [
    {
      id: 'project-goal',
      heading: 'Project Goal',
      body: 'The goal was to turn a deeply personal, trust-based service into a website that feels warm and reassuring rather than clinical — helping sleep-deprived parents feel understood within seconds, while clearly guiding them from "just looking" to booking a free intro call.',
    },
    {
      id: 'packages-booking',
      heading: 'Packages & Booking',
      body: 'Clear package tiers (Intro Call, Early Years Deluxe, Toddler Deluxe) show pricing and age ranges upfront, so parents can quickly find the right fit and book without needing to message first. Downloadable guides and routines give visitors a lower-commitment way to engage before booking a paid package.',
    },
    {
      id: 'social-proof',
      heading: 'Social Proof & Trust',
      body: "With dozens of detailed testimonials, awards, and \"as featured in\" partner logos, the homepage leans heavily on real results and credibility — reassuring anxious parents that Gemma's gentle, responsive approach has worked for families in situations just like theirs.",
    },
  ],

  gallery: {
    comparison: framer('Y10P9w4L7OiKNsvQSDEJZialfw'),
    desktopHero: framer('ryePwIbqs0VOlTrCD8WzZlq4'),
    devices: framer('Slpd8Yu7uz3xsJkidO1xyXcsGUw'),
  },

  images: {
    hero: framer('10WmC8J9zNUpOrF26QNUNyyEAhs'),
    comparison: framer('Y10P9w4L7OiKNsvQSDEJZialfw'),
    desktopHero: framer('ryePwIbqs0VOlTrCD8WzZlq4'),
    devices: framer('Slpd8Yu7uz3xsJkidO1xyXcsGUw'),
  },
};

export default mindfulSleepCoach;
