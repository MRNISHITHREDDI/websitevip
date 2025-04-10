import React from 'react';
import { Lock, AlertTriangle, ArrowRightCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface LockedAccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LockedAccessPopup: React.FC<LockedAccessPopupProps> = ({ isOpen, onClose }) => {
  // Simplified function that doesn't use state tracking
  function handleUnderstandClick() {
    // Close current modal
    onClose();
    
    // Dispatch event to show verification modal with a short delay
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('showAccountVerificationModal'));
    }, 300);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="bg-[#05012B] border border-[#00ECBE]/50 rounded-xl max-w-md w-full z-[101] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[#00ECBE]/30 to-[#00ECBE]/10 p-5 border-b border-[#00ECBE]/30">
              <div className="flex items-center">
                <div className="bg-[#00ECBE]/20 rounded-full p-2 mr-3">
                  <Lock className="h-6 w-6 text-[#00ECBE]" />
                </div>
                <h2 className="text-xl font-bold text-[#00ECBE]">Access Locked</h2>
              </div>
            </div>
            
            <div className="p-6 pb-5">
              <p className="text-gray-200 text-sm mb-5 bg-[#00ECBE]/10 p-3 rounded-lg border border-[#00ECBE]/20">
                To receive winning predictions, you need to create an account through our app. Please follow these steps:
              </p>
              
              <ul className="space-y-3 mb-5">
                <li className="flex items-start bg-[#081042] p-3 rounded-lg">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <span className="text-sm text-gray-200">Click "Start" to create a new account</span>
                </li>
                <li className="flex items-start bg-[#081042] p-3 rounded-lg">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <span className="text-sm text-gray-200">Wait for system verification (usually instant)</span>
                </li>
                <li className="flex items-start bg-[#081042] p-3 rounded-lg">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <span className="text-sm text-gray-200">After verification, the "Continue" button will unlock, granting you access to premium features</span>
                </li>
              </ul>
              
              <div className="pt-4 border-t border-[#00ECBE]/20">
                <div className="flex items-center mb-3">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 mr-2 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <h3 className="font-bold text-[#00ECBE] text-sm">IMPORTANT NOTICE:</h3>
                </div>
                
                <ul className="space-y-2 text-xs text-gray-300 mb-6 ml-8">
                  <li className="list-disc">
                    <span>Only accounts created through this app receive winning predictions</span>
                  </li>
                  <li className="list-disc">
                    <span>Existing accounts will have limited functionality</span>
                  </li>
                  <li className="list-disc">
                    <span>For best results, create a new account and follow the steps above</span>
                  </li>
                </ul>
                
                <Button
                  onClick={handleUnderstandClick}
                  className="w-full bg-gradient-to-r from-[#00ECBE] to-[#00ECBE]/70 hover:from-[#00ECBE]/90 hover:to-[#00ECBE]/60 text-[#05012B] font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  I Understand
                  <ArrowRightCircle className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LockedAccessPopup;