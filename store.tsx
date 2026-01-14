
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, CartItem, Order, OrderStatus, Notification, SupportTicket, Coupon, AuditLog } from './types';
import { PRODUCTS, MOCK_USERS } from './db';

interface AppContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, variantId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (address: string, timeSlot: string, paymentMethod: any) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  tickets: SupportTicket[];
  addTicket: (subject: string) => void;
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string) => void;
  language: 'EN' | 'UR';
  setLanguage: (l: 'EN' | 'UR') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [coupons] = useState<Coupon[]>([
    { code: 'FRESH20', discount: 20, type: 'PERCENTAGE', minCart: 30 },
    { code: 'SAVE10', discount: 10, type: 'FIXED', minCart: 50 },
  ]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [language, setLanguage] = useState<'EN' | 'UR'>('EN');

  const login = (role: UserRole) => {
    const foundUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[1];
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product, variantId?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.variantId === variantId);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, variantId, substitutionPreference: 'REPLACE_NEAREST' }];
    });
    addNotification({ title: 'Added to Cart', message: `${product.name} added.`, type: 'SYSTEM' });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const addNotification = (n: Omit<Notification, 'id' | 'time' | 'read'>) => {
    setNotifications(prev => [{
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      read: false
    }, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addTicket = (subject: string) => {
    if (!user) return;
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      subject,
      status: 'OPEN',
      priority: 'MEDIUM',
      createdAt: new Date().toISOString(),
      messages: [{ role: 'USER', text: subject, time: new Date().toLocaleTimeString() }]
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      setActiveCoupon(coupon);
      return true;
    }
    return false;
  };

  const placeOrder = (address: string, timeSlot: string, paymentMethod: any) => {
    if (!user) return;
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      userId: user.id,
      items: [...cart],
      total: subtotal + 2 - (activeCoupon ? (activeCoupon.type === 'PERCENTAGE' ? (subtotal * activeCoupon.discount / 100) : activeCoupon.discount) : 0),
      status: OrderStatus.PLACED,
      date: new Date().toISOString(),
      address,
      timeSlot,
      paymentMethod
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveCoupon(null);
    addNotification({ title: 'Order Placed!', message: `Your order ${newOrder.id} is confirmed.`, type: 'ORDER' });
    // Update Loyalty Points (10% of total)
    setUser(prev => prev ? { ...prev, loyaltyPoints: prev.loyaltyPoints + Math.floor(newOrder.total) } : null);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status } : order))
    );
    addNotification({ title: 'Order Update', message: `Order ${orderId} is now ${status}.`, type: 'ORDER' });
  };

  const addAuditLog = (action: string, target: string) => {
    if (!user) return;
    setAuditLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      adminId: user.id,
      action,
      target,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user, login, logout, cart, addToCart, removeFromCart, updateCartQuantity,
        clearCart, orders, placeOrder, updateOrderStatus, products, setProducts,
        wishlist, toggleWishlist, notifications, addNotification, markNotificationRead,
        tickets, addTicket, coupons, activeCoupon, applyCoupon, auditLogs, addAuditLog,
        language, setLanguage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
