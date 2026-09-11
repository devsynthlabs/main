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

def reconcile_bank_transactions(data):
    """
    Domain Engine: Bank Statement vs Ledger Reconciliation & Unreconciled Match Score Engine.
    """
    bank_txs = data.get("bankTransactions", [])
    ledger_txs = data.get("ledgerTransactions", [])

    matched = []
    unmatched_bank = []
    unmatched_ledger = list(ledger_txs)

    for b_tx in bank_txs:
        b_amount = to_decimal(b_tx.get("amount", 0))
        b_desc = str(b_tx.get("description", "")).lower()

        found_match = False
        for l_idx, l_tx in enumerate(unmatched_ledger):
            l_amount = to_decimal(l_tx.get("amount", 0))
            l_desc = str(l_tx.get("description", "")).lower()

            if b_amount == l_amount and (b_desc in l_desc or l_desc in b_desc):
                matched.append({
                    "bankTx": b_tx,
                    "ledgerTx": l_tx,
                    "matchScore": 0.95
                })
                unmatched_ledger.pop(l_idx)
                found_match = True
                break

        if not found_match:
            unmatched_bank.append(b_tx)

    reconciled_count = len(matched)
    total_count = len(bank_txs)
    reconciliation_rate = float((Decimal(str(reconciled_count)) / Decimal(str(total_count or 1)) * Decimal('100.0')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))

    return {
        "matchedCount": reconciled_count,
        "unmatchedBankCount": len(unmatched_bank),
        "unmatchedLedgerCount": len(unmatched_ledger),
        "reconciliationRate": reconciliation_rate,
        "matched": matched,
        "unmatchedBank": unmatched_bank,
        "unmatchedLedger": unmatched_ledger
    }
