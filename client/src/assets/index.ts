// Logo SVG string for consistent branding
export const logoSVG = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="8" fill="#000C33"/>
  <path d="M8 20.5L16 12.5L24 20.5L32 12.5" stroke="#00ECBE" stroke-width="3" stroke-linecap="round"/>
  <path d="M8 27.5L16 19.5L24 27.5L32 19.5" stroke="#00ECBE" stroke-width="3" stroke-linecap="round"/>
</svg>
`;

// Prediction mockup SVG
export const predictionSVG = `
<svg width="700" height="400" viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="400" fill="#05012B"/>
  <rect x="50" y="50" width="600" height="300" rx="8" fill="#001C54"/>
  <rect x="80" y="80" width="540" height="80" rx="4" fill="#000C33"/>
  <text x="100" y="120" font-family="Arial" font-size="20" fill="#FFFFFF">Current Period: 20250410100011136</text>
  <text x="100" y="150" font-weight="bold" font-family="Arial" font-size="24" fill="#00ECBE">PREDICTION: 7 (GREEN)</text>
  <rect x="500" y="90" width="100" height="60" rx="4" fill="#00ECBE"/>
  <text x="525" y="130" font-family="Arial" font-size="20" font-weight="bold" fill="#05012B">99.8%</text>
  <rect x="80" y="180" width="540" height="140" rx="4" fill="#000C33"/>
  <text x="100" y="210" font-family="Arial" font-size="16" fill="#FFFFFF">Time Remaining: 00:42</text>
  <text x="100" y="240" font-family="Arial" font-size="16" fill="#FFFFFF">Analysis Based On:</text>
  <text x="120" y="270" font-family="Arial" font-size="14" fill="#FFFFFF">• Pattern Recognition</text>
  <text x="120" y="300" font-family="Arial" font-size="14" fill="#FFFFFF">• Fibonacci Sequence Analysis</text>
  <text x="350" y="270" font-family="Arial" font-size="14" fill="#FFFFFF">• Color Streak Detection</text>
  <text x="350" y="300" font-family="Arial" font-size="14" fill="#FFFFFF">• Gap Analysis</text>
</svg>
`;

// Prediction history mockup SVG
export const predictionHistorySVG = `
<svg width="700" height="400" viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="400" fill="#05012B"/>
  <rect x="50" y="20" width="600" height="360" rx="8" fill="#001C54"/>
  <text x="100" y="50" font-family="Arial" font-size="20" font-weight="bold" fill="#00ECBE">PREDICTION HISTORY</text>
  
  <rect x="80" y="70" width="540" height="50" rx="4" fill="#000C33"/>
  <text x="100" y="100" font-family="Arial" font-size="16" fill="#FFFFFF">Period: 20250410100011136</text>
  <text x="350" y="100" font-family="Arial" font-size="16" fill="#00ECBE">Prediction: 7 (GREEN)</text>
  <text x="550" y="100" font-family="Arial" font-size="16" fill="#00ECBE">✓</text>
  
  <rect x="80" y="130" width="540" height="50" rx="4" fill="#000C33"/>
  <text x="100" y="160" font-family="Arial" font-size="16" fill="#FFFFFF">Period: 20250410100011135</text>
  <text x="350" y="160" font-family="Arial" font-size="16" fill="#00ECBE">Prediction: 4 (RED)</text>
  <text x="550" y="160" font-family="Arial" font-size="16" fill="#00ECBE">✓</text>
  
  <rect x="80" y="190" width="540" height="50" rx="4" fill="#000C33"/>
  <text x="100" y="220" font-family="Arial" font-size="16" fill="#FFFFFF">Period: 20250410100011134</text>
  <text x="350" y="220" font-family="Arial" font-size="16" fill="#00ECBE">Prediction: 9 (GREEN)</text>
  <text x="550" y="220" font-family="Arial" font-size="16" fill="#00ECBE">✓</text>
  
  <rect x="80" y="250" width="540" height="50" rx="4" fill="#000C33"/>
  <text x="100" y="280" font-family="Arial" font-size="16" fill="#FFFFFF">Period: 20250410100011133</text>
  <text x="350" y="280" font-family="Arial" font-size="16" fill="#00ECBE">Prediction: 2 (RED)</text>
  <text x="550" y="280" font-family="Arial" font-size="16" fill="#00ECBE">✓</text>
  
  <rect x="80" y="310" width="540" height="50" rx="4" fill="#000C33"/>
  <text x="100" y="340" font-family="Arial" font-size="16" fill="#FFFFFF">Period: 20250410100011132</text>
  <text x="350" y="340" font-family="Arial" font-size="16" fill="#00ECBE">Prediction: 6 (RED)</text>
  <text x="550" y="340" font-family="Arial" font-size="16" fill="#00ECBE">✓</text>
