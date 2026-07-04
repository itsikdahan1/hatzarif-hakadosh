"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { SYNAGOGUE_INFO } from "../constants";

// Type for the site settings (mirrors SYNAGOGUE_INFO structure)
export type SiteSettings = typeof SYNAGOGUE_INFO;

interface SiteSettingsContextValue {
  settings: SiteSettings;
  isLive: boolean; // true = reading from Firestore, false = using fallback
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: SYNAGOGUE_INFO,
  isLive: false,
  isLoading: true,
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export { SiteSettingsContext };

/**
 * Deep-merge: overlays Firestore data on top of SYNAGOGUE_INFO defaults.
 * Only replaces fields that actually exist in Firestore (non-undefined).
 */
function deepMerge<T extends Record<string, any>>(defaults: T, overrides: Record<string, any> | undefined): T {
  if (!overrides) return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (key in overrides && overrides[key] !== undefined) {
      if (
        typeof defaults[key] === "object" &&
        defaults[key] !== null &&
        !Array.isArray(defaults[key]) &&
        typeof overrides[key] === "object" &&
        overrides[key] !== null &&
        !Array.isArray(overrides[key])
      ) {
        (result as any)[key] = deepMerge(defaults[key], overrides[key]);
      } else {
        (result as any)[key] = overrides[key];
      }
    }
  }
  return result;
}

/**
 * Hook for internal use inside the Provider.
 * Reads from Firestore doc `site_settings/main` and merges with SYNAGOGUE_INFO fallback.
 */
export function useSiteSettingsLoader(): SiteSettingsContextValue {
  const [firestoreData, setFirestoreData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // If db is not configured (no env vars), stay on fallback
    if (!db) {
      setIsLoading(false);
      return;
    }

    const docRef = doc(db, "site_settings", "main");
    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setFirestoreData(snapshot.data());
          setIsLive(true);
        } else {
          // Auto-seed: document doesn't exist yet - create it from defaults
          const plain = JSON.parse(JSON.stringify(SYNAGOGUE_INFO));
          setDoc(docRef, plain, { merge: true }).catch(() => {});
          setIsLive(false);
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn("site_settings read failed, using fallback:", error.message);
        setIsLive(false);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const settings = deepMerge(SYNAGOGUE_INFO, firestoreData ?? undefined);

  return { settings, isLive, isLoading };
}

/**
 * Save site settings to Firestore. Called from admin panel.
 * Only saves the provided partial - deep-merged on read.
 */
export async function saveSiteSettings(data: Partial<SiteSettings>) {
  await setDoc(doc(db, "site_settings", "main"), data, { merge: true });
}

/**
 * Seed Firestore with the full SYNAGOGUE_INFO as initial data.
 * Safe to call multiple times (merge: true won't overwrite edits).
 */
export async function seedSiteSettings() {
  // Convert the SYNAGOGUE_INFO object to a plain serializable object
  const plain = JSON.parse(JSON.stringify(SYNAGOGUE_INFO));
  await setDoc(doc(db, "site_settings", "main"), plain, { merge: true });
}
