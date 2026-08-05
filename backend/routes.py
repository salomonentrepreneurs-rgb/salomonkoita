# routes.py
from fastapi import APIRouter
router = APIRouter(prefix="/api")

@router.get("/status")
def status():
    return {"status": "operational", "build": "20260803_123111"}