</svg>
`;

// Results history mockup SVG
export const resultsHistorySVG = `
<svg width="700" height="400" viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="400" fill="#05012B"/>
  <rect x="50" y="20" width="600" height="360" rx="8" fill="#001C54"/>
  <text x="100" y="50" font-family="Arial" font-size="20" font-weight="bold" fill="#00ECBE">RESULTS HISTORY</text>
  
  <rect x="80" y="70" width="540" height="270" rx="4" fill="#000C33"/>
  
  <!-- Color balls -->
  <circle cx="130" cy="100" r="20" fill="#00ECBE" />
  <text x="130" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#05012B">7</text>
  
  <circle cx="180" cy="100" r="20" fill="#FF4D4D" />
  <text x="180" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">4</text>
  
  <circle cx="230" cy="100" r="20" fill="#00ECBE" />
  <text x="230" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#05012B">9</text>
  
  <circle cx="280" cy="100" r="20" fill="#FF4D4D" />
  <text x="280" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">2</text>
  
  <circle cx="330" cy="100" r="20" fill="#FF4D4D" />
  <text x="330" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">6</text>
  
  <circle cx="380" cy="100" r="20" fill="#FF4D4D" />
  <text x="380" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">4</text>
  
  <circle cx="430" cy="100" r="20" fill="#BA00FF" />
  <text x="430" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">0</text>
  
  <circle cx="480" cy="100" r="20" fill="#00ECBE" />
  <text x="480" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#05012B">1</text>
  
  <circle cx="530" cy="100" r="20" fill="#BA00FF" />
  <text x="530" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">0</text>
  
  <circle cx="580" cy="100" r="20" fill="#FF4D4D" />
  <text x="580" y="105" font-family="Arial" font-size="16" text-anchor="middle" fill="#FFFFFF">2</text>
  
  <!-- Period list -->
  <text x="130" y="150" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011136</text>
  <text x="430" y="150" font-family="Arial" font-size="14" fill="#00ECBE">Result: 7 (GREEN)</text>
  
  <text x="130" y="180" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011135</text>
  <text x="430" y="180" font-family="Arial" font-size="14" fill="#FF4D4D">Result: 4 (RED)</text>
  
  <text x="130" y="210" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011134</text>
  <text x="430" y="210" font-family="Arial" font-size="14" fill="#00ECBE">Result: 9 (GREEN)</text>
  
  <text x="130" y="240" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011133</text>
  <text x="430" y="240" font-family="Arial" font-size="14" fill="#FF4D4D">Result: 2 (RED)</text>
  
  <text x="130" y="270" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011132</text>
  <text x="430" y="270" font-family="Arial" font-size="14" fill="#FF4D4D">Result: 6 (RED)</text>
  
  <text x="130" y="300" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011131</text>
  <text x="430" y="300" font-family="Arial" font-size="14" fill="#FF4D4D">Result: 4 (RED)</text>
  
  <text x="130" y="330" font-family="Arial" font-size="14" fill="#FFFFFF">Period: 20250410100011130</text>
  <text x="430" y="330" font-family="Arial" font-size="14" fill="#BA00FF">Result: 0 (VIOLET)</text>
</svg>
`;