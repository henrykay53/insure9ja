create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  public_ref text not null unique,
  applicant_full_name text,
  email text,
  phone text,
  product_type text not null,
  payload_json jsonb not null,
  payment_reference text,
  payment_amount numeric(14,2),
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  doc_type text not null,
  storage_bucket text,
  storage_path text,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_applications_public_ref on public.applications(public_ref);
create index if not exists idx_application_documents_application_id on public.application_documents(application_id);
create index if not exists idx_application_events_application_id on public.application_events(application_id);

