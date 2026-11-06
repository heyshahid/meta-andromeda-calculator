"""
Unit Tests for Meta Andromeda Scaling & ROAS Formulas
"""
import pytest
from core.andromeda import model_andromeda_scaling
from core.unit_economics import calculate_unit_economics

def test_unit_economics_break_even():
    # AOV $100, COGS $30, Shipping $10, 0% fees, 0% returns
    # Net Margin = $60 (60%) -> Break Even ROAS = 100 / 60 = 1.67x
    res = calculate_unit_economics(aov=100.0, cogs=30.0, shipping=10.0, gateway_fee_pct=0.0, gateway_fee_fixed=0.0, return_rate_pct=0.0)
    assert res["net_margin_dollar"] == 60.0
    assert res["break_even_roas"] == 1.67
    assert res["max_allowable_cac"] == 60.0

def test_andromeda_scaling_increments():
    # Scaling $100 by +20% for 3 days
    # Day 1: $100 -> Day 2: $120 -> Day 3: $144
    traj = model_andromeda_scaling(initial_daily_budget=100.0, scaling_increment_pct=20.0, days=3)
    assert traj[0]["daily_budget"] == 100.0
    assert traj[1]["daily_budget"] == 120.0
    assert traj[2]["daily_budget"] == 144.0
    assert traj[0]["core_asc_70"] == 70.0
    assert traj[0]["creative_test_20"] == 20.0
    assert traj[0]["moonshot_10"] == 10.0
