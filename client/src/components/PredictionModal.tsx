import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Copy, CheckCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import LicenseModal from './LicenseModal';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  gameType: 'wingo' | 'trx';
}

interface DemoLicense {
  licenseKey: string;
  gameType: string;
  timeOptions: string[];
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
  const [demoLicenses, setDemoLicenses] = useState<DemoLicense[]>([]);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  
  // Fetch demo licenses when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDemoLicenses();
    }
  }, [isOpen]);
  
  const fetchDemoLicenses = async () => {
    try {
      setIsLoadingLicenses(true);
      const response = await fetch('/api/demo-licenses');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setDemoLicenses(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching demo licenses:', error);
    } finally {
      setIsLoadingLicenses(false);
    }
  };
  
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
    
    // Open the license modal after a short delay
    setTimeout(() => {
      setShowLicenseModal(true);
    }, 50);
  };
  
  const handleLicenseModalClose = () => {
    setShowLicenseModal(false);
  };
  
  const toggleDemoInfo = () => {
    setShowDemoInfo(!showDemoInfo);
  };
  
  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  
  // Filter demo licenses for the current game type
  const filteredDemoLicenses = demoLicenses.filter(
    license => license.gameType === gameType
  );

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
                
                {/* Demo License Info Toggle */}
                <motion.div 
                  className="mt-4 flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button 
                    onClick={toggleDemoInfo}
                    className="flex items-center gap-2 text-[#00ECBE]/70 hover:text-[#00ECBE] text-sm transition-colors"
                  >
                    <Info size={14} />
                    <span>{showDemoInfo ? "Hide demo licenses" : "Show demo licenses"}</span>
                  </button>
                </motion.div>
                
                {/* Demo License Info Panel */}
                <AnimatePresence>
                  {showDemoInfo && (
                    <motion.div
                      className="mt-4 bg-[#05012B]/70 border border-[#00ECBE]/30 rounded-xl p-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="text-white text-sm font-medium mb-2">Demo License Keys ({gameType.toUpperCase()})</h4>
                      
                      {isLoadingLicenses ? (
                        <div className="py-3 flex justify-center">
                          <div className="animate-pulse text-[#00ECBE]/70 text-sm">Loading licenses...</div>
                        </div>
                      ) : filteredDemoLicenses.length > 0 ? (
                        <div className="space-y-2">
                          {filteredDemoLicenses.map((license, index) => (
                            <div key={index} className="bg-[#001026] border border-[#00ECBE]/20 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-1">
                                <div className="font-mono text-[#00ECBE] font-medium text-sm">{license.licenseKey}</div>
                                <button
                                  onClick={() => copyLicenseKey(license.licenseKey)}
                                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#00ECBE]/10 transition-colors"
                                >
                                  {copiedKey === license.licenseKey ? (
                                    <CheckCircle size={14} className="text-green-400" />
                                  ) : (
                                    <Copy size={14} />
                                  )}
                                </button>
                              </div>
                              <div className="text-xs text-gray-400">
                                Support: {license.timeOptions.join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-2 text-gray-400 text-sm text-center">
                          No demo licenses available for {gameType.toUpperCase()}
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-gray-400">
                        Copy one of these demo license keys to test the license verification.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* License verification modal */}
      <LicenseModal 
        isOpen={showLicenseModal} 
        onClose={handleLicenseModalClose}
        gameType={gameType}
        timeOption={selectedOption}
      />
    </>
  );
};

export default PredictionModal;