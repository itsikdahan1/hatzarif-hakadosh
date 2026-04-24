"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Users, 
  Heart, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * MACHATZIT HASHEKEL MODULE
 */
export const MachatzitHashekelForm = ({ onDonate }: { onDonate: (amount: number, details: any) => void }) => {
  const [participants, setParticipants] = useState(1);
  const [isMehadrin, setIsMehadrin] = useState(false);
  const [silverPrice, setSilverPrice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/silver-price')
      .then(res => res.json())
      .then(data => {
        setSilverPrice(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const baseAmount = silverPrice?.machatzitHashekelAmount || 72;
  const unitPrice = isMehadrin ? baseAmount * 3 : baseAmount;
  const totalAmount = unitPrice * participants;

  const handleDonate = () => {
    onDonate(totalAmount, {
      type: 'machatzit-hashekel',
      participants,
      isMehadrin,
      isSephardic: true // User prompt explicitly mentions Sephardic custom (9.6g silver)
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="bg-gold-warm/5 border border-gold-warm/20 p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-warm/5 rounded-full -mr-16 -mt-16" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h3 className="text-3xl font-serif font-bold text-charcoal mb-2">זכר למחצית השקל</h3>
            <p className="text-charcoal/60 leading-relaxed max-w-sm">
              לפי מנהג הספרדים (שווי 9.6 גרם כסף טהור). תרומה עבור כל אחד מבני הבית, כולל עוברים.
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gold-warm/10 text-center min-w-[200px]">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-charcoal/5 rounded w-24 mx-auto" />
                <div className="h-8 bg-charcoal/5 rounded w-32 mx-auto" />
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-gold-warm uppercase tracking-widest mb-1">שווי הלכתי מעודכן</p>
                <p className="text-4xl font-bold text-charcoal">₪{baseAmount}</p>
                <p className="text-[10px] text-charcoal/40 mt-1">נכון להיום {new Date().toLocaleDateString('he-IL')}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-8 rounded-[2.5rem] border-charcoal/5">
          <label className="block text-sm font-bold text-charcoal/40 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} /> מספר משתתפים (נפשות)
          </label>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setParticipants(p => Math.max(1, p - 1))}
              className="w-16 h-16 rounded-2xl bg-charcoal/5 text-charcoal font-bold text-2xl hover:bg-gold-warm hover:text-white transition-all shadow-sm"
            >-</button>
            <span className="text-4xl font-bold text-charcoal flex-grow text-center">{participants}</span>
            <button 
              onClick={() => setParticipants(p => p + 1)}
              className="w-16 h-16 rounded-2xl bg-charcoal/5 text-charcoal font-bold text-2xl hover:bg-gold-warm hover:text-white transition-all shadow-sm"
            >+</button>
          </div>
          <p className="mt-6 text-sm text-charcoal/40 text-center italic">
            * מומלץ לכלול את כל בני הבית, כולל ילדים ועוברים
          </p>
        </Card>

        <Card className="p-8 rounded-[2.5rem] border-charcoal/5">
          <label className="block text-sm font-bold text-charcoal/40 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles size={16} /> רמת הידור
          </label>
          <div className="space-y-4">
            <button 
              onClick={() => setIsMehadrin(false)}
              className={`w-full p-5 rounded-2xl border text-right transition-all flex items-center justify-between ${!isMehadrin ? 'border-gold-warm bg-gold-warm/5 ring-4 ring-gold-warm/5' : 'border-charcoal/10 hover:border-charcoal/20'}`}
            >
              <div>
                <p className="font-bold text-charcoal">עיקר הדין</p>
                <p className="text-xs text-charcoal/40">שווי מטבע אחד (₪{baseAmount})</p>
              </div>
              {!isMehadrin && <CheckCircle2 className="text-gold-warm" />}
            </button>
            <button 
              onClick={() => setIsMehadrin(true)}
              className={`w-full p-5 rounded-2xl border text-right transition-all flex items-center justify-between ${isMehadrin ? 'border-gold-warm bg-gold-warm/5 ring-4 ring-gold-warm/5' : 'border-charcoal/10 hover:border-charcoal/20'}`}
            >
              <div>
                <p className="font-bold text-charcoal">מהדרין</p>
                <p className="text-xs text-charcoal/40">3 מטבעות כנגד 3 פעמים "תרומה"</p>
              </div>
              {isMehadrin && <CheckCircle2 className="text-gold-warm" />}
            </button>
          </div>
        </Card>
      </div>

      <div className="bg-charcoal text-white p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-1">סיכום תרומה</p>
          <h2 className="text-5xl font-bold">₪{totalAmount}</h2>
        </div>
        <Button 
          onClick={handleDonate}
          className="bg-gold-warm hover:bg-white hover:text-charcoal text-white px-12 py-8 rounded-full text-2xl font-bold h-auto shadow-xl transition-all w-full md:w-auto"
        >
          קיום המצווה כעת <ArrowLeft className="mr-3" />
        </Button>
      </div>
    </motion.div>
  );
};

/**
 * KAPAROT MODULE
 */
export const KaparotForm = ({ onDonate }: { onDonate: (amount: number, details: any) => void }) => {
  const [men, setMen] = useState(1);
  const [women, setWomen] = useState(0);
  const [isPrayerVisible, setIsPrayerVisible] = useState(false);
  
  const unitPrice = 100; // Recommended price per soul (approx cost of chicken + distribution)
  const totalAmount = (men + women) * unitPrice;

  const handleDonate = () => {
    onDonate(totalAmount, {
      type: 'kaparot',
      men,
      women
    });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
      <div className="text-center">
        <h3 className="text-5xl font-serif font-bold text-charcoal mb-4">פדיון כפרות</h3>
        <p className="text-xl text-charcoal/40 italic">"זה חליפתי, זה תמורתי, זה כפרתי..."</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-8 rounded-[2.5rem] border-charcoal/5 shadow-sm">
            <h4 className="font-bold text-charcoal mb-8 text-xl border-r-4 border-gold-warm pr-4 leading-none">בחירת נפשות לכפרה</h4>
            
            <div className="space-y-10">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-charcoal">גברים / בנים</span>
                  <span className="bg-charcoal/5 px-4 py-1 rounded-full text-xs font-bold text-charcoal/40 uppercase">תרנגול</span>
                </div>
                <div className="flex items-center gap-6">
                  <button onClick={() => setMen(v => Math.max(0, v - 1))} className="w-12 h-12 rounded-xl bg-charcoal/5 hover:bg-gold-warm hover:text-white transition-all">-</button>
                  <span className="text-3xl font-bold flex-grow text-center">{men}</span>
                  <button onClick={() => setMen(v => v + 1)} className="w-12 h-12 rounded-xl bg-charcoal/5 hover:bg-gold-warm hover:text-white transition-all">+</button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-charcoal">נשים / בנות</span>
                  <span className="bg-charcoal/5 px-4 py-1 rounded-full text-xs font-bold text-charcoal/40 uppercase">תרנגולת</span>
                </div>
                <div className="flex items-center gap-6">
                  <button onClick={() => setWomen(v => Math.max(0, v - 1))} className="w-12 h-12 rounded-xl bg-charcoal/5 hover:bg-gold-warm hover:text-white transition-all">-</button>
                  <span className="text-3xl font-bold flex-grow text-center">{women}</span>
                  <button onClick={() => setWomen(v => v + 1)} className="w-12 h-12 rounded-xl bg-charcoal/5 hover:bg-gold-warm hover:text-white transition-all">+</button>
                </div>
              </div>
            </div>
          </Card>

          <Button 
            variant="outline" 
            onClick={() => setIsPrayerVisible(!isPrayerVisible)}
            className="w-full py-8 rounded-[2rem] border-gold-warm/20 text-gold-warm hover:bg-gold-warm hover:text-white transition-all gap-3 text-lg font-bold"
          >
            <FileText size={20} /> {isPrayerVisible ? 'הסתר נוסח ברכה' : 'הצג נוסח ברכה (בני אדם)'}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isPrayerVisible ? (
            <motion.div 
              key="prayer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-alabaster p-10 rounded-[3rem] border border-gold-warm/30 shadow-inner relative overflow-y-auto max-h-[500px]"
            >
              <div className="sticky top-0 bg-alabaster/90 backdrop-blur-sm pb-4 mb-6 border-b border-gold-warm/10 flex items-center justify-between">
                 <h5 className="font-bold text-gold-warm">נוסח הכפרות</h5>
                 <RotateCcw size={16} className="text-gold-warm/40" />
              </div>
              <div className="text-center font-serif text-xl leading-loose text-charcoal space-y-6">
                <p className="font-bold underline decoration-gold-warm/30 underline-offset-8">בני אדם יושבי חושך וצלמוות אסירי עוני וברזל...</p>
                <p>יוציאם מחושך וצלמוות ומוסרותיהם ינתק.</p>
                <p>אווילים מדרך פשעם ומעוונותיהם יתענו.</p>
                <p>כל אוכל תתעב נפשם ויגיעו עד שערי מוות.</p>
                <p>ויזעקו אל ה' בצר להם וממצוקותיהם יושיעם.</p>
                <div className="py-6 border-y border-gold-warm/10 my-8">
                  <p className="text-2xl font-bold text-gold-warm">זה חליפתי, זה תמורתי, זה כפרתי.</p>
                  <p className="text-2xl font-bold text-gold-warm mt-4">זה הכסף ילך לצדקה, ואני אכנס לחיים טובים ולשלום.</p>
                </div>
                <p className="text-xs text-charcoal/40">יש לסבב את הכסף (או המכשיר הנייד) מעל הראש 3 פעמים</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="info"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center p-12 bg-gold-warm/5 rounded-[4rem] border border-dashed border-gold-warm/20"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gold-warm shadow-xl mb-8">
                <Heart size={48} />
              </div>
              <h4 className="text-2xl font-bold text-charcoal mb-4">מצווה במקום תרנגול</h4>
              <p className="text-charcoal/60 leading-relaxed">
                גדולי ישראל הורו כי תרומת כספי כפרות לעניים הגונים היא הדרך המובחרת ביותר לקיים את המצווה בדורנו.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-charcoal text-white p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-right">
          <p className="text-gold-warm font-bold uppercase tracking-widest text-xs mb-1">סה"כ פדיון כפרות</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-bold">₪{totalAmount}</h2>
            <span className="text-white/40 text-lg">({men + women} נפשות)</span>
          </div>
        </div>
        <Button 
          onClick={handleDonate}
          disabled={totalAmount === 0}
          className="bg-gold-warm hover:bg-white hover:text-charcoal text-white px-16 py-8 rounded-full text-2xl font-bold h-auto shadow-xl transition-all w-full md:w-auto disabled:opacity-50"
        >
          לביצוע התרומה <ArrowLeft className="mr-3" />
        </Button>
      </div>
    </motion.div>
  );
};

/**
 * URGENT CAMPAIGN (MATANOT LAEVYONIM / KIMCHA DEPISCHA)
 */
export const UrgentCampaignForm = ({ type, onDonate, media = {} }: { type: 'matanot' | 'kimcha', onDonate: (amount: number, details: any) => void, media?: Record<string, string> }) => {
  const [selectedMealCount, setSelectedMealCount] = useState(2);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  const mealPrice = type === 'matanot' ? 40 : 180; // Matanot = meal, Kimcha = heavy Seder box
  const totalAmount = customAmount ? Number(customAmount) : selectedMealCount * mealPrice;

  const handleDonate = () => {
    onDonate(totalAmount, {
      type: type === 'matanot' ? 'matanot-laevyonim' : 'kimcha-depischa',
      mealCount: selectedMealCount,
      isUrgent: true
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="relative h-64 rounded-[3rem] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent z-10" />
        {(type === 'matanot' ? media.special_matanot : media.special_kimcha) ? (
          <img 
            src={type === 'matanot' ? media.special_matanot : media.special_kimcha} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          />
        ) : (
          <div className="w-full h-full bg-charcoal/20" />
        )}
        <div className="absolute bottom-8 right-8 z-20">
          <div className="flex items-center gap-3 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
            <Clock size={14} /> המועד מתקרב
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {type === 'matanot' ? 'מתנות לאביונים בו ביום' : 'קמחא דפסחא - חסד של אמת'}
          </h3>
          <p className="text-white/70 max-w-xl leading-relaxed">
            {type === 'matanot' ? 'המינימום ההלכתי: שתי מתנות לשני אביונים. המהדרין נותנים סעודה מלאה לכל אביון.' : 'סלי מזון גדושים לשיתוף משפחות הקהילה בשמחת החג.'}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-charcoal/40 uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <Heart size={16} /> בחירת יחידות תרומה
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 5, 10].map(count => (
              <button 
                key={count}
                onClick={() => { setSelectedMealCount(count); setCustomAmount(''); }}
                className={`p-6 rounded-[2rem] border-2 transition-all text-center ${selectedMealCount === count && !customAmount ? 'border-gold-warm bg-gold-warm/5 shadow-lg scale-105' : 'border-charcoal/5 hover:border-gold-warm/30 bg-white'}`}
              >
                <p className="text-3xl font-bold text-charcoal">{count}</p>
                <p className="text-[10px] font-bold text-charcoal/40 uppercase mt-1">{count === 1 ? 'מנה' : 'מנות'}</p>
                <Separator className="my-3 opacity-20" />
                <p className="font-bold text-gold-warm text-sm">₪{count * mealPrice}</p>
              </button>
            ))}
          </div>
        </div>

        <Card className="p-8 rounded-[2.5rem] border-charcoal/5 flex flex-col justify-center">
            <h4 className="font-bold text-charcoal/40 uppercase tracking-widest text-xs mb-4">סכום אחר</h4>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 font-bold text-xl">₪</span>
              <input 
                type="number" 
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="סכום לתרומה..."
                className="w-full bg-charcoal/5 border-0 rounded-2xl p-6 pr-10 text-xl font-bold focus:ring-2 ring-gold-warm transition-all"
              />
            </div>
        </Card>
      </div>

      <div className="bg-charcoal text-white p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-right">
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-1">האימפקט שלך</p>
          <div className="flex items-center gap-4">
             <h2 className="text-5xl font-bold">₪{totalAmount}</h2>
             <Separator orientation="vertical" className="h-10 bg-white/10" />
             <div className="text-left">
                <p className="text-gold-warm font-bold text-xl leading-none">
                  {customAmount ? 'צדקה חופשית' : `${selectedMealCount} ${selectedMealCount === 1 ? 'משפחה' : 'משפחות'}`}
                </p>
                <p className="text-white/40 text-xs">יזכו לשמחת החג</p>
             </div>
          </div>
        </div>
        <Button 
          onClick={handleDonate}
          className="bg-gold-warm hover:bg-white hover:text-charcoal text-white px-12 py-8 rounded-full text-2xl font-bold h-auto shadow-xl transition-all w-full md:w-auto"
        >
          אישור והעברה <ArrowLeft className="mr-3" />
        </Button>
      </div>
    </motion.div>
  );
};
