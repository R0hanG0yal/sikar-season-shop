import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, ShoppingBag, Heart, Star, Eye, ShieldCheck, Truck, RefreshCw,
  Phone, Mail, MapPin, ChevronRight, ChevronLeft, Sparkles, Filter, SlidersHorizontal,
  ArrowRight, Store, Check, Award, Layers, Feather, Gem, CircleDot, Palette,
  Menu, X, ChevronDown, User, Globe, Share2, Camera
} from 'lucide-react';
import { storeInfo, categories } from '../data/products';

export default function Storefront({
  products,
  cartItems,
  wishlistItems,
  onOpenCart,
  onOpenWishlist,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  onSwitchToPos
}) {
  // Navigation & UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pagesCollapsed, setPagesCollapsed] = useState(false);
  const [categoriesCollapsed, setCategoriesCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [displayLimit, setDisplayLimit] = useState(12);
  const [showFaviconIndex, setShowFaviconIndex] = useState(false);
  
  // Hero Carousel State (0: NOVA Story, 1: Emerald Luxury, 2: ONDERA Heritage)
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  // Auto-scroll horizontal hero slider every 6.5s (pauses on mouse hover)
  useEffect(() => {
    if (isHeroHovered) return;
    const slideTimer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(slideTimer);
  }, [isHeroHovered]);

  const nextHeroSlide = () => setCurrentHeroSlide(prev => (prev + 1) % 3);
  const prevHeroSlide = () => setCurrentHeroSlide(prev => (prev - 1 + 3) % 3);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };
  const handleTouchEnd = (e) => {
    if (touchStartX === null || !e.changedTouches || !e.changedTouches[0]) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextHeroSlide();
    else if (diff < -50) prevHeroSlide();
    setTouchStartX(null);
  };

  // Active Popular Collection filter/view state
  const [activeCollectionTab, setActiveCollectionTab] = useState('all');

  // Countdown timer for "News and Inspiration / New Arrivals"
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 42, seconds: 18 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchCat = selectedCategory === 'all' || product.category === selectedCategory;
        const matchSearch = !searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const totalCartUnits = cartItems.reduce((acc, i) => acc + i.qty, 0);

  return (
    <div className="min-h-screen bg-white text-[#262626] font-sans antialiased selection:bg-[#064E3B] selection:text-white relative">
      
      {/* ============================================================== */}
      {/* 1. COLLAPSIBLE SLIDE-OUT SIDEBAR NAVIGATION */}
      {/* ============================================================== */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto p-6">
          {/* Sidebar Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#064E3B] text-[#FF7722] font-serif font-black text-xs flex items-center justify-center border-2 border-[#FF7722] shadow-xs">
                SSS
              </div>
              <div>
                <span className="font-serif font-black text-lg tracking-tight text-[#064E3B] block leading-none">
                  SIKAR SEASON<span className="text-[#FF7722]">.</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-[#FF7722] uppercase block mt-1">
                  ESTD. RAJASTHAN
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Group */}
          <nav className="mt-6 space-y-1 text-sm font-semibold text-gray-800">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSidebarOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 hover:text-[#064E3B] flex items-center justify-between"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Pages Collapsible */}
            <div>
              <button
                onClick={() => setPagesCollapsed(!pagesCollapsed)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between text-gray-800"
              >
                <span>Pages</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${pagesCollapsed ? 'rotate-180' : ''}`} />
              </button>
              {pagesCollapsed && (
                <div className="pl-6 py-1 space-y-1 text-xs text-gray-600 border-l-2 border-gray-100 ml-4">
                  <a href="#about" onClick={() => setSidebarOpen(false)} className="block py-1.5 hover:text-[#064E3B]">About Us</a>
                  <a href="#team" onClick={() => setSidebarOpen(false)} className="block py-1.5 hover:text-[#064E3B]">About Team</a>
                  <a href="#contact" onClick={() => setSidebarOpen(false)} className="block py-1.5 hover:text-[#064E3B]">Contact Us</a>
                  <button onClick={() => { onOpenWishlist(); setSidebarOpen(false); }} className="block py-1.5 hover:text-[#064E3B]">Wishlist</button>
                  <a href="#faq" onClick={() => setSidebarOpen(false)} className="block py-1.5 hover:text-[#064E3B]">FAQ</a>
                </div>
              )}
            </div>

            {/* Shop Link */}
            <button
              onClick={() => {
                document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                setSidebarOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 hover:text-[#064E3B] flex items-center justify-between"
            >
              <span>Shop All Products</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Categories Collapsible */}
            <div>
              <button
                onClick={() => setCategoriesCollapsed(!categoriesCollapsed)}
                className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-gray-50 flex items-center justify-between text-gray-800"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${categoriesCollapsed ? 'rotate-180' : ''}`} />
              </button>
              {categoriesCollapsed && (
                <div className="pl-6 py-1 space-y-1 text-xs text-gray-600 border-l-2 border-gray-100 ml-4">
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                        setSidebarOpen(false);
                      }}
                      className="block w-full text-left py-1 hover:text-[#064E3B]"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Blog */}
            <a
              href="#blogs"
              onClick={() => setSidebarOpen(false)}
              className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 hover:text-[#064E3B]"
            >
              Blog
            </a>

            {/* Franchise POS Button in Sidebar */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => {
                  onSwitchToPos();
                  setSidebarOpen(false);
                }}
                className="w-full py-3 px-4 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Store className="w-4 h-4 text-[#FF7722]" />
                Franchise POS Mall Terminal
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Contacts */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 space-y-1">
          <p className="font-bold text-gray-900">{storeInfo.name}</p>
          <p>Pooja Sharma: {storeInfo.ownerPhone}</p>
          <p>Priyanshu: {storeInfo.managerPhone}</p>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. TOP FIXED HEADER                                          */}
      {/* ============================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between gap-4">
          
          {/* Left: Hamburger menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-800 transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setSelectedCategory('all')}>
              <div className="w-9 h-9 rounded-full bg-[#064E3B] text-[#FAF7F2] font-serif font-black text-xs flex items-center justify-center border-2 border-[#FF7722] shadow-xs">
                SSS
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-[#064E3B] leading-none">
                  SIKAR SEASON<span className="text-[#FF7722]">.</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#FF7722] uppercase leading-none mt-1">
                  PREMIUM STORE &amp; MALL POS
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-700 uppercase tracking-wider">
            <button
              onClick={() => {
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#064E3B] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => document.getElementById('popular-collections')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#064E3B] transition-colors"
            >
              Collections
            </button>
            <button
              onClick={() => document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#064E3B] transition-colors"
            >
              Shop
            </button>
            <button
              onClick={() => document.getElementById('top-selling-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:text-[#064E3B] transition-colors"
            >
              Top Selling
            </button>
            <a href="#blogs" className="hover:text-[#064E3B] transition-colors">
              Blog
            </a>
            <a href="#contact" className="hover:text-[#064E3B] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Live Search Trigger / Bar */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 text-xs animate-in fade-in duration-200">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent border-0 focus:outline-none w-36 sm:w-52 text-gray-900"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-700 hover:text-[#064E3B] transition-colors"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* User Account / Contact Dropdown */}
            <div className="relative group hidden sm:block">
              <button className="p-2 text-gray-700 hover:text-[#064E3B] transition-colors" title="Account &amp; Contacts">
                <User className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-xs space-y-2 hidden group-hover:block z-50">
                <p className="font-bold text-gray-900 border-b pb-1">Sikar Season Shop Support</p>
                <p className="text-gray-600">Owner: Pooja Sharma (9602172335)</p>
                <p className="text-gray-600">Head: Priyanshu Sharma (+91 8306447955)</p>
                <p className="text-gray-600 text-[11px]">{storeInfo.email}</p>
                <button
                  onClick={onSwitchToPos}
                  className="w-full mt-2 py-2 bg-[#064E3B] text-white rounded-lg font-bold text-center"
                >
                  Open POS Software
                </button>
              </div>
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-700 hover:text-rose-600 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Icon with badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-[#064E3B] transition-colors"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartUnits > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-[#FF7722] text-white text-[9px] font-bold flex items-center justify-center">
                  {totalCartUnits}
                </span>
              )}
            </button>

            {/* POS Billing Switch Button */}
            <button
              onClick={onSwitchToPos}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#064E3B] hover:bg-[#043828] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#FF7722]" />
              <span>Mall POS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container below fixed header */}
      <main className="pt-18">
        
        {/* ============================================================== */}
        {/* 1. HERO SECTION (UNIFIED FIXED FRAME WITH HORIZONTAL SCROLL)   */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
          <div
            className="relative rounded-[32px] sm:rounded-[40px] md:rounded-[48px] border-[6px] sm:border-[8px] md:border-[10px] border-[#064E3B] bg-white overflow-hidden shadow-2xl h-[580px] sm:h-[620px] md:h-[680px] flex flex-col justify-between select-none"
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* 1. UNIFIED FIXED TOP FRAME BAR (Same position & style on all slides) */}
            <div className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 flex-shrink-0">
              
              {/* Brand Emblem */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-[#FF7722] flex items-center justify-center font-bold text-sm shadow-xs border border-[#FF7722]/30">
                  ✤
                </div>
                <div>
                  <span className="font-serif font-black text-xs sm:text-sm tracking-tight text-[#064E3B] uppercase block leading-none">
                    SIKAR SEASON<span className="text-[#FF7722]">.</span>
                  </span>
                  <span className="text-[8px] font-mono font-bold tracking-widest text-[#FF7722] uppercase block mt-0.5">
                    HEIRLOOM RAJASTHAN
                  </span>
                </div>
              </div>

              {/* Center Quick Switcher Pills (Horizontal Navigation Tabs) */}
              <div className="hidden md:flex items-center gap-1.5 bg-gray-100/90 p-1 rounded-full border border-gray-200">
                <button
                  onClick={() => setCurrentHeroSlide(0)}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    currentHeroSlide === 0
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  01. Kashmiri Shawl
                </button>
                <button
                  onClick={() => setCurrentHeroSlide(1)}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    currentHeroSlide === 1
                      ? 'bg-[#FF7722] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  02. Bridal Bangles
                </button>
                <button
                  onClick={() => setCurrentHeroSlide(2)}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    currentHeroSlide === 2
                      ? 'bg-[#3C4D35] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  03. 24K Cosmetics
                </button>
              </div>

              {/* Right Frame Controls: Slide Counter + Arrow Buttons + Action Pill */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Slide Counter */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-[11px] font-mono font-bold text-gray-700">
                  <span className="text-[#064E3B]">0{currentHeroSlide + 1}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-500">03</span>
                </div>

                {/* Left/Right Slide Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevHeroSlide}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#064E3B] hover:text-white text-gray-700 flex items-center justify-center transition-all cursor-pointer border border-gray-200 shadow-xs"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextHeroSlide}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#064E3B] hover:text-white text-gray-700 flex items-center justify-center transition-all cursor-pointer border border-gray-200 shadow-xs"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Contextual Action Button */}
                <button
                  onClick={() => {
                    const catMap = ['shawls', 'bangles', 'cosmetics'];
                    setSelectedCategory(catMap[currentHeroSlide]);
                    document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-white rounded-full text-xs font-bold tracking-wide transition-all shadow-xs hover:scale-103 cursor-pointer"
                >
                  <span>
                    {currentHeroSlide === 0
                      ? 'Shop Shawls'
                      : currentHeroSlide === 1
                      ? 'Shop Bangles'
                      : 'Shop Cosmetics'}
                  </span>
                  <span className="text-[#FF7722]">↗</span>
                </button>
              </div>

            </div>

            {/* 2. HORIZONTAL SLIDING VIEWPORT TRACK */}
            <div className="relative flex-1 w-full overflow-hidden">
              <div
                className="flex h-full w-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentHeroSlide * 100}%)` }}
              >
                
                {/* -------------------------------------------------------- */}
                {/* SLIDE 0: COMPLETE SHAWL HERO BANNER (KASHMIRI PASHMINA)  */}
                {/* -------------------------------------------------------- */}
                <div
                  className="w-full h-full flex-shrink-0 relative overflow-hidden bg-white flex items-center justify-center cursor-pointer group"
                  onClick={() => {
                    setSelectedCategory('shawls');
                    document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  title="Explore Kashmiri Pashmina Shawls Collection"
                >
                  <img
                    src="/images/hero/hero_complete_shawl.png"
                    alt="Sikar Season - Kashmiri Shawls Hero Artwork"
                    className="w-full h-full object-contain sm:object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* SLIDE 1: COMPLETE BANGLES HERO BANNER (HERITAGE BANGLES)  */}
                {/* -------------------------------------------------------- */}
                <div
                  className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#FAF5F0] flex items-center justify-center cursor-pointer group"
                  onClick={() => {
                    setSelectedCategory('bangles');
                    document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  title="Explore Rajasthani Bridal Bangles Collection"
                >
                  <img
                    src="/images/hero/hero_complete_bangles.png"
                    alt="Sikar Season - Royal Bangles Hero Artwork"
                    className="w-full h-full object-contain sm:object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* SLIDE 2: COMPLETE COSMETICS HERO BANNER (ONDERA STYLE)   */}
                {/* -------------------------------------------------------- */}
                <div
                  className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#3C4D35] flex items-center justify-center cursor-pointer group"
                  onClick={() => {
                    setSelectedCategory('cosmetics');
                    document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  title="Explore 24K Gold Radiant Bridal Cosmetics"
                >
                  <img
                    src="/images/hero/hero_complete_cosmetics.png"
                    alt="Sikar Season - 24K Gold Bridal Cosmetics Hero Artwork"
                    className="w-full h-full object-contain sm:object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                  />
                </div>

              </div>
            </div>

            {/* 3. UNIFIED FIXED BOTTOM FRAME BAR (Timeline / Progress Indicators) */}
            <div className="relative z-30 flex items-center justify-between px-6 sm:px-10 py-3 bg-white/95 backdrop-blur-md border-t border-gray-100 flex-shrink-0">
              
              {/* Slide Timeline Indicators */}
              <div className="flex items-center gap-2 sm:gap-4 w-full max-w-lg">
                {[
                  { index: 0, label: '01. Kashmiri Shawl', cat: 'Pure Sozni' },
                  { index: 1, label: '02. Bridal Bangles', cat: 'Kundan & Lac' },
                  { index: 2, label: '03. 24K Cosmetics', cat: 'Gold Bridal' }
                ].map(tab => (
                  <button
                    key={tab.index}
                    onClick={() => setCurrentHeroSlide(tab.index)}
                    className="flex-1 text-left py-1 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span className={currentHeroSlide === tab.index ? 'text-[#064E3B]' : 'text-gray-400 group-hover:text-gray-700'}>
                        {tab.label}
                      </span>
                    </div>
                    {/* Animated Progress Track */}
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          currentHeroSlide === tab.index
                            ? 'bg-[#064E3B] w-full'
                            : 'bg-transparent w-0'
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Status / Autoplay Indicator */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-gray-400">
                <span className={`w-1.5 h-1.5 rounded-full ${isHeroHovered ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'}`} />
                <span>{isHeroHovered ? 'PAUSED' : 'AUTO-SCROLLING'}</span>
              </div>

            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. SOCIAL & HERITAGE TRUST BAR (NOVA STRIP REPLICATION)        */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-6 sm:px-10 py-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Follow Links */}
            <div className="flex items-center gap-4 text-xs font-bold text-gray-700 tracking-wider">
              <span className="uppercase text-gray-400">Follow</span>
              <div className="flex items-center gap-3 text-gray-800">
                <a href="#contact" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#064E3B] hover:text-white flex items-center justify-center transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </a>
                <a href="#contact" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#064E3B] hover:text-white flex items-center justify-center transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                </a>
                <a href="https://wa.me/919602172335" target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#064E3B] hover:text-white flex items-center justify-center transition-colors" title="WhatsApp Pooja Sharma">
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px h-6 bg-gray-200" />

            {/* Brand Heritage Credentials */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8 lg:gap-10 text-[11px] sm:text-xs font-serif font-black tracking-widest text-gray-500 uppercase">
              <span className="hover:text-[#064E3B] transition-colors">100% Pure Pashmina</span>
              <span className="hover:text-[#064E3B] transition-colors">Jaipur Lac Chudha</span>
              <span className="hover:text-[#064E3B] transition-colors">24K Gold Ayurveda</span>
              <span className="hover:text-[#064E3B] transition-colors">Mall Franchise POS</span>
              <span className="hover:text-[#064E3B] transition-colors">Govt GST Verified</span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. POPULAR COLLECTIONS (NOVA-INSPIRED BEST SELLER SECTION)     */}
        {/* ============================================================== */}
        <section id="popular-collections" className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-gray-900 tracking-tight">
                Popular Collections
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Discover Royal Traditions &amp; Everyday Essentials from Sikar Season Shop
              </p>
            </div>

            {/* Arrow Pagination Controls */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('collections-carousel-track');
                  if (el) el.scrollBy({ left: -360, behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-900 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all cursor-pointer shadow-xs bg-white text-lg font-bold"
                title="Previous Collection"
              >
                ‹
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('collections-carousel-track');
                  if (el) el.scrollBy({ left: 360, behavior: 'smooth' });
                }}
                className="w-10 h-10 rounded-full bg-gray-950 text-white flex items-center justify-center hover:bg-[#064E3B] transition-all cursor-pointer shadow-sm text-lg font-bold"
                title="Next Collection"
              >
                ›
              </button>
            </div>
          </div>

          {/* 3 Large Rounded Collection Cards */}
          <div
            id="collections-carousel-track"
            className="grid grid-cols-1 md:grid-cols-3 gap-7 overflow-x-auto pb-2 scroll-smooth"
          >
            {[
              {
                id: 'bangles',
                title: 'Royal Bridal Lac Chudha',
                location: 'Sikar Season Shop • Rajasthan',
                image: '/images/collections/col_bangles.jpg',
                rating: '4.9',
                count: '12 Items'
              },
              {
                id: 'shawls',
                title: 'Pure Kashmiri Pashmina',
                location: 'Handloom Artisan Weave',
                image: '/images/collections/col_shawls.jpg',
                rating: '4.9',
                count: '12 Items'
              },
              {
                id: 'cosmetics',
                title: '24K Gold Bridal Cosmetics',
                location: 'Ayurvedic Radiance Formula',
                image: '/images/collections/col_cosmetics.jpg',
                rating: '4.8',
                count: '12 Items'
              }
            ].map(col => (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedCategory(col.id);
                  document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group cursor-pointer flex flex-col justify-between"
              >
                {/* Large Rounded Image Card */}
                <div className="relative aspect-16/10 w-full rounded-3xl overflow-hidden bg-[#FAF7F2] border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-gray-200">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full text-[10px] font-bold text-gray-900 uppercase tracking-wider shadow-xs">
                    {col.count}
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="pt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-black text-lg text-gray-900 group-hover:text-[#064E3B] transition-colors leading-snug">
                      {col.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{col.location}</span>
                    </p>
                  </div>

                  {/* Rating Badge (Emerald pill like NOVA) */}
                  <div className="px-2.5 py-1 bg-[#064E3B] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs flex-shrink-0">
                    <Star className="w-3 h-3 fill-[#FF7722] text-[#FF7722]" />
                    <span>{col.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3.5 CATEGORY FAVICON QUICK-NAV & VISUAL DIRECTORY              */}
        {/* ============================================================== */}
        <section className="bg-white border-b border-gray-200 py-6 px-4 shadow-xs relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7722]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#064E3B]">
                  Browse Collections by Category Favicon
                </h3>
              </div>
              <button
                onClick={() => setShowFaviconIndex(!showFaviconIndex)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#064E3B] text-xs font-bold text-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-all shadow-xs self-start sm:self-auto cursor-pointer"
              >
                <span>{showFaviconIndex ? 'Hide Favicon Index' : 'View All 72 Product Favicons (Visual Directory)'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { id: 'cosmetics', name: 'Ladies Cosmetics', icon: '/favicons/cat_fav_cosmetics.png', count: 12 },
                { id: 'bangles', name: 'Royal Bangles', icon: '/favicons/cat_fav_bangles.png', count: 12 },
                { id: 'socks', name: 'Cashmere Socks', icon: '/favicons/cat_fav_socks.png', count: 12 },
                { id: 'undergarments', name: 'Unisex Innerwear', icon: '/favicons/cat_fav_undergarments.png', count: 12 },
                { id: 'showpieces', name: 'Brass Showpieces', icon: '/favicons/cat_fav_showpieces.png', count: 12 },
                { id: 'shawls', name: 'Winter Shawls', icon: '/favicons/cat_fav_shawls.png', count: 12 }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 text-center group cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#FAF7F2] border-[#064E3B] shadow-sm scale-102 ring-2 ring-[#064E3B]/20'
                      : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-white p-1 border border-gray-200 shadow-xs mb-2 group-hover:scale-108 transition-transform flex items-center justify-center overflow-hidden">
                    <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold text-gray-900 group-hover:text-[#064E3B] transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                    {cat.count} Items
                  </span>
                </button>
              ))}
            </div>

            {/* EXPANDABLE VISUAL FAVICON DIRECTORY (ALL 72 ITEMS) */}
            {showFaviconIndex && (
              <div className="mt-8 pt-8 border-t border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="font-serif font-black text-xl text-gray-900">
                      Complete Product Favicon Index (All 72 Items)
                    </h4>
                    <p className="text-xs text-gray-500">
                      Every single product image favicon listed. Click any favicon to view item details and add to bag.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-[#064E3B] rounded-full">
                      72 Favicons Loaded
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3 max-h-[500px] overflow-y-auto p-3 bg-[#FAF7F2] rounded-2xl border border-gray-200">
                  {products.map(prod => {
                    const favFile = `/favicons/fav_${prod.image.split('/').pop().replace('.png', '')}.png`;
                    return (
                      <div
                        key={prod.id}
                        onClick={() => onQuickView(prod)}
                        className="group relative flex flex-col items-center bg-white p-2.5 rounded-xl border border-gray-200 hover:border-[#064E3B] hover:shadow-md cursor-pointer transition-all duration-200 text-center"
                        title={`${prod.name} (₹${prod.price}) - Click to preview`}
                      >
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden mb-1.5 group-hover:scale-110 transition-transform">
                          <img
                            src={favFile}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = prod.image; }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-900 line-clamp-1 w-full group-hover:text-[#064E3B]">
                          {prod.name}
                        </span>
                        <span className="text-[10px] font-black text-[#064E3B] mt-0.5">
                          ₹{prod.price}
                        </span>
                        <span className="text-[8px] font-mono text-gray-400 uppercase">
                          {prod.sku.split('-')[1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. NEW ARRIVALS (Sikar Season Shop Authentic Collections)     */}
        {/* ============================================================== */}
        <section id="new-arrivals-section" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-serif">
              New Arrivals
            </h2>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Explore our authentic Sikar collections — handcrafted Rajasthani Lac bangles, pure Kashmiri Pashmina shawls, luxury bridal cosmetics, premium winter thermals, socks, and artisan brass showpieces.
            </p>
          </div>

          {/* Filter Pills / Tabs for all Sikar Season Shop Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs font-bold">
            <button
              onClick={() => { setSelectedCategory('all'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
              }`}
            >
              All Arrivals ({products.length})
            </button>
            <button
              onClick={() => { setSelectedCategory('cosmetics'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'cosmetics'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#064E3B]'
              }`}
            >
              Ladies Cosmetics (12)
            </button>
            <button
              onClick={() => { setSelectedCategory('bangles'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'bangles'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#064E3B]'
              }`}
            >
              Royal Bangles (12)
            </button>
            <button
              onClick={() => { setSelectedCategory('socks'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'socks'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#064E3B]'
              }`}
            >
              Cashmere Socks (12)
            </button>
            <button
              onClick={() => { setSelectedCategory('undergarments'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'undergarments'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#064E3B]'
              }`}
            >
              Unisex Undergarments (12)
            </button>
            <button
              onClick={() => { setSelectedCategory('showpieces'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'showpieces'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#064E3B]'
              }`}
            >
              Showpieces &amp; Gifts (12)
            </button>
            <button
              onClick={() => { setSelectedCategory('shawls'); setDisplayLimit(12); }}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedCategory === 'shawls'
                  ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#064E3B]'
              }`}
            >
              Winter Shawls (12)
            </button>
          </div>

          {/* Product Grid (4 items per row responsive studio layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {filteredProducts.slice(0, displayLimit).map((item) => {
              const isWishlisted = wishlistItems.some(i => i.id === item.id);

              return (
                <div key={item.id} className="group relative flex flex-col justify-between">
                  
                  {/* Image Card Canvas (Pure White Background merging seamlessly) */}
                  <div className="relative w-full aspect-square bg-[#FFFFFF] rounded-xl overflow-hidden p-6 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/cosmetics_01.png';
                      }}
                    />

                    {/* Right-Side Hover Action Rail (Quick actions: Wishlist, Quick View, Cart) */}
                    <div className="absolute right-3 top-0 bottom-0 flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button
                        onClick={() => onToggleWishlist(item)}
                        className={`w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 ${
                          isWishlisted ? 'text-rose-600' : 'text-gray-500 hover:text-rose-600'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => onQuickView(item)}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all hover:scale-110"
                        title="Quick View Modal"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onAddToCart(item, 1)}
                        className="w-9 h-9 rounded-full bg-[#064E3B] text-white shadow-md flex items-center justify-center hover:bg-[#043828] transition-all hover:scale-110"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#FF7722]" />
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="pt-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src={`/favicons/fav_${item.image.split('/').pop().replace('.png', '')}.png`}
                        alt=""
                        className="w-4 h-4 rounded-xs border border-gray-200 object-contain flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider block">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h3
                      onClick={() => onQuickView(item)}
                      className="font-bold text-sm text-gray-900 mt-1 line-clamp-1 hover:text-[#064E3B] transition-colors cursor-pointer font-serif"
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-sm text-gray-900">
                        ₹{item.price}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{item.mrp}
                        </span>
                      )}
                      {item.discount > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold ml-auto">
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View More / Load More Button */}
          {filteredProducts.length > displayLimit ? (
            <div className="text-center mt-12">
              <button
                onClick={() => setDisplayLimit(prev => prev + 12)}
                className="px-8 py-3.5 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-bold uppercase tracking-widest transition-all rounded-md shadow-xs inline-flex items-center gap-2"
              >
                <span>View More Products</span>
                <span className="text-xs text-[#FF7722] font-mono">({Math.min(displayLimit, filteredProducts.length)} / {filteredProducts.length})</span>
              </button>
            </div>
          ) : filteredProducts.length > 12 && (
            <div className="text-center mt-10 text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Showing all {filteredProducts.length} products
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* 5. NEWS AND INSPIRATION COUNTDOWN PROMO (BRIDAL & WINTER HAMPER) */}
        {/* ============================================================== */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-br from-[#FAF7F2] via-white to-[#F5F1EA] overflow-hidden border-y border-amber-100/60">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Hamper Details & Countdown */}
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-[#FF7722] animate-pulse" />
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#FF7722] uppercase">
                    Festive Season Special
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-950 uppercase tracking-tight font-serif leading-tight">
                  Bridal &amp; Winter <span className="text-[#064E3B]">Hamper</span>
                </h2>

                {/* Accent colored stroke */}
                <div className="w-16 h-1.5 bg-[#064E3B] rounded-full my-2" />

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Limited festive edition pairing authentic Kashmiri Pashmina, handcrafted Lac Chudha, and 24K Gold bridal radiance cosmetics in a royal gift presentation.
                </p>

                {/* 3-in-1 Hamper Inclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 pb-2">
                  <div className="p-2.5 rounded-lg bg-white border border-gray-100 shadow-2xs flex flex-col items-center text-center">
                    <Feather className="w-5 h-5 text-[#064E3B]" />
                    <span className="text-[11px] font-bold text-gray-900 mt-1">Kashmiri Shawl</span>
                    <span className="text-[9px] text-gray-500">Pure Pashmina</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-gray-100 shadow-2xs flex flex-col items-center text-center">
                    <Gem className="w-5 h-5 text-[#FF7722]" />
                    <span className="text-[11px] font-bold text-gray-900 mt-1">Lac Chudha</span>
                    <span className="text-[9px] text-gray-500">24K Jadau Kundan</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-gray-100 shadow-2xs flex flex-col items-center text-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="text-[11px] font-bold text-gray-900 mt-1">24K Cosmetics</span>
                    <span className="text-[9px] text-gray-500">Bridal Radiance</span>
                  </div>
                </div>

                {/* Live Countdown Indication Blocks */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Deal Expires In:
                  </span>
                  <div className="flex gap-2.5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-white shadow-xs">
                      <span className="font-bold text-base sm:text-lg text-[#064E3B]">{timeLeft.days}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-semibold">days</span>
                    </div>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-white shadow-xs">
                      <span className="font-bold text-base sm:text-lg text-[#064E3B]">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-semibold">hours</span>
                    </div>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-white shadow-xs">
                      <span className="font-bold text-base sm:text-lg text-[#064E3B]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-semibold">mins</span>
                    </div>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 border border-amber-300 rounded-lg flex flex-col items-center justify-center bg-amber-50/50 shadow-xs">
                      <span className="font-bold text-base sm:text-lg text-[#FF7722]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-semibold">secs</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA Button */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-baseline gap-3">
                    <del className="text-lg sm:text-xl text-gray-400 font-semibold">₹ 3,999</del>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#064E3B] font-serif">₹ 1,999</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-[#064E3B] text-[11px] font-bold rounded uppercase">Save 50%</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      document.getElementById('new-arrivals-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span>Claim Bridal Hamper</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Authentic Bridal & Winter Hamper 3-in-1 Visual */}
              <div className="lg:col-span-7 flex items-center justify-center relative">
                <div className="relative w-full max-w-xl group">
                  <img
                    src="/images/e-commerce/home/promo.png"
                    alt="Sikar Season Authentic Bridal & Winter Hamper (Kashmiri Pashmina, Rajasthani Lac Chuda, 24K Bridal Cosmetics)"
                    className="w-full h-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. TOP SELLING PRODUCTS (Sikar Season Shop Royal Collections)  */}
        {/* ============================================================== */}
        <section id="top-selling-section" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-serif">
              Top Selling Products
            </h2>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Experience handcrafted Rajasthani heritage bangles, pure Kashmiri pashmina, and luxury bridal essentials curated exclusively by Sikar Season Shop.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Big Full-Height Card: top1.jpg (Royal Bridal Bangles) */}
            <div
              onClick={() => onQuickView(products[12] || products[1])}
              className="lg:col-span-6 min-h-[440px] rounded-2xl bg-cover bg-center p-8 md:p-12 flex flex-col justify-start cursor-pointer transition-transform duration-300 hover:scale-[1.01] shadow-sm relative group overflow-hidden"
              style={{ backgroundImage: `url('/images/e-commerce/home/top1.jpg')` }}
            >
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF7722]">Heritage Craft</span>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-serif">ROYAL BRIDAL BANGLES</h3>
                <div className="w-10 h-1 bg-[#064E3B] rounded my-2" />
                <p className="text-xs font-semibold text-gray-600">Save up to 40% on Handcrafted Lac Sets</p>
              </div>
            </div>

            {/* Right 4 Banner Tiles Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* top2.jpg: Kashmiri Pashmina Shawls */}
              <div
                onClick={() => onQuickView(products[60] || products[2])}
                className="h-[210px] rounded-2xl bg-cover bg-center p-6 flex flex-col justify-between text-right cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                style={{ backgroundImage: `url('/images/e-commerce/home/top2.jpg')` }}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">Kashmiri Pashmina</h4>
                  <p className="text-xs font-bold text-gray-900 underline mt-1">explore shawls</p>
                </div>
              </div>

              {/* top4.jpg: Winter Thermals & Socks */}
              <div
                onClick={() => onQuickView(products[24] || products[3])}
                className="h-[210px] rounded-2xl bg-cover bg-center p-6 flex flex-col justify-end cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                style={{ backgroundImage: `url('/images/e-commerce/home/top4.jpg')` }}
              >
                <span className="self-start px-3 py-1 bg-gray-900/80 text-white text-[11px] font-bold uppercase tracking-wider rounded">
                  Winter Thermals &amp; Socks
                </span>
              </div>

              {/* top3.jpg: Luxury 24K Gold Cosmetics */}
              <div
                onClick={() => onQuickView(products[0])}
                className="h-[210px] rounded-2xl bg-cover bg-center p-6 flex flex-col justify-end cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                style={{ backgroundImage: `url('/images/e-commerce/home/top3.jpg')` }}
              >
                <span className="self-start px-3 py-1 bg-[#FF7722] text-white text-[11px] font-bold uppercase tracking-wider rounded">
                  70% FESTIVE SALE
                </span>
              </div>

              {/* top5.jpg: Handcrafted Brass Idols & Gifts */}
              <div
                onClick={() => onQuickView(products[48] || products[5])}
                className="h-[210px] rounded-2xl bg-cover bg-center p-6 flex flex-col justify-center text-center cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                style={{ backgroundImage: `url('/images/e-commerce/home/top5.jpg')` }}
              >
                <div className="w-8 h-0.5 bg-[#064E3B] mx-auto mb-1" />
                <p className="text-[11px] text-gray-700 uppercase tracking-widest">Handcrafted</p>
                <h4 className="text-base font-black text-[#064E3B] uppercase tracking-wider font-serif">BRASS IDOLS</h4>
                <div className="w-8 h-0.5 bg-[#064E3B] mx-auto mt-1" />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. INFOBLOCK (Sikar Season Shop Service Commitments)           */}
        {/* ============================================================== */}
        <section className="border-y border-gray-200 py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <img src="/images/e-commerce/home/car.svg" alt="Free Shipping" className="w-10 h-10 object-contain" />
              <div>
                <h4 className="text-xs md:text-sm font-bold uppercase text-gray-900 tracking-wider">Free Shipping</h4>
                <p className="text-xs text-gray-500">On all orders above ₹499 across Sikar &amp; Rajasthan</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <img src="/images/e-commerce/home/headphones.svg" alt="24/7 Support" className="w-10 h-10 object-contain" />
              <div>
                <h4 className="text-xs md:text-sm font-bold uppercase text-gray-900 tracking-wider">Store Support</h4>
                <p className="text-xs text-gray-500">Pooja Sharma (9602172335) • Priyanshu (+91 8306447955)</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <img src="/images/e-commerce/home/Sync.svg" alt="100% Money Back" className="w-10 h-10 object-contain" />
              <div>
                <h4 className="text-xs md:text-sm font-bold uppercase text-gray-900 tracking-wider">100% Authentic Quality</h4>
                <p className="text-xs text-gray-500">Guaranteed genuine heritage products &amp; instant exchange</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. FROM OUR BLOGS (Sikar Season Shop Heritage & Style Journals)*/}
        {/* ============================================================== */}
        <section id="blogs" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-serif">
              From Our Blogs
            </h2>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Stories of traditional Rajasthani craftsmanship, authentic Kashmiri looms, and natural bridal beauty wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full aspect-4/3 rounded-xl overflow-hidden mb-4">
                <img
                  src="/images/e-commerce/home/article1.jpg"
                  alt="The Art of Rajasthani Lac Chudha"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs text-gray-400">Heritage &amp; Culture</span>
              <h4 className="font-bold text-base text-gray-900 mt-1 mb-2 font-serif group-hover:text-[#064E3B] transition-colors">
                The Art of Rajasthani Lac Chudha: Handcrafting Royal Elegance
              </h4>
              <span className="text-xs font-bold text-[#FF7722] group-hover:underline">
                Read More
              </span>
            </div>

            {/* Article 2 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full aspect-4/3 rounded-xl overflow-hidden mb-4">
                <img
                  src="/images/e-commerce/home/article2.jpg"
                  alt="How to Identify Pure Kashmiri Pashmina"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs text-gray-400">Fabrics &amp; Weaving</span>
              <h4 className="font-bold text-base text-gray-900 mt-1 mb-2 font-serif group-hover:text-[#064E3B] transition-colors">
                How to Identify Pure Kashmiri Pashmina: The Weaver's Test
              </h4>
              <span className="text-xs font-bold text-[#FF7722] group-hover:underline">
                Read More
              </span>
            </div>

            {/* Article 3 */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full aspect-4/3 rounded-xl overflow-hidden mb-4">
                <img
                  src="/images/e-commerce/home/article3.jpg"
                  alt="Winter Bridal Glow with Kumkumadi Saffron"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs text-gray-400">Beauty &amp; Radiance</span>
              <h4 className="font-bold text-base text-gray-900 mt-1 mb-2 font-serif group-hover:text-[#064E3B] transition-colors">
                Winter Bridal Glow: Ancient Ayurvedic Kumkumadi Saffron Secrets
              </h4>
              <span className="text-xs font-bold text-[#FF7722] group-hover:underline">
                Read More
              </span>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="px-8 py-3 border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 text-xs font-bold uppercase tracking-widest transition-colors">
              View More
            </button>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 9. FOLLOW US ON INSTAGRAM (Exact 6-Column Grid)                 */}
        {/* ============================================================== */}
        <section className="pt-10 pb-16">
          <h3 className="text-center font-bold text-xl md:text-2xl text-gray-900 mb-8 font-serif">
            Follow us on Instagram
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-0">
            {['insta1.jpg', 'insta2.jpg', 'insta3.jpg', 'insta4.jpg', 'insta5.jpg', 'insta6.jpg'].map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden group cursor-pointer">
                <img
                  src={`/images/e-commerce/home/${img}`}
                  alt="Instagram Feed"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10. SIKAR SEASON SHOP FOOTER & MALL FRANCHISE STORE DETAILS   */}
        {/* ============================================================== */}
        <footer id="contact" className="bg-[#1F2937] text-white pt-16 pb-8 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Newsletter Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-gray-700">
              <div className="lg:col-span-5">
                <h4 className="text-base font-bold text-white mb-2">Subscribe to Sikar Season Newsletter</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Stay updated with exclusive wedding season offers, bridal collection launches, and festival specials directly in your inbox.
                </p>
              </div>

              <div className="lg:col-span-7 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white text-gray-900 text-xs rounded-none focus:outline-none"
                />
                <button className="px-8 py-3 bg-[#FF7722] hover:bg-[#D95305] text-white text-xs font-bold uppercase tracking-wider transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-gray-700 text-xs text-gray-400">
              {/* Brand info */}
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#064E3B] text-[#FF7722] font-serif font-black text-xs flex items-center justify-center border border-[#FF7722]">
                    SSS
                  </div>
                  <span className="font-serif font-black text-2xl tracking-tight text-white">
                    SIKAR SEASON<span className="text-[#FF7722]">.</span>
                  </span>
                </div>
                <p className="leading-relaxed">
                  Official retail storefront and mall franchise billing platform for <strong>{storeInfo.name}</strong>. Delivering handcrafted Rajasthani bridal bangles, luxury cosmetics, pure Kashmiri pashmina, socks, unisex undergarments, and artisan brass showpieces.
                </p>
                <div className="pt-2 text-white font-medium space-y-1">
                  <p>Pooja Sharma (Owner): <strong>{storeInfo.ownerPhone}</strong></p>
                  <p>Priyanshu Sharma: <strong>{storeInfo.managerPhone}</strong></p>
                  <p>Email: <strong>{storeInfo.email}</strong></p>
                </div>
              </div>

              {/* Company */}
              <div className="md:col-span-2 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-3">Company</h5>
                <p className="hover:text-white cursor-pointer">About Sikar Season</p>
                <p className="hover:text-white cursor-pointer">Heritage Craft</p>
                <p className="hover:text-white cursor-pointer">Latest Journals</p>
                <p className="hover:text-white cursor-pointer">FAQs</p>
              </div>

              {/* My Account */}
              <div className="md:col-span-2 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-3">My Account</h5>
                <p className="hover:text-white cursor-pointer">Customer Login</p>
                <p onClick={onOpenCart} className="hover:text-white cursor-pointer">View Shopping Bag</p>
                <p className="hover:text-white cursor-pointer">Order Tracking</p>
                <p className="hover:text-white cursor-pointer">Help &amp; Support</p>
              </div>

              {/* Customer Service */}
              <div className="md:col-span-4 space-y-2.5">
                <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-3">Store &amp; POS Location</h5>
                <p className="hover:text-white cursor-pointer">Station Road, Main Market, Sikar, Rajasthan - 332001</p>
                <p className="hover:text-white cursor-pointer">GSTIN: {storeInfo.gstin}</p>
                <p className="hover:text-white cursor-pointer">Store Hours: Mon – Sun: 09:30 AM – 10:00 PM</p>
                <button
                  onClick={onSwitchToPos}
                  className="mt-3 px-4 py-2 bg-[#064E3B] hover:bg-[#043828] text-white text-xs font-bold rounded-lg flex items-center gap-2"
                >
                  <Store className="w-3.5 h-3.5 text-[#FF7722]" />
                  Launch Mall Franchise POS
                </button>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-6 flex flex-wrap items-center justify-between text-xs text-gray-500">
              <p>© {new Date().getFullYear()} SIKAR SEASON SHOP. All Rights Reserved. Owner: Pooja Sharma ({storeInfo.ownerPhone})</p>
              <div className="flex gap-4">
                <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
                <span>•</span>
                <span className="hover:text-gray-300 cursor-pointer">Terms &amp; GST Compliance</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
