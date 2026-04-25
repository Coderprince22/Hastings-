import { Restaurant } from './types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Burger Haven',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=1000',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 5000,
    categories: ['Burgers', 'American', 'Fast Food'],
    menu: [
      { id: 'm1', name: 'Classic Cheeseburger', description: 'Juicy beef patty with cheddar cheese', price: 22000, category: 'Burgers' },
      { id: 'm2', name: 'Bacon BBQ Burger', description: 'Crispy bacon and smoky BBQ sauce', price: 28000, category: 'Burgers' },
      { id: 'm3', name: 'Truffle Fries', description: 'Crispy fries with truffle oil and parmesan', price: 12000, category: 'Sides' },
    ]
  },
  {
    id: 'rest-2',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1000',
    rating: 4.9,
    deliveryTime: '30-45 min',
    deliveryFee: 7500,
    categories: ['Sushi', 'Japanese', 'Healthy'],
    menu: [
      { id: 'm4', name: 'Salmon Nigiri (2pcs)', description: 'Fresh salmon on hand-pressed rice', price: 15000, category: 'Sushi' },
      { id: 'm5', name: 'Dragon Roll', description: 'Eel and cucumber topped with avocado', price: 32000, category: 'Specialty Rolls' },
      { id: 'm6', name: 'Miso Soup', description: 'Traditional Japanese soybean soup', price: 9500, category: 'Sides' },
    ]
  },
  {
    id: 'rest-3',
    name: 'Pizza Roma',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000',
    rating: 4.7,
    deliveryTime: '25-40 min',
    deliveryFee: 4500,
    categories: ['Pizza', 'Italian', 'Vegetarian'],
    menu: [
      { id: 'm7', name: 'Margherita Pizza', description: 'Fresh tomatoes, mozzarella, and basil', price: 24000, category: 'Pizza' },
      { id: 'm8', name: 'Pepperoni Feast', description: 'Double pepperoni and extra mozzarella', price: 34000, category: 'Pizza' },
      { id: 'm9', name: 'Garlic Knots (6pcs)', description: 'Soft bread knots with garlic butter', price: 11000, category: 'Sides' },
    ]
  },
  {
    id: 'rest-4',
    name: 'Thai Spice',
    image: 'https://images.unsplash.com/photo-1559311648-d46f4d8593d8?auto=format&fit=crop&q=80&w=1000',
    rating: 4.6,
    deliveryTime: '20-35 min',
    deliveryFee: 5500,
    categories: ['Thai', 'Asian', 'Spicy'],
    menu: [
      { id: 'm10', name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp or chicken', price: 26000, category: 'Mains' },
      { id: 'm11', name: 'Green Curry', description: 'Spicy curry with coconut milk and bamboo shoots', price: 28500, category: 'Mains' },
      { id: 'm12', name: 'Spring Rolls (4pcs)', description: 'Crispy veggie spring rolls', price: 12500, category: 'Sides' },
    ]
  }
];
