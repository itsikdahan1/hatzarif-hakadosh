
import { JewishCalendar, HebrewDateFormatter } from 'kosher-zmanim';

/**
 * Enhanced Jewish Calendar Service using kosher-zmanim + Hebcal API.
 * Provides context for dynamic UI updates, parasha info, and seasonal prayer reminders.
 */

// =============================================
// שירות פרשת השבוע + מידע שבועי אוטומטי
// =============================================

export interface ShabbatWeeklyInfo {
  parashaName: string;
  hebrewDate: string;
  hebrewMonth: string;
  pirkeiAvotChapter: number | null;
  seasonalPrayer: string;   // "מוריד הטל" | "משיב הרוח ומוריד הגשם"
  talUmatar: string;        // "ותן ברכה" | "ותן טל ומטר לברכה"
  omerCount: { day: number; formatted: string } | null;
  candleLighting: string | null;
  havdalah: string | null;
}

/**
 * Fetches the upcoming Shabbat parasha name from the Hebcal API.
 * Uses Rishon LeZion geonameid (293703) for location-specific times.
 */
async function fetchParashaFromHebcal(): Promise<{ parasha: string; candles: string | null; havdalah: string | null }> {
  try {
    const res = await fetch('https://www.hebcal.com/shabbat?cfg=json&geonameid=293703&M=on&lg=he');
    const data = await res.json();
    let parasha = '';
    let candles: string | null = null;
    let havdalah: string | null = null;

    for (const item of (data.items || [])) {
      if (item.category === 'parashat') {
        parasha = item.hebrew || item.title || '';
      }
      if (item.category === 'candles' && item.date) {
        const d = new Date(item.date);
        candles = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      }
      if (item.category === 'havdalah' && item.date) {
        const d = new Date(item.date);
        havdalah = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      }
    }
    return { parasha, candles, havdalah };
  } catch {
    return { parasha: '', candles: null, havdalah: null };
  }
}

/**
 * Calculates seasonal prayer insertions based on the Jewish calendar date.
 * - משיב הרוח ומוריד הגשם: from 22 Tishrei (Shemini Atzeret) to 14 Nissan
 * - מוריד הטל: from 15 Nissan to 21 Tishrei
 * - ותן טל ומטר לברכה: from 7 Cheshvan to 14 Nissan (Israel)
 * - ותן ברכה: rest of year
 */
function getSeasonalPrayers(month: number, day: number) {
  // Month mapping in kosher-zmanim: NISSAN=1, IYAR=2, ..., ELUL=6, TISHREI=7, CHESHVAN=8, ..., ADAR=12, ADAR_II=13
  let isMashiv = false;
  if (month === 7 && day >= 22) isMashiv = true;       // Tishrei from 22
  else if (month >= 8) isMashiv = true;                 // Cheshvan through Adar II
  else if (month === 1 && day <= 14) isMashiv = true;   // Nissan through 14

  let isTalUmatar = false;
  if (month === 8 && day >= 7) isTalUmatar = true;      // Cheshvan from 7
  else if (month >= 9) isTalUmatar = true;               // Kislev through Adar II
  else if (month === 1 && day <= 14) isTalUmatar = true; // Nissan through 14

  return {
    seasonalPrayer: isMashiv ? "משיב הרוח ומוריד הגשם" : "מוריד הטל",
    talUmatar: isTalUmatar ? "ותן טל ומטר לברכה" : "ברכנו"
  };
}

/**
 * Calculates the Pirkei Avot chapter for the current week.
 * Read on Shabbat afternoons from after Pesach (22 Nissan) through Elul.
 * 6 chapters cycling.
 */
function getPirkeiAvotChapter(month: number, day: number): number | null {
  const isInSeason = (month === 1 && day >= 22) || (month >= 2 && month <= 6);
  if (!isInSeason) return null;

  let daysSince = 0;
  if (month === 1) {
    daysSince = day - 22;
  } else {
    daysSince = 30 - 22; // remaining Nissan days = 8
    const monthLengths: Record<number, number> = { 2: 29, 3: 30, 4: 29, 5: 30, 6: 29 };
    for (let m = 2; m < month; m++) {
      daysSince += monthLengths[m] || 29;
    }
    daysSince += day;
  }
  const weekNum = Math.floor(daysSince / 7);
  return (weekNum % 6) + 1;
}

/**
 * Formats the omer count in Hebrew.
 */
function formatOmer(omerDay: number): string {
  const weeks = Math.floor(omerDay / 7);
  const days = omerDay % 7;
  if (weeks === 0) return `${omerDay} ימים לעומר`;
  if (days === 0) return `${weeks} שבועות לעומר`;
  return `${weeks} שבועות ו-${days} ימים לעומר`;
}

/**
 * Main function: Gets all weekly Shabbat information.
 * Combines Hebcal API (parasha name, times) with kosher-zmanim (Hebrew date, prayers).
 */
