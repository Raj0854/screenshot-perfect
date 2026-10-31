import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ArrowRight, Heart, Sparkles, Clock } from "lucide-react";
import hero from "@/assets/hero.jpg";
import studio from "@/assets/studio.jpg";
import party from "@/assets/party.jpg";
import { waLink } from "@/lib/site";
import { useBusiness, useServices, usePublishedTestimonials } from "@/lib/data";
import { Reveal, SectionHead } from "@/components/site/Reveal";
import { SampleNote } from "@/components/site/Layout";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: meta(
      "Moms Beauty Touch — Bridal & Party Makeup Artist, Vasai-Virar",
      "Professional bridal, wedding, party and engagement makeup in Vasai-Virar. Rated 4.52 on Google. Book your appointment today.",
    ),
  }),
  component: Index,
});

function Index() {
  const business = useBusiness();
  const services = useServices();
  const reviews = usePublishedTestimonials();
  return (
    <>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-32 pb-20 md:grid-cols-12 md:pt-40">
        <div className="md:col-span-6">
          <Reveal>
            <p className="eyebrow">Makeup Artist · Vasai-Virar</p>
            <h1 className="mt-6 text-5xl leading-[1.02] md:text-7xl">
              Beauty That Makes Every Moment <em className="text-gold">Unforgettable.</em>
            </h1>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">
              Professional makeup artistry for your most beautiful moments. Discover personalized bridal, wedding, party and engagement makeup.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/book" className="rounded-sm bg-primary px-7 py-4 text-sm tracking-wide text-primary-foreground transition-colors hover:bg-gold hover:text-gold-foreground">
                Book Your Appointment
              </Link>
              <Link to="/portfolio" className="group inline-flex items-center gap-2 rounded-sm border border-foreground/30 px-7 py-4 text-sm tracking-wide transition-colors hover:border-gold">
                Explore Our Work <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`size-4 text-gold ${i < 4 ? "fill-gold" : "fill-gold/50"}`} />)}</div>
              <p className="text-sm"><strong>{business.rating}</strong> / 5 on Google</p>
            </div>
          </Reveal>
        </div>
        <div className="relative md:col-span-6">
          <div className="img-zoom ml-auto aspect-[4/5] max-w-lg rounded-sm shadow-soft">
            <img src={hero} alt="Bridal makeup look" width={1280} height={1600} className="h-full w-full object-cover" />
          </div>
          <div className="img-zoom absolute -bottom-10 -left-2 hidden w-44 rounded-sm border-8 border-background shadow-soft md:block">
            <img src={party} alt="Party makeup look" width={1024} height={1280} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Reveal>
          <p className="eyebrow">Welcome</p>
          <p className="mt-6 font-serif text-3xl leading-snug md:text-4xl">
            "Every face tells its own story. My work is to bring out your natural beauty so you feel completely yourself — only more radiant."
          </p>
        </Reveal>
      </section>

      <section className="bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Services" title="Artistry for every occasion" />
            <Link to="/services" className="text-sm underline underline-offset-4 hover:text-gold">All services</Link>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 100}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="group block">
                  <div className="img-zoom aspect-[3/4] rounded-sm">
                    <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mt-5 text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead eyebrow="Portfolio" title="Selected work" center />
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[hero, studio, party].map((src, i) => (
            <Reveal key={i} delay={i * 120} className={i === 1 ? "md:mt-16" : ""}>
              <div className="img-zoom aspect-[4/5] rounded-sm"><img src={src} alt="Portfolio sample" loading="lazy" className="h-full w-full object-cover" /></div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8"><SampleNote /></div>
      </section>

      <section className="bg-primary py-24 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow">Why choose us</p>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {[
              { icon: Heart, t: "Personal approach", d: "Every look is planned around you — your features, outfit and occasion." },
              { icon: Sparkles, t: "Made to last", d: "Makeup prepared to stay fresh through ceremonies, celebrations and photographs." },
              { icon: Clock, t: "Flexible timing", d: "Early mornings and late events — we work around your schedule." },
            ].map(({ icon: I, t, d }, i) => (
              <Reveal key={t} delay={i * 120}>
                <I className="size-6 text-gold" />
                <h3 className="mt-5 text-3xl">{t}</h3>
                <p className="mt-3 text-sm opacity-70">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <SectionHead eyebrow="Reviews" title={`Rated ${business.rating} out of 5 on Google`} center />
        <Reveal>
          {reviews.length === 0 ? (
            <p className="mt-6 text-muted-foreground">Client reviews will be shared here as they're added.</p>
          ) : (
            <div className="mt-12 grid gap-6 text-left md:grid-cols-2">
              {reviews.slice(0, 4).map((r) => (
                <figure key={r.id} className="rounded-sm bg-card p-8 shadow-soft">
                  <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-4 fill-gold text-gold" />)}</div>
                  <blockquote className="mt-4 font-serif text-xl leading-snug">"{r.text}"</blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">— {r.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapQuery)}`} target="_blank" rel="noreferrer" className="mt-6 inline-block text-sm underline underline-offset-4 hover:text-gold">
            Read reviews on Google
          </a>
        </Reveal>
      </section>

      <section className="relative overflow-hidden">
        <img src={studio} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative mx-auto my-20 max-w-2xl glass rounded-sm px-8 py-16 text-center">
          <h2 className="text-4xl md:text-5xl">Let's create your look</h2>
          <p className="mt-4 text-muted-foreground">Share your date and we'll get back to you to discuss the details.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/book" className="rounded-sm bg-primary px-7 py-4 text-sm text-primary-foreground hover:bg-gold hover:text-gold-foreground">Book Your Appointment</Link>
            <a href={waLink(undefined, business.whatsapp)} target="_blank" rel="noreferrer" className="rounded-sm border border-foreground/30 px-7 py-4 text-sm hover:border-gold">WhatsApp us</a>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">{business.phoneDisplay} · {business.hours}</p>
        </div>
      </section>
    </>
  );
}
