import { useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WorkGrid from '../components/WorkGrid';
import AboutAndVideo from '../components/AboutAndVideo';
import WhatWeDo from '../components/WhatWeDo';
import ToolsSection from '../components/ToolsSection';
import TeamSection from '../components/TeamSection';
import GlobalPartners from '../components/GlobalPartners';
import TrustSection from '../components/TrustSection';
import Footer from '../components/Footer';

function Home() {
  const heroImageRef = useRef(null);

  return (
    <div className="page-top relative bg-[#040617] min-h-screen text-white overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <main>
        <HeroSection heroImageRef={heroImageRef} />
        <WorkGrid heroImageRef={heroImageRef} />
        <AboutAndVideo />
        <WhatWeDo />
        <ToolsSection />
        <TeamSection />
        <GlobalPartners />
        <TrustSection />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
