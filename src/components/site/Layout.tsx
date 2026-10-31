import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, X, Star } from "lucide-react";
import { useState, type ReactNode } from "react";
import { business, waLink } from "@/lib/site";

const nav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <header className="glass fixed inset-x-0 top-0 z-40 border-b">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-2xl tracking-wide">
            Moms <em className="text-gold">Beauty</em> Touch
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
                {n.label}
              </Link>
            ))}
            <Link to="/book" className="rounded-sm bg-primary px-5 py-2.5 text-sm text-primary-foreground transition-colors hover:bg-gold hover:text-gold-foreground">
              Book Appointment
            </Link>
          </nav>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="animate-in fade-in slide-in-from-top-2 flex flex-col gap-1 border-t px-6 py-4 md:hidden">
            {[...nav, { to: "/book", label: "Book Appointment" } as const].map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 font-serif text-2xl">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3">
          <div>
            <p className="font-serif text-3xl">Moms Beauty Touch</p>
            <p className="mt-4 max-w-xs text-sm opacity-70">Professional makeup artistry in Vasai-Virar for bridal, wedding, party and engagement looks.</p>
            <p className="mt-4 flex items-center gap-2 text-sm"><Star className="size-4 fill-gold text-gold" /> {business.rating} on Google</p>
          </div>
          <div className="text-sm">
            <p className="eyebrow mb-4">Visit</p>
            <p className="opacity-80">{business.address}</p>
            <p className="mt-3 opacity-80">{business.hours}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="eyebrow mb-2">Explore</p>
            {nav.map((n) => <Link key={n.to} to={n.to} className="opacity-80 hover:opacity-100">{n.label}</Link>)}
            <a href={`tel:${business.phoneTel}`} className="opacity-80 hover:opacity-100">{business.phoneDisplay}</a>
          </div>
        </div>
        <p className="border-t border-primary-foreground/10 py-6 text-center text-xs opacity-50">© {new Date().getFullYear()} Moms Beauty Touch</p>
      </footer>
      <a href={waLink("Hello! I'd like to enquire about makeup.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="fixed bottom-20 right-5 z-40 grid size-14 place-items-center rounded-full bg-gold text-gold-foreground shadow-soft transition-transform hover:scale-110 md:bottom-6">
        <MessageCircle />
      </a>
      <Link to="/book" className="fixed inset-x-0 bottom-0 z-30 bg-primary py-4 text-center text-sm tracking-widest text-primary-foreground uppercase md:hidden">
        Book Your Appointment
      </Link>
    </div>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="bg-secondary/60 px-6 pt-36 pb-20 text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mx-auto mt-4 max-w-3xl text-5xl md:text-7xl">{title}</h1>
      {text && <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{text}</p>}
    </section>
  );
}

export function SampleNote() {
  return <p className="text-center text-xs text-muted-foreground italic">Sample images shown — the artist's real work will appear here soon.</p>;
}
