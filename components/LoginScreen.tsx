
import React, { useState } from 'react';
import { useAppContext } from '../store';
import { UserRole } from '../types';

const LoginScreen: React.FC = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    { label: 'Customer', role: UserRole.CUSTOMER, icon: '🛒' },
    { label: 'Admin', role: UserRole.ADMIN, icon: '⚙️' },
    { label: 'Delivery Partner', role: UserRole.DELIVERY_PARTNER, icon: '🛵' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-2">FreshMart Pro</h1>
          <p className="text-slate-500">Quality groceries at your doorstep</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => login(UserRole.CUSTOMER)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500 uppercase">Or log in as</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => login(r.role)}
              className="flex items-center justify-between px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{r.icon}</span>
                <span className="font-medium text-slate-700">{r.label}</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500">
          New here? <span className="text-green-600 font-semibold cursor-pointer">Create an account</span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
