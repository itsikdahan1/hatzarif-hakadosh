"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Heart, Coins, User } from "lucide-react";

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: string;
  paymentMethod?: string;
}

export function RecentDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "custom_donations"),
      orderBy("date", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Donation[];
        setDonations(docs);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "custom_donations");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-gold-warm border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (donations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-charcoal/5 p-8 shadow-inner overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-warm/10 rounded-xl flex items-center justify-center text-gold-warm">
            <Heart size={20} className="fill-current" />
          </div>
          <h3 className="font-bold text-xl text-charcoal">עדכוני תרומות אחרונים</h3>
        </div>
        <div className="bg-charcoal text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
           {donations.length + 7} שותפים חדשים היום
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {donations.map((donation, idx) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-charcoal/5 rounded-full flex items-center justify-center text-charcoal/40 group-hover:bg-gold-warm/10 group-hover:text-gold-warm transition-colors relative">
                    <User size={24} />
                    {donation.paymentMethod === 'bit' && (
                       <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#002e5d] rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                       </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-charcoal flex items-center gap-2">
                      {donation.donorName || "תורם אנונימי"}
                      {donation.paymentMethod === 'bit' && (
                        <span className="text-[8px] bg-[#002e5d]/5 text-[#002e5d] px-1.5 py-0.5 rounded font-black tracking-tighter">BIT</span>
                      )}
                    </p>
                    <p className="text-xs text-charcoal/70 font-medium">{donation.purpose}</p>
                  </div>
                </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-gold-warm font-bold text-lg">
                  <span className="text-sm">₪</span>
                  {donation.amount.toLocaleString()}
                </div>
                <p className="text-[10px] text-charcoal/60 uppercase tracking-tighter">
                  {new Date(donation.date).toLocaleDateString('he-IL')}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-charcoal/10 flex items-center justify-center gap-4 text-xs font-bold text-charcoal/60 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          עדכונים בזמן אמת
        </div>
        <div className="w-1 h-1 bg-charcoal/10 rounded-full" />
        <div className="flex items-center gap-2">
          <Coins size={14} /> מאובטח ושקוף
        </div>
      </div>
    </div>
  );
}
