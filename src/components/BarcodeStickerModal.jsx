import React, { useState } from 'react';
import { Tag, Printer, X, Check, Copy } from 'lucide-react';
import BarcodeView from './BarcodeView';
import { storeInfo } from '../data/products';

export default function BarcodeStickerModal({ products, isOpen, onClose }) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [stickerCount, setStickerCount] = useState(12);

  if (!isOpen) return null;

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#064E3B] text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#FF7722]" />
            <div>
              <h3 className="font-bold text-base">Barcode Sticker Label Generator</h3>
              <p className="text-xs text-white/80">Print physical barcode price tags for merchandise</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-[#F4EFE6] border-b border-[#E8DFC8] flex flex-wrap gap-4 items-center justify-between no-print">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-bold text-gray-700 mb-1">Select Product:</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.sku}] {p.name} - ₹{p.price} (MRP: ₹{p.mrp})
                </option>
              ))}
            </select>
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold text-gray-700 mb-1">Stickers Count:</label>
            <input
              type="number"
              min="1"
              max="48"
              value={stickerCount}
              onChange={(e) => setStickerCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs font-bold px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#FF7722] hover:bg-[#D95305] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print {stickerCount} Stickers
            </button>
          </div>
        </div>

        {/* Sticker Preview Grid (Optimized for print sheets) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="printable-receipt grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: stickerCount }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white p-2.5 border-2 border-dashed border-gray-300 rounded-lg text-center flex flex-col items-center justify-between shadow-sm"
                style={{ width: '100%', minHeight: '140px' }}
              >
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#064E3B] font-serif">
                    {storeInfo.name}
                  </div>
                  <div className="text-[9px] font-medium text-gray-800 line-clamp-1 mt-0.5" title={product.name}>
                    {product.name}
                  </div>
                </div>

                <div className="my-1">
                  <BarcodeView code={product.barcode} width={130} height={34} showCode={true} />
                </div>

                <div className="w-full flex items-center justify-between border-t border-gray-200 pt-1 text-[10px]">
                  <span className="text-gray-400 line-through text-[9px]">MRP: ₹{product.mrp}</span>
                  <span className="font-extrabold text-[#D95305] text-[11px]">OUR: ₹{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-gray-200 text-right no-print">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
