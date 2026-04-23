import type { Metadata } from "next";
import "./globals.css";
import { SYNAGOGUE_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SYNAGOGUE_INFO.name} — קהילת נאות אשלים`,
    template: `%s | ${SYNAGOGUE_INFO.name}`,
  },
  description: SYNAGOGUE_INFO.tagline,
  keywords: [
    "בית כנסת",
    "נאות אשלים",
    "הצריף הקדוש",
    "תפילה",
    "שיעורי תורה",
    "קהילה",
    "תרומה",
    "באר שבע",
  ],
  openGraph: {
    title: SYNAGOGUE_INFO.name,
    description: SYNAGOGUE_INFO.tagline,
    locale: "he_IL",
    type: "website",
  },
  other: {
    "application-name": SYNAGOGUE_INFO.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-alabaster text-charcoal font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
