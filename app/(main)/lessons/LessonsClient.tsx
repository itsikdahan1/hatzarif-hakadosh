"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Clock, BookOpen, MessageCircle, ArrowRight } from "lucide-react";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";


export function LessonsClient() {
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'lessons'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'lessons'));
    return () => unsubscribe();
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white min-h-screen pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <Link href="/" className="flex items-center gap-2 text-charcoal/40 font-bold mb-12 hover:text-charcoal transition-colors">
            <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
          </Link>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-charcoal mb-6">שיעורי תורה</h2>
            <div className="w-24 h-2 bg-gold-warm mx-auto mb-8 rounded-full" />
            <p className="text-xl text-charcoal/60 max-w-2xl mx-auto">
              מגוון רחב של שיעורים לאורך כל השבוע, לכל הרמות ובכל הנושאים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.length > 0 ? (
              lessons.map((lesson, idx) => (
                <motion.div 
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-alabaster p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-charcoal/5 hover:border-gold-warm/30 transition-all group shadow-sm hover:shadow-xl"
                >
                  <div className="w-16 h-16 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm group-hover:bg-gold-warm group-hover:text-white transition-all mb-8">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">{lesson.title}</h3>
                  <p className="text-gold-warm font-bold text-lg mb-6">{lesson.lecturer}</p>
                  
                  <div className="space-y-4 text-charcoal/60">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-gold-warm" />
                      <span className="font-bold">{lesson.day}, {lesson.time}</span>
                    </div>
                    {lesson.topic && (
                      <div className="flex items-center gap-3">
                        <MessageCircle size={18} className="text-gold-warm" />
                        <span>{lesson.topic}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 sm:py-32 bg-alabaster rounded-[2rem] md:rounded-[3rem] border border-dashed border-charcoal/10">
                <BookOpen className="mx-auto text-charcoal/10 mb-4" size={64} />
                <p className="text-charcoal/40 font-serif italic text-xl">בקרוב יעודכנו כאן זמני השיעורים החדשים...</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
