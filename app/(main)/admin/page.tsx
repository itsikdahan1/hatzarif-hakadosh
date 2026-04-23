import type { Metadata } from "next";
import { AdminClient } from "./AdminClient";

export const metadata: Metadata = {
  title: "פאנל ניהול",
  description: "פאנל ניהול לגבאי בית הכנסת הצריף הקדוש",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
