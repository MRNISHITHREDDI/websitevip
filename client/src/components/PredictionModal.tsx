import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import LicenseModal from './LicenseModal';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  gameType: 'wingo' | 'trx';
}

// Optimized animations for better performance
const overlayAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const modalAnimation = {
  initial: { scale: 0.96, y: 10, opacity: 0 },
  animate: { 
    scale: 1, 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      damping: 20, 
      stiffness: 300, 
      duration: 0.2 
    } 
  },
  exit: { 
    scale: 0.96, 
    y: 10, 
    opacity: 0,
    transition: { duration: 0.15 } 
  }
};

const PredictionModal: React.FC<PredictionModalProps> = ({ isOpen, onClose, title, gameType }) => {
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Options based on game type - using exact format needed for API verification
  const options = [
    { id: '30sec', label: '30 SEC', value: '30 SEC' },
    { id: '1min', label: '1 MIN', value: '1 MIN' },
    { id: '3min', label: '3 MIN', value: '3 MIN' },
    { id: '5min', label: '5 MIN', value: '5 MIN' },
  ];

  // Filter options based on game type
  // For TRX, only show 1 MIN option
  const displayOptions = gameType === 'trx' 
    ? [{ id: '1min', label: '1 MIN TRX HASH', value: '1 MIN' }]
    : options.map(opt => ({
        ...opt,
        label: `${opt.label} WINGO`
      }));
    
  const handleOptionClick = (option: any) => {
    // Use the actual time value for API matching
    setSelectedOption(option.value);
  };
  
  const handleGetPrediction = () => {
    if (!selectedOption) {
      // If no option selected, highlight the options briefly
      return;
    }
    
    // Close this modal first for smoother transition
    onClose();
    
    // Check if user has a valid license (for this game/time combo)
    const storedLicenses = localStorage.getItem('validLicenses');
    const licenses = storedLicenses ? JSON.parse(storedLicenses) : {};
    const hasValidLicense = licenses[`${gameType}-${selectedOption}`];
    
    if (hasValidLicense) {
      // User already has a valid license, redirect directly to prediction page
      if (gameType === 'wingo') {
        window.location.href = `/predictions/wingo/${encodeURIComponent(selectedOption)}`;
      } else {
        window.location.href = `/predictions/trx/${encodeURIComponent(selectedOption)}`;
      }
      return;
    }
    
    // If user doesn't have a valid license, show license verification modal after a short delay
    setTimeout(() => {
      setShowLicenseModal(true);
    }, 50);
  };
  
  const handleModalClose = () => {
    setShowLicenseModal(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
            {...overlayAnimation}
            onClick={onClose}
          >
            <motion.div
              className="bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-2xl max-w-md w-full border border-[#00ECBE]/30 shadow-[0_0_25px_rgba(0,236,190,0.3)]"
              {...modalAnimation}
              onClick={handleModalClick}
            >
              <div className="flex justify-between items-center p-5 border-b border-[#00ECBE]/20">
                <h3 className="text-[#00ECBE] text-xl font-bold tracking-wide">{title}</h3>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#00ECBE]/10"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-5">
                <div className="space-y-2.5">
                  {displayOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      className={`w-full ${selectedOption === option.value 
                        ? 'bg-[#00ECBE]/20 border-[#00ECBE] text-white' 
                        : 'bg-[#05012B]/70 hover:bg-[#00ECBE]/10 border-[#00ECBE]/30 text-gray-200'
                      } border py-3 px-5 rounded-xl flex justify-center items-center transition-all duration-200`}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 8px 0 rgba(0, 236, 190, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ 
                        type: "spring", 
                        damping: 15, 
                        stiffness: 300, 
                        duration: 0.1 
                      }}
                      onClick={() => handleOptionClick(option)}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
                
                <motion.button
                  className="mt-5 w-full bg-[#00ECBE] text-[#05012B] font-semibold py-3 rounded-xl transition-all"
                  whileHover={{ 
                    boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.5)",
                    y: -2 
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ 
                    type: "spring", 
                    damping: 12, 
                    stiffness: 500, 
                    duration: 0.1 
                  }}
                  onClick={handleGetPrediction}
                  disabled={!selectedOption}
                >
                  Get VIP Prediction
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* License verification modal */}
      <LicenseModal 
        isOpen={showLicenseModal} 
        onClose={handleModalClose}
        gameType={gameType}
        timeOption={selectedOption}
      />
    </>
  );
};

export default PredictionModal;