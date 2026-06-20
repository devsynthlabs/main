# -*- coding: utf-8 -*-
"""AUTOMATION OF PAYROLL UI_AI - ENHANCED VERSION
Merged with requirement file features
"""

import ipywidgets as widgets
from IPython.display import display, clear_output
import matplotlib.pyplot as plt
import numpy as np

title = widgets.HTML(value="<h2 style='color:#2c3e50; text-align:center;'>🤖 AUTOMATION OF PAYROLL - AI ENHANCED</h2>")

# Create tabs for different views
tab_contents = ['📊 Salary Calculator', '📈 Analytics', '📜 History']
tabs = widgets.Tab()
tabs.children = [widgets.VBox([]), widgets.VBox([]), widgets.VBox([])]
for i, title in enumerate(tab_contents):
    tabs.set_title(i, title)

# ==================== TAB 1: SALARY CALCULATOR ====================

# Employee Information Section
employee_section = widgets.HTML(value="<h3 style='color:#3498db;'>👤 Employee Information</h3>")
employee_name = widgets.Text(description='Employee Name:', placeholder='e.g., Arun, Sathis, Priya, Ramya')
employee_id = widgets.Text(description='Employee ID:', placeholder='e.g., 101, 102, 103, 104')
employee_roll = widgets.Text(description='Employee Role:', placeholder='Manager, Assistant Manager, Accountant, Sales Executive')
employee_department = widgets.Text(description='Department:', placeholder='Admin, HR, Marketing')
employee_experience_years = widgets.FloatText(description='Experience (years):', placeholder='e.g., 10, 5, 3, 3')

# Earnings Section
earnings_section = widgets.HTML(value="<h3 style='color:#27ae60;'>💰 Earnings</h3>")
employee_salary = widgets.Text(description='Basic Salary:', placeholder='25000,15000,15000,15000')
da = widgets.Text(description='DA:', placeholder='5000,3000,3000,3000')
hra = widgets.Text(description='HRA:', placeholder='7000,4500,4500,4500')
travel_allowance = widgets.Text(description='Travel Allowance:', placeholder='3000,2000,2000,2000')
overtime_allowance = widgets.Text(description='Overtime Allowance:', placeholder='3000,4000,5000,6000')
other_allowance = widgets.Text(description='Other Allowance:', placeholder='0,0,0,0')
bonus = widgets.Text(description='Bonus:', placeholder='3300,2000,2000,2000')

# Deductions Section
deductions_section = widgets.HTML(value="<h3 style='color:#e74c3c;'>📉 Deductions</h3>")
epf_deduction = widgets.Text(description='EPF (12% Auto):', placeholder='Auto-calculated', disabled=True, style={'disabled': 'lightgray'})
esi_deduction = widgets.Text(description='ESI Deduction:', placeholder='1000,1200,1300,1400')
tax_deduction = widgets.Text(description='Tax (5% Auto):', placeholder='Auto-calculated', disabled=True, style={'disabled': 'lightgray'})
extra_leave_deduction = widgets.Text(description='Extra Leave Deduction:', placeholder='0')
advance_recovery_deduction = widgets.Text(description='Advance Recovery:', placeholder='0')
loan_deduction = widgets.Text(description='Loan Deduction:', placeholder='0')
other_deduction = widgets.Text(description='Other Deduction:', placeholder='0')

# Results Section
results_section = widgets.HTML(value="<h3 style='color:#8e44ad;'>📊 Results</h3>")
gross_salary = widgets.Text(description='Gross Salary:', disabled=True, style={'disabled': 'lightgray'})
total_deductions = widgets.Text(description='Total Deductions:', disabled=True, style={'disabled': 'lightgray'})
net_salary = widgets.HTML(value="<h2 style='color:#27ae60;'>Net Salary: ₹0.00</h2>")

# AI Insight Section
ai_insight = widgets.HTML(value="<div style='background:#e8f4fd; padding:10px; border-radius:10px;'><b>🤖 AI Insight:</b> Click calculate to get salary analysis</div>")

# Buttons
calculate_button = widgets.Button(description='💰 Calculate Net Salary', button_style='success', layout=widgets.Layout(width='100%'))
clear_button = widgets.Button(description='🗑️ Clear All', button_style='danger', layout=widgets.Layout(width='100%'))

