import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Plus, Trash2, Check, User } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { UserAddress } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, addAddress, removeAddress, selectAddress } = useProfile();
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddress) return;
    
    await addAddress({ label: newLabel, address: newAddress });
    setNewLabel('');
    setNewAddress('');
    setIsAdding(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">My Profile</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {/* User Info */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">{profile?.displayName || 'User'}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{profile?.email}</p>
              </div>
            </div>

            {/* Address Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Saved Addresses</h3>
                {!isAdding && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    Add New
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {isAdding && (
                  <motion.form 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddAddress}
                    className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3"
                  >
                    <input 
                      type="text" 
                      placeholder="Label (e.g. Home, Work)" 
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-tight outline-none focus:border-primary"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      required
                    />
                    <textarea 
                      placeholder="Street Address" 
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary min-h-[80px] resize-none"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                       <button 
                        type="submit"
                        className="flex-1 bg-primary text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                       >
                         Save Address
                       </button>
                       <button 
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-4 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest"
                       >
                         Cancel
                       </button>
                    </div>
                  </motion.form>
                )}

                {profile?.addresses?.length === 0 && !isAdding && (
                  <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No addresses saved yet</p>
                  </div>
                )}

                {profile?.addresses?.map((addr, idx) => (
                  <div 
                    key={idx}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                      profile.selectedAddressIndex === idx 
                      ? 'border-primary bg-primary/[0.02] shadow-sm' 
                      : 'border-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => selectAddress(idx)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center ${
                          profile.selectedAddressIndex === idx ? 'bg-primary border-primary' : 'border-gray-300'
                        }`}>
                          {profile.selectedAddressIndex === idx && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground uppercase tracking-tight">{addr.label}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 leading-relaxed max-w-[200px]">{addr.address}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAddress(idx);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
