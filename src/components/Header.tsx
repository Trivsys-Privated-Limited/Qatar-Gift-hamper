"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session";
import { Logo } from "./Logo";
import { CloseIcon } from "./Icons";

const NAV = [
  { href: "/#hampers", label: "Hampers" },
  { href: "/#how-it-works", label: "How it works", wideOnly: true },
  { href: "/never-miss-a-moment", label: "Never Miss a Moment" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const account = session ? `Hi, ${session.name.split(" ")[0]}` : "Sign in";

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/50 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-20 md:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Qatar Surprise Hamper home">
          <Logo className="h-12 md:h-16" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex lg:gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium text-ink/80 transition-colors hover:text-maroon ${"wideOnly" in item ? "hidden lg:inline" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="text-sm font-semibold text-maroon hover:underline">
            {session === undefined ? <span className="invisible">Sign in</span> : account}
          </Link>
          <Link href="/#hampers" className="btn btn-primary">
            Order now
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-maroon hover:bg-gold/20 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-gold/40 bg-cream px-4 pb-5 pt-2 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block border-b border-gold/25 py-3.5 font-medium text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" onClick={() => setOpen(false)} className="block border-b border-gold/25 py-3.5 font-semibold text-maroon">
                {session ? `${account} · My account` : "Sign in"}
              </Link>
            </li>
          </ul>
          <Link href="/#hampers" onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">
            Order now
          </Link>
        </nav>
      )}
    </header>
  );
}
