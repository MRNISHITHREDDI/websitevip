import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useState } from 'react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: 'wingo' | 'trx';
  timeOption: string;
}

const LicenseModal: React.FC<LicenseModalProps> = ({ 
  isOpen, 
  onClose, 
  gameType,
  timeOption
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [showRegisterInfo, setShowRegisterInfo] = useState(false);
  
  // Generate a random UID for demo purposes
  const uid = `USER${Math.floor(100000 + Math.random() * 900000)}`;
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licenseKey.trim()) {
      setError('Please enter your license key');
      return;
    }
    
    // For demo purposes, show registration info if license isn't "DEMO123"
    if (licenseKey !== 'DEMO123') {
      setError('Invalid or expired license key');
      setShowRegisterInfo(true);
    } else {
      // License accepted
      setError('');
      setShowRegisterInfo(false);
      // Here you would typically redirect to prediction page or show prediction
      alert(`Access granted to ${timeOption} predictions!`);
      onClose();
    }
  };
  
  const gameTitle = gameType === 'wingo' ? 'Win Go' : 'TRX Hash';
  
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
              <h3 className="text-[#00ECBE] text-xl font-bold">{gameTitle} License Verification</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#00ECBE]/10"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-5">
                <p className="text-white mb-2">You selected:</p>
                <div className="bg-[#05012B]/70 border border-[#00ECBE]/30 py-3 px-4 rounded-xl text-[#00ECBE] text-center font-medium">
                  {timeOption}
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="license" className="block text-white mb-2">Enter License Key</label>
                  <input
                    type="text"
                    id="license"
                    className="w-full bg-[#05012B]/70 border border-[#00ECBE]/30 py-3 px-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ECBE]/50"
                    placeholder="Enter your license key"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                  />
                  {error && (
                    <motion.p 
                      className="text-red-400 mt-2 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full bg-[#00ECBE] text-[#05012B] font-semibold py-3 rounded-xl transition-all"
                  whileHover={{ 
                    boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
                    y: -2 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify License
                </motion.button>
              </form>
              
              {showRegisterInfo && (
                <motion.div
                  className="mt-6 bg-[#05012B]/70 border border-[#00ECBE]/30 rounded-xl p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-[#00ECBE] font-medium mb-2">Register for VIP Access</h4>
                  <p className="text-white text-sm mb-3">
                    To access exclusive VIP predictions, please register under us and contact our team with your UID.
                  </p>
                  <div className="bg-[#001c54] p-3 rounded-lg mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Your UID:</span>
                      <span className="text-[#00ECBE] font-mono font-bold">{uid}</span>
                    </div>
                  </div>
                  <p className="text-white text-sm">
                    Contact our team on <span className="text-[#00ECBE]">support@jalwa.io</span> with your UID to get a free license.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LicenseModal;