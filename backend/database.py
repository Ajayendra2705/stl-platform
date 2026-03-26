# backend/database.py

# We use a dictionary for the state so it can be easily imported and modified
state = {
    "current_level": 1.0
}

question_bank = {
    1: {
        "topic": "Level 1: Vector Basics",
        "problemText": "Given an array of N integers, calculate the total sum. (Focus: Basic iteration).",
        "timeLimitMs": 1000,
        "memoryLimitMb": 128
    },
    2: {
        "topic": "Level 2: Fast Lookups (std::set)",
        "problemText": "Given N numbers and Q queries, check if a number exists in the array. O(N) per query will Time Limit Exceed. Use a Set.",
        "timeLimitMs": 500, 
        "memoryLimitMb": 128
    },
    3: {
        "topic": "Level 3: Frequencies (std::map)",
        "problemText": "Given an array of N strings, find the string that appears the most times. Use a Map.",
        "timeLimitMs": 1000,
        "memoryLimitMb": 128
    }
}