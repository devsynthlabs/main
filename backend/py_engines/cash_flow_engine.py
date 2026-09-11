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

def calculate_cash_flow(data):
    """
    Domain Engine: Cash Flow Inflows, Outflows, Net Cash Flow & Position Status.
    """
    sales = to_decimal(data.get("sales", 0))
    service_income = to_decimal(data.get("serviceIncome", 0))
    interest_income = to_decimal(data.get("interestIncome", 0))
    other_income = to_decimal(data.get("otherIncome", 0))

    cost_materials = to_decimal(data.get("costOfMaterials", 0))
    salaries = to_decimal(data.get("salaries", 0))
    rent = to_decimal(data.get("rent", 0))
    utilities = to_decimal(data.get("utilities", 0))
    finance_cost = to_decimal(data.get("financeCost", 0))
    depreciation = to_decimal(data.get("depreciation", 0))
    amortization = to_decimal(data.get("amortization", 0))
    other_expenses = to_decimal(data.get("otherExpenses", 0))

    total_inflow = sales + service_income + interest_income + other_income
    total_outflow = cost_materials + salaries + rent + utilities + finance_cost + depreciation + amortization + other_expenses
    net_cash_flow = total_inflow - total_outflow

    if net_cash_flow > Decimal('0.00'):
        status = "positive"
    elif net_cash_flow < Decimal('0.00'):
        status = "negative"
    else:
        status = "neutral"

    return {
        "totalInflow": round_money(total_inflow),
        "totalOutflow": round_money(total_outflow),
        "netCashFlow": round_money(net_cash_flow),
        "status": status
    }
