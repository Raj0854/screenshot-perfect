import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { useServices } from "@/lib/data";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: meta("Makeup Services — Moms Beauty Touch", "Bridal, party, wedding and engagement makeup services in Vasai-Virar.") }),
  component: Services,
});

function Services() {
  const services = useServices();
  return (
    <>
      <PageHero eyebrow="Services" title="Makeup for your moments" text="Prices depend on your look and event. Ask us for a personalised quote." />
      <section className="mx-auto grid max-w-6xl gap-16 px-6 py-24">
        {services.map((s, i) => (
          <Reveal key={s.slug}>
            <article className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="img-zoom aspect-[4/3] rounded-sm shadow-soft"><img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" /></div>
              <div>
                <p className="eyebrow">0{i + 1}</p>
                <h2 className="mt-3 text-4xl md:text-5xl">{s.title}</h2>
                <p className="mt-5 text-muted-foreground">{s.short}</p>
                {s.price && <p className="mt-3 text-sm"><span className="eyebrow">Price</span> <span className="ml-2">{s.price}</span></p>}
                <div className="mt-8 flex gap-4">
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="rounded-sm border border-foreground/30 px-6 py-3 text-sm hover:border-gold">View Details</Link>
                  <Link to="/book" search={{ service: s.slug }} className="rounded-sm bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-gold hover:text-gold-foreground">Enquire Now</Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}
