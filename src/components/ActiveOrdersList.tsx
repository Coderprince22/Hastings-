import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { motion } from 'motion/react';
import { Clock, Bike, CheckCircle, Package } from 'lucide-react';
import { OperationType, handleFirestoreError } from '../lib/errorHandlers';

interface ActiveOrdersListProps {
  userId: string;
}

export default function ActiveOrdersList({ userId }: ActiveOrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [userId]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'preparing': return <Package className="w-4 h-4 text-primary" />;
      case 'on-the-way': return <Bike className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (orders.length === 0) return null;

  return (
    <div className="space-y-4 mb-12">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">My Recent Activity</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition-all ${order.status === 'cancelled' ? 'opacity-60 grayscale' : 'border-gray-100 hover:shadow-md'}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Order #{order.id.slice(-6)}</span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                   order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                   order.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                   'bg-primary/10 text-primary animate-pulse'
                }`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('-', ' ')}
                </div>
              </div>
              <h4 className="font-bold text-foreground uppercase tracking-tight line-clamp-1">{order.restaurantName}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {order.items.length} items • MK {order.total.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                {order.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {(order.status === 'pending') && (
                 <button 
                  onClick={() => handleCancel(order.id)}
                  className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline bg-transparent border-none p-0"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
