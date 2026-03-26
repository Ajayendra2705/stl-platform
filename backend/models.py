# backend/models.py
from pydantic import BaseModel
from typing import Optional

class CodeSubmission(BaseModel):
    sourceCode: str
    timeTakenSeconds: int
    action: str # "compile" or "submit"
    customInput: Optional[str] = "" # Optional, since "submit" doesn't need it