export interface AdmissionsTimelineItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
}

export const ADMISSIONS_TIMELINE_ITEMS: AdmissionsTimelineItem[] = [
  {
    id: "psychometric-spring",
    title: "פסיכומטרי אביב",
    date: "2026-04-10",
    description: "המועד הקרוב לבחינת הפסיכומטרי. כדאי לסגור הרשמה ולעקוב אחרי הפרסומים הרשמיים.",
    tags: ["פסיכומטרי", "הרשמה"],
  },
  {
    id: "summer-bagrut",
    title: "תחילת בגרויות קיץ",
    date: "2026-05-20",
    description: "פתיחת תקופת בגרויות הקיץ לבחינות המרכזיות.",
    tags: ["בגרויות", "קיץ"],
  },
  {
    id: "psychometric-summer",
    title: "פסיכומטרי קיץ",
    date: "2026-07-05",
    description: "מועד נוסף לפסיכומטרי למי שמשפרים או ניגשים לראשונה.",
    tags: ["פסיכומטרי"],
  },
  {
    id: "mor-prep",
    title: "היערכות למו״ר / מרק״ם",
    date: "2026-08-15",
    description: "חלון זמן מומלץ להשלמת הכנה לראיונות ולמבחנים האישיותיים.",
    tags: ["מו״ר", "מרק״ם"],
  },
];
