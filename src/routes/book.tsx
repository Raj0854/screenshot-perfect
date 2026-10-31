import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/Layout";
import { services, waLink } from "@/lib/site";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({ service: typeof s.service === "string" ? s.service : undefined }),
  head: () => ({ meta: meta("Book an Appointment — Moms Beauty Touch", "Send an appointment enquiry for bridal, party, wedding or engagement makeup in Vasai-Virar.") }),
  component: Book,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Enter a valid Indian mobile number"),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  service: z.string().min(1, "Choose a service"),
  date: z.string().min(1, "Choose your event date").refine((d) => d >= new Date().toISOString().slice(0, 10), "Date can't be in the past"),
  time: z.string().min(1, "Choose a preferred time"),
  location: z.string().trim().min(2, "Enter the event location").max(200),
  notes: z.string().max(1000).optional(),
});

const input = "w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none focus:border-gold";

function Book() {
  const { service } = Route.useSearch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const r = schema.safeParse(data);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    const v = r.data;
    const svc = services.find((s) => s.slug === v.service)?.title ?? v.service;
    const text = `Appointment enquiry\nName: ${v.name}\nPhone: ${v.phone}${v.email ? `\nEmail: ${v.email}` : ""}\nService: ${svc}\nDate: ${v.date}\nTime: ${v.time}\nLocation: ${v.location}${v.notes ? `\nNotes: ${v.notes}` : ""}`;
    setSent(waLink(text));
  };

  const F = ({ name, label, children }: { name: string; label: string; children: React.ReactNode }) => (
    <label className="block">
      <span className="mb-2 block text-xs tracking-widest uppercase text-muted-foreground">{label}</span>
      {children}
      {errors[name] && <span className="mt-1 block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <>
      <PageHero eyebrow="Booking" title="Book your appointment" text="Share your details and we'll get back to you to confirm availability." />
      <section className="mx-auto max-w-3xl px-6 py-20">
        {sent ? (
          <div className="animate-in fade-in rounded-sm bg-card p-10 text-center shadow-soft">
            <CheckCircle2 className="mx-auto size-12 text-gold" />
            <h2 className="mt-4 text-4xl">Almost done</h2>
            <p className="mt-3 text-muted-foreground">Tap below to send your enquiry on WhatsApp. Your appointment is confirmed only once we reply.</p>
            <a href={sent} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-sm bg-primary px-7 py-4 text-sm text-primary-foreground hover:bg-gold hover:text-gold-foreground">Send on WhatsApp</a>
            <button onClick={() => setSent(null)} className="mt-4 block w-full text-sm text-muted-foreground underline">Edit details</button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="grid gap-6 rounded-sm bg-card p-8 shadow-soft md:grid-cols-2 md:p-12">
            <F name="name" label="Full name *"><input name="name" maxLength={100} className={input} /></F>
            <F name="phone" label="Phone number *"><input name="phone" type="tel" className={input} placeholder="98765 43210" /></F>
            <F name="email" label="Email (optional)"><input name="email" type="email" className={input} /></F>
            <F name="service" label="Service *">
              <select name="service" defaultValue={service ?? ""} className={input}>
                <option value="" disabled>Select a service</option>
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </F>
            <F name="date" label="Event date *"><input name="date" type="date" className={input} /></F>
            <F name="time" label="Preferred time *"><input name="time" type="time" className={input} /></F>
            <div className="md:col-span-2"><F name="location" label="Event location *"><input name="location" maxLength={200} className={input} /></F></div>
            <div className="md:col-span-2"><F name="notes" label="Additional requirements"><textarea name="notes" rows={4} maxLength={1000} className={input} /></F></div>
            <button className="rounded-sm bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground hover:bg-gold hover:text-gold-foreground md:col-span-2">Send Enquiry</button>
          </form>
        )}
      </section>
    </>
  );
}
