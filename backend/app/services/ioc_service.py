from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ioc import IoC
from app.schemas.ioc import IoCCreate, IoCResponse


async def create_ioc(db: AsyncSession, user_id: str, data: IoCCreate) -> IoCResponse:
    ioc = IoC(user_id=user_id, ioc_type=data.ioc_type, value=data.value, source=data.source, severity=data.severity, tags=data.tags)
    db.add(ioc)
    await db.commit()
    await db.refresh(ioc)
    return IoCResponse.model_validate(ioc)


async def list_iocs(db: AsyncSession, user_id: str) -> list[IoCResponse]:
    result = await db.execute(select(IoC).where(IoC.user_id == user_id).order_by(IoC.created_at.desc()))
    return [IoCResponse.model_validate(i) for i in result.scalars().all()]


async def delete_ioc(db: AsyncSession, ioc_id: str) -> bool:
    result = await db.execute(select(IoC).where(IoC.id == ioc_id))
    ioc = result.scalar_one_or_none()
    if not ioc:
        return False
    await db.delete(ioc)
    await db.commit()
    return True
