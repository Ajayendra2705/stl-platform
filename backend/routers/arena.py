# backend/routers/arena.py
from fastapi import APIRouter
import asyncio
import random
import math

from models import CodeSubmission
from database import state, question_bank

# This router acts like a mini-FastAPI app
router = APIRouter()

@router.get("/api/question")
async def get_question():
    tier = math.floor(state["current_level"])
    
    if tier > 3: tier = 3 
    if tier < 1: tier = 1

    return {
        "question": question_bank[tier], 
        "currentLevel": state["current_level"],
        "tier": tier
    }

@router.post("/api/submit")
async def submit_code(submission: CodeSubmission):
    await asyncio.sleep(1.0) # Simulate execution delay
    
    # --- 1. HANDLE "COMPILE & RUN" ---
    if submission.action == "compile":
        if submission.customInput and submission.customInput.strip():
            msg = f"Running Custom Input:\n{submission.customInput}\n\nExecution Time: 0.008s\nMemory: 1.2MB"
        else:
            msg = "Sample Input: 5\\n1 2 3 4 5\nYour Output: 15\nExpected Output: 15\nExecution Time: 0.012s"
            
        return {
            "verdict": "Compiled Successfully",
            "newLevel": state["current_level"],
            "message": msg,
            "pointsAwarded": 0,
            "isCompileOnly": True
        }

    # --- 2. HANDLE "SUBMIT CODE" ---
    is_accepted = random.random() > 0.4 
    verdict = "AC" if is_accepted else "TLE"
    time_taken = submission.timeTakenSeconds
    points_awarded = 0
    
    old_tier = math.floor(state["current_level"])

    if verdict == "AC":
        if time_taken <= 600:
            points_awarded = 1.0
            message = f"Flawless! Under 10 mins. (+{points_awarded} Level)"
        elif time_taken <= 1800:
            points_awarded = 0.5
            message = f"Good job. Under 30 mins. (+{points_awarded} Level)"
        else:
            points_awarded = 0.2
            message = f"Solved, but took a while. (+{points_awarded} Level)"
        state["current_level"] += points_awarded
    else:
        state["current_level"] -= 0.5
        if state["current_level"] < 1.0: state["current_level"] = 1.0
        message = "Time Limit Exceeded. Your code is too slow. (-0.5 Level)"

    new_tier = math.floor(state["current_level"])
    
    # Calculate if they crossed a tier boundary
    leveled_up = new_tier > old_tier and new_tier <= 3
    dropped_down = new_tier < old_tier

    return {
        "verdict": verdict,
        "newLevel": state["current_level"],
        "message": message,
        "pointsAwarded": points_awarded,
        "isCompileOnly": False,
        "leveledUp": leveled_up,
        "droppedDown": dropped_down
    }