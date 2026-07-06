# Lumina

A modern full-stack publishing platform for article discovery, personalized content feeds, and seamless content management — built with TanStack Start and NestJS.
## Overview

Lumina combines authentication, personalized article recommendations, rich-text publishing, reactions, profile management, and media uploads into a unified developer-friendly platform.


## Tech Stack

### Frontend
- TanStack Start
- React
- TanStack Query
- Tailwind CSS v4
- TipTap

### Backend
- NestJS
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT Authentication
- Argon2
- AWS S3 SDK
- Brevo Email API

### Workspace & Tooling
- `pnpm` Workspaces
- ESLint
- Prettier
- Vitest
- Jest
- Netlify

## Folder Structure

```text
.
├── apps
│   ├── client
│   │   ├── public/                  # Static assets
│   │   ├── src
│   │   │   ├── components/          # Shared UI components
│   │   │   ├── config/              # Client environment config
│   │   │   ├── features/            # Feature-based frontend modules
│   │   │   │   ├── articles/
│   │   │   │   ├── authentication/
│   │   │   │   ├── preferences/
│   │   │   │   ├── profile/
│   │   │   │   └── uploads/
│   │   │   ├── integrations/        # TanStack Query integration setup
│   │   │   ├── routes/              # File-based application routes
│   │   │   ├── types/               # Shared client-side API types
│   │   │   ├── utils/               # Client utilities
│   │   │   ├── router.tsx
│   │   │   └── styles.css
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── server
│       ├── drizzle/                 # SQL migrations and metadata
│       ├── seeds/                   # Database seed scripts
│       ├── src
│       │   ├── articles/
│       │   ├── auth/
│       │   ├── categories/
│       │   ├── common/
│       │   ├── database/            # DB provider and schema definitions
│       │   ├── preferences/
│       │   ├── reactions/
│       │   ├── security/
│       │   ├── uploads/
│       │   ├── users/
│       │   ├── app.module.ts
│       │   └── main.ts
│       └── package.json
├── packages
│   └── shared-types
│       └── src/                     # Shared API/domain TypeScript types
├── package.json                     # Root workspace scripts
├── pnpm-workspace.yaml
└── netlify.toml                     # Netlify configuration for client app
