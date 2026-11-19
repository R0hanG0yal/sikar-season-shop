import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, Store, QrCode, CreditCard, Banknote, Sparkles } from 'lucide-react';
import UpiQrView from './UpiQrView';
import confetti from 'canvas-confetti';
import { storeInfo } from '../data/products';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderSuccess
}) {
  const [formData, setFormData] = useState({
    name: 'Pooja Sharma',
    phone: '9602172335',
    email: 'PRIYANSHU.SHARMA96021@GMAIL.COM',
    address: 'Station Road, Near Main Clock Tower',
    city: 'Sikar',
    state: 'Rajasthan',
    pincode: '332001',
    deliveryType: 'delivery', // 'delivery' | 'pickup'
    paymentMethod: 'upi', // 'upi' | 'cod' | 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedBill, setConfirmedBill] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalMrp = cartItems.reduce((acc, item) => acc + item.mrp * item.qty, 0);

  let couponDiscount = 0;
  if (appliedCoupon === 'SIKAR10') couponDiscount = Math.round(subtotal * 0.10);
  else if (appliedCoupon === 'POOJA20') couponDiscount = Math.round(subtotal * 0.20);
  else if (appliedCoupon === 'WELCOME50') couponDiscount = Math.min(50, subtotal);

  const shipping = formData.deliveryType === 'pickup' || subtotal >= 499 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shipping);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `SSS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const timestamp = now.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });

      const newBill = {
        id: orderId,
        timestamp,
        cashier: 'Online Store System',
        counter: 'WEB-PORTAL',
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        itemsCount: cartItems.length,
        totalQty: cartItems.reduce((s, i) => s + i.qty, 0),
        subtotal: totalMrp,
        discount: (totalMrp - subtotal) + couponDiscount,
        taxable: Math.round(grandTotal * 0.88),
        cgst: Math.round(grandTotal * 0.06),
        sgst: Math.round(grandTotal * 0.06),
        roundOff: 0.00,
        grandTotal,
        paymentMode: formData.paymentMethod.toUpperCase(),
        items: cartItems.map(item => ({
          name: item.name,
          sku: item.sku,
          hsn: item.hsn,
          qty: item.qty,
          rate: item.price,
          amount: item.price * item.qty
        }))
      };

      setConfirmedBill(newBill);
      setIsSubmitting(false);
      setOrderComplete(true);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#064E3B', '#FF7722', '#F4EFE6', '#D95305']
        });
      } catch {
        // ignore
      }

      if (onOrderSuccess) {
        onOrderSuccess(newBill);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#064E3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF7722]" />
            <h2 className="font-bold text-base font-serif">
              {orderComplete ? 'Order Confirmed!' : 'Secure Checkout • Sikar Season Shop'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          /* Order Confirmation View */
          <div className="p-8 text-center flex-1 overflow-y-auto bg-[#FAF7F2]">
            <div className="w-16 h-16 bg-emerald-100 text-[#064E3B] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#064E3B]">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="text-xl md:text-2xl font-black text-gray-900 font-serif">
              Thank You, {confirmedBill.customerName}!
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Your order has been placed successfully at Sikar Season Shop.
            </p>

            <div className="my-6 p-4 bg-white rounded-xl border border-[#E8DFC8] text-left text-xs space-y-1.5 shadow-sm">
              <div className="flex justify-between font-bold text-gray-900 border-b border-gray-100 pb-2">
                <span>Order Reference:</span>
                <span className="font-mono text-[#064E3B]">{confirmedBill.id}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Date &amp; Time:</span>
                <span>{confirmedBill.timestamp}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Mode:</span>
                <span className="font-semibold text-gray-900">{confirmedBill.paymentMode}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Items:</span>
                <span>{confirmedBill.totalQty} items</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-100 pt-2">
                <span>Total Amount Paid:</span>
                <span className="text-[#064E3B]">₹{confirmedBill.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 mb-6 text-left">
              <p className="font-bold">Store Support &amp; Tracking:</p>
              <p>Pooja Sharma (Owner): {storeInfo.ownerPhone} | Priyanshu Sharma: {storeInfo.managerPhone}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">We have sent the confirmation to {confirmedBill.customerPhone}</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF7F2]">
            {/* Delivery Type Switch */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'delivery' }))}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  formData.deliveryType === 'delivery'
                    ? 'bg-white border-[#064E3B] text-[#064E3B] shadow-sm ring-1 ring-[#064E3B]'
                    : 'bg-white/60 border-gray-300 text-gray-600 hover:bg-white'
                }`}
              >
                <Truck className="w-4 h-4 text-[#FF7722]" />
                Doorstep Delivery
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'pickup' }))}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  formData.deliveryType === 'pickup'
                    ? 'bg-white border-[#064E3B] text-[#064E3B] shadow-sm ring-1 ring-[#064E3B]'
                    : 'bg-white/60 border-gray-300 text-gray-600 hover:bg-white'
                }`}
              >
                <Store className="w-4 h-4 text-[#FF7722]" />
                Sikar Store Pickup (Free)
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-white p-4 rounded-xl border border-[#E8DFC8] space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
                Customer &amp; Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
              </div>

              {formData.deliveryType === 'delivery' && (
                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, Landmark, Area"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-4 rounded-xl border border-[#E8DFC8] space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#064E3B] flex items-center gap-1.5">
                Payment Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'bg-emerald-50 border-[#064E3B] text-[#064E3B] font-bold shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1 text-[#FF7722]" />
                  Instant UPI QR
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-emerald-50 border-[#064E3B] text-[#064E3B] font-bold shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 mx-auto mb-1 text-[#064E3B]" />
                  Cash on Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'bg-emerald-50 border-[#064E3B] text-[#064E3B] font-bold shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#064E3B]" />
                  Card / Net Banking
                </button>
              </div>

              {formData.paymentMethod === 'upi' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col items-center">
                  <UpiQrView
                    upiId={storeInfo.upiId}
                    name={storeInfo.name}
                    amount={grandTotal}
                    size={160}
                  />
                  <p className="text-[11px] text-gray-500 mt-2 text-center">
                    Scan via PhonePe, Google Pay, Paytm, or BHIM. Order verifies instantly.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary & Submit Button */}
            <div className="bg-white p-4 rounded-xl border border-[#E8DFC8] space-y-2 text-xs shadow-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({cartItems.reduce((s, i) => s + i.qty, 0)}):</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-200 pt-2">
                <span>Total Amount to Pay:</span>
                <span className="text-[#064E3B] text-base">₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FF7722]" />
                    Confirm &amp; Place Order (₹{grandTotal.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
