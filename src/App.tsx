/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Search, Filter, Home, ShoppingCart, User, Clock, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import MenuDisplay from './components/MenuDisplay';
import CartSidebar from './components/CartSidebar';
import ActiveOrdersList from './components/ActiveOrdersList';
import ProfileModal from './components/ProfileModal';
import { RESTAURANTS } from './data';
import { Restaurant, MenuItem, CartItem } from './types';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './lib/firebase';
import { OperationType, handleFirestoreError } from './lib/errorHandlers';

export default function App() {
  const { user, signIn } = useAuth();
  const { profile } = useProfile();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCartRestaurant, setActiveCartRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    if (!selectedRestaurant) return;

    if (activeCartRestaurant && activeCartRestaurant.id !== selectedRestaurant.id) {
      if (!confirm('Start a new cart with this restaurant? Your current cart will be cleared.')) {
        return;
      }
      setCartItems([{ ...item, quantity: 1 }]);
      setActiveCartRestaurant(selectedRestaurant);
    } else {
      setCartItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      setActiveCartRestaurant(selectedRestaurant);
    }
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      
      const newQuantity = existing.quantity + delta;
      if (newQuantity <= 0) {
        const remaining = prev.filter(i => i.id !== id);
        if (remaining.length === 0) setActiveCartRestaurant(null);
        return remaining;
      }
      return prev.map(i => i.id === id ? { ...i, quantity: newQuantity } : i);
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      signIn();
      return;
    }

    if (cartItems.length === 0 || !activeCartRestaurant) return;

    if (!profile?.addresses || profile.addresses.length === 0) {
      alert('Please add a delivery address in your profile first.');
      setIsProfileOpen(true);
      return;
    }

    const selectedAddress = profile.addresses[profile.selectedAddressIndex || 0];
    if (!selectedAddress) {
      alert('Please select a valid delivery address.');
      setIsProfileOpen(true);
      return;
    }

    if (!confirm(`Confirm order to be delivered to: ${selectedAddress.label} (${selectedAddress.address})?`)) {
      return;
    }

    setIsOrdering(true);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + activeCartRestaurant.deliveryFee;

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        restaurantId: activeCartRestaurant.id,
        restaurantName: activeCartRestaurant.name,
        items: cartItems,
        total,
        status: 'pending',
        createdAt: Timestamp.now(),
        deliveryAddress: profile?.addresses?.[profile?.selectedAddressIndex || 0]?.address || 'Default Address',
        customerName: user.displayName || 'Customer',
      });
      
      setCartItems([]);
      setActiveCartRestaurant(null);
      setIsCartOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsOrdering(false);
    }
  };

  const filteredRestaurants = RESTAURANTS.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#F4F4F7] text-[#1A1A1A] overflow-hidden">
      {/* Left Symmetrical Navigation */}
      <aside className="w-[84px] bg-white border-r border-[#E5E5E9] hidden md:flex flex-col items-center py-10 flex-shrink-0">
        <div className="w-10 h-10 bg-[#FF5C39] rounded-lg mb-12 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white rotate-45"></div>
        </div>
        <nav className="flex flex-col gap-10">
          <div className="p-2 text-[#FF5C39] cursor-pointer"><Home className="w-6 h-6 stroke-[2.5]" /></div>
          <div className="p-2 text-gray-400 hover:text-[#FF5C39] transition-colors cursor-pointer" onClick={() => setIsCartOpen(true)}><ShoppingCart className="w-6 h-6" /></div>
          <div className="p-2 text-gray-400 hover:text-[#FF5C39] transition-colors cursor-pointer" onClick={() => user ? setIsProfileOpen(true) : signIn()}><User className="w-6 h-6" /></div>
          <div className="p-2 text-gray-400 hover:text-[#FF5C39] transition-colors cursor-pointer"><Clock className="w-6 h-6" /></div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header onCartToggle={() => setIsCartOpen(true)} cartCount={cartCount} onProfileClick={() => setIsProfileOpen(true)} />

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          {user && <ActiveOrdersList userId={user.uid} />}

          {/* Promo Banner */}
          <section className="mb-10">
            <div className="h-[200px] bg-[#1A1A1A] rounded-2xl p-10 flex items-center justify-between relative overflow-hidden">
              <div className="z-10">
                <span className="bg-[#FF5C39] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Limited Offer</span>
                <h1 className="text-white text-4xl font-bold leading-tight mb-2 tracking-tighter">Get 40% Discount <br /> <span className="text-[#FF5C39]">on Healthy Food</span></h1>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Valid only for new users until June 30.</p>
              </div>
              <div className="w-48 h-48 bg-[#FF5C39] opacity-20 rounded-full absolute -right-10 -top-10"></div>
              <div className="w-64 h-64 bg-[#FF5C39] opacity-10 rounded-full absolute -right-20 -bottom-20"></div>
              <div className="z-10 w-40 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hidden sm:flex flex-col items-center justify-center">
                <span className="text-white text-5xl font-black">40%</span>
                <span className="text-[#FF5C39] font-bold text-xs uppercase tracking-widest">Off</span>
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight uppercase">Popular Categories</h2>
              <button className="text-[#FF5C39] text-sm font-bold uppercase tracking-widest">See All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Burgers', icon: '🍔', count: 24, bg: 'bg-orange-100' },
                { label: 'Sushi', icon: '🍣', count: 18, bg: 'bg-blue-100' },
                { label: 'Pizza', icon: '🍕', count: 42, bg: 'bg-yellow-100' },
                { label: 'Healthy', icon: '🥗', count: 12, bg: 'bg-green-100', active: true },
              ].map((cat) => (
                <div 
                  key={cat.label} 
                  className={`bg-white p-4 rounded-xl flex items-center gap-4 border cursor-pointer transition-all ${cat.active ? 'border-[#FF5C39] shadow-sm' : 'border-transparent hover:border-[#FF5C39]'}`}
                >
                  <div className={`w-12 h-12 ${cat.bg} rounded-lg flex items-center justify-center text-2xl`}>{cat.icon}</div>
                  <div>
                    <p className={`font-bold text-sm ${cat.active ? 'text-[#FF5C39]' : ''}`}>{cat.label}</p>
                    <p className={`text-[10px] uppercase font-bold tracking-wider ${cat.active ? 'text-[#FF5C39] opacity-60' : 'text-gray-400'}`}>{cat.count}+ Places</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Restaurants Grid */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight uppercase">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  onClick={(r) => setSelectedRestaurant(r)} 
                />
              ))}
            </div>
            {filteredRestaurants.length === 0 && (
              <div className="py-20 flex flex-col items-center text-center">
                <ChefHat className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching results found</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Persistent Order Summary (Right Sidebar) */}
      <aside className="w-[320px] bg-white border-l border-[#E5E5E9] p-8 hidden lg:flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-bold uppercase tracking-tighter">Your Order</h2>
           <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
             <ShoppingCart className="w-4 h-4 text-gray-400" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
              <ChefHat className="w-12 h-12" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    {item.category === 'Burgers' ? '🍔' : item.category === 'Sushi' ? '🍣' : item.category === 'Pizza' ? '🍕' : '🍲'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-tight line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.quantity} × MK {item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-bold text-[#FF5C39]">MK {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="border-t border-dashed border-gray-200 pt-6 flex flex-col gap-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
              <span className="text-[#1A1A1A] font-bold">MK {cartItems.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Delivery Fee</span>
              <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3 mt-2 uppercase tracking-tighter">
              <span>Total</span>
              <span className="text-[#FF5C39] font-black">MK {cartItems.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}</span>
            </div>
          </div>

          <button 
            disabled={cartItems.length === 0 || isOrdering}
            onClick={handleCheckout}
            className="w-full bg-[#FF5C39] text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-orange-200 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {isOrdering ? 'Proccessing...' : 'Checkout Now'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {selectedRestaurant && (
          <MenuDisplay 
            restaurant={selectedRestaurant} 
            onClose={() => setSelectedRestaurant(null)}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        )}
        
        <ProfileModal 
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </AnimatePresence>

      {/* Mobile Cart UI (Drawer) */}
      <div className="lg:hidden">
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          restaurant={activeCartRestaurant}
          onUpdateQuantity={updateCartQuantity}
          onCheckout={handleCheckout}
          isOrdering={isOrdering}
        />
      </div>
    </div>
  );
}
