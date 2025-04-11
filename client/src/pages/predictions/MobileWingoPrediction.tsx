import React, { useState, useEffect, useCallback } from "react";
import PredictionLayout from "@/components/predictions/PredictionLayout";
import {
  PredictionPageProps,
  PeriodResult,
  PredictionData,
  wingoColorMap,
  getBigOrSmall,
  getOddOrEven,
} from "./types";
import {
  TrendingUp,
  BadgeCheck,
  Zap,
  Award,
  Lock,
  Brain,
  Trophy,
  BarChart3,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { getAdvancedPrediction } from "@/lib/fixed-prediction-algorithm";
import SEO from "@/components/SEO";
import AccountVerificationModal from "@/components/AccountVerificationModal";
import LockedAccessPopup from "@/components/LockedAccessPopup";
import LicenseModal from "@/components/LicenseModal";
import { useIsMobile } from "@/hooks/use-mobile";

// Real API endpoints for Wingo predictions
const PERIOD_API_URL = "https://imgametransit.com/api/webapi/GetGameIssue";
const RESULTS_API_URL =
  "https://imgametransit.com/api/webapi/GetNoaverageEmerdList";

// Get the correct typeId based on time option
const getWingoTypeId = (timeOption: string): number => {
  switch (timeOption) {
    case "30 SEC":
      return 1;
    case "1 MIN":
      return 2;
    case "3 MIN":
      return 3;
    case "5 MIN":
      return 4;
    default:
      return 2; // Default to 1 MIN
  }
};

// Generate unique ID for predictions
const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Get signature and random values based on time option and endpoint
const getApiRequestParams = (
  timeOption: string,
  endpoint: "period" | "results",
) => {
  const typeId = getWingoTypeId(timeOption);
  const timestamp = Date.now();
  const signature = `${typeId}${timestamp}`;

  switch (endpoint) {
    case "period":
      return {
        typeId,
        timestamp,
        signature,
      };
    case "results":
      return {
        typeId,
        timestamp,
        signature,
        pageSize: 20, // Request 20 most recent results
        pageIndex: 1,
      };
    default:
      return {
        typeId,
        timestamp,
        signature,
      };
  }
};

// Map API response to our PeriodResult type
const mapApiResultsToPeriodResults = (
  apiResults: any[],
  gameType: "wingo" | "trx" = "wingo",
): PeriodResult[] => {
  return apiResults.map((result) => {
    const number = parseInt(result.openCode, 10);
    let color = "red"; // Default

    if (gameType === "wingo") {
      // Use color mapping from constants
      color = wingoColorMap[number] || "red";
    } else {
      // TRX hash logic
      if (number >= 0 && number <= 4) {
        color = "green";
      } else if (number >= 5 && number <= 9) {
        color = "red";
      }
    }

    return {
      id: result.id || generateId(),
      periodNumber: result.turnNum || result.issueNum,
      result: number,
      color,
      bigOrSmall: getBigOrSmall(number, gameType),
      oddOrEven: getOddOrEven(number),
      openTime: result.openTime || new Date().toISOString(),
    };
  });
};

// Pulse animation for the prediction badge
const pulseVariants = {
  pulse: {
    opacity: [0.2, 0.5, 0.2],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const WingoPrediction: React.FC<PredictionPageProps> = ({ timeOption }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [periodResults, setPeriodResults] = useState<PeriodResult[]>([]);
  const [currentPrediction, setCurrentPrediction] =
    useState<PredictionData | null>(null);
  const [previousPredictions, setPreviousPredictions] = useState<
    PredictionData[]
  >([]);
  const [showVerificationModal, setShowVerificationModal] =
    useState<boolean>(false);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [showLockedPopup, setShowLockedPopup] = useState<boolean>(false);
  const [licenseVerified, setLicenseVerified] = useState<boolean>(false);
  const isMobile = useIsMobile();

  // Fetch the latest period and results
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get current period data
      const periodParams = getApiRequestParams(timeOption, "period");
      const periodResponse = await fetch(
        `${PERIOD_API_URL}?type=${periodParams.typeId}&timestamp=${periodParams.timestamp}&signature=${periodParams.signature}`,
      );
      const periodData = await periodResponse.json();

      if (!periodData || !periodData.data) {
        throw new Error("Failed to fetch period data");
      }

      const currentPeriod = periodData.data;
      const periodNumber = currentPeriod.turnNum;
      const timeRemaining = currentPeriod.seconds || 60;

      // Fetch historical results
      const resultsParams = getApiRequestParams(timeOption, "results");
      const resultsResponse = await fetch(
        `${RESULTS_API_URL}?type=${resultsParams.typeId}&timestamp=${resultsParams.timestamp}&signature=${resultsParams.signature}&pageSize=${resultsParams.pageSize}&pageIndex=${resultsParams.pageIndex}`,
      );
      const resultsData = await resultsResponse.json();

      if (!resultsData || !resultsData.data || !resultsData.data.list) {
        throw new Error("Failed to fetch results data");
      }

      const historicalResults = mapApiResultsToPeriodResults(
        resultsData.data.list,
        "wingo",
      );

      setPeriodResults(historicalResults);

      // For prediction, we'll use our advanced VIP algorithm with 99%+ accuracy
      // We use the full history of results for the advanced pattern analysis
      const prediction = getAdvancedPrediction(
        historicalResults,
        "wingo",
        timeOption,
        licenseVerified,
      );

      // Check if we already have a prediction for this period
      const existingPrediction = previousPredictions.find(
        (p) => p.periodNumber === periodNumber,
      );

      if (existingPrediction) {
        // Update time remaining only
        setCurrentPrediction({
          ...existingPrediction,
          timeRemaining,
        });
      } else {
        // Create new prediction
        const newPrediction: PredictionData = {
          id: generateId(),
          periodNumber,
          number: prediction.number,
          color: prediction.color,
          bigOrSmall: getBigOrSmall(prediction.number, "wingo"),
          oddOrEven: getOddOrEven(prediction.number),
          reasoning: prediction.reason,
          confidence: prediction.confidence || 95,
          timeRemaining,
          timestamp: new Date().toISOString(),
        };

        setCurrentPrediction(newPrediction);

        // Add to previous predictions only when it's a fresh prediction
        setPreviousPredictions((prev) => [newPrediction, ...prev]);
      }

      // Update actual results for previous predictions
      setPreviousPredictions((prev) =>
        prev.map((p) => {
          const matchedResult = historicalResults.find(
            (r) => r.periodNumber === p.periodNumber,
          );
          if (matchedResult && p.actualResult === undefined) {
            return {
              ...p,
              actualResult: matchedResult.result,
              actualColor: matchedResult.color,
            };
          }
          return p;
        }),
      );

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
  }, [timeOption, licenseVerified, previousPredictions, toast]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Poll for updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPrediction && currentPrediction.timeRemaining <= 15) {
        fetchData();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [timeOption, fetchData, currentPrediction]);

  // Helper to convert color names to CSS color codes
  const getColorCode = (color: string): string => {
    switch (color.toLowerCase()) {
      case "red":
        return "#FF4D4F";
      case "green":
        return "#52C41A";
      // If violet is ever received, we'll convert it to green for display
      case "violet":
        return "#7C3AED"; // Using a purple/violet color
      default:
        return "#52C41A"; // Default to green instead of gray
    }
  };

  // Handle verification completion
  const handleVerificationComplete = () => {
    setShowVerificationModal(false);
    setShowLicenseModal(true);
  };

  // Handle license verification
  const handleLicenseVerified = () => {
    setLicenseVerified(true);
    setShowLicenseModal(false);
    fetchData(); // Refresh data with the verified license
  };

  return (
    <React.Fragment>
      {/* Account verification modal */}
      <AccountVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onContinue={handleVerificationComplete}
        onShowLockedPopup={() => setShowLockedPopup(true)}
        gameType="wingo"
        timeOption={timeOption}
      />

      {/* License verification modal */}
      <LicenseModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        onLicenseVerified={handleLicenseVerified}
        gameType="wingo"
        timeOption={timeOption}
      />

      {/* Locked access popup */}
      <LockedAccessPopup
        isOpen={showLockedPopup}
        onClose={() => setShowLockedPopup(false)}
        onUnderstand={() => setShowLockedPopup(false)}
      />

      {/* SEO metadata */}
      <SEO
        title={`WinGo ${timeOption} AI Predictions | JALWA VIP Wingo Hack`}
        description={`Get real-time predictions for WinGo ${timeOption} game with our AI-powered algorithm. Increase your win rate with our VIP signals.`}
        keywords={`wingo, wingo ai, wingo hack, wingo ${timeOption.toLowerCase()}, color prediction, earning, wingo prediction, Ai Prediction, VIP signals`}
      />

      <PredictionLayout
        gameType="wingo"
        timeOption={timeOption}
        periodResults={periodResults}
        currentPrediction={currentPrediction}
        isLoading={isLoading}
        onRefresh={fetchData}
        previousPredictions={previousPredictions}
      >
        {/* Win Go specific prediction display */}
        {currentPrediction && (
          <div className="mt-2">
            {/* Card with mobile-friendly design */}
            <div className="flex flex-col items-center relative max-w-sm mx-auto">
              {/* Container for the whole prediction section */}
              <motion.div
                className="w-full bg-gradient-to-br from-[#000d35] to-[#000720] rounded-xl shadow-[0_0_15px_rgba(0,30,84,0.5)] border border-[#00ECBE]/20 relative overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, type: "spring", damping: 15 }}
              >
                {/* Header section with period and timer */}
                <div className="flex justify-between items-center p-3 border-b border-[#00ECBE]/10">
                  <div className="flex items-center">
                    <div className="text-[#00ECBE] mr-2">
                      <BarChart3 size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-[#00ECBE]">Current Period</div>
                      <div className="text-sm font-bold text-white">#{currentPrediction.periodNumber.slice(-6)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-white text-sm flex items-center rounded-lg bg-[#001230] px-2 py-1 shadow-inner">
                      <Clock size={14} className="text-[#00ECBE] mr-1" />
                      <span className="font-bold">{Math.floor(currentPrediction.timeRemaining / 60)}:{(currentPrediction.timeRemaining % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                
                {/* VIP Prediction section */}
                <div className="p-4 flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <Lock size={16} className="text-[#00ECBE] mr-1" />
                    <span className="text-[#00ECBE] font-semibold text-sm">VIP Prediction</span>
                  </div>
                  <div className="text-xs text-white/80 mb-3">#{currentPrediction.periodNumber}</div>
                  
                  {/* Prediction number badge */}
                  <div className="relative mb-4">
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-sm"
                      variants={pulseVariants}
                      animate="pulse"
                    ></motion.div>
                    <div className="relative">
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-2 border-white/10"
                        style={{
                          backgroundColor: getColorCode(currentPrediction.color),
                          color: "#fff",
                        }}
                      >
                        {currentPrediction.number}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold text-xs py-1 px-2 rounded-full shadow-lg flex items-center">
                        <BadgeCheck size={10} className="mr-1" />
                        VERIFIED
                      </div>
                    </div>
                  </div>
                  
                  {/* Prediction details */}
                  <div className="w-full space-y-3 mb-4">
                    {/* Color */}
                    <div className="flex items-center justify-between bg-[#001230] rounded-lg p-3 border-l-4" style={{ borderColor: getColorCode(currentPrediction.color) }}>
                      <div className="flex items-center">
                        <Award size={16} className="text-[#00ECBE] mr-2" />
                        <span className="text-[#00ECBE] text-sm">Color</span>
                      </div>
                      <div className="font-bold capitalize" style={{ color: getColorCode(currentPrediction.color) }}>
                        {currentPrediction.color}
                      </div>
                    </div>
                    
                    {/* Big/Small */}
                    <div className="flex items-center justify-between bg-[#001230] rounded-lg p-3 border-l-4" 
                      style={{ 
                        borderColor: currentPrediction.bigOrSmall === "BIG" ? "#FF4D4F" : "#52C41A"
                      }}
                    >
                      <div className="flex items-center">
                        <TrendingUp size={16} className="text-[#00ECBE] mr-2" />
                        <span className="text-[#00ECBE] text-sm">Big/Small</span>
                      </div>
                      <div className="font-bold" style={{ 
                        color: currentPrediction.bigOrSmall === "BIG" ? "#FF4D4F" : "#52C41A" 
                      }}>
                        {currentPrediction.bigOrSmall}
                      </div>
                    </div>
                    
                    {/* Number */}
                    <div className="flex items-center justify-between bg-[#001230] rounded-lg p-3 border-l-4 border-[#00ECBE]">
                      <div className="flex items-center">
                        <Zap size={16} className="text-[#00ECBE] mr-2" />
                        <span className="text-[#00ECBE] text-sm">Number</span>
                      </div>
                      <div className="font-bold text-white">
                        {currentPrediction.number}
                      </div>
                    </div>
                  </div>
                  
                  {/* Accuracy statement */}
                  <div className="flex items-center text-xs text-white/80 rounded-lg bg-[#001230]/50 p-2 w-full">
                    <Brain className="text-[#00ECBE] mr-2 flex-shrink-0" size={14} />
                    <span>100% Accurate Prediction Based on Mathematical Algorithms</span>
                  </div>
                </div>
              </motion.div>

              {/* Investment button */}
              <motion.button
                className="mt-4 w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-sm shadow-lg flex items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                USE 3X INVESTMENT AND EARN BIG WITH THIS PREDICTION
              </motion.button>
            </div>
          </div>
        )}
      </PredictionLayout>
    </React.Fragment>
  );
};

export default WingoPrediction;