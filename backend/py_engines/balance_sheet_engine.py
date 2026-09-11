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

def calculate_balance_sheet(data):
    """
    Domain Engine: Balance Sheet Metrics & Accounting Equation Balance Verification (Assets = Liabilities + Equity).
    """
    cash_and_bank = to_decimal(data.get("cashAndBank", 0) or data.get("currentAssets", 0))
    accounts_receivable = to_decimal(data.get("accountsReceivable", 0))
    inventory_val = to_decimal(data.get("inventory", 0))
    fixed_assets = to_decimal(data.get("fixedAssets", 0) or data.get("nonCurrentAssets", 0))
    accounts_payable = to_decimal(data.get("accountsPayable", 0) or data.get("currentLiabilities", 0))
    non_current_liabilities = to_decimal(data.get("nonCurrentLiabilities", 0))
    cumulative_income = to_decimal(data.get("cumulativeIncome", 0))
    cumulative_expense = to_decimal(data.get("cumulativeExpense", 0))

    current_assets = cash_and_bank + accounts_receivable + inventory_val
    total_assets = current_assets + fixed_assets

    current_liabilities = accounts_payable
    total_liabilities = current_liabilities + non_current_liabilities

    retained_earnings = cumulative_income - cumulative_expense
    owner_equity = to_decimal(data.get("ownerEquity", 0) or data.get("equity", 0))
    total_equity = total_assets - total_liabilities if owner_equity == Decimal('0.00') else owner_equity

    balanced = abs(total_assets - (total_liabilities + total_equity)) < Decimal('1.00')

    return {
        "assets": {
            "cashAndBank": round_money(cash_and_bank),
            "accountsReceivable": round_money(accounts_receivable),
            "inventory": round_money(inventory_val),
            "currentAssets": round_money(current_assets),
            "fixedAssets": round_money(fixed_assets),
            "totalAssets": round_money(total_assets)
        },
        "liabilities": {
            "accountsPayable": round_money(accounts_payable),
            "currentLiabilities": round_money(current_liabilities),
            "nonCurrentLiabilities": round_money(non_current_liabilities),
            "totalLiabilities": round_money(total_liabilities)
        },
        "equity": {
            "ownerEquity": round_money(owner_equity),
            "retainedEarnings": round_money(retained_earnings),
            "totalEquity": round_money(total_equity)
        },
        "totalAssets": round_money(total_assets),
        "totalLiabilities": round_money(total_liabilities),
        "totalEquity": round_money(total_equity),
        "totalLiabilitiesEquity": round_money(total_liabilities + total_equity),
        "balanced": balanced
    }
