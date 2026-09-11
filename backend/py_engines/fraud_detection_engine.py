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

def detect_fraud_anomalies(data):
    """
    Domain Engine: AI Fraud Detection & Transaction Anomaly Risk Scoring Engine.
    """
    transactions = data.get("transactions", [])
    suspicious = []
    total_amount = Decimal('0.00')

    for tx in transactions:
        amount = to_decimal(tx.get("amount", 0))
        total_amount += amount

    avg_amount = (total_amount / Decimal(str(len(transactions) or 1))).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    for tx in transactions:
        amount = to_decimal(tx.get("amount", 0))
        is_round_number = (amount > Decimal('50000.00')) and (amount % Decimal('10000.00') == Decimal('0.00'))
        is_high_value = amount > (avg_amount * Decimal('3.0')) if avg_amount > Decimal('0.00') else False

        risk_score = 0.0
        reasons = []

        if is_high_value:
            risk_score += 0.6
            reasons.append(f"High value transaction ({float(amount):,.2f} is 3x above average)")

        if is_round_number:
            risk_score += 0.3
            reasons.append("Suspicious large round-figure amount")

        if risk_score >= 0.5:
            suspicious.append({
                "transactionId": tx.get("id") or tx.get("_id") or "tx_unknown",
                "amount": float(amount),
                "riskScore": float(Decimal(str(risk_score)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)),
                "reasons": reasons
            })

    return {
        "totalTransactionsEvaluated": len(transactions),
        "averageTransactionAmount": round_money(avg_amount),
        "suspiciousCount": len(suspicious),
        "suspiciousTransactions": suspicious
    }
