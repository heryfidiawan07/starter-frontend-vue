# Starter Frontend — Vue

Admin panel frontend built with Vue 3, TypeScript, and Tailwind CSS. Connects to any of the available backend APIs (Golang, Node.js, Java, .NET, Python, Rust).

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Vue | 3 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 3 | Styling |
| Pinia | 2 | Global state management |
| Vue Router | 4 | Client-side routing |
| Vee-Validate | 4 | Form handling |
| Zod | 3 | Schema validation |
| Axios | 1 | HTTP client |
| @lucide/vue | — | Icons |
| Vue Toastification | — | Toast notifications |

## Prerequisites

- Node.js 18+
- npm or yarn
- A running backend API (default expects `http://localhost:8080`)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3001)
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

## Configuration

Set the API base URL in `src/lib/axios.ts` (or via `.env`):

```
VITE_API_URL=http://localhost:8080
```

Default points to `http://localhost:8080/api/v1`.

## Project Structure

```
src/
├── components/
│   ├── layout/         # MainLayout, Sidebar, Header
│   └── ui/             # AppBtn, AppInput, AppModal, AppBadge, AppSpinner
├── composables/        # usePermission (can()), useAuth
├── lib/                # axios instance
├── pages/
│   ├── auth/           # LoginPage, ForgotPasswordPage, ResetPasswordPage
│   ├── dashboard/      # DashboardPage
│   ├── users/          # UsersPage, UserFormModal, PhotoModal
│   ├── roles/          # RolesPage, RoleFormModal
│   ├── permissions/    # PermissionsPage (tree view)
│   └── profile/        # ProfilePage
├── router/             # vue-router routes + beforeEach guards
├── stores/             # Pinia auth store
└── types/              # Shared TypeScript interfaces
```

## Features

- **Authentication** — Login, forgot password, reset password via email link
- **Dashboard** — Summary stats
- **Users** — CRUD with avatar upload; edit/delete hidden for root user
- **Roles** — CRUD with permission assignment tree (category → menu → action)
- **Permissions** — Read-only tree view of all permissions
- **Profile** — Update own name, email, password, avatar
- **Responsive** — Mobile sidebar drawer with hamburger toggle
- **Permission guard** — `can('permission:name')` composable; root user bypasses all checks
- **Token refresh** — Axios interceptor handles 401 with silent refresh

## Composition API

All components use `<script setup>` syntax. State is managed via Pinia stores with full TypeScript typing.

```ts
// Example: permission check in a component
const { can } = usePermission()

// In template
<button v-if="can('user:create')">Add User</button>
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3001 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run Vue TypeScript type check |
