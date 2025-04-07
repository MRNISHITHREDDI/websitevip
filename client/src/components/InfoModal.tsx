import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-lg border border-[#00ECBE]/20 w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 flex justify-between items-center border-b border-[#00ECBE]/10">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="text-[#00ECBE] mr-2">VIP</span> Prediction Information
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="text-gray-300 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                At Vip Prediction, we believe in empowering our users with knowledge. It's crucial to understand that Playing Color Game, claim to use advanced systems like SHA-256 for generating random results, there's always a potential for manipulation. This is where our expertise comes in handy.
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-[#00ECBE] text-lg font-semibold mb-2">How We Protect You:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Our sophisticated API system constantly monitors these platforms, tracking any data that might be manipulated.</li>
                <li>We use advanced algorithms to detect patterns and anomalies that could indicate unfair practices.</li>
                <li>Our predictions are based on a comprehensive analysis of multiple factors, not just the platform's provided data.</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-[#00ECBE] text-lg font-semibold mb-2">Potential Manipulation Tactics:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Controlled "Randomness": Platforms might influence when and how their "random" number generation is applied.</li>
                <li>Hidden Algorithm Changes: Sudden, undisclosed changes to algorithms could unfairly shift odds.</li>
                <li>Selective Payout Practices: Some platforms might delay or withhold certain payouts without clear explanation.</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-[#001232] p-4 rounded-lg border border-[#00ECBE]/10"
            >
              <h3 className="text-[#00ECBE] text-lg font-semibold mb-2">Stay Informed, Play Smart:</h3>
              <div>
                We urge all our users to approach these platforms with a critical eye. Always verify a platform's credibility before engaging. With Predict Vip by your side, you're equipped with the insights needed to make informed decisions and maximize your chances of success. Remember, knowledge is power – especially in the world of online lotteries!
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[#00ECBE]/10 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-[#00ECBE] text-[#05012B] px-6 py-2 rounded-md font-medium"
          >
            Got it
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoModal;