import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from 'framer-motion';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-gradient-to-b from-[#001c54] to-[#000c33] border border-[#00ECBE]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="text-[#00ECBE] mr-2">VIP</span> Prediction Information
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-300">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-4">
                At Vip Prediction, we believe in empowering our users with knowledge. It's crucial to understand that Playing Color Game, claim to use advanced systems like SHA-256 for generating random results, there's always a potential for manipulation. This is where our expertise comes in handy.
              </p>
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
              <p>
                We urge all our users to approach these platforms with a critical eye. Always verify a platform's credibility before engaging. With Predict Vip by your side, you're equipped with the insights needed to make informed decisions and maximize your chances of success. Remember, knowledge is power – especially in the world of online lotteries!
              </p>
            </motion.div>
          </div>
        </DialogDescription>
        
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-[#00ECBE] text-[#05012B] px-6 py-2 rounded-md font-medium"
          >
            Got it
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;