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
| `DB_NAME` | Database Name | `bun_auth_api` |
| `JWT_SECRET` | Secret for Access Token | *required* |
| `PORT` | API Port | `3000` |

### 4. Database Migrations
Run these commands to sync your database schema:
```bash
# Generate migration files
bun --filter api db:generate

# Execute migrations to database
bun --filter api db:migrate
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
| New dependencies | `bun add <package> --filter <api|web>` |
| Production Build | `bun run build` |

---

## 👨‍💻 Author
**Luxor** ([@luxorwannabe](https://github.com/luxorwannabe))

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
