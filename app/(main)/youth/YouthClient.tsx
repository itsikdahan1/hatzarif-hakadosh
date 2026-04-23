"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Coffee, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";
import { Footer } from "@/components/Footer";

export function YouthClient() {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-blue min-h-screen text-white pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <Link href="/" className="flex items-center gap-2 text-white/40 font-bold mb-12 hover:text-white transition-colors">
            <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
          </Link>

          <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
            <div>
              <div className="inline-block bg-white/10 border border-white/20 px-6 py-2 rounded-full mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">מפגש שבועי - נאות אשלים</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-bold mb-10 leading-tight">
                {SYNAGOGUE_INFO.youthSection.title}
              </h2>
              <p className="text-2xl text-white/70 mb-12 leading-relaxed max-w-xl">
                {SYNAGOGUE_INFO.youthSection.description}
              </p>
              <motion.a 
                href={`https://wa.me/${SYNAGOGUE_INFO.contact.gabbai}?text=${encodeURIComponent(SYNAGOGUE_INFO.youthSection.whatsappMessage)}`}
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 bg-white text-slate-blue px-10 py-6 rounded-full font-bold text-2xl shadow-3xl"
              >
                שלחו לי תזכורת <ArrowLeft size={28} className="rotate-180" />
              </motion.a>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl transform rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000" 
                  alt={SYNAGOGUE_INFO.youthSection.rabbiName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-gold-warm p-10 rounded-[3rem] shadow-3xl max-w-xs hidden md:block border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                    <Coffee size={24} />
                  </div>
                  <p className="font-bold text-xl text-white">{SYNAGOGUE_INFO.youthSection.rabbiName}</p>
                </div>
                <p className="text-white/80 italic font-serif text-sm leading-relaxed">
                  &quot;לעצור את המירוץ, להטעין את הנשמה. פשוט בואו.&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="mb-40">
             <div className="flex items-center gap-6 mb-16">
                <div className="h-px flex-grow bg-white/10" />
                <h3 className="text-3xl font-serif font-bold text-white/40 uppercase tracking-[0.3em]">רגעים מהשיעור</h3>
                <div className="h-px flex-grow bg-white/10" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SYNAGOGUE_INFO.youthSection.gallery.map((img: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-video rounded-[2.5rem] overflow-hidden border border-white/10"
                  >
                    <img 
                      src={img} 
                      alt={`Youth Gallery ${idx}`} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="bg-white/5 rounded-[4rem] p-12 md:p-24 border border-white/10 grid lg:grid-cols-2 gap-24 items-center">
             <div>
                <div className="flex items-center gap-4 mb-8">
                   <Heart className="text-gold-warm" size={40} />
                   <h2 className="text-4xl md:text-5xl font-bold">קהילה תומכת ומחבקת</h2>
                </div>
                <p className="text-xl leading-relaxed text-white/60 mb-12 border-r-4 border-gold-warm/30 pr-8">
                   {SYNAGOGUE_INFO.rabbiStory}
                </p>
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 mb-12">
                   <p className="text-2xl text-white/80 leading-relaxed italic font-serif">
                     &quot;{SYNAGOGUE_INFO.rabbiQuote}&quot;
                   </p>
                   <p className="mt-6 font-bold text-gold-warm text-xl">— {SYNAGOGUE_INFO.rabbi}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-8">
                {[
                  { title: "עושים טוב יחד", desc: "פרויקטים של חסד בשכונה" },
                  { title: "חיבור אישי", desc: "ייעוץ וקשר בין אנשי הקהילה" },
                  { title: "בית פתוח", desc: "מקום נוח ומזמין לכל אחד" },
                  { title: "שמיעת השיעור", desc: "זמין גם בדיגיטל" }
                ].map((card, i) => (
                  <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                     <h4 className="font-bold text-xl mb-3 text-gold-warm">{card.title}</h4>
                     <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
