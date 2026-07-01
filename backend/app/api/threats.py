from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.threat import ThreatResponse
from app.services import threat_service

router = APIRouter(prefix="/api/threats", tags=["threats"])


@router.get("", response_model=list[ThreatResponse])
async def list_threats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await threat_service.list_threats(db, user.id)


@router.get("/{threat_id}", response_model=ThreatResponse)
async def get_threat(threat_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    threat = await threat_service.get_threat(db, threat_id)
    if not threat or threat.user_id != user.id:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat
