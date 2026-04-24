"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Coins,
  MessageCircle,
  Accessibility,
  Heart,
  Youtube,
  Instagram,
  SunMoon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { TikTokIcon } from "@/components/TikTokIcon";
import { useAccessibility } from "@/components/AppProviders";

function AccessibilityMenu({ onClose }: { onClose: () => void }) {
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility();

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

export function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "זמנים" },
    { href: "/about", label: "אודות" },
    { href: "/lessons", label: "שיעורים" },
    { href: "/memorials", label: "הקדשות" },
    { href: "/youth", label: "השיעור לצעירים" },
    { href: "/business", label: "עסקים בקהילה" },
  ];

  const mobileNavItems = [
    { href: "/", label: "דף הבית" },
    { href: "/lessons", label: "שיעורי תורה" },
    { href: "/memorials", label: "הקדשות ואזכרות" },
    { href: "/youth", label: "שיעור הצעירים" },
    { href: "/business", label: "עסקים בקהילה" },
    { href: "/about", label: "אודות הקהילה" },
  ];

  return (
    <>
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
              {mobileNavItems.map(item => (
                <Link 
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-right py-4 border-b border-white/5 ${pathname === item.href ? 'text-gold-warm' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link 
                href="/donation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-right py-4 text-gold-warm mt-4 flex items-center justify-end gap-3"
              >
                <Heart size={28} /> תמיכה ושותפות
              </Link>
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
            <Link href="/" className="flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-charcoal rounded-xl flex items-center justify-center text-alabaster shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-charcoal">{SYNAGOGUE_INFO.name}</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 text-[13px] font-bold text-charcoal/60">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg hover:text-gold-warm hover:bg-gold-warm/5 transition-all ${pathname === item.href ? 'text-gold-warm' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
                className={`p-3 rounded-full transition-all ${isAccessMenuOpen ? 'bg-charcoal text-white shadow-lg' : 'bg-charcoal/5 text-charcoal/40 hover:bg-charcoal/10'}`}
              >
                <Accessibility size={20} />
              </button>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/donation"
                  className="hidden sm:flex bg-charcoal text-white px-4 lg:px-6 py-3 rounded-full font-bold text-sm items-center gap-2 hover:bg-gold-warm transition-all shadow-lg"
                >
                  <Coins size={18} /> <span className="hidden md:inline">תרומה לבית הכנסת</span><span className="md:hidden">תרומה</span>
                </Link>
              </motion.div>
              <motion.a 
                href={SYNAGOGUE_INFO.updatesWhatsApp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex bg-gold-warm/10 text-gold-warm border border-gold-warm/20 px-6 py-3 rounded-full font-bold text-sm items-center gap-2 hover:bg-gold-warm hover:text-white transition-all shadow-sm"
              >
                <MessageCircle size={18} /> קבלת עדכונים
              </motion.a>

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
              <AccessibilityMenu onClose={() => setIsAccessMenuOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
}
