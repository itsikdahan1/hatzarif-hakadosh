"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, AlertTriangle, Clock } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function AnnouncementPopup() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    // Only fetch active announcements
    const q = query(collection(db, 'announcements'), where('active', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(msgs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'announcements'));

    return () => unsubscribe();
  }, []);

  const activeMsg = announcements.find(a => a.isUrgent && !dismissed.includes(a.id));

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
  };

  return (
    <AnimatePresence>
      {activeMsg && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-[200]"
          dir="rtl"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-red-500/20 overflow-hidden relative">
            {/* Header / Urgency Bar */}
            <div className="bg-red-500 px-6 py-3 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="animate-pulse" />
                <span className="font-bold text-sm uppercase tracking-wider">הודעה דחופה מהגבאי</span>
              </div>
              <button 
                onClick={() => handleDismiss(activeMsg.id)} 
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex gap-4 items-start mb-6">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal mb-2 leading-tight">{activeMsg.title}</h3>
                  <div className="flex items-center gap-2 text-charcoal/30 text-[10px] font-bold font-mono">
                    <Clock size={12} />
                    {activeMsg.createdAt ? new Date(activeMsg.createdAt).toLocaleString('he-IL') : 'זה עתה'}
                  </div>
                </div>
              </div>

              <p className="text-charcoal/70 leading-relaxed mb-8 text-lg font-serif italic">
                "{activeMsg.content}"
              </p>

              <button 
                onClick={() => handleDismiss(activeMsg.id)}
                className="w-full bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all shadow-lg"
              >
                הבנתי, תודה
              </button>
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
