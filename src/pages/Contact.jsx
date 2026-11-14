import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';

const Footer = lazy(() => import('../components/Footer'));

function Contact() {
  return (
    <div className="page-top relative bg-[#040617] min-h-screen text-white overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <main className="pt-20">
        <ContactSection />
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}

export default Contact;
