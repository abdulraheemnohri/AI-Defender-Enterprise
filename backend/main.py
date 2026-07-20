from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import ai, dashboard, firewall, network, scan, system, usb
from services.bootstrap import initialize_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="AI Defender Enterprise API",
    description="Local AI-Powered Cybersecurity Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(system.router)
app.include_router(scan.router)
app.include_router(network.router)
app.include_router(firewall.router)
app.include_router(ai.router)
app.include_router(usb.router)


@app.get("/")
def read_root():
    return {
        "message": "AI Defender Enterprise API",
        "status": "online",
        "modules": [
            "dashboard",
            "system",
            "scan",
            "network",
            "firewall",
            "ai",
            "usb",
        ],
    }
