import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalMrp = cartItems.reduce((acc, item) => acc + item.mrp * item.qty, 0);
  const totalDiscount = totalMrp - subtotal;

  let couponDiscount = 0;
  if (appliedCoupon === 'SIKAR10') {
    couponDiscount = Math.round(subtotal * 0.10);
  } else if (appliedCoupon === 'POOJA20') {
    couponDiscount = Math.round(subtotal * 0.20);
  } else if (appliedCoupon === 'WELCOME50') {
    couponDiscount = Math.min(50, subtotal);
  }

  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shipping);

  const handleApply = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (['SIKAR10', 'POOJA20', 'WELCOME50'].includes(code)) {
      onApplyCoupon(code);
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon. Try SIKAR10, POOJA20, or WELCOME50');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 bg-[#064E3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF7722]" />
            <h2 className="font-bold text-base tracking-wide font-serif">
              Shopping Cart ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Ribbon */}
        <div className="bg-[#FAF7F2] p-3 border-b border-[#E8DFC8]">
          {subtotal >= 499 ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Sparkles className="w-4 h-4 text-[#FF7722]" />
              You unlocked FREE Delivery across Sikar &amp; India!
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-700 mb-1">
                <span>Add ₹{(499 - subtotal).toFixed(0)} more for FREE Delivery</span>
                <span>{Math.round((subtotal / 499) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#064E3B] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-20 h-20 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-4 text-[#064E3B]">
                <ShoppingBag className="w-10 h-10 opacity-40" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Your cart is empty</h3>
              <p className="text-xs text-gray-500 mb-6 max-w-xs">
                Explore our festive cosmetics, royal bangles, cashmere socks &amp; Kashmiri shawls.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-3.5 flex gap-3 group">
                {/* Pure White Product Thumbnail */}
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-xl p-1.5 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/cosmetics_01.png';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-rose-600 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      SKU: {item.sku}
                    </p>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-gray-900 min-w-[20px] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#064E3B]">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[10px] text-gray-400 line-through ml-1.5">
                          ₹{(item.mrp * item.qty).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Billing Details */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFC8] space-y-3">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Coupon '{appliedCoupon}' Applied (-₹{couponDiscount})
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-[10px] font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. SIKAR10)"
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#064E3B] uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#064E3B] hover:bg-[#043828] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[10px] text-rose-600 font-medium mt-1">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span>Subtotal (MRP):</span>
                <span>₹{totalMrp.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>Store Discount:</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#FF7722] font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-300 pt-2">
                <span>Grand Total:</span>
                <span className="text-[#064E3B] text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99]"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 text-[#FF7722]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
