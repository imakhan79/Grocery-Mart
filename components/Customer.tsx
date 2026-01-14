
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store';
import { CATEGORIES } from '../db';
import { Product, OrderStatus } from '../types';
import { GoogleGenAI } from "@google/genai";

const CustomerPortal: React.FC = () => {
  const { 
    products, cart, addToCart, logout, placeOrder, orders, user, 
    wishlist, toggleWishlist, notifications, markNotificationRead,
    activeCoupon, applyCoupon, addTicket, language, setLanguage 
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
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Multi-language & Profile Header */}
      <div className="bg-slate-900 text-white text-[10px] px-4 py-1 flex justify-between items-center">
        <div className="flex space-x-4">
          <button onClick={() => setLanguage('EN')} className={language === 'EN' ? 'font-bold underline' : ''}>EN</button>
          <button onClick={() => setLanguage('UR')} className={language === 'UR' ? 'font-bold underline' : ''}>اردو</button>
        </div>
        <div className="flex items-center space-x-2">
          <span>🌟 {user?.loyaltyPoints} Points</span>
          <span className="opacity-50">|</span>
          <span>Delivery to: 123 Green Valley</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 text-white p-2 rounded-xl shadow-lg shadow-green-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight hidden sm:inline">FreshMart</span>
        </div>
        
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative group">
            <input
              type="text"
              placeholder={language === 'EN' ? "Search for fresh produce..." : "تازہ اشیاء تلاش کریں..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all focus:bg-white border border-transparent focus:border-slate-200"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-3">
          <HeaderIcon active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<BellIcon />} badge={notifications.filter(n => !n.read).length} />
          <HeaderIcon active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} icon={<HeartIcon />} />
          <button onClick={() => setActiveTab('profile')} className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-50 hover:border-green-500 transition-colors">
            <img src="https://ui-avatars.com/api/?name=John+Customer&background=random" alt="user" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Flash Sale Banner */}
            <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl group">
               <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="banner" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 md:p-12">
                  <div className="text-white space-y-3 md:space-y-4 max-w-md">
                    <span className="inline-block bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Flash Sale • 02:45:10 left</span>
                    <h2 className="text-3xl md:text-5xl font-black leading-tight">Weekend Organic Extravaganza</h2>
                    <p className="text-slate-200 text-sm md:text-base">Get up to 40% off on all organic certified produce.</p>
                    <button className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">Shop Deals</button>
                  </div>
               </div>
            </div>

            {/* Categories Horizontal Scroll */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                <span>Explores Categories</span>
              </h3>
              <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex-shrink-0 w-24 md:w-32 group cursor-pointer text-center space-y-3">
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-white group-hover:border-green-500 group-hover:shadow-xl transition-all shadow-md">
                      <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 block truncate uppercase tracking-tighter">{cat.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Grid */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Recommended for You</h3>
                <div className="flex bg-slate-200 p-1 rounded-lg">
                  <button className="px-3 py-1 bg-white rounded shadow text-xs font-bold">Trending</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-500">New Arrivals</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map(product => (
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

        {activeTab === 'notifications' && (
          <div className="max-w-2xl mx-auto space-y-4">
             <h2 className="text-2xl font-bold mb-6">Notifications</h2>
             {notifications.length === 0 ? (
               <p className="text-center text-slate-400 py-20">No new updates.</p>
             ) : (
               notifications.map(n => (
                 <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`p-4 rounded-2xl border transition-all cursor-pointer ${n.read ? 'bg-white border-slate-100 opacity-60' : 'bg-green-50 border-green-100 shadow-sm'}`}>
                   <div className="flex justify-between items-start">
                     <h4 className="font-bold text-slate-800">{n.title}</h4>
                     <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                   </div>
                   <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold">Shopping Basket ({cart.length})</h2>
              {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed">
                  <span className="text-6xl block mb-4">🧺</span>
                  <p className="text-slate-500 font-medium">Your basket is empty</p>
                  <button onClick={() => setActiveTab('home')} className="mt-4 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-100">Browse Shop</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
                      <img src={item.product.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-slate-800">{item.product.name}</h4>
                          <span className="text-green-600 font-black">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{item.product.unit} • Substitution: {item.substitutionPreference}</p>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => addToCart(item.product)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold">+</button>
                          <span className="font-bold">{item.quantity}</span>
                          <button onClick={() => addToCart(item.product)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold">-</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200 border border-slate-50 space-y-6 sticky top-24">
                <h3 className="font-bold text-lg">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Delivery Fee</span>
                    <span>$2.00</span>
                  </div>
                  {activeCoupon && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Discount ({activeCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black border-t border-dashed pt-4">
                    <span>Total</span>
                    <span className="text-green-600">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none" 
                    />
                    <button 
                      onClick={() => applyCoupon(couponInput)}
                      className="absolute right-2 top-2 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg"
                    >Apply</button>
                  </div>
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border">
                 <p className="text-slate-400">No orders yet.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
                   <div className="flex justify-between items-center border-b pb-4">
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase">Order ID</p>
                         <p className="font-mono text-lg font-bold">#{order.id}</p>
                      </div>
                      <StatusBadge status={order.status} />
                   </div>
                   {/* Tracking progress bar */}
                   <div className="py-2">
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000`} style={{
                          width: order.status === 'PLACED' ? '25%' : order.status === 'PACKED' ? '50%' : order.status === 'OUT_FOR_DELIVERY' ? '75%' : '100%'
                        }}></div>
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                        <span>PLACED</span>
                        <span>PACKED</span>
                        <span>ON WAY</span>
                        <span>DONE</span>
                      </div>
                   </div>
                   <div className="text-sm text-slate-600">
                      {order.items.map(i => i.product.name).join(', ')}
                   </div>
                   <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-black text-slate-900">${order.total.toFixed(2)}</span>
                      <button className="text-green-600 text-sm font-bold border-2 border-green-500 px-4 py-1.5 rounded-full hover:bg-green-50 transition-colors">Track Order</button>
                   </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="relative h-64 md:h-full min-h-[400px]">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
               <div className="p-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{selectedProduct.brand}</span>
                    <h2 className="text-3xl font-black text-slate-900">{selectedProduct.name}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                       <div className="flex text-orange-400">
                          {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                       </div>
                       <span className="text-xs text-slate-400 font-bold">({selectedProduct.reviewsCount} Reviews)</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Nutrition Information (per serving)</h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                       <NutritionItem label="Cal" val={selectedProduct.nutrition?.calories || '0'} />
                       <NutritionItem label="Fat" val={selectedProduct.nutrition?.fat || '0g'} />
                       <NutritionItem label="Prot" val={selectedProduct.nutrition?.protein || '0g'} />
                       <NutritionItem label="Carbs" val={selectedProduct.nutrition?.carbs || '0g'} />
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{selectedProduct.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="space-y-1">
                      <span className="text-slate-400 text-sm font-bold">Price per unit</span>
                      <p className="text-3xl font-black text-green-600">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-green-100 transform active:scale-95 transition-all"
                    >
                      Add to Basket
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Overlay Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 space-y-8 animate-in zoom-in duration-200">
             <div className="flex justify-between items-center">
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">Checkout</h2>
               <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-800">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Time Slot</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-bold text-slate-800 appearance-none">
                     <option>ASAP (Within 30 mins)</option>
                     <option>Today: 04:00 PM - 06:00 PM</option>
                     <option>Tomorrow: 09:00 AM - 11:00 AM</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method</label>
                  <div className="grid grid-cols-3 gap-3">
                     <PaymentButton active label="COD" icon="💵" />
                     <PaymentButton label="Card" icon="💳" />
                     <PaymentButton label="Wallet" icon="📱" />
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="opacity-60 font-bold uppercase text-[10px]">Grand Total</span>
                      <span className="text-2xl font-black text-green-400">${cartTotal.toFixed(2)}</span>
                   </div>
                   <button 
                    onClick={() => { placeOrder("123 Green Valley, Apartment 4B", "ASAP", "COD"); setShowCheckout(false); setActiveTab('orders'); }}
                    className="w-full bg-green-500 text-slate-900 py-4 rounded-xl font-black hover:bg-green-400 transition-all active:scale-95 shadow-lg shadow-green-500/20"
                   >
                     Confirm & Pay
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* AI Assistant FAB */}
      <button 
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition-transform active:scale-95"
      >
        <span className="text-2xl">{aiChatOpen ? '✕' : '🤖'}</span>
      </button>

      {/* AI Chat Window */}
      {aiChatOpen && (
        <div className="fixed bottom-40 right-6 md:bottom-28 md:right-10 w-[90vw] md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
           <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                 <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">✨</div>
                 <div>
                    <h4 className="font-bold text-sm">FreshMart AI Assistant</h4>
                    <p className="text-[10px] opacity-60">Online & Ready to Help</p>
                 </div>
              </div>
           </div>
           <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 no-scrollbar">
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white border text-slate-800 rounded-bl-none shadow-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiMessages.length === 0 && (
                <div className="text-center py-10 opacity-40 italic text-sm">Ask me for a healthy salad recipe!</div>
              )}
           </div>
           <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                  placeholder="Type a message..." 
                  className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                />
                <button onClick={handleAiChat} className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">➤</button>
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around md:hidden z-40">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Home" icon={<HomeIcon />} />
        <NavButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" icon={<OrderIcon />} />
        <div className="relative">
          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-14 h-14 -mt-10 bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-green-200 border-4 border-white transition-transform active:scale-90 ${activeTab === 'cart' ? 'scale-110' : ''}`}
          >
            <CartIcon />
          </button>
          {cart.length > 0 && <span className="absolute -top-10 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
        </div>
        <NavButton active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} label="Wishlist" icon={<HeartIcon />} />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Profile" icon={<UserIcon />} />
      </nav>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product; onAdd: () => void; onView: () => void; isWishlisted: boolean; onWishlist: () => void }> = ({ product, onAdd, onView, isWishlisted, onWishlist }) => (
  <div className="bg-white rounded-3xl border border-slate-50 shadow-sm overflow-hidden hover:shadow-2xl transition-all group relative">
    <button 
      onClick={onWishlist}
      className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500'}`}
    >
      <HeartIcon />
    </button>
    <div className="relative h-44 overflow-hidden cursor-pointer" onClick={onView}>
      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Quick View</span>
      </div>
    </div>
    <div className="p-4 space-y-2">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{product.brand}</p>
      <h4 className="text-sm font-black text-slate-800 line-clamp-1 leading-tight">{product.name}</h4>
      <div className="flex items-center space-x-2">
         <p className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{product.unit}</p>
         <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">${(product.price / 1).toFixed(2)}/kg</p>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <span className="text-xl font-black text-green-600 tracking-tighter">${product.price.toFixed(2)}</span>
        <button
          onClick={onAdd}
          className="bg-slate-900 hover:bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all transform hover:rotate-90 active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      </div>
    </div>
  </div>
);

const NutritionItem: React.FC<{label: string, val: string}> = ({label, val}) => (
  <div className="bg-white p-2 rounded-xl border border-slate-100">
    <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">{label}</p>
    <p className="text-sm font-black text-slate-800 leading-none">{val}</p>
  </div>
);

const PaymentButton: React.FC<{active?: boolean, label: string, icon: string}> = ({active, label, icon}) => (
  <button className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${active ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-slate-200'}`}>
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-[10px] font-black uppercase">{label}</span>
  </button>
);

const HeaderIcon: React.FC<{active?: boolean, onClick: () => void, icon: React.ReactNode, badge?: number}> = ({active, onClick, icon, badge}) => (
  <button onClick={onClick} className={`relative p-2.5 rounded-xl transition-all ${active ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-slate-400 hover:bg-slate-100'}`}>
    {icon}
    {badge ? <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{badge}</span> : null}
  </button>
);

const StatusBadge: React.FC<{status: string}> = ({status}) => {
  const styles = {
    [OrderStatus.PLACED]: 'bg-slate-100 text-slate-600',
    [OrderStatus.PACKED]: 'bg-blue-100 text-blue-600',
    [OrderStatus.OUT_FOR_DELIVERY]: 'bg-orange-100 text-orange-600',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-600',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-600',
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status as OrderStatus]}`}>{status}</span>;
};

const NavButton: React.FC<{ active: boolean; label: string; icon: React.ReactNode; onClick: () => void }> = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-all ${active ? 'text-green-600' : 'text-slate-300 hover:text-slate-400'}`}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const OrderIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const CartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const UserIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BellIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const HeartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

export default CustomerPortal;
