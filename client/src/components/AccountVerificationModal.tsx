import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Lock, Rocket, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  gameType: 'wingo' | 'trx';
  timeOption: string;
}

const AccountVerificationModal = ({ isOpen, onClose, onContinue, gameType, timeOption }: AccountVerificationModalProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  
  const handleStartClick = () => {
    // Open the registration link in a new tab
    window.open('https://www.jalwa.vip/#/register?invitationCode=327361287589', '_blank');
    
    // In a real implementation, we would verify that the user created an account
    // Here we're simulating verification after clicking the Start button
    toast({
      title: "🚀 Registration Started",
      description: "Please complete the registration process to access VIP predictions.",
      duration: 5000,
    });
    
    // Simulate a delayed verification process
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
      // Show error message when trying to click continue without verification
      toast({
        title: "🔒 Access Locked",
        description: "Please create an account first by clicking the 'Start' button.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Store verification status in localStorage for future sessions
    localStorage.setItem('jalwaAccountVerified', 'true');
    
    // Close the modal and continue to predictions
    onContinue();
  };
  
  const handleHelpClick = () => {
    // Open Telegram help channel
    window.open('https://t.me/Bongjayanta2', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 text-white border-none">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-center mb-2">
            <Rocket className="h-6 w-6 mr-2 text-amber-400" />
            <DialogTitle className="text-2xl font-bold text-center text-white">JALWA VIP PREDICTION</DialogTitle>
          </div>
          <Badge variant="outline" className="mx-auto w-auto p-1 px-3 bg-indigo-900/50 text-amber-300 mb-3">
            🚀 Important Instructions
          </Badge>
        </DialogHeader>
        
        <div className="p-6 pt-2 space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-400 flex-shrink-0" />
            <p className="text-gray-200 text-sm">
              Create a new account via the "Start" button for server connection. Our app checks the server to ensure accurate predictions.
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-400 flex-shrink-0" />
            <p className="text-gray-200 text-sm">
              Warning: Accounts not created through our link will give incorrect predictions due to server mismatch.
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-400 flex-shrink-0" />
            <p className="text-gray-200 text-sm">
              Old accounts will also provide incorrect predictions due to server mismatch.
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 mt-0.5 text-green-400 flex-shrink-0" />
            <p className="text-gray-200 text-sm">
              For 100% accurate predictions, use the account created via our URL.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 pb-1">
            <Button
              onClick={handleStartClick}
              className="w-full sm:w-auto transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              Start
            </Button>
            
            <Button
              onClick={handleContinueClick}
              className={`w-full sm:w-auto transition-all ${
                isVerified 
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" 
                  : "bg-gray-700 hover:bg-gray-600 opacity-80"
              } text-white`}
            >
              {isVerified ? "Continue" : (
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  <span>Continue</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={handleHelpClick}
              variant="outline"
              className="w-full sm:w-auto border-indigo-500 text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
        
        {!isVerified && (
          <div className="mt-2 p-4 bg-slate-900/90 border-t border-indigo-900/50">
            <div className="flex items-center mb-1">
              <Lock className="h-5 w-5 mr-2 text-amber-400" />
              <h3 className="font-bold text-amber-300">Access Locked</h3>
            </div>
            <p className="text-gray-300 text-sm pl-7">
              Follow these steps to unlock premium predictions:
            </p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1 pl-7">
              <li>• Click "Start" to create a new account</li>
              <li>• Wait for system verification (usually instant)</li>
              <li>• After verification, the "Continue" button will unlock, granting you access to premium features.</li>
            </ul>
            
            <div className="mt-3 pt-3 border-t border-indigo-900/30">
              <h4 className="font-bold text-amber-300 text-sm mb-2">⚠️ IMPORTANT:</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• Only accounts created through this app receive winning predictions</li>
                <li>• Existing accounts will have limited functionality</li>
                <li>• For best results, create a new account and follow the steps above</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AccountVerificationModal;