"use client";

import { AdminPanel } from "@/src/components/AdminPanel";
import { useRouter } from "next/navigation";

export function AdminClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <AdminPanel onClose={() => router.push('/')} />
    </div>
  );
}
