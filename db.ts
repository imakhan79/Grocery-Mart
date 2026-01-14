
import { Product, Category, User, UserRole } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Fruits & Veg', slug: 'fruits-veg', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop' },
  { id: '2', name: 'Dairy & Eggs', slug: 'dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553ad?w=200&h=200&fit=crop' },
  { id: '3', name: 'Bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop' },
  { id: '4', name: 'Meat & Seafood', slug: 'meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc822?w=200&h=200&fit=crop' },
  { id: '5', name: 'Pantry', slug: 'pantry', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop' },
  { id: '6', name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=200&h=200&fit=crop' },
  { id: '7', name: 'Snacks', slug: 'snacks', image: 'https://images.unsplash.com/photo-1599490659223-e15392d536d3?w=200&h=200&fit=crop' },
  { id: '8', name: 'Organic', slug: 'organic', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
];

export const PRODUCTS: Product[] = [
  { 
    id: 'p1', name: 'Organic Bananas', description: 'Fresh organic bananas from sustainable farms.', price: 2.99, unit: '1kg', category: 'Fruits & Veg', subCategory: 'Fruits', brand: 'NatureFirst', image: 'https://images.unsplash.com/photo-1571771894821-ad9b58866602?w=300&h=300&fit=crop', stock: 150, rating: 4.8, reviewsCount: 120, tags: ['fresh', 'popular'], dietary: ['vegan'],
    nutrition: { calories: '89', fat: '0.3g', protein: '1.1g', carbs: '23g' },
    variants: [
      { id: 'v1', name: 'Standard', unit: '1kg', price: 2.99, stock: 100 },
      { id: 'v2', name: 'Value Pack', unit: '5kg', price: 12.99, stock: 50 }
    ]
  },
  { id: 'p2', name: 'Whole Milk', description: 'Creamy full fat pasteurized milk.', price: 1.50, unit: '1L', category: 'Dairy & Eggs', subCategory: 'Dairy', brand: 'FarmFresh', image: 'https://images.unsplash.com/photo-1563636619-e910019335bd?w=300&h=300&fit=crop', stock: 80, rating: 4.5, reviewsCount: 85, tags: ['daily'], dietary: ['halal'] },
  { id: 'p3', name: 'Sourdough Bread', description: 'Artisanal sourdough baked daily.', price: 4.25, unit: '1 Loaf', category: 'Bakery', subCategory: 'Breads', brand: 'DailyBake', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=300&h=300&fit=crop', stock: 25, rating: 4.9, reviewsCount: 45, tags: ['artisan'], dietary: ['vegan'] },
  { id: 'p4', name: 'Chicken Breast', description: 'Skinless boneless chicken breast.', price: 8.99, unit: '500g', category: 'Meat & Seafood', subCategory: 'Poultry', brand: 'PrimeCuts', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=300&fit=crop', stock: 40, rating: 4.6, reviewsCount: 60, tags: ['protein'], dietary: ['halal'] },
  { id: 'p5', name: 'Extra Virgin Olive Oil', description: 'Cold-pressed premium olive oil.', price: 12.99, unit: '500ml', category: 'Pantry', subCategory: 'Oils', brand: 'MedGold', image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc8d0f?w=300&h=300&fit=crop', stock: 100, rating: 4.7, reviewsCount: 30, tags: ['imported'], dietary: ['vegan', 'gluten-free'] },
  { id: 'p6', name: 'Red Apples', description: 'Crispy and sweet Fuji apples.', price: 3.49, unit: '1kg', category: 'Fruits & Veg', subCategory: 'Fruits', brand: 'NatureFirst', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop', stock: 200, rating: 4.4, reviewsCount: 200, tags: ['sweet'], dietary: ['vegan'] },
  { id: 'p7', name: 'Greek Yogurt', description: 'High protein thick Greek yogurt.', price: 2.50, unit: '500g', category: 'Dairy & Eggs', subCategory: 'Dairy', brand: 'Yogo', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop', stock: 60, rating: 4.8, reviewsCount: 110, tags: ['healthy'], dietary: ['gluten-free'] },
  { id: 'p8', name: 'Fresh Spinach', description: 'Washed and ready to eat spinach leaves.', price: 1.99, unit: '200g', category: 'Fruits & Veg', subCategory: 'Vegetables', brand: 'GreenField', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop', stock: 120, rating: 4.3, reviewsCount: 95, tags: ['fresh'], dietary: ['vegan'] },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@freshmart.com', role: UserRole.ADMIN, loyaltyPoints: 500 },
  { id: 'u2', name: 'John Customer', email: 'john@gmail.com', role: UserRole.CUSTOMER, loyaltyPoints: 120 },
  { id: 'u3', name: 'Swift Delivery', email: 'swift@delivery.com', role: UserRole.DELIVERY_PARTNER, loyaltyPoints: 0 },
  { id: 'u4', name: 'Sarah Support', email: 'sarah@freshmart.com', role: UserRole.SUPPORT_AGENT, loyaltyPoints: 0 },
];
