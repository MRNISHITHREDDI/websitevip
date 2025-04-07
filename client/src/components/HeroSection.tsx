import { motion } from "framer-motion";
import { ChevronDown, Check, UserPlus, Play, Info } from "lucide-react";
import { useEffect } from "react";

const HeroSection = () => {
  // Add scroll event listener to hide/show the scroll indicator
  useEffect(() => {
    const scrollIndicator = document.getElementById("scroll-indicator");
    
    const handleScroll = () => {
      // Get the scroll position
      const scrollPosition = window.scrollY;
      
      // Get the height of the hero section (approximately)
      const heroSectionHeight = window.innerHeight * 0.5; // Hide after scrolling 50% of view height
      
      // Hide the scroll indicator when scrolled past the hero section
      if (scrollIndicator) {
        if (scrollPosition > heroSectionHeight) {
          scrollIndicator.style.opacity = "0";
          scrollIndicator.style.pointerEvents = "none";
        } else {
          scrollIndicator.style.opacity = "1";
          scrollIndicator.style.pointerEvents = "auto";
        }
      }
    };
    
    // Execute once on load
    handleScroll();
    
    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-[#05012B]">
      {/* Solid background color */}

      {/* Subtle pulsing glow effects */}
      <motion.div
        className="absolute top-[20%] left-[15%] w-24 h-24 bg-[#00ECBE]/5 rounded-full filter blur-xl z-10"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] right-[10%] w-32 h-32 bg-[#00ECBE]/5 rounded-full filter blur-xl z-10"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center">
          <motion.div
            className="w-full max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* VIP PREDICTION heading on same line */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-poppins mb-6 tracking-wide flex justify-center items-center">
              <span className="text-white mr-4">VIP</span>
              <motion.span 
                className="text-[#00ECBE]"
                initial={{ textShadow: "0 0 0px rgba(0, 236, 190, 0)" }}
                animate={{ textShadow: "0 0 20px rgba(0, 236, 190, 0.7)" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                PREDICTION
              </motion.span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Experience the thrill of color prediction with our advanced
              algorithm. Make predictions, win rewards, and join thousands of
              successful players today.
            </p>

            {/* Three buttons: Register, Start Playing, How It Works */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
              <motion.button
                className="bg-gradient-to-r from-[#7B42F6] to-[#B01EFF] text-white font-semibold px-8 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                whileHover={{
                  boxShadow: "0 0 20px 0 rgba(123, 66, 246, 0.6)",
                  y: -2,
                }}
              >
                <UserPlus size={18} />
                <span>Register</span>
              </motion.button>
              <motion.button
                className="bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                whileHover={{
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2,
                }}
              >
                <Play size={18} />
                <span>Start Playing</span>
              </motion.button>
              <motion.button
                className="bg-transparent border border-[#00ECBE] text-[#00ECBE] px-8 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                whileHover={{
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2,
                }}
              >
                <Info size={18} />
                <span>How It Works</span>
              </motion.button>
            </div>

            {/* Removed money animation elements as requested */}
            
            {/* Scroll indicator directly below buttons with 5px gap */}
            <motion.div
              className="mt-5 inline-block text-[#00ECBE] text-center bg-[#05012B]/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-[0_0_15px_rgba(0,236,190,0.3)] transition-opacity duration-500"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              id="scroll-indicator"
            >
              <div className="flex items-center gap-2">
                <ChevronDown size={20} />
                <p className="text-sm font-medium">Scroll to explore</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