# Output
output = widgets.Output()

def generate_ai_insight(gross, net, deductions, epf, esi, tax, extra_leave, loan):
    """Generate AI insights based on salary calculations"""
    deduction_percentage = (deductions / gross * 100) if gross > 0 else 0
    net_percentage = (net / gross * 100) if gross > 0 else 0
    
    insights = []
    
    # Deduction analysis
    if deduction_percentage > 40:
        insights.append("⚠️ <span style='color:#e74c3c;'>High deduction rate (>40%)</span>. Consider tax-saving investments.")
    elif deduction_percentage < 20:
        insights.append(f"✅ <span style='color:#27ae60;'>Optimal deduction structure!</span> Net take-home is {net_percentage:.1f}% of gross.")
    else:
        insights.append(f"📊 Deductions are {deduction_percentage:.1f}% of gross salary.")
    
    # EPF analysis
    if epf > 10000:
        insights.append(f"💰 <span style='color:#3498db;'>Strong EPF contribution</span> (₹{epf:.2f}) building retirement corpus.")
    
    # ESI analysis
    if esi > 0 and gross < 21000:
        insights.append("🏥 <span style='color:#e67e22;'>ESI benefits active</span> - medical coverage available.")
    
    # Tax analysis
    if tax > 5000:
        insights.append(f"📉 Tax deduction of ₹{tax:.2f}. Consider Section 80C investments.")
    
    # Loan/Recovery analysis
    if loan > 0:
        insights.append(f"🏦 <span style='color:#e67e22;'>Active loan deduction</span> of ₹{loan:.2f} per month.")
    
    if extra_leave > 0:
        insights.append(f"📅 <span style='color:#e74c3c;'>Extra leave deduction</span> applied: ₹{extra_leave:.2f}")
    
    if not insights:
        insights.append("💡 <span style='color:#3498db;'>Salary structure is balanced.</span>")
    
    return "<br>".join(insights)

