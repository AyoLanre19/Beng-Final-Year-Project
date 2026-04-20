create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  company_name text,
  email text not null unique,
  phone text,
  cac_number text,
  password_hash text not null,
  user_type text not null check (user_type in ('individual', 'sme', 'company')),
  role text not null default 'user' check (role in ('user', 'admin', 'individual', 'sme', 'company')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  original_name text not null,
  file_type text not null,
  source_format text,
  source_bank text,
  storage_path text not null,
  upload_status text not null default 'uploaded'
    check (upload_status in ('uploaded', 'parsed', 'classified', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists raw_transactions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  row_index integer not null,
  raw_date text,
  raw_description text,
  raw_amount text,
  raw_debit text,
  raw_credit text,
  raw_balance text,
  raw_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  document_id uuid references documents(id) on delete set null,
  transaction_date date,
  description text not null,
  amount numeric(15,2) not null,
  direction text not null check (direction in ('inflow', 'outflow')),
  category text,
  ai_category text,
  user_category text,
  confidence double precision,
  source_type text,
  source_bank text,
  is_user_edited boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists tax_returns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  user_type text not null check (user_type in ('individual', 'sme', 'company')),
  tax_period text not null,
  total_income numeric(15,2) not null default 0,
  total_expenses numeric(15,2) not null default 0,
  total_tax numeric(15,2) not null default 0,
  vat_amount numeric(15,2) not null default 0,
  withholding_amount numeric(15,2) not null default 0,
  filing_status text not null default 'draft'
    check (filing_status in ('draft', 'submitted', 'approved', 'audit')),
  reference_number text not null unique,
  filing_data jsonb,
  breakdown jsonb,
  submitted_at timestamptz,
  approved_by uuid references users(id)
);

create table if not exists admin_flags (
  id uuid primary key default gen_random_uuid(),
  filing_id uuid not null references tax_returns(id) on delete cascade,
  reason text not null,
  flagged_by uuid not null references users(id),
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
