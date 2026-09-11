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

def calculate_gst(data):
    """
    Domain Engine: GST Entry & Tax Split Calculation (Intrastate vs Interstate).
    """
    base_amount = to_decimal(data.get("baseAmount", 0))
    rate = to_decimal(data.get("gstRate", 18))
    tx_type = str(data.get("transactionType", "intrastate")).lower()

    if tx_type == "intrastate":
        cgst = (base_amount * (rate / Decimal('2.0')) / Decimal('100.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        sgst = cgst
        igst = Decimal('0.00')
    else:
        cgst = Decimal('0.00')
        sgst = Decimal('0.00')
        igst = (base_amount * rate / Decimal('100.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    total = base_amount + cgst + sgst + igst

    return {
        "baseAmount": round_money(base_amount),
        "gstRate": float(rate),
        "transactionType": tx_type,
        "cgst": round_money(cgst),
        "sgst": round_money(sgst),
        "igst": round_money(igst),
        "total": round_money(total)
    }

def calculate_gst_analytics(data):
    """
    Domain Engine: GST Output vs Input ITC Tax Payable/Receivable Analytics.
    """
    output_gst = to_decimal(data.get("outputGst", 0))
    input_gst = to_decimal(data.get("inputGst", 0))

    if output_gst >= input_gst:
        gst_payable = output_gst - input_gst
        gst_receivable = Decimal('0.00')
    else:
        gst_payable = Decimal('0.00')
        gst_receivable = input_gst - output_gst

    return {
        "gstSummary": {
            "outputGst": round_money(output_gst),
            "inputGst": round_money(input_gst),
            "gstPayable": round_money(gst_payable),
            "gstReceivable": round_money(gst_receivable)
        }
    }
