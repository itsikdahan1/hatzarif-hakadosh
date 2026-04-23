import type { Metadata } from "next";
import { YouthClient } from "./YouthClient";

export const metadata: Metadata = {
  title: "שיעור הצעירים",
  description: "המפגש השבועי לצעירי שכונת נאות אשלים - תורה, קפה וחיבור אמיתי בהצריף הקדוש",
};

export default function YouthPage() {
  return <YouthClient />;
}
