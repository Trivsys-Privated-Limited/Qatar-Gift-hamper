import Link from "next/link";
import { business } from "@/config/business";
import { chatLink, formatPhone } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Icons";

const LINKS = [
  { href: "/#hampers", label: "Hampers" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/never-miss-a-moment", label: "Never Miss a Moment" },
  { href: "/dashboard", label: "Owner dashboard (demo)" },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/40 bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <Logo className="h-14" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Surprise gift hampers, beautifully wrapped and delivered across {business.city.split(",")[0]}.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="kicker">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link className="text-ink/80 transition-colors hover:text-maroon" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="kicker">Contact</p>
          <a
            href={chatLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-ink/80 transition-colors hover:text-maroon"
          >
            <WhatsAppIcon className="h-4 w-4 text-maroon" />
            <span>
              WhatsApp <span className="whitespace-nowrap">{formatPhone(business.whatsappNumber)}</span>
            </span>
          </a>
          <p className="mt-2.5 text-sm text-ink/80">{business.city}</p>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs tracking-wide text-muted md:px-6">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
