import type { Metadata } from "next";
import { BusinessClient } from "./BusinessClient";

export const metadata: Metadata = {
  title: "עסקים בקהילה",
  description: "מדריך העסקים של קהילת נאות אשלים - תמיכה בעסקים מקומיים וחיזוק הכלכלה הקהילתית",
};

export default function BusinessPage() {
  return <BusinessClient />;
}
