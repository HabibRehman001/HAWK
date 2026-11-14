import { useEffect, useState } from 'react'
import DriftWall from './DriftWall'
import { IMG } from '../lib/unsplash'

const reviews = [
  {
    name: 'Noah Reed',
    quote:
      'As a startup founder, I needed more than design — I needed guidance. BlueHawk helped us launch our product with confidence and clarity.',
    image: IMG.team[0],
  },
  {
    name: 'Sophia Turner',
    quote:
      'BlueHawk transformed our idea into a premium website that actually converts visitors into customers. The UI feels world-class, and the process was smoother than we imagined.',
    image: IMG.team[1],
  },
  {
    name: 'Daniel Brooks',
    quote:
      'We thought building our platform would take months. Their team shipped our website and product experience faster than expected without compromising quality.',
    image: IMG.team[2],
  },
  {
    name: 'Ethan Ward',
    quote:
      'Our new website finally reflects the level of our business. Since launch, customer engagement and inquiries have increased dramatically.',
    image: IMG.team[4],
  },
  {
    name: 'Isabella Hayes',
    quote:
      'The mobile app experience they created exceeded expectations. Clean design, smooth interactions, and a product our users genuinely love to use every day.',
    image: IMG.team[3],
  },
  {
    name: 'Chloe Adams',
    quote:
      'The dashboard UI they designed completely changed how our clients interact with the platform. Everything feels intuitive and polished.',
    image: IMG.team[5],
  },
  {
    name: 'Lucas Bennett',
    quote:
      'Our app launch was a success because the team focused on both design and real user experience. The final product feels exceptional.',
    image: IMG.team[6],
  },
  {
    name: 'Emma Collins',
    quote:
      'The whole experience was faster than I expected. In under seven days, my site was live, polished, and ready for identity.',
    image: IMG.team[1],
  },
]

function columnsForWidth(width) {
  if (width < 640) return 2
  if (width < 900) return 3
  if (width < 1200) return 4
  return 5
}

const TrustSection = () => {
  const [columns, setColumns] = useState(() =>
    typeof window === 'undefined' ? 4 : columnsForWidth(window.innerWidth),
  )

  useEffect(() => {
    const update = () => setColumns(columnsForWidth(window.innerWidth))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <section
      data-snap-section
      className="relative w-full max-w-[100%] overflow-x-clip bg-[#040617] text-white px-4 sm:px-6 md:px-10 lg:px-16 pt-16 pb-10 sm:pt-24 sm:pb-16"
    >
      <div className="max-w-[1200px] mx-auto w-full mb-8 sm:mb-12">
        <p
          className="mb-3 text-[12px] sm:text-[13px] font-semibold tracking-[0.18em] uppercase text-white/55"
          style={{ fontFamily: 'Switzer, sans-serif' }}
        >
          Testimonials
        </p>
        <h2
          className="text-white text-left font-medium leading-[1.12] tracking-[-0.035em] max-w-[900px]"
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontSize: 'clamp(28px, 6vw, 64px)',
          }}
        >
          Trusted by teams who value execution over noise.
        </h2>
      </div>

      <div className="relative w-full h-[62vh] min-h-[480px] max-h-[760px]">
        <DriftWall
          items={reviews}
          columns={columns}
          tileWidth={columns < 3 ? 220 : columns < 5 ? 260 : 280}
          tileHeight={columns < 3 ? 220 : 245}
          gap={16}
          radius={18}
          speed={32}
          tilt={8}
          turn={-6}
          depth={70}
          dim={0.8}
          fade={0.5}
          lift={40}
          parallax={0.35}
          overlayColor="transparent"
        />
      </div>
    </section>
  )
}

export default TrustSection
