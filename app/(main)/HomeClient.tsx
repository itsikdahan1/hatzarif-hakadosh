"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Heart,
  BookOpen,
  PhoneOff,
  Coffee,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Youtube,
  Instagram,
  Video,
  Users,
  Briefcase,
  Settings,
  HandCoins,
  Stars,
  Trophy,
  Zap,
  Calendar,
  Droplets,
} from "lucide-react";
import * as Icons from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";

import { TikTokIcon } from "@/components/TikTokIcon";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { getCurrentJewishContext, JewishContext, getShabbatWeeklyInfo, ShabbatWeeklyInfo } from "@/src/services/jewishCalendar";

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

function DynamicScheduleWidget({ prayers }: { prayers: any[] }) {
  const [nextEvent, setNextEvent] = useState(SYNAGOGUE_INFO.schedule.prayers[0]);

  useEffect(() => {
    const updateNextEvent = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const sourcePrayers = prayers.length > 0 ? prayers : SYNAGOGUE_INFO.schedule.prayers;
      
      const events = sourcePrayers.map((p: any) => {
        const [hours, minutes] = p.time.split(':').map(Number);
        return { ...p, minutes: hours * 60 + minutes };
      });

      const next = events.find((e: any) => e.minutes > currentMinutes) || events[0];
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

function HeroBackground() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover scale-105"
      src="/hero-video.mp4"
    />
  );
}

export function HomeClient() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [dedications, setDedications] = useState<any[]>([]);
  const [memorials, setMemorials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState<any[]>([]);
  const [shabbatInfo, setShabbatInfo] = useState<ShabbatWeeklyInfo | null>(null);

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

    const qCampaigns = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
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

    // Refresh parasha info every hour
    const parashaInterval = setInterval(() => {
      getShabbatWeeklyInfo().then(setShabbatInfo).catch(() => {});
    }, 3600000);

    return () => {
      unsubscribePrayers();
      unsubscribeLessons();
      unsubscribeDedications();
      unsubscribeMemorials();
      unsubscribeCampaigns();
      unsubscribeImpactStats();
      clearInterval(parashaInterval);
    };
  }, []);

  return (
    <>
      <main className="flex-grow">
        {/* סקציה 1: המגנט הראשי (The Hero Section) */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0 z-0">
            <HeroBackground />
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
                        &quot;{d.content}&quot; {d.donorName && <span className="text-sm font-bold text-charcoal/40 not-italic">({d.donorName})</span>}
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
          <section className="py-16 relative overflow-hidden text-white" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)'}}>
            {/* טקסטורה גיאומטרית */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* קווים אלכסוניים עדינים */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="parasha-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#parasha-grid)" />
              </svg>
              {/* עיגולים אלגנטיים */}
              <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/5" />
              <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full border border-white/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.03]" />
              {/* נקודת אור עדינה */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full" style={{background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)'}} />
            </div>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              {/* פרשת השבוע + תאריך */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-6 backdrop-blur-sm">
                  <Calendar size={14} className="text-gold-warm/80" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50 font-mono">{shabbatInfo.hebrewDate}</span>
                </div>
                <div className="text-4xl md:text-6xl font-serif font-black leading-tight" style={{background: 'linear-gradient(135deg, #d4af37 0%, #f5e38a 50%, #d4af37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
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

        {/* סקציה: ניווט מהיר לתכני הקהילה */}
        <section className="py-24 bg-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div whileHover={{ y: -10 }}>
                <Link href="/lessons" className="bg-alabaster p-10 rounded-[3rem] border border-charcoal/5 hover:border-gold-warm/30 transition-all cursor-pointer group shadow-sm block">
                  <div className="w-16 h-16 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm group-hover:bg-gold-warm group-hover:text-white transition-all mb-8">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">שיעורי תורה</h3>
                  <p className="text-charcoal/50 mb-8 leading-relaxed">כל זמני השיעורים, הנושאים והמרצים במקום אחד.</p>
                  <span className="text-gold-warm font-bold flex items-center gap-2">צפייה בכל השיעורים <ArrowLeft size={16} className="rotate-180" /></span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -10 }}>
                <Link href="/memorials" className="bg-charcoal p-10 rounded-[3rem] text-white transition-all cursor-pointer group shadow-xl block">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-gold-warm mb-8">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4">הקדשות ואזכרות</h3>
                  <p className="text-white/50 mb-8 leading-relaxed">לוח אזכרות עדכני ואפשרויות הקדשה לזכות ולעילוי נשמה.</p>
                  <span className="text-gold-warm font-bold flex items-center gap-2">ללוח המלא <ArrowLeft size={16} className="rotate-180" /></span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -10 }}>
                <Link href="/youth" className="bg-slate-blue p-10 rounded-[3rem] text-white transition-all cursor-pointer group shadow-xl block">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-gold-warm mb-8">
                    <Coffee size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4">שיעור הצעירים</h3>
                  <p className="text-white/50 mb-8 leading-relaxed">כל הפרטים על המפגש השבועי לצעירי השכונה.</p>
                  <span className="text-white font-bold flex items-center gap-2">לפרטים והרשמה <ArrowLeft size={16} className="rotate-180" /></span>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -10 }}>
                <Link href="/business" className="bg-alabaster p-10 rounded-[3rem] border border-charcoal/5 hover:border-gold-warm/30 transition-all cursor-pointer group shadow-sm block">
                  <div className="w-16 h-16 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm group-hover:bg-gold-warm group-hover:text-white transition-all mb-8">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">עסקים בקהילה</h3>
                  <p className="text-charcoal/50 mb-8 leading-relaxed">תמיכה בעסקים מקומיים וחיזוק הכלכלה הקהילתית.</p>
                  <span className="text-gold-warm font-bold flex items-center gap-2">למדריך המלא <ArrowLeft size={16} className="rotate-180" /></span>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* סקציה: לוח זמנים */}
        <section id="schedule" className="py-24 bg-background border-t border-charcoal/5">
          <div className="max-w-5xl mx-auto px-4 text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">לוח זמנים ושיעורים</h2>
            
            <div className="mb-20 bg-white rounded-[3rem] shadow-xl overflow-hidden border border-charcoal/5 text-right">
              <div className="bg-gold-warm text-white p-8">
                <h3 className="text-2xl font-bold">עדכונים שבועיים</h3>
              </div>
              <div className="p-10 md:p-16">
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

            <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-charcoal/5">
              <div className="p-10 md:p-16">
                <div className="space-y-10">
                  {SYNAGOGUE_INFO.schedule.prayers.map((prayer: any, idx: number) => (
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
              <div className="bg-charcoal text-white p-6 text-sm font-bold uppercase tracking-[0.2em] opacity-80">
                {SYNAGOGUE_INFO.schedule.note}
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link
                  href="/donation"
                  className="bg-charcoal text-white px-10 py-5 rounded-full font-bold text-xl flex items-center gap-3 shadow-2xl hover:bg-gold-warm transition-all"
                >
                  <HandCoins size={24} /> תרומה ותמיכה בפעילות
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
