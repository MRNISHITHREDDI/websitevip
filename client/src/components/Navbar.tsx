import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jalwaLogo from '../assets/jalwa-logo.png';
import JoinProModal from './JoinProModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [joinProModalOpen, setJoinProModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const openJoinProModal = () => {
    setJoinProModalOpen(true);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-b from-[#001c54]/95 to-[#000c33]/95 backdrop-blur-sm shadow-lg py-2" 
          : "bg-gradient-to-b from-[#001c54] to-[#000c33] py-2"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center ${scrolled ? 'h-12' : 'h-14'} transition-all duration-300`}>
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <motion.img 
                  src={jalwaLogo} 
                  alt="Jalwa Games" 
                  className={`transition-all duration-300 ${scrolled ? 'h-7' : 'h-8'}`}
                  whileHover={{ scale: 1.05 }} 
                  transition={{ duration: 0.2 }}
                />
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button 
                type="button" 
                onClick={toggleMenu}
                className="text-[#00ECBE] hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-[#00ECBE] hover:text-white transition duration-300">
                Home
              </Link>
              <a 
                href="#prediction" 
                className="text-[#00ECBE] hover:text-white transition duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Prediction
              </a>
              <motion.button 
                onClick={openJoinProModal}
                className="bg-gradient-to-b from-[#001c54] to-[#000c33] border border-[#00ECBE] text-[#00ECBE] px-4 py-2 rounded-full transition duration-300"
                whileHover={{ 
                  boxShadow: '0 0 20px 0 rgba(0, 236, 190, 0.6)',
                  y: -2,
                }}
              >
                Join Pro
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden py-2 px-4 ${
                scrolled 
                  ? "bg-gradient-to-b from-[#001c54]/95 to-[#000c33]/95 backdrop-blur-sm" 
                  : "bg-gradient-to-b from-[#001c54] to-[#000c33]"
              }`}
            >
              <Link href="/" className="block text-[#00ECBE] py-2">Home</Link>
              <a 
                href="#prediction" 
                className="block text-[#00ECBE] py-2"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('prediction')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
              >
                Prediction
              </a>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openJoinProModal();
                }}
                className="mt-2 w-full bg-gradient-to-b from-[#001c54] to-[#000c33] border border-[#00ECBE] text-[#00ECBE] px-4 py-2 rounded-full transition duration-300"
              >
                Join Pro
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Join Pro Modal */}
      <JoinProModal 
        isOpen={joinProModalOpen}
        onClose={() => setJoinProModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
