-- Storage — Phase 2
insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false)
on conflict (id) do nothing;

-- Path convention: user_id/project_id/file-name
create policy "project_files_owner_all" on storage.objects for all
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "project_files_member_select" on storage.objects for select
  using (
    bucket_id = 'project-files'
    and is_project_member((storage.foldername(name))[2]::uuid)
  );
