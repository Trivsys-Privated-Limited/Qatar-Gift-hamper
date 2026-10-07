"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session";
import { chatLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { CloseIcon, WhatsAppIcon } from "./Icons";

const NAV = [
  { href: "/#hampers", label: "Hampers" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/never-miss-a-moment", label: "Never Miss a Moment" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const session = useSession();
  const account = session ? `Hi, ${session.name.split(" ")[0]}` : "Sign in";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
        solid ? "border-gold/40 bg-cream/90 backdrop-blur-md" : "border-transparent bg-cream"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[4.75rem] md:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Qatar Surprise Hamper home">
          <Logo className="h-11 md:h-14" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.9rem] text-ink/80 transition-colors hover:text-maroon">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/login" className="text-[0.9rem] text-ink/80 transition-colors hover:text-maroon">
            {session === undefined ? <span className="invisible">Sign in</span> : account}
          </Link>
          <a href={chatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <WhatsAppIcon className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-espresso hover:bg-sand lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <CloseIcon className="h-6 w-6" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-gold/30 bg-cream px-4 pb-6 pt-2 lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col md:px-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-ink/10 py-4 font-heading text-xl text-espresso"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="md:hidden">
              <Link href="/login" onClick={() => setOpen(false)} className="block border-b border-ink/10 py-4 text-maroon">
                {session ? `${account} · My account` : "Sign in"}
              </Link>
            </li>
          </ul>
          <a href={chatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full md:hidden">
            <WhatsAppIcon className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
