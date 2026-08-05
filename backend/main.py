# main.py — Solo IA Generated Backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Salomonkoita API", description="Salomonkoita is an AI-powered full-stack app builder that lets users create complete websites, web apps, SaaS products, and mobile applications in minutes by describing their idea in natural language. It generates full-stack applications including frontend (React/Next.js), backend (FastAPI), database (PostgreSQL), authentication (JWT/OAuth2), AI models, payment integration (Stripe), and one-click deployment. Includes an AI agent system (Claw-like) for 24/7 autonomous agents on messaging platforms, an AI Gateway with 200+ models, RAG knowledge base, sandbox environments, and a complete CRM module with AI-powered lead scoring, deal pipeline, analytics dashboard, and smart analytics.", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Salomonkoita", "version": "1.0.0", "build": "20260803_123111"}

@app.get("/api/info")
def app_info():
    return {
        "name": "Salomonkoita", "description": "Salomonkoita is an AI-powered full-stack app builder that lets users create complete websites, web apps, SaaS products, and mobile applications in minutes by describing their idea in natural language. It generates full-stack applications including frontend (React/Next.js), backend (FastAPI), database (PostgreSQL), authentication (JWT/OAuth2), AI models, payment integration (Stripe), and one-click deployment. Includes an AI agent system (Claw-like) for 24/7 autonomous agents on messaging platforms, an AI Gateway with 200+ models, RAG knowledge base, sandbox environments, and a complete CRM module with AI-powered lead scoring, deal pipeline, analytics dashboard, and smart analytics.",
        "version": "1.0.0", "crm_enabled": true,
        "platforms": ["web", "ios", "android"]
    }
