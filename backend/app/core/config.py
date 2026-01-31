from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduVillage API"
    API_V1_STR: str = "/api"
    
    # SECURITY
    SECRET_KEY: str = "changethis_to_a_secure_random_string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # DATABASE
    # Example: postgresql://user:password@localhost/dbname
    DATABASE_URL: str = "sqlite:///./sql_app.db" 

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5500", "http://127.0.0.1:5500", "*"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
