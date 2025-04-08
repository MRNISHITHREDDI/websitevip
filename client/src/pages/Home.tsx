import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PerformanceSection from '@/components/PerformanceSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import SEO from '@/components/SEO';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId as string);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 100, // Increased offset for fixed navbar
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <motion.div 
      className="bg-[#05012B] font-inter text-white overflow-x-hidden min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title="JALWA - #1 Color Prediction Platform | WinGo & TRX Hash VIP Signals"
        description="Get 99% accurate WinGo & TRX Hash color predictions with JALWA's advanced algorithm. Earn big with real-time predictions across multiple time intervals."
        keywords="color prediction, WinGo prediction, TRX Hash prediction, winning strategy, online earning, VIP prediction signals, betting tips, gambling strategy, color forecast"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "JALWA Prediction Platform",
          "url": "https://jalwaprediction.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://jalwaprediction.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PerformanceSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </motion.div>
  );
};

export default Home;
