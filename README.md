# 🚀 Bun-Elysia-Fullstack Monorepo

[![Bun](https://img.shields.io/badge/Runtime-Bun-black?style=for-the-badge&logo=bun)](https://bun.sh/)
[![ElysiaJS](https://img.shields.io/badge/Backend-ElysiaJS-blue?style=for-the-badge)](https://elysiajs.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Drizzle](https://img.shields.io/badge/ORM-Drizzle-C5F74F?style=for-the-badge)](https://orm.drizzle.team/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Tailwind 4](https://img.shields.io/badge/Styling-Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A high-performance, modern fullstack monorepo boilerplate built on the **Bun** ecosystem. This project demonstrates a production-ready setup for a typesafe API and a responsive frontend in a single repository.

---

## 🏗️ Architecture & Structure

This project uses **Bun Workspaces** to manage a monorepo structure:

| Directory | Purpose | Tech Stack |
| :--- | :--- | :--- |
| `apps/api` | RESTful Backend Service | ElysiaJS, Drizzle ORM, JWT |
| `apps/web` | Client Application | React 19, Vite 6, Tailwind 4 |
| `node_modules` | Shared Dependencies | Managed by Bun |

---

## ✨ Key Features

- **⚡ Lightning Fast**: Powered by Bun, one of the fastest JavaScript runtimes.
- **🔒 Secure Authentication**: Complete JWT flow (Access & Refresh tokens) with MySQL persistence.
- **📖 Auto-Docs**: Interactive Swagger/OpenAPI documentation generated automatically.
- **🛡️ Typesafety**: End-to-end typesafety between Backend and Frontend using **Elysia Eden**.
- **🎨 Modern UI**: Styled with the latest TailwindCSS 4 and React 19 components.
- **📊 Database Ready**: Pre-configured Drizzle ORM for schema management and migrations.

---

## ⚙️ Project Setup

### 1. Prerequisites
- [Bun](https://bun.sh/) installed (`v1.1+` recommended)
- MySQL Server running

### 2. Installation
Install all dependencies for the entire monorepo:
```bash
bun install
```

### 3. Environment Configuration
Navigate to `apps/api`, duplicate `.env.example` to `.env`, and update your database credentials:
```bash
cp apps/api/.env.example apps/api/.env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DB_HOST` | MySQL Server Host | `localhost` |
| `DB_PORT` | MySQL Server Port | `3306` |
| `DB_USER` | MySQL Username | `root` |
| `DB_PASSWORD` | MySQL Password | *empty* |
| `DB_NAME` | Database Name | `bun_auth_api` |
| `JWT_SECRET` | Secret for Access Token | *required* |
| `REFRESH_SECRET` | Secret for Refresh Token | *required* |
| `CORS_ORIGIN` | Allowed origin for CORS | `http://localhost:5173` |
| `PORT` | API Port | `3000` |


### 4. Database Migrations
> [!NOTE]
> Make sure to manually create your database in MySQL (e.g., `CREATE DATABASE bun_auth_api;`) before running the migration commands in the next step.

Run these commands to sync your database schema:
```bash
# Generate migration files
bun --filter @bun-elysia-fullstack/api db:generate

# Execute migrations to database
bun --filter @bun-elysia-fullstack/api db:migrate
```

---

## 🚀 Running Locally

Launch both the backend and frontend concurrently in development mode:

```bash
bun dev
```

### 📍 Access Points

Once running, you can access the project components at these locations:

| Component | URL | Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | [http://localhost:5173](http://localhost:5173) | `5173` | React Application (Vite) |
| **Backend API** | [http://localhost:3000](http://localhost:3000) | `3000` | ElysiaJS Server |
| **API Docs** | [http://localhost:3000/swagger](http://localhost:3000/swagger) | `3000` | Interactive Swagger UI |

---

## 🛠️ CLI Cheat-sheet

| Task | Command |
| :--- | :--- |
| Run all apps | `bun dev` |
| Run only API | `bun dev:api` |
| Run only Web | `bun dev:web` |
| New dependencies | `bun add <package> --filter @bun-elysia-fullstack/api` |
| Production Build | `bun run build` |

---

## 🌐 Deployment

This project is configured to be flexible for various deployment methods:

### 1. Vercel (Recommended for Frontend & API)

This project is optimized for Vercel using a single-project monorepo setup.

> [!IMPORTANT]
> To deploy this project successfully, you **MUST** configure these settings in your Vercel Project Dashboard (**Settings > General**):
> - **Root Directory**: `./` (The root of the repository)
> - **Build Command**: `bun run build`
> - **Output Directory**: `apps/web/dist`

- **Architecture**: The API is deployed as a Serverless Function. To ensure compatibility with Vercel's Node.js environment, we use a bundled output (`dist/index.js`) generated during the build phase.
- **Configuration**: See [vercel.json](./vercel.json) for internal routing and function settings.

#### 🔑 Environment Variables
You **MUST** set these in **Settings > Environment Variables** on Vercel for the API to connect to your database:

| Variable | Description |
| :--- | :--- |
| `DB_HOST` | Your remote MySQL host (e.g., PlanetScale, RDS) |
| `DB_PORT` | MySQL Port (usually `3306`) |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret for access tokens (short-lived, used for request authentication) |
| `REFRESH_SECRET` | Secret for refresh tokens (long-lived, used to renew access tokens) |
| `CORS_ORIGIN` | Your Vercel deployment URL (or leave blank for `*`) |

### 2. Self-Hosting (VPS / Docker)
If you want to run the application on your own server using **Bun** natively:

#### Build API:
```bash
cd apps/api
bun run build
```

#### Run Production:
You can run the bundled output or run the source directly with Bun for maximum performance:
```bash
# Run the bundled output (Compatible with Node.js)
bun apps/api/dist/index.js

# OR run the source natively (Recommended for pure Bun performance)
bun run apps/api/src/index.ts
```

#### Web App:
The web app is built as a static site:
```bash
cd apps/web
bun run build
```
The build output is located in `apps/web/dist` and can be served using Nginx or other static hosting services.

---

## 👨‍💻 Author
**Luxor** ([@luxorwannabe](https://github.com/luxorwannabe))

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
