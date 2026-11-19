import React, { useRef } from 'react';
import { Printer, Download, CheckCircle, Share2, X } from 'lucide-react';
import BarcodeView from './BarcodeView';
import { storeInfo } from '../data/products';

export default function ThermalReceipt({ bill, onClose, onPrintComplete }) {
  const receiptRef = useRef(null);

  if (!bill) return null;

  const handlePrint = () => {
    window.print();
    if (onPrintComplete) onPrintComplete();
  };

  const handleShareWhatsApp = () => {
    const text = `*SIKAR SEASON SHOP - Tax Invoice*\nInvoice No: ${bill.id}\nDate: ${bill.timestamp}\nCustomer: ${bill.customerName || 'Valued Customer'} (${bill.customerPhone || ''})\nTotal Items: ${bill.totalQty || bill.items.length}\nGrand Total: ₹${bill.grandTotal}\nYou Saved: ₹${bill.discount}\n\nThank you for shopping with Sikar Season Shop!\nContact: Pooja Sharma (9602172335) | Priyanshu Sharma (+918306447955)`;
    const phone = bill.customerPhone ? bill.customerPhone.replace(/[^0-9]/g, '') : '';
    const url = phone ? `https://wa.me/91${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-amber-200 overflow-hidden">
        
        {/* Header Action Bar (Hidden in print) */}
        <div className="p-4 bg-gradient-to-r from-[#064E3B] to-[#043828] text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#FF7722]" />
            <h3 className="font-bold text-lg">Franchise Mall Tax Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Share bill on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#FF7722] hover:bg-[#D95305] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Bill (80mm)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB]">
          {/* Printable 80mm Receipt Container */}
          <div
            ref={receiptRef}
            className="printable-receipt max-w-[340px] mx-auto bg-white p-5 shadow-md border border-gray-200 rounded-lg font-mono text-[11px] text-gray-900 leading-tight"
          >
            {/* Supermarket Header */}
            <div className="text-center pb-2 border-b border-dashed border-gray-400">
              <div className="w-8 h-8 mx-auto mb-1 bg-[#064E3B] text-[#FF7722] rounded-full flex items-center justify-center font-serif font-black text-xs border border-[#FF7722]">
                SSS
              </div>
              <h1 className="font-black text-sm tracking-wider uppercase text-gray-950 font-serif">
                {storeInfo.name}
              </h1>
              <p className="text-[10px] text-gray-600 font-sans font-semibold">
                RETAIL MALL &amp; FRANCHISE STORE
              </p>
              <p className="text-[10px] text-gray-700">{storeInfo.address}</p>
              <p className="text-[10px] text-gray-800 font-medium">
                Pooja Sharma (Owner): {storeInfo.ownerPhone}
              </p>
              <p className="text-[10px] text-gray-800 font-medium">
                Manager: Priyanshu Sharma ({storeInfo.managerPhone})
              </p>
              <p className="text-[9px] text-gray-600">GSTIN: {storeInfo.gstin}</p>
              <p className="text-[9px] text-gray-600">Email: {storeInfo.email}</p>
            </div>

            {/* Bill Meta */}
            <div className="py-2 border-b border-dashed border-gray-400 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>INVOICE NO:</span>
                <span className="font-bold">{bill.id}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE &amp; TIME:</span>
                <span>{bill.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span>CASHIER COUNTER:</span>
                <span>{bill.counter || 'POS-01'} ({bill.cashier || 'Priyanshu Sharma'})</span>
              </div>
              <div className="flex justify-between">
                <span>CUSTOMER:</span>
                <span className="font-bold">{bill.customerName || 'Walk-in Guest'}</span>
              </div>
              {bill.customerPhone && (
                <div className="flex justify-between">
                  <span>MOBILE:</span>
                  <span>+91 {bill.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Line Items Table (DMart / Vishal Mega Mart standard format) */}
            <div className="py-2 border-b border-dashed border-gray-400">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300 text-[10px] font-bold">
                    <th className="py-1">ITEM</th>
                    <th className="py-1 text-center">HSN</th>
                    <th className="py-1 text-center">QTY</th>
                    <th className="py-1 text-right">RATE</th>
                    <th className="py-1 text-right">AMT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted divide-gray-200">
                  {bill.items.map((item, idx) => (
                    <tr key={idx} className="text-[10px]">
                      <td className="py-1 pr-1 font-sans font-medium">
                        <div>{item.name}</div>
                        <span className="text-[9px] text-gray-500 font-mono">[{item.sku || 'SKU'}]</span>
                      </td>
                      <td className="py-1 text-center font-mono text-[9px]">{item.hsn || '3304'}</td>
                      <td className="py-1 text-center font-bold">{item.qty}</td>
                      <td className="py-1 text-right">₹{item.rate || item.price}</td>
                      <td className="py-1 text-right font-bold">₹{((item.rate || item.price) * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="py-2 border-b border-dashed border-gray-400 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>TOTAL ITEMS / QTY:</span>
                <span className="font-bold">{bill.items.length} items / {bill.totalQty || bill.items.reduce((s, i) => s + i.qty, 0)} pcs</span>
              </div>
              <div className="flex justify-between">
                <span>GROSS MRP TOTAL:</span>
                <span>₹{(bill.subtotal || bill.grandTotal + (bill.discount || 0)).toFixed(2)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>SPECIAL STORE DISCOUNT:</span>
                  <span>-₹{bill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>TAXABLE VALUE:</span>
                <span>₹{(bill.taxable || (bill.grandTotal * 0.88)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>CGST:</span>
                <span>₹{(bill.cgst || (bill.grandTotal * 0.06)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>SGST:</span>
                <span>₹{(bill.sgst || (bill.grandTotal * 0.06)).toFixed(2)}</span>
              </div>
              {bill.roundOff !== undefined && (
                <div className="flex justify-between text-gray-600">
                  <span>ROUND OFF:</span>
                  <span>₹{Number(bill.roundOff).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-b border-gray-900 py-1.5 mt-1">
                <span>NET AMOUNT PAYABLE:</span>
                <span className="text-[#064E3B]">₹{bill.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Mode & Tender */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-0.5">
              <div className="flex justify-between font-bold">
                <span>TENDER TYPE:</span>
                <span>{bill.paymentMode || 'CASH / UPI'}</span>
              </div>
              {bill.cashTendered && (
                <>
                  <div className="flex justify-between">
                    <span>CASH RECEIVED:</span>
                    <span>₹{Number(bill.cashTendered).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>CHANGE RETURNED:</span>
                    <span>₹{Number(bill.changeReturned || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Vishal Mega Mart / DMart Big Savings Badge */}
            {bill.discount > 0 && (
              <div className="my-2 p-1.5 bg-amber-50 border border-amber-300 rounded text-center">
                <p className="font-sans font-bold text-[10px] text-amber-900">
                  YOU SAVED ₹{bill.discount.toFixed(2)} TODAY!
                </p>
                <p className="text-[9px] text-gray-600">Thank you for shopping at Sikar Season Shop</p>
              </div>
            )}

            {/* Barcode on Footer */}
            <div className="pt-2 text-center">
              <BarcodeView code={bill.id.replace(/[^0-9]/g, '') || '890456100891'} width={170} height={42} />
              <p className="text-[8px] text-gray-600 mt-1 uppercase font-sans">
                Goods once sold can be exchanged within 7 days with original tag and bill.
              </p>
              <p className="text-[8px] font-bold text-gray-800 font-sans mt-0.5">
                Visit Again! SIKAR SEASON SHOP • SIKAR (RAJASTHAN)
              </p>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between no-print">
          <p className="text-xs text-gray-500">
            Thermal Roll 80mm / A4 Print Compatible
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Done
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#064E3B] hover:bg-[#043828] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4 text-[#FF7722]" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
