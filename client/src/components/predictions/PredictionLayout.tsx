import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';
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
            onRefresh();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentPrediction, onRefresh]);
  
  // Game name for display
  const gameName = gameType === 'wingo' ? 'Win Go' : 'TRX Hash';
  
  return (
    <div className="min-h-screen bg-[#05012B] text-white">
      {/* Header */}
      <header className="bg-[#001c54] sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <a className="flex items-center text-[#00ECBE] font-semibold">
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to Home</span>
            </a>
          </Link>
          
          <h1 className="text-xl font-bold">
            {gameName} <span className="text-[#00ECBE]">{timeOption}</span>
          </h1>
          
          <div className="h-10 w-10"></div> {/* Empty div for flex spacing */}
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Current Period and Timer */}
        <motion.div 
          className="bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-xl p-5 mb-6 shadow-[0_0_15px_rgba(0,60,150,0.3)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-10 h-10 border-4 border-[#00ECBE] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : currentPrediction ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-[#00ECBE] font-medium">Current Period</h2>
                  <p className="text-2xl font-bold">{currentPrediction.periodNumber}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-[#00ECBE]">
                    <Clock size={18} className="mr-1" />
                    <span className="font-medium">Time Remaining</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">{formatTime(timeRemaining)}</p>
                </div>
              </div>
              
              {/* Custom content area */}
              {children}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              <p className="text-gray-400 mb-3">No active prediction period</p>
              <button 
                onClick={onRefresh}
                className="bg-[#00ECBE] text-[#05012B] py-2 px-4 rounded-lg font-medium"
              >
                Refresh
              </button>
            </div>
          )}
        </motion.div>
        
        {/* History Section */}
        <motion.div 
          className="bg-gradient-to-b from-[#001c54] to-[#000c33] rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,60,150,0.3)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div 
            className="p-4 flex justify-between items-center cursor-pointer" 
            onClick={() => setShowHistory(!showHistory)}
          >
            <h2 className="text-lg font-semibold text-[#00ECBE]">Last Results</h2>
            <ChevronDown 
              size={20} 
              className={`text-[#00ECBE] transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}
            />
          </div>
          
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
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-5 gap-2 mb-2 text-sm text-gray-400">
                      <div>Period</div>
                      <div>Result</div>
                      <div>Color</div>
                      <div>Big/Small</div>
                      <div>Odd/Even</div>
                    </div>
                    
                    {periodResults.map((period) => (
                      <div key={period.id} className="grid grid-cols-5 gap-2 py-3 border-t border-[#00ECBE]/20 text-sm">
                        <div className="font-medium">{period.periodNumber}</div>
                        <div className="font-bold">{period.result}</div>
                        <div>
                          <span 
                            className="inline-block w-6 h-6 rounded-full"
                            style={{ backgroundColor: getColorCode(period.color) }}
                          ></span>
                        </div>
                        <div className={period.bigOrSmall === 'BIG' ? 'text-red-400' : 'text-green-400'}>
                          {period.bigOrSmall}
                        </div>
                        <div className={period.oddOrEven === 'ODD' ? 'text-red-400' : 'text-green-400'}>
                          {period.oddOrEven}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center p-6 text-gray-400">
                    No results to display
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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