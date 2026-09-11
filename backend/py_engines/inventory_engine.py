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

def calculate_inventory_valuation(data):
    """
    Domain Engine: Inventory Stock Valuation & Reorder Point Alerts.
    """
    items = data.get("items", [])
    total_stock_value = Decimal('0.00')
    low_stock_alerts = []

    for item in items:
        qty = to_decimal(item.get("quantity", 0) or item.get("stock", 0))
        cost = to_decimal(item.get("costPrice", 0) or item.get("unitPrice", 0))
        reorder_level = to_decimal(item.get("reorderLevel", 10))

        item_valuation = qty * cost
        total_stock_value += item_valuation

        if qty <= reorder_level:
            low_stock_alerts.append({
                "itemName": item.get("name", "Unknown Item"),
                "currentQuantity": float(qty),
                "reorderLevel": float(reorder_level)
            })

    return {
        "totalStockValue": round_money(total_stock_value),
        "totalItemsCount": len(items),
        "lowStockCount": len(low_stock_alerts),
        "lowStockAlerts": low_stock_alerts
    }
