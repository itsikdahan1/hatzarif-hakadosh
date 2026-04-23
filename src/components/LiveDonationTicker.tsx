"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Heart } from "lucide-react";

interface Donation {
  id: string;
  donorName: string;
  amount: number;
  purpose: string;
  date: string;
}

export function LiveDonationTicker() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "custom_donations"),
      orderBy("date", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Donation[];
      setDonations(docs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (donations.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % donations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [donations]);

  if (donations.length === 0) return null;

  const current = donations[currentIndex];

  return (
    <div className="bg-charcoal text-white py-2.5 overflow-hidden relative border-b border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center gap-3 px-4"
        >
          <div className="bg-gold-warm/20 p-1 rounded-full">
            <Heart size={14} className="fill-gold-warm text-gold-warm" />
          </div>
          <span className="text-sm font-bold truncate max-w-[150px]">
             {current.donorName || "תורם אנונימי"}
          </span>
          <span className="text-white/40 text-xs">תרם עכשיו</span>
          <span className="text-gold-warm font-black text-sm">₪{current.amount.toLocaleString()}</span>
          <span className="hidden md:inline text-white/20 text-[10px] uppercase tracking-widest">— {current.purpose}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
