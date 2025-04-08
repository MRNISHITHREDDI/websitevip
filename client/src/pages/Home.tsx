import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PerformanceSection from '@/components/PerformanceSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RegistrationModal from '@/components/RegistrationModal';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [showTestRegistration, setShowTestRegistration] = useState(false);
  
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
  
  const handleContinue = () => {
    setShowTestRegistration(false);
    // In a real app, this would navigate to the prediction page
    alert('Registration successful! Redirecting to predictions...');
  };

  return (
    <motion.div 
      className="bg-[#05012B] font-inter text-white overflow-x-hidden min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title="JALWA - #1 AI Color Prediction Platform | WinGo & TRX Hash VIP Signals"
        description="Get 99% accurate WinGo & TRX Hash color predictions with JALWA's advanced AI algorithm. Earn big with wingo hack and TRX win prediction techniques."
        keywords="wingo, wingo ai, wingo hack, color prediction, earning, trx hash, trx win, wingo prediction, Ai Prediction, VIP signals"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "JALWA AI Prediction Platform",
          "url": "https://jalwaprediction.com",
          "description": "Advanced AI prediction platform for WinGo and TRX Hash offering wingo hack and earning opportunities",
          "keywords": "wingo, wingo ai, wingo hack, color prediction, earning, trx hash, trx win, wingo prediction, Ai Prediction",
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
      
      {/* Test button - only visible in development */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setShowTestRegistration(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Test Registration
        </Button>
      </div>

      {/* Registration modal for testing */}
      <RegistrationModal 
        isOpen={showTestRegistration}
        onClose={() => setShowTestRegistration(false)}
        onContinue={handleContinue}
      />
    </motion.div>
  );
};

export default Home;
