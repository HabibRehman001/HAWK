import { lazy, Suspense } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ContactSection from '../components/ContactSection';

const Footer = lazy(() => import('../components/Footer'));

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function submitContact(data) {
  try {
    const { data: payload } = await axios.post(`${API_URL}/api/contact`, data);
    if (!payload?.ok) {
      throw new Error(payload?.error || 'Failed to send message');
    }
  } catch (err) {
    const message =
      err.response?.data?.error || err.message || 'Failed to send message';
    throw new Error(message);
  }
}

function Contact() {
  return (
    <div className="page-top relative bg-[#040617] min-h-screen text-white overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <main className="pt-24 sm:pt-28">
        <ContactSection onSubmit={submitContact} />
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}

export default Contact;
