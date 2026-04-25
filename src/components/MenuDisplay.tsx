import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Star, ChevronLeft } from 'lucide-react';
import { Restaurant, MenuItem, CartItem } from '../types';

interface MenuDisplayProps {
  restaurant: Restaurant;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
  cartItems: CartItem[];
}

export default function MenuDisplay({ restaurant, onClose, onAddToCart, cartItems }: MenuDisplayProps) {
  const getQuantity = (id: string) => cartItems.find(i => i.id === id)?.quantity || 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-foreground/60 backdrop-blur-sm p-4 md:p-10"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative min-h-[80vh]">
        {/* Banner */}
        <div className="relative h-64 sm:h-96 w-full">
          <motion.img 
            layoutId={`image-${restaurant.id}`}
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-foreground rounded-xl transition-all border border-white/20 shadow-lg group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="absolute bottom-10 left-10 right-10 text-white">
             <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Open Now</span>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating} Rating</span>
                </div>
             </div>
            <motion.h2 
              layoutId={`title-${restaurant.id}`}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2"
            >
              {restaurant.name}
            </motion.h2>
            <p className="text-sm font-medium opacity-70 uppercase tracking-widest">
               {restaurant.categories.join(' • ')} • {restaurant.deliveryTime}
            </p>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="p-8 md:p-12 bg-white">
          <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
             <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Full Menu</h3>
             <div className="hidden sm:flex gap-3">
               {Array.from(new Set(restaurant.menu.map(m => m.category))).map(cat => (
                 <span key={cat} className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 bg-gray-50 border border-gray-100 px-4 py-1.5 rounded-xl">{cat}</span>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {restaurant.menu.map((item) => (
              <div 
                key={item.id} 
                className="flex items-start justify-between gap-6 pb-6 border-b border-gray-50 last:border-0 md:last:border-b"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground uppercase tracking-tight mb-1">{item.name}</h4>
                  <p className="text-xs text-gray-400 font-medium mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                  <span className="text-lg font-black text-primary">MK {item.price.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-12 h-12 bg-foreground text-white rounded-xl shadow-lg shadow-gray-200 flex items-center justify-center hover:bg-primary transition-all active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {getQuantity(item.id) > 0 && (
                    <div className="text-center">
                       <span className="text-xs font-black text-foreground bg-gray-100 w-8 h-8 flex items-center justify-center rounded-lg">{getQuantity(item.id)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
