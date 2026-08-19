-- Allows a newly-signed-up user to claim an existing client row (added by
-- a freelancer as an invite) by matching their own auth email, but only
-- while portal_user_id is still unset — prevents hijacking an already
-- claimed or unrelated client record.
create policy "clients_self_claim" on clients for update
  using (
    portal_user_id is null
    and email = (select email from auth.users where id = auth.uid())
  )
  with check (portal_user_id = auth.uid());
