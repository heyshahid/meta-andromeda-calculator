"""
E-Commerce Unit Economics & True Break-Even ROAS
"""
def calculate_unit_economics(
    aov: float,
    cogs: float,
    shipping: float,
    gateway_fee_pct: float = 2.9,
    gateway_fee_fixed: float = 0.30,
    return_rate_pct: float = 5.0
):
    payment_fee = (aov * (gateway_fee_pct / 100.0)) + gateway_fee_fixed
    return_allowance = aov * (return_rate_pct / 100.0)
    total_variable_cost = cogs + shipping + payment_fee + return_allowance
    net_margin_dollar = max(0.0, aov - total_variable_cost)
    net_margin_pct = (net_margin_dollar / aov) * 100.0 if aov > 0 else 0.0
    break_even_roas = (aov / net_margin_dollar) if net_margin_dollar > 0 else 999.0
    max_cac = net_margin_dollar

    return {
        "aov": aov,
        "net_margin_dollar": round(net_margin_dollar, 2),
        "net_margin_pct": round(net_margin_pct, 2),
        "break_even_roas": round(break_even_roas, 2),
        "max_allowable_cac": round(max_cac, 2)
    }
