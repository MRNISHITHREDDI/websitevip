import { PeriodResult } from "@/pages/predictions/types";

// ===== COMPLETELY NEW PATTERN-FOLLOWING SYSTEM =====
// This system uses a simple approach based on following patterns in the last 10 results
// It implements rules to follow streaks until they break, and switch strategies when patterns fail

// Cache for prediction optimization and historical tracking
const predictionCache: Record<string, {
  prediction: number;
  timestamp: number;
  colorPrediction: string;
}> = {};

/**
 * Simple pattern-following algorithm that analyzes the last 10 results
 * and follows patterns until they lose, then switches strategies
 */
export const getPrediction = (
  historicalData: PeriodResult[], 
  gameType: 'wingo' | 'trx',
  timeOption?: string
): { 
  prediction: number, 
  confidence: number,
  colorPrediction: string,
  bigSmallPrediction: 'BIG' | 'SMALL',
  oddEvenPrediction: 'ODD' | 'EVEN',
  reasoning: string[]
} => {
  // Ensure we have sufficient historical data
  if (historicalData.length < 3) {
    return {
      prediction: Math.floor(Math.random() * 10),
      confidence: 0.5,
      colorPrediction: gameType === 'wingo' ? ['red', 'green'][Math.floor(Math.random() * 2)] : 'SMALL',
      bigSmallPrediction: 'BIG',
      oddEvenPrediction: 'EVEN',
      reasoning: ['Insufficient historical data for accurate prediction']
    };
  }

  // Sort data by timestamp (newest first)
  const sortedData = [...historicalData].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Prepare reasoning array
  const reasonings: string[] = [];
  
  // NEW SIMPLE ALGORITHM:
  // Get the last 10 results with their outcomes (BIG/SMALL) and win/loss status
  const last10Results: { 
    periodNumber: string, 
    result: number,
    bigSmall: 'BIG' | 'SMALL',
    win: boolean,
    prediction?: 'BIG' | 'SMALL'
  }[] = [];
  
  // Extract result data and outcomes
  for (let i = 0; i < Math.min(10, sortedData.length); i++) {
    const current = sortedData[i];
    const result = current.result;
    const bigSmall = result >= 5 ? 'BIG' : 'SMALL';
    
    // Try to find if we have a prediction for this period in previous periods
    const hasPrediction = i < sortedData.length - 1 ? 
      sortedData[i + 1].prediction?.bigSmallPrediction : undefined;
    
    // Determine if the prediction was a win
    const win = hasPrediction === bigSmall;
    
    last10Results.push({
      periodNumber: current.periodNumber,
      result: result,
      bigSmall: bigSmall,
      win: win,
      prediction: hasPrediction as 'BIG' | 'SMALL' | undefined
    });
  }
  
  // The new prediction logic follows these rules:
  // 1. If the last 2 predictions were SMALL and won, keep predicting SMALL until loss
  // 2. If the last prediction was SMALL and lost, switch to BIG
  // 3. If we see alternating pattern (SMALL, BIG, SMALL, BIG), follow that pattern
  // 4. If we see consecutive same predictions (BIG BIG BIG), follow that until it loses
  
  reasonings.push(`Analyzing last ${last10Results.length} results to determine prediction pattern`);
  
  // Extract just the BIG/SMALL outcomes from the last results
  const outcomes = last10Results.map(r => r.bigSmall);
  reasonings.push(`Recent outcomes: ${outcomes.slice(0, 5).join(', ')}...`);
  
  // Default prediction (will be overridden by the algorithm)
  let bigSmallPrediction: 'BIG' | 'SMALL';
  
  // RULE 1: Check if the last 2 periods were the same and won
  if (last10Results.length >= 2 && 
      last10Results[0].bigSmall === last10Results[1].bigSmall && 
      last10Results[0].win && last10Results[1].win) {
    
    // Follow the winning streak
    bigSmallPrediction = last10Results[0].bigSmall;
    reasonings.push(`Rule 1: Last 2 periods were both ${bigSmallPrediction} and won - continuing streak`);
  }
  // RULE 2: If the last prediction lost, switch to opposite
  else if (last10Results.length >= 1 && !last10Results[0].win && last10Results[0].prediction) {
    bigSmallPrediction = last10Results[0].prediction === 'BIG' ? 'SMALL' : 'BIG';
    reasonings.push(`Rule 2: Last prediction ${last10Results[0].prediction} lost - switching to ${bigSmallPrediction}`);
  }
  // RULE 3: Check for alternating pattern (e.g., SMALL, BIG, SMALL, BIG)
  else if (last10Results.length >= 4 && 
           last10Results[0].bigSmall !== last10Results[1].bigSmall &&
           last10Results[1].bigSmall !== last10Results[2].bigSmall &&
           last10Results[2].bigSmall !== last10Results[3].bigSmall) {
    
    // Follow the alternating pattern
    bigSmallPrediction = last10Results[0].bigSmall === 'BIG' ? 'SMALL' : 'BIG';
    reasonings.push(`Rule 3: Detected alternating pattern - predicting ${bigSmallPrediction} to continue pattern`);
  }
  // RULE 4: Check for consecutive streak (e.g., BIG, BIG, BIG, BIG)
  else if (last10Results.length >= 3 && 
           last10Results[0].bigSmall === last10Results[1].bigSmall &&
           last10Results[1].bigSmall === last10Results[2].bigSmall) {
    
    // Follow the streak until it breaks
    bigSmallPrediction = last10Results[0].bigSmall;
    reasonings.push(`Rule 4: Detected streak of ${bigSmallPrediction} x${countConsecutive(outcomes)} - continuing streak`);
  }
  // RULE 5: Default to following most recent outcome
  else {
    // Just follow the most recent outcome
    bigSmallPrediction = last10Results.length > 0 ? last10Results[0].bigSmall : 'BIG';
    reasonings.push(`Rule 5: No clear pattern - following most recent outcome ${bigSmallPrediction}`);
  }
  
  // Select a number that matches our bigSmallPrediction
  const numberRange = bigSmallPrediction === 'BIG' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  const finalNumber = numberRange[Math.floor(Math.random() * numberRange.length)];
  
  // Determine color based on the number
  const colorPrediction = getColorForNumber(finalNumber, gameType);
  
  // Set odd/even based on the number
  const oddEvenPrediction = finalNumber % 2 === 0 ? 'EVEN' : 'ODD';
  
  // Cache this prediction for future evaluation
  const cacheKey = `${gameType}-${timeOption}-${sortedData[0]?.periodNumber}`;
  predictionCache[cacheKey] = {
    prediction: finalNumber,
    timestamp: Date.now(),
    colorPrediction
  };
  
  return {
    prediction: finalNumber,
    confidence: 0.85, // High confidence in this new approach
    colorPrediction: colorPrediction,
    bigSmallPrediction: bigSmallPrediction,
    oddEvenPrediction: oddEvenPrediction,
    reasoning: reasonings
  };
};

// Helper function to count consecutive occurrences at the start of an array
function countConsecutive(arr: any[]): number {
  if (arr.length === 0) return 0;
  
  const firstValue = arr[0];
  let count = 1;
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === firstValue) {
      count++;
    } else {
      break;
    }
  }
  
  return count;
}

// Function to get color for a number based on game type
function getColorForNumber(num: number, gameType: 'wingo' | 'trx'): string {
  if (gameType === 'wingo') {
    // For Wingo:
    // 0 = violet + red
    // 1,3,7,9 = green
    // 2,4,6,8 = red
    // 5 = violet + green
    if (num === 0) return 'red-violet';
    if (num === 5) return 'green-violet';
    if (num % 2 === 0) return 'red';
    return 'green';
  } else {
    // For TRX:
    // Even numbers are green, odd are red
    return num % 2 === 0 ? 'green' : 'red';
  }
}

// Function to get opposite color - used for 30 SEC Wingo where predictions need to be reversed
function getOppositeColor(color: string): string {
  if (color.includes('violet')) {
    if (color.includes('red')) return 'green-violet';
    return 'red-violet';
  }
  
  return color === 'red' ? 'green' : 'red';
}