# -*- coding: utf-8 -*-
"""PROFIT AND LOSS STATEMENT UI_AI - ENHANCED with AI CFO"""

import ipywidgets as widgets
from IPython.display import display, clear_output
import pandas as pd
import matplotlib.pyplot as plt

# Revenue inputs
sales = widgets.FloatText(description='Sales:', value=150000)
service_income = widgets.FloatText(description='Service Income:', value=30000)
interest_income = widgets.FloatText(description='Interest Income:', value=5000)
other_income = widgets.FloatText(description='Other Income:', value=0)

# Expense inputs (EXPANDED to 8 fields - matching requirement)
cost_of_materials = widgets.FloatText(description='Cost of Materials:', value=50000)
salaries = widgets.FloatText(description='Salaries:', value=25000)
rent = widgets.FloatText(description='Rent:', value=10000)
utilities = widgets.FloatText(description='Utilities:', value=3000)
finance_cost = widgets.FloatText(description='Finance Cost:', value=5000)
depreciation = widgets.FloatText(description='Depreciation:', value=5000)
amortization = widgets.FloatText(description='Amortization:', value=2000)
other_expenses = widgets.FloatText(description='Other Expenses:', value=0)

# Auto-calculated totals (read-only)
total_revenue_display = widgets.FloatText(description='Total Revenue:', value=0, disabled=True)
total_expenses_display = widgets.FloatText(description='Total Expenses:', value=0, disabled=True)
net_profit_display = widgets.FloatText(description='Net Profit/Loss:', value=0, disabled=True)
profit_margin_display = widgets.FloatText(description='Profit Margin:', value=0, disabled=True)

# Button
calculate_button = widgets.Button(description='Calculate P&L with AI Insights', button_style='success')

# Output area
output = widgets.Output()

def ai_cfo_pl_insights(revenue, expenses, net_profit, profit_margin, cogs):
    """AI CFO Insights function"""
    insights = []
    recommendations = []
    
    # Profitability check
    if net_profit < 0:
        insights.append("⚠️ Business is operating at a LOSS")
        recommendations.append("Review all expenses immediately")
        recommendations.append("Consider cost reduction measures")
        recommendations.append("Increase revenue streams")
    elif profit_margin < 15:
        insights.append("⚠️ Low Profit Margin business (below 15%)")
        recommendations.append("Improve pricing strategy")
        recommendations.append("Reduce operational expenses by 10-15%")
        recommendations.append("Focus on high-margin products/services")
    elif profit_margin < 25:
        insights.append("✅ Moderate Profit Margin (15-25%)")
        recommendations.append("Maintain current cost structure")
        recommendations.append("Explore expansion opportunities")
    else:
        insights.append("🎉 Excellent Profit Margin (above 25%)")
        recommendations.append("Consider reinvesting profits")
        recommendations.append("Scale successful operations")
    
    # Expense analysis
    expense_ratio = (expenses / revenue * 100) if revenue > 0 else 0
    if expense_ratio > 70:
        insights.append(f"⚠️ Expenses are {expense_ratio:.1f}% of revenue - too high")
        recommendations.append("Identify top 3 expense categories for reduction")
    elif expense_ratio > 50:
        insights.append(f"📊 Expenses are {expense_ratio:.1f}% of revenue - moderate")
        recommendations.append("Monitor expense growth closely")
    else:
        insights.append(f"✅ Excellent cost control - expenses only {expense_ratio:.1f}% of revenue")
    
    # COGS impact (using cost_of_materials as proxy for COGS)
    if cogs and revenue and cogs > revenue * 0.6:
        insights.append("⚠️ COGS is high compared to revenue")
        recommendations.append("Negotiate supplier costs")
        recommendations.append("Explore alternative vendors")
    elif cogs and revenue and cogs > revenue * 0.4:
        insights.append("📊 COGS is moderate")
        recommendations.append("Review supplier contracts periodically")
    
    # Revenue diversification
    return insights, recommendations

