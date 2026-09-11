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

def calculate_invoice(data):
    """
    Domain Engine: Sales & Purchase Invoice Calculation with Decimal Accounting Precision.
    """
    items = data.get("items", [])
    shipping = to_decimal(data.get("shippingCharges", 0))
    packaging = to_decimal(data.get("packagingCharges", 0))
    freight = to_decimal(data.get("freightCharges", 0))
    adjustment = to_decimal(data.get("adjustment", 0))
    amount_paid = to_decimal(data.get("amountPaid", 0) or data.get("paid", 0))

    customer_state = str(data.get("stateOfSupply", "")).strip()
    business_state = str(data.get("businessState", "Tamil Nadu")).strip()
    force_interstate = data.get("isInterState", None)

    if force_interstate is not None:
        is_interstate = bool(force_interstate)
    elif customer_state and business_state and customer_state.lower() != business_state.lower():
        is_interstate = True
    else:
        is_interstate = False

    calculated_items = []
    subtotal = Decimal('0.00')
    total_cgst = Decimal('0.00')
    total_sgst = Decimal('0.00')
    total_igst = Decimal('0.00')
    items_grand_total = Decimal('0.00')

    for item in items:
        qty = to_decimal(item.get("quantity", 1))
        price = to_decimal(item.get("unitPrice", 0) or item.get("pricePerUnit", 0) or item.get("price", 0))
        disc_pct = to_decimal(item.get("discountPercent", 0) or item.get("discount", 0))
        tax_pct = to_decimal(item.get("taxRate", 0) or item.get("taxPercent", 0) or item.get("gstRate", 0))
        price_with_tax = bool(item.get("priceWithTax", False))

        base_amount = qty * price
        disc_amount = (base_amount * disc_pct / Decimal('100.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        after_discount = base_amount - disc_amount

        if price_with_tax and tax_pct > Decimal('0.00'):
            tax_multiplier = Decimal('1.00') + (tax_pct / Decimal('100.0'))
            pre_tax = (after_discount / tax_multiplier).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            tax_amount = after_discount - pre_tax
            line_total = after_discount
        else:
            tax_amount = (after_discount * tax_pct / Decimal('100.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            line_total = after_discount + tax_amount

        if is_interstate:
            cgst_rate = Decimal('0.00')
            cgst_amount = Decimal('0.00')
            sgst_rate = Decimal('0.00')
            sgst_amount = Decimal('0.00')
            igst_rate = tax_pct
            igst_amount = tax_amount
        else:
            cgst_rate = (tax_pct / Decimal('2.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            cgst_amount = (tax_amount / Decimal('2.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            sgst_rate = cgst_rate
            sgst_amount = tax_amount - cgst_amount
            igst_rate = Decimal('0.00')
            igst_amount = Decimal('0.00')

        subtotal += after_discount
        total_cgst += cgst_amount
        total_sgst += sgst_amount
        total_igst += igst_amount
        items_grand_total += line_total

        item_copy = dict(item)
        item_copy.update({
            "quantity": float(qty),
            "unitPrice": float(price),
            "pricePerUnit": float(price),
            "discountAmount": round_money(disc_amount),
            "taxAmount": round_money(tax_amount),
            "cgstRate": float(cgst_rate),
            "cgstAmount": round_money(cgst_amount),
            "sgstRate": float(sgst_rate),
            "sgstAmount": round_money(sgst_amount),
            "igstRate": float(igst_rate),
            "igstAmount": round_money(igst_amount),
            "isInterState": is_interstate,
            "total": round_money(line_total),
            "amount": round_money(line_total)
        })
        calculated_items.append(item_copy)

    total_tax = total_cgst + total_sgst + total_igst
    grand_total = items_grand_total + shipping + packaging + freight + adjustment
    balance_due = grand_total - amount_paid

    return {
        "items": calculated_items,
        "subtotal": round_money(subtotal),
        "totalCgst": round_money(total_cgst),
        "totalSgst": round_money(total_sgst),
        "totalIgst": round_money(total_igst),
        "totalTax": round_money(total_tax),
        "taxAmount": round_money(total_tax),
        "shippingCharges": round_money(shipping),
        "packagingCharges": round_money(packaging),
        "freightCharges": round_money(freight),
        "adjustment": round_money(adjustment),
        "grandTotal": round_money(grand_total),
        "total": round_money(grand_total),
        "amountPaid": round_money(amount_paid),
        "paid": round_money(amount_paid),
        "balanceDue": round_money(balance_due),
        "balance": round_money(balance_due),
        "isInterState": is_interstate
    }
