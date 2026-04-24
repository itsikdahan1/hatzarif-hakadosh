"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Coffee, ArrowRight, ArrowLeft, MessageCircle, User } from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";

import { useSiteMedia } from "@/src/hooks/useSiteMedia";

export function YouthClient() {
  const media = useSiteMedia();
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

          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center mb-20 md:mb-40">
            <div>
              <div className="inline-block bg-white/10 border border-white/20 px-6 py-2 rounded-full mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.3em] text-white/80">מפגש שבועי - נאות אשלים</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-10 leading-tight">
                {SYNAGOGUE_INFO.youthSection.title}
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-8 md:mb-12 leading-relaxed max-w-xl">
                {SYNAGOGUE_INFO.youthSection.description}
              </p>
              <motion.a 
                href={`https://wa.me/${SYNAGOGUE_INFO.contact.gabbai}?text=${encodeURIComponent(SYNAGOGUE_INFO.youthSection.whatsappMessage)}`}
                target="_blank"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 md:gap-4 bg-white text-slate-blue px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 rounded-full font-bold text-base sm:text-xl md:text-2xl shadow-3xl"
              >
                שלחו לי תזכורת <ArrowLeft size={28} className="rotate-180" />
              </motion.a>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-3xl transform rotate-2 bg-white/10">
                {media.youth_hero ? (
                  <img src={media.youth_hero} alt={SYNAGOGUE_INFO.youthSection.rabbiName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User size={80} className="text-white/20" /></div>
                )}
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

          <div className="mb-20 md:mb-40">
             <div className="flex items-center gap-6 mb-16">
                <div className="h-px flex-grow bg-white/10" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white/40 uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em]">רגעים מהשיעור</h3>
                <div className="h-px flex-grow bg-white/10" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[media.youth_gallery_1, media.youth_gallery_2, media.youth_gallery_3].map((img, idx) => (
                  img ? (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="aspect-video rounded-[2.5rem] overflow-hidden border border-white/10"
                    >
                      <img src={img} alt={`רגע מהשיעור ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </motion.div>
                  ) : null
                ))}
                {!media.youth_gallery_1 && !media.youth_gallery_2 && !media.youth_gallery_3 && (
                  <div className="col-span-full text-center py-16 border border-dashed border-white/10 rounded-[2.5rem]">
                    <p className="text-white/30 italic">תמונות מהשיעור יעלו כאן בקרוב...</p>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] md:rounded-[4rem] p-6 sm:p-8 md:p-12 lg:p-24 border border-white/10 grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
             <div>
                <div className="flex items-center gap-4 mb-8">
                   <Heart className="text-gold-warm" size={40} />
                   <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">קהילה תומכת ומחבקת</h2>
                </div>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/60 mb-8 md:mb-12 border-r-4 border-gold-warm/30 pr-6 md:pr-8">
                   {SYNAGOGUE_INFO.rabbiStory}
                </p>
                <div className="bg-white/5 p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-[3rem] border border-white/10 mb-8 md:mb-12">
                   <p className="text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed italic font-serif">
                     &quot;{SYNAGOGUE_INFO.rabbiQuote}&quot;
                   </p>
                   <p className="mt-4 md:mt-6 font-bold text-gold-warm text-lg md:text-xl">— {SYNAGOGUE_INFO.rabbi}</p>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {[
                  { title: "עושים טוב יחד", desc: "פרויקטים של חסד בשכונה" },
                  { title: "חיבור אישי", desc: "ייעוץ וקשר בין אנשי הקהילה" },
                  { title: "בית פתוח", desc: "מקום נוח ומזמין לכל אחד" },
                  { title: "שמיעת השיעור", desc: "זמין גם בדיגיטל" }
                ].map((card, i) => (
                  <div key={i} className="bg-white/5 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                     <h4 className="font-bold text-xl mb-3 text-gold-warm">{card.title}</h4>
                     <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
