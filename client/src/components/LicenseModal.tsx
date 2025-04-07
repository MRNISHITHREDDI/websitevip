import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ExternalLink, X } from 'lucide-react';
import React, { useState } from 'react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: 'wingo' | 'trx';
  timeOption: string;
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

const registerInfoAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.2,
      staggerChildren: 0.05 
    }
  }
};

const LicenseModal: React.FC<LicenseModalProps> = ({ 
  isOpen, 
  onClose, 
  gameType,
  timeOption
}) => {
  const [copiedUID, setCopiedUID] = useState(false);
  
  // Generate a random UID for demo purposes
  const uid = `USER${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const copyUID = () => {
    navigator.clipboard.writeText(uid);
    setCopiedUID(true);
    setTimeout(() => setCopiedUID(false), 2000);
  };
  
  const gameTitle = gameType === 'wingo' ? 'Win Go' : 'TRX Hash';
  const invitationLink = "https://www.jalwa.live/#/register?invitationCode=246121083442";

  return (
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
            <div className="flex justify-between items-center p-4 border-b border-[#00ECBE]/20">
              <h3 className="text-[#00ECBE] text-xl font-bold tracking-wide">{gameTitle} VIP Prediction</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#00ECBE]/10"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-5">
                <p className="text-white mb-2">You selected:</p>
                <div className="bg-[#05012B]/70 border border-[#00ECBE]/30 py-2.5 px-4 rounded-xl text-[#00ECBE] text-center font-medium">
                  {timeOption}
                </div>
              </div>
              
              <motion.div
                className="bg-[#05012B]/70 border border-[#00ECBE]/30 rounded-xl p-4 overflow-hidden mb-5"
                {...registerInfoAnimation}
              >
                <motion.h4 
                  className="text-[#00ECBE] font-medium mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Register for VIP Access
                </motion.h4>
                <motion.p 
                  className="text-white text-sm mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  To access exclusive VIP predictions, please register under us and contact our team with your UID.
                </motion.p>
                <motion.div 
                  className="bg-[#001c54] p-3 rounded-lg mb-3 relative"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Your UID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ECBE] font-mono font-bold">{uid}</span>
                      <motion.button
                        onClick={copyUID}
                        className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#00ECBE]/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Copy UID"
                      >
                        <Copy size={16} />
                      </motion.button>
                    </div>
                  </div>
                  {copiedUID && (
                    <motion.div 
                      className="absolute -top-2 right-0 bg-[#00ECBE] text-[#05012B] text-xs py-1 px-2 rounded-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      Copied!
                    </motion.div>
                  )}
                </motion.div>
                <motion.p 
                  className="text-white text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Contact <a href="https://t.me/Blackdoom1" target="_blank" rel="noopener noreferrer" className="text-[#00ECBE] hover:underline">@Blackdoom1</a> at telegram with your UID to get a free license.
                </motion.p>
              </motion.div>
              
              <a 
                href={invitationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <motion.button
                  className="w-full bg-[#00ECBE] text-[#05012B] font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
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
                >
                  <span>Register Now</span>
                  <ExternalLink size={16} />
                </motion.button>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LicenseModal;