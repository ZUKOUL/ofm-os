# OFM-OS — Operating System pour mon agence OFM

## Vision

Outil interne tout-en-un pour piloter mon agence OFM solo founder. 
Pas un produit destiné à être vendu (pour l'instant). 
MVP focused, code maintenable, scaling incrémental quand besoin.

Trois objectifs que ce tool doit résoudre :
1. **CRM sourcing** : suivre 200+ modèles dans le funnel sans rien oublier
2. **Competitor watch** : tracker les comptes alt/goth/asian qui marchent et m'en inspirer
3. **Content production multipliée** : prendre une vidéo et en sortir N variantes uniques (metadata + visuel imperceptible) pour poster sur 5-7 comptes sans duplicate flag IG

## Stack technique (lockée)

- Next.js 15 App Router + TypeScript
- Tailwind 4 + shadcn/ui (components prebuilt)
- Supabase (Postgres + Auth + Storage)
- Drizzle ORM (typesafe queries, no raw SQL)
- Zod (validation runtime)
- react-hook-form (forms)
- TanStack Table v8 (tables avec filtres)
- TanStack Query (data fetching client-side)
- Recharts (charts)
- ffmpeg.wasm (video processing in browser, MVP)
- Vercel (deploy production)

## Conventions de code

- Server components par défaut, "use client" uniquement si interaction nécessaire
- Server actions pour mutations (pas de routes API REST sauf si tiers)
- All DB access via Drizzle, no raw SQL
- All forms : react-hook-form + zod schema
- Error handling : throw dans server components, try/catch dans actions avec toast feedback
- Env vars dans .env.local, jamais commit
- Branches feature-based, commits en anglais, conventional commits format

## Style preferences

- **Minimal comments** : le code doit parler de lui-même
- Functions < 50 lignes idéalement
- Components < 200 lignes, sinon extraire des sous-components
- Folder structure par domaine (models/, competitors/, video/), pas par type
- Tailwind utility classes, pas de CSS séparé sauf cas particulier
- shadcn/ui components partout où possible (cohérence visuelle)

## Ce que j'attends de Claude Code

- **Sois direct, pas flatteur**. Si mon approche a un problème, dis-le.
- **Suggère des patterns meilleurs** quand tu en vois.
- **Pas d'overengineering**. Solution la plus simple qui marche.
- **Pas de tests unitaires** pour le MVP. Test manuel.

## Brand principles

- Le tool est interne uniquement, jamais exposé au public
- Stockage de credentials modèles → sécurité forte (Supabase RLS, encryption at rest)
- Logs d'activité importantes pour traçabilité
- Privacy by design : pas de tracking analytics tiers
