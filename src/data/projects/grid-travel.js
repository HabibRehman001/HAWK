/** Project data for /projects/grid-travel */
const framer = (id, query = '') =>
  `https://framerusercontent.com/images/${id}.png${query ? `?${query}` : ''}`;

const gridTravel = {
  slug: 'grid-travel',
  title: 'Grid Travel',
  category: 'Travel Tech · Mobile App',
  breadcrumb: null,

  hero: {
    title: 'Grid Travel',
    subtitle: 'Walking routes made by real travelers.',
    ctas: [
      { label: 'View Live Demo', href: '#', variant: 'primary' },
      { label: 'Get In Touch', href: '/contact', variant: 'secondary' },
    ],
    image: framer('8xLrRzZbgbv1RdUHxqCJiAgRRI'),
  },

  sections: [
    {
      id: 'explore-cities',
      heading: 'Explore Cities Like a Local',
      body: 'GridTravel is a community-driven travel app designed to help people discover cities through walking routes created by real travelers. Instead of spending hours planning what to see and where to go, users can explore curated routes, follow local tips, and navigate their way through a city.',
    },
    {
      id: 'project-goal',
      heading: 'Project Goal',
      body: 'The goal was to create a simple and engaging travel experience that makes discovering a city feel more personal and effortless. GridTravel brings exploration, navigation, local recommendations, and community-created routes together in one platform.',
    },
    {
      id: 'explore',
      heading: 'Explore',
      body: 'Users can browse walking routes shared by other travelers, discover routes based on their interests, and follow creators whose recommendations they trust.',
    },
    {
      id: 'navigate',
      heading: 'Navigate',
      body: 'Once a route is selected, users can start guided navigation and follow the route while discovering tips and recommendations from its creator. Routes can also be downloaded for offline walking.',
    },
    {
      id: 'create',
      heading: 'Create',
      body: 'GridTravel allows travelers to build their own routes, add stops and tips, keep routes private, or publish them for the community. Users can also invite collaborators and build routes together.',
    },
    {
      id: 'community',
      heading: 'Community-Driven Travel',
      body: 'Rather than relying only on traditional travel guides, GridTravel puts travelers and their experiences at the center of the discovery process. Every route can become a personal guide to the places, stops, and experiences worth exploring.',
    },
    {
      id: 'experience',
      heading: 'The Experience',
      body: 'The product combines route discovery, guided navigation, local knowledge, and collaborative travel planning into one seamless experience—helping travelers spend less time planning and more time exploring.',
    },
  ],

  gallery: {
    desktop: framer('QLMyM8OYWIMm1pm6KKgxAy0aLZE'),
    mobiles: [
      { label: 'Explore', image: framer('iGUesAaiS2ptyewhBf7pkkLS3Ko') },
      { label: 'Navigate', image: framer('geWIXgm4BJAgYxvHB7dZAUaOQ') },
      { label: 'Create', image: '' },
    ],
  },

  appCta: {
    heading: 'Ready to travel?',
    buttonLabel: 'Download on the App Store',
    href: '#',
  },

  images: {
    hero: framer('8xLrRzZbgbv1RdUHxqCJiAgRRI'),
    desktop: framer('QLMyM8OYWIMm1pm6KKgxAy0aLZE'),
    mobileExplore: framer('iGUesAaiS2ptyewhBf7pkkLS3Ko'),
    mobileNavigate: framer('geWIXgm4BJAgYxvHB7dZAUaOQ'),
    mobileCreate: '',
  },
};

export default gridTravel;
