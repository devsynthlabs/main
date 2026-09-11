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

def calculate_financial_ratios(data):
    """
    Domain Engine: Liquidity, Solvency, Profitability Ratios & Health Benchmarks.
    """
    current_assets = to_decimal(data.get("currentAssets", 0))
    current_liabilities = to_decimal(data.get("currentLiabilities", 0))
    inventory_val = to_decimal(data.get("inventory", 0))
    total_liabilities = to_decimal(data.get("totalLiabilities", 0))
    total_equity = to_decimal(data.get("totalEquity", 0) or data.get("equity", 0))
    total_revenue = to_decimal(data.get("totalRevenue", 0) or data.get("revenue", 0))
    cogs = to_decimal(data.get("cogs", 0) or data.get("expenses", 0))
    net_profit = to_decimal(data.get("netProfit", 0) or data.get("netIncome", 0))

    current_ratio = (current_assets / current_liabilities) if current_liabilities > Decimal('0.00') else Decimal('0.00')
    quick_ratio = ((current_assets - inventory_val) / current_liabilities) if current_liabilities > Decimal('0.00') else Decimal('0.00')
    debt_to_equity = (total_liabilities / total_equity) if total_equity > Decimal('0.00') else Decimal('0.00')
    gross_margin = (((total_revenue - cogs) / total_revenue) * Decimal('100.0')) if total_revenue > Decimal('0.00') else Decimal('0.00')
    net_margin = ((net_profit / total_revenue) * Decimal('100.0')) if total_revenue > Decimal('0.00') else Decimal('0.00')
    roe = ((net_profit / total_equity) * Decimal('100.0')) if total_equity > Decimal('0.00') else Decimal('0.00')

    return {
        "ratios": {
            "currentRatio": round_money(current_ratio),
            "quickRatio": round_money(quick_ratio),
            "debtToEquity": round_money(debt_to_equity),
            "grossProfitMargin": round_money(gross_margin),
            "netProfitMargin": round_money(net_margin),
            "roe": round_money(roe)
        },
        "benchmarks": {
            "currentRatioStatus": "Good" if current_ratio >= Decimal('1.5') else "Low",
            "quickRatioStatus": "Good" if quick_ratio >= Decimal('1.0') else "Low",
            "debtToEquityStatus": "Good" if debt_to_equity <= Decimal('1.5') else "High"
        }
    }
