"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/session";
import { formatPhone } from "@/lib/whatsapp";
import { SignInForm } from "./SignInForm";

export function LoginView() {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-md px-4 pt-10 md:pt-16">
      <div className="text-center">
        <p className="kicker">Your account</p>
        <h1 className="mt-3 text-3xl md:text-4xl">Welcome</h1>
      </div>

      <div className="mt-8">
        {session === undefined ? (
          <div className="card h-80 animate-pulse" aria-hidden="true" />
        ) : session ? (
          <div className="card p-6 text-center sm:p-8">
            <p className="text-ink/75">
              Signed in as <strong className="text-ink">{session.name}</strong> ({formatPhone(session.phone)})
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/never-miss-a-moment" className="btn btn-primary">My dates</Link>
              <button type="button" className="btn btn-secondary" onClick={signOut}>Sign out</button>
            </div>
          </div>
        ) : (
          <SignInForm onSignedIn={() => router.push("/never-miss-a-moment")} />
        )}
      </div>
    </div>
  );
}
