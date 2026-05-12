from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine, Base
from app.models.user import User
from app.models.application import Application
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.extension import _rate_limit_exceeded_handler

from app.routes.auth_routes import (
    router as auth_router
)

from app.routes.application_routes import (
    router as application_router
)
Base.metadata.create_all(bind=engine)

app = FastAPI()
limiter = Limiter(
    key_func=get_remote_address
)

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.add_middleware(
    SlowAPIMiddleware
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(application_router)

@app.get("/")
def root():
    return {"message": "Job Tracker API Running"}

@app.get("/db-test")
def db_test():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {"database": "connected"}