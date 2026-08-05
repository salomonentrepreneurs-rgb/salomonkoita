# crm_api.py — CRUD + AI endpoints for CRM
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, UTC
import random, math
from .crm_models import Lead, Deal, Activity, LeadStatus
from .database import get_db

router = APIRouter(prefix="/api/crm", tags=["CRM"])

@router.get("/leads")
def list_leads(status: Optional[str] = None, search: Optional[str] = None,
               page: int = Query(1, ge=1), limit: int = Query(50, ge=1, le=200),
               sort_by: str = "created_at", sort_order: str = "desc",
               db: Session = Depends(get_db)):
    query = db.query(Lead)
    if status:
        query = query.filter(Lead.status == status)
    if search:
        q = f"%{search}%"
        query = query.filter(Lead.company.ilike(q) | Lead.contact_name.ilike(q) | Lead.email.ilike(q))
    total = query.count()
    query = query.order_by(getattr(Lead, sort_by).desc() if sort_order == "desc" else getattr(Lead, sort_by).asc())
    leads = query.offset((page - 1) * limit).limit(limit).all()
    return {"total": total, "page": page, "limit": limit, "data": [l.to_dict() for l in leads]}

@router.post("/leads")
def create_lead(data: dict, db: Session = Depends(get_db)):
    valid_keys = {c.name for c in Lead.__table__.columns}
    lead = Lead(**{k: v for k, v in data.items() if k in valid_keys})
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead.to_dict()

@router.get("/leads/{lead_id}")
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    return lead.to_dict()

@router.put("/leads/{lead_id}")
def update_lead(lead_id: int, data: dict, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    for k, v in data.items():
        if hasattr(lead, k) and k != "id":
            setattr(lead, k, v)
    lead.updated_at = datetime.now(UTC)
    db.commit()
    db.refresh(lead)
    return lead.to_dict()

@router.delete("/leads/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted"}

@router.post("/leads/{lead_id}/score")
def ai_score_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(404, "Lead not found")
    score = 0.0
    factors = []
    if lead.email: score += 15; factors.append("email_present")
    if lead.phone: score += 10; factors.append("phone_present")
    if lead.contact_name: score += 10; factors.append("contact_named")
    source_weights = {"referral": 25, "website": 15, "linkedin": 20, "conference": 20, "cold": 5}
    score += source_weights.get(lead.source or "", 10)
    factors.append(f"source_{lead.source or 'unknown'}")
    if lead.estimated_value > 0:
        score += min(25, lead.estimated_value / 1000)
        factors.append("has_value")
    recent = db.query(Activity).filter(Activity.lead_id == lead_id).count()
    score += min(15, recent * 5)
    final_score = min(100, max(0, score + random.uniform(-3, 3)))
    lead.score = round(final_score, 1)
    lead.probability = round(final_score / 100, 2)
    db.commit()
    return {
        "lead_id": lead_id, "score": lead.score, "probability": lead.probability,
        "factors": factors,
        "recommendation": "high_priority" if final_score > 70 else "medium_priority" if final_score > 40 else "nurture"
    }

@router.get("/deals")
def list_deals(stage: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Deal)
    if stage:
        query = query.filter(Deal.stage == stage)
    deals = query.all()
    return {
        "total": len(deals), "total_value": sum(d.amount for d in deals),
        "data": [{"id": d.id, "name": d.name, "stage": d.stage, "amount": d.amount,
                  "probability": d.probability, "closing_date": str(d.closing_date)} for d in deals]
    }

@router.post("/deals")
def create_deal(data: dict, db: Session = Depends(get_db)):
    deal = Deal(**{k: v for k, v in data.items() if hasattr(Deal, k)})
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return {"id": deal.id, "name": deal.name, "stage": deal.stage, "amount": deal.amount}

@router.get("/pipeline")
def pipeline_analytics(db: Session = Depends(get_db)):
    stages = ["discovery", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"]
    pipeline = []
    for stage in stages:
        deals = db.query(Deal).filter(Deal.stage == stage).all()
        pipeline.append({"stage": stage, "count": len(deals),
                         "value": sum(d.amount for d in deals),
                         "deals": [{"id": d.id, "name": d.name, "amount": d.amount} for d in deals]})
    return {
        "pipeline": pipeline,
        "total_pipeline_value": sum(p["value"] for p in pipeline),
        "forecast": sum(p["value"] for p in pipeline if p["stage"] in ["negotiation", "proposal", "closed_won"])
    }
