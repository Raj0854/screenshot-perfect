import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { business as fallbackBusiness, services as fallbackServices, gallery as fallbackGallery } from "@/lib/site";

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("business_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data;
  },
});

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort");
    if (error) throw error;
    return data;
  },
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => {
    const { data, error } = await supabase.from("gallery_images").select("*").order("sort").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async () => {
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
});

export function useBusiness() {
  const { data } = useQuery(settingsQuery);
  const phoneDigits = data ? data.phone.replace(/\D/g, "") : fallbackBusiness.phoneTel.replace(/\D/g, "");
  return {
    ...fallbackBusiness,
    ...(data && {
      name: data.name,
      phoneDisplay: data.phone,
      phoneTel: `+${phoneDigits.length === 10 ? "91" + phoneDigits : phoneDigits}`,
      whatsapp: data.whatsapp.replace(/\D/g, ""),
      address: data.address,
      hours: data.hours,
    }),
    instagram: data?.instagram ?? "",
    facebook: data?.facebook ?? "",
  };
}

export type PublicService = { slug: string; title: string; short: string; body: string; price: string; image: string };

export function useServices(): PublicService[] {
  const { data } = useQuery(servicesQuery);
  if (!data) return fallbackServices.map((s) => ({ ...s, price: "" }));
  return data
    .filter((s) => s.active)
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      short: s.short,
      body: s.body,
      price: s.price,
      image: s.image_url || fallbackServices.find((f) => f.slug === s.slug)?.image || fallbackServices[0]!.image,
    }));
}

export function useGallery() {
  const { data } = useQuery(galleryQuery);
  if (data && data.length > 0)
    return { sample: false, items: data.map((g) => ({ src: g.url, cat: g.category, alt: g.alt || `${g.category} makeup`, w: undefined, h: undefined })) };
  return { sample: true, items: fallbackGallery };
}

export function usePublishedTestimonials() {
  const { data } = useQuery(testimonialsQuery);
  return (data ?? []).filter((t) => t.published);
}

export async function uploadMedia(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("Upload failed");
  return data.signedUrl;
}
