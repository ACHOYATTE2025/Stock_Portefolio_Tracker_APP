# Fullstack Project — React + Spring Boot + PostgreSQL

## Source Code Origin

This project combines two separate GitHub repositories:

| Folder | Original Repo |
|---|---|
| `frontend/` | https://github.com/ACHOYATTE2025/Stock_Portefolio_UI |
| `backend/` | https://github.com/ACHOYATTE2025/Stock_Portefolio_Tracker |

## Project Structure

```
mon-projet/
├── frontend/                  ← React application (Vite)
│   ├── Dockerfile             ← Multi-stage: dev + build + prod (Nginx)
│   └── nginx.conf             ← Nginx config for React Router
├── backend/                   ← Spring Boot API
│   └── Dockerfile             ← Multi-stage: dev + build + prod
├── docker-compose.yml         ← DEV environment
├── docker-compose.prod.yml    ← PROD environment
├── .env.example               ← Environment variables template
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Git

---

## Quick Start

### 1. Clone and configure the environment

```bash
git clone https://github.com/ACHOYATTE2025/mon-projet.git
cd mon-projet

# Copy and fill in the environment file
cp .env.example .env
```

Edit `.env` with your actual values (at minimum the PostgreSQL password).

---

### 2. Run in development

```bash
docker compose up --build
```

| Service    | URL                   |
|------------|-----------------------|
| Frontend   | http://localhost:5173 |
| Backend    | http://localhost:8080 |
| PostgreSQL | localhost:5432        |

> **Hot reload** is enabled: changes in `frontend/` and `backend/src/` are picked up automatically without rebuilding the image.

---

### 3. Run in production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

| Service | URL                 |
|---------|---------------------|
| App     | http://localhost:80 |

In production, only port **80** is exposed. The frontend (Nginx) proxies requests to the backend.

---

## Spring Boot Configuration

In `backend/src/main/resources/application.properties` (or `application.yml`), variables are injected by Docker Compose:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
```

---

## React Configuration (Vite)

In `frontend/src/`, use the environment variable for the API base URL:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/stockportefoliotracker/v1';
```

In production, `/api/stockportefoliotracker/v1/` requests are proxied through Nginx (defined in `nginx.conf`), so `VITE_API_URL` is not needed.

---

## Useful Commands

```bash
# Stop containers
docker compose down

# Stop and delete volumes (reset DB)
docker compose down -v

# View logs for a service
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild a single service
docker compose up --build backend

# Access PostgreSQL shell
docker compose exec postgres psql -U postgres -d stockdb
```

---

## Environment Variables

| Variable            | Description             | Default (dev) |
|---------------------|-------------------------|---------------|
| `POSTGRES_DB`       | Database name           | `stockdb`     |
| `POSTGRES_USER`     | PostgreSQL user         | `postgres`    |
| `POSTGRES_PASSWORD` | PostgreSQL password     | —             |
| `JWT_KEY`           | JWT secret key          | —             |
| `MAIL_USER`         | SMTP email address      | —             |
| `MAIL_PASS`         | SMTP email password     | —             |
| `ALPHA_VINTAGE`     | Alpha Vantage API key   | —             |

> ⚠️ **Never commit the `.env` file** — it is listed in `.gitignore`.

---

## Merging Two GitHub Repos Into One

If you want to preserve the Git history from both old repos:

```bash
# Inside the new repo
git remote add frontend-old https://github.com/ACHOYATTE2025/Stock_Portefolio_UI.git
git fetch frontend-old
git subtree add --prefix=frontend frontend-old main --squash

git remote add backend-old https://github.com/ACHOYATTE2025/Stock_Portefolio_Tracker.git
git fetch backend-old
git subtree add --prefix=backend backend-old main --squash
```

Otherwise, simply copy the files into the `frontend/` and `backend/` folders.

## Author
GitHub: [@ACHOYATTE2025](https://github.com/ACHOYATTE2025)