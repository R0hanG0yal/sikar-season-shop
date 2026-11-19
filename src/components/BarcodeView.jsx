import React from 'react';

// Clean SVG Barcode Generator (Code 128 / EAN simulation)
export default function BarcodeView({ code = '890456100101', width = 180, height = 50, showCode = true, className = '' }) {
  // Generate deterministic bar widths based on code characters
  const bars = [];
  let x = 10;
  
  // Guard bars at start
  bars.push({ x, width: 2 }); x += 4;
  bars.push({ x, width: 2 }); x += 4;

  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const pattern = [(charCode % 3) + 1, ((charCode >> 1) % 3) + 1, ((charCode >> 2) % 3) + 1];
    for (let p = 0; p < pattern.length; p++) {
      const w = pattern[p];
      bars.push({ x, width: w });
      x += w + 2;
    }
  }

  // Guard bars at end
  bars.push({ x, width: 2 }); x += 4;
  bars.push({ x, width: 2 }); x += 4;

  const totalWidth = x + 10;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        width={width}
        height={height}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={totalWidth} height={height} fill="#FFFFFF" />
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={2}
            width={bar.width}
            height={height - (showCode ? 16 : 4)}
            fill="#111827"
          />
        ))}
      </svg>
      {showCode && (
        <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-gray-800 -mt-1">
          {code}
        </span>
      )}
    </div>
  );
}
