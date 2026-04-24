"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin, History, Target, Users, Heart, Quote, ShieldCheck, Stars, Sparkles } from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";
import { useSiteMedia } from "@/src/hooks/useSiteMedia";
import { User } from "lucide-react";

// mediaSlot is now defined in constants.ts team array

export function AboutClient() {
  const media = useSiteMedia();
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-alabaster min-h-screen pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <Link href="/" className="flex items-center gap-2 text-charcoal/40 font-bold mb-12 hover:text-charcoal transition-colors group">
            <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> חזרה לדף הבית
          </Link>

          <div className="text-center mb-12 md:mb-24 relative">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <h1 className="text-3xl sm:text-5xl md:text-8xl font-serif font-bold text-charcoal mb-6 leading-tight">
                הסיפור של <span className="text-gold-warm">הצריף</span>
              </h1>
              <div className="w-32 h-2 bg-gold-warm mx-auto mb-10 rounded-full" />
              <p className="text-lg sm:text-xl md:text-2xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed font-serif italic">
                &quot;בית שהוא לב פועם בשכונת נאות אשלים. מקום שבו כל אחד מוצא את החלק שלו בפסיפס הקהילתי.&quot;
              </p>
            </motion.div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-warm/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-32">
            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-charcoal/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-warm/5 rounded-full -mr-16 -mt-16" />
              <History className="text-gold-warm mb-8" size={56} />
              <h3 className="text-3xl font-bold text-charcoal mb-6 font-serif">השורשים שלנו</h3>
              <p className="text-charcoal/60 leading-relaxed text-lg font-serif">
                קהילת &quot;הצריף הקדוש&quot; החלה את דרכה מתוך צורך עמוק של תושבי שכונת נאות אשלים במקום תפילה וקהילה מאחד. מה שהתחיל כמניין קטן גדל והפך למרכז רוחני וחברתי שוקק חיים, המארח מאות אנשים לאורך כל השבוע.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-charcoal p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16" />
              <Target className="text-gold-warm mb-8" size={56} />
              <h3 className="text-3xl font-bold text-white mb-6 font-serif">החזון והשליחות</h3>
              <p className="text-white/60 leading-relaxed text-lg font-serif">
                אנחנו שואפים להיות בית פתוח לכל יהודי, ללא קשר למקום שבו הוא נמצא. המטרה שלנו היא להנגיש את היופי של מסורת ישראל בצורה נעימה, מכבדת ורלוונטית לימינו, תוך יצירת רשת ביטחון קהילתית וחברתית חזקה בשכונה.
              </p>
            </motion.div>
          </div>

          <div className="mb-16 md:mb-32">
            <div className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-charcoal whitespace-nowrap">ההנהגה שלנו</h2>
              <div className="h-px bg-charcoal/10 flex-grow" />
              <Users className="text-gold-warm" size={40} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              {(SYNAGOGUE_INFO as any).team.map((member: any, idx: number) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="group">
                  <div className="relative mb-8">
                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl group-hover:shadow-2xl bg-charcoal/5">
                      {media[member.mediaSlot] ? (
                        <img src={media[member.mediaSlot]} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><User size={64} className="text-charcoal/15" /></div>
                      )}
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white px-6 py-2 rounded-full border border-charcoal/5 shadow-lg group-hover:bg-gold-warm group-hover:text-white transition-colors duration-300">
                      <span className="text-xs font-bold uppercase tracking-widest">{member.role}</span>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-charcoal mb-4 text-center">{member.name}</h4>
                  <p className="text-charcoal/50 text-center leading-relaxed font-serif italic text-sm">&quot;{member.bio}&quot;</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-10 md:p-16 lg:p-24 shadow-2xl border border-charcoal/5 relative overflow-hidden mb-16 md:mb-32">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full -mr-32 -mt-32" />
            <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <ShieldCheck className="text-gold-warm" size={48} />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal">בית של שקיפות ואמינות</h2>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-charcoal/60 leading-relaxed mb-8 md:mb-12 border-r-4 border-gold-warm/30 pr-6 md:pr-8">
                  כל תרומה וכל פעילות בקהילה מפוקחת ומנוהלת בסטנדרטים הגבוהים ביותר. אנחנו מחויבים לשקיפות מלאה מול הקהילה ומול רשויות המס (מוסד מוכר לפי סעיף 46), כדי שתוכלו להיות בטוחים שהשותפות שלכם מגיעה למקום הנכון.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Heart, text: "פיקוח הלכתי וחשבונאי" },
                    { icon: Stars, text: "ניהול קהילתי שקוף" },
                    { icon: Quote, text: "קבלה מוכרת לצורכי מס" },
                    { icon: Sparkles, text: "עשייה למען הכלל" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-alabaster p-4 rounded-2xl border border-charcoal/5">
                      <item.icon className="text-gold-warm" size={20} />
                      <span className="text-xs font-bold text-charcoal/80">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[3rem] overflow-hidden rotate-2 shadow-2xl">
                  {media.about_synagogue ? (
                    <img src={media.about_synagogue} alt="בית הכנסת מבפנים" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-charcoal/5 flex items-center justify-center"><User size={64} className="text-charcoal/15" /></div>
                  )}
                </div>
                <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-gold-warm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl text-white max-w-[160px] md:max-w-[200px] -rotate-3 border border-white/20">
                  <p className="text-2xl md:text-3xl font-bold mb-2">120+</p>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">משפחות שותפות לדרך</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto py-20 border-t border-charcoal/5">
            <Quote className="mx-auto text-gold-warm/20 mb-8" size={64} />
            <h3 className="text-3xl font-serif font-bold text-charcoal mb-6 italic">
              &quot;בשמחת השכונה, בשמחת הקהילה, אנו מוצאים את שמחתנו האישית.&quot;
            </h3>
            <p className="text-charcoal/40 font-bold uppercase tracking-[0.3em] text-sm">הרב אייל מרום</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
