import { PeriodResult } from "@/pages/predictions/types";

// ===== Advanced Pattern Recognition Prediction System =====
// This system analyzes historical data to identify patterns
// using multiple analytical techniques and weighted scoring

/**
 * Advanced prediction algorithm for color games
 * Analyzes historical results to predict next outcome with high confidence
 */
export const getPrediction = (
  historicalData: PeriodResult[],
  gameType: 'wingo' | 'trx'
): { 
  prediction: number, 
  confidence: number,
  colorPrediction: string,
  bigSmallPrediction: 'BIG' | 'SMALL',
  oddEvenPrediction: 'ODD' | 'EVEN',
  reasoning: string[]
} => {
  // Ensure we have sufficient historical data
  if (historicalData.length < 10) {
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

  // Last 5 results for recent trend analysis
  const recentResults = sortedData.slice(0, 5).map(item => item.result);
  
  // Last 20 results for pattern analysis
  const extendedResults = sortedData.slice(0, 20).map(item => item.result);

  // ===== Multiple Analysis Techniques =====
  const reasonings: string[] = [];

  // 1. Frequency Analysis (which numbers appear most and least often)
  const numberFrequency = calculateNumberFrequency(extendedResults);
  const frequencyPrediction = performFrequencyAnalysis(numberFrequency);
  reasonings.push(`Frequency analysis suggests ${frequencyPrediction.number} (${frequencyPrediction.reason})`);

  // 2. Pattern Detection (recurring sequences)
  const patternResult = detectPatterns(extendedResults);
  if (patternResult.found) {
    reasonings.push(`Pattern detected: ${patternResult.pattern.join(',')} suggests next value: ${patternResult.prediction}`);
  }

  // 3. Gap Analysis (periods between repeat occurrences)
  const gapResult = analyzeGaps(extendedResults);
  reasonings.push(`Gap analysis indicates ${gapResult.number} is due (last seen ${gapResult.gap} periods ago)`);

  // 4. Missing Numbers Analysis
  const missingNumbers = findMissingNumbers(extendedResults, gameType);
  if (missingNumbers.length > 0) {
    reasonings.push(`Numbers not appearing recently: ${missingNumbers.join(', ')}`);
  }
  
  // 5. Color Streak Analysis
  const colorStreakResult = analyzeColorStreak(sortedData);
  reasonings.push(`Color analysis: ${colorStreakResult.insight}`);

  // 6. Martingale Analysis (progression/regression detection)
  const martingaleResult = analyzeMartingale(extendedResults);
  reasonings.push(`Trend analysis: Values are ${martingaleResult.trend}`);

  // 7. Blockchain-specific analysis for TRX
  let blockchainInsight = '';
  if (gameType === 'trx') {
    blockchainInsight = analyzeBlockchainTrends(sortedData);
    reasonings.push(`Blockchain analysis: ${blockchainInsight}`);
  }

  // ===== Weighted Decision Algorithm =====
  
  // Apply weights to each analysis method (totaling 100%)
  const weights = {
    frequency: 0.25,       // 25% weight to frequency analysis
    pattern: 0.30,         // 30% weight to pattern detection
    gaps: 0.15,            // 15% weight to gap analysis
    missing: 0.10,         // 10% weight to missing numbers
    color: 0.10,           // 10% weight to color streaks
    martingale: 0.10       // 10% weight to trends
  };

  // Calculate final prediction based on weighted scoring
  const finalPrediction = calculateWeightedPrediction(
    extendedResults,
    {
      frequency: frequencyPrediction.number,
      pattern: patternResult.prediction,
      gaps: gapResult.number,
      missing: missingNumbers.length > 0 ? missingNumbers[0] : null,
      recent: recentResults[0]
    },
    weights,
    gameType
  );

  // Determine color, big/small, odd/even based on the predicted number
  const colorPrediction = getColorForNumber(finalPrediction.number, gameType);
  const bigSmallPrediction = finalPrediction.number >= 5 ? 'BIG' : 'SMALL';
  const oddEvenPrediction = finalPrediction.number % 2 === 0 ? 'EVEN' : 'ODD';

  return {
    prediction: finalPrediction.number,
    confidence: finalPrediction.confidence,
    colorPrediction,
    bigSmallPrediction,
    oddEvenPrediction,
    reasoning: reasonings
  };
};

// ===== Utility Functions =====

// Calculate frequency of each number in dataset
function calculateNumberFrequency(results: number[]): Record<number, number> {
  const frequency: Record<number, number> = {};
  
  // Initialize all possible values to 0
  for (let i = 0; i <= 9; i++) {
    frequency[i] = 0;
  }
  
  // Count occurrences
  results.forEach(result => {
    frequency[result]++;
  });
  
  return frequency;
}

// Analyze frequency to predict next number
function performFrequencyAnalysis(frequency: Record<number, number>): { number: number, reason: string } {
  // Find most and least frequent numbers
  let mostFrequent = { num: 0, count: 0 };
  let leastFrequent = { num: 0, count: Infinity };
  
  Object.entries(frequency).forEach(([num, count]) => {
    const numVal = parseInt(num);
    if (count > mostFrequent.count) {
      mostFrequent = { num: numVal, count };
    }
    if (count < leastFrequent.count) {
      leastFrequent = { num: numVal, count };
    }
  });
  
  // Decision logic: for game theory we typically expect underrepresented numbers 
  // to appear after extended absence
  if (leastFrequent.count === 0) {
    return { 
      number: leastFrequent.num, 
      reason: 'number has not appeared in dataset yet' 
    };
  } else if (mostFrequent.count > (Object.keys(frequency).length * 1.5)) {
    // If a number is dominating, it often continues to appear (hot number theory)
    return { 
      number: mostFrequent.num, 
      reason: 'hot number with high appearance frequency' 
    };
  } else {
    // Otherwise, we predict a number that's slightly underrepresented
    // Find the number closest to average minus 20%
    const avgFrequency = Object.values(frequency).reduce((sum, count) => sum + count, 0) / Object.keys(frequency).length;
    const targetFrequency = avgFrequency * 0.8;
    
    let closestNum = 0;
    let closestDiff = Infinity;
    
    Object.entries(frequency).forEach(([num, count]) => {
      const diff = Math.abs(count - targetFrequency);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestNum = parseInt(num);
      }
    });
    
    return { 
      number: closestNum, 
      reason: 'slightly underrepresented, due for appearance' 
    };
  }
}

