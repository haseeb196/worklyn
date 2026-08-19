-- Links a client's portal login (auth.users) to their clients row.
-- Set when a client accepts an invite / signs up for portal access.
alter table clients add column portal_user_id uuid references auth.users(id) on delete set null;
create unique index clients_portal_user_id_idx on clients(portal_user_id) where portal_user_id is not null;
