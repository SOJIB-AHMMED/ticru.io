"""
Ticru.io API Server
FastAPI-based REST API server for the Ticru.io application
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uvicorn
from datetime import datetime

app = FastAPI(
    title="Ticru.io API",
    description="REST API for Ticru.io application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "https://ticru.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: datetime
    status: str

class Campaign(BaseModel):
    id: Optional[str] = None
    name: str
    status: str
    start_date: datetime
    end_date: datetime
    budget: float

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    score: float
    label: str
    confidence: float

# In-memory storage (replace with database in production)
contacts = []
campaigns = []

# Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "message": "Ticru.io API is running"
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "contacts": "/api/contacts",
            "campaigns": "/api/campaigns",
            "sentiment": "/api/sentiment"
        }
    }

@app.post("/api/contacts", response_model=ContactResponse)
async def create_contact(contact: ContactMessage):
    """Submit a contact form message"""
    contact_id = f"contact_{len(contacts) + 1}"
    contact_data = {
        "id": contact_id,
        "name": contact.name,
        "email": contact.email,
        "message": contact.message,
        "created_at": datetime.now(),
        "status": "new"
    }
    contacts.append(contact_data)
    return contact_data

@app.get("/api/contacts", response_model=List[ContactResponse])
async def get_contacts():
    """Get all contact messages"""
    return contacts

@app.post("/api/campaigns", response_model=Campaign)
async def create_campaign(campaign: Campaign):
    """Create a new campaign"""
    campaign_id = f"campaign_{len(campaigns) + 1}"
    campaign_data = campaign.dict()
    campaign_data["id"] = campaign_id
    campaigns.append(campaign_data)
    return campaign_data

@app.get("/api/campaigns", response_model=List[Campaign])
async def get_campaigns():
    """Get all campaigns"""
    return campaigns

@app.get("/api/campaigns/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    """Get a specific campaign"""
    for campaign in campaigns:
        if campaign["id"] == campaign_id:
            return campaign
    raise HTTPException(status_code=404, detail="Campaign not found")

@app.post("/api/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment of text"""
    # Simple sentiment analysis (replace with actual NLP in production)
    text = request.text.lower()
    positive_words = ["good", "great", "excellent", "amazing", "love", "wonderful"]
    negative_words = ["bad", "terrible", "awful", "hate", "poor", "worst"]
    
    pos_count = sum(1 for word in positive_words if word in text)
    neg_count = sum(1 for word in negative_words if word in text)
    
    total = pos_count + neg_count
    if total == 0:
        score = 0.0
        label = "neutral"
        confidence = 0.5
    else:
        score = (pos_count - neg_count) / total
        if score > 0.2:
            label = "positive"
        elif score < -0.2:
            label = "negative"
        else:
            label = "neutral"
        confidence = min(abs(score) + 0.5, 1.0)
    
    return {
        "score": score,
        "label": label,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(
        "api-server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