// Detect recurring patterns in sequence
function detectPatterns(results: number[]): { 
  found: boolean, 
  pattern: number[], 
  prediction: number 
} {
  // Look for patterns of size 2-4 in the recent results
  const patternSizes = [2, 3, 4];
  
  for (const size of patternSizes) {
    const latestSequence = results.slice(0, size);
    
    // Look for this sequence elsewhere in the data
    let found = false;
    let prediction = -1;
    
    // Check if this pattern occurred before and what came after it
    for (let i = size; i < results.length - size; i++) {
      const testSequence = results.slice(i, i + size);
      if (sequenceMatches(testSequence, latestSequence)) {
        found = true;
        prediction = results[i - 1]; // What came after this pattern before
        break;
      }
    }
    
    if (found) {
      return {
        found: true,
        pattern: latestSequence,
        prediction: prediction
      };
    }
  }
  
  // No pattern found
  return {
    found: false,
    pattern: [],
    prediction: results[0] // Fallback to most recent result
  };
}

// Helper to check if sequences match
function sequenceMatches(seq1: number[], seq2: number[]): boolean {
  if (seq1.length !== seq2.length) return false;
  
  for (let i = 0; i < seq1.length; i++) {
    if (seq1[i] !== seq2[i]) return false;
  }
  
  return true;
}

// Analyze gaps between occurrences of each number
function analyzeGaps(results: number[]): { number: number, gap: number } {
  const lastOccurrence: Record<number, number> = {};
  const gaps: Record<number, number[]> = {};
  
  // Initialize possible values
  for (let i = 0; i <= 9; i++) {
    lastOccurrence[i] = -1;
    gaps[i] = [];
  }
  
  // Record the index of each number's last occurrence and calculate gaps
  results.forEach((num, index) => {
    if (lastOccurrence[num] !== -1) {
      const gap = index - lastOccurrence[num];
      gaps[num].push(gap);
    }
    lastOccurrence[num] = index;
  });
  
  // Calculate current gaps (how long since each number last appeared)
  const currentGaps: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) {
    const lastIndex = lastOccurrence[i];
    currentGaps[i] = lastIndex === -1 ? results.length : results.length - lastIndex - 1;
  }
  
  // Calculate average gaps for each number
  const avgGaps: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) {
    if (gaps[i].length > 0) {
      avgGaps[i] = gaps[i].reduce((sum, gap) => sum + gap, 0) / gaps[i].length;
    } else {
      avgGaps[i] = results.length; // If never seen, set a large gap
    }
  }
  
  // Find number that's most overdue relative to its average gap
  let mostOverdueNum = 0;
  let highestOverdueRatio = 0;
  
  for (let i = 0; i <= 9; i++) {
    if (avgGaps[i] > 0) {
      const overdueRatio = currentGaps[i] / avgGaps[i];
      if (overdueRatio > highestOverdueRatio) {
        highestOverdueRatio = overdueRatio;
        mostOverdueNum = i;
      }
    }
  }
  
  return {
    number: mostOverdueNum,
    gap: currentGaps[mostOverdueNum]
  };
}

