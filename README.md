# ThreatLens — Threat Intelligence Platform

![Version](https://img.shields.io/badge/version-1.0.0-8b5cf6) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-8b5cf6) ![React](https://img.shields.io/badge/React-18.3-8b5cf6) ![License](https://img.shields.io/badge/license-MIT-8b5cf6)

AI-powered threat intelligence & security analytics platform with IoC management, AI enrichment pipeline, MITRE ATT&CK mapping, and real-time threat feed.

## Quick Start

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

## Features

- **IoC Management** — Track IPs, domains, URLs, file hashes, emails, and registry keys with full context
- **AI Enrichment Pipeline** — Auto-enrich indicators with reputation scoring, geolocation, and threat intelligence context
- **MITRE ATT&CK Mapping** — Map detected threats to ATT&CK techniques and tactics with reference IDs
- **Threat Scoring** — Confidence and severity-based risk scoring (0-100) for every indicator
- **Live Threat Feed** — WebSocket-powered instant threat alerts streaming to dashboard
- **Intelligence Reports** — Auto-generated summaries of threat landscape and indicator analysis

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                         ThreatLens System                       │
├────────────┬────────────┬────────────┬────────────┬─────────────┤
│   IoC      │    AI      │   MITRE    │  Threat    │  WebSocket  │
│  Manager   │  Pipeline  │  ATT&CK    │  Intel     │  Dashboard  │
├────────────┴────────────┴────────────┴────────────┴─────────────┤
│                 FastAPI + async SQLAlchemy + Redis                │
├─────────────────────────────────────────────────────────────────┤
│                   PostgreSQL + Redis + Docker Compose             │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), asyncpg |
| Frontend | React 18, TypeScript, Vite, Zustand |
| Engine | AI enrichment pipeline, MITRE ATT&CK mapper |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Realtime | WebSockets |
| Infra | Docker, Docker Compose, nginx |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/iocs` | Submit an IoC |
| GET | `/api/iocs` | List all IoCs |
| POST | `/api/iocs/{id}/enrich` | Enrich an IoC |
| GET | `/api/iocs/stats` | IoC statistics |
| GET | `/api/threats` | List threat events |
| GET | `/api/threats/stats` | Threat statistics |
| WS | `/ws/{user_id}` | WebSocket real-time feed |
| GET | `/api/health` | Health check |

## Project Structure

```
ThreatLens/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, database, deps
│   │   ├── models/      # SQLAlchemy models (IoC, Threat)
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic layer
│   │   ├── agents/      # AI enrichment pipeline
│   │   ├── api/         # Route handlers
│   │   └── main.py      # FastAPI app entrypoint
│   ├── tests/           # Pytest test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── store/       # Zustand state stores
│   │   ├── hooks/       # React hooks (WebSocket)
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── main.tsx     # Entry point
│   │   └── App.tsx      # Router
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection string |
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing key |

## Demo Credentials

Register a new account at `/register` after starting the app.

## License

MIT
