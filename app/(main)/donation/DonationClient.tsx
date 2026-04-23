"use client";

import { useRouter } from "next/navigation";
import { DonationPage } from "@/src/components/DonationPage";

export function DonationClient() {
  const router = useRouter();

  return <DonationPage onBack={() => router.push('/')} />;
}
