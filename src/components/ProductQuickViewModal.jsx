import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import BarcodeView from './BarcodeView';

export default function ProductQuickViewModal({ product, isOpen, onClose, onAddToCart, isWishlisted, onToggleWishlist }) {
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('332001');
  const [pinChecked, setPinChecked] = useState(true);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row shadow-2xl border border-amber-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Stage (Strictly #FFFFFF Pure White Background so it seamlessly blends) */}
        <div className="md:w-1/2 bg-[#FFFFFF] p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#E8DFC8]">
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-[#FF7722] text-white text-xs font-bold rounded-full shadow-sm tracking-wide">
              {product.badge}
            </span>
          )}

          <div className="w-full max-w-[340px] aspect-square flex items-center justify-center group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/products/cosmetics_01.png';
              }}
            />
          </div>

          <div className="mt-4 pt-3 w-full border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="font-mono">SKU: {product.sku}</span>
            <span className="font-mono">HSN: {product.hsn}</span>
            <span className="font-semibold text-emerald-700">GST: {product.gstRate}%</span>
          </div>
        </div>

        {/* Product Information */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-[#FAF7F2]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                <img
                  src={`/favicons/fav_${product.image.split('/').pop().replace('.png', '')}.png`}
                  alt=""
                  className="w-4 h-4 object-contain rounded-xs"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="text-xs font-bold tracking-wider uppercase text-[#064E3B]">
                  {product.categoryLabel}
                </span>
              </div>
              <div className="flex items-center text-amber-500 text-xs font-bold ml-auto">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                {product.rating} <span className="text-gray-400 font-normal ml-1">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug font-serif">
              {product.name}
            </h2>

            {/* Pricing Section */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-extrabold text-[#064E3B]">
                ₹{product.price}
              </span>
              <span className="text-base text-gray-400 line-through">
                ₹{product.mrp}
              </span>
              <span className="px-2 py-0.5 bg-orange-100 text-[#D95305] text-xs font-black rounded">
                SAVE {product.discount}%
              </span>
            </div>

            <p className="mt-3 text-xs md:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Key Specifications Grid */}
            {product.details && (
              <div className="mt-4 p-3.5 bg-white rounded-xl border border-[#E8DFC8] space-y-1.5 text-xs">
                <div className="font-bold text-gray-900 text-[11px] uppercase tracking-wider mb-1 text-[#064E3B]">
                  Product Specifications
                </div>
                {Object.entries(product.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-gray-700">
                    <span className="capitalize text-gray-500">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Stock & Delivery Pincode Checker */}
            <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-gray-700">Availability:</span>
                {product.stock > 10 ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units in Sikar store)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Only {product.stock} left in stock!
                  </span>
                )}
              </div>

              {/* Delivery checker */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={pincode}
                    maxLength={6}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Pincode"
                    className="w-full text-xs px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPinChecked(true)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-lg transition-colors"
                >
                  Check
                </button>
              </div>
              {pinChecked && (
                <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  {pincode === '332001' ? 'Same-day Sikar store delivery available!' : 'Delivered in 2-4 business days.'}
                </p>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-[#E8DFC8] flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-3 py-2 text-xs font-bold text-gray-900 min-w-[28px] text-center">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className={`p-3 rounded-xl border transition-colors shadow-sm ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3 px-5 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF7722]" />
              Add to Bag • ₹{(product.price * qty).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
