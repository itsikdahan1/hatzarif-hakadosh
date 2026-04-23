import type { Metadata } from "next";
import { DonationClient } from "./DonationClient";

export const metadata: Metadata = {
  title: "תרומה לבית הכנסת",
  description: "תרמו לבית הכנסת הצריף הקדוש - תרומות מאובטחות, קבלה מוכרת למס, מגוון אפשרויות תשלום",
};

export default function DonationPage() {
  return <DonationClient />;
}
