/** Project data for /projects/bluesio */
const framer = (id, query = '') =>
  `https://framerusercontent.com/images/${id}.png${query ? `?${query}` : ''}`;

const bluesio = {
  slug: 'bluesio',
  title: 'Bluesio',
  category: 'Data Infrastructure · Corporate Website',
  breadcrumb: 'Fully Loaded Case Study / Corporate Website',

  hero: {
    title: 'Bluesio',
    subtitle: "Europe's next hyperscale AI data center campus — made clear for investors and partners.",
    ctas: [
      { label: 'View Live Demo', href: '#', variant: 'primary' },
      { label: 'Get In Touch', href: '/contact', variant: 'secondary' },
    ],
    image: framer('66LxVNvsMD3mCk3Ihne7kJh6GQ'),
  },

  sections: [
    {
      id: 'project-goal',
      heading: 'Project Goal',
      body: 'The goal was to turn a large, technical, multi-phase data center project into a website that anyone — an investor, a hyperscale tenant, or a government partner — could understand in minutes. It needed to show scale, timeline, and credibility without overcomplicating the message.',
    },
    {
      id: 'campus-overview',
      heading: 'Campus Overview',
      body: 'The site presents IRIS as a single 710 MW campus made up of 11 facilities across two phases. Key numbers — total power, IT capacity, solar and battery storage — are shown upfront so visitors immediately understand the scale of the project.',
    },
    {
      id: 'roadmap-location',
      heading: 'Roadmap & Location',
      body: "A clear timeline walks through the phased rollout from 2027 to 2031, facility by facility. The site also highlights the campus's location near Germany and its low-latency connection to Frankfurt, making the strategic value obvious at a glance.",
    },
  ],

  mockupHighlights: [
    {
      id: 'hero-stats',
      headline: "IRIS — Europe's Next Hyperscale AI Data Center Campus",
      metrics: [
        { label: 'Total Campus Electrical Power', value: '710 MWe' },
        { label: 'Deployable IT Capacity', value: '440 MWit' },
        { label: 'Phase 1 PV Solar', value: '110 MWe' },
        { label: 'Phase 1 BESS Storage', value: '15 MWe' },
      ],
      image: framer('su12CkD9kReZCKHzZycLBwgkUe4'),
    },
    {
      id: 'infrastructure',
      heading: 'Purpose Built Infrastructure',
      callout: 'A Campus Built At Hyperscale',
      image: framer('NMRMTV0e8UQuYFq2NZRtrkPk9lo'),
    },
    {
      id: 'greener-future',
      heading: 'Powering A Greener Future',
      features: [
        { title: 'Renewable Energy Integration' },
        { title: 'Heat Recovery Solutions' },
        { title: 'Low-Carbon Energy Strategy' },
      ],
      image: framer('B6QQaOzsgUUUcnlqrtKXzsemQ'),
    },
  ],

  gallery: {
    mockup1: framer('su12CkD9kReZCKHzZycLBwgkUe4'),
    mockup2: framer('NMRMTV0e8UQuYFq2NZRtrkPk9lo'),
    mockup3: framer('B6QQaOzsgUUUcnlqrtKXzsemQ'),
  },

  images: {
    hero: framer('66LxVNvsMD3mCk3Ihne7kJh6GQ'),
    mockup1: framer('su12CkD9kReZCKHzZycLBwgkUe4'),
    mockup2: framer('NMRMTV0e8UQuYFq2NZRtrkPk9lo'),
    mockup3: framer('B6QQaOzsgUUUcnlqrtKXzsemQ'),
  },
};

export default bluesio;
