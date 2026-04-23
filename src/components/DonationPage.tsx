"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  CreditCard, 
  Calendar, 
  Sparkles, 
  Zap,
  Mail,
  ShieldCheck,
  Smartphone,
  Plus,
  Loader2,
  Wallet,
  Building2,
  Coins
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { SYNAGOGUE_INFO } from "../constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecentDonations } from "./RecentDonations";
import { LiveDonationTicker } from "./LiveDonationTicker";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";
import { getCurrentJewishContext, JewishContext } from "../services/jewishCalendar";
import { MachatzitHashekelForm, KaparotForm, UrgentCampaignForm } from "./SpecialDonations";

// Initialize Stripe (using public key from env)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

interface DonationOption {
  id: string;
  title: string;
  amount: number | "free";
  description: string;
  icon: React.ReactNode;
  type: "one-time" | "monthly" | "custom";
}

function StripeCheckoutForm({ 
  amount, 
  email, 
  onSuccess, 
  onError 
}: { 
  amount: number, 
  email: string, 
  onSuccess: () => void, 
  onError: (err: string) => void 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/donation-success",
        receipt_email: email,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "An unknown error occurred");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "tabs" }} />
      <Button 
        type="submit" 
        disabled={isProcessing || !stripe}
        className="w-full bg-charcoal hover:bg-gold-warm text-white py-8 rounded-2xl font-bold text-xl shadow-xl transition-all disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" /> מעבד תשלום...
          </span>
        ) : (
          `תשלום מאובטח ₪${amount}`
        )}
      </Button>
    </form>
  );
}

