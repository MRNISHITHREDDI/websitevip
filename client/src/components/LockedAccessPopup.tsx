import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LockedAccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LockedAccessPopup: React.FC<LockedAccessPopupProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Auto-close the popup after 8 seconds
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        onClose();
      }, 8000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="bg-[#05012B] border border-amber-500/30 rounded-xl shadow-[0_0_25px_rgba(255,192,0,0.2)] max-w-md w-full z-50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="p-6 pb-5">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 mr-3 text-amber-400" />
                <h2 className="text-xl font-bold text-amber-400">Access Locked</h2>
              </div>
              
              <p className="text-gray-200 text-sm mb-4">
                Follow these steps to unlock premium predictions:
              </p>
              
              <ul className="space-y-2 mb-5 text-sm text-gray-200">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Click "Start" to create a new account</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Wait for system verification (usually instant)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>After verification, the "Continue" button will unlock, granting you access to premium features.</span>
                </li>
              </ul>
              
              <div className="pt-3 border-t border-amber-500/20">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
                  <h3 className="font-bold text-amber-400 text-sm">IMPORTANT:</h3>
                </div>
                
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Only accounts created through this app receive winning predictions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Existing accounts will have limited functionality</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>For best results, create a new account and follow the steps above</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LockedAccessPopup;