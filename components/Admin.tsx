
import React, { useState } from 'react';
import { useAppContext } from '../store';
import { OrderStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { products, orders, updateOrderStatus, logout, coupons, tickets, auditLogs } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'coupons' | 'support' | 'audit'>('overview');

  const stats = [
    { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, color: 'text-green-600' },
    { label: 'Total Orders', value: orders.length, color: 'text-blue-600' },
    { label: 'Avg Order Value', value: `$${(orders.length ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0).toFixed(2)}`, color: 'text-purple-600' },
    { label: 'Active Support', value: tickets.filter(t => t.status === 'OPEN').length, color: 'text-orange-600' },
  ];

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-green-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white">F</div>
          <span className="text-xl font-bold text-white">FreshMart Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Dashboard" icon="📊" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} label="Orders" icon="📦" />
          <SidebarLink active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} label="Inventory" icon="📋" />
          <SidebarLink active={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')} label="Coupons" icon="🏷️" />
          <SidebarLink active={activeTab === 'support'} onClick={() => setActiveTab('support')} label="Support" icon="💬" />
          <SidebarLink active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} label="Audit Logs" icon="🛡️" />
          <SidebarLink active={false} onClick={() => {}} label="Settings" icon="⚙️" />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center space-x-3 w-full p-2 hover:bg-slate-800 rounded-lg text-red-400">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h1>
            <p className="text-slate-500 font-medium text-sm">Real-time store management console</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
              Bulk Import
            </button>
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
              + Add Product
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-black mb-8">Revenue Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="sales" fill="#16a34a" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-black mb-6">Recent Tickets</h3>
                <div className="space-y-4">
                  {tickets.map(t => (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-400">#{t.id}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${t.status === 'OPEN' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{t.status}</span>
                       </div>
                       <p className="text-sm font-bold text-slate-800">{t.subject}</p>
                       <p className="text-[10px] text-slate-400 mt-2">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {tickets.length === 0 && <p className="text-center py-10 opacity-30 italic">No tickets</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b">
                   <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y">
                   {orders.map(o => (
                     <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-black text-slate-900 leading-none">#{o.id}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-1">${o.total.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-bold">John Customer</p>
                           <p className="text-[10px] text-slate-400 truncate w-32">{o.address}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs font-bold text-slate-500">{new Date(o.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                           <select 
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-white border text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest"
                           >
                             {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </td>
                        <td className="px-6 py-4">
                           <button className="text-blue-500 font-black text-[10px] uppercase hover:underline">Details</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {coupons.map(c => (
               <div key={c.code} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-green-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <h4 className="text-2xl font-black text-slate-900 mb-1">{c.code}</h4>
                  <p className="text-sm font-bold text-green-600">{c.type === 'PERCENTAGE' ? `${c.discount}% Off` : `$${c.discount} Flat`}</p>
                  <div className="mt-4 flex justify-between items-center pt-4 border-t border-dashed">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Min Cart: ${c.minCart}</span>
                     <button className="text-red-500 text-[10px] font-black uppercase">Delete</button>
                  </div>
               </div>
             ))}
             <button className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-green-500 hover:text-green-500 transition-all">
                <span className="text-2xl mb-1">+</span>
                <span className="text-[10px] font-black uppercase">Create Coupon</span>
             </button>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
             {auditLogs.map(log => (
               <div key={log.id} className="flex items-center justify-between text-sm py-3 border-b border-slate-50">
                  <div>
                    <span className="font-black text-slate-900 mr-2">{log.action}</span>
                    <span className="text-slate-400">on {log.target}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{new Date(log.timestamp).toLocaleString()}</span>
               </div>
             ))}
             {auditLogs.length === 0 && <p className="text-center py-20 opacity-30 italic">No activity logs recorded yet.</p>}
          </div>
        )}
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ active: boolean; label: string; icon: string; onClick: () => void }> = ({ active, label, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
      active ? 'bg-green-600 text-white shadow-xl shadow-green-900/40' : 'hover:bg-slate-800'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default AdminDashboard;