export async function getShabbatWeeklyInfo(date: Date = new Date()): Promise<ShabbatWeeklyInfo> {
  const jc = new JewishCalendar(date);
  const formatter = new HebrewDateFormatter();
  formatter.setHebrewFormat(true);

  // Fetch parasha + times from Hebcal API
  const hebcal = await fetchParashaFromHebcal();

  // Fallback: use kosher-zmanim if API fails
  let parashaName = hebcal.parasha;
  if (!parashaName) {
    const nextShabbat = new Date(date);
    const dayOfWeek = nextShabbat.getDay();
    nextShabbat.setDate(nextShabbat.getDate() + (dayOfWeek === 6 ? 0 : (6 - dayOfWeek)));
    const jcShabbat = new JewishCalendar(nextShabbat);
    try {
      parashaName = formatter.formatParsha(jcShabbat) || 'פרשת השבוע';
    } catch {
      parashaName = 'פרשת השבוע';
    }
  }

  // Hebrew date
  const hebrewDate = formatter.format(jc);
  const hebrewMonth = formatter.formatMonth(jc);

  // Seasonal prayers
  const month = jc.getJewishMonth();
  const day = jc.getJewishDayOfMonth();
  const { seasonalPrayer, talUmatar } = getSeasonalPrayers(month, day);

  // Omer count
  const omerDay = jc.getDayOfOmer();
  const omerCount = omerDay > 0 ? { day: omerDay, formatted: formatOmer(omerDay) } : null;

  // Pirkei Avot
  const pirkeiAvotChapter = getPirkeiAvotChapter(month, day);

  return {
    parashaName,
    hebrewDate,
    hebrewMonth,
    pirkeiAvotChapter,
    seasonalPrayer,
    talUmatar,
    omerCount,
    candleLighting: hebcal.candles,
    havdalah: hebcal.havdalah
  };
}

// =============================================
// שירות הקשר יהודי קיים (לדונט ולבאנר)
// =============================================

export interface JewishContext {
  period: 'regular' | 'purim' | 'pesach' | 'shavuot' | 'tisha-beav' | 'rosh-hashana' | 'yom-kippur' | 'sukkot' | 'chanukah' | 'omer';
  title: string;
  subtitle: string;
  isUrgent?: boolean;
  specialDonationType?: 'machatzit-hashekel' | 'matanot-laevyonim' | 'kimcha-depischa' | 'kaparot' | 'none';
  daysLeft?: number;
  monthName: string;
}

export function getCurrentJewishContext(date: Date = new Date()): JewishContext {
  const jewishCalendar = new JewishCalendar(date);
  const formatter = new HebrewDateFormatter();
  formatter.setHebrewFormat(true);
  const monthName = formatter.formatMonth(jewishCalendar);
  const dayOfMonth = jewishCalendar.getJewishDayOfMonth();
  
  // 1. Purim & Machatzit Hashekel (Adar)
  if (jewishCalendar.getJewishMonth() === JewishCalendar.ADAR || jewishCalendar.getJewishMonth() === JewishCalendar.ADAR_II) {
    if (dayOfMonth >= 1 && dayOfMonth <= 13) {
      return {
        period: 'purim',
        title: 'זכר למחצית השקל',
        subtitle: 'מקיימים את מצוות היום בהידור ובזמן',
        specialDonationType: 'machatzit-hashekel',
        monthName
      };
    }
    if (dayOfMonth === 14 || dayOfMonth === 15) {
      return {
        period: 'purim',
        title: 'מתנות לאביונים',
        subtitle: 'בו ביום: דואגים לשמחת הפורים של כל אחד',
        isUrgent: true,
        specialDonationType: 'matanot-laevyonim',
        monthName
      };
    }
  }

  // 2. Pesach & Kimcha Depischa (Nissan)
  if (jewishCalendar.getJewishMonth() === JewishCalendar.NISSAN) {
    if (dayOfMonth < 15) {
      return {
        period: 'pesach',
        title: 'קמחא דפסחא',
        subtitle: 'דואגים לסדר פסח מכובד לכל משפחה',
        specialDonationType: 'kimcha-depischa',
        daysLeft: 15 - dayOfMonth,
        monthName
      };
    }
    return {
      period: 'pesach',
      title: 'חג המצות',
      subtitle: 'חג פסח כשר ושמח לכל בית ישראל',
      monthName
    };
  }

  // 3. Kaparot (Elul/Tishrei)
  if (jewishCalendar.getJewishMonth() === JewishCalendar.ELUL) {
    return {
      period: 'rosh-hashana',
      title: 'חודש הרחמים והסליחות',
      subtitle: 'מתכוננים לשנה החדשה בצדקה ובמעשים טובים',
      monthName
    };
  }

  if (jewishCalendar.getJewishMonth() === JewishCalendar.TISHREI) {
    if (dayOfMonth >= 1 && dayOfMonth < 10) {
      return {
        period: 'yom-kippur',
        title: 'פדיון כפרות',
        subtitle: 'צדקה תציל ממוות - פדיון כפרות מסודר ומהודר',
        specialDonationType: 'kaparot',
        isUrgent: true,
        monthName
      };
    }
  }

  // 4. Omer
  const omerDay = jewishCalendar.getDayOfOmer();
  if (omerDay > 0) {
    return {
      period: 'omer',
      title: 'ספירת העומר',
      subtitle: `היום ${omerDay} ימים לעומר - זמן לחיזוק שבין אדם לחברו`,
      monthName
    };
  }

  // Default Monthly Context
  return {
    period: 'regular',
    title: 'שותפות בבניין הקהילה',
    subtitle: `חודש ${monthName} - זמן של תפילה, תורה וחסד`,
    monthName
  };
}
