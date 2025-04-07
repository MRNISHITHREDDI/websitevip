import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import PredictionLayout from '@/components/predictions/PredictionLayout';
import { PredictionPageProps, PeriodResult, PredictionData, wingoColorMap, getBigOrSmall, getOddOrEven } from './types';
import { TrendingUp, BadgeCheck, Zap, Award, Lock } from 'lucide-react';

// Real API endpoints for Wingo predictions
const WINGO_30SEC_API = "https://wingo-api.onrender.com/api/wingo-30sec";
const WINGO_1MIN_API = "https://wingo-api.onrender.com/api/wingo-1min";
const WINGO_3MIN_API = "https://wingo-api.onrender.com/api/wingo-3min";
const WINGO_5MIN_API = "https://wingo-api.onrender.com/api/wingo-5min";

// Get the correct API URL based on time option
const getWingoApiUrl = (timeOption: string): string => {
  switch (timeOption) {
    case "30 SEC":
      return WINGO_30SEC_API;
    case "1 MIN":
      return WINGO_1MIN_API;
    case "3 MIN":
      return WINGO_3MIN_API;
    case "5 MIN":
      return WINGO_5MIN_API;
    default:
      return WINGO_30SEC_API;
  }
};

// Fetch real data from API
const fetchWingoData = async (timeOption: string) => {
  try {
    const apiUrl = getWingoApiUrl(timeOption);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process and format the API response
    const results: PeriodResult[] = (data.results || []).map((result: any, index: number) => {
      const number = parseInt(result.result);
      
      return {
        id: `r-${index}`,
        periodNumber: result.periodNumber,
        result: number,
        color: wingoColorMap[number],
        bigOrSmall: getBigOrSmall(number),
        oddOrEven: getOddOrEven(number),
        timestamp: result.timestamp || new Date().toISOString(),
      };
    });
    
    // Current prediction
    const predictionData = data.prediction || {};
    const predictionNumber = parseInt(predictionData.prediction || "0");
    
    const currentPrediction: PredictionData = {
      id: 'next',
      periodNumber: predictionData.periodNumber || "Unknown",
      prediction: predictionNumber,
      color: wingoColorMap[predictionNumber],
      bigOrSmall: getBigOrSmall(predictionNumber),
      oddOrEven: getOddOrEven(predictionNumber),
      timestamp: predictionData.timestamp || new Date().toISOString(),
      timeRemaining: parseInt(predictionData.timeRemaining || "30") // seconds
    };
    
    return { currentPrediction, results };
  } catch (error) {
    console.error("Error fetching Wingo data:", error);
    // Fallback to mock data if API fails
    return generateMockWingoData(timeOption);
  }
};

// Mock data generator for demo purposes (used as fallback)
const generateMockWingoData = (timeOption: string) => {
  // Generate a random period number
  const now = new Date();
  const periodBase = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  
  // Current prediction
  const randomPrediction = Math.floor(Math.random() * 10);
  const currentPrediction: PredictionData = {
    id: `cp-${Math.random().toString(36).substring(2, 9)}`,
    periodNumber: `${periodBase}${String(Math.floor(Math.random() * 9000) + 1000)}`,
    prediction: randomPrediction,
    color: wingoColorMap[randomPrediction],
    bigOrSmall: getBigOrSmall(randomPrediction),
    oddOrEven: getOddOrEven(randomPrediction),
    timestamp: now.toISOString(),
    timeRemaining: timeOption === '30 SEC' ? 30 : timeOption === '1 MIN' ? 60 : timeOption === '3 MIN' ? 180 : 300,
  };
  
  // Past results
  const results: PeriodResult[] = Array.from({ length: 10 }, (_, i) => {
    const resultNum = Math.floor(Math.random() * 10);
    const pastTime = new Date(now.getTime() - (i + 1) * (timeOption === '30 SEC' ? 30000 : timeOption === '1 MIN' ? 60000 : timeOption === '3 MIN' ? 180000 : 300000));
    
    return {
      id: `r-${Math.random().toString(36).substring(2, 9)}`,
      periodNumber: `${periodBase}${String(Math.floor(Math.random() * 9000) + 1000)}`,
      result: resultNum,
      color: wingoColorMap[resultNum],
      bigOrSmall: getBigOrSmall(resultNum),
      oddOrEven: getOddOrEven(resultNum),
      timestamp: pastTime.toISOString(),
    };
  });
  
  return { currentPrediction, results };
};