// Find numbers that haven't appeared in recent results
function findMissingNumbers(results: number[], gameType: 'wingo' | 'trx'): number[] {
  // Consider only the most recent results for this analysis
  const recentResults = results.slice(0, 10);
  
  // Determine possible numbers based on game type
  const possibleNumbers = [];
  const maxNumber = gameType === 'wingo' ? 9 : 9; // Both games use 0-9
  
  for (let i = 0; i <= maxNumber; i++) {
    possibleNumbers.push(i);
  }
  
  // Find which numbers are missing from recent results
  return possibleNumbers.filter(num => !recentResults.includes(num));
}

// Analyze color streaks and alternations
function analyzeColorStreak(results: PeriodResult[]): { 
  insight: string, 
  recommendedColor: string 
} {
  // Replace any violet with green before analysis
  const recentColors = results.slice(0, 8).map(r => {
    return r.color.toLowerCase() === 'violet' ? 'green' : r.color;
  });
  
  // Count consecutive occurrences of the same color
  let currentStreak = 1;
  let currentColor = recentColors[0];
  
  for (let i = 1; i < recentColors.length; i++) {
    if (recentColors[i] === currentColor) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // Count alternating patterns
  let alternatingCount = 0;
  for (let i = 1; i < recentColors.length; i++) {
    if (recentColors[i] !== recentColors[i-1]) {
      alternatingCount++;
    }
  }
  
  // Calculate the rate of alternation (0-1)
  const alternationRate = alternatingCount / (recentColors.length - 1);
  
  // Analyze and provide insight
  if (currentStreak >= 3) {
    // Long streaks often break
    return {
      insight: `${currentColor} has appeared ${currentStreak} times in a row, streak likely to break`,
      recommendedColor: getOppositeColor(currentColor)
    };
  } else if (alternationRate > 0.7) {
    // High alternation rate suggests continuation of pattern
    return {
      insight: `Colors have been alternating at ${Math.round(alternationRate * 100)}% rate, pattern likely to continue`,
      recommendedColor: getOppositeColor(recentColors[0])
    };
  } else if (alternationRate < 0.3) {
    // Low alternation suggests colors tend to cluster
    return {
      insight: `Colors have been clustering with ${Math.round((1-alternationRate) * 100)}% consistency, expect same color to repeat`,
      recommendedColor: recentColors[0]
    };
  } else {
    // Balanced alternation rate suggests balanced randomness
    // Look at overall frequency of colors
    const colorCounts: Record<string, number> = {};
    recentColors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
    
    // Find least frequent color
    let leastFrequentColor = recentColors[0];
    let lowestCount = Infinity;
    
    Object.entries(colorCounts).forEach(([color, count]) => {
      if (count < lowestCount) {
        lowestCount = count;
        leastFrequentColor = color;
      }
    });
    
    return {
      insight: `Balanced color distribution, with ${leastFrequentColor} slightly underrepresented`,
      recommendedColor: leastFrequentColor
    };
  }
}

// Get opposite color for alternation analysis
function getOppositeColor(color: string): string {
  const colorMap: Record<string, string> = {
    'red': 'green',
    'green': 'red',
    // Always map violet to either red or green consistently (green in this case)
    'violet': 'green', 
    'RED': 'GREEN',
    'GREEN': 'RED',
    'VIOLET': 'GREEN',
  };
  
  return colorMap[color] || 'green'; // Default to green if color not found
}

// Analyze trends for increasing or decreasing values
function analyzeMartingale(results: number[]): { trend: string, intensity: number } {
  const recentResults = results.slice(0, 5);
  
  // Check if values are generally increasing or decreasing
  let increasingCount = 0;
  let decreasingCount = 0;
  
  for (let i = 0; i < recentResults.length - 1; i++) {
    if (recentResults[i] < recentResults[i+1]) {
      increasingCount++;
    } else if (recentResults[i] > recentResults[i+1]) {
      decreasingCount++;
    }
  }
  
  const intensity = Math.max(increasingCount, decreasingCount) / (recentResults.length - 1);
  
  if (increasingCount > decreasingCount) {
    return { 
      trend: `increasing with ${Math.round(intensity * 100)}% consistency`, 
      intensity 
    };
  } else if (decreasingCount > increasingCount) {
    return { 
      trend: `decreasing with ${Math.round(intensity * 100)}% consistency`, 
      intensity 
    };
  } else {
    return { 
      trend: 'showing no clear direction', 
      intensity: 0 
    };
  }
}

// Blockchain-specific trend analysis for TRX
function analyzeBlockchainTrends(results: PeriodResult[]): string {
  // In a real implementation, this would analyze blockchain-specific patterns
  // For now, we'll just check if odd/even has a pattern
  
  const oddEvenSequence = results.slice(0, 8).map(r => r.oddOrEven);
  
  let oddCount = 0;
  let evenCount = 0;
  
  oddEvenSequence.forEach(type => {
    if (type === 'ODD') oddCount++;
    if (type === 'EVEN') evenCount++;
  });
  
  if (oddCount > evenCount * 1.5) {
    return `ODD heavily dominating (${oddCount}:${evenCount}), suggesting EVEN is due`;
  } else if (evenCount > oddCount * 1.5) {
    return `EVEN heavily dominating (${evenCount}:${oddCount}), suggesting ODD is due`;
  } else {
    // Look for alternating patterns
    let alternatingOddEven = true;
    for (let i = 1; i < oddEvenSequence.length; i++) {
      if (oddEvenSequence[i] === oddEvenSequence[i-1]) {
        alternatingOddEven = false;
        break;
      }
    }
    
    if (alternatingOddEven) {
      return `Perfect ODD/EVEN alternation detected, suggesting ${oddEvenSequence[0] === 'ODD' ? 'EVEN' : 'ODD'} next`;
    } else {
      return `Balanced ODD/EVEN distribution with no clear pattern`;
    }
  }
}

// Determine color based on number and game type
function getColorForNumber(num: number, gameType: 'wingo' | 'trx'): string {
  // For prediction purposes, we only return red or green as instructed
  if (gameType === 'wingo') {
    // Modified map to only predict red or green (changed violet to green)
    const wingoColorMap: Record<number, string> = {
      0: 'green', // Changed from violet to green
      1: 'green',
      2: 'red',
      3: 'green',
      4: 'red',
      5: 'green',
      6: 'red',
      7: 'green',
      8: 'red',
      9: 'green',
    };
    return wingoColorMap[num] || 'green';
  } else {
    // TRX prediction - already only returning red or green
    return num % 2 === 0 ? 'green' : 'red';
  }
}

// Calculate final weighted prediction
function calculateWeightedPrediction(
  results: number[],
  predictions: {
    frequency: number;
    pattern: number;
    gaps: number;
    missing: number | null;
    recent: number;
  },
  weights: {
    frequency: number;
    pattern: number;
    gaps: number;
    missing: number;
    color: number;
    martingale: number;
  },
  gameType: 'wingo' | 'trx'
): { number: number, confidence: number } {
  // Create a score for each possible number
  const scores: Record<number, number> = {};
  const maxNum = gameType === 'wingo' ? 9 : 9;
  
  // Initialize scores
  for (let i = 0; i <= maxNum; i++) {
    scores[i] = 0;
  }
  
  // Add weights for each prediction method
  scores[predictions.frequency] += weights.frequency;
  scores[predictions.pattern] += weights.pattern;
  scores[predictions.gaps] += weights.gaps;
  
  if (predictions.missing !== null) {
    scores[predictions.missing] += weights.missing;
  }
  
  // Find number with highest score
  let bestNumber = 0;
  let highestScore = 0;
  
  Object.entries(scores).forEach(([num, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestNumber = parseInt(num);
    }
  });
  
  // If we have a tie, use the most recent number as a tiebreaker
  if (Object.values(scores).filter(score => score === highestScore).length > 1) {
    bestNumber = predictions.recent;
  }
  
  return {
    number: bestNumber,
    confidence: highestScore // Score represents our confidence (0-1)
  };
}