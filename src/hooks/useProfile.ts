import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserAddress } from '../types';
import { useAuth } from './useAuth';
import { OperationType, handleFirestoreError } from '../lib/errorHandlers';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as UserProfile);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const addAddress = async (address: UserAddress) => {
    if (!profile) return;
    const currentAddresses = profile.addresses || [];
    await updateProfile({
      addresses: [...currentAddresses, address]
    });
  };

  const removeAddress = async (index: number) => {
    if (!profile || !profile.addresses) return;
    const newAddresses = profile.addresses.filter((_, i) => i !== index);
    const updates: Partial<UserProfile> = { addresses: newAddresses };
    
    if (profile.selectedAddressIndex === index) {
      updates.selectedAddressIndex = 0;
    } else if (profile.selectedAddressIndex !== undefined && profile.selectedAddressIndex > index) {
      updates.selectedAddressIndex = profile.selectedAddressIndex - 1;
    }
    
    await updateProfile(updates);
  };

  const selectAddress = async (index: number) => {
    await updateProfile({ selectedAddressIndex: index });
  };

  return { profile, loading, updateProfile, addAddress, removeAddress, selectAddress };
}