def calculate_pnl(b):
    with output:
        clear_output()
        
        # Calculate totals
        total_revenue = sales.value + service_income.value + interest_income.value + other_income.value
        total_expenses = (cost_of_materials.value + salaries.value + rent.value + 
                         utilities.value + finance_cost.value + depreciation.value + 
                         amortization.value + other_expenses.value)
        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        # Update displays
        total_revenue_display.value = total_revenue
        total_expenses_display.value = total_expenses
        net_profit_display.value = net_profit
        profit_margin_display.value = profit_margin
        
        # Display results
        print("=" * 55)
        print("📊 PROFIT AND LOSS STATEMENT")
        print("=" * 55)
        print(f"\n💰 REVENUE: ₹{total_revenue:,.2f}")
        print(f"💸 EXPENSES: ₹{total_expenses:,.2f}")
        print(f"{'✅' if net_profit >= 0 else '❌'} NET {'PROFIT' if net_profit >= 0 else 'LOSS'}: ₹{abs(net_profit):,.2f}")
        print(f"📈 Profit Margin: {profit_margin:.2f}%")
        
        # Expense breakdown
        print("\n📋 EXPENSE BREAKDOWN:")
        expense_items = [
            ("Cost of Materials", cost_of_materials.value),
            ("Salaries", salaries.value),
            ("Rent", rent.value),
            ("Utilities", utilities.value),
            ("Finance Cost", finance_cost.value),
            ("Depreciation", depreciation.value),
            ("Amortization", amortization.value),
            ("Other Expenses", other_expenses.value),
        ]
        for name, value in expense_items:
            if value > 0:
                percentage = (value / total_expenses * 100) if total_expenses > 0 else 0
                print(f"   • {name}: ₹{value:,.2f} ({percentage:.1f}%)")
        
        # AI Insights
        print("\n" + "=" * 55)
        print("🤖 AI CFO INSIGHTS & RECOMMENDATIONS")
        print("=" * 55)
        
        insights, recommendations = ai_cfo_pl_insights(
            revenue=total_revenue,
            expenses=total_expenses,
            net_profit=net_profit,
            profit_margin=profit_margin,
            cogs=cost_of_materials.value
        )
        
        if insights:
            print("\n📌 KEY INSIGHTS:")
            for i in insights:
                print(f"   {i}")
        
        if recommendations:
            print("\n💡 RECOMMENDATIONS:")
            for r in recommendations:
                print(f"   • {r}")
        
        # Simple bar chart
        fig, ax = plt.subplots(figsize=(10, 5))
        categories = ['Revenue', 'Expenses', 'Net Profit']
        values = [total_revenue, total_expenses, abs(net_profit)]
        colors = ['#2ecc71', '#e74c3c', '#3498db' if net_profit >= 0 else '#e67e22']
        bars = ax.bar(categories, values, color=colors, alpha=0.8)
        ax.set_title('P&L Summary Visualization', fontsize=14, fontweight='bold')
        ax.set_ylabel('Amount (₹)', fontsize=12)
        ax.set_xlabel('Category', fontsize=12)
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(values)*0.02,
                   f'₹{value:,.0f}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.show()
        
        print("\n" + "=" * 55)
        print("📅 Report Generated by AI Financial Analytics Engine")
        print("=" * 55)

# Bind button
calculate_button.on_click(calculate_pnl)

# Layout
display(widgets.HTML("<h2>📊 PROFIT & LOSS STATEMENT with AI CFO</h2>"))
display(widgets.HTML("<i>Enter your financial data below and get AI-powered insights</i>"))

# Revenue section
display(widgets.HTML("<h3>💰 REVENUE</h3>"))
display(widgets.HBox([sales, service_income]))
display(widgets.HBox([interest_income, other_income]))

# Expense section
display(widgets.HTML("<h3>💸 EXPENSES</h3>"))
display(widgets.HBox([cost_of_materials, salaries]))
display(widgets.HBox([rent, utilities]))
display(widgets.HBox([finance_cost, depreciation]))
display(widgets.HBox([amortization, other_expenses]))

# Summary section
display(widgets.HTML("<h3>📋 SUMMARY</h3>"))
display(total_revenue_display)
display(total_expenses_display)
display(net_profit_display)
display(profit_margin_display)

# Button and output
display(calculate_button, output)