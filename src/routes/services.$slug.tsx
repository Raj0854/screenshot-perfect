import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { services, waLink } from "@/lib/site";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? meta(`${loaderData.title} in Vasai-Virar — Moms Beauty Touch`, loaderData.short)
      : [{ title: "Service not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="px-6 py-48 text-center"><h1 className="text-4xl">Service not found</h1><Link to="/services" className="mt-6 inline-block underline">All services</Link></div>
  ),
  component: Detail,
});

function Detail() {
  const s = Route.useLoaderData();
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-36 pb-24 md:grid-cols-2">
      <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-soft"><img src={s.image} alt={s.title} className="h-full w-full object-cover" /></div>
      <div>
        <Link to="/services" className="text-sm text-muted-foreground hover:text-gold">← All services</Link>
        <h1 className="mt-6 text-5xl md:text-6xl">{s.title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{s.body}</p>
        <p className="mt-6 text-sm"><span className="eyebrow">Price</span><br />Shared on request, based on your look and event.</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/book" search={{ service: s.slug }} className="rounded-sm bg-primary px-7 py-4 text-sm text-primary-foreground hover:bg-gold hover:text-gold-foreground">Enquire Now</Link>
          <a href={waLink(`Hello! I'd like to know more about ${s.title}.`)} target="_blank" rel="noreferrer" className="rounded-sm border border-foreground/30 px-7 py-4 text-sm hover:border-gold">Ask on WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
