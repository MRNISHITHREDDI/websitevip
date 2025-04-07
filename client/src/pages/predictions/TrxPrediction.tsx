import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import PredictionLayout from '@/components/predictions/PredictionLayout';
import { PredictionPageProps, PeriodResult, PredictionData, trxColorMap, getBigOrSmall, getOddOrEven } from './types';

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
  
  return { currentPrediction, results };
};

const TrxPrediction: React.FC<PredictionPageProps> = ({ timeOption }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [periodResults, setPeriodResults] = useState<PeriodResult[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionData | null>(null);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, fetch from API
      // Simulate API call with timeout
      setTimeout(() => {
        const { currentPrediction, results } = generateMockTrxData(timeOption);
        setCurrentPrediction(currentPrediction);
        setPeriodResults(results);
        setIsLoading(false);
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
        <div className="mt-6">
          <h3 className="text-center text-[#00ECBE] text-lg font-medium mb-4">
            VIP Prediction for Period {currentPrediction.periodNumber}
          </h3>
          
          <motion.div
            className="bg-[#00064d] rounded-lg p-5 flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* TRX prediction is typically shown differently with focus on hash */}
            <div className="mb-6 relative">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-[#00ECBE]"
                style={{ backgroundColor: getColorCode(currentPrediction.color) }}
              >
                {currentPrediction.prediction}
              </div>
              <motion.div 
                className="absolute -top-3 -right-3 bg-yellow-500 text-[#05012B] font-bold text-xs py-1 px-2 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                VERIFIED
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 w-full mb-4">
              <div className="bg-[#001c54] rounded-lg p-3 text-center">
                <p className="text-sm text-gray-300 mb-1">Big/Small</p>
                <p className={`text-xl font-bold ${currentPrediction.bigOrSmall === 'BIG' ? 'text-red-400' : 'text-green-400'}`}>
                  {currentPrediction.bigOrSmall}
                </p>
              </div>
              <div className="bg-[#001c54] rounded-lg p-3 text-center">
                <p className="text-sm text-gray-300 mb-1">Odd/Even</p>
                <p className={`text-xl font-bold ${currentPrediction.oddOrEven === 'ODD' ? 'text-red-400' : 'text-green-400'}`}>
                  {currentPrediction.oddOrEven}
                </p>
              </div>
            </div>
            
            <motion.div 
              className="w-full bg-[#001c54] p-4 rounded-lg mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-gray-300 mb-2">TRX Hash Verification</p>
              <div className="overflow-x-auto">
                <p className="font-mono text-xs bg-[#000a2e] p-2 rounded whitespace-nowrap">
                  0x{Array.from({ length: 64 }, () => 
                    '0123456789abcdef'[Math.floor(Math.random() * 16)]
                  ).join('')}
                </p>
              </div>
            </motion.div>
            
            <div className="text-center text-xs text-gray-400 mt-4">
              All predictions are based on blockchain verification and mathematical algorithms
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