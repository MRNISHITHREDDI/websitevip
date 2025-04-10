import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface JoinProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinProModal = ({ isOpen, onClose }: JoinProModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b from-[#001c54] to-[#000c33] border border-[#00ECBE]/30 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Welcome to VIP Prediction!
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <p className="text-center text-gray-300">
            Our prediction system offers:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[#00ECBE] h-6 w-6 flex-shrink-0 mt-0.5" />
              <p className="text-gray-100">
                <span className="font-bold">100% accurate predictions</span> for
                accounts created through our server
              </p>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 h-6 w-6 flex-shrink-0 mt-0.5" />
              <p className="text-gray-100">
                <span className="font-bold">Only 20% accuracy</span> for
                accounts not created through our server
              </p>
            </div>
          </div>

          <p className="text-center text-gray-300 pt-2">
            Create a new account now to access VIP predictions. It's completely
            free!
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <motion.a
            href="https://t.me/bongjayantavip"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00ECBE] text-[#05012B] font-semibold px-8 py-3 rounded-full transition duration-300 text-center w-full"
            whileHover={{
              boxShadow: "0 0 20px 0 rgba(0, 236, 190, 0.6)",
              y: -2,
            }}
          >
            Join Telegram
          </motion.a>

          <Button
            onClick={onClose}
            className="bg-transparent border border-[#00ECBE] text-[#00ECBE] px-8 py-3 rounded-full transition duration-300 text-center w-full"
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProModal;
