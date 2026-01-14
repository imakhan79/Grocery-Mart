
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STORE_MANAGER = 'STORE_MANAGER',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
  SUPPORT_AGENT = 'SUPPORT_AGENT'
}

export enum OrderStatus {
  PLACED = 'PLACED',
  PACKED = 'PACKED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  loyaltyPoints: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Standard", "Value Pack"
  unit: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subCategory: string;
  brand: string;
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  dietary: string[];
  variants?: ProductVariant[];
  nutrition?: {
    calories: string;
    fat: string;
    protein: string;
    carbs: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  variantId?: string;
  substitutionPreference: 'REFUND' | 'REPLACE_NEAREST' | 'CONTACT';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
  deliveryPartnerId?: string;
  timeSlot?: string;
  paymentMethod: 'COD' | 'CARD' | 'WALLET';
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'ORDER' | 'PROMO' | 'SYSTEM';
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  messages: { role: 'USER' | 'AGENT'; text: string; time: string }[];
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  minCart: number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  target: string;
  timestamp: string;
}
