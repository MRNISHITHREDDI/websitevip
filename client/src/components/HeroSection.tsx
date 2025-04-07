import { motion } from 'framer-motion';
import { ChevronDown, DollarSign, Check, UserPlus, Play, Info } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background effects with 40% transparency */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#05012B]/40">
        {/* Blue and purple streaming light effects similar to the image */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#001c54]/40 to-transparent"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated light streaks */}
        <motion.div 
          className="absolute top-[10%] left-[5%] w-[150%] h-2 bg-[#00ECBE]/20 rounded-full rotate-[-20deg]"
          animate={{ 
            x: [-500, 1000],
            opacity: [0, 0.6, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute top-[30%] left-[15%] w-[150%] h-1 bg-[#7B42F6]/20 rounded-full rotate-[-15deg]"
          animate={{ 
            x: [-300, 1200],
            opacity: [0, 0.7, 0] 
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        <motion.div 
          className="absolute top-[50%] left-0 w-[150%] h-3 bg-[#00ECBE]/20 rounded-full rotate-[-25deg]"
          animate={{ 
            x: [-400, 1100],
            opacity: [0, 0.5, 0] 
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        <motion.div 
          className="absolute top-[70%] left-[10%] w-[150%] h-2 bg-[#7B42F6]/20 rounded-full rotate-[-10deg]"
          animate={{ 
            x: [-600, 900],
            opacity: [0, 0.6, 0] 
          }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        
        {/* Pulsing glow circles */}
        <motion.div 
          className="absolute top-[20%] left-[15%] w-24 h-24 bg-[#00ECBE]/10 rounded-full filter blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-[60%] right-[10%] w-32 h-32 bg-[#7B42F6]/10 rounded-full filter blur-xl"
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
                className="absolute -top-10 -left-10 w-32 h-32 bg-[#00ECBE]/10 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="rounded-lg shadow-2xl border-2 border-[#00ECBE]/30 overflow-hidden" style={{ boxShadow: "0 0 25px 0 rgba(0, 236, 190, 0.3)" }}>
                  {/* Game interface with animated money earnings visualization */}
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#001c54] to-[#000c33] p-6 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <motion.div 
                        className="flex items-center justify-center mb-4"
                        animate={{ scale: [1, 1.2, 1], rotateY: [0, 360] }}
                        transition={{ 
                          scale: { duration: 3, repeat: Infinity },
                          rotateY: { duration: 6, repeat: Infinity }
                        }}
                      >
                        <DollarSign className="text-[#00ECBE] h-16 w-16" />
                      </motion.div>

                      {/* Rain of dollar signs */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-[#00ECBE]/40"
                            initial={{ 
                              top: -50, 
                              left: `${10 + i * 8}%`,
                              scale: Math.random() * 0.5 + 0.5
                            }}
                            animate={{ 
                              top: ['0%', '100%'],
                              opacity: [0, 1, 0]
                            }}
                            transition={{ 
                              duration: 4 + Math.random() * 4,
                              repeat: Infinity,
                              delay: i * 0.7,
                              ease: "linear"
                            }}
                          >
                            <DollarSign />
                          </motion.div>
                        ))}
                      </div>

                      <div className="bg-[#00ECBE]/10 border border-[#00ECBE]/30 rounded-lg p-4">
                        <motion.p 
                          className="text-[#00ECBE] font-semibold text-xl"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Predict & Earn Big
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Money-earning graphic badge */}
                <div className="absolute -bottom-8 -right-8 bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-lg p-4 border border-[#00ECBE]/30 shadow-lg">
                  <motion.div 
                    className="flex items-center gap-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00ECBE] flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#05012B]" />
                    </div>
                    <div>
                      <p className="text-[#00ECBE] font-semibold">Earn Big</p>
                      <p className="text-xs text-gray-300">Win instantly</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Accuracy badge */}
                <div className="absolute top-2 right-2 bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-lg p-3 border border-[#00ECBE]/30 shadow-lg">
                  <motion.div 
                    className="flex items-center gap-2"
                    animate={{ opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#00ECBE] flex items-center justify-center">
                      <Check className="h-4 w-4 text-[#05012B]" />
                    </div>
                    <div>
                      <p className="text-[#00ECBE] font-semibold text-sm">100%</p>
                      <p className="text-[0.65rem] text-gray-300">Accurate Prediction</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex absolute -bottom-10 left-0 bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-lg p-4 shadow-lg border border-[#00ECBE]/30"
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
