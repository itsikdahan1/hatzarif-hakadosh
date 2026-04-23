"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  Phone,
  MessageCircle,
  Youtube,
  Instagram,
  MapPin,
  ExternalLink,
  Settings,
} from "lucide-react";
import { SYNAGOGUE_INFO } from "@/lib/constants";
import { TikTokIcon } from "@/components/TikTokIcon";

export function Footer() {
  return (
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
              &quot;{SYNAGOGUE_INFO.subTagline}&quot;
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
                { label: "דף הבית", href: '/' },
                { label: "שיעורי תורה", href: '/lessons' },
                { label: "הקדשות ואזכרות", href: '/memorials' },
                { label: "השיעור לצעירים", href: '/youth' },
                { label: "עסקים בקהילה", href: '/business' },
                { label: "תרומה לבית הכנסת", href: '/donation' }
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    href={item.href}
                    className="text-white/40 hover:text-white transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </Link>
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
                  <span className="block text-xs text-white/30 uppercase tracking-widest mb-1">גבאי בית הכנסת</span>
                  <a href={`tel:${SYNAGOGUE_INFO.contact.gabbai}`} className="text-sm font-bold hover:text-gold-warm transition-colors">{SYNAGOGUE_INFO.contact.gabbai}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <MessageCircle size={18} className="text-gold-warm shrink-0" />
                <div>
                  <span className="block text-xs text-white/30 uppercase tracking-widest mb-1">וואטסאפ קהילה</span>
                  <a href={`https://wa.me/${SYNAGOGUE_INFO.contact.gabbai}`} target="_blank" className="text-sm font-bold hover:text-gold-warm transition-colors">שלחו הודעה</a>
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
            <p className="hidden md:block">|</p>
            <a 
              href="https://wa.me/972559296626" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold-warm transition-colors normal-case tracking-normal"
            >
              נבנה ע״י יצחק דהן 💡
            </a>
          </div>
          
          <Link 
            href="/admin"
            className="flex items-center gap-2 hover:text-gold-warm transition-colors group"
          >
            <Settings size={14} className="group-hover:rotate-90 transition-transform" /> 
            <span>כניסת גבאי</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
