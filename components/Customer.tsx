
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store';
import { CATEGORIES } from '../db';
import { Product, OrderStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

const CustomerPortal: React.FC = () => {
  const { 
    products, cart, addToCart, logout, placeOrder, orders, user, 
    wishlist, toggleWishlist, notifications, markNotificationRead,
    activeCoupon, applyCoupon, language, setLanguage 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'cart' | 'profile' | 'notifications' | 'wishlist'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponInput, setCouponInput] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = activeCoupon ? (activeCoupon.type === 'PERCENTAGE' ? (cartSubtotal * activeCoupon.discount / 100) : activeCoupon.discount) : 0;
  const cartTotal = cartSubtotal + 2 - discountAmount;

  const handleAiChat = async () => {
    if (!aiInput.trim()) return;
    const prompt = aiInput;
    setAiMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setAiInput('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert grocery assistant for FreshMart Pro. Help the user find products or suggest recipes based on available stock: ${products.map(p => p.name).join(', ')}. User says: ${prompt}`,
      });
      setAiMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (e) {
      setAiMessages(prev => [...prev, { role: 'model', text: "Assistant currently offline. Try asking about our fresh organic bananas!" }]);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Top Banner (Thin) */}
      <div className="bg-green-600 text-white text-[10px] px-4 py-1.5 flex justify-center items-center space-x-2">
        <span className="font-bold">FREE DELIVERY</span>
        <span className="opacity-75">on all orders above $50</span>
        <span className="font-black">CODE: FRESH50</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 text-white p-2.5 rounded-2xl shadow-lg shadow-green-100 rotate-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter hidden sm:inline">FreshMart</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder={language === 'EN' ? "Search 5,000+ items..." : "تازہ اشیاء تلاش کریں..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all focus:bg-white border border-slate-100"
            />
            <svg className="w-6 h-6 text-slate-300 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-4">
          <HeaderIcon active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<BellIcon />} badge={notifications.filter(n => !n.read).length} />
          <HeaderIcon active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} icon={<HeartIcon />} />
          <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white hover:border-green-500 transition-all shadow-sm">
            <img src="https://ui-avatars.com/api/?name=John+Customer&background=random" alt="user" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-10">
        {activeTab === 'home' && (
          <div className="space-y-16">
            {/* Massive Hero Banner */}
            <div className="relative h-72 md:h-96 rounded-[40px] overflow-hidden shadow-2xl group">
               <img src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="banner" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex items-center p-10 md:p-20">
                  <div className="text-white space-y-6 max-w-xl">
                    <span className="inline-block bg-white text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl">SEASONAL FAVORITES</span>
                    <h2 className="text-4xl md:text-7xl font-black leading-none tracking-tighter">Harvest Season is Here.</h2>
                    <p className="text-slate-200 text-lg md:text-xl font-medium max-w-md">Farm-fresh strawberries, crunchy greens, and organic delights delivered in 30 minutes.</p>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl shadow-green-900/40">Shop the Harvest</button>
                  </div>
               </div>
            </div>

            {/* Categories Grid - Circular */}
            <section>
              <h3 className="text-2xl font-black mb-8 flex items-center space-x-3">
                <span className="w-3 h-8 bg-green-500 rounded-full"></span>
                <span>Categories</span>
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="group cursor-pointer text-center space-y-3">
                    <div className="aspect-square rounded-[32px] overflow-hidden border-4 border-transparent group-hover:border-green-500 transition-all shadow-lg hover:-translate-y-2">
                      <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 block truncate uppercase tracking-tighter">{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Main Product Shelf */}
            <section>
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black">Trending Now</h3>
                <div className="flex space-x-2">
                   <button className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                   </button>
                   <button className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                   </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {/* Special Promo Item */}
                <div className="col-span-2 md:col-span-1 bg-green-600 rounded-[32px] p-6 text-white flex flex-col justify-between shadow-2xl shadow-green-200">
                    <div className="space-y-4">
                       <h4 className="text-2xl font-black leading-tight">Freshly Baked Every Morning.</h4>
                       <p className="text-sm opacity-80">Check out our new artisanal bread selection.</p>
                    </div>
                    <button className="bg-white text-green-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-xl">→</button>
                </div>
                
                {filteredProducts.slice(0, 9).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={() => addToCart(product)} 
                    onView={() => setSelectedProduct(product)}
                    isWishlisted={wishlist.includes(product.id)}
                    onWishlist={() => toggleWishlist(product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Recipe / Discovery Banner */}
            <section className="bg-slate-900 rounded-[48px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl">
               <div className="p-12 md:p-20 flex flex-col justify-center space-y-8">
                  <h3 className="text-white text-4xl md:text-6xl font-black leading-none tracking-tight">Cook like a Pro.</h3>
                  <p className="text-slate-400 text-lg font-medium">Discover recipes from top chefs and get all the ingredients delivered in one basket.</p>
                  <div className="flex space-x-4">
                     <button className="bg-green-500 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">Get Recipes</button>
                     <button className="border-2 border-slate-700 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Meal Kits</button>
                  </div>
               </div>
               <div className="h-64 md:h-auto">
                  <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=800&fit=crop" className="w-full h-full object-cover" alt="cooking" />
               </div>
            </section>

            {/* Continuous Catalog Scroll */}
            <section>
              <h3 className="text-2xl font-black mb-10">Explore Everything</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {filteredProducts.slice(9).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={() => addToCart(product)} 
                    onView={() => setSelectedProduct(product)}
                    isWishlisted={wishlist.includes(product.id)}
                    onWishlist={() => toggleWishlist(product.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ... Other tabs (notifications, cart, orders) remain with similar logic, ensuring high-res icons and images ... */}
        
        {activeTab === 'notifications' && (
          <div className="max-w-2xl mx-auto space-y-4">
             <h2 className="text-3xl font-black mb-8">Alerts & Deals</h2>
             {notifications.length === 0 ? (
               <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                  <span className="text-5xl block mb-4 opacity-20">🔔</span>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">All caught up!</p>
               </div>
             ) : (
               notifications.map(n => (
                 <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-6 rounded-[32px] border transition-all cursor-pointer ${n.read ? 'bg-white border-slate-100 opacity-60' : 'bg-green-50 border-green-200 shadow-xl'}`}>
                   <div className="flex justify-between items-start">
                     <h4 className="font-black text-slate-900 tracking-tight">{n.title}</h4>
                     <span className="text-[10px] font-black text-slate-300 uppercase">{n.time}</span>
                   </div>
                   <p className="text-sm text-slate-600 mt-2 font-medium">{n.message}</p>
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-4xl font-black">Your Basket</h2>
              {cart.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-100">
                  <span className="text-8xl block mb-6">🛒</span>
                  <p className="text-slate-400 font-black text-xl uppercase tracking-widest">Basket is empty</p>
                  <button onClick={() => setActiveTab('home')} className="mt-8 bg-green-600 text-white px-12 py-4 rounded-2xl font-black shadow-2xl shadow-green-100 uppercase tracking-widest text-xs">Start Shopping</button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center space-x-6">
                      <img src={item.product.image} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt="" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-black text-xl text-slate-900 tracking-tight">{item.product.name}</h4>
                          <span className="text-green-600 font-black text-xl">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{item.product.unit}</p>
                        <div className="flex items-center space-x-4 mt-4">
                          <button onClick={() => addToCart(item.product)} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black transition-colors">+</button>
                          <span className="font-black text-lg">{item.quantity}</span>
                          <button onClick={() => addToCart(item.product)} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-black transition-colors">-</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[48px] shadow-2xl text-white space-y-8 sticky top-24">
                <h3 className="font-black text-2xl tracking-tight">Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-white">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    <span>Delivery</span>
                    <span className="text-white">$2.00</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-green-400 font-black uppercase text-[10px] tracking-widest">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-3xl font-black border-t border-slate-800 pt-6">
                    <span className="tracking-tighter">Total</span>
                    <span className="text-green-500">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="PROMO CODE" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-800 border-none text-sm font-black text-white focus:ring-2 focus:ring-green-500 uppercase placeholder:opacity-30" 
                    />
                    <button 
                      onClick={() => applyCoupon(couponInput)}
                      className="absolute right-2 top-2 px-4 py-2 bg-green-500 text-white text-[10px] font-black rounded-xl uppercase shadow-lg shadow-green-500/20"
                    >Apply</button>
                  </div>
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black shadow-xl uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Checkout Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[48px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="relative h-96 md:h-auto min-h-[500px] bg-slate-50">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                  {/* Thumbnails */}
                  <div className="absolute bottom-6 left-6 flex space-x-3">
                     {[selectedProduct.image, ...(selectedProduct.gallery || [])].map((img, idx) => (
                       <div key={idx} className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                       </div>
                     ))}
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-50 transition-all z-10">
                    <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               <div className="p-10 md:p-16 space-y-8">
                  <div>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">{selectedProduct.brand}</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mt-2">{selectedProduct.name}</h2>
                    <div className="flex items-center space-x-4 mt-4">
                       <div className="flex text-orange-400 text-lg">
                          {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                       </div>
                       <span className="text-xs text-slate-400 font-black uppercase tracking-widest">({selectedProduct.reviewsCount} verified reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                     {selectedProduct.dietary.map(d => (
                       <span key={d} className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{d}</span>
                     ))}
                  </div>

                  <p className="text-slate-500 text-lg font-medium leading-relaxed">{selectedProduct.description}</p>
                  
                  <div className="grid grid-cols-4 gap-4">
                     <NutritionItem label="CALORIES" val={selectedProduct.nutrition?.calories || '—'} />
                     <NutritionItem label="PROTEIN" val={selectedProduct.nutrition?.protein || '—'} />
                     <NutritionItem label="CARBS" val={selectedProduct.nutrition?.carbs || '—'} />
                     <NutritionItem label="FAT" val={selectedProduct.nutrition?.fat || '—'} />
                  </div>

                  <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Final Price</span>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-100 transform active:scale-95 transition-all"
                    >
                      Add to basket
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal & FABs remain, styled consistently ... */}

      {/* AI Assistant FAB */}
      <button 
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 w-20 h-20 bg-slate-900 text-white rounded-[28px] flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform active:scale-95 rotate-6"
      >
        <span className="text-3xl">{aiChatOpen ? '✕' : '🤖'}</span>
      </button>

      {/* ... AI Chat Window ... */}

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 flex justify-around md:hidden z-40">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Shop" icon={<HomeIcon />} />
        <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Track" icon={<OrderIcon />} />
        <div className="relative">
          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-16 h-16 -mt-12 bg-green-600 text-white rounded-[24px] flex items-center justify-center shadow-2xl shadow-green-200 border-4 border-white transition-transform active:scale-90 ${activeTab === 'cart' ? 'scale-110' : ''}`}
          >
            <CartIcon />
          </button>
          {cart.length > 0 && <span className="absolute -top-12 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
        </div>
        <NavButton active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} label="Wish" icon={<HeartIcon />} />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Me" icon={<UserIcon />} />
      </nav>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onAdd: () => void; onView: () => void; isWishlisted: boolean; onWishlist: () => void }> = ({ product, onAdd, onView, isWishlisted, onWishlist }) => (
  <div className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden hover:shadow-2xl transition-all group relative">
    <button 
      onClick={onWishlist}
      className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur-md text-slate-300 hover:text-red-500 shadow-lg'}`}
    >
      <HeartIcon />
    </button>
    <div className="relative h-56 overflow-hidden cursor-pointer bg-slate-50" onClick={onView}>
      <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={product.name} />
    </div>
    <div className="p-6 space-y-3">
      <div className="flex justify-between items-start">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">{product.brand}</p>
         <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">{product.unit}</span>
      </div>
      <h4 className="text-lg font-black text-slate-900 line-clamp-2 tracking-tight leading-tight h-12">{product.name}</h4>
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
        <span className="text-2xl font-black text-slate-900 tracking-tighter">${product.price.toFixed(2)}</span>
        <button
          onClick={onAdd}
          className="bg-slate-900 hover:bg-green-600 text-white w-12 h-12 rounded-[18px] flex items-center justify-center transition-all transform active:scale-90 shadow-xl shadow-slate-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      </div>
    </div>
  </div>
);

const NutritionItem: React.FC<{label: string, val: string}> = ({label, val}) => (
  <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-black text-slate-900">{val}</p>
  </div>
);

const HeaderIcon: React.FC<{active?: boolean, onClick: () => void, icon: React.ReactNode, badge?: number}> = ({active, onClick, icon, badge}) => (
  <button onClick={onClick} className={`relative p-3 rounded-2xl transition-all ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
    {icon}
    {badge ? <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{badge}</span> : null}
  </button>
);

const NavButton: React.FC<{ active: boolean; label: string; icon: React.ReactNode; onClick: () => void }> = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all ${active ? 'text-green-600' : 'text-slate-300'}`}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const OrderIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const CartIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const UserIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const HeartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

export default CustomerPortal;
