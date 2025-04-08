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
import { motion } from "framer-motion";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const RegistrationModal = ({ isOpen, onClose, onContinue }: RegistrationModalProps) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [hasStartedRegistration, setHasStartedRegistration] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  
  // Effect to check registration status on component mount
  useEffect(() => {
    // Check localStorage for registration status
    const userRegistered = localStorage.getItem('userRegistered') === 'true';
    setIsRegistered(userRegistered);
    
    // To add real API integration with Jalwa's API, we would need to:
    // 1. Securely store the JWT token (which would be obtained during login)
    // 2. Make authenticated requests to their API

    /* REAL API INTEGRATION (add this when ready to use real API):
    
    // Get auth token from secure storage
    const jwtToken = localStorage.getItem('jalwaAuthToken');
    
    if (jwtToken) {
      // Generate random string and timestamp for signature
      const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const timestamp = Math.floor(Date.now() / 1000);
      
      // This should be calculated properly using a secure method
      // For production, this would be done on your server to keep secrets secure
      const signature = "6F38334EB2B72A668482E12033639279"; 
      
      fetch('https://api.jalwaapi.com/api/webapi/GetUserInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          signature: signature, 
          language: 0,
          random: random,
          timestamp: timestamp
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("User data:", data);
        
        // If user has deposited at least 500 Rs
        if (data.code === 0 && data.data && data.data.amount >= 500) {
          setIsRegistered(true);
          localStorage.setItem('userRegistered', 'true');
        }
      })
      .catch(err => {
        console.error("Error checking user status:", err);
      });
    }
    */
  }, [isOpen]);
  
  const handleStartClick = () => {
    // Open registration link in a new tab
    window.open('https://www.Jalwa.club/#/register?invitationCode=28328129045', '_blank');
    
    // Mark that user has started registration process
    setHasStartedRegistration(true);
  };
  
  const handleVerifyClick = () => {
    // For demo purposes, we accept any 6-digit code
    if (verificationCode.length >= 6) {
      localStorage.setItem('userRegistered', 'true');
      setIsRegistered(true);
    }
    
    /* REAL API VERIFICATION (uncomment when ready for production):
    
    // In a production implementation, we would:
    // 1. Validate that the verification code matches what the user received
    // 2. Exchange it for a JWT token
    // 3. Store that token for future API calls

    fetch('https://api.jalwaapi.com/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        verificationCode: verificationCode
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        // Store the JWT token securely
        localStorage.setItem('jalwaAuthToken', data.token);
        
        // Now use the token to check user's balance
        const random = Math.random().toString(36).substring(2, 15);
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = "6F38334EB2B72A668482E12033639279"; 
        
        return fetch('https://api.jalwaapi.com/api/webapi/GetUserInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
          body: JSON.stringify({
            signature: signature, 
            language: 0,
            random: random,
            timestamp: timestamp
          })
        });
      }
      throw new Error('Verification failed');
    })
    .then(res => res.json())
    .then(userData => {
      // Check if user has deposited enough
      if (userData.code === 0 && userData.data && userData.data.amount >= 500) {
        localStorage.setItem('userRegistered', 'true');
        setIsRegistered(true);
      } else {
        alert('Please deposit at least 500 Rs to access VIP predictions');
      }
    })
    .catch(err => {
      console.error('Verification error:', err);
      alert('Verification failed. Please try again or contact support.');
    });
    */
  };
  
  const handleHelpClick = () => {
    // Open Telegram help link in a new tab
    window.open('https://t.me/Blackdoom1', '_blank');
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
        
        {/* Show verification input after starting registration */}
        {hasStartedRegistration && !isRegistered && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm mb-2 text-white">
              After registering and depositing 500+ Rs, enter the verification code:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 h-10 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00ECBE] focus:border-transparent"
                placeholder="Enter 6-digit code"
                minLength={6}
                maxLength={6}
              />
              <Button
                type="button"
                className="bg-[#00ECBE] text-gray-900 hover:bg-[#00ECBE]/80"
                onClick={handleVerifyClick}
                disabled={verificationCode.length < 6}
              >
                Verify
              </Button>
            </div>
            <p className="text-xs mt-1 text-gray-400">
              You'll receive this code via SMS/email after your deposit is verified.
            </p>
            <p className="text-xs mt-1 text-[#00ECBE]">
              <span className="font-bold">Demo:</span> For testing, enter any 6 digits.
            </p>
          </motion.div>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;