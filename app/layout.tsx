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
    "ראשון לציון",
    "הצריף הקדוש",
    "תפילה",
    "שיעורי תורה",
    "קהילה יהודית",
    "הרב אייל מרום",
    "בית כנסת ראשון לציון",
    "בית כנסת נאות אשלים",
  ],
  openGraph: {
    title: `${SYNAGOGUE_INFO.name} — בית כנסת בנאות אשלים, ראשון לציון`,
    description: SYNAGOGUE_INFO.tagline,
    locale: "he_IL",
    type: "website",
    siteName: SYNAGOGUE_INFO.name,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PlaceOfWorship",
              "name": "הצריף הקדוש",
              "alternateName": "בית כנסת הצריף הקדוש",
              "description": "בית כנסת קהילתי בשכונת נאות אשלים, ראשון לציון. מקום לתורה, תפילה ופעילות לתושבי השכונה.",
              "url": "https://www.hatzrif.online",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "רחוב התזמורת 51",
                "addressLocality": "ראשון לציון",
                "addressRegion": "מרכז",
                "addressCountry": "IL",
                "description": "שכונת נאות אשלים"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "addressCountry": "IL"
              },
              "areaServed": {
                "@type": "Place",
                "name": "נאות אשלים, ראשון לציון"
              },
              "founder": {
                "@type": "Person",
                "name": "הרב אייל מרום"
              },
              "sameAs": [
                "https://www.tiktok.com/@hairokah"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-alabaster text-charcoal font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
