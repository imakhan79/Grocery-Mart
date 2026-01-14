
import { Product, Category, User, UserRole } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Fruits & Veg', slug: 'fruits-veg', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop' },
  { id: '2', name: 'Dairy & Eggs', slug: 'dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553ad?w=400&h=400&fit=crop' },
  { id: '3', name: 'Bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop' },
  { id: '4', name: 'Meat & Seafood', slug: 'meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc822?w=400&h=400&fit=crop' },
  { id: '5', name: 'Pantry', slug: 'pantry', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' },
  { id: '6', name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop' },
  { id: '7', name: 'Snacks', slug: 'snacks', image: 'https://images.unsplash.com/photo-1599490659223-e15392d536d3?w=400&h=400&fit=crop' },
  { id: '8', name: 'Organic', slug: 'organic', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop' },
];

export const PRODUCTS: Product[] = [
  // FRUITS & VEG
  { 
    id: 'p1', name: 'Organic Bananas', description: 'Fresh organic bananas from sustainable farms.', price: 2.99, unit: '1kg', category: 'Fruits & Veg', subCategory: 'Fruits', brand: 'NatureFirst', image: 'https://images.unsplash.com/photo-1571771894821-ad9b58866602?w=500&h=500&fit=crop', gallery: ['https://images.unsplash.com/photo-1571771894821-ad9b58866602?w=500', 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500'], stock: 150, rating: 4.8, reviewsCount: 120, tags: ['fresh', 'popular'], dietary: ['vegan'],
    nutrition: { calories: '89', fat: '0.3g', protein: '1.1g', carbs: '23g' }
  },
  { id: 'p6', name: 'Red Fuji Apples', description: 'Crispy and sweet Fuji apples.', price: 3.49, unit: '1kg', category: 'Fruits & Veg', subCategory: 'Fruits', brand: 'NatureFirst', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&h=500&fit=crop', stock: 200, rating: 4.4, reviewsCount: 200, tags: ['sweet'], dietary: ['vegan'] },
  { id: 'p8', name: 'Baby Spinach', description: 'Washed and ready to eat spinach leaves.', price: 1.99, unit: '200g', category: 'Fruits & Veg', subCategory: 'Vegetables', brand: 'GreenField', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop', stock: 120, rating: 4.3, reviewsCount: 95, tags: ['fresh'], dietary: ['vegan'] },
  { id: 'p10', name: 'Avocados', description: 'Ripe Hass avocados, perfect for toast.', price: 4.50, unit: 'Pack of 2', category: 'Fruits & Veg', subCategory: 'Fruits', brand: 'NatureFirst', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop', stock: 50, rating: 4.9, reviewsCount: 310, tags: ['keto'], dietary: ['vegan'] },
  { id: 'p11', name: 'Cherry Tomatoes', description: 'Sweet and juicy organic vine tomatoes.', price: 2.75, unit: '250g', category: 'Fruits & Veg', subCategory: 'Vegetables', brand: 'GreenField', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop', stock: 100, rating: 4.7, reviewsCount: 88, tags: ['organic'], dietary: ['vegan'] },
  { id: 'p12', name: 'Blueberries', description: 'Antioxidant-rich fresh forest blueberries.', price: 5.99, unit: '125g', category: 'Fruits & Veg', subCategory: 'Fruits', brand: 'NatureFirst', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=500&h=500&fit=crop', stock: 60, rating: 4.8, reviewsCount: 42, tags: ['superfood'], dietary: ['vegan'] },

  // DAIRY & EGGS
  { id: 'p2', name: 'Full Cream Milk', description: 'Creamy full fat pasteurized milk.', price: 1.50, unit: '1L', category: 'Dairy & Eggs', subCategory: 'Dairy', brand: 'FarmFresh', image: 'https://images.unsplash.com/photo-1563636619-e910019335bd?w=500&h=500&fit=crop', stock: 80, rating: 4.5, reviewsCount: 85, tags: ['daily'], dietary: ['halal'] },
  { id: 'p7', name: 'Greek Yogurt', description: 'High protein thick Greek yogurt.', price: 2.50, unit: '500g', category: 'Dairy & Eggs', subCategory: 'Dairy', brand: 'Yogo', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop', stock: 60, rating: 4.8, reviewsCount: 110, tags: ['healthy'], dietary: ['gluten-free'] },
  { id: 'p13', name: 'Free Range Eggs', description: 'Organic farm-fresh large brown eggs.', price: 4.99, unit: 'Dozen', category: 'Dairy & Eggs', subCategory: 'Eggs', brand: 'FarmFresh', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&h=500&fit=crop', stock: 45, rating: 4.9, reviewsCount: 220, tags: ['organic'], dietary: ['halal'] },
  { id: 'p14', name: 'Cheddar Cheese', description: 'Aged sharp cheddar block.', price: 6.50, unit: '250g', category: 'Dairy & Eggs', subCategory: 'Cheese', brand: 'FarmFresh', image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&h=500&fit=crop', stock: 35, rating: 4.6, reviewsCount: 75, tags: ['aged'], dietary: ['halal'] },
  { id: 'p15', name: 'Salted Butter', description: 'Pure cream salted butter.', price: 3.25, unit: '200g', category: 'Dairy & Eggs', subCategory: 'Dairy', brand: 'FarmFresh', image: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=500&h=500&fit=crop', stock: 55, rating: 4.7, reviewsCount: 90, tags: ['pure'], dietary: ['halal'] },

  // BAKERY
  { id: 'p3', name: 'Sourdough Loaf', description: 'Artisanal sourdough baked daily.', price: 4.25, unit: '1 Loaf', category: 'Bakery', subCategory: 'Breads', brand: 'DailyBake', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&h=500&fit=crop', stock: 25, rating: 4.9, reviewsCount: 45, tags: ['artisan'], dietary: ['vegan'] },
  { id: 'p16', name: 'Butter Croissants', description: 'Flaky, buttery French style croissants.', price: 5.00, unit: 'Pack of 4', category: 'Bakery', subCategory: 'Pastries', brand: 'DailyBake', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop', stock: 20, rating: 4.8, reviewsCount: 65, tags: ['fresh'], dietary: ['halal'] },
  { id: 'p17', name: 'Whole Wheat Bread', description: 'Fiber-rich healthy multi-grain bread.', price: 3.50, unit: '1 Loaf', category: 'Bakery', subCategory: 'Breads', brand: 'DailyBake', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop', stock: 40, rating: 4.5, reviewsCount: 110, tags: ['healthy'], dietary: ['vegan'] },

  // MEAT
  { id: 'p4', name: 'Chicken Breast', description: 'Skinless boneless chicken breast.', price: 8.99, unit: '500g', category: 'Meat & Seafood', subCategory: 'Poultry', brand: 'PrimeCuts', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=500&fit=crop', stock: 40, rating: 4.6, reviewsCount: 60, tags: ['protein'], dietary: ['halal'] },
  { id: 'p18', name: 'Ribeye Steak', description: 'Premium marbled grass-fed ribeye steak.', price: 24.99, unit: '1kg', category: 'Meat & Seafood', subCategory: 'Beef', brand: 'PrimeCuts', image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=500&h=500&fit=crop', stock: 15, rating: 4.9, reviewsCount: 55, tags: ['premium'], dietary: ['halal'] },
  { id: 'p19', name: 'Fresh Salmon', description: 'Wild-caught Atlantic salmon fillet.', price: 18.50, unit: '500g', category: 'Meat & Seafood', subCategory: 'Seafood', brand: 'PrimeCuts', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=500&h=500&fit=crop', stock: 12, rating: 4.8, reviewsCount: 88, tags: ['omega-3'], dietary: ['halal'] },

  // PANTRY
  { id: 'p5', name: 'EV Olive Oil', description: 'Cold-pressed premium olive oil.', price: 12.99, unit: '500ml', category: 'Pantry', subCategory: 'Oils', brand: 'MedGold', image: 'https://images.unsplash.com/photo-1474979266404-7eaacabc8d0f?w=500&h=500&fit=crop', stock: 100, rating: 4.7, reviewsCount: 30, tags: ['imported'], dietary: ['vegan', 'gluten-free'] },
  { id: 'p20', name: 'Basmati Rice', description: 'Extra long grain aged Basmati rice.', price: 14.00, unit: '5kg', category: 'Pantry', subCategory: 'Grains', brand: 'MedGold', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', stock: 80, rating: 4.9, reviewsCount: 140, tags: ['aged'], dietary: ['vegan', 'halal'] },
  { id: 'p21', name: 'Pasta Penne', description: 'Organic durum wheat penne pasta.', price: 2.20, unit: '500g', category: 'Pantry', subCategory: 'Pasta', brand: 'MedGold', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop', stock: 120, rating: 4.6, reviewsCount: 92, tags: ['organic'], dietary: ['vegan'] },

  // BEVERAGES
  { id: 'p22', name: 'Sparkling Water', description: 'Pure mineral sparkling water.', price: 1.25, unit: '750ml', category: 'Beverages', subCategory: 'Water', brand: 'Hydrate', image: 'https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500&h=500&fit=crop', stock: 200, rating: 4.8, reviewsCount: 60, tags: ['refreshing'], dietary: ['vegan'] },
  { id: 'p23', name: 'Orange Juice', description: '100% freshly squeezed orange juice.', price: 3.99, unit: '1L', category: 'Beverages', subCategory: 'Juice', brand: 'Hydrate', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&h=500&fit=crop', stock: 75, rating: 4.7, reviewsCount: 130, tags: ['vitamin-c'], dietary: ['vegan'] },
  { id: 'p24', name: 'Arabica Coffee Beans', description: 'Medium roast premium coffee beans.', price: 11.50, unit: '500g', category: 'Beverages', subCategory: 'Coffee', brand: 'Hydrate', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop', stock: 40, rating: 4.9, reviewsCount: 200, tags: ['energy'], dietary: ['vegan'] },

  // SNACKS
  { id: 'p25', name: 'Dark Chocolate', description: '70% Cocoa premium dark chocolate.', price: 4.50, unit: '100g', category: 'Snacks', subCategory: 'Sweets', brand: 'Treats', image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&h=500&fit=crop', stock: 90, rating: 4.8, reviewsCount: 150, tags: ['dessert'], dietary: ['vegan', 'halal'] },
  { id: 'p26', name: 'Roasted Almonds', description: 'Sea salt roasted California almonds.', price: 7.99, unit: '250g', category: 'Snacks', subCategory: 'Nuts', brand: 'Treats', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=500&h=500&fit=crop', stock: 65, rating: 4.7, reviewsCount: 80, tags: ['protein'], dietary: ['vegan', 'halal'] },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@freshmart.com', role: UserRole.ADMIN, loyaltyPoints: 500 },
  { id: 'u2', name: 'John Customer', email: 'john@gmail.com', role: UserRole.CUSTOMER, loyaltyPoints: 120 },
  { id: 'u3', name: 'Swift Delivery', email: 'swift@delivery.com', role: UserRole.DELIVERY_PARTNER, loyaltyPoints: 0 },
  { id: 'u4', name: 'Sarah Support', email: 'sarah@freshmart.com', role: UserRole.SUPPORT_AGENT, loyaltyPoints: 0 },
];
