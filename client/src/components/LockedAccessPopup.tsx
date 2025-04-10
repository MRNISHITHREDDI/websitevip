import React, { useState } from 'react';
import { Lock, AlertTriangle, ArrowRightCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface LockedAccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUnderstand: () => void; // New prop to handle the understand action
}

const LockedAccessPopup: React.FC<LockedAccessPopupProps> = ({ isOpen, onClose, onUnderstand }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  // Reset click state when popup opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsClicked(false);
    }
  }, [isOpen]);
  
  const handleClick = () => {
    // Only handle the action if not already clicked
    if (isClicked) return;
    
    // Set button to clicked state to show the loading indicator
    setIsClicked(true);
    
    // Call the parent's function after a very short delay
    setTimeout(() => {
      onUnderstand();
    }, 50);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        className="bg-[#05012B] border border-[#00ECBE]/50 rounded-xl max-w-md w-full z-[101] overflow-hidden"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.4 }}
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
              onClick={handleClick}
              disabled={isClicked}
              className={`w-full bg-gradient-to-r ${isClicked 
                ? 'from-[#00ECBE]/80 to-[#00ECBE]/60 cursor-not-allowed' 
                : 'from-[#00ECBE] to-[#00ECBE]/70 hover:from-[#00ECBE]/90 hover:to-[#00ECBE]/60'
              } text-[#05012B] font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center`}
            >
              {isClicked ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Opening Verification...
                </>
              ) : (
                <>
                  I Understand
                  <ArrowRightCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LockedAccessPopup;