# Vercel + Supabase Deployment Guide

This project can be deployed without Lovable auth.

The frontend already uses native Supabase Auth for:
- email/password sign-in
- sign-up
- session restore
- password reset
- profile updates

The only Lovable-specific auth dependency was Google sign-in, and that has been replaced with native Supabase OAuth in the app code.

## 1. Recommended setup order

Use this order for a brand new Supabase project.

1. Create a new Supabase project that you control.
2. In Supabase Auth, enable:
   - Email
   - Google, if you want Google login
3. Add your local and production URLs in Supabase Auth:
   - Site URL: your Vercel domain
   - Redirect URLs:
     - `http://localhost:5173`
     - your Vercel URL
4. Run the SQL migrations from [`supabase/migrations`](/Users/moramielrabaev/Documents/Playground/refuah/supabase/migrations) in filename order.
5. Create the storage buckets through the migrations:
   - `avatars`
   - `library-files`
   - `user-files`
6. Deploy the Supabase Edge Functions if you need email flows:
   - `process-email-queue`
   - `send-transactional-email`
   - `preview-transactional-email`
   - `handle-email-unsubscribe`
   - `handle-email-suppression`
   - `sechem-proxy`
7. Create your first user by signing up through the app.
8. Promote that user manually in `public.profiles`:
   - set `is_admin = true`
   - set `role = 'owner'` if you want owner-only settings screens to work
9. Add Vercel environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_API_URL` only if you have a separate API endpoint
10. Deploy to Vercel.

## 2. What the migrations create

Core auth-linked data:
- `profiles`
- `candidates`
- `simulations`

Content and catalog:
- `announcements`
- `comments`
- `steps`
- `questions`
- `libraries`
- `paths`
- `universities`
- `admission_thresholds`
- `score_thresholds`

Community and social:
- `community_questions`
- `community_replies`
- `community_likes`
- `community_mentions`
- `community_favorites`
- `community_votes`
- `notifications`
- `favorites`
- `friendships`
- `wall_posts`
- `wall_post_likes`
- `profile_visits`

Messaging:
- `conversations`
- `conversation_participants`
- `messages`
- `auto_group_leaves`

Other app data:
- `anonymous_applicants`
- `reports`
- `audit_logs`
- `role_settings`
- `donation_settings`
- `donations`
- `user_files`

Email infrastructure:
- `email_send_log`
- `email_send_state`
- `suppressed_emails`
- `email_unsubscribe_tokens`

Important functions:
- `update_updated_at_column`
- `handle_new_user`
- `is_admin`
- `is_conversation_participant`
- `leave_group_and_promote`
- `send_system_message`
- email queue RPC helpers

## 3. Fresh-project audit

These are the main things likely to break or need manual intervention.

### A. Hardcoded owner user

[`20260325202035_57d8a302-964c-42af-8fb9-8f99a9762f0a.sql`](/Users/moramielrabaev/Documents/Playground/refuah/supabase/migrations/20260325202035_57d8a302-964c-42af-8fb9-8f99a9762f0a.sql) contains:

- `UPDATE profiles SET role = 'owner' WHERE user_id = 'e150226d-e8a4-4c0e-8484-ea967a86d032';`

In a new project, that user will not exist. The migration will likely do nothing, which is safe, but you must manually assign your own user as `owner`.

### B. Duplicate conversation policy

[`20260326121819_99192176-3218-4266-92fb-ee69b1f27fd9.sql`](/Users/moramielrabaev/Documents/Playground/refuah/supabase/migrations/20260326121819_99192176-3218-4266-92fb-ee69b1f27fd9.sql) creates a conversation insert policy, and a later migration replaces it with a safer `DROP POLICY IF EXISTS`.

If you run migrations strictly in order, this should be fine.

If you paste SQL manually and skip around, policy duplication is easy to trigger.

### C. Email infrastructure is optional but more fragile

[`20260326142232_email_infra.sql`](/Users/moramielrabaev/Documents/Playground/refuah/supabase/migrations/20260326142232_email_infra.sql) depends on:
- `pg_net`
- `pg_cron`
- `supabase_vault`
- `pgmq`

It also expects post-migration setup that is not expressed as static SQL:
- storing the service role key in Vault
- creating a cron job for `process-email-queue`

If you only want the app deployed quickly, you can treat email infra as phase 2.

### D. Edge Functions must be deployed if you use contact/email features

The app references Supabase functions, including:
- `send-transactional-email`
- `handle-email-unsubscribe`

If those are not deployed, the related features will fail even if the frontend and database are correct.

### E. Owner-only features depend on `profiles.role = 'owner'`

Some settings screens use `role = 'owner'`, not just `is_admin = true`.

If admin pages partly work but owner-only settings fail, this is usually the reason.

### F. Group avatar upload policy is broad

[`20260326164452_27371668-9d31-40e8-b7bd-cd5901302aad.sql`](/Users/moramielrabaev/Documents/Playground/refuah/supabase/migrations/20260326164452_27371668-9d31-40e8-b7bd-cd5901302aad.sql) allows authenticated users to upload to `avatars/group-avatars/...`.

That may be intentional, but it is not scoped to conversation membership or admin status.

### G. Realtime table publication assumes default Supabase realtime publication exists

Several migrations call `ALTER PUBLICATION supabase_realtime ADD TABLE ...`.

That normally works on Supabase, but if you apply the SQL outside a normal Supabase Postgres environment, those statements may fail.

## 4. Minimum viable launch path

If your goal is to get the app live fast, do this first:

1. Create the new Supabase project.
2. Apply all migrations.
3. Ignore email infra problems temporarily if they block you.
4. Enable Email auth and Google auth.
5. Set your first user to `is_admin = true` and `role = 'owner'`.
6. Add the Vercel env vars.
7. Deploy the frontend.
8. Test:
   - register
   - login
   - Google login
   - password reset
   - protected routes
   - avatar upload
   - one admin action

## 5. Vercel checklist

This project is a Vite SPA, not Next.js.

Use these Vercel settings:
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

This repo now includes [`vercel.json`](/Users/moramielrabaev/Documents/Playground/refuah/vercel.json) so React Router routes rewrite to `index.html`.

Add these environment variables in Vercel:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

Optional:

```bash
VITE_API_URL=https://your-api.example.com
```

## 6. Supabase checklist

After creating the project:

1. Go to Auth -> Providers.
2. Enable Email.
3. Enable Google.
4. In Google OAuth settings, use the callback URL shown by Supabase.
5. Go to Auth -> URL configuration.
6. Add:
   - local URL
   - Vercel production URL
   - preview URL if needed

Then verify:
- new signup creates a row in `public.profiles`
- profile updates work
- RLS allows the signed-in user to read their own data
- public reads work for public tables

## 7. Manual SQL you will probably need after first signup

Run this in the Supabase SQL editor after you create your own account:

```sql
update public.profiles
set is_admin = true,
    role = 'owner'
where email = 'your-email@example.com';
```

## 8. What changed in the app

Google sign-in now uses native Supabase OAuth in:
- [`src/features/auth/ui/LoginForm.tsx`](/Users/moramielrabaev/Documents/Playground/refuah/src/features/auth/ui/LoginForm.tsx)

Vercel SPA route rewrites were added in:
- [`vercel.json`](/Users/moramielrabaev/Documents/Playground/refuah/vercel.json)
