"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  fontSize: 100,
  setFontSize: () => {},
  highContrast: false,
  setHighContrast: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export function AppProviders({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .high-contrast {
        --color-alabaster: #ffffff;
        --color-charcoal: #000000;
        --color-gold-warm: #000000;
        --color-slate-blue: #000000;
      }
      .high-contrast * {
        background-color: white !important;
        color: black !important;
        border-color: black !important;
        box-shadow: none !important;
        text-shadow: none !important;
        font-family: var(--font-sans) !important;
      }
      .high-contrast button, .high-contrast a {
        border: 2px solid black !important;
        padding: 4px !important;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
