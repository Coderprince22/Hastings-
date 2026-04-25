import { motion } from 'motion/react';
import { Search, ShoppingBag, User, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onCartToggle: () => void;
  cartCount: number;
  onProfileClick: () => void;
}

export default function Header({ onCartToggle, cartCount, onProfileClick }: HeaderProps) {
  const { user, signIn, signOut } = useAuth();

  return (
    <header className="h-[84px] sticky top-0 z-50 bg-white border-b border-[#E5E5E9] px-4 md:px-10 flex items-center justify-between flex-shrink-0">
      <div className="flex-1 flex items-center gap-4">
        {/* Search Bar - Theme Style */}
        <div className="hidden md:flex items-center gap-3 bg-[#F4F4F7] px-5 py-2.5 rounded-full w-full max-w-[400px] border border-transparent focus-within:border-primary transition-all">
          <Search className="h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your favorite food..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-gray-400"
          />
        </div>
        
        {/* Mobile Logo (Mobile ONLY visible) */}
        <div className="flex items-center gap-2 md:hidden cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingBag className="text-white w-4 h-4 scale-110" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">SwiftDish</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Delivery Info */}
        <div 
          className="hidden sm:flex items-center gap-3 text-right cursor-pointer group"
          onClick={user ? onProfileClick : signIn}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-black group-hover:text-primary transition-colors">Deliver to</p>
            <p className="text-xs font-bold uppercase tracking-tight text-foreground">My Account</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 p-0.5 border border-gray-200 overflow-hidden group-hover:border-primary transition-colors">
             {user ? (
               <img src={user.photoURL || ''} alt="" className="w-full h-full object-cover rounded-full" />
             ) : (
               <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                 <Search className="w-4 h-4 text-gray-400" />
               </div>
             )}
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onCartToggle}
            className="relative p-2.5 bg-[#F4F4F7] hover:bg-primary/10 rounded-xl transition-all group"
          >
            <ShoppingBag className="w-5 h-5 text-gray-900 group-hover:text-primary transition-colors" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-lg border-2 border-white shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {!user && (
            <button 
              onClick={signIn}
              className="bg-foreground text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-primary transition-all active:scale-95 shadow-sm"
            >
              Login
            </button>
          )}

          {user && (
            <button 
              onClick={signOut}
              className="p-2.5 bg-[#F4F4F7] hover:bg-red-50 rounded-xl transition-all group lg:hidden"
            >
              <User className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
