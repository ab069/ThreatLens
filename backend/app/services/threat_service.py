from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.threat import Threat
from app.schemas.threat import ThreatResponse


async def list_threats(db: AsyncSession, user_id: str) -> list[ThreatResponse]:
    result = await db.execute(select(Threat).where(Threat.user_id == user_id).order_by(Threat.created_at.desc()))
    return [ThreatResponse.model_validate(i) for i in result.scalars().all()]


async def get_threat(db: AsyncSession, threat_id: str) -> Threat | None:
    result = await db.execute(select(Threat).where(Threat.id == threat_id))
    return result.scalar_one_or_none()
