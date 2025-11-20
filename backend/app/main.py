from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings

# Import Routers
from app.api.v1 import auth, ebooks, videos, surahs, registrations

import os

app = FastAPI(
    title="WQTC API",
    description="Word for Word Quran Translation Center API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")

# API routes
app.include_router(auth.router, prefix="/api/v1")
app.include_router(ebooks.router, prefix="/api/v1")
app.include_router(videos.router, prefix="/api/v1")
app.include_router(surahs.router, prefix="/api/v1")
app.include_router(registrations.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "WQTC API v1.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
