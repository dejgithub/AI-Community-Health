from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.jwt import get_current_user
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/api/family", tags=["family"])


class FamilyMember:
    pass


from pydantic import BaseModel


class FamilyMemberCreate(BaseModel):
    name: str
    relationship: str
    date_of_birth: str | None = None
    blood_group: str | None = None
    phone: str | None = None
    medical_conditions: list[str] = []
    allergies: list[str] = []
    medications: list[str] = []


class FamilyMemberRead(BaseModel):
    id: int
    user_id: int
    name: str
    relationship: str
    date_of_birth: str | None = None
    blood_group: str | None = None
    phone: str | None = None
    medical_conditions: list[str] = []
    allergies: list[str] = []
    medications: list[str] = []

    model_config = {"from_attributes": True}


from app.models.health import CommunityStats  # noqa: E402

# We'll store family members in a simple in-memory store per user for now
# since the model doesn't have a dedicated FamilyMember table yet
_family_store: dict[int, list[dict]] = {}
_next_id: dict[int, int] = {}


@router.get("", response_model=list[FamilyMemberRead])
def list_family_members(
    current_user: User = Depends(get_current_user),
) -> list[FamilyMemberRead]:
    members = _family_store.get(current_user.id, [])
    return [FamilyMemberRead(id=m["id"], user_id=m["user_id"], **{k: v for k, v in m.items() if k not in ("id", "user_id")}) for m in members]


@router.post("", response_model=FamilyMemberRead, status_code=status.HTTP_201_CREATED)
def add_family_member(
    payload: FamilyMemberCreate,
    current_user: User = Depends(get_current_user),
) -> FamilyMemberRead:
    uid = current_user.id
    if uid not in _family_store:
        _family_store[uid] = []
        _next_id[uid] = 1
    member_id = _next_id[uid]
    _next_id[uid] += 1
    member = {"id": member_id, "user_id": uid, **payload.model_dump()}
    _family_store[uid].append(member)
    return FamilyMemberRead(**member)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_family_member(
    member_id: int,
    current_user: User = Depends(get_current_user),
) -> None:
    members = _family_store.get(current_user.id, [])
    before = len(members)
    _family_store[current_user.id] = [m for m in members if m["id"] != member_id]
    if len(_family_store[current_user.id]) == before:
        raise HTTPException(status_code=404, detail="Family member not found")
