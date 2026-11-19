import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onMoveToCart,
  onClearWishlist
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#064E3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-current" />
            <h2 className="font-bold text-base font-serif">
              My Wishlist ({wishlistItems.length} items)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 bg-[#FAF7F2]">
          {wishlistItems.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 text-base mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500">Tap the heart on any item to save it for later.</p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div key={item.id} className="py-3 flex gap-3 items-center bg-white p-3 rounded-xl mb-2 border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
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
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase">{item.categoryLabel}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xs font-bold text-[#064E3B]">₹{item.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">₹{item.mrp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onMoveToCart(item)}
                    className="p-2 bg-[#064E3B] hover:bg-[#043828] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#FF7722]" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 rounded-lg"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className="p-3 bg-white border-t border-gray-200 flex justify-between items-center text-xs">
            <button
              onClick={onClearWishlist}
              className="text-rose-600 font-bold hover:underline"
            >
              Clear Wishlist
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
