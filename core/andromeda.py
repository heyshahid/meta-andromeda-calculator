"""
Meta Andromeda Algorithm Scaling Model
"""
import math
from typing import List, Dict

def model_andromeda_scaling(initial_daily_budget: float, scaling_increment_pct: float = 20.0, days: int = 14) -> List[Dict]:
    trajectory = []
    current_budget = initial_daily_budget
    factor = 1.0 + (scaling_increment_pct / 100.0)

    for d in range(1, days + 1):
        core_70 = current_budget * 0.70
        test_20 = current_budget * 0.20
        moon_10 = current_budget * 0.10
        trajectory.append({
            "day": d,
            "daily_budget": round(current_budget, 2),
            "core_asc_70": round(core_70, 2),
            "creative_test_20": round(test_20, 2),
            "moonshot_10": round(moon_10, 2)
        })
        current_budget *= factor

    return trajectory
