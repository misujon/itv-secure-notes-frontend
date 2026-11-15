# Secure Notes — Next.js Frontend

Modern, responsive user-facing web application for **Secure Notes**, built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Redux Toolkit + RTK Query**, **React Hook Form + Zod**, and **Sonner**.

The frontend integrates with the Laravel + MongoDB REST API through a **Backend-for-Frontend (BFF)** layer in Next.js Route Handlers so JWT tokens are stored exclusively in **HttpOnly cookies** and never exposed to client-side JavaScript or Redux state.

---

## 1. Prerequisites

- **Node.js 20+**
- **pnpm 9+** (`corepack enable` or `npm install -g pnpm`)
- Running **Secure Notes Laravel Backend** at `http://127.0.0.1:8000` (see `../secure-notes-backend/README.md`)

---

## 2. Local Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd secure-notes-frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Verify `.env.local`:
   ```dotenv
   LARAVEL_API_URL=http://127.0.0.1:8000/api/v1
   NEXT_PUBLIC_APP_NAME="Secure Notes"
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_ADMIN_PORTAL_URL=http://127.0.0.1:8000/admin/login
   ```

   > **Note:** `LARAVEL_API_URL` is server-only and used exclusively inside Next.js Route Handlers.

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Demo Credentials

Seed the backend database (`php artisan db:seed` inside `secure-notes-backend`) to use these accounts:

| Role | Email | Password | Notes |
| :--- | :--- | :--- | :--- |
| **User** | `user@test.com` | `Hello@123!` | Standard user workspace (`/dashboard`, `/notes`, `/posts`, `/profile`) |
| **Admin** | `admin@test.com` | `Hello@123!` | Standard workspace + link to Laravel Blade Admin Portal |

You can also create a new account at `/register` and select from admin-managed interests.

---

## 4. Architecture & Key Directories

```text
src/
├── app/
│   ├── (auth)/              # Public login & register pages
│   ├── (workspace)/         # Protected dashboard, notes, posts, and profile pages
│   └── api/
│       ├── auth/            # BFF auth handlers (login, register, me, password, refresh, logout)
│       └── proxy/[...path]/ # Allowlisted BFF proxy attaching HttpOnly JWT Bearer token
├── components/
│   ├── editor/              # Rich text editor & sanitized HTML viewer
│   ├── layout/              # App shell, navigation, page headers
│   ├── shared/              # InterestSelector, PaginationControls, ErrorState, EmptyState
│   └── ui/                  # shadcn/ui primitives
├── features/                # Feature modules (auth, dashboard, notes, posts, profile)
├── lib/
│   ├── api/                 # Server-side fetchLaravel() client
│   ├── auth/                # HttpOnly cookie helpers
│   ├── utils/               # Error normalization & date formatting
│   └── validations/         # Zod schemas (auth, note, post)
└── store/
    └── api/                 # RTK Query baseApi, authApi, notesApi, postsApi
```

---

## 5. Requirements Met

- **Secure BFF Authentication**:
  - JWT stored in `HttpOnly`, `SameSite=Lax` cookies via `/api/auth/*` Route Handlers; automatic token refresh on `401` and graceful redirect to `/login?expired=1` when expired.
  - Zero tokens in `localStorage` or Redux state.
- **Role-Based Access Control (RBAC)**:
  - Roles are read from Laravel `/api/v1/auth/me`.
  - Admin users see an optional **Administration Portal** link (`NEXT_PUBLIC_ADMIN_PORTAL_URL`) pointing to the existing Laravel Blade portal rather than duplicating admin CRUD in Next.js.
- **Notes & Posts with Rich Text Editor**:
  - Private Notes CRUD (`/notes`, `/notes/new`, `/notes/[id]`, `/notes/[id]/edit`) with paginated lists.
  - Public Posts feed, creation, editing, and author post filtering (`/posts`, `/posts/new`, `/posts/[id]`, `/posts/[id]/edit`, `/posts/user/[id]`).
- **Dynamic Interests & Profile Management**:
  - Admin-managed interests fetched from `GET /api/proxy/interests` and selectable during `/register` and `/profile` updates.
  - Profile page (`/profile`) supports editing `name`, `email`, `interests` (role remains read-only) and changing password (`current_password`, `password`, `password_confirmation`).

---

## 6. Testing, Typechecking & Build

```bash
# Run Vitest unit & component tests
pnpm test

# TypeScript type check
pnpm exec tsc --noEmit

# ESLint
pnpm lint

# Production build
pnpm build
```
