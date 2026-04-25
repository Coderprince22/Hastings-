import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Loader2 } from 'lucide-react';
import { CartItem, Restaurant } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurant: Restaurant | null;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
  isOrdering: boolean;
}

export default function CartSidebar({ isOpen, onClose, items, restaurant, onUpdateQuantity, onCheckout, isOrdering }: CartSidebarProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground uppercase tracking-tight text-lg">My Cart</h3>
                  {restaurant && <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase mt-0.5">From {restaurant.name}</p>}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                  <ShoppingBag className="w-16 h-16 text-gray-200" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Empty Cart</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground text-sm uppercase tracking-tight leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-primary font-black mt-0.5 uppercase tracking-widest">MK {item.price.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white rounded-md transition-all text-gray-400 hover:text-primary"
                      >
                        {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-xs font-black min-w-[20px] text-center text-foreground">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white rounded-md transition-all text-gray-400 hover:text-primary text-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-foreground">MK {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    <span>Delivery</span>
                    <span className="text-green-500 font-black">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-foreground uppercase tracking-tighter pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-primary">MK {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  disabled={isOrdering}
                  onClick={onCheckout}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 text-white font-black h-14 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 group uppercase tracking-widest text-[10px]"
                >
                  {isOrdering ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Checkout Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
