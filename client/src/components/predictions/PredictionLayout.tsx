import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ChevronDown, RefreshCw, BarChart3, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PeriodResult, PredictionData } from '@/pages/predictions/types';

// Define props for the layout
interface PredictionLayoutProps {
  gameType: 'wingo' | 'trx';
  timeOption: string;
  periodResults: PeriodResult[];
  currentPrediction: PredictionData | null;
  isLoading: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
}

// Floating animation for background elements
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0, -5, 0],
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const PredictionLayout: React.FC<PredictionLayoutProps> = ({
  gameType,
  timeOption,
  periodResults,
  currentPrediction,
  isLoading,
  onRefresh,
  children
}) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Format time properly from seconds
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle countdown timer
  useEffect(() => {
    if (!currentPrediction) return;
    
    setTimeRemaining(currentPrediction.timeRemaining);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          // Refresh when timer ends
          setTimeout(() => {
            handleRefresh();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentPrediction]);
  
  // Game name for display
  const gameName = gameType === 'wingo' ? 'Win Go' : 'TRX Hash';
  
  // Refresh handler with animation
  const handleRefresh = async () => {
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  return (
    <div className="min-h-screen bg-[#05012B] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div 
        className="absolute w-64 h-64 rounded-full bg-[#001c54]/20 blur-3xl -top-20 -left-20 z-0"
        {...floatingAnimation}
      />
      <motion.div 
        className="absolute w-96 h-96 rounded-full bg-[#00ECBE]/5 blur-3xl -bottom-40 -right-20 z-0"
        animate={{
          y: [0, -20, 0],
          transition: {
            duration: 15,
            ease: "easeInOut",
            repeat: Infinity,
          }
        }}
      />
      
      {/* Header */}
      <header className="bg-[#001c54]/90 backdrop-blur-md sticky top-0 z-10 shadow-[0_0_20px_rgba(0,28,84,0.7)]">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div
            onClick={() => window.location.href = '/'}
            className="flex items-center text-[#00ECBE] font-semibold transition-all hover:text-white cursor-pointer"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Home</span>
          </div>
          
          <h1 className="text-xl font-bold tracking-wide flex items-center">
            <Trophy size={20} className="text-yellow-400 mr-2" />
            <span className="text-white">{gameName}</span> 
            <span className="text-[#00ECBE] ml-2">{timeOption}</span>
          </h1>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-10 w-10 flex items-center justify-center text-[#00ECBE] hover:text-white rounded-full hover:bg-[#00ECBE]/10 transition-colors"
          >
            <RefreshCw 
              size={20} 
              className={`${refreshing ? 'animate-spin' : ''}`} 
            />
          </motion.button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Current Period and Timer */}
        <motion.div 
          className="bg-gradient-to-br from-[#001c54] to-[#000c33] rounded-2xl p-6 mb-6 shadow-[0_0_30px_rgba(0,60,150,0.5)] border border-[#00ECBE]/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, type: "spring", damping: 15 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-12 h-12 border-4 border-[#00ECBE] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : currentPrediction ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-[#00ECBE] font-medium mb-1 flex items-center justify-center sm:justify-start">
                    <BarChart3 size={16} className="mr-2" />
                    <span>Current Period</span>
                  </h2>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ECBE]">
                    {currentPrediction.periodNumber}
                  </p>
                </div>
                
                <motion.div 
                  className="flex flex-col items-center rounded-xl bg-gradient-to-br from-[#001845] to-[#000925] p-3 shadow-inner border border-[#00ECBE]/10 min-w-[120px]"
                  animate={{ 
                    boxShadow: timeRemaining < 10 ? 
                      ['0 0 0 rgba(0,236,190,0.3)', '0 0 20px rgba(0,236,190,0.5)', '0 0 0 rgba(0,236,190,0.3)'] : 
                      '0 0 0 rgba(0,236,190,0.3)',
                    transition: {
                      duration: 1,
                      repeat: timeRemaining < 10 ? Infinity : 0
                    }
                  }}
                >
                  <div className="flex items-center text-[#00ECBE] mb-1">
                    <Clock size={16} className="mr-1" />
                    <span className="font-medium text-sm">Remaining</span>
                  </div>
                  <p className={`text-2xl font-bold font-mono ${timeRemaining < 10 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeRemaining)}
                  </p>
                </motion.div>
              </div>
              
              {/* Custom content area */}
              {children}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 p-6">
              <p className="text-gray-400 mb-5 text-center">No active prediction period available</p>
              <motion.button 
                onClick={handleRefresh}
                className="bg-[#00ECBE] text-[#05012B] py-3 px-6 rounded-lg font-medium flex items-center"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw size={18} className="mr-2" />
                Refresh Data
              </motion.button>
            </div>
          )}
        </motion.div>
        
        {/* History Section */}
        <motion.div 
          className="bg-gradient-to-br from-[#001c54] to-[#000c33] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,60,150,0.5)] border border-[#00ECBE]/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring", damping: 15 }}
        >
          <motion.div 
            className="p-4 flex justify-between items-center cursor-pointer" 
            onClick={() => setShowHistory(!showHistory)}
            whileHover={{ backgroundColor: "rgba(0, 236, 190, 0.05)" }}
          >
            <h2 className="text-lg font-semibold text-[#00ECBE] flex items-center">
              <BarChart3 size={18} className="mr-2" />
              <span>Results History</span>
            </h2>
            <motion.div
              animate={{ rotate: showHistory ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={20} className="text-[#00ECBE]" />
            </motion.div>
          </motion.div>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center p-6">
                    <div className="w-8 h-8 border-4 border-[#00ECBE] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : periodResults.length > 0 ? (
                  <div className="p-4">
                    {/* Fixed width consistent columns for better alignment */}
                    <div className="flex mb-3 text-sm text-[#00ECBE]/70 py-2 border-b border-[#00ECBE]/10">
                      <div className="w-[25%] pl-2">
                        <span className="hidden sm:inline">Period</span>
                        <span className="sm:hidden">Period#</span>
                      </div>
                      <div className="w-[25%] flex justify-center sm:justify-start">Result</div>
                      <div className="w-[25%] flex justify-center sm:justify-start">Color</div>
                      <div className="w-[25%] flex justify-center sm:justify-start">Big/Small</div>
                    </div>
                    
                    <div className="space-y-1 max-h-[350px] overflow-auto pr-1">
                      {periodResults.map((period, index) => (
                        <motion.div 
                          key={period.id} 
                          className="flex py-3 px-1 rounded-lg hover:bg-[#001845]/50 text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <div className="w-[25%] font-medium truncate pl-2">
                            <span className="hidden sm:inline">{period.periodNumber}</span>
                            <span className="sm:hidden">#{period.periodNumber.slice(-3)}</span>
                          </div>
                          <div className="w-[25%] flex justify-center sm:justify-start">
                            <span 
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white"
                              style={{ backgroundColor: getColorCode(period.color) }}
                            >
                              {period.result}
                            </span>
                          </div>
                          <div className="w-[25%] flex justify-center sm:justify-start">
                            <span 
                              className="inline-block w-7 h-7 rounded-full border border-white/10"
                              style={{ backgroundColor: getColorCode(period.color) }}
                            ></span>
                          </div>
                          <div className="w-[25%] flex justify-center sm:justify-start">
                            <span className={`font-medium ${period.bigOrSmall === 'BIG' ? 'text-red-400' : 'text-green-400'}`}>
                              {period.bigOrSmall}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center p-8 text-gray-400">
                    <div className="text-center">
                      <p className="mb-2">No results to display</p>
                      <button 
                        onClick={handleRefresh}
                        className="text-[#00ECBE] hover:text-white text-sm underline"
                      >
                        Refresh data
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Footer with copyright */}
        <motion.div
          className="mt-8 text-center text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>© 2025 JALWA VIP. All VIP predictions are provided for educational purposes only.</p>
          <p className="mt-1">Not financial advice. Contact @Blackdoom1 on Telegram for support.</p>
        </motion.div>
      </main>
    </div>
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

export default PredictionLayout;