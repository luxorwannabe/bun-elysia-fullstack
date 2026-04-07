# Bun-Elysia-Fullstack

Modern Fullstack Monorepo with Bun & ElysiaJS API, paired with a React + Vite frontend. Built with Drizzle ORM, MySQL, and TailwindCSS 4.

## 🚀 Tech Stack
- **Runtime:** [Bun](https://bun.sh/)
- **Backend:** [ElysiaJS](https://elysiajs.com/)
- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** MySQL
- **Docs:** Swagger UI (Auto-generated at `/swagger`)

## 📁 Project Structure
- `apps/api`: ElysiaJS REST API
- `apps/web`: React Frontend

## ⚙️ Setup & Development

### 1. Installation
Install all dependencies for the entire monorepo:
```bash
bun install
```

### 2. Environment Variables
Copy `.env.example` in `apps/api` and fill in your database credentials:
```bash
cp apps/api/.env.example apps/api/.env
```

### 3. Database Migration
```bash
# Generate migrations
bun --filter api db:generate

# Push to database
bun --filter api db:migrate
```

### 4. Running Locally
Run both frontend and backend concurrently:
```bash
bun dev
```

## ✨ Features
- ✅ Fullstack Monorepo with Bun Workspaces
- ✅ JWT Authentication Flow
- ✅ Automated Swagger API Documentation
- ✅ Typesafe API client with Eden
- ✅ Hot Module Replacement (HMR) for both API & Web

## 👨‍💻 Author
**Luxor** ([@luxorwannabe](https://github.com/luxorwannabe))

---
Licensed under [MIT](LICENSE).
