import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/site/Layout";
import { business, waLink } from "@/lib/site";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: meta("Contact — Moms Beauty Touch, Vasai-Virar", "Call, WhatsApp or visit Moms Beauty Touch near Manti Memorial High School, Kaner, Vasai-Virar.") }),
  component: Contact,
});

const input = "w-full rounded-sm border border-input bg-card px-4 py-3 text-sm outline-none focus:border-gold";

function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" />
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24 md:grid-cols-2">
        <div className="space-y-8">
          {[
            { I: MapPin, t: "Address", c: business.address },
            { I: Phone, t: "Phone", c: <a href={`tel:${business.phoneTel}`} className="hover:text-gold">{business.phoneDisplay}</a> },
            { I: MessageCircle, t: "WhatsApp", c: <a href={waLink()} target="_blank" rel="noreferrer" className="hover:text-gold">Chat with us</a> },
            { I: Clock, t: "Hours", c: business.hours },
          ].map(({ I, t, c }) => (
            <div key={t} className="flex gap-5">
              <I className="mt-1 size-5 shrink-0 text-gold" />
              <div><p className="eyebrow">{t}</p><div className="mt-2">{c}</div></div>
            </div>
          ))}
          <form className="space-y-4 border-t pt-8" onSubmit={(e) => { e.preventDefault(); window.open(waLink(`Hi, I'm ${name}. ${msg}`), "_blank"); }}>
            <h2 className="text-3xl">Send a message</h2>
            <input required maxLength={100} placeholder="Your name" className={input} value={name} onChange={(e) => setName(e.target.value)} />
            <textarea required maxLength={1000} rows={4} placeholder="Your message" className={input} value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button className="rounded-sm bg-primary px-7 py-3 text-sm text-primary-foreground hover:bg-gold hover:text-gold-foreground">Send via WhatsApp</button>
          </form>
        </div>
        <iframe title="Map to Moms Beauty Touch" loading="lazy" className="min-h-[460px] w-full rounded-sm border shadow-soft"
          src={`https://www.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`} />
      </section>
    </>
  );
}
