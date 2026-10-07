import { BowIcon } from "./Icons";

/** Thin gold line with a small ribbon bow in the middle. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex max-w-6xl items-center gap-4 px-4 md:px-6 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold" />
      <BowIcon className="h-4 w-8 text-gold" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
