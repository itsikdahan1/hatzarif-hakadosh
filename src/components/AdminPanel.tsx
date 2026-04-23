"use client";

import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Clock, 
  Briefcase, 
  Bell,
  LogOut,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Heart,
  Users,
  HandCoins,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'businesses' | 'lessons' | 'dedications' | 'announcements' | 'campaigns' | 'impact' | 'gabbais' | 'annual_circle'>('prayers');
  const [prayers, setPrayers] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [dedications, setDedications] = useState<any[]>([]);
  const [memorials, setMemorials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annualCircle, setAnnualCircle] = useState<any[]>([]);
  const [customDonations, setCustomDonations] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newPrayer, setNewPrayer] = useState({ name: '', time: '', type: 'weekday' });
  const [newLesson, setNewLesson] = useState({ title: '', lecturer: '', day: '', time: '', topic: '' });
  const [newDedication, setNewDedication] = useState({ content: '', donorName: '', type: 'memorial', date: '', active: false });
  const [newMemorial, setNewMemorial] = useState({ name: '', date: '', description: '', today: false });
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', target: 0, current: 0, category: '', image: '', active: true });
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', isUrgent: false, active: true });
  const [newAnnualCircle, setNewAnnualCircle] = useState({ title: '', price: 0, description: '', icon: 'Calendar' });
  const [newImpactStat, setNewImpactStat] = useState({ title: '', value: '', icon: 'Heart', order: 0 });
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
      if (user) {
        // Simple admin check for demo - in production this would be a Firestore check or Custom Claim
        if (user.email === "d0559296626@gmail.com") {
          setIsAdmin(true);
        } else {
          try {
            const q = query(collection(db, 'users'), where('email', '==', user.email.toLowerCase()), where('role', '==', 'admin'));
            const snapshot = await getDocs(q);
            setIsAdmin(!snapshot.empty);
          } catch (e) {
            console.error("Admin check error", e);
            setIsAdmin(false);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const qPrayers = query(collection(db, 'prayers'), orderBy('time'));
    const unsubscribePrayers = onSnapshot(qPrayers, (snapshot) => {
      setPrayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'prayers'));

    const qBusinesses = query(collection(db, 'businesses'));
    const unsubscribeBusinesses = onSnapshot(qBusinesses, (snapshot) => {
      setBusinesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'businesses'));

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
      setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'campaigns'));

    const qAnnouncements = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribeAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'announcements'));

    const qAnnualCircle = query(collection(db, 'annual_circle'), orderBy('order'));
    const unsubscribeAnnualCircle = onSnapshot(qAnnualCircle, (snapshot) => {
      setAnnualCircle(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'annual_circle'));

    const qCustomDonations = query(collection(db, 'custom_donations'), orderBy('date', 'desc'));
    const unsubscribeCustomDonations = onSnapshot(qCustomDonations, (snapshot) => {
      setCustomDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'custom_donations'));

    const qImpactStats = query(collection(db, 'impact_stats'), orderBy('order'));
    const unsubscribeImpactStats = onSnapshot(qImpactStats, (snapshot) => {
      setImpactStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'impact_stats'));

    const qAdmins = query(collection(db, 'users'));
    const unsubscribeAdmins = onSnapshot(qAdmins, (snapshot) => {
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    return () => {
      unsubscribePrayers();
      unsubscribeBusinesses();
      unsubscribeLessons();
      unsubscribeDedications();
      unsubscribeMemorials();
      unsubscribeCampaigns();
      unsubscribeAnnouncements();
      unsubscribeAnnualCircle();
      unsubscribeCustomDonations();
      unsubscribeImpactStats();
      unsubscribeAdmins();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const addPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'prayers'), newPrayer);
      setNewPrayer({ name: '', time: '', type: 'weekday' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'prayers');
    }
  };

  const addLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'lessons'), newLesson);
      setNewLesson({ title: '', lecturer: '', day: '', time: '', topic: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'lessons');
    }
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use email as ID for deterministic lookups if needed, but here we just add a doc
      await addDoc(collection(db, 'users'), {
        email: newAdminEmail.toLowerCase(),
        role: 'admin',
        addedAt: new Date().toISOString()
      });
      setNewAdminEmail('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    }
  };

  const toggleMemorialToday = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'memorials', id), { today: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'memorials');
    }
  };

  const toggleDedicationActive = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'dedications', id), { active: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'dedications');
    }
  };

  const addDedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'dedications'), newDedication);
      setNewDedication({ content: '', donorName: '', type: 'memorial', date: '', active: false });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'dedications');
    }
  };

  const addMemorial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'memorials'), newMemorial);
      setNewMemorial({ name: '', date: '', description: '', today: false });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'memorials');
    }
  };

  const addCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await updateDoc(doc(db, 'campaigns', editingCampaign.id), newCampaign);
        setEditingCampaign(null);
      } else {
        await addDoc(collection(db, 'campaigns'), { ...newCampaign, createdAt: new Date().toISOString() });
      }
      setNewCampaign({ title: '', description: '', target: 0, current: 0, category: '', image: '', active: true });
    } catch (error) {
      handleFirestoreError(error, editingCampaign ? OperationType.UPDATE : OperationType.CREATE, 'campaigns');
    }
  };

  const addAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'announcements'), {
        ...newAnnouncement,
        createdAt: new Date().toISOString()
      });
      setNewAnnouncement({ title: '', content: '', isUrgent: false, active: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
    }
  };

  const toggleAnnouncement = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'announcements', id), { active: !current });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'announcements');
    }
  };

  const addAnnualCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'annual_circle'), {
        ...newAnnualCircle,
        order: annualCircle.length
      });
      setNewAnnualCircle({ title: '', price: 0, description: '', icon: 'Calendar' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'annual_circle');
    }
  };

  const addImpactStat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'impact_stats'), newImpactStat);
      setNewImpactStat({ title: '', value: '', icon: 'Heart', order: impactStats.length });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'impact_stats');
    }
  };

  const deletePrayer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'prayers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'prayers');
    }
  };

  const toggleBusinessApproval = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'businesses', id), { approved: !currentStatus });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'businesses');
    }
  };

  const updateCampaignAmount = async (id: string, amount: number) => {
    try {
      await updateDoc(doc(db, 'campaigns', id), { current: amount });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'campaigns');
    }
  };

  if (loading) return null;

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-charcoal/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-gold-warm/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="text-gold-warm" size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4 text-charcoal">כניסת גבאי</h2>
          <p className="text-charcoal/60 mb-8 leading-relaxed">
            המערכת מיועדת לניהול זמני תפילות, קמפיינים, מאגר עסקים והודעות קהילה.
          </p>
          <button 
            onClick={handleLogin}
            className="w-full bg-charcoal text-white py-4 rounded-full font-bold text-lg hover:bg-charcoal/90 transition-all flex items-center justify-center gap-3"
          >
            התחברות עם Google
          </button>
          <button onClick={onClose} className="mt-6 text-charcoal/40 hover:text-charcoal transition-colors">חזרה לאתר</button>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-charcoal/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center">
          <AlertCircle className="text-red-500 mx-auto mb-6" size={60} />
          <h2 className="text-2xl font-bold mb-4">אין הרשאת ניהול</h2>
          <p className="text-charcoal/60 mb-8">חשבון זה אינו מוגדר כגבאי במערכת.</p>
          <button onClick={handleLogout} className="text-gold-warm font-bold hover:underline">התנתק ונסה חשבון אחר</button>
          <div className="mt-6">
            <button onClick={onClose} className="text-charcoal/40">סגור</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-alabaster z-[100] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-charcoal">ניהול הצריף הקדוש</h1>
            <p className="text-charcoal/60">שלום, {auth.currentUser?.displayName}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleLogout}
              className="p-3 rounded-full bg-white border border-charcoal/10 text-charcoal/60 hover:text-red-500 transition-colors"
              title="התנתק"
            >
              <LogOut size={24} />
            </button>
            <button 
              onClick={onClose}
              className="p-3 rounded-full bg-charcoal text-white hover:bg-charcoal/90 transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        <nav className="flex gap-4 mb-12 overflow-x-auto pb-2">
          {[
            { id: 'prayers', label: 'זמני תפילות', icon: Clock },
            { id: 'lessons', label: 'שיעורי תורה', icon: BookOpen },
            { id: 'campaigns', label: 'קמפיינים ותרומות', icon: HandCoins },
            { id: 'impact', label: 'נתוני השפעה', icon: Heart },
            { id: 'dedications', label: 'הקדשות ואזכרות', icon: Heart },
            { id: 'businesses', label: 'מאגר עסקים', icon: Briefcase },
            { id: 'annual_circle', label: 'מעגל השנה', icon: Calendar },
            { id: 'gabbais', label: 'ניהול גבאים', icon: Users },
            { id: 'announcements', label: 'הודעות מתפרצות', icon: Bell },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? 'bg-gold-warm text-white shadow-lg' 
                : 'bg-white text-charcoal/60 hover:bg-white/80'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-charcoal/5">
          {activeTab === 'prayers' && (
            <div className="space-y-12">
              <form onSubmit={addPrayer} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-alabaster p-8 rounded-[2rem]">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">שם התפילה</label>
                  <input 
                    required
                    value={newPrayer.name}
                    onChange={e => setNewPrayer({...newPrayer, name: e.target.value})}
                    placeholder="למשל: שחרית נץ"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">שעה</label>
                  <input 
                    required
                    type="time"
                    value={newPrayer.time}
                    onChange={e => setNewPrayer({...newPrayer, time: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">סוג יום</label>
                  <select 
                    value={newPrayer.type}
                    onChange={e => setNewPrayer({...newPrayer, type: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none appearance-none bg-white"
                  >
                    <option value="weekday">יום חול</option>
                    <option value="shabbat">שבת</option>
                  </select>
                </div>
                <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> הוסף זמן
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold-warm rounded-full" /> ימי חול
                  </h3>
                  <div className="space-y-4">
                    {prayers.filter(p => p.type === 'weekday').map(prayer => (
                      <div key={prayer.id} className="flex justify-between items-center p-6 bg-alabaster rounded-2xl group">
                        <div>
                          <span className="font-bold text-lg">{prayer.name}</span>
                          <span className="mr-4 text-gold-warm font-mono">{prayer.time}</span>
                        </div>
                        <button onClick={() => deletePrayer(prayer.id)} className="text-charcoal/20 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold-warm rounded-full" /> שבת קודש
                  </h3>
                  <div className="space-y-4">
                    {prayers.filter(p => p.type === 'shabbat').map(prayer => (
                      <div key={prayer.id} className="flex justify-between items-center p-6 bg-alabaster rounded-2xl group">
                        <div>
                          <span className="font-bold text-lg">{prayer.name}</span>
                          <span className="mr-4 text-gold-warm font-mono">{prayer.time}</span>
                        </div>
                        <button onClick={() => deletePrayer(prayer.id)} className="text-charcoal/20 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-12">
              <form onSubmit={addCampaign} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-alabaster p-8 rounded-[2rem]">
                <div className="md:col-span-3 flex justify-between items-center">
                  <h3 className="font-bold text-xl">{editingCampaign ? 'עריכת קמפיין' : 'יצירת קמפיין חדש'}</h3>
                  {editingCampaign && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingCampaign(null);
                        setNewCampaign({ title: '', description: '', target: 0, current: 0, category: '', image: '', active: true });
                      }}
                      className="text-sm text-red-500 font-bold hover:underline"
                    >
                      ביטול עריכה
                    </button>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">שם הקמפיין</label>
                  <input 
                    required
                    value={newCampaign.title}
                    onChange={e => setNewCampaign({...newCampaign, title: e.target.value})}
                    placeholder="למשל: שיפוץ המקווה"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">קטגוריה</label>
                  <input 
                    required
                    value={newCampaign.category}
                    onChange={e => setNewCampaign({...newCampaign, category: e.target.value})}
                    placeholder="למשל: בינוי / חסד"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">יעד (₪)</label>
                  <input 
                    required
                    type="number"
                    value={newCampaign.target}
                    onChange={e => setNewCampaign({...newCampaign, target: Number(e.target.value)})}
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">מצב נוכחי (₪)</label>
                  <input 
                    required
                    type="number"
                    value={newCampaign.current}
                    onChange={e => setNewCampaign({...newCampaign, current: Number(e.target.value)})}
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">תמונת קאבר (URL)</label>
                  <input 
                    value={newCampaign.image}
                    onChange={e => setNewCampaign({...newCampaign, image: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">תיאור הקמפיין</label>
                  <textarea 
                    value={newCampaign.description}
                    onChange={e => setNewCampaign({...newCampaign, description: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none min-h-[100px]"
                  />
                </div>
                <div className="md:col-start-3">
                  <button type="submit" className="w-full bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                    {editingCampaign ? <Save size={20} /> : <Plus size={20} />} 
                    {editingCampaign ? 'עדכן קמפיין' : 'צור קמפיין חדש'}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {campaigns.map(camp => (
                  <div key={camp.id} className="p-8 bg-alabaster rounded-[2rem] border border-charcoal/5 group transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-bold text-2xl mb-2">{camp.title}</h4>
                        <span className="px-3 py-1 bg-gold-warm/10 text-gold-warm rounded-full text-xs font-bold uppercase">{camp.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingCampaign(camp);
                            setNewCampaign({ 
                              title: camp.title, 
                              description: camp.description, 
                              target: camp.target, 
                              current: camp.current, 
                              category: camp.category, 
                              image: camp.image, 
                              active: camp.active 
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} 
                          className="p-2 text-charcoal/30 hover:text-gold-warm transition-colors"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => deleteDoc(doc(db, 'campaigns', camp.id))} className="p-2 text-charcoal/10 hover:text-red-500 transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end text-sm">
                        <span className="text-charcoal/40 font-bold uppercase tracking-widest">התקדמות</span>
                        <span className="font-bold text-lg">₪{camp.current.toLocaleString()} / ₪{camp.target.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-charcoal/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold-warm" 
                          style={{ width: `${Math.min(100, (camp.current/camp.target)*100)}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Donations Table */}
              <div className="pt-12 border-t border-charcoal/5">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <HandCoins className="text-gold-warm" /> תרומות חופשיות שהתקבלו
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b-2 border-charcoal/10">
                        <th className="py-4 px-4 font-bold text-charcoal/60">תורם</th>
                        <th className="py-4 px-4 font-bold text-charcoal/60">סכום</th>
                        <th className="py-4 px-4 font-bold text-charcoal/60">עבור</th>
                        <th className="py-4 px-4 font-bold text-charcoal/60">תאריך</th>
                        <th className="py-4 px-4 font-bold text-charcoal/60">פעולות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customDonations.map(donation => (
                        <tr key={donation.id} className="border-b border-charcoal/5 hover:bg-alabaster transition-colors">
                          <td className="py-4 px-4 font-bold">{donation.donorName || 'אנונימי'}</td>
                          <td className="py-4 px-4 text-green-600 font-bold">₪{donation.amount}</td>
                          <td className="py-4 px-4 text-charcoal/60">{donation.purpose}</td>
                          <td className="py-4 px-4 text-xs font-mono text-charcoal/40">{donation.date ? new Date(donation.date).toLocaleDateString('he-IL') : '--'}</td>
                          <td className="py-4 px-4">
                            <button onClick={() => deleteDoc(doc(db, 'custom_donations', donation.id))} className="text-red-300 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {customDonations.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-charcoal/30 font-serif italic">אין עדיין תרומות חופשיות במערכת</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-12">
              <form onSubmit={addImpactStat} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-alabaster p-8 rounded-[2rem]">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">כותרת</label>
                  <input 
                    required
                    value={newImpactStat.title}
                    onChange={e => setNewImpactStat({...newImpactStat, title: e.target.value})}
                    placeholder="למשל: משפחות נתמכות"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">ערך</label>
                  <input 
                    required
                    value={newImpactStat.value}
                    onChange={e => setNewImpactStat({...newImpactStat, value: e.target.value})}
                    placeholder="למשל: 120+"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">אייקון Lucide</label>
                  <select 
                    value={newImpactStat.icon}
                    onChange={e => setNewImpactStat({...newImpactStat, icon: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none appearance-none bg-white"
                  >
                    <option value="Heart">Heart</option>
                    <option value="BookOpen">BookOpen</option>
                    <option value="Users">Users</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Home">Home</option>
                    <option value="Award">Award</option>
                  </select>
                </div>
                <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> הוסף נתון
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {impactStats.map(stat => (
                  <div key={stat.id} className="p-6 bg-alabaster rounded-[2rem] border border-charcoal/5 flex justify-between items-center group">
                    <div>
                      <h4 className="font-bold text-xl">{stat.value}</h4>
                      <p className="text-xs text-charcoal/40 uppercase font-bold tracking-widest">{stat.title}</p>
                    </div>
                    <button onClick={() => deleteDoc(doc(db, 'impact_stats', stat.id))} className="text-charcoal/10 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-12">
              <form onSubmit={addLesson} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-alabaster p-8 rounded-[2rem]">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">שם השיעור</label>
                  <input 
                    required
                    value={newLesson.title}
                    onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                    placeholder="למשל: דף היומי"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">מרצה / רב</label>
                  <input 
                    required
                    value={newLesson.lecturer}
                    onChange={e => setNewLesson({...newLesson, lecturer: e.target.value})}
                    placeholder="שם המרצה"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">יום / תדירות</label>
                  <input 
                    required
                    value={newLesson.day}
                    onChange={e => setNewLesson({...newLesson, day: e.target.value})}
                    placeholder="למשל: כל יום / יום א'"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">שעה</label>
                  <input 
                    required
                    value={newLesson.time}
                    onChange={e => setNewLesson({...newLesson, time: e.target.value})}
                    placeholder="למשל: 20:00"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">נושא (אופציונלי)</label>
                  <input 
                    value={newLesson.topic}
                    onChange={e => setNewLesson({...newLesson, topic: e.target.value})}
                    placeholder="למשל: גמרא"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> הוסף שיעור
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="p-6 bg-alabaster rounded-[2rem] border border-charcoal/5 group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-xl text-charcoal">{lesson.title}</h4>
                        <p className="text-gold-warm font-bold">{lesson.lecturer}</p>
                      </div>
                      <button onClick={() => deleteDoc(doc(db, 'lessons', lesson.id))} className="text-charcoal/10 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm text-charcoal/60">
                      <div className="flex items-center gap-2">
                        <Clock size={14} /> {lesson.day}, {lesson.time}
                      </div>
                      {lesson.topic && (
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} /> {lesson.topic}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dedications' && (
            <div className="space-y-16">
              {/* Dedications Form */}
              <section className="bg-alabaster p-8 rounded-[2rem] space-y-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Heart className="text-gold-warm" size={24} /> הוספת הקדשה (יום לימוד/פרויקט)
                </h3>
                <form onSubmit={addDedication} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">תוכן ההקדשה</label>
                    <input 
                      required
                      value={newDedication.content}
                      onChange={e => setNewDedication({...newDedication, content: e.target.value})}
                      placeholder="למשל: לעילוי נשמת פלוני בן פלוני"
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">שם התורם (אופציונלי)</label>
                    <input 
                      value={newDedication.donorName}
                      onChange={e => setNewDedication({...newDedication, donorName: e.target.value})}
                      placeholder="שם התורם"
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">סוג</label>
                    <select 
                      value={newDedication.type}
                      onChange={e => setNewDedication({...newDedication, type: e.target.value as any})}
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none appearance-none bg-white"
                    >
                      <option value="memorial">לעילוי נשמת</option>
                      <option value="success">להצלחת</option>
                      <option value="honor">לכבוד</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> הוסף הקדשה
                  </button>
                </form>
              </section>

              {/* Memorials Form */}
              <section className="bg-alabaster p-8 rounded-[2rem] space-y-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="text-gold-warm" size={24} /> הוספת אזכרה (לוח יארצייט)
                </h3>
                <form onSubmit={addMemorial} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">שם הנפטר/ת</label>
                    <input 
                      required
                      value={newMemorial.name}
                      onChange={e => setNewMemorial({...newMemorial, name: e.target.value})}
                      placeholder="שם מלא"
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60 mr-2">תאריך (עברי/לועזי)</label>
                    <input 
                      required
                      value={newMemorial.date}
                      onChange={e => setNewMemorial({...newMemorial, date: e.target.value})}
                      placeholder="למשל: י' באדר"
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                  <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> הוסף אזכרה
                  </button>
                </form>
              </section>

              {/* Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-8">הקדשות פעילות</h3>
                  <div className="space-y-4">
                    {dedications.map(d => (
                      <div key={d.id} className="p-6 bg-alabaster rounded-2xl border border-charcoal/5 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleDedicationActive(d.id, d.active)}
                            className={`p-2 rounded-xl transition-all ${d.active ? 'bg-gold-warm text-white' : 'bg-charcoal/5 text-charcoal/30'}`}
                            title={d.active ? 'הסר מהדף הראשי' : 'הצג בדף הראשי'}
                          >
                            <CheckCircle size={20} />
                          </button>
                          <div>
                            <p className="font-bold text-charcoal">{d.content}</p>
                            <p className="text-sm text-charcoal/40">{d.donorName && `הוקדש ע"י: ${d.donorName}`}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteDoc(doc(db, 'dedications', d.id))} className="text-charcoal/10 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-8">לוח אזכרות</h3>
                  <div className="space-y-4">
                    {memorials.map(m => (
                      <div key={m.id} className="p-6 bg-alabaster rounded-2xl border border-charcoal/5 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleMemorialToday(m.id, m.today)}
                            className={`p-2 rounded-xl transition-all ${m.today ? 'bg-gold-warm text-white' : 'bg-charcoal/5 text-charcoal/30'}`}
                            title={m.today ? 'הסר מהדף הראשי' : 'הצג בדף הראשי'}
                          >
                            <Calendar size={20} />
                          </button>
                          <div>
                            <p className="font-bold text-charcoal">{m.name}</p>
                            <p className="text-sm text-gold-warm font-bold">{m.date}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteDoc(doc(db, 'memorials', m.id))} className="text-charcoal/10 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'businesses' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map(biz => (
                  <div key={biz.id} className="border border-charcoal/10 rounded-3xl overflow-hidden bg-alabaster">
                    <div className="aspect-video relative">
                      <img src={biz.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${biz.approved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {biz.approved ? 'מאושר' : 'ממתין לאישור'}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-lg mb-1">{biz.name}</h4>
                      <p className="text-xs text-charcoal/40 mb-4">{biz.category}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleBusinessApproval(biz.id, biz.approved)}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                            biz.approved ? 'bg-charcoal/5 text-charcoal/60' : 'bg-green-500 text-white'
                          }`}
                        >
                          {biz.approved ? 'בטל אישור' : 'אשר עסק'}
                        </button>
                        <button onClick={() => deleteDoc(doc(db, 'businesses', biz.id))} className="p-2 text-charcoal/20 hover:text-red-500">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-12">
              <section className="bg-alabaster p-8 rounded-[2rem] border border-charcoal/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-charcoal">
                   <Bell className="text-gold-warm" /> ניהול הודעות מתפרצות
                </h3>
                <form onSubmit={addAnnouncement} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-charcoal/60">כותרת ההודעה</label>
                      <input 
                        required
                        value={newAnnouncement.title}
                        onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        placeholder="למשל: שינוי דחוף בזמני תפילות"
                        className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                      />
                    </div>
                    <div className="flex items-end pb-4">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-14 h-8 rounded-full transition-all relative ${newAnnouncement.isUrgent ? 'bg-red-500' : 'bg-charcoal/10'}`}>
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${newAnnouncement.isUrgent ? 'left-1' : 'left-7'}`} />
                        </div>
                        <input 
                          type="checkbox"
                          className="hidden"
                          checked={newAnnouncement.isUrgent}
                          onChange={e => setNewAnnouncement({...newAnnouncement, isUrgent: e.target.checked})}
                        />
                        <span className={`font-bold transition-colors ${newAnnouncement.isUrgent ? 'text-red-500' : 'text-charcoal/40'}`}>
                          סמן כהודעה דחופה (פופ-אפ)
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60">תוכן ההודעה</label>
                    <textarea 
                      required
                      value={newAnnouncement.content}
                      onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      placeholder="פרטו את השינוי או העדכון..."
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none min-h-[120px]"
                    />
                  </div>
                  <button type="submit" className="bg-charcoal text-white px-10 py-5 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2 shadow-lg">
                    <Plus size={20} /> שלח הודעה מתפרצת
                  </button>
                </form>
              </section>

              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                   <Clock className="text-charcoal/40" size={20} /> היסטוריית הודעות
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {announcements.map(msg => (
                    <div key={msg.id} className={`p-6 bg-white rounded-2xl border transition-all ${msg.isUrgent ? 'border-red-200 bg-red-50/10' : 'border-charcoal/5'} flex justify-between items-center group`}>
                      <div className="flex gap-6 items-start">
                        <div className={`p-4 rounded-2xl shrink-0 ${msg.isUrgent ? 'bg-red-100 text-red-500' : 'bg-charcoal/5 text-charcoal/40'}`}>
                          <Bell size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-lg">{msg.title}</h4>
                            {msg.isUrgent && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">דחוף</span>}
                            {!msg.active && <span className="bg-charcoal/10 text-charcoal/40 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">ארכיון</span>}
                          </div>
                          <p className="text-charcoal/60 text-sm mb-2">{msg.content}</p>
                          <span className="text-[10px] font-mono text-charcoal/30 uppercase">{msg.createdAt ? new Date(msg.createdAt).toLocaleString('he-IL') : '--'}</span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => toggleAnnouncement(msg.id, msg.active)}
                          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${msg.active ? 'bg-green-500 text-white border-green-500' : 'bg-white text-charcoal/40 border-charcoal/10'}`}
                        >
                          {msg.active ? 'פעיל' : 'הפעלה מחדש'}
                        </button>
                        <button onClick={() => deleteDoc(doc(db, 'announcements', msg.id))} className="p-2 text-charcoal/10 hover:text-red-500 transition-colors">
                          <Trash2 size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'annual_circle' && (
            <div className="space-y-12">
              <section className="bg-alabaster p-8 rounded-[2rem] border border-charcoal/5">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Calendar className="text-gold-warm" /> ניהול מעגל השנה
                </h3>
                <form onSubmit={addAnnualCircle} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60">שם האירוע</label>
                    <input 
                      required
                      value={newAnnualCircle.title}
                      onChange={e => setNewAnnualCircle({...newAnnualCircle, title: e.target.value})}
                      placeholder="למשל: תמיכה לפסח"
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60">מחיר מומלץ (₪)</label>
                    <input 
                      required
                      type="number"
                      value={newAnnualCircle.price}
                      onChange={e => setNewAnnualCircle({...newAnnualCircle, price: Number(e.target.value)})}
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-charcoal/60">אייקון</label>
                    <select 
                      value={newAnnualCircle.icon}
                      onChange={e => setNewAnnualCircle({...newAnnualCircle, icon: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none appearance-none bg-white"
                    >
                      <option value="Calendar">Calendar</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="Zap">Zap</option>
                      <option value="Heart">Heart</option>
                      <option value="Sun">Sun</option>
                      <option value="Moon">Moon</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> הוסף אירוע
                  </button>
                  <div className="lg:col-span-4 space-y-2">
                    <label className="text-sm font-bold text-charcoal/60">תיאור קצר</label>
                    <input 
                      value={newAnnualCircle.description}
                      onChange={e => setNewAnnualCircle({...newAnnualCircle, description: e.target.value})}
                      placeholder="הסבר קצר על מהות התרומה..."
                      className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                    />
                  </div>
                </form>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annualCircle.map(item => {
                  const Icon = (Icons as any)[item.icon] || Calendar;
                  return (
                    <div key={item.id} className="p-6 bg-alabaster rounded-[2rem] border border-charcoal/5 flex justify-between items-center group">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold-warm">
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold">{item.title}</h4>
                          <span className="text-sm text-gold-warm font-bold">₪{item.price}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteDoc(doc(db, 'annual_circle', item.id))} className="text-charcoal/10 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'gabbais' && (
            <div className="space-y-12">
              <form onSubmit={addAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-alabaster p-8 rounded-[2rem]">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-charcoal/60 mr-2">אימייל של גבאי חדש</label>
                  <input 
                    required
                    type="email"
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-6 py-4 rounded-2xl border border-charcoal/10 focus:ring-2 focus:ring-gold-warm outline-none"
                  />
                </div>
                <button type="submit" className="bg-charcoal text-white py-4 rounded-2xl font-bold hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> הוסף גבאי מערכת
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {admins.map(admin => (
                  <div key={admin.id} className="flex justify-between items-center p-6 bg-alabaster rounded-2xl border border-charcoal/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gold-warm/10 rounded-full flex items-center justify-center text-gold-warm">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{admin.email}</p>
                        <p className="text-xs text-charcoal/40">גבאי במערכת</p>
                      </div>
                    </div>
                    {admin.email !== 'd0559296626@gmail.com' && (
                      <button onClick={() => deleteDoc(doc(db, 'users', admin.id))} className="text-charcoal/20 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
