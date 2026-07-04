"use client";

import React, { useState } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import * as Icons from 'lucide-react';
import { saveSiteSettings, seedSiteSettings, type SiteSettings } from '../hooks/useSiteSettings';

interface SiteSettingsTabProps {
  settings: SiteSettings;
  isLive: boolean;
}

type SettingsSection = 'general' | 'contact' | 'social' | 'rabbi' | 'youth' | 'schedule_note';

export function SiteSettingsTab({ settings, isLive }: SiteSettingsTabProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Editable fields - initialized from live settings
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [subTagline, setSubTagline] = useState(settings.subTagline);
  const [location, setLocation] = useState(settings.location);

  const [rabbiName, setRabbiName] = useState(settings.rabbi);
  const [rabbiQuote, setRabbiQuote] = useState(settings.rabbiQuote);
  const [rabbiStory, setRabbiStory] = useState(settings.rabbiStory);

  const [tiktok, setTiktok] = useState(settings.social.tiktok);
  const [youtube, setYoutube] = useState(settings.social.youtube);
  const [instagram, setInstagram] = useState(settings.social.instagram);
  const [whatsapp, setWhatsapp] = useState(settings.social.whatsapp);

  const [gabbaiPhone, setGabbaiPhone] = useState(settings.contact.gabbai);
  const [gabbaiDisplay, setGabbaiDisplay] = useState(settings.contact.gabbaiDisplay);
  const [gabbaiName, setGabbaiName] = useState(settings.contact.gabbaiName);
  const [rabbiPhone, setRabbiPhone] = useState(settings.contact.rabbi);
  const [rabbiPhoneDisplay, setRabbiPhoneDisplay] = useState(settings.contact.rabbiDisplay);
  const [email, setEmail] = useState(settings.contact.email);
  const [waze, setWaze] = useState(settings.contact.waze);
  const [googleMaps, setGoogleMaps] = useState(settings.contact.googleMaps);

  const [youthTitle, setYouthTitle] = useState(settings.youthSection.title);
  const [youthRabbi, setYouthRabbi] = useState(settings.youthSection.rabbiName);
  const [youthDesc, setYouthDesc] = useState(settings.youthSection.description);
  const [youthDetails, setYouthDetails] = useState(settings.youthSection.lessonDetails);

  const [scheduleNote, setScheduleNote] = useState(settings.schedule.note);
  const [mondayTitle, setMondayTitle] = useState(settings.schedule.mondaySpecial.title);
  const [mondayTime, setMondayTime] = useState(settings.schedule.mondaySpecial.time);
  const [mondayDesc, setMondayDesc] = useState(settings.schedule.mondaySpecial.description);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveSiteSettings({
        name,
        tagline,
        subTagline,
        location,
        rabbi: rabbiName,
        rabbiQuote,
        rabbiStory,
        social: { tiktok, youtube, instagram, whatsapp },
        contact: {
          gabbai: gabbaiPhone,
          gabbaiDisplay,
          gabbaiName,
          rabbi: rabbiPhone,
          rabbiDisplay: rabbiPhoneDisplay,
          email,
          waze,
          googleMaps,
          donations: settings.contact.donations,
        },
        youthSection: {
          ...settings.youthSection,
          title: youthTitle,
          rabbiName: youthRabbi,
          description: youthDesc,
          lessonDetails: youthDetails,
        },
        schedule: {
          ...settings.schedule,
          note: scheduleNote,
          mondaySpecial: {
            title: mondayTitle,
            time: mondayTime,
            description: mondayDesc,
          },
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error('Save failed', e);
    }
    setSaving(false);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedSiteSettings();
      window.location.reload();
    } catch (e) {
      console.error('Seed failed', e);
    }
    setSeeding(false);
  };

  const SECTIONS: { id: SettingsSection; label: string; icon: any }[] = [
    { id: 'general', label: 'כללי', icon: Icons.Home },
    { id: 'rabbi', label: 'הרב', icon: Icons.BookOpen },
    { id: 'contact', label: 'יצירת קשר', icon: Icons.Phone },
    { id: 'social', label: 'רשתות חברתיות', icon: Icons.Share2 },
    { id: 'youth', label: 'שיעור צעירים', icon: Icons.Coffee },
    { id: 'schedule_note', label: 'לוח זמנים', icon: Icons.Clock },
  ];

  const inputClass = "w-full px-5 py-3.5 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none text-sm";
  const labelClass = "text-xs font-bold text-charcoal/50 mr-1 mb-1 block";

  return (
    <div className="space-y-8">
      {/* Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isLive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        {isLive ? <CheckCircle size={20} className="text-green-600 shrink-0" /> : <AlertCircle size={20} className="text-amber-600 shrink-0" />}
        <div className="flex-1">
          <p className={`text-sm font-bold ${isLive ? 'text-green-800' : 'text-amber-800'}`}>
            {isLive ? 'הנתונים מסונכרנים עם Firestore - שינויים יופיעו באתר מיד.' : 'אין עדיין נתונים ב-Firestore - האתר מציג ברירות מחדל מהקוד.'}
          </p>
        </div>
        {!isLive && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all disabled:opacity-50"
          >
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            העלה נתונים ל-Firestore
          </button>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeSection === s.id ? 'bg-charcoal text-white shadow-md' : 'bg-alabaster text-charcoal/50 hover:bg-charcoal/5'
            }`}
          >
            <s.icon size={14} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Section: General */}
      {activeSection === 'general' && (
        <div className="space-y-5 bg-alabaster p-6 rounded-[2rem]">
          <h3 className="font-bold text-lg flex items-center gap-2"><Icons.Home size={20} className="text-gold-warm" /> מידע כללי</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>שם בית הכנסת</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>מיקום</label><input value={location} onChange={e => setLocation(e.target.value)} className={inputClass} /></div>
            <div className="md:col-span-2"><label className={labelClass}>כותרת משנה (tagline)</label><input value={tagline} onChange={e => setTagline(e.target.value)} className={inputClass} /></div>
            <div className="md:col-span-2"><label className={labelClass}>תיאור קצר (sub-tagline)</label><input value={subTagline} onChange={e => setSubTagline(e.target.value)} className={inputClass} /></div>
          </div>
        </div>
      )}

      {/* Section: Rabbi */}
      {activeSection === 'rabbi' && (
        <div className="space-y-5 bg-alabaster p-6 rounded-[2rem]">
          <h3 className="font-bold text-lg flex items-center gap-2"><Icons.BookOpen size={20} className="text-gold-warm" /> פרטי הרב</h3>
          <div className="space-y-5">
            <div><label className={labelClass}>שם הרב</label><input value={rabbiName} onChange={e => setRabbiName(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>ציטוט הרב</label><textarea value={rabbiQuote} onChange={e => setRabbiQuote(e.target.value)} className={inputClass + " min-h-[80px]"} /></div>
            <div><label className={labelClass}>סיפור / תיאור הרב</label><textarea value={rabbiStory} onChange={e => setRabbiStory(e.target.value)} className={inputClass + " min-h-[100px]"} /></div>
          </div>
        </div>
      )}

      {/* Section: Contact */}
      {activeSection === 'contact' && (
        <div className="space-y-5 bg-alabaster p-6 rounded-[2rem]">
          <h3 className="font-bold text-lg flex items-center gap-2"><Icons.Phone size={20} className="text-gold-warm" /> פרטי קשר</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>שם הגבאי</label><input value={gabbaiName} onChange={e => setGabbaiName(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>טלפון גבאי (מספרים)</label><input value={gabbaiPhone} onChange={e => setGabbaiPhone(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>טלפון גבאי (תצוגה)</label><input value={gabbaiDisplay} onChange={e => setGabbaiDisplay(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>טלפון הרב (מספרים)</label><input value={rabbiPhone} onChange={e => setRabbiPhone(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>טלפון הרב (תצוגה)</label><input value={rabbiPhoneDisplay} onChange={e => setRabbiPhoneDisplay(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>דואר אלקטרוני</label><input value={email} onChange={e => setEmail(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>קישור Waze</label><input value={waze} onChange={e => setWaze(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>קישור Google Maps</label><input value={googleMaps} onChange={e => setGoogleMaps(e.target.value)} className={inputClass} dir="ltr" /></div>
          </div>
        </div>
      )}

      {/* Section: Social */}
      {activeSection === 'social' && (
        <div className="space-y-5 bg-alabaster p-6 rounded-[2rem]">
          <h3 className="font-bold text-lg flex items-center gap-2"><Icons.Share2 size={20} className="text-gold-warm" /> רשתות חברתיות</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>TikTok</label><input value={tiktok} onChange={e => setTiktok(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>YouTube</label><input value={youtube} onChange={e => setYoutube(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>Instagram</label><input value={instagram} onChange={e => setInstagram(e.target.value)} className={inputClass} dir="ltr" /></div>
            <div><label className={labelClass}>WhatsApp Group</label><input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputClass} dir="ltr" /></div>
          </div>
        </div>
      )}

      {/* Section: Youth */}
      {activeSection === 'youth' && (
        <div className="space-y-5 bg-alabaster p-6 rounded-[2rem]">
          <h3 className="font-bold text-lg flex items-center gap-2"><Icons.Coffee size={20} className="text-gold-warm" /> שיעור הצעירים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className={labelClass}>כותרת</label><input value={youthTitle} onChange={e => setYouthTitle(e.target.value)} className={inputClass} /></div>
            <div><label className={labelClass}>שם הרב / מרצה</label><input value={youthRabbi} onChange={e => setYouthRabbi(e.target.value)} className={inputClass} /></div>
            <div className="md:col-span-2"><label className={labelClass}>תיאור</label><textarea value={youthDesc} onChange={e => setYouthDesc(e.target.value)} className={inputClass + " min-h-[80px]"} /></div>
            <div className="md:col-span-2"><label className={labelClass}>פרטי השיעור</label><textarea value={youthDetails} onChange={e => setYouthDetails(e.target.value)} className={inputClass + " min-h-[80px]"} /></div>
          </div>
        </div>
      )}

      {/* Section: Schedule Notes */}
      {activeSection === 'schedule_note' && (
        <div className="space-y-5 bg-alabaster p-6 rounded-[2rem]">
          <h3 className="font-bold text-lg flex items-center gap-2"><Icons.Clock size={20} className="text-gold-warm" /> הערות לוח זמנים</h3>
          <p className="text-xs text-charcoal/40">זמני התפילות עצמם מנוהלים בטאב &quot;זמני תפילות&quot;. כאן אפשר לערוך טקסטים נלווים.</p>
          <div className="space-y-5">
            <div><label className={labelClass}>הערה כללית על לוח הזמנים</label><textarea value={scheduleNote} onChange={e => setScheduleNote(e.target.value)} className={inputClass + " min-h-[60px]"} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className={labelClass}>שיעור יום שני - כותרת</label><input value={mondayTitle} onChange={e => setMondayTitle(e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>שיעור יום שני - שעה</label><input value={mondayTime} onChange={e => setMondayTime(e.target.value)} className={inputClass} /></div>
              <div className="md:col-span-2"><label className={labelClass}>שיעור יום שני - תיאור</label><textarea value={mondayDesc} onChange={e => setMondayDesc(e.target.value)} className={inputClass + " min-h-[60px]"} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button - always visible */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md p-4 -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12 border-t border-charcoal/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved && <span className="text-green-600 text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> נשמר בהצלחה!</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-charcoal text-white rounded-2xl font-bold text-sm hover:bg-gold-warm transition-all shadow-xl disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          שמור שינויים
        </button>
      </div>
    </div>
  );
}
