from pydantic import BaseModel
from datetime import date

class ApplicationCreate(BaseModel):
    company: str
    position: str
    location: str
    status: str
    notes: str
    applied_date: date

class ApplicationResponse(BaseModel):
    id: int
    company: str
    position: str
    location: str
    status: str
    notes: str
    applied_date: date

    class Config:
        from_attributes = True


class ApplicationUpdate(BaseModel):
    company: str
    position: str
    location: str
    status: str
    notes: str
    applied_date: date