/** Stable Unsplash CDN URLs (photo id + optional size). */
export const unsplash = (photoId, { w = 800, h, q = 80 } = {}) => {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(w),
    q: String(q),
  })
  if (h) params.set('h', String(h))
  return `https://images.unsplash.com/${photoId}?${params.toString()}`
}

/** Framer CDN project shots (after-hero WorkGrid + hero morph card). */
const framer = (id, query = '') =>
  `https://framerusercontent.com/images/${id}.png${query ? `?${query}` : ''}`

export const IMG = {
  hero: framer('66LxVNvsMD3mCk3Ihne7kJh6GQ', 'width=1072&height=800'),
  heroSrcSet: [
    `${framer('66LxVNvsMD3mCk3Ihne7kJh6GQ', 'scale-down-to=512&width=1072&height=800')} 512w`,
    `${framer('66LxVNvsMD3mCk3Ihne7kJh6GQ', 'scale-down-to=1024&width=1072&height=800')} 1024w`,
    `${framer('66LxVNvsMD3mCk3Ihne7kJh6GQ', 'width=1072&height=800')} 1072w`,
  ].join(', '),
  work1: framer('10WmC8J9zNUpOrF26QNUNyyEAhs', 'scale-down-to=2048&width=3216&height=2400'),
  work1SrcSet: [
    `${framer('10WmC8J9zNUpOrF26QNUNyyEAhs', 'scale-down-to=512&width=3216&height=2400')} 512w`,
    `${framer('10WmC8J9zNUpOrF26QNUNyyEAhs', 'scale-down-to=1024&width=3216&height=2400')} 1024w`,
    `${framer('10WmC8J9zNUpOrF26QNUNyyEAhs', 'scale-down-to=2048&width=3216&height=2400')} 2048w`,
    `${framer('10WmC8J9zNUpOrF26QNUNyyEAhs', 'width=3216&height=2400')} 3216w`,
  ].join(', '),
  work2: framer('131vZJMGdDCNW7hNkGXiU0pYxCU', 'width=1600&height=1200'),
  work2SrcSet: [
    `${framer('131vZJMGdDCNW7hNkGXiU0pYxCU', 'scale-down-to=512&width=1600&height=1200')} 512w`,
    `${framer('131vZJMGdDCNW7hNkGXiU0pYxCU', 'scale-down-to=1024&width=1600&height=1200')} 1024w`,
    `${framer('131vZJMGdDCNW7hNkGXiU0pYxCU', 'width=1600&height=1200')} 1600w`,
  ].join(', '),
  work3: framer('8xLrRzZbgbv1RdUHxqCJiAgRRI', 'width=1072&height=800'),
  work3SrcSet: [
    `${framer('8xLrRzZbgbv1RdUHxqCJiAgRRI', 'scale-down-to=512&width=1072&height=800')} 512w`,
    `${framer('8xLrRzZbgbv1RdUHxqCJiAgRRI', 'scale-down-to=1024&width=1072&height=800')} 1024w`,
    `${framer('8xLrRzZbgbv1RdUHxqCJiAgRRI', 'width=1072&height=800')} 1072w`,
  ].join(', '),
  work4: unsplash('photo-1467232004584-a241de8bcf5d', { w: 900, h: 700 }),
  aboutBw: unsplash('photo-1522071820081-009f0129c71c', { w: 1200, h: 800 }),
  aboutColor: unsplash('photo-1600880292203-757bb62b4baf', { w: 1200, h: 800 }),
  uiux: unsplash('photo-1561070791-2526d30994b5', { w: 640, h: 480 }),
  cms: unsplash('photo-1498050108023-c5249f4df085', { w: 640, h: 480 }),
  app: unsplash('photo-1512941937669-90a1b58e7e9c', { w: 400, h: 700 }),
  api: unsplash('photo-1558494949-ef010cbdcc31', { w: 640, h: 480 }),
  tech: [
    unsplash('photo-1677442136019-21780ecad995', { w: 200, h: 200 }),
    unsplash('photo-1620712943543-bcc4688e7485', { w: 200, h: 200 }),
    unsplash('photo-1618005182384-a83a8bd57fbe', { w: 200, h: 200 }),
    unsplash('photo-1555066931-4365d14bab8c', { w: 200, h: 200 }),
    unsplash('photo-1485827404703-89b55fcc595e', { w: 200, h: 200 }),
  ],
  team: [
    unsplash('photo-1507003211169-0a1dd7228f2d', { w: 400, h: 400 }),
    unsplash('photo-1494790108377-be9c29b29330', { w: 400, h: 400 }),
    unsplash('photo-1500648767791-00dcc994a43e', { w: 400, h: 400 }),
    unsplash('photo-1438761681033-6461ffad8d80', { w: 400, h: 400 }),
    unsplash('photo-1472099645785-5658abf4ff4e', { w: 400, h: 400 }),
    unsplash('photo-1544005313-94ddf0286df2', { w: 400, h: 400 }),
    unsplash('photo-1517841905240-472988babdf9', { w: 400, h: 400 }),
  ],
  play: [
    unsplash('photo-1522071820081-009f0129c71c', { w: 1000, h: 700 }),
    unsplash('photo-1556761175-5973dc0f32e7', { w: 1000, h: 700 }),
    unsplash('photo-1519389950473-47ba0277781c', { w: 1000, h: 700 }),
    unsplash('photo-1531482615713-2afd69097998', { w: 1000, h: 700 }),
  ],
}
