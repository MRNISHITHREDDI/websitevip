import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ExternalLink, X } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation } from 'wouter';

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
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [copiedUID, setCopiedUID] = useState(false);
  const [, navigate] = useLocation();
  
  // Fixed UID as per requirement
  const uid = "USER502999";
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licenseKey.trim()) {
      setError('Please enter your license key');
      return;
    }
    
    try {
      // Call the license verification API
      const response = await fetch('/api/verify-license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseKey,
          gameType,
          timeOption
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // License is valid
        setError('');
        
        // Store the valid license in localStorage for future use
        try {
          // Get existing licenses if any
          const storedLicenses = localStorage.getItem('validLicenses');
          let licenses = storedLicenses ? JSON.parse(storedLicenses) : {};
          
          // Store the license for this game type and time option
          licenses[`${gameType}-${timeOption}`] = { 
            licenseKey,
            validatedAt: new Date().toISOString(),
            // We could store expiration date from result.licenseData if available
          };
          
          // Save back to localStorage
          localStorage.setItem('validLicenses', JSON.stringify(licenses));
        } catch (error) {
          console.error('Error storing license in localStorage:', error);
          // Continue even if storage fails
        }
        
        // Close the modal first for better UX
        onClose();
        
        // Navigate to the appropriate prediction page
        const encodedTimeOption = encodeURIComponent(timeOption);
        navigate(`/predictions/${gameType}/${encodedTimeOption}`);
      } else {
        // License is invalid
        setError(result.message || 'Invalid or expired license key');
      }
    } catch (error) {
      console.error('License verification error:', error);
      setError('An error occurred during verification. Please try again.');
    }
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
              
              <form onSubmit={handleSubmit} className="mb-5">
                <div className="mb-4">
                  <label htmlFor="license" className="block text-white mb-2">Enter License Key</label>
                  <input
                    type="text"
                    id="license"
                    className="w-full bg-[#05012B]/70 border border-[#00ECBE]/30 py-2.5 px-4 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ECBE]/50 transition-all duration-200"
                    placeholder="Enter your license key"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    autoComplete="off"
                  />
                  {error && (
                    <motion.p 
                      className="text-red-400 mt-2 text-sm"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full bg-[#00ECBE] text-[#05012B] font-semibold py-2.5 rounded-xl transition-all"
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
                  Verify License
                </motion.button>
              </form>
              
              <motion.div
                className="bg-[#05012B]/70 border border-[#00ECBE]/30 rounded-2xl p-4 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.h4 
                  className="text-[#00ECBE] font-medium mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Register for VIP Access
                </motion.h4>
                <motion.p 
                  className="text-white text-sm mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  To access exclusive VIP predictions, please register under us and contact our team for license.
                </motion.p>
                
                <motion.div 
                  className="mb-3 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
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
                </motion.div>
                
                <motion.p 
                  className="text-white text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Contact <a href="https://t.me/Blackdoom1" target="_blank" rel="noopener noreferrer" className="text-[#00ECBE] hover:underline">@Blackdoom1</a> at telegram after registering to get a free license.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LicenseModal;