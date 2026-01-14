
import React, { useState } from 'react';
import { useAppContext } from '../store';
import { OrderStatus } from '../types';

const PartnerPortal: React.FC = () => {
  const { orders, updateOrderStatus, logout } = useAppContext();
  const [isOnline, setIsOnline] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [onboarded, setOnboarded] = useState(true);

  const availableOrders = orders.filter(o => o.status === OrderStatus.PLACED || o.status === OrderStatus.PACKED);
  const myTrips = orders.filter(o => o.status === OrderStatus.OUT_FOR_DELIVERY);

  if (!onboarded) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center justify-center space-y-8">
         <h1 className="text-3xl font-black text-center">Join FreshMart Delivery Team</h1>
         <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl space-y-6">
            <div className="border-2 border-dashed border-slate-600 p-8 rounded-2xl text-center">
               <span className="text-4xl block mb-2">📄</span>
               <p className="text-xs font-bold text-slate-400 uppercase">Upload License/ID</p>
            </div>
            <button onClick={() => setOnboarded(true)} className="w-full bg-green-500 text-slate-900 py-4 rounded-2xl font-black shadow-xl shadow-green-500/20">Submit Documents</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
      <header className="bg-slate-900 text-white p-6 md:p-10 rounded-b-[40px] shadow-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-black text-green-500 border-2 border-green-500">S</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Partner Portal</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Fleet Unit #72</p>
            </div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-white transition-colors">🚪</button>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-4 rounded-3xl flex items-center justify-between w-full md:w-auto md:min-w-[300px]">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
              <span className="font-black text-sm uppercase">{isOnline ? 'Live & Online' : 'Offline'}</span>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-8 py-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                isOnline ? 'bg-red-500/20 text-red-400' : 'bg-green-600 text-white'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
          
          <div onClick={() => setShowWallet(true)} className="bg-green-600 p-4 rounded-3xl flex items-center space-x-4 cursor-pointer hover:bg-green-500 transition-all w-full md:w-auto">
            <div className="text-2xl">💰</div>
            <div>
               <p className="text-[10px] font-black opacity-60 uppercase">Today's Earnings</p>
               <p className="text-xl font-black">$45.80</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 space-y-12">
        {!isOnline ? (
          <div className="text-center py-20 max-w-xs mx-auto space-y-4">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-4xl mx-auto">💤</div>
            <h2 className="text-2xl font-black text-slate-800">Relaxing?</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Toggle your status to online to start viewing delivery requests in your zone.</p>
          </div>
        ) : (
          <>
            {/* Active Trips */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center space-x-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                 <span>Active Missions</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTrips.map(order => (
                  <div key={order.id} className="bg-white rounded-[32px] shadow-2xl shadow-slate-200 border-2 border-green-500 overflow-hidden group">
                    <div className="p-6 bg-green-50 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                         <span className="bg-green-600 text-white p-2 rounded-xl text-xs font-black">ACTIVE</span>
                         <span className="font-black text-slate-900 text-lg">#{order.id}</span>
                      </div>
                      <span className="text-xs font-black text-green-700">2.1 km away</span>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">📍</div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dropoff Location</p>
                          <p className="text-slate-800 font-bold leading-snug mt-1">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">🛍️</div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Items</p>
                          <p className="text-slate-800 font-bold leading-snug mt-1">{order.items.length} Packages</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <button className="bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">Navigate</button>
                        <button
                          onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                          className="bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all shadow-green-100"
                        >
                          Confirm Done
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {myTrips.length === 0 && <div className="p-10 bg-white rounded-[32px] border-2 border-dashed text-center text-slate-300 font-black uppercase text-xs tracking-widest">No active deliveries</div>}
              </div>
            </section>

            {/* Market - New Requests */}
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Available Pool</h3>
              <div className="space-y-4">
                {availableOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center justify-between group hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-6">
                       <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400">#</div>
                       <div>
                          <p className="font-black text-slate-900 text-lg">Order {order.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.items.length} items • Earn $4.50 + Tips</p>
                       </div>
                    </div>
                    <button
                      onClick={() => updateOrderStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)}
                      className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all active:scale-95"
                    >
                      Accept
                    </button>
                  </div>
                ))}
                {availableOrders.length === 0 && <p className="text-slate-400 text-center py-10 italic">Scanning for new orders nearby...</p>}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[40px] p-8 space-y-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-black text-slate-800">Earnings Center</h2>
                 <button onClick={() => setShowWallet(false)} className="text-slate-400">✕</button>
              </div>
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-2">Total Wallet Balance</p>
                    <p className="text-5xl font-black">$1,245.00</p>
                    <button className="mt-8 w-full bg-white text-slate-900 py-4 rounded-2xl font-black shadow-xl">Withdraw Funds</button>
                 </div>
                 <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-green-500 rounded-full blur-3xl opacity-20"></div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h4>
                 {[1,2,3].map(i => (
                   <div key={i} className="flex justify-between py-3 border-b border-slate-50 text-sm">
                      <span className="font-bold text-slate-800">Trip Earning #ORD-9283</span>
                      <span className="font-black text-green-600">+$6.45</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav Partner */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around md:hidden z-40">
        <button className="text-green-600 flex flex-col items-center"><span className="text-xl">📊</span><span className="text-[9px] font-black uppercase mt-1">Pool</span></button>
        <button className="text-slate-300 flex flex-col items-center"><span className="text-xl">📅</span><span className="text-[9px] font-black uppercase mt-1">Schedule</span></button>
        <button onClick={() => setShowWallet(true)} className="text-slate-300 flex flex-col items-center"><span className="text-xl">💳</span><span className="text-[9px] font-black uppercase mt-1">Wallet</span></button>
      </nav>
    </div>
  );
};

export default PartnerPortal;
