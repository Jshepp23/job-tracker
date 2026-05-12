from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    File,
    UploadFile
)
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.application import Application
from app.models.user import User

from app.schemas.application_schema import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate
)
from datetime import datetime, date
from app.auth.auth_handler import verify_token
import csv
from io import StringIO

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/login"
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload.get("sub")

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user

@router.post("/")
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_application = Application(
        company=application.company,
        position=application.position,
        location=application.location,
        status=application.status,
        notes=application.notes,
        applied_date=application.applied_date,
        user_id=current_user.id
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application

@router.get("/", response_model=list[ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()

    return applications


@router.get("/{application_id}",
response_model=ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application


@router.put("/{application_id}",
response_model=ApplicationResponse)
def update_application(
    application_id: int,
    updated_application: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    application.company = updated_application.company
    application.position = updated_application.position
    application.location = updated_application.location
    application.status = updated_application.status
    application.notes = updated_application.notes
    application.applied_date = updated_application.applied_date

    db.commit()
    db.refresh(application)

    return application


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    db.delete(application)
    db.commit()

    return {
        "message": "Application deleted"
    }


from datetime import datetime, date


@router.post("/import")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    contents = await file.read()

    csv_text = contents.decode("utf-8")

    csv_reader = csv.DictReader(
        StringIO(csv_text)
    )

    imported = 0

    for row in csv_reader:

        company = row.get(
            "Company",
            ""
        ).strip()

        position = row.get(
            "Position",
            ""
        ).strip()

        # Skip empty rows
        if not company or not position:
            continue

        raw_date = row.get(
            "Date Applied",
            ""
        ).strip()

        parsed_date = date.today()

        if raw_date:

            try:

                parsed_date = datetime.strptime(
                    raw_date,
                    "%m/%d/%Y"
                ).date()

            except:

                try:

                    parsed_date = datetime.strptime(
                        raw_date,
                        "%m/%d/%y"
                    ).date()

                except:

                    parsed_date = date.today()

        application = Application(

            company=company,

            position=position,

            location=row.get(
                "Location",
                ""
            ).strip(),

            status=row.get(
                "Application Status",
                "Submitted"
            ).strip(),

            notes=row.get(
                "Details",
                ""
            ).strip(),

            applied_date=parsed_date,

            user_id=current_user.id
        )

        db.add(application)

        imported += 1

    db.commit()

    return {
        "message":
            f"Imported {imported} applications"
    }

@router.get("/stats")
def get_application_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()

    total = len(applications)

    submitted = len([
        app for app in applications
        if app.status == "Submitted"
    ])

    interview = len([
        app for app in applications
        if app.status == "Interview"
    ])

    rejected = len([
        app for app in applications
        if app.status == "Rejected"
    ])

    offer = len([
        app for app in applications
        if app.status == "Offer"
    ])

    response_rate = 0

    if total > 0:

        response_rate = round(
            ((interview + offer) / total) * 100,
            2
        )

    return {
        "total": total,
        "submitted": submitted,
        "interview": interview,
        "rejected": rejected,
        "offer": offer,
        "response_rate": response_rate
    }