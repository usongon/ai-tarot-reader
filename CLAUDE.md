# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered fortune-telling web app (灵境占卜) with two features: Tarot card readings and Bazi (八字) fortune analysis. Built as Java microservices backend + React SPA frontend. UI is entirely in Chinese.

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.5.3, Spring Cloud Alibaba 2023.0.3.2, Spring Cloud Gateway MVC
- **AI**: Alibaba DashScope SDK (streaming SSE via Flowable/SseEmitter)
- **Bazi calculation**: lunar-java library (cn.6tail:lunar:1.7.7)
- **Service discovery**: Nacos
- **Database**: MySQL (RDS), Spring Data JPA
- **Frontend**: React 19, Vite 7, Framer Motion, react-markdown, html-to-image, Tailwind CSS
- **Build**: Maven multi-module (parent POM + 7 modules), npm for frontend

## Architecture

```
Nginx (:80) → Gateway (:8080) → tarot-service (:8081) → MySQL RDS
                                      ↕
                              Nacos (service discovery)
```

- **gateway-service**: Routes all `/api/**` to `tarot-service` via Nacos `lb://` URIs. 5-minute response timeout for SSE streams.
- **tarot-service**: All business logic — tarot deck/spreads/draw, bazi chart calculation, AI interpretation via DashScope, token-based access control, rate limiting.
- **common module**: Shared DTOs and utilities. Must be installed before other services (`./mvnw install -pl common -DskipTests`).
- **Skeleton services** (user-service :8082, payment-service :8083, fortune-service :8084, community-service :8085): Stub modules with no real functionality yet.

Frontend Vite dev server proxies `/api` calls to `http://localhost:8080` (gateway).

## Build & Run Commands

### Backend

```bash
# Install parent POM first (required once)
./mvnw install -N

# Install common module (required when common changes)
./mvnw install -pl common -DskipTests

# Start gateway (port 8080)
./mvnw spring-boot:run -pl gateway-service

# Start tarot-service (port 8081)
./mvnw spring-boot:run -pl tarot-service

# Build all (skip tests)
./mvnw clean package -DskipTests

# Run tests
./mvnw test
./mvnw test -pl tarot-service  # single service
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # Dev server on :5173, proxies /api to :8080
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

### Infrastructure (local dev)

Nacos + MySQL required locally. Start via Docker Compose (file is gitignored, see README for setup).

## API Endpoints

All under `/api`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/spreads` | List available tarot spreads |
| GET | `/api/deck` | Get shuffled 78-card deck with upright/reversed |
| POST | `/api/draw` | Draw cards for a spread (body: `{spreadId}`) |
| POST | `/api/interpret` | Non-streaming AI interpretation (requires token) |
| POST | `/api/interpret/stream` | SSE streaming AI interpretation (requires token) |
| POST | `/api/bazi/chart` | Calculate bazi chart |
| POST | `/api/bazi/interpret/stream` | SSE streaming bazi interpretation (requires token) |

SSE streams use DashScope Flowable → SseEmitter. Error prefixes: `[FORBIDDEN]` (token invalid), `[ERROR]` (server error).

## Key Backend Packages

`tarot-service/src/main/java/cc/usong/tarot/`:
- `controller/` — TarotController, BaziController (REST + SSE endpoints)
- `service/` — TarotService (deck/spreads/draw/AI), BaziService (chart/WuXing/ShiShen/DaYun), RateLimitingService (token validation + rate limiting)
- `model/` — TarotCard, TarotSpread, Deck, AccessToken, bazi/ subdirectory (BaziChart, Pillar, WuXingStats, ShiShenRelation, DaYunInfo)
- `config/` — DashScopeConfig (apiKey, appId, baziAppId from properties)
- `repository/` — AccessTokenRepository (JPA)

## Frontend Structure

- `src/App.jsx` — Page router (welcome → spread → direction → drawing; bazi-info → bazi-chart)
- `src/contexts/TarotContext.jsx` — Global state via useReducer (spreads, cards, flippedCards, token, baziChart)
- `src/services/api.js` — API client with SSE streaming support (`api` for tarot, `baziApi` for bazi)
- `src/pages/` — WelcomePage, SpreadSelectionPage, DirectionSelectionPage, DrawingPage, BaziInfoPage, BaziChartPage
- `src/components/ui/` — TarotCard, ShareCard, Button, Modal, Loading, StepIndicator, BufferedMarkdown, MobileNavBar
- `src/components/bazi/` — ChartDisplay, LunarDatePicker, SolarDatePicker, ShiChenSelector, BaziShareCard

## Sensitive Files (gitignored)

`.env`, `deploy.sh`, `manage.sh`, `docker-compose.yml`, `docker-compose.prod.yml`, `application-dev.properties`, `application-prod.properties`, `frontend/src/config/beian.js` — these are not in the repo and require manual setup.

## Conventions

- Java package: `cc.usong.*`, uses Lombok
- Frontend: Functional components with hooks, Tailwind utility classes
- Theme: Purple/indigo gradients (`bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900`)
- All user-facing text is in Chinese
- SSE streaming pattern: backend uses `SseEmitter` + `Flowable.blockingForEach`, frontend uses `ReadableStream` reader parsing `data:` lines
- Token-based access: `RateLimitingService.verifyToken()` checks against MySQL-backed `AccessToken` entity
