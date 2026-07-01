from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "ThreatLens"
    DEBUG: bool = False
    DATABASE_URL: str = "postgresql+asyncpg://threatlens:threatlens_secret@localhost:5432/threatlens"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
