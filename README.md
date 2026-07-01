# ThreatLens

> AI-powered threat intelligence & security analytics platform with IoC management, AI enrichment, MITRE ATT&CK mapping, and real-time monitoring.

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

## Key Features

- **IoC Management** — Track IPs, domains, URLs, file hashes, emails, and registry keys
- **AI Enrichment Pipeline** — Auto-enrich indicators with context, reputation, and threat intelligence
- **MITRE ATT&CK Mapping** — Map threats to ATT&CK techniques and tactics
- **Real-Time Dashboard** — React 18 + TypeScript + Zustand with WebSocket streaming
- **Threat Scoring** — Severity and confidence-based risk assessment
- **Live Threat Feed** — WebSocket-powered instant threat alerts

## Tech Stack

| Layer      | Technology                                |
|-----------|-------------------------------------------|
| Backend   | FastAPI + Python 3.12 + async SQLAlchemy  |
| Frontend  | React 18 + TypeScript + Zustand           |
| AI        | LangGraph-style agent pipeline            |
| Database  | PostgreSQL + Redis                        |
| Infra     | Docker Compose                            |
| Auth      | JWT + bcrypt                              |
| Realtime  | WebSockets                                |

## Getting Started

```bash
git clone https://github.com/ab069/ThreatLens.git
cd ThreatLens
docker compose up -d
open http://localhost:3000
```

## Project Structure

```
ThreatLens/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI routes
│   │   ├── core/          # Config, security, database
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── agents/        # AI enrichment pipeline
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/         # Zustand stores
│   │   ├── hooks/         # WebSocket hook
│   │   └── pages/         # Login, Dashboard, IoCs, Threats
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## License

MIT
