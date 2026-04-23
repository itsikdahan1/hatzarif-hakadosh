import type { Metadata } from "next";
import { MemorialsClient } from "./MemorialsClient";

export const metadata: Metadata = {
  title: "הקדשות ואזכרות",
  description: "לוח אזכרות עדכני ואפשרויות הקדשה לזכות ולעילוי נשמה - הצריף הקדוש",
};

export default function MemorialsPage() {
  return <MemorialsClient />;
}
