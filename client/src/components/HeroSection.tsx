import { motion } from 'framer-motion';
import { ChevronDown, DollarSign, Check, UserPlus, Play, Info } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Subtle pulsing glow effects */}
      <motion.div 
        className="absolute top-[20%] left-[15%] w-24 h-24 bg-[#00ECBE]/5 rounded-full filter blur-xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute top-[60%] right-[10%] w-32 h-32 bg-[#00ECBE]/5 rounded-full filter blur-xl"
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
            {/* VIP PREDICTION heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-poppins mb-6 tracking-wide">
              <div className="text-white">VIP</div>
              <motion.div 
                className="text-[#00ECBE]"
                initial={{ textShadow: "0 0 0px rgba(0, 236, 190, 0)" }}
                animate={{ textShadow: "0 0 20px rgba(0, 236, 190, 0.7)" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                PREDICTION
              </motion.div>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Experience the thrill of color prediction with our advanced algorithm. Make predictions, win rewards, and join thousands of successful players today.
            </p>

            {/* Three buttons: Register, Start Playing, How It Works */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button 
                className="bg-gradient-to-r from-[#7B42F6] to-[#B01EFF] text-white font-semibold px-8 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(123, 66, 246, 0.6)",
                  y: -2 
                }}
              >
                <UserPlus size={18} />
                <span>Register</span>
              </motion.button>
              <motion.button 
                className="bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                <Play size={18} />
                <span>Start Playing</span>
              </motion.button>
              <motion.button 
                className="bg-transparent border border-[#00ECBE] text-[#00ECBE] px-8 py-3 rounded-full transition duration-300 flex items-center justify-center gap-2"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                <Info size={18} />
                <span>How It Works</span>
              </motion.button>
            </div>

            {/* Money animation elements */}
            <div className="relative">
              <motion.div
                className="absolute -left-10 bottom-0 opacity-40"
                animate={{ y: [0, -80, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              >
                <DollarSign className="text-[#00ECBE] h-16 w-16" />
              </motion.div>
              <motion.div
                className="absolute right-0 bottom-10 opacity-40"
                animate={{ y: [0, -60, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <DollarSign className="text-[#00ECBE] h-16 w-16" />
              </motion.div>
              <motion.div
                className="absolute left-1/4 -bottom-5 opacity-30"
                animate={{ y: [0, -40, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <DollarSign className="text-[#00ECBE] h-12 w-12" />
              </motion.div>
              <motion.div
                className="absolute right-1/4 bottom-2 opacity-30"
                animate={{ y: [0, -50, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              >
                <DollarSign className="text-[#00ECBE] h-12 w-12" />
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-[#00ECBE] text-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
          <p className="text-xs">Scroll to explore</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
