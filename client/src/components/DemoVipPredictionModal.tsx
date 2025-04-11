import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DemoVipPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVipPredictionModal = ({ isOpen, onClose }: DemoVipPredictionModalProps) => {
  const [currentTab, setCurrentTab] = useState("current");
  const isMobile = useIsMobile();
  
  // Add overflow hidden to body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Define all available tabs
  const tabs = [
    { id: "current", label: isMobile ? "Current" : "Current Prediction", image: "/images/current-prediction.png" },
    { id: "history", label: isMobile ? "History" : "Prediction History", image: "/images/prediction-history.png" },
    { id: "results", label: isMobile ? "Results" : "Results History", image: "/images/results-history.png" }
  ];
  
  // Find current tab index
  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
  
  // Navigation functions
  const goToNextTab = () => {
    const nextIndex = (currentTabIndex + 1) % tabs.length;
    setCurrentTab(tabs[nextIndex].id);
  };
  
  const goToPrevTab = () => {
    const prevIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
    setCurrentTab(tabs[prevIndex].id);
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="max-w-[800px] w-full bg-gradient-to-b from-[#001c54] to-[#000c33] text-white border border-[#00ECBE]/30 shadow-[0_0_30px_rgba(0,236,190,0.3)] rounded-xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-3 md:p-5 border-b border-[#00ECBE]/20 bg-[#001c54]/80">
                <button 
                  onClick={onClose}
                  className="absolute top-3 right-3 md:top-4 md:right-4 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-all"
                >
                  <X size={isMobile ? 16 : 18} />
                </button>
                
                <h2 className="text-center text-xl md:text-2xl font-bold mt-1">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ECBE] to-[#00ECBE]/80">
                    DEMO VIP PREDICTION
                  </span>
                </h2>
                <p className="text-center text-gray-300 mt-1 text-sm md:text-base">
                  Experience our premium VIP predictions with these demo examples
                </p>
              </div>
              
              {/* Tabs */}
              <div className="w-full">
                <div className="w-full grid grid-cols-3 bg-[#000A33] p-1 rounded-none border-b border-[#00ECBE]/20">
                  {tabs.map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`py-1.5 md:py-2 rounded-lg transition-all text-sm md:text-base ${
                        currentTab === tab.id 
                          ? 'bg-[#00ECBE] text-[#05012B] font-medium' 
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  {/* Navigation arrows - Mobile optimized */}
                  <button 
                    onClick={goToPrevTab}
                    className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-1.5 md:p-2 text-white/70 hover:text-white transition-all"
                  >
                    <ChevronLeft size={isMobile ? 16 : 20} />
                  </button>
                  
                  <button 
                    onClick={goToNextTab}
                    className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-1.5 md:p-2 text-white/70 hover:text-white transition-all"
                  >
                    <ChevronRight size={isMobile ? 16 : 20} />
                  </button>
                  
                  {/* Tab content with animated transitions */}
                  <AnimatePresence mode="wait">
                    {tabs.map((tab) => (
                      tab.id === currentTab && (
                        <motion.div
                          key={tab.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-3 md:p-6 flex justify-center items-center min-h-[250px] md:min-h-[350px]"
                        >
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-[700px] rounded-lg overflow-hidden shadow-2xl border border-[#00ECBE]/20"
                          >
                            <img 
                              src={tab.image} 
                              alt={tab.label}
                              className="w-full h-auto object-cover"
                            />
                          </motion.div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-3 py-3 md:px-6 md:py-4 flex justify-center border-t border-[#00ECBE]/20 bg-[#001232]">
                <motion.button 
                  onClick={onClose}
                  className="bg-gradient-to-r from-[#00ECBE] to-[#00D9AD] text-[#05012B] font-semibold px-6 md:px-8 py-2 md:py-2.5 rounded-lg transition-all shadow-[0_0_10px_rgba(0,220,180,0.3)] text-sm md:text-base"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: "0 0 15px rgba(0, 220, 180, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close Demo
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DemoVipPredictionModal;