import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Lock, Rocket, HelpCircle, X, ArrowRightCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onShowLockedPopup: () => void; // New prop to directly show the locked popup
  gameType: 'wingo' | 'trx';
  timeOption: string;
}

// Optimized animations for better performance - exactly matching PredictionModal
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

const AccountVerificationModal = ({ 
  isOpen, 
  onClose, 
  onContinue, 
  onShowLockedPopup,
  gameType, 
  timeOption 
}: AccountVerificationModalProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleStartClick = () => {
    // Open the registration link in a new tab
    window.open('https://www.jalwa.vip/#/register?invitationCode=327361287589', '_blank');
    
    toast({
      title: "🚀 Registration Started",
      description: "Please complete the registration process to access VIP predictions.",
      duration: 5000,
    });
    
    // Simulate verification
    setTimeout(() => {
      setIsVerified(true);
      toast({
        title: "✅ Verification Complete",
        description: "Your account has been verified. You can now access premium predictions!",
        duration: 5000,
      });
    }, 3000);
  };
  
  const handleContinueClick = () => {
    if (!isVerified) {
      // Close this modal and directly call the locked popup function
      onClose();
      // Use a short timeout to ensure UI updates properly
      setTimeout(() => {
        onShowLockedPopup();
      }, 100);
      return;
    }
    
    // Save verification status
    localStorage.setItem('jalwaAccountVerified', 'true');
    
    // Continue to predictions
    onContinue();
  };
  
  const handleHelpClick = () => {
    // Open Telegram help channel
    window.open('https://t.me/Bongjayanta2', '_blank');
  };
  
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
          {...overlayAnimation}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#05012B] border border-[#00ECBE]/30 rounded-xl sm:max-w-[500px] w-full z-[101] overflow-hidden shadow-[0_0_25px_rgba(0,236,190,0.3)]"
            {...modalAnimation}
            onClick={handleModalClick}
          >
            <div className="relative">
              <button 
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-[#00ECBE]/10"
                onClick={onClose}
              >
                <X size={20} />
              </button>
              
              <div className="p-6 pb-0">
                <div className="flex items-center justify-center mb-2">
                  <Rocket className="h-6 w-6 mr-2 text-[#00ECBE]" />
                  <h2 className="text-2xl font-bold text-center text-white">JALWA VIP PREDICTION</h2>
                </div>
                <Badge variant="outline" className="mx-auto w-auto p-1 px-3 bg-[#081042] text-[#00ECBE] mb-3">
                  🚀 Important Instructions
                </Badge>
              </div>
              
              <div className="p-6 pt-2 space-y-4">
                <div className="flex items-start space-x-3 bg-[#081042] p-3 rounded-lg border border-[#00ECBE]/20">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <p className="text-gray-200 text-sm">
                    Create a new account via the "Start" button for server connection. Our app checks the server to ensure accurate predictions.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 bg-[#081042] p-3 rounded-lg border border-[#00ECBE]/20">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <p className="text-gray-200 text-sm">
                    Warning: Accounts not created through our link will give incorrect predictions due to server mismatch.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 bg-[#081042] p-3 rounded-lg border border-[#00ECBE]/20">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <p className="text-gray-200 text-sm">
                    Old accounts will also provide incorrect predictions due to server mismatch.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3 bg-[#081042] p-3 rounded-lg border border-[#00ECBE]/20">
                  <div className="bg-[#00ECBE]/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-[#00ECBE]" />
                  </div>
                  <p className="text-gray-200 text-sm">
                    For 100% accurate predictions, use the account created via our URL.
                  </p>
                </div>
                
                <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-5 pb-2 mt-3">
                  <Button
                    onClick={handleStartClick}
                    className="w-full sm:w-auto transition-all bg-gradient-to-r from-[#00ECBE] to-[#00ECBE]/70 hover:from-[#00ECBE]/90 hover:to-[#00ECBE]/60 text-[#05012B] font-medium py-3 rounded-lg"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                  
                  <Button
                    onClick={handleContinueClick}
                    className={`w-full sm:w-auto transition-all py-3 rounded-lg ${
                      isVerified 
                        ? "bg-gradient-to-r from-[#00ECBE] to-[#00ECBE]/70 hover:from-[#00ECBE]/90 hover:to-[#00ECBE]/60 text-[#05012B]"
                        : "bg-gray-700 hover:bg-gray-600 opacity-80 text-white"
                    }`}
                  >
                    {isVerified ? (
                      <>
                        Continue
                        <ArrowRightCircle className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Continue</span>
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleHelpClick}
                    variant="outline"
                    className="w-full sm:w-auto border-[#00ECBE]/50 text-[#00ECBE] hover:text-[#00ECBE]/80 hover:bg-[#00ECBE]/10 py-3 rounded-lg"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AccountVerificationModal;