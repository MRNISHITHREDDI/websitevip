import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import PredictionLayout from '@/components/predictions/PredictionLayout';
import { PredictionPageProps, PeriodResult, PredictionData, trxColorMap, getBigOrSmall, getOddOrEven } from './types';
import { TrendingUp, BadgeCheck, Zap, Award, Lock, Database, Hash } from 'lucide-react';

// Mock data generator for demo purposes
const generateMockTrxData = (timeOption: string) => {
  // Generate a random period number
  const now = new Date();
  const periodBase = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  
  // Generate random hash result (typically a hex string ending with a number)
  const generateHash = () => {
    const hexChars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += hexChars[Math.floor(Math.random() * 16)];
    }
    // Make sure last character is a number for prediction purposes
    hash = hash.slice(0, -1) + Math.floor(Math.random() * 10).toString();
    return hash;
  };
  
  // Extract result from hash (last character)
  const getResultFromHash = (hash: string) => parseInt(hash.slice(-1));
  
  // Generate prediction hash
  const predictionHash = generateHash();
  const predictionResult = getResultFromHash(predictionHash);
  
  // Current prediction
  const currentPrediction: PredictionData = {
    id: `cp-${Math.random().toString(36).substring(2, 9)}`,
    periodNumber: `${periodBase}${String(Math.floor(Math.random() * 9000) + 1000)}`,
    prediction: predictionResult,
    color: trxColorMap[predictionResult % 2 === 0 ? 'EVEN' : 'ODD'],
    bigOrSmall: predictionResult >= 5 ? 'BIG' : 'SMALL',
    oddOrEven: predictionResult % 2 === 0 ? 'EVEN' : 'ODD',
    timestamp: now.toISOString(),
    timeRemaining: timeOption === '30 SEC' ? 30 : timeOption === '1 MIN' ? 60 : timeOption === '3 MIN' ? 180 : 300,
  };
  
  // Past results
  const results: PeriodResult[] = Array.from({ length: 10 }, (_, i) => {
    const hash = generateHash();
    const resultNum = getResultFromHash(hash);
    const pastTime = new Date(now.getTime() - (i + 1) * (timeOption === '30 SEC' ? 30000 : timeOption === '1 MIN' ? 60000 : timeOption === '3 MIN' ? 180000 : 300000));
    
    return {
      id: `r-${Math.random().toString(36).substring(2, 9)}`,
      periodNumber: `${periodBase}${String(Math.floor(Math.random() * 9000) + 1000)}`,
      result: resultNum,
      color: trxColorMap[resultNum % 2 === 0 ? 'EVEN' : 'ODD'],
      bigOrSmall: resultNum >= 5 ? 'BIG' : 'SMALL',
      oddOrEven: resultNum % 2 === 0 ? 'EVEN' : 'ODD',
      timestamp: pastTime.toISOString(),
    };
  });
  
  return { currentPrediction, results, hash: predictionHash };
};

// Animation for blockchain verification
const blockchainAnimation = {
  initial: { opacity: 0, width: 0 },
  animate: { 
    opacity: 1, 
    width: "100%",
    transition: { duration: 1 }
  }
};

