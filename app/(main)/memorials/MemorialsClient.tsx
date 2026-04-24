"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Users, ArrowRight, Stars, Calendar } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";


export function MemorialsClient() {
  const [dedications, setDedications] = useState<any[]>([]);
  const [memorials, setMemorials] = useState<any[]>([]);

  useEffect(() => {
    const qDedications = query(collection(db, 'dedications'));
    const unsubDedications = onSnapshot(qDedications, (snapshot) => {
      setDedications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'dedications'));

    const qMemorials = query(collection(db, 'memorials'));
    const unsubMemorials = onSnapshot(qMemorials, (snapshot) => {
      setMemorials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'memorials'));

    return () => { unsubDedications(); unsubMemorials(); };
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-charcoal min-h-screen text-white pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <Link href="/" className="flex items-center gap-2 text-white/40 font-bold mb-12 hover:text-white transition-colors">
            <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 flex items-center gap-3 md:gap-4">
                <Heart className="text-gold-warm shrink-0" size={32} /> הקדשות וזכויות
              </h2>
              <div className="space-y-6">
                {dedications.length > 0 ? (
                  dedications.map((dedication: any, idx: number) => (
                    <motion.div 
                      key={dedication.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-white/5 border p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] hover:bg-white/10 transition-all ${dedication.active ? 'border-gold-warm/40 bg-gold-warm/5' : 'border-white/10'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-serif italic">&quot;{dedication.content}&quot;</p>
                          {dedication.active && <Stars className="text-gold-warm shrink-0" size={24} />}
                      </div>
                      {dedication.donorName && (
                        <p className="text-gold-warm font-bold text-lg">
                          הוקדש על ידי: {dedication.donorName}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 border border-dashed border-white/10 rounded-[2.5rem] text-center">
                    <p className="text-white/30 text-xl">ניתן להקדיש יום לימוד לעילוי נשמה או להצלחה.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 flex items-center gap-3 md:gap-4">
                <Users className="text-gold-warm shrink-0" size={32} /> לוח אזכרות
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-4 sm:p-6 md:p-10 space-y-4 md:space-y-6">
                  {memorials.length > 0 ? (
                    memorials.map((memorial: any, idx: number) => (
                      <motion.div 
                        key={memorial.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 py-4 sm:py-6 px-4 sm:px-6 md:px-8 -mx-4 sm:-mx-6 md:-mx-8 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all ${memorial.today ? 'bg-gold-warm/10 border-gold-warm/20' : ''}`}
                      >
                        <div className="flex items-center gap-6">
                          {memorial.today && <Calendar className="text-gold-warm shrink-0" size={20} />}
                          <div>
                              <p className={`font-bold text-lg sm:text-xl md:text-2xl ${memorial.today ? 'text-gold-warm' : 'text-white'}`}>{memorial.name}</p>
                              {memorial.description && <p className="text-white/40 text-lg">{memorial.description}</p>}
                          </div>
                        </div>
                        <div className={`font-bold text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-full shrink-0 self-start sm:self-auto ${memorial.today ? 'bg-gold-warm text-white' : 'bg-gold-warm/10 text-gold-warm'}`}>
                          {memorial.date}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white/30 text-center py-20 italic text-xl">אין אזכרות קרובות לעדכון...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
