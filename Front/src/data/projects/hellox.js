/** Project data for /projects/hellox */
const framer = (id, query = '') =>
  `https://framerusercontent.com/images/${id}.png${query ? `?${query}` : ''}`;

const hellox = {
  slug: 'hellox',
  title: 'HelloX Website',
  category: 'Design Agency',
  breadcrumb: null,

  hero: {
    title: 'HelloX Website',
    badge: 'Design Agency',
    subtitle: 'A premier design portfolio for modern elegance and flair.',
    ctas: [
      { label: 'View Live Demo', href: '#', variant: 'primary' },
      { label: 'Get In Touch', href: '/contact', variant: 'secondary' },
    ],
    image: framer('131vZJMGdDCNW7hNkGXiU0pYxCU'),
  },

  sections: [
    {
      id: 'project-goal',
      heading: 'Project Goal',
      body: 'The objective was to design a vibrant agency portfolio where creatives could showcase bold campaigns, attract top brands, and highlight their vision effortlessly. The focus was on creating an expressive interface that sparked imagination while maintaining a highly structured design.',
    },
    {
      id: 'design-approach',
      heading: 'Design Approach',
      items: [
        {
          heading: 'Typography',
          body: 'A bold, expressive typeface was chosen to reflect the artistic and boundary-pushing nature of a modern creative agency.',
        },
        {
          heading: 'Color Palette',
          body: 'Bright and energetic gradients were used to enhance visual impact and give the website a playful, highly memorable feel.',
        },
        {
          heading: 'Icons & Graphics',
          body: 'Quirky yet polished graphics were incorporated to ensure brand consistency, complementing the wildly creative user experience.',
        },
        {
          heading: 'User-Centered Layout',
          body: 'The grid was creatively structured to maximize visual storytelling, making project exploration and client discovery effortless.',
        },
      ],
    },
    {
      id: 'interaction-design',
      heading: 'Interaction Design',
      body: 'Playful micro-animations and smooth parallax were integrated to bring the site to life. The use of custom cursor trails, energetic hovers, and engaging motion effects made the portfolio feel incredibly dynamic, capturing immediate attention.',
    },
  ],

  gallery: {
    landing: framer('P8FHV7SspLTJUD2Jo9Or2GpCP8'),
    tiledGrid: framer('rGnyPg26BBx4mEL8F5rK0VO3Gdw'),
    closeups: [
      framer('obcCZpJWM3IrgWoctN0X8Zpac'),
      framer('zw6SiuOuuh0Mgwk9bYznhzbyw'),
    ],
  },

  images: {
    hero: framer('131vZJMGdDCNW7hNkGXiU0pYxCU'),
    landing: framer('P8FHV7SspLTJUD2Jo9Or2GpCP8'),
    tiledGrid: framer('rGnyPg26BBx4mEL8F5rK0VO3Gdw'),
    closeup1: framer('obcCZpJWM3IrgWoctN0X8Zpac'),
    closeup2: framer('zw6SiuOuuh0Mgwk9bYznhzbyw'),
  },
};

export default hellox;
