import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  MapPin, 
  Phone, 
  Heart, 
  BookOpen, 
  ChevronDown,
  PhoneOff,
  Coffee,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  Youtube,
  Instagram,
  Video,
  Users,
  Briefcase,
  Settings,
  Coins,
  HandCoins,
  Eye,
  Type,
  SunMoon,
  Accessibility,
  Stars,
  Calendar,
  ShieldCheck,
  Trophy,
  Zap,
  Quote,
  Sunrise,
  Sunset,
  Moon,
  UtensilsCrossed,
  Droplets
} from "lucide-react";
import * as Icons from "lucide-react";
import { SYNAGOGUE_INFO } from "./constants";
import { Separator } from "@/components/ui/separator";
import { AdminPanel } from "./components/AdminPanel";
import { DonationPage } from "./components/DonationPage";
import { AboutPage } from "./components/AboutPage";
import { AnnouncementPopup } from "./components/AnnouncementPopup";
import { db, handleFirestoreError, OperationType } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { getCurrentJewishContext, JewishContext, getShabbatWeeklyInfo, ShabbatWeeklyInfo } from "./services/jewishCalendar";

// TikTok Icon Component (since Lucide doesn't have it)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.21-1.35 2.06-.11.97.31 1.99 1.13 2.53.61.4 1.39.52 2.1.44.91-.07 1.7-.64 2.1-1.47.31-.58.45-1.27.43-1.93-.06-3.13-.04-6.26-.04-9.39z"/>
  </svg>
);

