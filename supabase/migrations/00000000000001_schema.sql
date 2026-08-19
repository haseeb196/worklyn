-- Worklyn schema — Phase 2
create extension if not exists "pgcrypto";

create type client_status as enum ('active','inactive');
create type project_status as enum ('planning','active','on_hold','completed','cancelled');
create type task_status as enum ('todo','in_progress','review','completed');
create type task_priority as enum ('low','medium','high','urgent');
create type invoice_status as enum ('draft','sent','paid','overdue','cancelled');
create type member_role as enum ('client');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  company text,
  phone text,
  website text,
  avatar_url text,
  notes text,
  status client_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index clients_user_id_idx on clients(user_id);

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  name text not null,
  description text,
  status project_status not null default 'planning',
  start_date date,
  due_date date,
  budget numeric(12,2),
  progress int not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_user_id_idx on projects(user_id);
create index projects_client_id_idx on projects(client_id);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status task_status not null default 'todo',
  priority task_priority not null default 'medium',
  due_date date,
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_project_id_status_idx on tasks(project_id, status);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  invoice_number text not null,
  status invoice_status not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, invoice_number)
);
create index invoices_user_id_status_idx on invoices(user_id, status);
create index invoices_client_id_idx on invoices(client_id);

create table invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
create index invoice_items_invoice_id_idx on invoice_items(invoice_id);

create table files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id),
  name text not null,
  storage_path text not null,
  file_size bigint not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);
create index files_project_id_idx on files(project_id);

create table project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  role member_role not null default 'client',
  created_at timestamptz not null default now(),
  unique (project_id, client_id)
);
create index project_members_project_id_idx on project_members(project_id);
create index project_members_client_id_idx on project_members(client_id);

create table comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  user_id uuid references auth.users(id),
  client_id uuid references clients(id),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_parent_check check (
    (project_id is not null) or (task_id is not null)
  ),
  constraint comments_author_check check (
    (user_id is not null) or (client_id is not null)
  )
);
create index comments_project_id_idx on comments(project_id);
create index comments_task_id_idx on comments(task_id);
