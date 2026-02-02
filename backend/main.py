from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import engine
# Import base to register models
from app.db import base



app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
# Create tables
base.Base.metadata.create_all(bind=engine)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "Welcome to EduVillage API"}
