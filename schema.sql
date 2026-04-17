create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  user_type text not null check (user_type in ('individual', 'sme', 'company')),
  role text not null default 'user' check (role in ('user', 'admin', 'individual', 'sme', 'company')),
  full_name text,
  organization_name text,
  created_at timestamptz not null default now()
);

create table if not exists statements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  filename text not null,
  file_type text,
  file_url text,
  extracted_text text,
  uploaded_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  statement_id uuid references statements(id) on delete set null,
  date date not null,
  description text not null,
  amount numeric(15,2) not null,
  ai_category text not null,
  confidence double precision not null default 0,
  user_category text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists tax_returns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  user_type text not null check (user_type in ('individual', 'sme', 'company')),
  tax_period text not null,
  total_income numeric(15,2) not null default 0,
  total_expenses numeric(15,2) not null default 0,
  total_tax numeric(15,2) not null default 0,
  vat_amount numeric(15,2) not null default 0,
  withholding_amount numeric(15,2) not null default 0,
  filing_status text not null default 'draft' check (filing_status in ('draft', 'submitted', 'approved', 'audit')),
  reference_number text not null unique,
  filing_data jsonb,
  breakdown jsonb,
  submitted_at timestamptz,
  approved_by uuid references profiles(id)
);

create table if not exists admin_flags (
  id uuid primary key default gen_random_uuid(),
  filing_id uuid not null references tax_returns(id) on delete cascade,
  reason text not null,
  flagged_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists ai_logs (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  ai_prediction text not null,
  user_correction text,
  confidence double precision not null default 0,
  corrected boolean not null default false,
  created_at timestamptz not null default now()
);