def calculate_net_salary(b):
    with output:
        clear_output(wait=True)
        try:
            # Get inputs with validation
            employee_name_input = employee_name.value or "N/A"
            employee_id_input = employee_id.value or "N/A"
            employee_roll_input = employee_roll.value or "N/A"
            employee_department_input = employee_department.value or "N/A"
            employee_experience_years_input = float(employee_experience_years.value) if employee_experience_years.value else 0
            
            # Parse earnings
            employee_salary_input = float(employee_salary.value) if employee_salary.value else 0
            da_input = float(da.value) if da.value else 0
            hra_input = float(hra.value) if hra.value else 0
            travel_allowance_input = float(travel_allowance.value) if travel_allowance.value else 0
            overtime_allowance_input = float(overtime_allowance.value) if overtime_allowance.value else 0
            other_allowance_input = float(other_allowance.value) if other_allowance.value else 0
            bonus_input = float(bonus.value) if bonus.value else 0
            
            # Parse deductions
            extra_leave_deduction_input = float(extra_leave_deduction.value) if extra_leave_deduction.value else 0
            esi_deduction_input = float(esi_deduction.value) if esi_deduction.value else 0
            advance_recovery_deduction_input = float(advance_recovery_deduction.value) if advance_recovery_deduction.value else 0
            loan_deduction_input = float(loan_deduction.value) if loan_deduction.value else 0
            other_deduction_input = float(other_deduction.value) if other_deduction.value else 0
            
            # Calculate Gross Salary (per requirement formula)
            gross_salary_calc = (employee_salary_input + da_input + hra_input + 
                                travel_allowance_input + overtime_allowance_input + 
                                other_allowance_input + bonus_input - extra_leave_deduction_input)
            
            # Auto-calculations (per requirement)
            epf_deduction_calc = 0.12 * gross_salary_calc
            tax_deduction_calc = 0.05 * gross_salary_calc
            
            # Total deductions (per requirement formula)
            total_deductions_calc = (epf_deduction_calc + tax_deduction_calc + 
                                    extra_leave_deduction_input + esi_deduction_input + 
                                    advance_recovery_deduction_input + loan_deduction_input + 
                                    other_deduction_input)
            
            net_salary_calc = gross_salary_calc - total_deductions_calc
            
            # Update output widgets
            gross_salary.value = f"₹{gross_salary_calc:,.2f}"
            total_deductions.value = f"₹{total_deductions_calc:,.2f}"
            epf_deduction.value = f"₹{epf_deduction_calc:,.2f} (12% of gross)"
            tax_deduction.value = f"₹{tax_deduction_calc:,.2f} (5% of gross)"
            net_salary.value = f"<h2 style='color:#27ae60;'>💰 Net Salary: ₹{net_salary_calc:,.2f}</h2>"
            
            # Generate AI insight
            ai_text = generate_ai_insight(
                gross_salary_calc, net_salary_calc, total_deductions_calc,
                epf_deduction_calc, esi_deduction_input, tax_deduction_calc,
                extra_leave_deduction_input, loan_deduction_input
            )
            ai_insight.value = f"<div style='background:#e8f4fd; padding:15px; border-radius:10px; border-left:5px solid #3498db;'><b>🤖 AI Salary Analysis:</b><br>{ai_text}</div>"
            
            # Display formatted results
            print("="*60)
            print(f"🧑 EMPLOYEE: {employee_name_input} (ID: {employee_id_input})")
            print(f"📌 ROLE: {employee_roll_input} | DEPT: {employee_department_input}")
            print(f"⭐ EXPERIENCE: {employee_experience_years_input} years")
            print("-"*60)
            print(f"💰 BASIC SALARY:     ₹{employee_salary_input:,.2f}")
            print(f"+ DA:               ₹{da_input:,.2f}")
            print(f"+ HRA:              ₹{hra_input:,.2f}")
            print(f"+ TRAVEL:           ₹{travel_allowance_input:,.2f}")
            print(f"+ OVERTIME:         ₹{overtime_allowance_input:,.2f}")
            print(f"+ OTHER ALLOWANCE:  ₹{other_allowance_input:,.2f}")
            print(f"+ BONUS:            ₹{bonus_input:,.2f}")
            print(f"- EXTRA LEAVE:      ₹{extra_leave_deduction_input:,.2f}")
            print("-"*60)
            print(f"📊 GROSS SALARY:     ₹{gross_salary_calc:,.2f}")
            print("-"*60)
            print(f"📉 EPF (12%):        ₹{epf_deduction_calc:,.2f}")
            print(f"📉 TAX (5%):         ₹{tax_deduction_calc:,.2f}")
            print(f"📉 ESI:              ₹{esi_deduction_input:,.2f}")
            print(f"📉 EXTRA LEAVE:      ₹{extra_leave_deduction_input:,.2f}")
            print(f"📉 ADVANCE RECOVERY: ₹{advance_recovery_deduction_input:,.2f}")
            print(f"📉 LOAN:             ₹{loan_deduction_input:,.2f}")
            print(f"📉 OTHER:            ₹{other_deduction_input:,.2f}")
            print("-"*60)
            print(f"💎 NET SALARY:       ₹{net_salary_calc:,.2f}")
            print("="*60)
            
            # Store in history
            history_data.append({
                'name': employee_name_input,
                'id': employee_id_input,
                'gross': gross_salary_calc,
                'net': net_salary_calc,
                'date': __import__('datetime').datetime.now().strftime("%Y-%m-%d %H:%M")
            })
            update_history_tab()
            
        except ValueError as e:
            print(f"❌ Please enter valid numerical values. Error: {e}")
        except Exception as e:
            print(f"❌ An error occurred: {e}")

def clear_all(b):
    """Clear all input fields"""
    employee_name.value = ''
    employee_id.value = ''
    employee_roll.value = ''
    employee_department.value = ''
    employee_experience_years.value = 0
    employee_salary.value = ''
    da.value = ''
    hra.value = ''
    travel_allowance.value = ''
    overtime_allowance.value = ''
    other_allowance.value = ''
    bonus.value = ''
    extra_leave_deduction.value = ''
    esi_deduction.value = ''
    advance_recovery_deduction.value = ''
    loan_deduction.value = ''
    other_deduction.value = ''
    gross_salary.value = ''
    total_deductions.value = ''
    net_salary.value = "<h2 style='color:#27ae60;'>Net Salary: ₹0.00</h2>"
    ai_insight.value = "<div style='background:#e8f4fd; padding:10px; border-radius:10px;'><b>🤖 AI Insight:</b> Click calculate to get salary analysis</div>"
    with output:
        clear_output()

