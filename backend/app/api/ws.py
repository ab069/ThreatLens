import json
from datetime import datetime, timezone
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from app.core.database import async_session
from app.models.ioc import IoC
from app.models.threat import Threat
from app.agents.pipeline import enrich_ioc, classify_threat, map_mitre_ttps

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: dict[str, list[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(user_id, []).append(ws)

    def disconnect(self, user_id: str, ws: WebSocket):
        self.active.setdefault(user_id, []).remove(ws)
        if not self.active[user_id]:
            del self.active[user_id]

    async def broadcast(self, user_id: str, message: dict):
        for ws in self.active.get(user_id, []):
            try:
                await ws.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(ws: WebSocket, user_id: str):
    await manager.connect(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            if data.get("action") == "analyze_ioc":
                ioc_id = data.get("ioc_id")
                async with async_session() as db:
                    result = await db.execute(select(IoC).where(IoC.id == ioc_id, IoC.user_id == user_id))
                    ioc = result.scalar_one_or_none()
                    if not ioc:
                        await ws.send_json({"error": "IoC not found"})
                        continue
                    enrichment = enrich_ioc(ioc.ioc_type, ioc.value)
                    threat_type, confidence, desc = classify_threat(ioc.ioc_type, ioc.severity, enrichment)
                    ttps = map_mitre_ttps(threat_type)
                    threat = Threat(
                        user_id=user_id,
                        name=f"Threat from {ioc.ioc_type}: {ioc.value[:40]}",
                        threat_type=threat_type,
                        severity=ioc.severity,
                        confidence=confidence,
                        description=desc,
                        mitre_ttps={"techniques": ttps},
                        enrichment=enrichment,
                    )
                    db.add(threat)
                    await db.commit()
                    await db.refresh(threat)
                    await manager.broadcast(user_id, {
                        "type": "threat",
                        "threat": {
                            "id": threat.id,
                            "name": threat.name,
                            "threat_type": threat.threat_type,
                            "severity": threat.severity,
                            "confidence": threat.confidence,
                            "description": threat.description,
                            "mitre_ttps": threat.mitre_ttps,
                            "created_at": threat.created_at.isoformat(),
                        },
                    })
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
