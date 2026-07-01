from datetime import datetime
from pydantic import BaseModel


class ThreatResponse(BaseModel):
    id: str
    name: str
    threat_type: str | None = None
    severity: str | None = None
    confidence: str | None = None
    description: str | None = None
    mitre_ttps: dict | None = None
    enrichment: dict | None = None
    status: str
    created_at: datetime
    resolved_at: datetime | None = None
    model_config = {"from_attributes": True}