function LessonsView({ lessons, onBack }: { lessons: any[], onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <button onClick={onBack} className="flex items-center gap-2 text-charcoal/40 font-bold mb-12 hover:text-charcoal transition-colors">
          <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
        </button>
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">שיעורי תורה</h2>
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
                className="bg-alabaster p-10 rounded-[3rem] border border-charcoal/5 hover:border-gold-warm/30 transition-all group shadow-sm hover:shadow-xl"
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
            <div className="col-span-full text-center py-32 bg-alabaster rounded-[3rem] border border-dashed border-charcoal/10">
              <BookOpen className="mx-auto text-charcoal/10 mb-4" size={64} />
              <p className="text-charcoal/40 font-serif italic text-xl">בקרוב יעודכנו כאן זמני השיעורים החדשים...</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MemorialsView({ dedications, memorials, onBack }: { dedications: any[], memorials: any[], onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-charcoal min-h-screen text-white pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 font-bold mb-12 hover:text-white transition-colors">
          <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
        </button>
        
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-4xl font-bold mb-12 flex items-center gap-4">
              <Heart className="text-gold-warm" size={40} /> הקדשות וזכויות
            </h2>
            <div className="space-y-6">
              {dedications.length > 0 ? (
                dedications.map((dedication: any, idx: number) => (
                  <motion.div 
                    key={dedication.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white/5 border p-8 rounded-[2.5rem] hover:bg-white/10 transition-all ${dedication.active ? 'border-gold-warm/40 bg-gold-warm/5' : 'border-white/10'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-2xl leading-relaxed font-serif italic">"{dedication.content}"</p>
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
            <h2 className="text-4xl font-bold mb-12 flex items-center gap-4">
              <Users className="text-gold-warm" size={40} /> לוח אזכרות
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-10 space-y-6">
                {memorials.length > 0 ? (
                  memorials.map((memorial: any, idx: number) => (
                    <motion.div 
                      key={memorial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex justify-between items-center py-6 px-8 -mx-8 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all ${memorial.today ? 'bg-gold-warm/10 border-gold-warm/20' : ''}`}
                    >
                      <div className="flex items-center gap-6">
                        {memorial.today && <Calendar className="text-gold-warm shrink-0" size={20} />}
                        <div>
                            <p className={`font-bold text-2xl ${memorial.today ? 'text-gold-warm' : 'text-white'}`}>{memorial.name}</p>
                            {memorial.description && <p className="text-white/40 text-lg">{memorial.description}</p>}
                        </div>
                      </div>
                      <div className={`font-bold text-lg px-6 py-3 rounded-full ${memorial.today ? 'bg-gold-warm text-white' : 'bg-gold-warm/10 text-gold-warm'}`}>
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
  );
}

function BusinessView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-screen pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <button onClick={onBack} className="flex items-center gap-2 text-charcoal/40 font-bold mb-12 hover:text-charcoal transition-colors">
          <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
        </button>

        <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-charcoal/5 relative overflow-hidden mb-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-charcoal leading-tight">
                {SYNAGOGUE_INFO.community.businessDirectory.title}
              </h2>
              <p className="text-xl text-charcoal/60 leading-relaxed mb-10">
                {SYNAGOGUE_INFO.community.businessDirectory.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.a 
                  href={`https://wa.me/972537553665?text=${encodeURIComponent(SYNAGOGUE_INFO.community.businessDirectory.whatsappMessage)}`}
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-4 bg-charcoal text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-gold-warm transition-all"
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
                <div key={idx} className="aspect-square bg-alabaster rounded-3xl flex flex-col items-center justify-center p-8 text-center border border-charcoal/5 hover:border-gold-warm/20 transition-all">
                  <item.icon className="text-gold-warm mb-4" size={40} />
                  <span className="font-bold text-charcoal/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="text-3xl font-serif font-bold text-center text-charcoal/40 uppercase tracking-widest">מדריך העסקים של הקהילה</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {SYNAGOGUE_INFO.community.businessDirectory.list.map((biz, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-lg group"
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
                <div className="p-8">
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
  );
}

function YouthView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-blue min-h-screen text-white pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 font-bold mb-12 hover:text-white transition-colors">
          <ArrowRight size={20} className="rotate-180" /> חזרה לדף הבית
        </button>

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
              href={`https://wa.me/972537553665?text=${encodeURIComponent(SYNAGOGUE_INFO.youthSection.whatsappMessage)}`}
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
                "לעצור את המירוץ, להטעין את הנשמה. פשוט בואו."
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
              {SYNAGOGUE_INFO.youthSection.gallery.map((img, idx) => (
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
                   "{SYNAGOGUE_INFO.rabbiQuote}"
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
  );
}
function JewishContextBanner() {
  const context = getCurrentJewishContext();
  if ((context.period === 'regular' || context.period === 'omer') && !context.isUrgent) return null;

  const getThemeColors = () => {
    switch (context.period) {
      case 'purim': return 'bg-purple-600/10 border-purple-600/20 text-purple-700';
      case 'pesach': return 'bg-blue-600/10 border-blue-600/20 text-blue-700';
      case 'rosh-hashana':
      case 'yom-kippur': return 'bg-emerald-600/10 border-emerald-600/20 text-emerald-700';
      case 'omer': return 'bg-gold-warm/10 border-gold-warm/20 text-gold-warm';
      default: return 'bg-gold-warm/10 border-gold-warm/20 text-gold-warm';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-3 border px-6 py-2 rounded-full mb-8 backdrop-blur-sm shadow-sm ${getThemeColors()}`}
    >
      <div className={`w-2 h-2 rounded-full animate-pulse ${getThemeColors().split(' ')[2].replace('text-', 'bg-')}`} />
      <span className="text-sm font-bold leading-none tracking-tight">
        {context.title}: {context.subtitle}
      </span>
      {context.isUrgent && (
        <span className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-bounce mr-2">
          דחוף
        </span>
      )}
    </motion.div>
  );
}

function GlobalCampaignProgress({ campaigns }: { campaigns: any[] }) {
  const activeCampaign = campaigns.find(c => c.target > 0);
  if (!activeCampaign) return null;

  const percentage = Math.min(100, (activeCampaign.current / activeCampaign.target) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 mb-20"
    >
      <div className="bg-charcoal text-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/10 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold-warm/20 text-gold-warm px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Trophy size={12} /> יעד קהילתי
              </div>
              <h3 className="text-4xl md:text-5xl font-bold mb-2">{activeCampaign.title}</h3>
              <p className="text-white/40 font-bold max-w-md">{activeCampaign.description}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">גויס עד כה</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-sans tracking-tight">₪{activeCampaign.current?.toLocaleString()}</span>
                <span className="text-white/20 text-lg">/ ₪{activeCampaign.target?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-gold-warm to-amber-500 rounded-full relative"
                >
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_1s_linear_infinite]" />
                </motion.div>
             </div>
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                <span>0%</span>
                <span className="text-gold-warm">{percentage.toFixed(1)}% הושלמו</span>
                <span>100%</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AccessibilityMenu({ 
  fontSize, 
  setFontSize, 
  highContrast, 
  setHighContrast,
  onClose
}: { 
  fontSize: number, 
  setFontSize: React.Dispatch<React.SetStateAction<number>>,
  highContrast: boolean,
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-20 left-0 w-72 bg-white p-6 rounded-3xl shadow-2xl border border-charcoal/5 flex flex-col gap-6 z-[100]"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-charcoal">הגדרות תצוגה</h4>
        <button onClick={onClose} className="text-xs text-charcoal/30 hover:text-charcoal uppercase font-bold tracking-widest">סגור</button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-charcoal/60">גודל טקסט</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(prev => Math.max(80, prev - 10))} className="w-8 h-8 flex items-center justify-center bg-charcoal/5 rounded-lg hover:bg-charcoal/10">-</button>
            <span className="w-10 text-center font-bold">{fontSize}%</span>
            <button onClick={() => setFontSize(prev => Math.min(150, prev + 10))} className="w-8 h-8 flex items-center justify-center bg-charcoal/5 rounded-lg hover:bg-charcoal/10">+</button>
          </div>
        </div>
        
        <Separator className="bg-charcoal/5" />
        
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-charcoal/60">ניגודיות גבוהה</span>
          <button 
            onClick={() => setHighContrast(!highContrast)} 
            className={`p-2 w-12 h-12 flex items-center justify-center rounded-xl transition-all ${highContrast ? 'bg-charcoal text-white shadow-lg' : 'bg-charcoal/5 text-charcoal/40'}`}
          >
            <SunMoon size={20} />
          </button>
        </div>
      </div>

      <button 
        onClick={() => { setFontSize(100); setHighContrast(false); }}
        className="mt-2 py-3 bg-charcoal/5 rounded-xl text-xs text-charcoal/40 font-bold hover:bg-charcoal/10 transition-colors"
      >
        איפוס כל ההגדרות
      </button>
    </motion.div>
  );
}

function DynamicScheduleWidget({ prayers }: { prayers: any[] }) {
  const [nextEvent, setNextEvent] = useState(SYNAGOGUE_INFO.schedule.prayers[0]);

  useEffect(() => {
    const updateNextEvent = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const sourcePrayers = prayers.length > 0 ? prayers : SYNAGOGUE_INFO.schedule.prayers;
      
      const events = sourcePrayers.map(p => {
        const [hours, minutes] = p.time.split(':').map(Number);
        return { ...p, minutes: hours * 60 + minutes };
      });

      const next = events.find(e => e.minutes > currentMinutes) || events[0];
      setNextEvent(next);
    };

    updateNextEvent();
    const interval = setInterval(updateNextEvent, 60000);
    return () => clearInterval(interval);
  }, [prayers]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/95 backdrop-blur-md border border-gold-warm/30 rounded-3xl p-8 shadow-2xl max-w-md mx-auto relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-warm/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      <div className="relative z-10">
        <div className="flex items-center gap-5 mb-4">
          <div className="w-14 h-14 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm">
            <Clock size={32} />
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gold-warm uppercase tracking-[0.2em] mb-1">התפילה הקרובה</p>
            <h3 className="text-2xl font-serif font-bold text-charcoal">{nextEvent.name}</h3>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-5xl font-bold font-mono tracking-tighter text-charcoal">{nextEvent.time}</span>
          <a href="#schedule" className="text-sm font-bold text-gold-warm hover:underline flex items-center gap-1">
            לכל הזמנים <ArrowRight size={14} />
          </a>
        </div>
        {nextEvent.note && (
          <p className="mt-4 text-sm text-charcoal/50 italic font-serif border-t border-charcoal/5 pt-3">
            * {nextEvent.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'donation' | 'lessons' | 'memorials' | 'young' | 'business' | 'about'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [dedications, setDedications] = useState<any[]>([]);
  const [memorials, setMemorials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState<any[]>([]);
  const [jewishContext, setJewishContext] = useState<JewishContext>(getCurrentJewishContext());
  const [shabbatInfo, setShabbatInfo] = useState<ShabbatWeeklyInfo | null>(null);

  // Accessibility State Rooted in App
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Israeli Simple User: Accessibility and Clear Layout
  useEffect(() => {
    // Force direct fonts for accessibility if high-contrast is on
    const style = document.createElement('style');
    style.innerHTML = `
      .high-contrast {
        --color-alabaster: #ffffff;
        --color-charcoal: #000000;
        --color-gold-warm: #000000;
        --color-slate-blue: #000000;
      }
      .high-contrast * {
        background-color: white !important;
        color: black !important;
        border-color: black !important;
        box-shadow: none !important;
        text-shadow: none !important;
        font-family: var(--font-sans) !important;
      }
      .high-contrast button, .high-contrast a {
        border: 2px solid black !important;
        padding: 4px !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const qPrayers = query(collection(db, 'prayers'), orderBy('time'));
    const unsubscribePrayers = onSnapshot(qPrayers, (snapshot) => {
      if (!snapshot.empty) {
        setPrayers(snapshot.docs.map(doc => doc.data()));
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'prayers'));

    const qLessons = query(collection(db, 'lessons'));
    const unsubscribeLessons = onSnapshot(qLessons, (snapshot) => {
      setLessons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'lessons'));

    const qDedications = query(collection(db, 'dedications'));
    const unsubscribeDedications = onSnapshot(qDedications, (snapshot) => {
      setDedications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'dedications'));

    const qMemorials = query(collection(db, 'memorials'));
    const unsubscribeMemorials = onSnapshot(qMemorials, (snapshot) => {
      setMemorials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'memorials'));

    const qCampaigns = query(collection(db, 'campaigns'));
    const unsubscribeCampaigns = onSnapshot(qCampaigns, (snapshot) => {
      if (!snapshot.empty) {
        setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setCampaigns(SYNAGOGUE_INFO.philanthropy.activeCampaigns);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'campaigns'));

    const qImpactStats = query(collection(db, 'impact_stats'), orderBy('order'));
    const unsubscribeImpactStats = onSnapshot(qImpactStats, (snapshot) => {
      if (!snapshot.empty) {
        setImpactStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        setImpactStats(SYNAGOGUE_INFO.philanthropy.impact);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'impact_stats'));

    // Fetch weekly parasha info
    getShabbatWeeklyInfo().then(setShabbatInfo).catch(() => {});

    const interval = setInterval(() => {
      setJewishContext(getCurrentJewishContext());
    }, 60000);

    // Refresh parasha info every hour
    const parashaInterval = setInterval(() => {
      getShabbatWeeklyInfo().then(setShabbatInfo).catch(() => {});
    }, 3600000);

    return () => {
      clearInterval(interval);
      clearInterval(parashaInterval);
      unsubscribePrayers();
      unsubscribeLessons();
      unsubscribeDedications();
      unsubscribeMemorials();
      unsubscribeCampaigns();
      unsubscribeImpactStats();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-gold-warm/20 relative" dir="rtl">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-charcoal flex flex-col p-8 sm:hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                  <BookOpen size={20} />
                </div>
                <span className="text-xl font-serif font-bold text-white">{SYNAGOGUE_INFO.name}</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white"
              >
                <Icons.X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-2xl font-bold text-white/60">
              <button 
                onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}
                className={`text-right py-4 border-b border-white/5 ${view === 'home' ? 'text-gold-warm' : ''}`}
              >
                דף הבית
              </button>
              <button 
                onClick={() => { setView('lessons'); setIsMobileMenuOpen(false); }}
                className={`text-right py-4 border-b border-white/5 ${view === 'lessons' ? 'text-gold-warm' : ''}`}
              >
                שיעורי תורה
              </button>
              <button 
                onClick={() => { setView('memorials'); setIsMobileMenuOpen(false); }}
                className={`text-right py-4 border-b border-white/5 ${view === 'memorials' ? 'text-gold-warm' : ''}`}
              >
                הקדשות ואזכרות
              </button>
              <button 
                onClick={() => { setView('young'); setIsMobileMenuOpen(false); }}
                className={`text-right py-4 border-b border-white/5 ${view === 'young' ? 'text-gold-warm' : ''}`}
              >
                שיעור הצעירים
              </button>
              <button 
                onClick={() => { setView('business'); setIsMobileMenuOpen(false); }}
                className={`text-right py-4 border-b border-white/5 ${view === 'business' ? 'text-gold-warm' : ''}`}
              >
                עסקים בקהילה
              </button>
              <button 
                onClick={() => { setView('about'); setIsMobileMenuOpen(false); }}
                className={`text-right py-4 border-b border-white/5 ${view === 'about' ? 'text-gold-warm' : ''}`}
              >
                אודות הקהילה
              </button>
              <button 
                onClick={() => { setView('donation'); setIsMobileMenuOpen(false); }}
                className="text-right py-4 text-gold-warm mt-4 flex items-center justify-end gap-3"
              >
                <HandCoins size={28} /> תמיכה ושותפות
              </button>
            </div>

            <div className="mt-auto pt-10 border-t border-white/5 space-y-6">
              <div className="flex justify-center gap-8">
                <a href={SYNAGOGUE_INFO.social.tiktok} className="text-white/20"><TikTokIcon className="w-6 h-6" /></a>
                <a href={SYNAGOGUE_INFO.social.youtube} className="text-white/20"><Youtube size={24} /></a>
                <a href={SYNAGOGUE_INFO.social.instagram} className="text-white/20"><Instagram size={24} /></a>
              </div>
              <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.4em]">קהילת נאות אשלים</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="sticky top-0 z-50 bg-alabaster/95 backdrop-blur-lg border-b border-charcoal/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
          <div className="flex justify-between items-center">
            {/* לוגו (ימין) */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-12 h-12 bg-charcoal rounded-xl flex items-center justify-center text-alabaster shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-charcoal">{SYNAGOGUE_INFO.name}</span>
            </div>

            {/* תפריט מיקרו-קופי (אמצע/שמאל) - Desktop Only */}
            <div className="hidden lg:flex items-center gap-1 text-[13px] font-bold text-charcoal/60">
              <button onClick={() => setView('home')} className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${view === 'home' ? 'text-gold-warm' : ''}`}>זמנים</button>
              <button onClick={() => setView('about')} className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${view === 'about' ? 'text-gold-warm' : ''}`}>אודות</button>
              <button onClick={() => setView('lessons')} className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${view === 'lessons' ? 'text-gold-warm' : ''}`}>שיעורים</button>
              <button onClick={() => setView('memorials')} className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${view === 'memorials' ? 'text-gold-warm' : ''}`}>הקדשות</button>
              <button onClick={() => setView('young')} className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${view === 'young' ? 'text-gold-warm' : ''}`}>השיעור לצעירים</button>
              <button onClick={() => setView('business')} className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${view === 'business' ? 'text-gold-warm' : ''}`}>עסקים בקהילה</button>
            </div>

            {/* כפתור פעולה (CTA) */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                className={`p-3 rounded-full transition-all ${isAccessMenuOpen ? 'bg-charcoal text-white shadow-lg' : 'bg-charcoal/5 text-charcoal/40 hover:bg-charcoal/10'}`}
              >
                <Accessibility size={20} />
              </button>
              
              <motion.button 
                onClick={() => setView('donation')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex bg-charcoal text-white px-6 py-3 rounded-full font-bold text-sm items-center gap-2 hover:bg-gold-warm transition-all shadow-lg"
              >
                <Coins size={18} /> תרומה לבית הכנסת
              </motion.button>
              <motion.a 
                href={SYNAGOGUE_INFO.updatesWhatsApp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex bg-gold-warm/10 text-gold-warm border border-gold-warm/20 px-6 py-3 rounded-full font-bold text-sm items-center gap-2 hover:bg-gold-warm hover:text-white transition-all shadow-sm"
              >
                <MessageCircle size={18} /> קבלת עדכונים
              </motion.a>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden w-12 h-12 bg-charcoal/5 rounded-xl flex items-center justify-center text-charcoal hover:bg-charcoal/10 transition-all"
              >
                <Icons.Menu size={24} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isAccessMenuOpen && (
              <AccessibilityMenu 
                fontSize={fontSize} 
                setFontSize={setFontSize} 
                highContrast={highContrast} 
                setHighContrast={setHighContrast}
                onClose={() => setIsAccessMenuOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </nav>

      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}

      {view === 'donation' ? (
        <DonationPage 
          onBack={() => setView('home')} 
          campaigns={campaigns} 
          impactStats={impactStats} 
        />
      ) : view === 'about' ? (
        <AboutPage onBack={() => setView('home')} />
      ) : view === 'lessons' ? (
        <LessonsView lessons={lessons} onBack={() => setView('home')} />
      ) : view === 'memorials' ? (
        <MemorialsView dedications={dedications} memorials={memorials} onBack={() => setView('home')} />
      ) : view === 'young' ? (
        <YouthView onBack={() => setView('home')} />
      ) : view === 'business' ? (
        <BusinessView onBack={() => setView('home')} />
      ) : (
        <>
        <main className="flex-grow">
        {/* סקציה 1: המגנט הראשי (The Hero Section) */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-105"
              src="https://cdn.pixabay.com/video/2022/08/05/127447-737069612_large.mp4"
            />
            <div className="absolute inset-0 bg-charcoal/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/20 to-charcoal/80" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <JewishContextBanner />
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black mb-8 tracking-tight text-white leading-none drop-shadow-2xl">
                {SYNAGOGUE_INFO.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-10 md:mb-16 leading-relaxed max-w-3xl mx-auto italic font-serif drop-shadow">
                {SYNAGOGUE_INFO.tagline}
              </p>
              
              <div className="mb-16">
                <DynamicScheduleWidget prayers={prayers} />
              </div>

              <GlobalCampaignProgress campaigns={campaigns} />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 px-4">
                {impactStats.map((stat: any, idx: number) => {
                  const Icon = (Icons as any)[stat.icon] || Heart;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-sm text-center group hover:bg-white/20 transition-all"
                    >
                      <div className="w-10 h-10 bg-gold-warm/10 rounded-xl flex items-center justify-center text-gold-warm mx-auto mb-4 group-hover:bg-gold-warm group-hover:text-white transition-all">
                        <Icon size={20} />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{stat.title}</div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Featured Daily/Weekly Dedications */}
              {(dedications.some((d: any) => d.active) || memorials.some((m: any) => m.today)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto mb-16 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] text-white/80"
                >
                  <div className="flex items-center gap-3 justify-center mb-4">
                    <Stars className="text-gold-warm" size={20} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gold-warm/90">היום בקהילה</span>
                    <Stars className="text-gold-warm" size={20} />
                  </div>
                  <div className="space-y-4">
                    {dedications.filter((d: any) => d.active).map((d: any) => (
                      <div key={d.id} className="text-lg font-serif italic leading-relaxed">
                        "{d.content}" {d.donorName && <span className="text-sm font-bold text-charcoal/40 not-italic">({d.donorName})</span>}
                      </div>
                    ))}
                    {memorials.filter((m: any) => m.today).map((m: any) => (
                      <div key={m.id} className="flex items-center justify-center gap-3 font-bold text-charcoal">
                        <div className="w-2 h-2 bg-charcoal rounded-full" />
                        <span>אזכרה היום: {m.name}</span>
                        <div className="w-2 h-2 bg-charcoal rounded-full" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex flex-wrap justify-center gap-8 mb-12">
                <motion.a 
                  href={SYNAGOGUE_INFO.social.tiktok}
                  target="_blank"
                  whileHover={{ scale: 1.1, color: "#000" }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <TikTokIcon className="w-8 h-8" />
                </motion.a>
                <motion.a 
                  href={SYNAGOGUE_INFO.social.youtube}
                  target="_blank"
                  whileHover={{ scale: 1.1, color: "#FF0000" }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Youtube size={32} />
                </motion.a>
                <motion.a 
                  href={SYNAGOGUE_INFO.social.instagram}
                  target="_blank"
                  whileHover={{ scale: 1.1, color: "#E1306C" }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Instagram size={32} />
                </motion.a>
              </div>
            </motion.div>
          </div>

        </section>

        {/* סקציה: פרשת השבוע */}
        {shabbatInfo && (
          <section className="py-16 bg-gradient-to-b from-charcoal to-charcoal/95 text-white border-t border-charcoal/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 right-10 w-64 h-64 border border-white/20 rounded-full" />
              <div className="absolute bottom-10 left-10 w-48 h-48 border border-white/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full" />
            </div>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              {/* פרשת השבוע + תאריך */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 px-5 py-2 rounded-full mb-6">
                  <Calendar size={14} className="text-gold-warm" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">{shabbatInfo.hebrewDate}</span>
                </div>
                <div className="text-4xl md:text-6xl font-serif font-black text-gold-warm leading-tight">
                  {shabbatInfo.parashaName}
                </div>
                {shabbatInfo.pirkeiAvotChapter && (
                  <p className="mt-4 text-lg text-white/60 font-bold">
                    <BookOpen size={16} className="inline ml-2 text-gold-warm" />
                    פרקי אבות — פרק {
                      ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳'][shabbatInfo.pirkeiAvotChapter - 1]
                    }
                  </p>
                )}
              </div>

              {/* תזכורות הלכתיות */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                {/* תוספת עונתית */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Droplets size={16} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">תוספת בתפילה</span>
                  </div>
                  <p className="text-lg font-bold text-white/90">{shabbatInfo.seasonalPrayer}</p>
                </div>

                {/* ותן ברכה / טל ומטר */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Stars size={16} className="text-gold-warm" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">ברכת השנים</span>
                  </div>
                  <p className="text-lg font-bold text-white/90">{shabbatInfo.talUmatar}</p>
                </div>

                {/* ספירת העומר / מידע נוסף */}
                {shabbatInfo.omerCount ? (
                  <div className="bg-gold-warm/10 border border-gold-warm/20 rounded-2xl p-5 text-center sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap size={16} className="text-gold-warm" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-warm/60">ספירת העומר</span>
                    </div>
                    <p className="text-2xl font-black text-gold-warm">יום {shabbatInfo.omerCount.day}</p>
                    <p className="text-xs text-white/40 mt-1">{shabbatInfo.omerCount.formatted}</p>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock size={16} className="text-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">מתעדכן אוטומטית</span>
                    </div>
                    <p className="text-sm font-bold text-white/50">הפרשה והזמנים מתעדכנים כל שבוע</p>
                  </div>
                )}
              </div>

              {/* שקט בתפילה — משולב בבלוק */}
              <div className="max-w-xl mx-auto text-center border-t border-white/10 pt-8">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 border border-white/15 rounded-full flex items-center justify-center text-white/50">
                    <PhoneOff size={28} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white/80 mb-2">{SYNAGOGUE_INFO.silenceSection.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{SYNAGOGUE_INFO.silenceSection.description}</p>
              </div>
            </div>
          </section>
        )}

        {/* סקציה: ניווט מהיר לתכני הקהילה (Compact Nav Grid) */}
        <section className="py-24 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setView('lessons')}
                className="bg-alabaster p-10 rounded-[3rem] border border-charcoal/5 hover:border-gold-warm/30 transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-16 h-16 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm group-hover:bg-gold-warm group-hover:text-white transition-all mb-8">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">שיעורי תורה</h3>
                <p className="text-charcoal/50 mb-8 leading-relaxed">כל זמני השיעורים, הנושאים והמרצים במקום אחד.</p>
                <span className="text-gold-warm font-bold flex items-center gap-2">צפייה בכל השיעורים <ArrowLeft size={16} className="rotate-180" /></span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setView('memorials')}
                className="bg-charcoal p-10 rounded-[3rem] text-white transition-all cursor-pointer group shadow-xl"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-gold-warm mb-8">
                  <Heart size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">הקדשות ואזכרות</h3>
                <p className="text-white/50 mb-8 leading-relaxed">לוח אזכרות עדכני ואפשרויות הקדשה לזכות ולעילוי נשמה.</p>
                <span className="text-gold-warm font-bold flex items-center gap-2">ללוח המלא <ArrowLeft size={16} className="rotate-180" /></span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setView('young')}
                className="bg-slate-blue p-10 rounded-[3rem] text-white transition-all cursor-pointer group shadow-xl"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-gold-warm mb-8">
                  <Coffee size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">שיעור הצעירים</h3>
                <p className="text-white/50 mb-8 leading-relaxed">כל הפרטים על המפגש השבועי לצעירי השכונה.</p>
                <span className="text-white font-bold flex items-center gap-2">לפרטים והרשמה <ArrowLeft size={16} className="rotate-180" /></span>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                onClick={() => setView('business')}
                className="bg-alabaster p-10 rounded-[3rem] border border-charcoal/5 hover:border-gold-warm/30 transition-all cursor-pointer group shadow-sm"
              >
                <div className="w-16 h-16 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm group-hover:bg-gold-warm group-hover:text-white transition-all mb-8">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">עסקים בקהילה</h3>
                <p className="text-charcoal/50 mb-8 leading-relaxed">תמיכה בעסקים מקומיים וחיזוק הכלכלה הקהילתית.</p>
                <span className="text-gold-warm font-bold flex items-center gap-2">למדריך המלא <ArrowLeft size={16} className="rotate-180" /></span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* סקציה: לוח זמנים */}
        <section id="schedule" className="py-24 bg-background border-t border-charcoal/5">
          <div className="max-w-5xl mx-auto px-4 mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">לוח זמנים ושיעורים</h2>
            <p className="text-charcoal/40 text-center mb-16 text-lg">{SYNAGOGUE_INFO.schedule.note}</p>

            {/* לוח ימי חול */}
            <div className="mb-12 bg-white rounded-[3rem] shadow-xl overflow-hidden border border-charcoal/5">
              <div className="bg-charcoal text-white p-6 px-10 flex items-center gap-3">
                <Clock size={22} className="text-gold-warm" />
                <h3 className="text-xl font-bold">ימי חול</h3>
              </div>
              <div className="p-8 md:p-12">
                <div className="space-y-8">
                  {SYNAGOGUE_INFO.schedule.prayers.map((prayer, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <div className="text-right">
                        <span className="text-xl font-bold group-hover:text-gold-warm transition-colors block">{prayer.name}</span>
                        {prayer.note && <span className="text-sm text-charcoal/40 italic">{prayer.note}</span>}
                      </div>
                      <div className="flex-grow border-b border-dotted border-charcoal/10 mx-8" />
                      <span className="text-3xl font-bold font-mono tracking-tighter text-charcoal">{prayer.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* לוח שבת קודש */}
            <div className="mb-12 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gold-warm/20">
              <div className="bg-gold-warm text-white p-6 px-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Stars size={22} />
                  <h3 className="text-xl font-bold">שבת קודש</h3>
                </div>
              </div>

              <div className="divide-y divide-charcoal/5">
                {/* ערב שבת */}
                <div className="p-8 md:px-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Sunset size={20} className="text-gold-warm" />
                    <h4 className="text-lg font-bold text-gold-warm">ערב שבת</h4>
                  </div>
                  {SYNAGOGUE_INFO.schedule.shabbat.erevShabbat.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <span className="text-lg font-bold group-hover:text-gold-warm transition-colors">{item.name}</span>
                      <div className="flex-grow border-b border-dotted border-charcoal/10 mx-6" />
                      <span className="text-2xl font-bold font-mono tracking-tighter text-charcoal">{item.time}</span>
                    </div>
                  ))}
                </div>

                {/* שחרית של שבת */}
                <div className="p-8 md:px-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Sunrise size={20} className="text-gold-warm" />
                    <h4 className="text-lg font-bold text-gold-warm">שחרית של שבת</h4>
                  </div>
                  {SYNAGOGUE_INFO.schedule.shabbat.shacharit.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group mb-4">
                      <div className="text-right">
                        <span className="text-lg font-bold group-hover:text-gold-warm transition-colors block">{item.name}</span>
                        {item.note && <span className="text-sm text-charcoal/40 italic">{item.note}</span>}
                      </div>
                      <div className="flex-grow border-b border-dotted border-charcoal/10 mx-6" />
                      <span className="text-2xl font-bold font-mono tracking-tighter text-charcoal">{item.time}</span>
                    </div>
                  ))}
                  <div className="mt-4 space-y-3 pr-4 border-r-2 border-gold-warm/20">
                    {SYNAGOGUE_INFO.schedule.shabbat.shacharitExtras.map((extra) => (
                      <div key={extra.id} className="flex items-center gap-3 text-charcoal/70">
                        {extra.type === 'seuda' ? <UtensilsCrossed size={16} className="text-gold-warm shrink-0" /> : <BookOpen size={16} className="text-gold-warm shrink-0" />}
                        <span className="font-bold">{extra.title}</span>
                        {extra.lecturer && <span className="text-sm text-charcoal/40">מפי {extra.lecturer}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* תפילות מנחה */}
                <div className="p-8 md:px-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock size={20} className="text-gold-warm" />
                    <h4 className="text-lg font-bold text-gold-warm">תפילות מנחה</h4>
                  </div>
                  <div className="space-y-6">
                    {SYNAGOGUE_INFO.schedule.shabbat.mincha.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-center group">
                          <span className="text-lg font-bold group-hover:text-gold-warm transition-colors">{item.name}</span>
                          <div className="flex-grow border-b border-dotted border-charcoal/10 mx-6" />
                          <span className="text-2xl font-bold font-mono tracking-tighter text-charcoal">{item.time}</span>
                        </div>
                        {item.afterNote && (
                          <p className="text-sm text-charcoal/50 italic mt-1 pr-2">* {item.afterNote}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* מוצאי שבת */}
                <div className="p-8 md:px-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Moon size={20} className="text-gold-warm" />
                    <h4 className="text-lg font-bold text-gold-warm">מוצאי שבת</h4>
                  </div>
                  <div className="space-y-4">
                    {SYNAGOGUE_INFO.schedule.shabbat.motzeiShabbat.map((item) => (
                      <div key={item.id} className="flex justify-between items-center group">
                        <div className="text-right">
                          <span className="text-lg font-bold group-hover:text-gold-warm transition-colors block">{item.name}</span>
                          {item.note && <span className="text-sm text-charcoal/40 italic">{item.note}</span>}
                        </div>
                        {item.time && (
                          <>
                            <div className="flex-grow border-b border-dotted border-charcoal/10 mx-6" />
                            <span className="text-2xl font-bold font-mono tracking-tighter text-charcoal">{item.time}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* לימוד נוסף + צאת שבת */}
                <div className="p-8 md:px-12 bg-charcoal/[0.02]">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen size={20} className="text-gold-warm" />
                    <h4 className="text-lg font-bold text-gold-warm">לימוד נוסף</h4>
                  </div>
                  <p className="text-charcoal/70 font-bold mb-4">{SYNAGOGUE_INFO.schedule.shabbat.limudNosaf.description}</p>
                  <div className="inline-flex items-center gap-3 bg-charcoal text-white px-6 py-3 rounded-full">
                    <Clock size={16} className="text-gold-warm" />
                    <span className="font-bold">צאת השבת ({SYNAGOGUE_INFO.schedule.shabbat.limudNosaf.tzetNote}): {SYNAGOGUE_INFO.schedule.shabbat.limudNosaf.tzetShabbat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* שיעור צעירים יום שני */}
            <div className="mb-12 bg-white rounded-[3rem] shadow-xl overflow-hidden border border-charcoal/5 text-right">
              <div className="bg-slate-blue text-white p-6 px-10 flex items-center gap-3">
                <Coffee size={22} />
                <h3 className="text-xl font-bold">שיעור שבועי</h3>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-gold-warm/10 text-gold-warm px-4 py-1 rounded-full text-sm font-bold">יום שני</span>
                      <h4 className="text-2xl font-bold">{SYNAGOGUE_INFO.schedule.mondaySpecial.title}</h4>
                    </div>
                    <p className="text-charcoal/60 leading-relaxed mb-6">
                      {SYNAGOGUE_INFO.schedule.mondaySpecial.description}
                    </p>
                    <div className="flex items-center gap-6 text-sm font-bold text-charcoal/40">
                      <span className="flex items-center gap-2"><Heart size={16} /> {SYNAGOGUE_INFO.youthSection.rabbiName}</span>
                      <span className="flex items-center gap-2"><Coffee size={16} /> קפה וכיבוד</span>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-4xl font-bold font-mono tracking-tighter text-gold-warm">{SYNAGOGUE_INFO.schedule.mondaySpecial.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* סעודות שבת */}
            <div className="bg-gold-warm/5 rounded-[3rem] border border-gold-warm/15 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <UtensilsCrossed size={24} className="text-gold-warm" />
                <h3 className="text-2xl font-bold text-charcoal">{SYNAGOGUE_INFO.seudot.title}</h3>
              </div>
              <p className="text-charcoal/60 mb-8 leading-relaxed">{SYNAGOGUE_INFO.seudot.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SYNAGOGUE_INFO.seudot.list.map((seuda, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] border border-charcoal/5 shadow-sm">
                    <h4 className="text-xl font-bold text-charcoal mb-2">{seuda.name}</h4>
                    <span className="text-sm font-bold text-gold-warm block mb-3">{seuda.when}</span>
                    <p className="text-charcoal/50 leading-relaxed">{seuda.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* סקציה: תרומה */}
        <section className="py-20 bg-gradient-to-b from-charcoal/[0.03] to-background border-t border-charcoal/5">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-charcoal">רוצה להיות שותף בפעילות?</h3>
              <p className="text-charcoal/50 mb-10 leading-relaxed">כל תרומה מחזקת את הקהילה, את השיעורים ואת הפעילות השבועית בצריף הקדוש.</p>
              <motion.button 
                onClick={() => setView('donation')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-charcoal text-white px-10 py-5 rounded-full font-bold text-xl flex items-center gap-3 shadow-2xl hover:bg-gold-warm transition-all mx-auto"
              >
                <HandCoins size={24} /> תרומה ותמיכה בפעילות
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-charcoal text-white pt-32 pb-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-16 mb-24">
            {/* Column 1: Brand & Spirit */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gold-warm rounded-xl flex items-center justify-center text-charcoal shadow-inner">
                  <BookOpen size={24} />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">{SYNAGOGUE_INFO.name}</span>
              </div>
              <p className="text-white/40 leading-relaxed mb-8 text-sm italic font-serif">
                "{SYNAGOGUE_INFO.subTagline}"
              </p>
              <div className="flex gap-4">
                {[
                  { icon: TikTokIcon, href: SYNAGOGUE_INFO.social.tiktok },
                  { icon: Youtube, href: SYNAGOGUE_INFO.social.youtube },
                  { icon: Instagram, href: SYNAGOGUE_INFO.social.instagram }
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    href={social.href}
                    whileHover={{ y: -3, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-gold-warm transition-colors"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-warm mb-8">ניווט מהיר</h3>
              <ul className="space-y-4">
                {[
                  { label: "דף הבית", view: 'home' },
                  { label: "שיעורי תורה", view: 'lessons' },
                  { label: "הקדשות ואזכרות", view: 'memorials' },
                  { label: "השיעור לצעירים", view: 'young' },
                  { label: "עסקים בקהילה", view: 'business' },
                  { label: "תרומה לבית הכנסת", view: 'donation' }
                ].map((item, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => { setView(item.view as any); window.scrollTo(0,0); }}
                      className="text-white/40 hover:text-white transition-colors text-sm font-medium"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-warm mb-8">יצירת קשר</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Phone size={18} className="text-gold-warm shrink-0" />
                  <div>
                    <span className="block text-xs text-white/30 uppercase tracking-widest mb-1">גבאי — {SYNAGOGUE_INFO.contact.gabbaiName}</span>
                    <a href={`tel:${SYNAGOGUE_INFO.contact.gabbai}`} className="text-sm font-bold hover:text-gold-warm transition-colors">{SYNAGOGUE_INFO.contact.gabbai}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone size={18} className="text-gold-warm shrink-0" />
                  <div>
                    <span className="block text-xs text-white/30 uppercase tracking-widest mb-1">הרב אייל מרום</span>
                    <a href={`tel:${SYNAGOGUE_INFO.contact.rabbi}`} className="text-sm font-bold hover:text-gold-warm transition-colors">{SYNAGOGUE_INFO.contact.rabbi}</a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <MessageCircle size={18} className="text-gold-warm shrink-0" />
                  <div>
                    <span className="block text-xs text-white/30 uppercase tracking-widest mb-1">וואטסאפ קהילה</span>
                    <a href={SYNAGOGUE_INFO.updatesWhatsApp} target="_blank" className="text-sm font-bold hover:text-gold-warm transition-colors">שלחו הודעה</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Location */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-warm mb-8">כתובתנו</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-8">
                {SYNAGOGUE_INFO.location}
              </p>
              <div className="flex flex-col gap-3">
                <motion.a 
                  href={SYNAGOGUE_INFO.contact.waze}
                  target="_blank"
                  className="flex items-center gap-3 text-sm font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all"
                >
                  <MapPin size={16} className="text-gold-warm" /> ניווט ב-Waze
                </motion.a>
                <motion.a 
                  href={SYNAGOGUE_INFO.contact.googleMaps}
                  target="_blank"
                  className="flex items-center gap-3 text-sm font-bold bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all"
                >
                  <ExternalLink size={16} className="text-gold-warm" /> Google Maps
                </motion.a>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p>© {new Date().getFullYear()} {SYNAGOGUE_INFO.name}. כל הזכויות שמורות.</p>
              <p className="hidden md:block">|</p>
              <p>מעוצב בחרדת קודש עבור קהילת נאות אשלים</p>
            </div>
            
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 hover:text-gold-warm transition-colors group"
            >
              <Settings size={14} className="group-hover:rotate-90 transition-transform" /> 
              <span>כניסת גבאי</span>
            </button>
          </div>
        </div>
      </footer>
      <AnnouncementPopup />
      </>
      )}
    </div>
  );
}