export function DonationPage({ 
  onBack, 
  campaigns = [], 
  impactStats = [] 
}: { 
  onBack: () => void, 
  campaigns?: any[],
  impactStats?: any[]
}) {
  const [success, setSuccess] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"options" | "details" | "payment" | "achisomoch" | "bit">("options");
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedOption, setSelectedOption] = useState<DonationOption | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [customPurpose, setCustomPurpose] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jewishContext, setJewishContext] = useState<JewishContext>(getCurrentJewishContext());
  const [activeSpecialType, setActiveSpecialType] = useState<JewishContext['specialDonationType']>(null);

  // Auto-fill test email if dev
  useEffect(() => {
    const context = getCurrentJewishContext();
    setJewishContext(context);
    if (context.specialDonationType && context.specialDonationType !== 'none') {
      setActiveSpecialType(context.specialDonationType);
    }
  }, []);

  const totalAmount = useMemo(() => {
    if (selectedOption?.amount === "free") return Number(customAmount) || 0;
    return selectedOption?.amount || 0;
  }, [selectedOption, customAmount]);

  const handleCreatePaymentIntent = async () => {
    if (totalAmount <= 0) {
      setError("אנא בחרו סכום לתרומה");
      return;
    }

    try {
      setError(null);
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: totalAmount,
          currency: "ils",
          metadata: {
            email,
            name,
            purpose: customPurpose || selectedOption?.title || "תרומה כללית"
          }
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setClientSecret(data.clientSecret);
      setCheckoutStep("payment");
    } catch (err: any) {
      console.error(err);
      setError("לא ניתן היה לאתחל את מערכת הסליקה. אנא נסו שנית.");
    }
  };

  const handlePaymentSuccess = async (method: string = "stripe") => {
    try {
      await addDoc(collection(db, 'custom_donations'), {
        amount: totalAmount,
        purpose: customPurpose || selectedOption?.title || jewishContext.title || "תרומה כללית",
        donorName: name || email.split('@')[0],
        date: new Date().toISOString(),
        paymentMethod: method,
        isSpecial: !!activeSpecialType,
        specialType: activeSpecialType
      });
      setSuccess(true);
    } catch (e) {
      console.error("Failed to log donation", e);
      setSuccess(true); // Still show success UI as payment succeeded
    }
  };

  const shareOnWhatsApp = () => {
    const text = `גם אני זכיתי להיות שותף ב'צריף הקדוש'. הצטרפו גם אתם: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const DONATION_OPTIONS: DonationOption[] = [
    {
      id: "quick-50",
      title: "תרומה מהירה",
      amount: 50,
      description: "סיוע מיידי למשפחה נזקקת.",
      icon: <Zap className="w-6 h-6" />,
      type: "one-time"
    },
    {
      id: "quick-180",
      title: "חי אלול / הקדשה",
      amount: 180,
      description: "הקדשת שיעור או יום לימוד.",
      icon: <Sparkles className="w-6 h-6" />,
      type: "one-time"
    },
    {
      id: "custom-donation",
      title: "תרומה חופשית",
      amount: "free",
      description: "תרמו כל סכום עבור כל מטרה שתרצו לתמוך בה.",
      icon: <Plus className="w-6 h-6" />,
      type: "custom"
    }
  ];

  if (success) {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 border-4 border-green-100"
          >
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl font-bold text-charcoal mb-4">תודה רבה!</h1>
          <p className="text-xl text-charcoal/80 mb-4 max-w-sm mx-auto">
            התרומה שלך על סך ₪{totalAmount} התקבלה בהצלחה. השותפות שלך עוזרת לנו להמשיך בפעילות.
          </p>
          <div className="bg-gold-warm/5 p-6 rounded-2xl mb-12 border border-gold-warm/20 flex flex-col gap-4 text-gold-warm font-bold text-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} />
              קבלה מוכרת לפי סעיף 46 (Future-Proof 2026)
            </div>
            <p className="text-charcoal/40 font-normal text-xs leading-relaxed">
              הארגון עומד בתקני רשות המסים החדשים. הזיכוי ידווח אוטומטית לתיק המס שלך ללא צורך בהגשת ניירת בסוף השנה.
            </p>
          </div>
          <div className="flex flex-col w-full gap-4 max-w-xs">
            <Button 
              size="lg" 
              onClick={shareOnWhatsApp}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl py-8 text-xl font-bold flex items-center justify-center gap-3 shadow-xl"
            >
              <Share2 size={24} /> שיתוף בוואטסאפ
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              onClick={onBack}
              className="rounded-2xl py-6 text-lg font-bold text-charcoal/60"
            >
              חזרה לדף הבית
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-gold-warm/20 flex flex-col" dir="rtl">
      <LiveDonationTicker />
      
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-charcoal/5">
        <button 
          onClick={() => {
            if (checkoutStep === "options") onBack();
            else if (checkoutStep === "achisomoch") setCheckoutStep("details");
            else setCheckoutStep("options");
          }}
          className="p-2 hover:bg-charcoal/5 rounded-full transition-colors text-charcoal/80"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-bold text-lg text-charcoal">
          {activeSpecialType ? jewishContext.title : 'תמיכה ושותפות אלקטרונית'}
        </span>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Secure Connection</span>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-5 py-8">
          
          {checkoutStep === "options" && (
            <div className="space-y-12">
               <div className="text-center">
                {jewishContext.specialDonationType && jewishContext.specialDonationType !== 'none' && jewishContext.period !== 'omer' && (
                  <div className="inline-flex bg-gold-warm/10 text-gold-warm px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-6">
                    {jewishContext.subtitle}
                  </div>
                )}
                <h2 className="text-4xl font-black text-charcoal mb-4 tracking-tight leading-tight">
                  {activeSpecialType ? `קיום מצוות ${jewishContext.title}` : 'בחרו את השותפות שלכם'}
                </h2>
              </div>

              {activeSpecialType && activeSpecialType !== 'none' ? (
                <div className="space-y-12">
                  <AnimatePresence mode="wait">
                    {activeSpecialType === 'machatzit-hashekel' && (
                      <MachatzitHashekelForm 
                        onDonate={(amount, details) => {
                          setCustomAmount(amount.toString());
                          setCustomPurpose("זכר למחצית השקל");
                          setSelectedOption({
                            id: 'special',
                            title: 'זכר למחצית השקל',
                            amount: amount,
                            description: `עבור ${details.participants} נפשות`,
                            icon: <Coins />,
                            type: 'one-time'
                          });
                          setCheckoutStep("details");
                        }} 
                      />
                    )}
                    {activeSpecialType === 'kaparot' && (
                      <KaparotForm 
                        onDonate={(amount, details) => {
                          setCustomAmount(amount.toString());
                          setCustomPurpose("פדיון כפרות");
                          setSelectedOption({
                            id: 'special',
                            title: 'פדיון כפרות',
                            amount: amount,
                            description: `עבור ${details.men + details.women} נפשות`,
                            icon: <Heart />,
                            type: 'one-time'
                          });
                          setCheckoutStep("details");
                        }} 
                      />
                    )}
                    {activeSpecialType === 'matanot-laevyonim' && (
                      <UrgentCampaignForm 
                        type="matanot" 
                        onDonate={(amount) => {
                          setCustomAmount(amount.toString());
                          setCustomPurpose("מתנות לאביונים");
                          setSelectedOption({
                            id: 'special',
                            title: 'מתנות לאביונים',
                            amount: amount,
                            description: 'מתנה לאביון בו ביום',
                            icon: <Heart />,
                            type: 'one-time'
                          });
                          setCheckoutStep("details");
                        }} 
                      />
                    )}
                    {activeSpecialType === 'kimcha-depischa' && (
                      <UrgentCampaignForm 
                        type="kimcha" 
                        onDonate={(amount) => {
                          setCustomAmount(amount.toString());
                          setCustomPurpose("קמחא דפסחא");
                          setSelectedOption({
                            id: 'special',
                            title: 'קמחא דפסחא',
                            amount: amount,
                            description: 'סל מזון למשפחה',
                            icon: <Heart />,
                            type: 'one-time'
                          });
                          setCheckoutStep("details");
                        }} 
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative py-12">
                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-charcoal/5"></div></div>
                     <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-6 text-charcoal/30 font-black tracking-widest">או תרומה כללית לקהילה</span></div>
                  </div>

                  <Button 
                    variant="ghost" 
                    className="w-full text-charcoal/40 font-bold hover:text-gold-warm"
                    onClick={() => setActiveSpecialType(null)}
                  >
                    מעבר לתרומות רגילות והוראות קבע
                  </Button>
                </div>
              ) : (
                <>
                  <div className="bg-alabaster p-2 rounded-2xl border border-charcoal/10 flex">
                    <button 
                      onClick={() => setIsMonthly(true)}
                      className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${isMonthly ? 'bg-white shadow-md text-charcoal' : 'text-charcoal/60 hover:text-charcoal'}`}
                    >
                      תרומה חודשית
                    </button>
                    <button 
                      onClick={() => setIsMonthly(false)}
                      className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${!isMonthly ? 'bg-white shadow-md text-charcoal' : 'text-charcoal/60 hover:text-charcoal'}`}
                    >
                      תרומה חד פעמית
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {(isMonthly ? SYNAGOGUE_INFO.philanthropy.monthlyTiers : SYNAGOGUE_INFO.philanthropy.impactLevels).map((tier: any) => (
                      <button
                        key={tier.amount}
                        onClick={() => {
                          setCustomAmount(tier.amount.toString());
                          setSelectedOption({
                            id: tier.amount.toString(),
                            title: tier.description,
                            amount: tier.amount,
                            description: tier.impact,
                            icon: <Heart />,
                            type: isMonthly ? "monthly" : "one-time"
                          });
                          setCheckoutStep("details");
                        }}
                        className="group bg-white border-2 border-charcoal/5 hover:border-gold-warm/50 p-6 rounded-[2.5rem] flex items-center justify-between transition-all hover:shadow-xl active:scale-[0.98] text-right"
                      >
                        <div className="flex gap-5 items-center">
                          <div className="w-14 h-14 bg-gold-warm/10 rounded-2xl flex items-center justify-center text-gold-warm group-hover:bg-gold-warm group-hover:text-white transition-all">
                            {isMonthly ? <Calendar size={28} /> : <Zap size={28} />}
                          </div>
                          <div>
                            <div className="font-sans font-black text-3xl text-charcoal">₪{tier.amount}</div>
                            <div className="text-xs font-bold text-charcoal/60 uppercase tracking-widest">{tier.description}</div>
                          </div>
                        </div>
                        <div className="max-w-[120px] text-left">
                          <div className="text-[10px] font-black text-gold-warm uppercase tracking-tighter leading-tight opacity-40 group-hover:opacity-100 transition-opacity">האימפקט שלך:</div>
                          <div className="text-xs font-bold text-charcoal leading-tight opacity-40 group-hover:opacity-100 transition-opacity">{tier.impact}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {jewishContext.specialDonationType && jewishContext.specialDonationType !== 'none' && (
                    <Button 
                      className="w-full py-8 rounded-[2rem] bg-gold-warm/10 text-gold-warm border-2 border-gold-warm/20 font-bold text-lg hover:bg-gold-warm hover:text-white transition-all"
                      onClick={() => setActiveSpecialType(jewishContext.specialDonationType)}
                    >
                      מעבר לקיום מצוות {jewishContext.title}
                    </Button>
                  ) || (
                    <Button 
                      variant="outline"
                      className="w-full py-8 rounded-[2rem] border-2 border-charcoal/10 text-charcoal/80 font-bold text-lg hover:bg-white"
                      onClick={() => {
                        const opt = DONATION_OPTIONS.find(o => o.id === 'custom-donation');
                        if (opt) setSelectedOption(opt);
                        setCheckoutStep("details");
                      }}
                    >
                      סכום אחר לבחירתכם
                    </Button>
                  )}
                </>
              )}

              <RecentDonations />
            </div>
          )}

          {(checkoutStep === "details" || checkoutStep === "payment" || checkoutStep === "achisomoch" || checkoutStep === "bit") && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Summary Header */}
              <div className="bg-charcoal text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-warm/10 rounded-full -mr-16 -mt-16" />
                <div className="flex justify-between items-end relative z-10">
                   <div>
                      <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">שותפות נבחרת</p>
                      <h3 className="text-2xl font-bold">{selectedOption?.title}</h3>
                      <p className="text-gold-warm text-sm font-bold mt-1">
                        {isMonthly ? 'תרומה חודשית קבועה' : 'תרומה חד פעמית'}
                      </p>
                   </div>
                   <div className="text-left">
                      <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">סכום לחיוב</p>
                      <span className="text-4xl font-black font-sans tracking-tight">₪{totalAmount}</span>
                   </div>
                </div>
              </div>

              {checkoutStep === "details" && (
                <div className="space-y-6">
                  {selectedOption?.id === "custom-donation" && (
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-charcoal/60 mr-2">סכום התרומה (₪)</label>
                       <input 
                         type="number"
                         value={customAmount}
                         onChange={(e) => setCustomAmount(e.target.value)}
                         className="w-full bg-white border border-charcoal/10 rounded-2xl py-5 px-6 font-sans text-2xl focus:ring-2 focus:ring-gold-warm/20"
                         placeholder="180"
                       />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">שם מלא (לקבלה)</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-charcoal/10 rounded-2xl py-5 px-6 font-bold focus:ring-2 focus:ring-gold-warm/20"
                      placeholder="הכניסו שם מלא"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">דואר אלקטרוני</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-charcoal/10 rounded-2xl py-5 px-6 font-sans focus:ring-2 focus:ring-gold-warm/20 text-left"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <Button 
                      disabled={!email || !name || totalAmount <= 0}
                      onClick={handleCreatePaymentIntent}
                      className="w-full bg-charcoal hover:bg-gold-warm text-white py-8 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 transition-all"
                    >
                      <CreditCard /> תשלום באשראי / Apple Pay
                    </Button>

                    <Button 
                      disabled={!email || !name || totalAmount <= 0}
                      onClick={() => setCheckoutStep("bit")}
                      className="w-full bg-[#002e5d] hover:bg-[#003d7a] text-white py-8 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-4 transition-all"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                         <div className="w-4 h-4 bg-[#002e5d] rounded-full" />
                      </div>
                      תרומה מהירה ב-Bit
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setCheckoutStep("achisomoch")}
                      className="w-full border-2 border-charcoal/10 py-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 text-charcoal/60"
                    >
                      <Building2 /> העברה / אחיסמך / קהילות
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-4 py-8 opacity-30 grayscale pointer-events-none">
                     <Smartphone size={32} />
                     <Wallet size={32} />
                     <CreditCard size={32} />
                  </div>
                </div>
              )}

              {checkoutStep === "payment" && clientSecret && (
                <div className="bg-alabaster p-8 rounded-[3rem] border border-charcoal/5 shadow-inner">
                  <div className="flex items-center gap-3 mb-8 text-charcoal/40 font-bold text-sm">
                    <ShieldCheck size={20} className="text-green-500" />
                    סליקה מאובטחת בתקן PCI-DSS Level 1
                  </div>
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#C5A059',
                          colorBackground: '#ffffff',
                          colorText: '#333333',
                          borderRadius: '16px',
                        }
                      }
                    }}
                  >
                    <StripeCheckoutForm 
                      amount={totalAmount} 
                      email={email} 
                      onSuccess={() => handlePaymentSuccess("stripe")}
                      onError={(err) => setError(err)}
                    />
                  </Elements>
                  {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === "bit" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[3rem] border-2 border-[#002e5d]/10 shadow-2xl space-y-8"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#002e5d] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 bg-[#002e5d] rounded-full" />
                       </div>
                    </div>
                    <h3 className="text-3xl font-black text-charcoal mb-2 font-sans">תרומה ב-Bit</h3>
                    <p className="text-charcoal/60 font-bold">העברה פשוטה ישירות מהנייד</p>
                  </div>

                  <div className="bg-alabaster p-8 rounded-3xl border border-charcoal/5 space-y-4 text-center">
                    <p className="text-sm font-bold text-charcoal/40 uppercase tracking-widest leading-none text-center w-full">מספר טלפון להעברה</p>
                    <div className="text-4xl font-black text-[#002e5d] font-sans tracking-tight">
                      {SYNAGOGUE_INFO.contact.gabbai}
                    </div>
                    <Button 
                      variant="outline"
                      className="rounded-full px-6 border-[#002e5d]/20 text-[#002e5d] mx-auto flex"
                      onClick={() => {
                        navigator.clipboard.writeText(SYNAGOGUE_INFO.contact.gabbai);
                      }}
                    >
                      העתק מספר טלפון
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-center text-sm font-bold text-charcoal/60 px-4">
                      שתפו את כולנו בשמחה! לאחר ההעברה בביט, לחצו על הכפתור למטה כדי שנוכל לשלוח לכם קבלה ולהציג את תרומתכם בטיקר הלייב.
                    </p>
                    
                    <a 
                      href="bitpay://" 
                      className="block w-full bg-[#002e5d] text-white py-6 rounded-2xl font-bold text-xl text-center shadow-lg hover:bg-[#003d7a] transition-all"
                    >
                      פתח את אפליקציית Bit
                    </a>

                    <Button 
                      onClick={() => handlePaymentSuccess("bit")}
                      className="w-full bg-gold-warm hover:bg-gold-warm/90 text-white py-6 rounded-2xl font-bold text-xl shadow-xl transition-all"
                    >
                      ביצעתי את ההעברה - שלחו לי קבלה
                    </Button>
                  </div>
                </motion.div>
              )}

              {checkoutStep === "achisomoch" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-alabaster p-10 rounded-[3rem] border border-gold-warm/20 space-y-8"
                >
                  <div className="text-center">
                    <Building2 className="mx-auto text-gold-warm mb-4" size={48} />
                    <h3 className="text-2xl font-bold text-charcoal">תשלום דרך חשבונות צדקה</h3>
                    <p className="text-charcoal/60 mt-2">הנחיות לביצוע התרומה דרך המערכות הייעודיות</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-2xl border border-charcoal/5">
                      <h4 className="font-bold text-gold-warm mb-2 flex items-center gap-2">
                        <CheckCircle2 size={18} /> אחיסמך (Achisomoch)
                      </h4>
                      <p className="text-sm leading-relaxed">
                        חפשו את <strong>{SYNAGOGUE_INFO.name}</strong> במערכת אחיסמך (מספר מוסד: 12345).<br/>
                        לאחר ביצוע הפעולה, הקבלה תשלח אליכם דרך המערכת.
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-charcoal/5">
                      <h4 className="font-bold text-gold-warm mb-2 flex items-center gap-2">
                        <CheckCircle2 size={18} /> קהילות (Kehillot)
                      </h4>
                      <p className="text-sm leading-relaxed">
                        במכשיר הנדרים פלוס או באתר קהילות, הקלידו את שם בית הכנסת ובצעו את התרומה למטרה הנבחרת.
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="ghost"
                    onClick={() => {
                        handlePaymentSuccess(); // Mock success check for offline payment simulation
                    }}
                    className="w-full py-4 text-gold-warm font-bold"
                  >
                    ביצעתי את התרומה, שלחו לי קבלה
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Security Footer */}
          <div className="mt-20 pt-12 border-t border-charcoal/5 text-center space-y-6">
            <div className="flex justify-center gap-8 opacity-40">
              <ShieldCheck size={24} />
              <div className="font-black text-[10px] uppercase tracking-[0.3em]">PCI Compliant</div>
              <div className="font-black text-[10px] uppercase tracking-[0.3em]">SSL Encryption</div>
            </div>
            <p className="text-[10px] text-charcoal/30 max-w-sm mx-auto leading-relaxed">
              המידע שלך מוצפן ומוגן. פרטי האשראי אינם נשמרים על שרתי הארגון. התרומה מוכרת לצורכי מס לפי סעיף 46 לפקודת מס הכנסה.
            </p>
          </div>

        </div>
      </main>

      <footer className="py-12 px-6 text-center text-charcoal/20 border-t border-charcoal/5 bg-alabaster/30">
        <p className="text-xs font-serif font-bold uppercase tracking-widest mb-1">{SYNAGOGUE_INFO.name}</p>
        <p className="text-[10px]">© 2026 טכנולוגיה בשירות הרוח</p>
      </footer>
    </div>
  );
}

