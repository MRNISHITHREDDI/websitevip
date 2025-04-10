import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Import the attached assets
import predictionImage from "@assets/Screenshot 2025-04-10 233433.png";
import predictionHistoryImage from "@assets/Screenshot 2025-04-10 233417.png";
import resultsHistoryImage from "@assets/Screenshot 2025-04-10 233454.png";

interface DemoVipPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVipPredictionModal = ({ isOpen, onClose }: DemoVipPredictionModalProps) => {
  const [currentTab, setCurrentTab] = useState("current");
  
  // Define all available tabs
  const tabs = [
    { id: "current", label: "Current Prediction", image: predictionImage },
    { id: "history", label: "Prediction History", image: predictionHistoryImage },
    { id: "results", label: "Results History", image: resultsHistoryImage }
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 border-none rounded-xl overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-[#001c54] to-[#000c33] text-white border border-[#00ECBE]/30 shadow-[0_0_30px_rgba(0,236,190,0.3)] rounded-xl overflow-hidden"
        >
          <DialogHeader className="relative p-5 border-b border-[#00ECBE]/20 bg-[#001c54]/80">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-all"
            >
              <X size={18} />
            </button>
            
            <DialogTitle className="text-center text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00ECBE] to-[#00ECBE]/80">
                DEMO VIP PREDICTION
              </span>
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Experience our premium VIP predictions with these demo examples
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-[#000A33] p-1 rounded-none border-b border-[#00ECBE]/20">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="data-[state=active]:bg-[#00ECBE] data-[state=active]:text-[#05012B] data-[state=active]:font-medium py-2 rounded-lg transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="relative">
              {/* Navigation arrows */}
              <button 
                onClick={goToPrevTab}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-2 text-white/70 hover:text-white transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button 
                onClick={goToNextTab}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-2 text-white/70 hover:text-white transition-all"
              >
                <ChevronRight size={20} />
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
                      className="p-6 flex justify-center items-center min-h-[350px]"
                    >
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[700px] rounded-lg overflow-hidden shadow-2xl"
                      >
                        <img 
                          src={tab.image} 
                          alt={tab.label}
                          className="w-full h-auto object-cover border border-[#00ECBE]/20 rounded-lg"
                        />
                      </motion.div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </Tabs>
          
          <div className="px-6 py-4 flex justify-center border-t border-[#00ECBE]/20 bg-[#001232]">
            <motion.button 
              onClick={onClose}
              className="bg-gradient-to-r from-[#00ECBE] to-[#00D9AD] text-[#05012B] font-semibold px-8 py-2.5 rounded-lg transition-all shadow-[0_0_10px_rgba(0,220,180,0.3)]"
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
      </DialogContent>
    </Dialog>
  );
};

export default DemoVipPredictionModal;