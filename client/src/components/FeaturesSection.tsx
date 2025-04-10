import { motion } from 'framer-motion';
import { useState } from 'react';
import wingoImage from "../assets/wingo-image.png";
import trxWinImage from "../assets/trx-win-image.png";
import PredictionModal from './PredictionModal';
import DemoVipPredictionModal from './DemoVipPredictionModal';

const cardVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    transition: {
      duration: 0.3
    }
  }
};

const FeaturesSection = () => {
  const [isWinGoModalOpen, setIsWinGoModalOpen] = useState(false);
  const [isTRXModalOpen, setIsTRXModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  
  return (
    <section id="prediction" data-section="features" className="py-16 lg:py-24 bg-gradient-to-b from-[#001c54] to-[#000c33]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-4 -mt-2">
            <span className="text-[#00ECBE]">Revolutionary</span>
            <span className="text-white"> Prediction Platform</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our advanced platform combines blockchain technology with predictive algorithms to give you the edge in color prediction games.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* WinGo Feature */}
          <motion.div 
            className="bg-[#05012B]/50 rounded-3xl p-6 lg:p-8 border border-[#00ECBE]/20 relative overflow-hidden"
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <div className="rounded-3xl shadow-lg border border-[#00ECBE]/30 overflow-hidden">
                  {/* WinGo Image */}
                  <div className="bg-gradient-to-br from-[#001c54] to-[#000c33] flex items-center justify-center">
                    <motion.img 
                      src={wingoImage} 
                      alt="Win Go Game" 
                      className="w-full object-cover rounded-2xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-[#00ECBE] text-2xl font-poppins font-bold mb-3">Win Go</h3>
                <p className="text-gray-300 mb-6">
                  Win Go event celebrates luck and chance by providing big prizes for little money. The lottery's simplicity and potential jackpot appeal make it popular. Every ticket has the opportunity of a life-changing win, making it a symbol of hope and excitement.
                </p>
                <div className="flex gap-4">
                  <motion.button 
                    onClick={() => setIsWinGoModalOpen(true)}
                    className="bg-[#00ECBE] text-[#05012B] px-6 py-3 rounded-full transition duration-300 text-sm"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                      y: -2 
                    }}
                  >
                    VIP Prediction
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => setDemoModalOpen(true)}
                    className="bg-[#8000FF] border border-[#A64DFF] text-white px-6 py-3 rounded-full transition duration-300 text-sm flex items-center"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(128, 0, 255, 0.6)",
                      y: -2 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Demo
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* TRX Hash Feature */}
          <motion.div 
            className="bg-[#05012B]/50 rounded-3xl p-6 lg:p-8 border border-[#00ECBE]/20"
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/2">
                <div className="rounded-3xl shadow-lg border border-[#00ECBE]/30 overflow-hidden">
                  {/* TRX Win Image */}
                  <div className="bg-gradient-to-br from-[#001c54] to-[#000c33] flex items-center justify-center">
                    <motion.img 
                      src={trxWinImage} 
                      alt="TRX Win Game" 
                      className="w-full object-cover rounded-2xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-[#00ECBE] text-2xl font-poppins font-bold mb-3">TRX Hash</h3>
                <p className="text-gray-300 mb-6">
                  TRX Hash feature combines technology with games. TRON's (TRX) blockchain technology ensures fair and transparent event results in these games. Every ticket has the opportunity of a life-changing win, making it a symbol of hope and excitement.
                </p>
                <div className="flex gap-4">
                  <motion.button 
                    onClick={() => setIsTRXModalOpen(true)}
                    className="bg-[#00ECBE] text-[#05012B] px-6 py-3 rounded-full transition duration-300 text-sm"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                      y: -2 
                    }}
                  >
                    VIP Prediction
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => setDemoModalOpen(true)}
                    className="bg-[#8000FF] border border-[#A64DFF] text-white px-6 py-3 rounded-full transition duration-300 text-sm flex items-center"
                    whileHover={{ 
                      boxShadow: "0 0 20px 0 rgba(128, 0, 255, 0.6)",
                      y: -2 
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Demo
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Win Go Prediction Modal */}
      <PredictionModal 
        isOpen={isWinGoModalOpen}
        onClose={() => setIsWinGoModalOpen(false)}
        title="WINGO VIP PREDICTION"
        gameType="wingo"
      />

      {/* TRX Hash Prediction Modal */}
      <PredictionModal 
        isOpen={isTRXModalOpen}
        onClose={() => setIsTRXModalOpen(false)}
        title="TRX HASH VIP PREDICTION"
        gameType="trx"
      />
      
      {/* Demo VIP Prediction Modal */}
      <DemoVipPredictionModal 
        isOpen={demoModalOpen} 
        onClose={() => setDemoModalOpen(false)} 
      />
    </section>
  );
};

export default FeaturesSection;
