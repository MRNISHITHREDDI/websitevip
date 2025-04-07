import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div 
          className="absolute top-[20%] left-[15%] w-24 h-24 bg-[#00ECBE]/10 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-[60%] right-[10%] w-32 h-32 bg-[#00ECBE]/10 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              <span className="text-white">Predict Colors.</span>
              <motion.span 
                className="text-[#00ECBE] block mt-2"
                initial={{ textShadow: "0 0 0px rgba(0, 236, 190, 0)" }}
                animate={{ textShadow: "0 0 10px rgba(0, 236, 190, 0.5)" }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                Win Big.
              </motion.span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Experience the thrill of color prediction with our advanced algorithm. Make predictions, win rewards, and join thousands of successful players today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button 
                className="bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                Start Playing
              </motion.button>
              <motion.button 
                className="bg-transparent border border-[#00ECBE] text-[#00ECBE] px-8 py-3 rounded-full transition duration-300"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
              >
                How It Works
              </motion.button>
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
                className="absolute -top-10 -left-10 w-32 h-32 bg-[#00ECBE]/10 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="rounded-lg shadow-2xl border-2 border-[#00ECBE]/30 overflow-hidden" style={{ boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.3)" }}>
                  {/* Replace with actual game interface */}
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#001c54] to-[#000c33] p-10 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4">
                      {['red', 'green', 'blue'].map((color, i) => (
                        <motion.div 
                          key={i}
                          className={`h-16 w-16 rounded-full bg-${color === 'red' ? 'red-500' : color === 'green' ? 'green-500' : 'blue-500'} shadow-lg`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-lg p-4 border border-[#00ECBE]/30 shadow-lg">
                  <motion.div 
                    className="flex items-center gap-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#00ECBE] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#05012B]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#00ECBE] font-semibold">100%</p>
                      <p className="text-xs text-gray-300">Accurate Prediction</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="hidden md:flex absolute -bottom-10 left-0 bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-lg p-4 shadow-lg border border-[#00ECBE]/30"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <div className="text-[#00ECBE] font-bold text-lg">400+</div>
                <div className="text-xs text-gray-300">Daily Winners</div>
              </div>
            </motion.div>
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