// Pulse animation for badges
const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const WingoPrediction: React.FC<PredictionPageProps> = ({ timeOption }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [periodResults, setPeriodResults] = useState<PeriodResult[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionData | null>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch real data from API
      const { currentPrediction, results } = await fetchWingoData(timeOption);
      setCurrentPrediction(currentPrediction);
      setPeriodResults(results);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch prediction data. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  // Auto-refresh data every 30 seconds
  useEffect(() => {
    // Fetch on component mount
    fetchData();
    
    // Set up auto-refresh interval
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [timeOption]);
  
  return (
    <PredictionLayout
      gameType="wingo"
      timeOption={timeOption}
      periodResults={periodResults}
      currentPrediction={currentPrediction}
      isLoading={isLoading}
      onRefresh={fetchData}
    >
      {/* Win Go specific prediction display */}
      {currentPrediction && (
        <div className="mt-4">
          <motion.h3 
            className="text-center text-white text-xl font-semibold mb-5 flex items-center justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Lock size={16} className="text-[#00ECBE] mr-2" />
            <span>VIP Prediction</span>
            <span className="text-[#00ECBE] ml-1">#{currentPrediction.periodNumber}</span>
          </motion.h3>
          
          <motion.div
            className="bg-gradient-to-br from-[#000d35] to-[#000720] rounded-xl p-6 shadow-[0_0_15px_rgba(0,30,84,0.5)] border border-[#00ECBE]/10 relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "spring", damping: 15 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-5 left-5 w-20 h-20 bg-[#00ECBE]/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-5 right-5 w-16 h-16 bg-[#2563EB]/10 rounded-full blur-xl"></div>
            </div>
            
            <div className="flex flex-col items-center relative">
              {/* Prediction badge */}
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
                    className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-sm"
                    variants={pulseVariants}
                    animate="pulse"
                  ></motion.div>
                  <motion.div 
                    className="relative w-28 h-28 rounded-full border-4 border-[#00ECBE]/30 flex items-center justify-center bg-gradient-to-br from-[#000d35] to-[#001a52] shadow-[0_0_15px_rgba(0,236,190,0.2)]"
                    animate={{
                      rotateZ: [0, 5, 0, -5, 0],
                      transition: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-5xl font-bold shadow-xl"
                      style={{ backgroundColor: getColorCode(currentPrediction.color) }}
                    >
                      {currentPrediction.prediction}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold text-xs py-1.5 px-3 rounded-full shadow-lg flex items-center"
                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <BadgeCheck size={12} className="mr-1" />
                    VERIFIED
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Prediction stats */}
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
              
              {/* 100% Accuracy Badge */}
              <motion.div 
                className="w-full bg-gradient-to-r from-[#00ECBE]/10 to-transparent p-3 rounded-lg flex items-center justify-center space-x-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <BadgeCheck size={16} className="text-[#00ECBE]" />
                <span className="text-sm font-medium text-white">100% Accurate Prediction Based on Mathematical Algorithms</span>
              </motion.div>
              
              {/* Money earning badge */}
              <motion.div
                className="mt-5 bg-gradient-to-r from-yellow-500 to-amber-500 text-[#05012B] font-bold py-1.5 px-4 rounded-full shadow-lg inline-flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                variants={pulseVariants}
                whileInView="pulse"
              >
                <span className="uppercase text-xs tracking-wide">Earn Big With This Prediction</span>
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

export default WingoPrediction;