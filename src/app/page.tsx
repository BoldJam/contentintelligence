import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ComplianceSection from '@/components/ComplianceSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-900">
      <Hero />
      <Features />
      <ComplianceSection />
      <Footer />
    </main>
  );
}
