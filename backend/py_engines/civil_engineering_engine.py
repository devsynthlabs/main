from decimal import Decimal, ROUND_HALF_UP

def to_decimal(val, default="0.00"):
    if val is None or val == "":
        return Decimal(default)
    try:
        return Decimal(str(val))
    except Exception:
        return Decimal(default)

def round_money(val):
    if not isinstance(val, Decimal):
        val = to_decimal(val)
    return float(val.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))

def calculate_civil_project_cost(data):
    """
    Domain Engine: Civil Engineering Project Schedule & Material Cost Estimation Engine.
    """
    builtup_area = to_decimal(data.get("builtUpAreaSqft", 1000))
    cost_per_sqft = to_decimal(data.get("ratePerSqft", 1800))

    total_estimated_budget = builtup_area * cost_per_sqft

    cement_cost = total_estimated_budget * Decimal('0.16')
    steel_cost = total_estimated_budget * Decimal('0.14')
    sand_aggregate_cost = total_estimated_budget * Decimal('0.10')
    brick_cost = total_estimated_budget * Decimal('0.10')
    labor_cost = total_estimated_budget * Decimal('0.30')
    finishing_cost = total_estimated_budget * Decimal('0.20')

    return {
        "builtUpAreaSqft": float(builtup_area),
        "ratePerSqft": float(cost_per_sqft),
        "totalEstimatedBudget": round_money(total_estimated_budget),
        "materialBreakdown": {
            "cement": round_money(cement_cost),
            "steel": round_money(steel_cost),
            "sandAndAggregate": round_money(sand_aggregate_cost),
            "bricksAndBlocks": round_money(brick_cost),
            "labor": round_money(labor_cost),
            "finishing": round_money(finishing_cost)
        }
    }
