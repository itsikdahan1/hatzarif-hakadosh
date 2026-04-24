"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Users, Briefcase, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";
import { Footer } from "@/components/Footer";
import { db, handleFirestoreError, OperationType } from "@/src/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export function BusinessClient() {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'businesses'), where('approved', '==', true));
    const unsub = onSnapshot(q, (snapshot) => {
      setBusinesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'businesses'));
    return () => unsub();
  }, []);

  const displayList = businesses.length > 0 ? businesses : (SYNAGOGUE_INFO as any).community.businessDirectory.list;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background min-h-screen pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <Link href="/" className="flex items-center gap-2 text-charcoal/40 font-bold mb-12 hover:text-charcoal transition-colors">
            <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
          </Link>

          <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-8 md:p-12 lg:p-20 shadow-2xl border border-charcoal/5 relative overflow-hidden mb-12 md:mb-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div>
                <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8 text-charcoal leading-tight">
                  {SYNAGOGUE_INFO.community.businessDirectory.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-charcoal/60 leading-relaxed mb-6 md:mb-10">
                  {SYNAGOGUE_INFO.community.businessDirectory.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.a 
                    href={`https://wa.me/${SYNAGOGUE_INFO.contact.gabbai}?text=${encodeURIComponent(SYNAGOGUE_INFO.community.businessDirectory.whatsappMessage)}`}
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 md:gap-4 bg-charcoal text-white px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg shadow-xl hover:bg-gold-warm transition-all"
                  >
                    <MessageCircle size={24} /> {SYNAGOGUE_INFO.community.businessDirectory.whatsappCTA}
                  </motion.a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Heart, label: "ערבות הדדית" },
                  { icon: Users, label: "נטוורקינג" },
                  { icon: Briefcase, label: "קידום עסקים" },
                  { icon: ArrowLeft, label: "שיתופי פעולה" }
                ].map((item, idx) => (
                  <div key={idx} className="aspect-square bg-alabaster rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center border border-charcoal/5 hover:border-gold-warm/20 transition-all">
                    <item.icon className="text-gold-warm mb-3 md:mb-4" size={32} />
                    <span className="font-bold text-charcoal/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-center text-charcoal/40 uppercase tracking-wider md:tracking-widest">מדריך העסקים של הקהילה</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayList.map((biz: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-lg group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={biz.image} 
                      alt={biz.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-charcoal shadow-sm">
                      {biz.category}
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 md:p-8">
                    <h4 className="font-bold text-2xl mb-3 text-charcoal">{biz.name}</h4>
                    <p className="text-charcoal/60 mb-8 line-clamp-3 italic font-serif leading-relaxed">
                      {biz.description}
                    </p>
                    <a 
                      href={`https://wa.me/${biz.whatsapp}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-charcoal/5 text-charcoal px-6 py-3 rounded-full text-sm font-bold hover:bg-gold-warm hover:text-white transition-all w-full justify-center"
                    >
                      יצירת קשר בוואטסאפ <MessageCircle size={18} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
