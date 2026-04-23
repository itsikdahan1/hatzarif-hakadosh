import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "אודות הקהילה",
  description: "הסיפור של הצריף הקדוש - קהילת נאות אשלים. חזון, שליחות, והנהגה קהילתית",
};

export default function AboutPage() {
  return <AboutClient />;
}
