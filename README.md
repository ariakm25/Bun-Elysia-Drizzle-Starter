<h3 align="center">Bun Elysia Starter</h3>

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Run](#run)
- [Development](#development)

## 🧐 About <a name = "about"></a>

Bun App Boilerplate using Elysia

## Prerequisites

### Install:

- [Bun](https://bun.dev)
- [Redis](https://redis.io/)
- [Postgres](https://www.postgresql.org/)

## 🏁 Getting Started <a name = "getting_started"></a>

### Set up environment variables

```
cp .env.example .env
```

### Install dependencies

```
bun install
```

## 🚀 Running the app <a name = "run"></a>

#### Run App:

```
bun start
```

##### Run Queue Worker

```
bun run:worker
```

##### Run Scheduler

```
bun run:scheduler
```

## ⛏️ Development

#### 🔌 Database Migration

```
bun run db:migrate
```

#### 🌱 Database Seed <a name = "development"></a>

```
bun run db:seed
```

#### 📝 Generate Database Migration

Create or update Schema in `src/db/schemas` then run:

```
bun run db:generate
```

#### 🗃️ Drizzle Studio Database Client

```
bun run db:studio
```

#### 🧪 Test

```
bun test
```

#### 🧑‍💻 Run With Live Reload

```
bun dev
```

## 🍃 Built Using <a name = "built_using"></a>

- [ElysiaJs](https://elysiajs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [CASL](https://casl.js.org/v6/en/)

---

---

## Checklist

---

### Auth

- [ ] Logout
- [x] Role & Permission
- [ ] Reset Password
- [ ] Forgot Password
- [ ] Register
- [x] Login

### Mailing

- [ ] Template
- [ ] Send

### System

- [x] Scheduler / Cron Job
- [x] Queue
- [x] Logging
- [ ] File Upload: S3
- [x] Rate Limiter

### Data

- [x] Pagination

### Database

- [x] Versioned Migration
- [x] Seeder

### Monitoring

- [ ] Job Monitoring (Scheduler & Queue)

### Caching

- [x] Redis Service

### Deployment

- [x] Dockerfile