# History storage
history_data = []

def update_history_tab():
    """Update the history tab with recent calculations"""
    history_html = "<div style='max-height:400px; overflow-y:auto;'>"
    if history_data:
        history_html += "<table style='width:100%; border-collapse:collapse;'>"
        history_html += "<tr style='background:#3498db; color:white;'><th>Date</th><th>Employee</th><th>ID</th><th>Gross</th><th>Net</th></tr>"
        for record in history_data[-10:]:  # Show last 10 records
            history_html += f"<tr style='border-bottom:1px solid #ddd;'>"
            history_html += f"<td>{record['date']}</td><td>{record['name']}</td><td>{record['id']}</td>"
            history_html += f"<td>₹{record['gross']:,.2f}</td><td style='color:#27ae60;font-weight:bold;'>₹{record['net']:,.2f}</td>"
            history_html += "</tr>"
        history_html += "</table>"
    else:
        history_html += "<p style='text-align:center;color:gray;'>No calculations yet. Click 'Calculate Net Salary' to see history.</p>"
    history_html += "</div>"
    tabs.children[2].children = (widgets.HTML(value=history_html),)

# ==================== TAB 2: ANALYTICS ====================
def create_analytics_chart():
    """Create a simple analytics chart"""
    if len(history_data) > 0:
        fig, ax = plt.subplots(figsize=(8, 4))
        names = [d['name'][:15] for d in history_data[-5:]]
        nets = [d['net'] for d in history_data[-5:]]
        grosses = [d['gross'] for d in history_data[-5:]]
        
        x = np.arange(len(names))
        width = 0.35
        
        ax.bar(x - width/2, grosses, width, label='Gross Salary', color='#3498db')
        ax.bar(x + width/2, nets, width, label='Net Salary', color='#27ae60')
        
        ax.set_xlabel('Employees')
        ax.set_ylabel('Amount (₹)')
        ax.set_title('Salary Comparison (Last 5 Calculations)')
        ax.set_xticks(x)
        ax.set_xticklabels(names, rotation=45, ha='right')
        ax.legend()
        
        plt.tight_layout()
        return fig
    else:
        fig, ax = plt.subplots(figsize=(8, 4))
        ax.text(0.5, 0.5, 'No data available. Calculate salaries first.', 
                ha='center', va='center', transform=ax.transAxes)
        ax.set_title('Salary Analytics')
        return fig

# ==================== TAB 3: HISTORY ====================
history_tab_content = widgets.HTML(value="<p style='text-align:center;color:gray;'>No calculations yet.</p>")

# Assemble Tab 1
tab1_content = widgets.VBox([
    employee_section,
    widgets.HBox([employee_name, employee_id]),
    widgets.HBox([employee_roll, employee_department]),
    employee_experience_years,
    widgets.HTML("<hr>"),
    earnings_section,
    widgets.HBox([employee_salary, da, hra]),
    widgets.HBox([travel_allowance, overtime_allowance, other_allowance]),
    bonus,
    widgets.HTML("<hr>"),
    deductions_section,
    widgets.HBox([epf_deduction, esi_deduction, tax_deduction]),
    widgets.HBox([extra_leave_deduction, advance_recovery_deduction]),
    widgets.HBox([loan_deduction, other_deduction]),
    widgets.HTML("<hr>"),
    results_section,
    gross_salary,
    total_deductions,
    net_salary,
    widgets.HTML("<br>"),
    ai_insight,
    widgets.HBox([calculate_button, clear_button]),
    output
])

# Assemble Tab 2
def update_analytics_tab():
    fig = create_analytics_chart()
    with output:
        clear_output()
        display(fig)
    # This is a simplification - in real use, you'd need to handle matplotlib display

# Assemble Tabs
tabs.children = [tab1_content, widgets.VBox([widgets.HTML("<h3>📊 Salary Analytics</h3>"), widgets.Output()]), widgets.VBox([history_tab_content])]

# Bind buttons
calculate_button.on_click(calculate_net_salary)
clear_button.on_click(clear_all)

# Display
display(tabs)

print("✅ Payroll Automation System Loaded Successfully!")
print("📌 Features: Auto EPF (12%), Auto Tax (5%), AI Insights, History Tracking")
print("🎙️ Voice input not available in Colab - use text input")