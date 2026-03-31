# Refuah Codex Handoff

This file is a working handoff document for future Codex chats.

## Project Summary

- Project name: `refuah`
- Stack: React + Vite + Supabase
- Hosting: Vercel
- Backend: Supabase database, storage, edge functions
- Main product areas: messaging, community, announcements, applicants/stats, thresholds, library, profile, admin

## Communication Preference

- Answer the user in Hebrew unless they explicitly ask for English.
- Keep answers short and practical.

## Git / Branch Preference

- Default work happens in `/Users/moramielrabaev/Documents/Playground/refuah`
- The user has explicitly asked before to push directly to `main` when needed
- Current branch expectation: check with `git status` / `git branch --show-current` before pushing

## Supabase Context

- Production project ref: `vknptktqxpmzjisqirlg`
- Important edge functions / migrations may exist locally before being deployed remotely
- If a feature depends on an edge function or RLS and fails only at runtime, verify deployment / migration state before changing frontend logic

## Important Already Completed Work

### Mobile Stability / Sentry / Routing

- Sentry is now wired in production and currently captures:
  - authenticated user context
  - route breadcrumbs
  - click breadcrumbs
  - interrupted-session recovery events
- Several mobile-only crash / hang mitigations were pushed directly to `main`
- Main app routes were moved away from route-level lazy loading after repeated stale-bundle / Samsung Internet crashes
- Stale-build recovery now tries a cache-busting `location.replace(...?__cv=...)` path instead of a plain reload
- Presence realtime channel was fixed so it does not attempt to join / subscribe twice
- Background polling / write frequency were reduced in presence / messaging / base-data flows to lower Supabase load
- Supabase compute was upgraded by the user from smaller tiers up to `small`
- Latest Sentry evidence showed that at least some `AdminPage default export` / `reading 'default'` crashes were stale cached bundles, not the current route code

### Beta Access

- Beta access is now controlled both by config and runtime DB settings
- Runtime beta fallback was hardened:
  - cached runtime setting is used if available
  - if runtime fetch fails and there is no cache, it now falls back to `false` instead of accidentally re-locking the site
- If users still see the beta gate after it was disabled, suspect stale client cache first

### Messaging / Chat

- `/messages` and floating chat received multiple RTL / alignment fixes
- Message deletion for own messages was stabilized
- Friend requests got a dedicated navbar bell/popover instead of living under notifications
- Minimized/open chat layering and positioning were improved several times

### Roles / Admin

- `owner` handling was fixed in multiple places so the protected owner is not treated as plain admin/user
- Admin users management got:
  - role editing improvements
  - permission editing
  - owner-only quick user creation UI
- Content-editor role flow now auto-opens permissions with all permissions preselected and helper text

### Community / Announcements

- Community voting was opened to all users
- Score display in community never goes below `0`
- Community moderation actions were expanded for moderators/admin/owner
- Announcement detail got:
  - richer share menu
  - role-colored comment author names
  - profile navigation from comment author
- Announcements list now supports tag filtering

### Stats / Thresholds

- Thresholds support `mor` / `רף מו"ר`
- Threshold add form remembers previous university/year/type/category/round/path
- Thresholds page got in-page add-threshold UI for owner/admin/users with `admissions`
- Path-based filtering for universities was improved in applicants/userdata/steps-related flows

### Library

- Library editors with `library` permission were intended to manage library content, not just owners/admins
- Library list view was updated to show folders in list mode like desktop file explorers
- File/folder editing was expanded beyond title-only toward title + description

## Current Local Uncommitted Changes

These files are currently modified locally:

- `src/app/pages/PublicProfilePage.tsx`
- `src/features/announcements/ui/AnnouncementsTimeline.tsx`
- `src/integrations/supabase/types.ts`

New local files not yet committed:

- `src/features/profile/ui/ProfileFriendsPreview.tsx`
- `supabase/migrations/20260330143000_add_student_university_to_profiles.sql`

## What Those Local Changes Do

### Public Profile / Student Badge

- Owner-facing public-profile editing is being extended so when an owner marks someone as `student`, they can also choose a university
- A new local migration adds a profile field for the student university

### Public Profile / Friends Preview

- A new local `ProfileFriendsPreview` component exists but is not yet committed / pushed
- The intent is to show friend count and a lightweight row/grid of friends above the profile wall, Facebook-style

### Timeline

- `AnnouncementsTimeline.tsx` still has local UI refinements beyond what was already pushed
- Be careful not to mix those local timeline refinements into unrelated hotfix pushes unless the user explicitly asks

## Remote / Deployment Notes

- Test/fake user creation depends on Supabase Edge Function:
  - `admin-create-user`
- If the UI says it cannot reach the function, deploy:

```bash
supabase functions deploy admin-create-user
```

- Threshold management for admissions editors depends on local migration:
  - `20260329195500_allow_admissions_editors_manage_score_thresholds.sql`

- Owner-friendly `role_settings` admin handling depends on local migration:
  - `20260329201000_fix_role_settings_owner_policy.sql`

- The latest local student-university profile work depends on:
  - `supabase/migrations/20260330143000_add_student_university_to_profiles.sql`

## Build Status

- `npm run build` currently passes after the latest local fixes
- Large-bundle pressure was reduced somewhat by previous splitting / routing changes, but mobile stability is still an active concern

## Recent Production Debugging Notes

- As of `2026-03-30 19:27:40 IDT`, recent mobile debugging found:
  - Samsung Internet / Android devices were sometimes running stale cached bundles
  - Sentry stack traces mentioning assets like `index-Blo5y86v.js` or route-level `Suspense` often pointed to old cached builds rather than the current route code
  - An event like `Recovered from probable previous session interruption` is expected and useful; it means the previous session likely froze / died and then reopened
- If a user reports that `/admin` or `/login` still crashes with a lazy/default-export error, first suspect stale cache and test with:
  - private/incognito window
  - `?__cv=<timestamp>` cache-busting URL
  - clearing `refuah.io` site data
- If Sentry still reports `Lazy module "AdminPage" did not provide a default export` while current `src/App.tsx` imports `AdminPage` directly, treat it as stale-client evidence first, not necessarily a new code regression

## Important Scope Note

- Do not include the separate calculator zip restyling work in future handoff updates for this repo unless the user explicitly asks
- That calculator restyling work was done outside the repo and should stay out of this handoff

## Suggested Next Steps For A Future Chat

1. Read this file first
2. Run `git status`
3. If the user asks to continue repo work, continue from the local modified files above
4. If the user wants a push, review the current diff first, then commit and push intentionally
5. Be careful not to push the local public-profile / friends-preview / student-university work accidentally unless explicitly requested
6. If fake user creation still fails, verify `admin-create-user` is deployed on the correct Supabase project

## Suggested Opening Prompt For A New Codex Chat

```text
Please continue work in /Users/moramielrabaev/Documents/Playground/refuah.
First read /Users/moramielrabaev/Documents/Playground/refuah/CODEX_HANDOFF.md for project context, recent changes, and open tasks.
Then continue with: <your next task here>.
Do not touch unrelated local changes unless necessary.
```
