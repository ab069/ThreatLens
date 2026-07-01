from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.ioc import IoCCreate, IoCResponse
from app.services import ioc_service

router = APIRouter(prefix="/api/iocs", tags=["iocs"])


@router.post("", response_model=IoCResponse)
async def create_ioc(data: IoCCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await ioc_service.create_ioc(db, user.id, data)


@router.get("", response_model=list[IoCResponse])
async def list_iocs(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await ioc_service.list_iocs(db, user.id)


@router.delete("/{ioc_id}")
async def delete_ioc(ioc_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    deleted = await ioc_service.delete_ioc(db, ioc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="IoC not found")
    return {"ok": True}
