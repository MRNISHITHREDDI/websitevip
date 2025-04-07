import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  gameType: 'wingo' | 'trx';
}

const PredictionModal: React.FC<PredictionModalProps> = ({ isOpen, onClose, title, gameType }) => {
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Options based on game type
  const options = [
    { id: '30sec', label: '30 SEC WINGO' },
    { id: '1min', label: '1 MIN WINGO' },
    { id: '3min', label: '3 MIN WINGO' },
  ];

  // If game type is TRX, replace WINGO with TRX HASH in the labels
  const displayOptions = gameType === 'trx' 
    ? options.map(opt => ({ ...opt, label: opt.label.replace('WINGO', 'TRX HASH') }))
    : options;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-2xl max-w-md w-full border border-[#00ECBE]/30 shadow-[0_0_25px_rgba(0,236,190,0.3)]"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={handleModalClick}
          >
            <div className="flex justify-between items-center p-5 border-b border-[#00ECBE]/20">
              <h3 className="text-[#00ECBE] text-xl font-bold">{title}</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#00ECBE]/10"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="space-y-3">
                {displayOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    className="w-full bg-[#05012B]/70 hover:bg-[#00ECBE]/20 border border-[#00ECBE]/30 py-4 px-6 rounded-xl text-white flex justify-center items-center transition-all"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 0 10px 0 rgba(0, 236, 190, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                className="mt-6 w-full bg-[#00ECBE] text-[#05012B] font-semibold py-3 rounded-xl transition-all"
                whileHover={{ 
                  boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                  y: -2 
                }}
                whileTap={{ scale: 0.98 }}
              >
                Get VIP Prediction
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PredictionModal;