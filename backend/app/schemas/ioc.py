from datetime import datetime
from pydantic import BaseModel


class IoCCreate(BaseModel):
    ioc_type: str
    value: str
    source: str | None = None
    severity: str = "medium"
    tags: dict | None = None


class IoCResponse(BaseModel):
    id: str
    ioc_type: str
    value: str
    source: str | None = None
    severity: str
    tags: dict | None = None
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}
