// Prediction page prop types
export interface PredictionPageProps {
  timeOption: string;
}

// Period result data type
export interface PeriodResult {
  id: string;
  periodNumber: string;
  result: number;
  color: 'red' | 'green' | 'violet' | string;
  timestamp: string;
  bigOrSmall: 'BIG' | 'SMALL';
  oddOrEven: 'ODD' | 'EVEN';
}

// Prediction data type
export interface PredictionData {
  id: string;
  periodNumber: string;
  prediction: number;
  color: 'red' | 'green' | 'violet' | string;
  bigOrSmall: 'BIG' | 'SMALL';
  oddOrEven: 'ODD' | 'EVEN';
  timestamp: string;
  timeRemaining: number; // in seconds
  status?: 'WIN' | 'LOSS' | null; // To track if prediction was correct
  actualResult?: number | null; // The actual result if available
}

// Color mappings for Win Go (modified to only show red or green)
export const wingoColorMap: Record<number, string> = {
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

// TRX has unique colors (modified to only show red or green)
export const trxColorMap: Record<string, string> = {
  'EVEN': 'green',
  'ODD': 'red',
  'SMALL': 'green',
  'BIG': 'red',
  'VIOLET': 'green', // Changed from violet to green
};

// Helper to determine big/small
export const getBigOrSmall = (num: number): 'BIG' | 'SMALL' => {
  return num >= 5 ? 'BIG' : 'SMALL';
};

// Helper to determine odd/even
export const getOddOrEven = (num: number): 'ODD' | 'EVEN' => {
  return num % 2 === 0 ? 'EVEN' : 'ODD';
};

// TRX result to color helper (modified to only return red or green)
export const getTrxResultColor = (result: string): string => {
  const lastChar = result.slice(-1);
  // Changed to avoid returning violet, always return green instead
  return lastChar === '0' || lastChar === '5' ? 'green' : (parseInt(lastChar) % 2 === 0 ? 'red' : 'green');
};