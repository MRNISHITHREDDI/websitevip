import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the attached assets
import predictionImage from "@assets/Screenshot 2025-04-10 233433.png";
import predictionHistoryImage from "@assets/Screenshot 2025-04-10 233417.png";
import resultsHistoryImage from "@assets/Screenshot 2025-04-10 233454.png";

interface DemoVipPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVipPredictionModal = ({ isOpen, onClose }: DemoVipPredictionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-[#05012B] text-white border border-[#00ECBE] p-0">
        <DialogHeader className="p-4 border-b border-[#00ECBE] border-opacity-20">
          <DialogTitle className="text-center text-2xl font-bold text-[#00ECBE]">
            DEMO VIP PREDICTION
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Experience our premium VIP predictions with these demo examples
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4 bg-[#0a0442] p-1 rounded-none border-b border-[#00ECBE] border-opacity-20">
            <TabsTrigger 
              value="current" 
              className="data-[state=active]:bg-[#00ECBE] data-[state=active]:text-black"
            >
              Current Prediction
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-[#00ECBE] data-[state=active]:text-black"
            >
              Prediction History
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-[#00ECBE] data-[state=active]:text-black"
            >
              Results History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="p-4 flex justify-center">
            <img 
              src={predictionImage} 
              alt="VIP Prediction" 
              className="max-w-full h-auto rounded-md border border-[#00ECBE] border-opacity-30 shadow-xl"
            />
          </TabsContent>
          
          <TabsContent value="history" className="p-4 flex justify-center">
            <img 
              src={predictionHistoryImage} 
              alt="Prediction History" 
              className="max-w-full h-auto rounded-md border border-[#00ECBE] border-opacity-30 shadow-xl"
            />
          </TabsContent>
          
          <TabsContent value="results" className="p-4 flex justify-center">
            <img 
              src={resultsHistoryImage} 
              alt="Results History" 
              className="max-w-full h-auto rounded-md border border-[#00ECBE] border-opacity-30 shadow-xl"
            />
          </TabsContent>
        </Tabs>
        
        <div className="px-4 py-3 flex justify-center border-t border-[#00ECBE] border-opacity-20">
          <Button 
            onClick={onClose}
            className="bg-[#00ECBE] hover:bg-[#00D9AD] text-black font-bold"
          >
            Close Demo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoVipPredictionModal;