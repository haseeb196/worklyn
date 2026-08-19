# Deployment — Worklyn

## 1. Supabase production project
1. Create a new Supabase project (separate from any dev project).
2. Run migrations in order: `supabase/migrations/*.sql` via the SQL editor
   or `supabase db push` (Supabase CLI).
3. Confirm the `project-files` storage bucket exists (created by
   `00000000000004_storage.sql`) and is **not** public.
4. In Auth settings, set the Site URL and Redirect URLs to your production
   domain (needed for password reset / signup email links).

## 2. GitHub
1. Push this repository to GitHub (`main` branch).
2. Add repo secrets used by `.github/workflows/ci.yml`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Vercel
1. Import the GitHub repo into Vercel.
2. Set environment variables (Production + Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — mark as sensitive, never
     expose to the client)
   - `NEXT_PUBLIC_SITE_URL` (your production URL, used for password-reset
     redirect and metadata base)
3. Deploy. Vercel builds with `npm run build` automatically.

## 4. Post-deploy checklist
- [ ] Sign up as a freelancer, confirm profile row is created
- [ ] Create a client, project, task, invoice
- [ ] Upload a file, confirm signed download works
- [ ] Invite a client (add a client with their real email), have them sign
      up with that same email, confirm they land in `/portal/[projectId]`
      with correct — and only correct — access
- [ ] Confirm a second freelancer account cannot see the first account's
      data (RLS check)
- [ ] Run `npm run check` and `npm run build` locally one more time before
      tagging a release
