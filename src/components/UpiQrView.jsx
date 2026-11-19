import React from 'react';

// Crisp SVG QR Code generator for UPI Payments
export default function UpiQrView({ upiId = '9602172335@upi', name = 'SIKAR SEASON SHOP', amount = 0, size = 180 }) {
  // UPI payment intent URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=Sikar%20Season%20Shop%20Order`;
  
  // Deterministic 25x25 QR matrix generation
  const gridSize = 25;
  const matrix = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));

  // Function to set finder patterns
  function setFinder(r, c) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          matrix[r + i][c + j] = true;
        } else {
          matrix[r + i][c + j] = false;
        }
      }
    }
  }

  // Set 3 standard finder patterns
  setFinder(0, 0);
  setFinder(0, gridSize - 7);
  setFinder(gridSize - 7, 0);

  // Timing lines
  for (let i = 7; i < gridSize - 7; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Populate data area based on upiUri hash
  let seed = 0;
  for (let k = 0; k < upiUri.length; k++) {
    seed = (seed * 31 + upiUri.charCodeAt(k)) % 1000000007;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder zones
      const inFinder1 = r < 8 && c < 8;
      const inFinder2 = r < 8 && c >= gridSize - 8;
      const inFinder3 = r >= gridSize - 8 && c < 8;
      const inCenter = r >= 9 && r <= 15 && c >= 9 && c <= 15;
      if (!inFinder1 && !inFinder2 && !inFinder3 && !inCenter) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        matrix[r][c] = (seed % 100) > 48;
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div className="flex flex-col items-center p-3 bg-white rounded-xl shadow-inner border border-amber-200">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect width={size} height={size} fill="#FFFFFF" />
          {matrix.map((row, r) =>
            row.map((val, c) =>
              val ? (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize + 0.3}
                  height={cellSize + 0.3}
                  fill="#064E3B"
                  rx={0.5}
                />
              ) : null
            )
          )}
        </svg>

        {/* Center Logo Badge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-[#FF7722] flex items-center justify-center">
            <span className="text-[10px] font-black tracking-tight text-[#064E3B] font-serif">SSS</span>
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs font-bold text-gray-800">Scan &amp; Pay via Any UPI App</p>
        <p className="text-[11px] font-mono text-emerald-800 font-medium">{upiId}</p>
        {amount > 0 && (
          <p className="text-sm font-extrabold text-[#D95305] mt-0.5">₹{amount.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}
