import type { Metadata } from "next";
import { LessonsClient } from "./LessonsClient";

export const metadata: Metadata = {
  title: "שיעורי תורה",
  description: "מגוון רחב של שיעורי תורה לאורך כל השבוע, לכל הרמות ובכל הנושאים - בית הכנסת הצריף הקדוש",
};

export default function LessonsPage() {
  return <LessonsClient />;
}
