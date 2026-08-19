-- Row Level Security — Phase 2
-- Helper: is the current user a client member of a given project?
create or replace function is_project_member(p_project_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from project_members pm
    join clients c on c.id = pm.client_id
    where pm.project_id = p_project_id
      and c.portal_user_id = auth.uid()
  );
$$;

-- profiles
alter table profiles enable row level security;
create policy "profiles_select_own" on profiles for select using (id = auth.uid());
create policy "profiles_insert_own" on profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on profiles for update using (id = auth.uid());

-- clients (freelancer-owned; a client can read their own row via portal_user_id)
alter table clients enable row level security;
create policy "clients_owner_all" on clients for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "clients_self_select" on clients for select
  using (portal_user_id = auth.uid());

-- projects (owner full access; client can select projects they're a member of)
alter table projects enable row level security;
create policy "projects_owner_all" on projects for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "projects_member_select" on projects for select
  using (is_project_member(id));

-- tasks (owner full access; client can select tasks on their accessible projects)
alter table tasks enable row level security;
create policy "tasks_owner_all" on tasks for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks_member_select" on tasks for select
  using (is_project_member(project_id));

-- files (owner full access; client can select files on their accessible projects)
alter table files enable row level security;
create policy "files_owner_all" on files for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "files_member_select" on files for select
  using (is_project_member(project_id));

-- invoices (owner full access; client can select their own invoices)
alter table invoices enable row level security;
create policy "invoices_owner_all" on invoices for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "invoices_client_select" on invoices for select
  using (
    exists (select 1 from clients c where c.id = invoices.client_id and c.portal_user_id = auth.uid())
  );

-- invoice_items (follows parent invoice)
alter table invoice_items enable row level security;
create policy "invoice_items_owner_all" on invoice_items for all
  using (exists (select 1 from invoices i where i.id = invoice_id and i.user_id = auth.uid()))
  with check (exists (select 1 from invoices i where i.id = invoice_id and i.user_id = auth.uid()));
create policy "invoice_items_client_select" on invoice_items for select
  using (exists (
    select 1 from invoices i join clients c on c.id = i.client_id
    where i.id = invoice_id and c.portal_user_id = auth.uid()
  ));

-- project_members (owner manages; client reads only their own membership row)
alter table project_members enable row level security;
create policy "project_members_owner_all" on project_members for all
  using (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()))
  with check (exists (select 1 from projects p where p.id = project_id and p.user_id = auth.uid()));
create policy "project_members_self_select" on project_members for select
  using (exists (select 1 from clients c where c.id = client_id and c.portal_user_id = auth.uid()));

-- comments (owner full access on their projects/tasks; client can select+insert on accessible projects)
alter table comments enable row level security;
create policy "comments_owner_all" on comments for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "comments_member_select" on comments for select
  using (project_id is not null and is_project_member(project_id));
create policy "comments_member_insert" on comments for insert
  with check (
    project_id is not null and is_project_member(project_id)
    and client_id = (select id from clients where portal_user_id = auth.uid())
  );
