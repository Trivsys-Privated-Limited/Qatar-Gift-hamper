import type { Metadata } from "next";
import { LoginView } from "@/components/LoginView";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="pb-20 md:pb-28">
      <LoginView />
    </div>
  );
}
