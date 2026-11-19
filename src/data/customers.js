export const initialCustomers = [
  {
    id: 'cust-01',
    name: 'Pooja Sharma (VIP / Owner)',
    phone: '9602172335',
    email: 'PRIYANSHU.SHARMA96021@GMAIL.COM',
    address: 'Station Road, Main Market, Sikar, Rajasthan',
    pincode: '332001',
    loyaltyPoints: 450, // 1 point = ₹1
    creditBalance: 0, // Khata / Udhar balance
    totalOrders: 18,
    lifetimeSpend: 24500,
    joinDate: '2023-01-10'
  },
  {
    id: 'cust-02',
    name: 'Priyanshu Sharma (Franchise Head)',
    phone: '8306447955',
    email: 'PRIYANSHU.SHARMA96021@GMAIL.COM',
    address: 'Bajaj Road, Sikar, Rajasthan',
    pincode: '332001',
    loyaltyPoints: 320,
    creditBalance: 0,
    totalOrders: 12,
    lifetimeSpend: 16800,
    joinDate: '2023-03-15'
  },
  {
    id: 'cust-03',
    name: 'Anita Devi Shekhawat',
    phone: '9829012345',
    email: 'anita.shekhawat@example.com',
    address: 'Piprali Road, Near Circuit House, Sikar',
    pincode: '332001',
    loyaltyPoints: 185,
    creditBalance: 450, // Has ₹450 pending Khata credit
    totalOrders: 8,
    lifetimeSpend: 8900,
    joinDate: '2023-06-20'
  },
  {
    id: 'cust-04',
    name: 'Sunita Agarwal',
    phone: '9414056789',
    email: 'sunita.agarwal@example.com',
    address: 'Fatehpuri Gate, Sikar',
    pincode: '332001',
    loyaltyPoints: 95,
    creditBalance: 0,
    totalOrders: 5,
    lifetimeSpend: 5400,
    joinDate: '2023-09-05'
  },
  {
    id: 'cust-05',
    name: 'Rahul Kumar Saini',
    phone: '9782045612',
    email: 'rahul.saini@example.com',
    address: 'Salasar Bus Stand Road, Sikar',
    pincode: '332001',
    loyaltyPoints: 60,
    creditBalance: 120, // Has ₹120 Khata
    totalOrders: 4,
    lifetimeSpend: 3100,
    joinDate: '2024-01-12'
  }
];

export const sampleSalesHistory = [
  {
    id: 'BILL-2026-0891',
    timestamp: '2026-11-18 19:45:22',
    cashier: 'Priyanshu Sharma',
    counter: 'COUNTER-01',
    customerName: 'Anita Devi Shekhawat',
    customerPhone: '9829012345',
    itemsCount: 3,
    totalQty: 4,
    subtotal: 2197,
    discount: 300,
    taxable: 1897,
    cgst: 68.25,
    sgst: 68.25,
    roundOff: 0.50,
    grandTotal: 2034,
    paymentMode: 'UPI',
    items: [
      { name: 'Pure Kashmiri Pashmina Shawl', sku: 'SSS-SHW-001', hsn: '6214', qty: 1, rate: 1899, amount: 1899 },
      { name: 'Herbal Deep Kohl Kajal', sku: 'SSS-COS-003', hsn: '3304', qty: 1, rate: 349, amount: 349 },
      { name: 'Combed Cotton Breathable Ankle Socks', sku: 'SSS-SOX-002', hsn: '6115', qty: 2, rate: 349, amount: 698 }
    ]
  },
  {
    id: 'BILL-2026-0890',
    timestamp: '2026-11-18 18:20:10',
    cashier: 'Pooja Sharma',
    counter: 'COUNTER-01',
    customerName: 'Sunita Agarwal',
    customerPhone: '9414056789',
    itemsCount: 2,
    totalQty: 2,
    subtotal: 1398,
    discount: 150,
    taxable: 1248,
    cgst: 37.44,
    sgst: 37.44,
    roundOff: 0.12,
    grandTotal: 1323,
    paymentMode: 'CASH',
    items: [
      { name: 'Rajasthani Lac Chudha Set', sku: 'SSS-BAN-001', hsn: '7117', qty: 1, rate: 999, amount: 999 },
      { name: 'Regal Emerald Glass Bangles', sku: 'SSS-BAN-002', hsn: '7117', qty: 1, rate: 399, amount: 399 }
    ]
  }
];
