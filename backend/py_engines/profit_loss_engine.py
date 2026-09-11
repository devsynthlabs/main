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

def calculate_profit_loss(data):
    """
    Domain Engine: Profit & Loss Statement Calculation with AI CFO Insights.
    """
    revenue = data.get("revenue", {})
    expense = data.get("expense", {})

    sales = to_decimal(data.get("sales", 0))
    service_inc = to_decimal(data.get("serviceIncome", 0))
    interest_inc = to_decimal(data.get("interestIncome", 0))
    other_inc = to_decimal(data.get("otherIncome", 0))

    direct_rev = to_decimal(revenue.get("total", 0) if isinstance(revenue, dict) else data.get("totalRevenue", 0))
    total_revenue = direct_rev if direct_rev > Decimal('0.00') else (sales + service_inc + interest_inc + other_inc)

    cost_materials = to_decimal(data.get("costOfMaterials", 0))
    salaries = to_decimal(data.get("salaries", 0))
    rent = to_decimal(data.get("rent", 0))
    utilities = to_decimal(data.get("utilities", 0))
    finance_cost = to_decimal(data.get("financeCost", 0))
    depreciation = to_decimal(data.get("depreciation", 0))
    amortization = to_decimal(data.get("amortization", 0))
    other_expenses = to_decimal(data.get("otherExpenses", 0))

    direct_exp = to_decimal(expense.get("total", 0) if isinstance(expense, dict) else data.get("totalExpenses", 0))
    sum_exp = cost_materials + salaries + rent + utilities + finance_cost + depreciation + amortization + other_expenses
    total_expenses = direct_exp if direct_exp > Decimal('0.00') else sum_exp

    cogs = to_decimal(expense.get("cogs", 0) if isinstance(expense, dict) else cost_materials)

    net_profit = total_revenue - total_expenses
    profit_margin = ((net_profit / total_revenue) * Decimal('100.0')) if total_revenue > Decimal('0.00') else Decimal('0.00')
    profitable = net_profit > Decimal('0.00')

    insights = []
    recommendations = []

    if net_profit < Decimal('0.00'):
        insights.append("⚠️ Business is operating at a LOSS")
        recommendations.extend([
            "Review all expenses immediately",
            "Consider cost reduction measures",
            "Increase revenue streams"
        ])
    elif profit_margin < Decimal('15.0'):
        insights.append("⚠️ Low Profit Margin business (below 15%)")
        recommendations.extend([
            "Improve pricing strategy",
            "Reduce operational expenses by 10-15%",
            "Focus on high-margin products/services"
        ])
    elif profit_margin < Decimal('25.0'):
        insights.append("✅ Moderate Profit Margin (15-25%)")
        recommendations.extend([
            "Maintain current cost structure",
            "Explore expansion opportunities"
        ])
    else:
        insights.append("🎉 Excellent Profit Margin (above 25%)")
        recommendations.extend([
            "Consider reinvesting profits",
            "Scale successful operations"
        ])

    expense_ratio = ((total_expenses / total_revenue) * Decimal('100.0')) if total_revenue > Decimal('0.00') else Decimal('0.00')
    if expense_ratio > Decimal('70.0'):
        insights.append(f"⚠️ Expenses are {float(expense_ratio):.1f}% of revenue - too high")
        recommendations.append("Identify top 3 expense categories for reduction")
    elif expense_ratio > Decimal('50.0'):
        insights.append(f"📊 Expenses are {float(expense_ratio):.1f}% of revenue - moderate")
        recommendations.append("Monitor expense growth closely")
    else:
        insights.append(f"✅ Excellent cost control - expenses only {float(expense_ratio):.1f}% of revenue")

    if cogs > (total_revenue * Decimal('0.6')):
        insights.append("⚠️ Cost of Goods Sold (COGS) is high compared to revenue")
        recommendations.extend([
            "Negotiate supplier costs",
            "Explore alternative vendors"
        ])

    return {
        "totalRevenue": round_money(total_revenue),
        "totalExpenses": round_money(total_expenses),
        "netProfit": round_money(net_profit),
        "profitMargin": round_money(profit_margin),
        "profitable": profitable,
        "aiInsights": insights,
        "aiRecommendations": recommendations
    }
