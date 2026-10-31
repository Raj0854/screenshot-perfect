import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero, SampleNote } from "@/components/site/Layout";
import { gallery, galleryCategories } from "@/lib/site";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/portfolio")({
  head: () => ({ meta: meta("Portfolio — Moms Beauty Touch", "Browse bridal, party, engagement and wedding makeup looks by Moms Beauty Touch.") }),
  component: Portfolio,
});

function Portfolio() {
  const [cat, setCat] = useState<string>("All");
  const [idx, setIdx] = useState<number | null>(null);
  const items = cat === "All" ? gallery : gallery.filter((g) => g.cat === cat);

  useEffect(() => {
    if (idx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i! + 1) % items.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i! - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, items.length]);

  return (
    <>
      <PageHero eyebrow="Portfolio" title="Looks we love" />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap justify-center gap-2">
          {galleryCategories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "hover:border-gold"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {items.map((g, i) => (
            <button key={`${cat}-${i}`} onClick={() => setIdx(i)} className="img-zoom animate-in fade-in zoom-in-95 mb-4 block w-full rounded-sm duration-500">
              <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" className="w-full" />
            </button>
          ))}
        </div>
        {items.length === 0 && <p className="py-20 text-center text-muted-foreground">No photos in this category yet.</p>}
        <div className="mt-8"><SampleNote /></div>
      </section>
      {idx !== null && items[idx] && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-primary/95 p-4" onClick={() => setIdx(null)}>
          <button aria-label="Close" className="absolute top-5 right-5 text-primary-foreground"><X className="size-8" /></button>
          <button aria-label="Previous" className="absolute left-3 text-primary-foreground" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + items.length) % items.length); }}><ChevronLeft className="size-10" /></button>
          <img key={idx} src={items[idx].src} alt={items[idx].alt} className="animate-in zoom-in-95 max-h-[88vh] max-w-full rounded-sm object-contain" onClick={(e) => e.stopPropagation()} />
          <button aria-label="Next" className="absolute right-3 text-primary-foreground" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % items.length); }}><ChevronRight className="size-10" /></button>
        </div>
      )}
    </>
  );
}
