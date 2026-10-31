import hero from "@/assets/hero.jpg";
import party from "@/assets/party.jpg";
import studio from "@/assets/studio.jpg";

// Business details. Will move to the admin-editable database in the next phase.
export const business = {
  name: "Moms Beauty Touch",
  phoneDisplay: "+91 72198 84594",
  phoneTel: "+917219884594",
  whatsapp: "917219884594",
  rating: 4.52,
  hours: "Open 24 hours",
  address:
    "Near Manti Memorial High School, Naleswar Nagar, Kaner, Vasai-Virar, Maharashtra 401303, India",
  mapQuery:
    "Moms Beauty Touch, Near Manti Memorial High School, Naleswar Nagar, Kaner, Vasai-Virar, Maharashtra 401303",
};

export const waLink = (text?: string, number: string = business.whatsapp) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export type Service = { slug: string; title: string; short: string; body: string; image: string };

export const services: Service[] = [
  {
    slug: "bridal",
    title: "Bridal Makeup",
    short: "A radiant, long-wearing look made around you, your outfit and your wedding day.",
    body: "Your bridal look is planned with you, from skin preparation to the final touch. We talk through your outfit, jewellery, skin and the feel you want, so the look stays true to you through every ceremony and photograph.",
    image: hero,
  },
  {
    slug: "party",
    title: "Party Makeup",
    short: "Polished glamour for celebrations, receptions and evenings out.",
    body: "From soft shimmer to bold evening glam, party makeup is tailored to the occasion, your outfit and the lighting you'll be in, so you feel confident all night.",
    image: party,
  },
  {
    slug: "wedding",
    title: "Wedding Makeup",
    short: "For the bride's family, bridesmaids and guests who want to look their best.",
    body: "Elegant makeup for mothers, sisters, bridesmaids and guests. Looks are coordinated so everyone feels beautiful and photographs well together.",
    image: studio,
  },
  {
    slug: "engagement",
    title: "Engagement Makeup",
    short: "Fresh, luminous makeup for your engagement and pre-wedding events.",
    body: "A soft, glowing look for your engagement ceremony, roka or pre-wedding shoot, designed to feel natural while still standing out in photographs.",
    image: hero,
  },
];

export const galleryCategories = ["All", "Bridal", "Party", "Engagement", "Wedding", "Special Occasions"] as const;

// Sample images only. Replace with the artist's real work.
export const gallery = [
  { src: hero, cat: "Bridal", alt: "Sample bridal look", w: 1280, h: 1600 },
  { src: party, cat: "Party", alt: "Sample party look", w: 1024, h: 1280 },
  { src: studio, cat: "Special Occasions", alt: "Makeup kit", w: 1280, h: 960 },
  { src: party, cat: "Engagement", alt: "Sample engagement look", w: 1024, h: 1280 },
  { src: hero, cat: "Wedding", alt: "Sample wedding look", w: 1280, h: 1600 },
  { src: studio, cat: "Bridal", alt: "Bridal preparation", w: 1280, h: 960 },
];
