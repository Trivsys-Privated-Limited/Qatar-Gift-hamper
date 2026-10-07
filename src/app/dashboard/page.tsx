import type { Metadata } from "next";
import { Dashboard } from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Owner dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="pb-20 md:pb-28">
      <Dashboard />
    </div>
  );
}
