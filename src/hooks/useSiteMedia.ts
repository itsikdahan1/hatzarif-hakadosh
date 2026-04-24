"use client";

import { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";

export interface MediaSlot {
  id: string;
  label: string;
  location: string;
  group: string;
}

export const MEDIA_SLOTS: MediaSlot[] = [
  // צוות ההנהגה (דף אודות)
  { id: "team_rabbi", label: "תמונת הרב אייל מרום", location: "דף אודות — צוות ההנהגה", group: "צוות" },
  { id: "team_lecturer", label: "תמונת ר' יעקב בוזגלו", location: "דף אודות — צוות ההנהגה", group: "צוות" },
  { id: "team_youth_rabbi", label: "תמונת הרב ניב אלמלם", location: "דף אודות — צוות ההנהגה", group: "צוות" },
  { id: "team_gabbai", label: "תמונת הגבאי רביבו", location: "דף אודות — צוות ההנהגה", group: "צוות" },
  // דף שיעור הצעירים
  { id: "youth_hero", label: "תמונה ראשית — דף צעירים", location: "דף שיעור הצעירים — תמונה גדולה עליונה", group: "שיעור צעירים" },
  { id: "youth_gallery_1", label: "גלריית צעירים — תמונה 1", location: "דף שיעור הצעירים — \"רגעים מהשיעור\"", group: "שיעור צעירים" },
  { id: "youth_gallery_2", label: "גלריית צעירים — תמונה 2", location: "דף שיעור הצעירים — \"רגעים מהשיעור\"", group: "שיעור צעירים" },
  { id: "youth_gallery_3", label: "גלריית צעירים — תמונה 3", location: "דף שיעור הצעירים — \"רגעים מהשיעור\"", group: "שיעור צעירים" },
  // דף אודות
  { id: "about_synagogue", label: "תמונת בית הכנסת מבפנים", location: "דף אודות — בלוק שקיפות ואמינות", group: "בית הכנסת" },
  // תרומות מיוחדות
  { id: "special_matanot", label: "תמונת מתנות לאביונים", location: "דף תרומות — קמפיין מתנות לאביונים", group: "תרומות מיוחדות" },
  { id: "special_kimcha", label: "תמונת קמחא דפסחא", location: "דף תרומות — קמפיין קמחא דפסחא", group: "תרומות מיוחדות" },
];

export function useSiteMedia() {
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "site_media"),
      (snapshot) => {
        const map: Record<string, string> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (data.url) map[d.id] = data.url;
        });
        setMedia(map);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "site_media")
    );
    return () => unsub();
  }, []);

  return media;
}

export async function saveSiteMedia(slotId: string, url: string) {
  await setDoc(doc(db, "site_media", slotId), { url, updatedAt: new Date().toISOString() });
}
