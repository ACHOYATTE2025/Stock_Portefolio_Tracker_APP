# Stock Portfolio Tracker — React + Spring Boot + PostgreSQL

## Overview

This is a fullstack web application built to demonstrate proficiency in the Java programming language and the Spring Boot framework. The backend is a RESTful API developed with Java 17 and Spring Boot 3, featuring JWT-based authentication, JPA/Hibernate for database management, and integration with the Alpha Vantage external API to retrieve real-time stock prices. The frontend is built with Vite and communicates with the backend via Axios. The entire application is containerized with Docker and deployed on Render.

The application allows users to manage a stock portfolio — track holdings, execute buy/sell transactions, monitor wallet balance, and get stock recommendations based on real-time market data.

## Purpose

This project was developed to consolidate and demonstrate skills acquired during the BYU-Idaho Software Development Certificate program. The goal was to build a real-world fullstack application that covers the full development lifecycle: designing a REST API with Spring Security, managing relational data with PostgreSQL, integrating a third-party financial API, and deploying a production-ready containerized application using Docker and a CI/CD-ready workflow. The project also served as an opportunity to practice DevOps concepts such as multi-stage Docker builds, environment variable management, and cloud deployment on Render.

---

## Video Demo

[![Stock Portfolio Tracker Demo](https://img.youtube.com/vi/SQCW93Hac7o/0.jpg)](https://www.youtube.com/watch?v=SQCW93Hac7o)

▶️ [Watch the demo on YouTube](https://www.youtube.com/watch?v=SQCW93Hac7o)

---

## Source Code Origin

This project combines two separate GitHub repositories:

| Folder | Original Repo |
|---|---|
| `frontend/` | https://github.com/ACHOYATTE2025/Stock_Portefolio_UI |
| `backend/` | https://github.com/ACHOYATTE2025/Stock_Portefolio_Tracker |

## Live Demo (Render)

| Service  | URL |
|----------|-----|
| Frontend | https://stock-portfolio-tracker-app-frontend.onrender.com |
| Backend  | https://stock-portfolio-tracker-app-backend.onrender.com |

> ⚠️ Render free tier puts services to sleep after inactivity. The first request may take 30–60 seconds to wake up.

## Docker Hub Images

| Image | Tag |
|-------|-----|
| `achoyatte2025/stock_portfolio_tracker_app-frontend` | `prod` |
| `achoyatte2025/stock_portfolio_tracker_app-backend` | `latest` |

---

## Project Structure

```
mon-projet/
├── frontend/                  ← React application (Vite + SWC)
│   ├── Dockerfile             ← Multi-stage: dev + build + prod (Nginx)
│   ├── nginx.conf             ← Nginx config for React Router + API proxy
│   └── .env                  ← VITE_API_URL (not committed)
├── backend/                   ← Spring Boot API
│   └── Dockerfile             ← Multi-stage: dev + build + prod
├── docker-compose.yml         ← DEV environment
├── docker-compose.prod.yml
├── .env   
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

> **Hot reload** is enabled: changes in `frontend/src/` are picked up automatically without rebuilding the image.

---

### 3. Run in production (local)

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

| Service | URL                 |
|---------|---------------------|
| App     | http://localhost:80 |

In production, only port **80** is exposed. The frontend (Nginx) proxies API requests to the backend.

---

## Deploying to Render

### Steps

1. **Build and push images to Docker Hub:**

```bash
# Backend
cd backend
docker build --target prod --no-cache -t achoyatte2025/stock_portfolio_tracker_app-backend:latest .
docker push achoyatte2025/stock_portfolio_tracker_app-backend:latest

# Frontend
cd ../frontend
docker build --target prod --no-cache -t achoyatte2025/stock_portfolio_tracker_app-frontend:prod .
docker push achoyatte2025/stock_portfolio_tracker_app-frontend:prod
```

2. **On Render**, create:
   - A **PostgreSQL** database (managed by Render)
   - A **Web Service** for the backend → Existing Docker Image → `achoyatte2025/stock_portfolio_tracker_app-backend:latest`
   - A **Web Service** for the frontend → Existing Docker Image → `achoyatte2025/stock_portfolio_tracker_app-frontend:prod`

3. **Set environment variables** on the Render backend service:

| Variable | Value |
|----------|-------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:5432/<dbname>` |
| `DB_USER` | your Render DB username |
| `DB_PASS` | your Render DB password |
| `JWT_KEY` | your JWT secret |
| `MAIL_USER` | your SMTP email |
| `MAIL_PASS` | your SMTP password |
| `ALPHA_VINTAGE` | your Alpha Vantage API key |

4. **Trigger Manual Deploy** on both services after every image push.

### Important Notes

- The PostgreSQL URL from Render uses the format `postgresql://user:pass@host/db` — prefix it with `jdbc:` for Spring Boot: `jdbc:postgresql://host:5432/db`
- `VITE_API_URL` is baked into the frontend image at **build time** — always rebuild and repush the frontend image after changing it
- The `frontend/.env` file must be at the root of `frontend/` (not inside `src/`) and must **not** appear in `.dockerignore`
- The frontend `nginx.conf` proxies `/api/stockportefoliotracker/v1/` requests to the Render backend URL

---

## Spring Boot Configuration

In `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://<render-host>:5432/<dbname>
    username: ${DB_USER}
    password: ${DB_PASS}
    driver-class-name: org.postgresql.Driver
```

---

## React Configuration (Vite)

In `frontend/.env`:

```
VITE_API_URL=https://stock-portfolio-tracker-app-backend.onrender.com/api/stockportefoliotracker/v1
```

In `frontend/src/axiosClient.js`:

```javascript
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/stockportefoliotracker/v1";
```

---

## CORS Configuration

The backend allows requests from both local and Render origins. In `SecurityConfig.java`:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "https://stock-portfolio-tracker-app-frontend.onrender.com"
));
```

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

| Variable            | Description                      | Default (dev)               |
|---------------------|----------------------------------|-----------------------------|
| `POSTGRES_DB`       | Database name                    | `stockdb`                   |
| `DB_USER`           | PostgreSQL user                  | `postgres`                  |
| `DB_PASSWORD`       | PostgreSQL password              | —                           |
| `JWT_KEY`           | JWT secret key                   | —                           |
| `ALPHA_VINTAGE`     | Alpha Vantage API key            | —                           |
| `VITE_API_URL`      | Backend API URL (frontend build) | `http://localhost:8080/...` |

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

---

## Author

GitHub: [@ACHOYATTE2025](https://github.com/ACHOYATTE2025)
