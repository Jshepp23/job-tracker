from sqlalchemy import ( Column, Integer, String, ForeignKey, Date, Text
)

from sqlalchemy.orm import relationship
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)
    position = Column(String)
    location = Column(String)

    status = Column(String)

    notes = Column(Text)

    applied_date = Column(Date)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="applications"
    )