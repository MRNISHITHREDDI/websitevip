import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ChevronDown, RefreshCw, BarChart3, Trophy, Check, X, Layers, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PeriodResult, PredictionData } from '@/pages/predictions/types';
import { useIsMobile } from '@/hooks/use-mobile';

// Define props for the layout
interface PredictionLayoutProps {
  gameType: 'wingo' | 'trx';
  timeOption: string;
  periodResults: PeriodResult[];
  currentPrediction: PredictionData | null;
  isLoading: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  previousPredictions?: PredictionData[]; // Add previous predictions for tracking win/loss
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
  children,
  previousPredictions = []
}) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showPredictions, setShowPredictions] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prediction' | 'history'>('prediction');
  const isMobile = useIsMobile();
  
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
  
  // Get status color for win/loss
  const getStatusColor = (status: 'WIN' | 'LOSS' | null) => {
    if (status === 'WIN') {
      return '#52C41A'; // green
    } else if (status === 'LOSS') {
      return '#FF4D4F'; // red
    }
    return '#888888'; // neutral gray
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
            <span className="hidden sm:inline">Back to Home</span>
          </div>
          
          <h1 className="text-xl font-bold tracking-wide flex items-center">
            <Trophy size={18} className="text-yellow-400 mr-2" />
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
      
      {/* Mobile tab selectors for mobile view */}
      {isMobile && (
        <div className="sticky top-[57px] z-10 bg-[#05012B] shadow-md">
          <div className="flex w-full border-b border-[#00ECBE]/10">
            <motion.button
              className={`flex-1 py-3 px-2 items-center justify-center flex space-x-1 ${
                activeTab === 'prediction' ? 'text-[#00ECBE] border-b-2 border-[#00ECBE]' : 'text-white/70'
              }`}
              onClick={() => setActiveTab('prediction')}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy size={16} />
              <span>Prediction</span>
            </motion.button>
            <motion.button
              className={`flex-1 py-3 px-2 items-center justify-center flex space-x-1 ${
                activeTab === 'history' ? 'text-[#00ECBE] border-b-2 border-[#00ECBE]' : 'text-white/70'
              }`}
              onClick={() => setActiveTab('history')}
              whileTap={{ scale: 0.95 }}
            >
              <History size={16} />
              <span>History</span>
            </motion.button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="container mx-auto px-3 py-4 relative z-10">
        {/* Desktop view or Mobile Prediction tab */}
        {(!isMobile || (isMobile && activeTab === 'prediction')) && (
          <>
            {/* Current Period and Timer - Desktop Only */}
            {!isMobile ? (
              <motion.div 
                className="rounded-2xl p-6 bg-gradient-to-br from-[#001c54] to-[#000c33] mb-5 shadow-lg border border-[#00ECBE]/20"
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
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                      <div className="text-center sm:text-left">
                        <h2 className="text-[#00ECBE] font-medium mb-1 flex items-center justify-center sm:justify-start text-sm">
                          <BarChart3 size={14} className="mr-1" />
                          <span>Current Period</span>
                        </h2>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00ECBE]">
                          {currentPrediction.periodNumber}
                        </p>
                      </div>
                      
                      <motion.div 
                        className="flex flex-col items-center rounded-lg bg-gradient-to-br from-[#001845] to-[#000925] p-3 min-w-[120px] shadow-inner border border-[#00ECBE]/10"
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
                          <span className="font-medium text-xs">Remaining</span>
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
                  <div className="flex flex-col items-center justify-center h-40 p-4">
                    <p className="text-gray-400 mb-5 text-center">No active prediction period available</p>
                    <motion.button
                
                    onClick={handleRefresh}
                    className="bg-[#00ECBE] text-[#05012B] py-2 px-5 rounded-lg font-medium flex items-center text-sm"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px 0 rgba(0, 236, 190, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh Data
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
        
        {/* History View (desktop or mobile history tab) */}
        {(!isMobile || (isMobile && activeTab === 'history')) && (
          <>
            {/* Prediction History with Win/Loss - Card Style for Mobile */}
            <motion.div 
              className={`${isMobile ? 'rounded-xl' : 'rounded-2xl'} bg-gradient-to-br from-[#001c54] to-[#000c33] overflow-hidden shadow-lg border border-[#00ECBE]/20 mb-5`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, type: "spring", damping: 15 }}
            >
              <motion.div 
                className="p-4 flex justify-between items-center cursor-pointer" 
                onClick={() => !isMobile && setShowPredictions(!showPredictions)}
                whileHover={{ backgroundColor: isMobile ? "" : "rgba(0, 236, 190, 0.05)" }}
              >
                <h2 className="text-lg font-semibold text-[#00ECBE] flex items-center">
                  <Trophy size={18} className="mr-2 text-yellow-400" />
                  <span>Prediction History</span>
                </h2>
                {!isMobile && (
                  <motion.div
                    animate={{ rotate: showPredictions ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className="text-[#00ECBE]" />
                  </motion.div>
                )}
              </motion.div>
              
              <AnimatePresence mode="wait">
                {(isMobile || showPredictions) && (
                  <motion.div
                    key="predictions-content-fixed"
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
                    ) : previousPredictions.length > 0 ? (
                      <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
                        <div className="max-h-[300px] overflow-auto">
                          {isMobile ? (
                            // Card view for mobile
                            <div className="grid grid-cols-1 gap-3">
                              {previousPredictions.map((prediction, index) => {
                                // Determine if the Big/Small prediction was correct
                                let bigSmallStatus = null;
                                if (prediction.actualResult !== undefined && prediction.actualResult !== null) {
                                  const actualBigSmall = prediction.actualResult >= 5 ? 'BIG' : 'SMALL';
                                  bigSmallStatus = prediction.bigOrSmall === actualBigSmall ? 'WIN' : 'LOSS';
                                }
                                
                                return (
                                  <motion.div 
                                    key={prediction.id}
                                    className={`p-3 rounded-lg ${bigSmallStatus === 'WIN' ? 'border-l-4 border-green-500' : bigSmallStatus === 'LOSS' ? 'border-l-4 border-red-500' : 'border-l-4 border-gray-600'} bg-[#001230] flex items-center justify-between`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                  >
                                    <div>
                                      <div className="text-xs text-gray-400 mb-1">Period #{prediction.periodNumber.slice(-4)}</div>
                                      <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                          prediction.bigOrSmall === 'BIG' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                          {prediction.bigOrSmall}
                                        </span>
                                        {prediction.actualResult !== undefined && prediction.actualResult !== null && (
                                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                            Result: {prediction.actualResult}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {bigSmallStatus && (
                                      <div className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center ${
                                        bigSmallStatus === 'WIN' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                      }`}>
                                        {bigSmallStatus === 'WIN' ? (
                                          <Check size={12} className="mr-1" />
                                        ) : (
                                          <X size={12} className="mr-1" />
                                        )}
                                        {bigSmallStatus}
                                      </div>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            // Table view for desktop
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="text-[#00ECBE]/70 border-b border-[#00ECBE]/10">
                                  <th className="py-2 font-medium text-center">
                                    <span className="hidden sm:inline">Period</span>
                                    <span className="sm:hidden">Period#</span>
                                  </th>
                                  <th className="py-2 font-medium text-center">Big/Small</th>
                                  <th className="py-2 font-medium text-center">Actual</th>
                                  <th className="py-2 font-medium text-center">Win/Loss</th>
                                </tr>
                              </thead>
                              <tbody>
                                {previousPredictions.map((prediction, index) => {
                                  // Determine if the Big/Small prediction was correct
                                  let bigSmallStatus = null;
                                  if (prediction.actualResult !== undefined && prediction.actualResult !== null) {
                                    const actualBigSmall = prediction.actualResult >= 5 ? 'BIG' : 'SMALL';
                                    bigSmallStatus = prediction.bigOrSmall === actualBigSmall ? 'WIN' : 'LOSS';
                                  }
                                  
                                  return (
                                    <motion.tr 
                                      key={prediction.id} 
                                      className="hover:bg-[#001845]/50"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05, duration: 0.2 }}
                                    >
                                      <td className="py-3 text-center">
                                        <span className="hidden sm:inline truncate inline-block max-w-[100px]">
                                          {prediction.periodNumber}
                                        </span>
                                        <span className="sm:hidden">
                                          #{prediction.periodNumber.slice(-3)}
                                        </span>
                                      </td>
                                      <td className="py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                          prediction.bigOrSmall === 'BIG' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                          {prediction.bigOrSmall}
                                        </span>
                                      </td>
                                      <td className="py-3 text-center">
                                        {prediction.actualResult !== undefined && prediction.actualResult !== null ? (
                                          <span className="font-medium">{prediction.actualResult}</span>
                                        ) : (
                                          <span className="text-gray-500">-</span>
                                        )}
                                      </td>
                                      <td className="py-3 text-center">
                                        {bigSmallStatus === 'WIN' ? (
                                          <div className="flex justify-center">
                                            <span className="bg-green-500/20 text-green-400 rounded-full flex items-center justify-center w-7 h-7">
                                              <Check size={14} />
                                            </span>
                                          </div>
                                        ) : bigSmallStatus === 'LOSS' ? (
                                          <div className="flex justify-center">
                                            <span className="bg-red-500/20 text-red-400 rounded-full flex items-center justify-center w-7 h-7">
                                              <X size={14} />
                                            </span>
                                          </div>
                                        ) : (
                                          <span className="text-gray-500">-</span>
                                        )}
                                      </td>
                                    </motion.tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center p-8 text-gray-400">
                        <div className="text-center">
                          <p className="mb-2">No prediction history yet</p>
                          <p className="text-sm">Play a few rounds to see your prediction accuracy</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results History Section - Card Style for Mobile */}
            <motion.div 
              className={`${isMobile ? 'rounded-xl' : 'rounded-2xl'} bg-gradient-to-br from-[#001c54] to-[#000c33] overflow-hidden shadow-lg border border-[#00ECBE]/20`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, type: "spring", damping: 15 }}
            >
              <motion.div 
                className="p-4 flex justify-between items-center cursor-pointer" 
                onClick={() => !isMobile && setShowHistory(!showHistory)}
                whileHover={{ backgroundColor: isMobile ? "" : "rgba(0, 236, 190, 0.05)" }}
              >
                <h2 className="text-lg font-semibold text-[#00ECBE] flex items-center">
                  <BarChart3 size={18} className="mr-2" />
                  <span>Results History</span>
                </h2>
                {!isMobile && (
                  <motion.div
                    animate={{ rotate: showHistory ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={20} className="text-[#00ECBE]" />
                  </motion.div>
                )}
              </motion.div>
              
              <AnimatePresence mode="wait">
                {(isMobile || showHistory) && (
                  <motion.div
                    key="history-content-fixed"
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
                      <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
                        <div className="max-h-[300px] overflow-auto">
                          {isMobile ? (
                            // Card view for mobile
                            <div className="grid grid-cols-1 gap-3">
                              {periodResults.map((period, index) => {
                                const colorName = period.color;
                                const isBig = period.result >= 5;
                                
                                return (
                                  <motion.div 
                                    key={period.id}
                                    className={`p-3 rounded-lg bg-[#001230] border-l-4`}
                                    style={{ borderLeftColor: getColorCode(colorName) }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="text-xs text-gray-400 mb-1">Period #{period.periodNumber.slice(-4)}</div>
                                      <div className="flex items-center">
                                        <span 
                                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white mr-2"
                                          style={{ backgroundColor: getColorCode(colorName) }}
                                        >
                                          {period.result}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <span className="text-xs capitalize px-2 py-0.5 rounded-full" 
                                            style={{ 
                                              backgroundColor: `${getColorCode(colorName)}33`,
                                              color: getColorCode(colorName)
                                            }}>
                                        {colorName}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        isBig ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                      }`}>
                                        {isBig ? 'BIG' : 'SMALL'}
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            // Table view for desktop
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="text-[#00ECBE]/70 border-b border-[#00ECBE]/10">
                                  <th className="py-2 font-medium text-center w-1/4">
                                    <span className="hidden sm:inline">Period</span>
                                    <span className="sm:hidden">Period#</span>
                                  </th>
                                  <th className="py-2 font-medium text-center w-1/4">Result</th>
                                  <th className="py-2 font-medium text-center w-1/4">Color</th>
                                  <th className="py-2 font-medium text-center w-1/4">Big/Small</th>
                                </tr>
                              </thead>
                              <tbody>
                                {periodResults.map((period, index) => (
                                  <motion.tr 
                                    key={period.id} 
                                    className="hover:bg-[#001845]/50"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                  >
                                    <td className="py-3 text-center">
                                      <span className="hidden sm:inline truncate inline-block max-w-[100px]">
                                        {period.periodNumber}
                                      </span>
                                      <span className="sm:hidden">
                                        #{period.periodNumber.slice(-3)}
                                      </span>
                                    </td>
                                    <td className="py-3 text-center">
                                      <div className="flex justify-center">
                                        <span 
                                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white"
                                          style={{ backgroundColor: getColorCode(period.color) }}
                                        >
                                          {period.result}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-3 text-center">
                                      <span className="capitalize" style={{ color: getColorCode(period.color) }}>
                                        {period.color}
                                      </span>
                                    </td>
                                    <td className="py-3 text-center">
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        period.result >= 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                      }`}>
                                        {period.result >= 5 ? 'BIG' : 'SMALL'}
                                      </span>
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center p-8 text-gray-400">
                        <p>No results history available yet</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
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
    // If violet is ever received, we'll convert it to green for display
    case 'violet':
      return '#7C3AED'; // Now properly displaying violet
    default:
      return '#1890FF'; // Default to blue
  }
};

export default PredictionLayout;