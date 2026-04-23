import { AppProviders } from "@/components/AppProviders";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AnnouncementPopup } from "@/src/components/AnnouncementPopup";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-gold-warm/20 relative" dir="rtl">
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <AnnouncementPopup />
      </div>
    </AppProviders>
  );
}
