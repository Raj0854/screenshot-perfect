create type public.app_role as enum ('admin');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- First account ever created becomes the admin.
create or replace function public.grant_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_first_admin after insert on auth.users
for each row execute function public.grant_first_admin();

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short text not null default '',
  body text not null default '',
  price text not null default '',
  image_url text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public read active services" on public.services for select to anon, authenticated using (active or public.has_role(auth.uid(),'admin'));
create policy "admin write services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.services (slug,title,short,body,sort) values
('bridal','Bridal Makeup','A radiant, long-wearing look made around you, your outfit and your wedding day.','Your bridal look is planned with you, from skin preparation to the final touch. We talk through your outfit, jewellery, skin and the feel you want, so the look stays true to you through every ceremony and photograph.',1),
('party','Party Makeup','Polished glamour for celebrations, receptions and evenings out.','From soft shimmer to bold evening glam, party makeup is tailored to the occasion, your outfit and the lighting you''ll be in, so you feel confident all night.',2),
('wedding','Wedding Makeup','For the bride''s family, bridesmaids and guests who want to look their best.','Elegant makeup for mothers, sisters, bridesmaids and guests. Looks are coordinated so everyone feels beautiful and photographs well together.',3),
('engagement','Engagement Makeup','Fresh, luminous makeup for your engagement and pre-wedding events.','A soft, glowing look for your engagement ceremony, roka or pre-wedding shoot, designed to feel natural while still standing out in photographs.',4);

-- Gallery
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  category text not null default 'Bridal',
  alt text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery_images to anon, authenticated;
grant insert, update, delete on public.gallery_images to authenticated;
grant all on public.gallery_images to service_role;
alter table public.gallery_images enable row level security;
create policy "public read gallery" on public.gallery_images for select to anon, authenticated using (true);
create policy "admin write gallery" on public.gallery_images for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  rating int not null default 5,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
alter table public.testimonials enable row level security;
create policy "public read published" on public.testimonials for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admin write testimonials" on public.testimonials for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Business settings (single row)
create table public.business_settings (
  id int primary key default 1 check (id = 1),
  name text not null,
  phone text not null,
  whatsapp text not null,
  address text not null,
  hours text not null,
  instagram text not null default '',
  facebook text not null default '',
  updated_at timestamptz not null default now()
);
grant select on public.business_settings to anon, authenticated;
grant update on public.business_settings to authenticated;
grant all on public.business_settings to service_role;
alter table public.business_settings enable row level security;
create policy "public read settings" on public.business_settings for select to anon, authenticated using (true);
create policy "admin update settings" on public.business_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.business_settings (name,phone,whatsapp,address,hours) values
('Moms Beauty Touch','+91 72198 84594','917219884594','Near Manti Memorial High School, Naleswar Nagar, Kaner, Vasai-Virar, Maharashtra 401303, India','Open 24 hours');

-- Inquiries
create type public.inquiry_status as enum ('pending','accepted','rejected','completed');
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  name text not null,
  phone text not null,
  email text,
  service text not null,
  event_date date not null,
  preferred_time text not null,
  location text not null,
  notes text,
  status inquiry_status not null default 'pending',
  internal_notes text not null default '',
  created_at timestamptz not null default now()
);
grant select, update, delete on public.inquiries to authenticated;
grant all on public.inquiries to service_role;
alter table public.inquiries enable row level security;
create policy "admin manage inquiries" on public.inquiries for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.submit_inquiry(
  _name text, _phone text, _email text, _service text, _event_date date,
  _preferred_time text, _location text, _notes text
) returns text language plpgsql security definer set search_path = public as $$
declare _ref text; _digits text;
begin
  _name := btrim(coalesce(_name,'')); _location := btrim(coalesce(_location,''));
  _digits := regexp_replace(coalesce(_phone,''), '\D', '', 'g');
  if length(_name) < 2 or length(_name) > 100 then raise exception 'Invalid name'; end if;
  if _digits !~ '^(91)?[6-9][0-9]{9}$' then raise exception 'Invalid phone number'; end if;
  if _email is not null and _email <> '' and (length(_email) > 255 or _email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then raise exception 'Invalid email'; end if;
  if _event_date is null or _event_date < current_date then raise exception 'Invalid event date'; end if;
  if length(_location) < 2 or length(_location) > 200 then raise exception 'Invalid location'; end if;
  if coalesce(length(_notes),0) > 1000 or length(coalesce(_preferred_time,'')) = 0 or length(_preferred_time) > 20 then raise exception 'Invalid details'; end if;
  if not exists (select 1 from services where slug = _service and active) then raise exception 'Invalid service'; end if;
  _digits := right(_digits, 10);

  -- Duplicate protection: same phone, service and date within 30 minutes returns the existing ID.
  select ref into _ref from inquiries
   where phone = _digits and service = _service and event_date = _event_date
     and created_at > now() - interval '30 minutes' limit 1;
  if _ref is not null then return _ref; end if;

  loop
    _ref := 'MBT-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
    exit when not exists (select 1 from inquiries where ref = _ref);
  end loop;
  insert into inquiries(ref,name,phone,email,service,event_date,preferred_time,location,notes)
  values (_ref,_name,_digits,nullif(btrim(_email),''),_service,_event_date,_preferred_time,_location,nullif(btrim(_notes),''));
  return _ref;
end $$;
revoke all on function public.submit_inquiry from public;
grant execute on function public.submit_inquiry to anon, authenticated;