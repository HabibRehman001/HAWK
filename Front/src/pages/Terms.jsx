import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';

const Footer = lazy(() => import('../components/Footer'));

const TERMS_SECTIONS = [
  {
    title: 'Acceptance of Terms',
    paragraphs: [
      'By using our website and services, you agree to comply with and be bound by these terms and conditions. Please read them carefully before using our site. Your use of the site signifies your acceptance of these terms.',
    ],
  },
  {
    title: 'Eligibility',
    paragraphs: [
      'By accessing our website, you confirm that you are at least 18 years old or have the legal authority to agree to these terms.',
      'You agree to use the site only for lawful purposes and in compliance with all applicable laws and regulations.',
      'Unauthorized access or misuse may result in termination of your access.',
    ],
  },
  {
    title: 'Intellectual Property',
    paragraphs: [
      'All content on this website, including text, images, logos, graphics, and designs, is the property of BlueHawk or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, modify, or use any content without prior written consent from BlueHawk.',
    ],
  },
  {
    title: 'User-Submitted Content',
    paragraphs: [
      'If you submit content to us, such as feedback, testimonials, or project details, you grant BlueHawk a non-exclusive, royalty-free, and irrevocable license. This allows us to use, modify, and display the content for promotional or operational purposes. You warrant that any submitted content is original and does not infringe on third-party rights.',
    ],
  },
  {
    title: 'No Warranties',
    paragraphs: [
      'Our website and services are provided “as is” without any guarantees or warranties. We do not warrant the accuracy, reliability, completeness, or availability of the content on our website. BlueHawk is not responsible for any interruptions or technical issues affecting site access.',
    ],
  },
  {
    title: 'Limitation of Liability',
    paragraphs: [
      'BlueHawk is not liable for any indirect, incidental, or consequential damages arising from your use of our website or services. This includes, but is not limited to, loss of data, revenue, profits, or business opportunities.',
    ],
  },
  {
    title: 'Third-Party Links',
    paragraphs: [
      'Our website may contain links to third-party websites or services. BlueHawk is not responsible for the content, policies, or practices of any third-party sites. Accessing those links is at your own risk.',
    ],
  },
  {
    title: 'Termination',
    paragraphs: [
      'We reserve the right to terminate or suspend your access to our website without notice. Termination may occur if you violate these terms or engage in conduct harmful to our business or users. Upon termination, your right to use the site will immediately cease.',
    ],
  },
  {
    title: 'Changes to Terms',
    paragraphs: [
      'We may update these terms and conditions periodically to reflect changes in our practices or legal requirements. Updates will be posted on this page, and your continued use of the website constitutes acceptance of any changes. We recommend reviewing these terms regularly.',
    ],
  },
  {
    title: 'Governing Law',
    paragraphs: [
      'These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom. Any disputes arising from these terms will be resolved exclusively in the courts of the United Kingdom. You consent to the jurisdiction of these courts for any legal proceedings.',
    ],
  },
  {
    title: 'Contact Information',
    paragraphs: [
      'If you have questions about these Terms & Conditions or how your data is handled, please contact us at:',
    ],
  },
];

function Terms() {
  return (
    <div className="page-top relative bg-[#040617] min-h-screen text-white overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <main>
        <section
          data-snap-section
          className="relative w-screen min-h-[50vh] h-[50vh] flex flex-col items-center justify-center px-6"
          style={{ background: '#040617' }}
        >
          <p
            className="mb-4 text-[12px] sm:text-[13px] font-medium tracking-[0.12em] uppercase text-white/55"
            style={{ fontFamily: 'Switzer, sans-serif' }}
          >
            Last update: Jan 15, 2026
          </p>
          <h1
            className="text-center text-white font-medium tracking-tight leading-[1.1] max-w-[90vw]"
            style={{
              fontFamily: 'Switzer, sans-serif',
              fontSize: 'clamp(1.5rem, 9vw, 72px)',
              letterSpacing: '-0.03em',
            }}
          >
            Terms And Conditions
          </h1>
        </section>

        <section
          data-snap-section
          className="relative w-full bg-white text-[#111] rounded-t-[32px] md:rounded-t-[48px] -mt-6 z-10"
        >
          <div className="max-w-[820px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10 md:pb-12">
            <div className="flex flex-col gap-10 md:gap-14">
              {TERMS_SECTIONS.map((section, index) => (
                <article key={section.title} className="flex flex-col gap-4">
                  <h2
                    className="font-semibold tracking-tight text-[#111]"
                    style={{
                      fontFamily: 'Switzer, sans-serif',
                      fontSize: 'clamp(22px, 3vw, 28px)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {index + 1}. {section.title}
                  </h2>
                  {section.paragraphs?.map((p) => (
                    <p
                      key={p.slice(0, 48)}
                      className="text-[#333] text-[15px] md:text-[17px] leading-[1.65] font-medium tracking-[-0.01em]"
                      style={{ fontFamily: 'Switzer, sans-serif' }}
                    >
                      {p}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>

          <hr className="w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 border-0 border-t border-[#e5e5e5] m-0" />

          <div className="max-w-[820px] mx-auto px-6 md:px-10 pt-10 md:pt-12 pb-16 md:pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16">
              <div>
                <h3
                  className="font-semibold text-[#111] mb-2"
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontSize: 'clamp(18px, 2.5vw, 22px)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Email
                </h3>
                <a
                  href="mailto:info@bluehawk.com"
                  className="text-[#666] text-[15px] md:text-[16px] font-medium no-underline hover:text-[#25A9E0] transition-colors"
                  style={{ fontFamily: 'Switzer, sans-serif' }}
                >
                  info@bluehawk.com
                </a>
              </div>
              <div>
                <h3
                  className="font-semibold text-[#111] mb-2"
                  style={{
                    fontFamily: 'Switzer, sans-serif',
                    fontSize: 'clamp(18px, 2.5vw, 22px)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Phone
                </h3>
                <a
                  href="tel:+447426431535"
                  className="text-[#666] text-[15px] md:text-[16px] font-medium no-underline hover:text-[#25A9E0] transition-colors"
                  style={{ fontFamily: 'Switzer, sans-serif' }}
                >
                  +44 7426 431535
                </a>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}

export default Terms;
