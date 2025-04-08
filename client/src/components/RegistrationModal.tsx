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
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [depositStatus, setDepositStatus] = useState<{ amount: number; required: number }>({ 
    amount: 0, 
    required: 500 
  });
  
  // Poll function to check registration and deposit status
  const checkRegistrationStatus = () => {
    console.log("Checking registration status...");
    
    // In production, this would make an API call to Jalwa.club
    // For demo, simulate API behavior with gradual deposit increase
    
    if (isPolling) {
      // Simulate API response with increasing deposit amount
      setDepositStatus(prev => {
        // Simulate increasing deposit amount if less than required
        if (prev.amount < prev.required) {
          const newAmount = Math.min(prev.amount + Math.floor(Math.random() * 200), prev.required);
          
          // If deposit reaches required amount, set as registered
          if (newAmount >= prev.required && !isRegistered) {
            localStorage.setItem('userRegistered', 'true');
            setIsRegistered(true);
          }
          
          return { ...prev, amount: newAmount };
        }
        return prev;
      });
    }
  };
  
  // Start polling when "Start" button is clicked
  const startPolling = () => {
    if (!isPolling) {
      setIsPolling(true);
    }
  };
  
  // Effect to check registration and deposit status
  useEffect(() => {
    // For demo purposes, check localStorage
    const userRegistered = localStorage.getItem('userRegistered') === 'true';
    setIsRegistered(userRegistered);
    
    // Set up polling to check status regularly if polling is active
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isPolling && isOpen) {
      // Call immediately once
      checkRegistrationStatus();
      
      // Then set up interval
      intervalId = setInterval(checkRegistrationStatus, 5000); // Check every 5 seconds
    }
    
    // PRODUCTION CODE WOULD BE LIKE THIS:
    /*
    if (isPolling && isOpen) {
      intervalId = setInterval(() => {
        // Get user ID from localStorage or cookies
        const userId = localStorage.getItem('jalwaUserId');
        
        if (userId) {
          // Call API to check registration and deposit status
          fetch('https://www.Jalwa.club/api/check-user-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, inviteCode: '28328129045' })
          })
          .then(res => res.json())
          .then(data => {
            // Update deposit amount
            setDepositStatus({
              amount: data.deposit || 0,
              required: 500
            });
            
            // If deposit is enough, enable continue button
            if (data.registered && data.deposit >= 500) {
              setIsRegistered(true);
              // Store in localStorage to persist between sessions
              localStorage.setItem('userRegistered', 'true');
              // Stop polling as requirement is met
              setIsPolling(false);
            }
          });
        }
      }, 10000); // Check every 10 seconds in production
    }
    */
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen, isPolling]);
  
  const handleStartClick = () => {
    // Open registration link in a new tab
    window.open('https://www.Jalwa.club/#/register?invitationCode=28328129045', '_blank');
    
    // Start polling for status updates
    startPolling();
  };
  
  const handleHelpClick = () => {
    // Open Telegram help link in a new tab
    window.open('https://t.me/Blackdoom1', '_blank');
  };
  
  // Only for demo purposes - in a real app this would be connected to your backend
  // This simulates the user completing registration and making a 500 Rs deposit
  const simulateRegistration = () => {
    localStorage.setItem('userRegistered', 'true');
    setIsRegistered(true);
    
    // In production, this button wouldn't exist - status would be checked automatically
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
        
        {/* Deposit status indicator - only show when polling is active */}
        {isPolling && !isRegistered && (
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-1 flex justify-between">
              <span>Deposit status:</span>
              <span className={depositStatus.amount >= depositStatus.required ? "text-green-400" : "text-yellow-400"}>
                {depositStatus.amount} / {depositStatus.required} Rs
              </span>
            </p>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-[#00ECBE]"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min(100, (depositStatus.amount / depositStatus.required) * 100)}%` 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 italic">
              {isRegistered 
                ? "Deposit complete! You can continue to predictions."
                : depositStatus.amount > 0 
                  ? "Deposit in progress... Please wait while we verify your payment."
                  : "Waiting for deposit confirmation..."}
            </p>
          </div>
        )}
        
        {/* Show success message when registered */}
        {isRegistered && (
          <motion.div 
            className="mb-4 py-2 px-4 bg-green-500/20 border border-green-500/30 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-green-400 flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Deposit verification complete! You can now access VIP predictions.
            </p>
          </motion.div>
        )}
        
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