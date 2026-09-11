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

def calculate_bookkeeping_summary(data):
    """
    Domain Engine: Double-entry Bookkeeping debit/credit ledger balance calculation.
    """
    entries = data.get("entries", [])
    total_income = Decimal('0.00')
    total_expenses = Decimal('0.00')

    for entry in entries:
        amount = to_decimal(entry.get("amount", 0))
        entry_type = str(entry.get("type", "expense")).lower()
        if entry_type == "income":
            total_income += amount
        else:
            total_expenses += amount

    net_balance = total_income - total_expenses

    return {
        "totalIncome": round_money(total_income),
        "totalExpenses": round_money(total_expenses),
        "netBalance": round_money(net_balance),
        "entryCount": len(entries)
    }