// Glow pulse animation
const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 0 rgba(0, 236, 190, 0.4)",
      "0 0 20px rgba(0, 236, 190, 0.6)",
      "0 0 0 rgba(0, 236, 190, 0.4)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const TrxPrediction: React.FC<PredictionPageProps> = ({ timeOption }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [periodResults, setPeriodResults] = useState<PeriodResult[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionData | null>(null);
  const [predictionHash, setPredictionHash] = useState<string>('');
  const [verificationComplete, setVerificationComplete] = useState<boolean>(false);
  
  const fetchData = async () => {
    setIsLoading(true);
    setVerificationComplete(false);
    
    try {
      // In a real app, fetch from API
      // Simulate API call with timeout
      setTimeout(() => {
        const { currentPrediction, results, hash } = generateMockTrxData(timeOption);
        setCurrentPrediction(currentPrediction);
        setPeriodResults(results);
        setPredictionHash(hash);
        setIsLoading(false);
        
        // Simulate blockchain verification
        setTimeout(() => {
          setVerificationComplete(true);
        }, 2000);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch prediction data. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [timeOption]);
  
  // Generate shortened hash for display
  const displayHash = predictionHash.length > 20 
    ? `${predictionHash.substring(0, 10)}...${predictionHash.substring(predictionHash.length - 10)}`
    : predictionHash;
    
  // Character animation for hash display
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.005
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <PredictionLayout
      gameType="trx"
      timeOption={timeOption}
      periodResults={periodResults}
      currentPrediction={currentPrediction}
      isLoading={isLoading}
      onRefresh={fetchData}
    >
      {/* TRX specific prediction display */}
      {currentPrediction && (
        <div className="mt-4">
          <motion.h3 
            className="text-center text-white text-xl font-semibold mb-5 flex items-center justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Lock size={16} className="text-[#00ECBE] mr-2" />
            <span>Blockchain Verified Prediction</span>
            <span className="text-[#00ECBE] ml-1">#{currentPrediction.periodNumber}</span>
          </motion.h3>
          
          <motion.div
            className="bg-gradient-to-br from-[#000d35] to-[#000720] rounded-xl p-6 shadow-[0_0_15px_rgba(0,30,84,0.5)] border border-[#00ECBE]/10 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "spring", damping: 15 }}
          >
            {/* Blockchain network background effect */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-full h-full grid grid-cols-10 grid-rows-10 opacity-5">
                {Array.from({ length: 20 }).map((_, index) => (
                  <motion.div 
                    key={index}
                    className="w-1 h-1 bg-white rounded-full absolute"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center relative">
              {/* Prediction number in hexagon shape */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  damping: 12, 
                  stiffness: 100,
                  delay: 0.2
                }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-[#00ECBE]/20 rounded-xl blur-xl"
                    {...glowPulse}
                  ></motion.div>
                  <motion.div 
                    className="relative flex flex-col items-center"
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {/* Hexagon shape with clip-path */}
                    <div className="w-28 h-28 relative">
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-[#00ECBE]/50"
                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                      ></div>
                      <div 
                        className="absolute inset-2 flex items-center justify-center"
                        style={{ 
                          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                          backgroundColor: getColorCode(currentPrediction.color)
                        }}
                      >
                        <span className="text-5xl font-bold text-white">{currentPrediction.prediction}</span>
                      </div>
                    </div>
                    
                    <motion.div 
                      className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-lg flex items-center"
                      initial={{ opacity: 0, scale: 0.5, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <Database size={12} className="mr-1" />
                      BLOCKCHAIN
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Prediction stats in cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-5">
                <motion.div 
                  className="bg-gradient-to-br from-[#001230] to-[#000925] rounded-xl p-4 text-center shadow-lg border border-[#00ECBE]/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 30, 60, 0.5)" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Award size={18} className="text-[#00ECBE] mr-2" />
                    <p className="text-sm text-[#00ECBE] font-medium">Color</p>
                  </div>
                  <p className="text-xl font-bold capitalize" style={{ color: getColorCode(currentPrediction.color) }}>
                    {currentPrediction.color}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-[#001230] to-[#000925] rounded-xl p-4 text-center shadow-lg border border-[#00ECBE]/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 30, 60, 0.5)" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp size={18} className="text-[#00ECBE] mr-2" />
                    <p className="text-sm text-[#00ECBE] font-medium">Big/Small</p>
                  </div>
                  <p className={`text-xl font-bold ${currentPrediction.bigOrSmall === 'BIG' ? 'text-red-400' : 'text-green-400'}`}>
                    {currentPrediction.bigOrSmall}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-[#001230] to-[#000925] rounded-xl p-4 text-center shadow-lg border border-[#00ECBE]/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 30, 60, 0.5)" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Zap size={18} className="text-[#00ECBE] mr-2" />
                    <p className="text-sm text-[#00ECBE] font-medium">Number</p>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {currentPrediction.prediction}
                  </p>
                </motion.div>
              </div>
              
              {/* TRX Hash verification display */}
              <motion.div 
                className="w-full bg-gradient-to-br from-[#001230] to-[#000925] rounded-xl p-4 mt-2 border border-[#00ECBE]/10 shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center mb-3">
                  <Hash size={16} className="text-[#00ECBE] mr-2" />
                  <p className="text-sm text-[#00ECBE] font-medium">Blockchain Hash Verification</p>
                </div>
                
                <div className="bg-[#00081d] rounded-lg p-3 overflow-hidden border border-[#00ECBE]/10">
                  <motion.div className="overflow-x-auto">
                    <motion.p 
                      className="font-mono text-xs text-[#7dd3fc] whitespace-nowrap"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {predictionHash.split('').map((char, index) => (
                        <motion.span 
                          key={index} 
                          variants={item}
                          className={index >= predictionHash.length - 1 ? "text-yellow-400 font-bold" : ""}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.p>
                  </motion.div>
                  
                  {/* Verification progress indicator */}
                  <div className="h-1 w-full bg-[#001845] mt-3 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00ECBE] to-blue-500"
                      {...blockchainAnimation}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-gray-400">Verification Hash</span>
                    <span className="text-[#00ECBE]">
                      {verificationComplete ? (
                        <span className="flex items-center text-green-400">
                          <BadgeCheck size={12} className="mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-yellow-400">Verifying...</span>
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
              
              {/* Money earning badge */}
              <motion.div
                className="mt-5 bg-gradient-to-r from-yellow-500 to-amber-500 text-[#05012B] font-bold py-1.5 px-4 rounded-full shadow-lg inline-flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(234, 179, 8, 0.5)" }}
              >
                <span className="uppercase text-xs tracking-wide">Earn Big With TRX Hash</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </PredictionLayout>
  );
};

// Helper to convert color names to CSS color codes
const getColorCode = (color: string): string => {
  switch (color.toLowerCase()) {
    case 'red':
      return '#FF4D4F';
    case 'green':
      return '#52C41A';
    case 'violet':
      return '#722ED1';
    default:
      return '#666666';
  }
};

export default TrxPrediction;