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

def calculate_payroll(data):
    """
    Domain Engine: Payroll & Employee Salary Breakdown Engine with Decimal Precision.
    """
    basic = to_decimal(data.get("basicSalary", 0))
    da = to_decimal(data.get("da", 0))
    hra = to_decimal(data.get("hra", 0))
    travel = to_decimal(data.get("travelAllowance", 0))
    overtime = to_decimal(data.get("overtimeAllowance", 0))
    other_allow = to_decimal(data.get("otherAllowance", 0))
    bonus = to_decimal(data.get("bonuses", 0))
    extra_leave = to_decimal(data.get("extraLeaveDeduction", 0))

    gross_salary = basic + da + hra + travel + overtime + other_allow + bonus - extra_leave

    epf_auto = (gross_salary * Decimal('0.12')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    tax_auto = (gross_salary * Decimal('0.05')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    manual_pf = to_decimal(data.get("pfDeduction", 0))
    final_pf = manual_pf if manual_pf > Decimal('0.00') else epf_auto

    esi = to_decimal(data.get("esiDeduction", 0))
    advance = to_decimal(data.get("advanceRecoveryDeduction", 0))
    loan = to_decimal(data.get("loanDeduction", 0))
    other_ded = to_decimal(data.get("otherDeduction", 0))

    total_deductions = final_pf + tax_auto + extra_leave + esi + advance + loan + other_ded
    net_salary = gross_salary - total_deductions

    return {
        "basicSalary": round_money(basic),
        "da": round_money(da),
        "hra": round_money(hra),
        "travelAllowance": round_money(travel),
        "overtimeAllowance": round_money(overtime),
        "otherAllowance": round_money(other_allow),
        "bonuses": round_money(bonus),
        "grossSalary": round_money(gross_salary),
        "pfDeduction": round_money(final_pf),
        "epfDeduction": round_money(epf_auto),
        "esiDeduction": round_money(esi),
        "taxDeduction": round_money(tax_auto),
        "extraLeaveDeduction": round_money(extra_leave),
        "advanceRecoveryDeduction": round_money(advance),
        "loanDeduction": round_money(loan),
        "otherDeduction": round_money(other_ded),
        "totalDeductions": round_money(total_deductions),
        "netSalary": round_money(net_salary)
    }
