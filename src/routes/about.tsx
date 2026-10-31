import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import studio from "@/assets/studio.jpg";
import { PageHero } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: meta("About — Moms Beauty Touch", "Meet the makeup artist behind Moms Beauty Touch in Vasai-Virar and her personal approach to beauty.") }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="About" title="The artist behind the brush" />
      <section className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 md:grid-cols-2">
        <Reveal><div className="img-zoom aspect-[4/5] rounded-sm shadow-soft"><img src={hero} alt="Makeup by Moms Beauty Touch" className="h-full w-full object-cover" /></div></Reveal>
        <Reveal delay={150}>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-4 text-4xl">Beauty, made personal</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Moms Beauty Touch is a makeup studio based in Kaner, Vasai-Virar, specialising in bridal, wedding, party and engagement makeup. For the past year we've been helping clients feel confident and beautiful on the days that matter most.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every appointment starts with listening — to your plans, your style and how you want to feel — so the result is unmistakably you.
          </p>
        </Reveal>
      </section>
      <section className="bg-secondary/50 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-3">
          {[
            ["Philosophy", "Enhance, never mask. Makeup should bring out your natural features."],
            ["Experience", "One year of creating looks for brides, families and celebrations across Vasai-Virar."],
            ["Your way", "Each look is designed around your skin, outfit, jewellery and occasion."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 120}><h3 className="text-3xl">{t}</h3><p className="mt-3 text-muted-foreground">{d}</p></Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <img src={studio} alt="Makeup kit" loading="lazy" className="aspect-[21/9] w-full rounded-sm object-cover" />
        <Link to="/book" className="mt-12 inline-block rounded-sm bg-primary px-7 py-4 text-sm text-primary-foreground hover:bg-gold hover:text-gold-foreground">Book Your Appointment</Link>
      </section>
    </>
  );
}
