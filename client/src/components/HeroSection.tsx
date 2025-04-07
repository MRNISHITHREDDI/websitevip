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
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* VIP PREDICTION heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-poppins mb-6 tracking-wide">
              <div className="text-white">VIP</div>
              <motion.div 
                className="text-[#00ECBE] mt-1"
                initial={{ textShadow: "0 0 0px rgba(0, 236, 190, 0)" }}
                animate={{ textShadow: "0 0 20px rgba(0, 236, 190, 0.7)" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                PREDICTION
              </motion.div>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Experience the thrill of color prediction with our advanced algorithm. Make predictions, win rewards, and join thousands of successful players today.
            </p>

            {/* Three buttons: Register, Start Playing, How It Works */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
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
                className="absolute -left-10 -top-10 opacity-40"
                animate={{ y: [0, -80, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              >
                <DollarSign className="text-[#00ECBE] h-16 w-16" />
              </motion.div>
              <motion.div
                className="absolute left-20 -top-5 opacity-20"
                animate={{ y: [0, -60, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <DollarSign className="text-[#7B42F6] h-12 w-12" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Main container that resembles the image you shared */}
                <div className="rounded-lg border border-[#00ECBE]/30 bg-[#052652] p-4" 
                    style={{ boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.3)" }}>
                  
                  {/* 100% Accurate Prediction box */}
                  <div className="mb-6 relative">
                    <motion.div 
                      className="bg-[#052652] border border-[#00ECBE]/30 rounded-lg p-3 flex items-center gap-2"
                      animate={{ boxShadow: ["0 0 5px rgba(0, 236, 190, 0.2)", "0 0 10px rgba(0, 236, 190, 0.4)", "0 0 5px rgba(0, 236, 190, 0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#00ECBE] flex items-center justify-center">
                        <Check className="h-4 w-4 text-[#052652]" />
                      </div>
                      <div>
                        <p className="text-[#00ECBE] font-semibold text-lg">100%</p>
                        <p className="text-sm text-gray-300">Accurate Prediction</p>
                      </div>
                    </motion.div>
                    
                    {/* Floating dollar signs */}
                    <motion.div 
                      className="absolute -bottom-4 left-8 text-[#00ECBE]"
                      animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <DollarSign size={18} />
                    </motion.div>
                    <motion.div 
                      className="absolute -bottom-6 left-20 text-[#00ECBE]"
                      animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <DollarSign size={20} />
                    </motion.div>
                    <motion.div 
                      className="absolute -bottom-4 left-32 text-[#00ECBE]"
                      animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <DollarSign size={16} />
                    </motion.div>
                  </div>
                  
                  {/* Predict & Earn Big box */}
                  <div className="mb-6">
                    <motion.div 
                      className="bg-[#052652] border border-[#00ECBE]/30 rounded-lg p-4 flex justify-center"
                      animate={{ boxShadow: ["0 0 5px rgba(0, 236, 190, 0.2)", "0 0 10px rgba(0, 236, 190, 0.4)", "0 0 5px rgba(0, 236, 190, 0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <motion.p 
                        className="text-[#00ECBE] font-semibold text-2xl"
                        animate={{ textShadow: ["0 0 5px rgba(0, 236, 190, 0)", "0 0 10px rgba(0, 236, 190, 0.5)", "0 0 5px rgba(0, 236, 190, 0)"] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        Predict & Earn Big
                      </motion.p>
                    </motion.div>
                  </div>
                  
                  {/* Earn Big & Win instantly box */}
                  <div className="relative flex justify-end">
                    <motion.div 
                      className="bg-[#052652] border border-[#00ECBE]/30 rounded-lg p-3 flex items-center gap-3 max-w-[240px]"
                      animate={{ boxShadow: ["0 0 5px rgba(0, 236, 190, 0.2)", "0 0 10px rgba(0, 236, 190, 0.4)", "0 0 5px rgba(0, 236, 190, 0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#00ECBE] flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-[#052652]" />
                      </div>
                      <div>
                        <p className="text-[#00ECBE] font-semibold text-xl">Earn Big</p>
                        <p className="text-gray-300 text-sm">Win instantly</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* 400+ Daily Winners */}
                  <motion.div 
                    className="absolute left-4 bottom-0 flex items-center gap-2"
                    animate={{ y: [0, -5, 0], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-[#00ECBE] font-bold text-xl">400+</span>
                    <span className="text-gray-300 text-sm">Daily Winners</span>
                  </motion.div>
                </div>
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
