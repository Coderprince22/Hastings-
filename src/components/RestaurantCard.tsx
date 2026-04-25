import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <motion.div 
      layoutId={`card-${restaurant.id}`}
      onClick={() => onClick(restaurant)}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer border border-[#E5E5E9] hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden pointer-events-none">
        <motion.img 
          layoutId={`image-${restaurant.id}`}
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 translate-y-[-2px]">
          <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/20">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black text-foreground">{restaurant.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{restaurant.name}</h3>
          <span className="text-xs font-black text-primary bg-orange-50 px-2 py-0.5 rounded">FREE</span>
        </div>
        
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 line-clamp-1">{restaurant.categories.join(' • ')}</p>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-4">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Star className="w-3 h-3 text-yellow-400" />
            <span>{restaurant.rating} Good</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
