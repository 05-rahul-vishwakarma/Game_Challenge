# BetSpace

A real‑time, collaborative betting board built with Next.js 14, TypeScript, Tailwind CSS, Socket.IO, and MongoDB. Create bets, accept challenges, play a quick coin‑flip mini‑game, and watch updates propagate instantly across connected clients.

---

## ✨ Features

- **Real‑time updates**: Live bet creation/acceptance/resolution via Socket.IO (no manual refreshes)
- **Coin‑flip mini‑game**: Lightweight in‑app game to resolve a bet interactively
- **Three bet lanes**: Open, Accepted, and Resolved, with smooth transitions
- **Modern UI/UX**: Tailwind CSS, dark mode (class‑based), and Framer Motion animations
- **Toasts & feedback**: `react-hot-toast` for clear success/error feedback
- **Zero‑auth demo flow**: Quickly save a display name to `localStorage` for trying the app
- **API routes**: CRUD over bets using Next.js API routes and MongoDB

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Language**: TypeScript
- **UI**: React 18, Tailwind CSS, Framer Motion, next-themes
- **Realtime**: Socket.IO (client + server)
- **Backend/Data**: Next.js API routes, MongoDB (official driver)
- **DevX**: ESLint, PostCSS, Autoprefixer

---

## 📁 Project Structure

```text
betspace/
├─ components/           # UI components (cards, modals, navbar, theme switcher)
├─ lib/                  # Server/client utilities (MongoDB, Socket.IO bootstrap, types)
├─ pages/                # Next.js pages and API routes
│  ├─ api/
│  │  ├─ bets/           # CRUD for bets (index.ts, [id].ts)
│  ├─ _app.tsx           # App shell and providers
│  └─ index.tsx          # Main board UI
├─ styles/               # Global styles (Tailwind)
├─ types/                # Shared type declarations (MongoDB, socket)
├─ tailwind.config.ts    # Tailwind configuration (dark mode: class)
├─ next.config.js        # Next.js config
├─ tsconfig.json         # TypeScript config
└─ package.json
```

---

## 🧩 Core Concepts

- **Realtime via API route**: A single Socket.IO server is initialized from API responses and reused across requests.
- **Typed domain model**: The `Bet` type lives in `lib/store.ts` and is mirrored in MongoDB documents.
- **Event‑driven UI**: The board listens for `bet:created`, `bet:updated`, and `bet:deleted` events to keep state in sync.
- **Simple identity**: A user saves a display name to `localStorage` for quick demos without auth complexity.

---

## 🚀 Getting Started

### 1) Prerequisites

- Node.js 18+
- A MongoDB instance (Local or Atlas)

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment

Create a `.env.local` in the project root:

```bash
MONGODB_URI="your-mongodb-connection-string"
MONGODB_DB="betspace"
```

If these are missing, the server will throw a clear error on startup (see `lib/mongodb.ts`).

### 4) Run the app

```bash
# Dev server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm start
```

---

## 🧪 How to Use (Demo Flow)

1. Open `http://localhost:3000` in two browser windows to see realtime sync.
2. In the header, enter a display name and click Save.
3. Click “Create New Bet”, fill the form (title, amount, your coin side), and submit.
4. From another window/user, accept the bet.
5. Click “Play Game” to launch the coin‑flip modal and resolve the bet; the result appears instantly for everyone.

---

## 📡 API Overview

- `GET /api/bets` — List all bets (newest first)
- `POST /api/bets` — Create a bet `{ title, amount, creator, creatorChoice }`
- `GET /api/bets/:id` — Get a bet by id
- `PUT /api/bets/:id` — Update a bet status
  - Accept: `{ status: "accepted", opponent }`
  - Resolve: `{ status: "resolved", winner }`
  - Mark game: `{ gamePlayed: boolean }`
- `DELETE /api/bets/:id` — Delete a bet by id

Server emits Socket.IO events on state change:

- `bet:created`, `bet:updated`, `bet:deleted`

---

## 🏗 Architecture Notes

- **Socket server lifecycle**: On API calls, the code initializes a singleton Socket.IO server and attaches it to `res.socket.server.io`, avoiding multiple instances in dev.
- **Data model**: MongoDB documents are transformed to client‑friendly `Bet` objects with `_id` as a string.
- **UI state**: Bets are grouped by status and animated with Framer Motion for smooth entrance/exit transitions.
- **Dark mode**: Class‑based theme toggle via `next-themes` with Tailwind color tokens.

---

## 🔒 Environment & Configuration

- `.env.local` (not committed) holds:
  - `MONGODB_URI`
  - `MONGODB_DB`
- Tailwind scans `pages/**/*` and `components/**/*` for class usage.

---

## 🧰 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## ✅ Production Readiness Checklist (Future Enhancement)

- Add auth (e.g., NextAuth or JWT) and user accounts
- Input validation and schema (Zod) on API requests
- Role/permissions for bet owners vs opponents
- Rate limiting and basic abuse protections
- Better persistence of user identity beyond `localStorage`
- Optimistic UI for accept/resolve with rollback
- E2E tests (Playwright) and API tests (Vitest/Jest)
- Observability (logging, metrics), and error boundaries
- CI/CD with type‑check, lint, test gates; deploy to Vercel

---
