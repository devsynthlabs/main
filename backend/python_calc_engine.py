import sys
import json

# Import Domain Calculation Engines from py_engines package
from py_engines.invoice_engine import calculate_invoice
from py_engines.payroll_engine import calculate_payroll
from py_engines.gst_engine import calculate_gst, calculate_gst_analytics
from py_engines.profit_loss_engine import calculate_profit_loss
from py_engines.balance_sheet_engine import calculate_balance_sheet
from py_engines.financial_ratios_engine import calculate_financial_ratios
from py_engines.cash_flow_engine import calculate_cash_flow
from py_engines.bookkeeping_engine import calculate_bookkeeping_summary
from py_engines.bank_reconciliation_engine import reconcile_bank_transactions
from py_engines.inventory_engine import calculate_inventory_valuation
from py_engines.civil_engineering_engine import calculate_civil_project_cost
from py_engines.fraud_detection_engine import detect_fraud_anomalies

def main():
    """
    Central Financial Engine Router / Dispatcher.
    Routes incoming calculation requests to the corresponding Domain Calculation Engine module.
    """
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Action and payload required"}))
        sys.exit(1)

    action = sys.argv[1]
    raw_payload = sys.argv[2]

    try:
        payload = json.loads(raw_payload)
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON payload: {str(e)}"}))
        sys.exit(1)

    # Dispatcher Action Router
    if action in ["invoice.calculate", "purchase_invoice.calculate"]:
        result = calculate_invoice(payload)
    elif action in ["payroll.calculate"]:
        result = calculate_payroll(payload)
    elif action in ["gst.calculate"]:
        result = calculate_gst(payload)
    elif action in ["gst_analytics.calculate", "gst_analytics"]:
        result = calculate_gst_analytics(payload)
    elif action in ["profit_loss.calculate", "profit_loss"]:
        result = calculate_profit_loss(payload)
    elif action in ["balance_sheet.calculate", "balance_sheet"]:
        result = calculate_balance_sheet(payload)
    elif action in ["financial_ratios.calculate", "financial_ratios"]:
        result = calculate_financial_ratios(payload)
    elif action in ["cash_flow.calculate"]:
        result = calculate_cash_flow(payload)
    elif action in ["bookkeeping.calculate"]:
        result = calculate_bookkeeping_summary(payload)
    elif action in ["bank_reconciliation.calculate"]:
        result = reconcile_bank_transactions(payload)
    elif action in ["inventory.calculate"]:
        result = calculate_inventory_valuation(payload)
    elif action in ["civil_engineering.calculate"]:
        result = calculate_civil_project_cost(payload)
    elif action in ["fraud_detection.calculate"]:
        result = detect_fraud_anomalies(payload)
    else:
        result = {"error": f"Unauthorized action: {action}"}

    print(json.dumps(result))

if __name__ == "__main__":
    main()
