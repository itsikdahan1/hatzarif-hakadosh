export const SYNAGOGUE_INFO = {
  name: "הצריף הקדוש",
  tagline: "בית כנסת קהילתי בשכונת נאות אשלים, ראשון לציון",
  subTagline: "קהילת 'הצריף הקדוש' בנאות אשלים. מקום לתורה, תפילה ופעילות לתושבי השכונה.",
  location: "רחוב התזמורת 51, נאות אשלים, ראשון לציון",
  rabbi: "הרב אייל מרום",
  rabbiQuote: "אדם בלי תפילה זה גוף בלי נשמה. הולך, מדבר, אוכל, עובד — אבל חסר לו הדבר הכי בסיסי: חיבור לבורא עולם.",
  rabbiStory: "בית הכנסת פועל תחת הנהגתו של הרב אייל מרום שליט\"א בנאות אשלים. המקום מהווה מרכז רוחני וחברתי לצעירים ומבוגרים כאחד, עם דגש על קירוב לבבות ושיעורי תורה בגובה העיניים.",
  social: {
    tiktok: "https://www.tiktok.com/@hairokah",
    youtube: "https://www.youtube.com/@example",
    instagram: "https://www.instagram.com/example",
    whatsapp: "https://chat.whatsapp.com/example"
  },
  silenceSection: {
    title: "שקט וריכוז בתפילה",
    description: "אנו מקפידים על חווית תפילה מכבדת ושקטה. בבית הכנסת שלנו תוכלו למצוא רגע של שקט אמיתי מהמירוץ היומיומי ולהתמקד בתפילה ללא הסחות דעת."
  },
  youthSection: {
    title: "שיעור לצעירים - יום שני",
    rabbiName: "הרב ניב אלמלם",
    description: "שיעור תורה שבועי לצעירי השכונה. מדברים על הדברים שבאמת מעסיקים אותנו: חיים מודרניים, זוגיות, עבודה ומשמעות. בואו לשתות קפה בנחת ולהכיר חברים חדשים מהשכונה.",
    lessonDetails: "שיעור קליל עם הרב ניב אלמלם, תאורה נעימה וכיבוד. מתאים לכולם - דתיים, מסורתיים וחילונים.",
    whatsappCTA: "שלחו לי תזכורת לשיעור",
    whatsappMessage: "שלום, אשמח לקבל תזכורת שבועית לשיעור הצעירים ביום שני",
    gallery: []
  },
  community: {
    projects: {
      title: "חסד ועזרה הדדית",
      description: "פרויקטים של סיוע למשפחות נזקקות וביקור חולים בשכונה."
    },
    mentorship: {
      title: "נטוורקינג וייעוץ",
      description: "חיבור בין בעלי ניסיון בקהילה לצעירים בתחילת הדרך המקצועית."
    },
    businessDirectory: {
      title: "עסקים של חברי הקהילה",
      description: "בואו נפרגן אחד לשני. כאן תוכלו למצוא עסקים מקומיים של חברי הקהילה שלנו ולהיעזר בשירותים שלהם.",
      whatsappCTA: "גם לי יש עסק, איך מצטרפים?",
      whatsappMessage: "שלום, אשמח לקבל פרטים על הצטרפות למאגר העסקים הקהילתי",
      list: [
        {
          name: "חי רוקח — נדל\"ן וסרטוני וידאו",
          category: "נדל\"ן ומדיה",
          description: "ייעוץ וליווי בנדל\"ן, וכן עריכת סרטוני וידאו מקצועיים עם AI. חבר קהילה פעיל ומסור.",
          image: "",
          whatsapp: "972528782558"
        },
        {
          name: "יצחק דהן — בניית אתרים",
          category: "טכנולוגיה",
          description: "בניית אתרים ומערכות דיגיטליות מקצועיות. חבר הקהילה שבנה את האתר הזה.",
          image: "",
          whatsapp: "972559296626"
        }
      ]
    },
    testimonial: {
      text: "חזק ביותר! מסר מעורר מאוד. רבנו אייל פצצה של דבר, דברים נכונים וחזקים. חזק וברוך!",
      author: "חברי הקהילה, נאות אשלים"
    }
  },
  schedule: {
    note: "אנו מקפידים על עמידה בזמנים כדי לאפשר לכם לשלב את התפילה והשיעורים בלוח הזמנים היומי שלכם ללא עיכובים.",
    prayers: [
      { id: "shacharit", name: "שחרית — פתח אליהו", time: "05:50", type: "morning", isDynamic: true },
      { id: "shiur_yomi", name: "שיעור תורה יומי", time: "16:40", type: "lesson", note: "מגידי שיעור מתחלפים: ר' יעקב מלכה, ר' יעקב בוזגלו, ר' ניר, ר' אברהם, ר' יניב" },
      { id: "mincha_arvit", name: "מנחה וערבית — פתח אליהו", time: "17:40", type: "afternoon" }
    ],
    shabbat: {
      erevShabbat: [
        { id: "erev_mincha", name: "ערב שבת — פתח אליהו", time: "18:10" }
      ],
      shacharit: [
        { id: "shabbat_shacharit", name: "תפילת שחרית", time: "06:45", note: "מתחילים ב'פתח אליהו'" }
      ],
      shacharitExtras: [
        { id: "seuda_shabbat", title: "סעודת שבת כיד המלך", type: "seuda" },
        { id: "shabbat_shiur", title: "שיעור תורה מרתק", lecturer: "ר' יעקב בוזגלו שליט\"א", type: "shiur" }
      ],
      mincha: [
        { id: "mincha_rishona", name: "מנחה ראשונה", time: "13:15", afterNote: "בסיום התפילה: שיעור תורה." },
        { id: "mincha_shniya", name: "מנחה שנייה", time: "18:20", afterNote: "בסיום התפילה: סעודה שלישית ודברי תורה." }
      ],
      motzeiShabbat: [
        { id: "arvit_motzei", name: "תפילת ערבית", time: "19:35", note: "מזמורים למוצאי שבת" },
        { id: "havdala", name: "הבדלה ברוב עם", time: "", type: "event" }
      ],
      limudNosaf: {
        description: "הלימוד בבית המדרש יימשך עד צאת השבת.",
        tzetShabbat: "20:32",
        tzetNote: "רבנו תם"
      }
    },
    mondaySpecial: {
      title: "יום שני - שיעור צעירים",
      time: "20:30",
      description: "שיעור פתוח לכולם. מדברים בגובה העיניים על נושאי היום יום מזווית יהודית. קפה וכיבוד במקום."
    }
  },
  seudot: {
    title: "סעודות שבת בקהילה",
    description: "סעודות שבת משותפות בבית הכנסת – אווירה חמה, אוכל טעים ודברי תורה. כולם מוזמנים!",
    list: [
      { name: "סעודת שבת כיד המלך", when: "לאחר תפילת שחרית", description: "ארוחה קהילתית משותפת עם דברי תורה ושירה." },
      { name: "סעודה שלישית", when: "לאחר מנחה שנייה", description: "סעודה שלישית עם דברי תורה ואווירת שבת מרוממת." }
    ]
  },
  contact: {
    gabbai: "972537553665",
    gabbaiDisplay: "053-755-3665",
    gabbaiName: "רביבו",
    rabbi: "972509792117",
    rabbiDisplay: "050-979-2117",
    email: "office@hatzarif.org.il",
    waze: "https://waze.com/ul?q=רחוב התזמורת 51 ראשון לציון",
    googleMaps: "https://maps.google.com/?q=רחוב התזמורת 51 ראשון לציון",
    donations: "https://secure.donation-link.com/hatzarif"
  },
  updatesWhatsApp: "https://wa.me/972537553665?text=%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3%20%D7%9C%D7%A7%D7%91%D7%95%D7%A6%D7%AA%20%D7%94%D7%95%D7%95%D7%90%D7%A6%D7%A4%20%D7%A9%D7%9C%20%D7%94%D7%A6%D7%A8%D7%99%D7%A3%20%D7%94%D7%A7%D7%93%D7%95%D7%A9.",
  philanthropy: {
    activeCampaigns: [],
    impact: [
      { title: "משפחות נתמכות", value: "120+", icon: "Heart" },
      { title: "שיעורי תורה בשבוע", value: "18", icon: "BookOpen" },
      { title: "מתנדבים פעילים", value: "45", icon: "Users" },
      { title: "ארוחות שבת וחג", value: "350", icon: "Coffee" }
    ],
    impactLevels: [
      { amount: 50, label: "₪50", description: "סל מזון אישי למשפחה", impact: "סיוע מיידי למשפחה אחת השבוע" },
      { amount: 180, label: "₪180", description: "הקדשת שיעור תורה", impact: "זכות הלימוד של עשרות צעירים" },
      { amount: 500, label: "₪500", description: "שותפות שבועית בכולל", impact: "אחזקת המקום למשך שבוע" },
      { amount: 1000, label: "₪1000", description: "חבילת אימוץ משפחה", impact: "ליווי צמוד למשפחה למשך חודש" },
    ],
    monthlyTiers: [
      { amount: 52, label: "₪52 לחודש", description: "ידיד הקהילה", impact: "תמיכה בתחזוקה השוטפת" },
      { amount: 120, label: "₪120 לחודש", description: "עמוד התורה", impact: "מימון ישיר של שיעור שבועי" },
      { amount: 250, label: "₪250 לחודש", description: "בונה הקהילה", impact: "שותפות מלאה בכל פרויקטי החסד" },
    ]
  },
  team: [
    {
      name: "הרב אייל מרום",
      role: "רב הקהילה",
      bio: "מנהיג את הקהילה מיום היווסדה, רואה בקירוב לבבות ובבניית קהילה מגובשת שליחות עליונה.",
      mediaSlot: "team_rabbi"
    },
    {
      name: "ר' יעקב בוזגלו שליט\"א",
      role: "מגיד שיעור שבת",
      bio: "מעביר שיעור תורה מרתק בכל שבת לאחר תפילת שחרית. שיעוריו ידועים בעומקם ובנגישותם.",
      mediaSlot: "team_lecturer"
    },
    {
      name: "הרב ניב אלמלם",
      role: "רב הצעירים",
      bio: "מוביל את פעילות הצעירים בשכונה, מנגיש את עומק התורה לדור החדש בשפה פשוטה ואוהבת.",
      mediaSlot: "team_youth_rabbi"
    },
    {
      name: "רביבו",
      role: "גבאי בית הכנסת",
      bio: "אחראי על ניהול קבוצת הוואטסאפ הקהילתית, הניהול השוטף, זמני התפילות ורווחת המתפללים. תמיד כאן לכל שאלה ובקשה.",
      mediaSlot: "team_gabbai"
    }
  ]
};
