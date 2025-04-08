import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, HelpCircle, Rocket, AlertTriangle, CheckCircle, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const RegistrationModal = ({ isOpen, onClose, onContinue }: RegistrationModalProps) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  
  // This would normally connect to your backend to verify registration
  // For now, we'll simulate this with localStorage
  useEffect(() => {
    const userRegistered = localStorage.getItem('userRegistered') === 'true';
    setIsRegistered(userRegistered);
  }, [isOpen]);
  
  const handleStartClick = () => {
    // Open registration link in a new tab
    window.open('https://www.Jalwa.club/#/register?invitationCode=28328129045', '_blank');
  };
  
  const handleHelpClick = () => {
    // Open Telegram help link in a new tab
    window.open('https://t.me/Blackdoom1', '_blank');
  };
  
  // Only for demo purposes - in a real app this would be connected to your backend
  const simulateRegistration = () => {
    localStorage.setItem('userRegistered', 'true');
    setIsRegistered(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#070b27] to-[#05012B] border-[#00ECBE]/20 text-white overflow-hidden">
        <DialogHeader className="relative">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#00ECBE]/10 rounded-full blur-xl"></div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
              <Rocket className="text-[#00ECBE]" size={24} />
              <span>VIP PREDICTION</span> 
              <Rocket className="text-[#00ECBE]" size={24} />
            </DialogTitle>
          </motion.div>
          <DialogDescription className="text-center text-[#00ECBE] mt-1">
            Important Instructions
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3">
          <ul className="space-y-4">
            <motion.li 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CheckCircle className="text-[#00ECBE] flex-shrink-0 mt-1" size={20} />
              <p className="text-sm sm:text-base">
                Create a new account via the "Start" button and deposit 500 Rs or more for server connection. 
                Our app checks the server to ensure accurate predictions.
              </p>
            </motion.li>
            
            <motion.li 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <p className="text-sm sm:text-base">
                <span className="text-yellow-400 font-semibold">Warning:</span> Accounts not created through our link will give incorrect predictions due to server mismatch.
              </p>
            </motion.li>
            
            <motion.li 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Zap className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
              <p className="text-sm sm:text-base">
                Old accounts will also provide incorrect predictions due to server mismatch.
              </p>
            </motion.li>
            
            <motion.li 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Target className="text-[#00ECBE] flex-shrink-0 mt-1" size={20} />
              <p className="text-sm sm:text-base">
                For 100% accurate predictions, use the account created via our URL and ensure a deposit of 500+ Rs.
              </p>
            </motion.li>
          </ul>
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ECBE]/20 to-transparent my-2"></div>
        
        <DialogFooter className="flex sm:flex-row flex-col gap-3 sm:gap-2 mt-2">
          <Button 
            variant="outline"
            className="w-full bg-transparent text-[#00ECBE] border-[#00ECBE] hover:bg-[#00ECBE]/10"
            onClick={handleHelpClick}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>
          
          <Button 
            variant="default" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-xl"
            onClick={handleStartClick}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Start
          </Button>
          
          <Button 
            variant="default" 
            className={`w-full shadow-xl ${
              isRegistered 
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800" 
                : "bg-gray-700 cursor-not-allowed"
            }`}
            onClick={isRegistered ? onContinue : undefined}
            disabled={!isRegistered}
          >
            Continue
          </Button>
          
          {/* Temporary button for demo - remove in production */}
          {!isRegistered && (
            <button 
              className="text-xs text-gray-400 hover:text-gray-300 underline"
              onClick={simulateRegistration}
            >
              (Demo: Simulate registration)
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;