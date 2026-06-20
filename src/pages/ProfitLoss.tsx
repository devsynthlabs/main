import { useState } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Download, TrendingUp, TrendingDown, DollarSign, Sparkles, BarChart3, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ProfitLoss = () => {
  const navigate = useNavigate();

  // UPDATED formData with 8 expense fields (matching Python)
  const [formData, setFormData] = useState({
    // Revenue
    sales: "",
    serviceIncome: "",
    interestIncome: "",
    otherIncome: "",
    // Expenses (8 fields)
    costOfMaterials: "",      // NEW
    salaries: "",
    rent: "",
    utilities: "",
    financeCost: "",          // NEW
    depreciation: "",         // NEW
    amortization: "",         // NEW
    otherExpenses: "",
  });

  const [statement, setStatement] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateStatement = async () => {
    setIsLoading(true);
    
    // Parse all values with default 0
    const sales = parseFloat(formData.sales) || 0;
    const serviceIncome = parseFloat(formData.serviceIncome) || 0;
    const interestIncome = parseFloat(formData.interestIncome) || 0;
    const otherIncome = parseFloat(formData.otherIncome) || 0;
    
    // 8 expense fields
    const costOfMaterials = parseFloat(formData.costOfMaterials) || 0;
    const salaries = parseFloat(formData.salaries) || 0;
    const rent = parseFloat(formData.rent) || 0;
    const utilities = parseFloat(formData.utilities) || 0;
    const financeCost = parseFloat(formData.financeCost) || 0;
    const depreciation = parseFloat(formData.depreciation) || 0;
    const amortization = parseFloat(formData.amortization) || 0;
    const otherExpenses = parseFloat(formData.otherExpenses) || 0;

    // Calculate totals (matching Python logic)
    const totalRevenue = sales + serviceIncome + interestIncome + otherIncome;
    const totalExpenses = costOfMaterials + salaries + rent + utilities + financeCost + depreciation + amortization + otherExpenses;
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue * 100) : 0;

    const result = {
      // Revenue
      sales,
      serviceIncome,
      interestIncome,
      otherIncome,
      totalRevenue,
      // Expenses (8 fields)
      costOfMaterials,
      salaries,
      rent,
      utilities,
      financeCost,
      depreciation,
      amortization,
      otherExpenses,
      totalExpenses,
      // Results
      netProfit,
      profitMargin,
      profitable: netProfit > 0,
    };

    setStatement(result);
    setShowResult(true);

    // Generate AI insights locally (mirroring Python logic)
    const insights = [];
    const recommendations = [];

    if (netProfit < 0) {
      insights.push("⚠️ Business is operating at a LOSS");
      recommendations.push("Review all expenses immediately");
      recommendations.push("Consider cost reduction measures");
      recommendations.push("Increase revenue streams");
    } else if (profitMargin < 15) {
      insights.push("⚠️ Low Profit Margin business (below 15%)");
      recommendations.push("Improve pricing strategy");
      recommendations.push("Reduce operational expenses by 10-15%");
      recommendations.push("Focus on high-margin products/services");
    } else if (profitMargin < 25) {
      insights.push("✅ Moderate Profit Margin (15-25%)");
      recommendations.push("Maintain current cost structure");
      recommendations.push("Explore expansion opportunities");
    } else {
      insights.push("🎉 Excellent Profit Margin (above 25%)");
      recommendations.push("Consider reinvesting profits");
      recommendations.push("Scale successful operations");
    }

    const expenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue * 100) : 0;
    if (expenseRatio > 70) {
      insights.push(`⚠️ Expenses are ${expenseRatio.toFixed(1)}% of revenue - too high`);
      recommendations.push("Identify top 3 expense categories for reduction");
    } else if (expenseRatio > 50) {
      insights.push(`📊 Expenses are ${expenseRatio.toFixed(1)}% of revenue - moderate`);
      recommendations.push("Monitor expense growth closely");
    } else {
      insights.push(`✅ Excellent cost control - expenses only ${expenseRatio.toFixed(1)}% of revenue`);
    }

    if (costOfMaterials > 0 && totalRevenue > 0 && costOfMaterials > totalRevenue * 0.6) {
      insights.push("⚠️ COGS is high compared to revenue");
      recommendations.push("Negotiate supplier costs");
      recommendations.push("Explore alternative vendors");
    }

    setAiInsights({ insights, recommendations });

    try {
      const res = await fetch(`${API_ENDPOINTS.PROFIT_LOSS}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const data = await res.json();
      if (!res.ok) console.error("Error saving data:", data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!statement) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = 18;

    // Header block
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageW, 28, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED", pageW / 2, 10, { align: "center" });
    doc.setFontSize(16);
    doc.text("PROFIT & LOSS STATEMENT", pageW / 2, 20, { align: "center" });
    y = 36;

    // Subtitle / Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageW / 2, y, { align: "center" });
    y += 10;

    // 1. Revenue Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(21, 128, 61); // green-700
    doc.text("REVENUE & INCOME", margin, y);
    y += 4;

    const revenueRows = [
      ["1", "Sales", `Rs. ${statement.sales.toFixed(2)}`],
      ["2", "Service Income", `Rs. ${statement.serviceIncome.toFixed(2)}`],
      ["3", "Interest Income", `Rs. ${statement.interestIncome.toFixed(2)}`],
      ["4", "Other Income", `Rs. ${statement.otherIncome.toFixed(2)}`]
    ];

    autoTable(doc, {
      startY: y,
      head: [["#", "Category", "Amount"]],
      body: revenueRows,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74] }, // green-600
      margin: { left: margin, right: margin },
      foot: [["", "Total Revenue", `Rs. ${statement.totalRevenue.toFixed(2)}`]],
      footStyles: { fillColor: [240, 253, 244], textColor: [21, 128, 61], fontStyle: "bold" }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // 2. Expense Table (includes all 8 fields)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(194, 65, 12); // orange-700
    doc.text("EXPENSES", margin, y);
    y += 4;

    const expenseRows = [
      ["1", "Cost of Materials", `Rs. ${statement.costOfMaterials.toFixed(2)}`],
      ["2", "Salaries", `Rs. ${statement.salaries.toFixed(2)}`],
      ["3", "Rent", `Rs. ${statement.rent.toFixed(2)}`],
      ["4", "Utilities", `Rs. ${statement.utilities.toFixed(2)}`],
      ["5", "Finance Cost", `Rs. ${statement.financeCost.toFixed(2)}`],
      ["6", "Depreciation", `Rs. ${statement.depreciation.toFixed(2)}`],
      ["7", "Amortization", `Rs. ${statement.amortization.toFixed(2)}`],
      ["8", "Other Expenses", `Rs. ${statement.otherExpenses.toFixed(2)}`]
    ];

    autoTable(doc, {
      startY: y,
      head: [["#", "Category", "Amount"]],
      body: expenseRows,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] }, // red-600
      margin: { left: margin, right: margin },
      foot: [["", "Total Expenses", `Rs. ${statement.totalExpenses.toFixed(2)}`]],
      footStyles: { fillColor: [254, 242, 242], textColor: [194, 65, 12], fontStyle: "bold" }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // Check if y exceeds height to avoid page boundary overlap
    if (y > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      y = 20;
    }

    // Net Profit Section
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(`Net ${statement.profitable ? 'Profit' : 'Loss'}`, margin + 5, y + 8);
    doc.setTextColor(147, 197, 253);
    doc.text(`Rs. ${statement.netProfit.toFixed(2)}  (${statement.profitMargin.toFixed(2)}%)`, margin + contentW - 5, y + 8, { align: "right" });
    y += 18;

    // Status box
    const isProfitable = statement.profitable;

    doc.setFillColor(...(isProfitable ? ([240, 253, 244] as [number,number,number]) : ([254, 242, 242] as [number,number,number])));
    doc.setDrawColor(...(isProfitable ? ([22, 163, 74] as [number,number,number]) : ([220, 38, 38] as [number,number,number])));
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, contentW, 18, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...(isProfitable ? ([22, 163, 74] as [number,number,number]) : ([220, 38, 38] as [number,number,number])));
    
    const statusText = isProfitable ? "PROFITABLE OPERATIONS" : "LOSS INCURRED";
    doc.text(statusText, pageW / 2, y + 7, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const adviceText = isProfitable 
      ? "Excellent cost control and solid revenue generation. Maintain current strategy." 
      : "Operating at a net loss. Monitor and optimize operational cost structures.";
    doc.text(adviceText, pageW / 2, y + 13, { align: "center" });
    y += 26;

    // AI Insights Section
    if (aiInsights && (aiInsights.insights.length > 0 || aiInsights.recommendations.length > 0)) {
      if (y > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text("AI CFO INSIGHTS & RECOMMENDATIONS", margin, y);
      y += 6;

      const aiRows = [
        ...aiInsights.insights.map((i: string) => ["Insight", i.replace(/[^\x00-\x7F]/g, "")]),
        ...aiInsights.recommendations.map((r: string) => ["Recommendation", r.replace(/[^\x00-\x7F]/g, "")])
      ];

      autoTable(doc, {
        startY: y,
        head: [["Type", "Detail"]],
        body: aiRows,
        theme: "striped",
        headStyles: { fillColor: [30, 64, 175] },
        margin: { left: margin, right: margin }
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + contentW, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Generated by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED  |  Financial Analytics Engine",
      pageW / 2,
      y,
      { align: "center" }
    );

    doc.save(`ProfitLoss_Statement_${Date.now()}.pdf`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <div className="liquid-backdrop fixed inset-0 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/24 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 rounded-full border border-white/60 bg-white/45 text-slate-700 hover:bg-white/70 hover:text-slate-950"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="liquid-icon flex h-16 w-16 items-center justify-center rounded-[22px]">
              <BarChart3 className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Profit & Loss Statement
              </h1>
              <p className="mt-1 text-slate-600 font-medium">Generate, analyze with AI, and download P&L reports</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 transition-all duration-500 bg-white/40">
            <div className="absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 bg-gradient-to-b from-sky-200/60 to-transparent blur-2xl" />

            <CardHeader className="relative">
              <CardTitle className="text-2xl font-bold text-slate-950 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-sky-700" />
                Enter P&L Data
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                Input your company's financial details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-white/60 border border-white/80 shadow-sm backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">💰 Revenue</h3>
                {[
                  { field: "sales", label: "Sales", icon: "📊" },
                  { field: "serviceIncome", label: "Service Income", icon: "🔧" },
                  { field: "interestIncome", label: "Interest Income", icon: "📈" },
                  { field: "otherIncome", label: "Other Income", icon: "💰" },
                ].map(({ field, label, icon }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-slate-700 font-semibold flex items-center gap-2">
                      <span>{icon}</span> {label} (₹)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={field}
                        type="number"
                        placeholder="0.00"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(field, text)}
                        onClear={() => handleInputChange(field, "")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Expenses Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-orange-50/60 border border-orange-100 shadow-sm backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 border-b border-orange-100/30 pb-2">💸 Expenses</h3>
                {[
                  { field: "costOfMaterials", label: "Cost of Materials", icon: "📦" },
                  { field: "salaries", label: "Salaries", icon: "👥" },
                  { field: "rent", label: "Rent", icon: "🏢" },
                  { field: "utilities", label: "Utilities", icon: "⚡" },
                  { field: "financeCost", label: "Finance Cost", icon: "🏦" },
                  { field: "depreciation", label: "Depreciation", icon: "📉" },
                  { field: "amortization", label: "Amortization", icon: "📋" },
                  { field: "otherExpenses", label: "Other Expenses", icon: "📝" },
                ].map(({ field, label, icon }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-slate-700 font-semibold flex items-center gap-2">
                      <span>{icon}</span> {label} (₹)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={field}
                        type="number"
                        placeholder="0.00"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(field, text)}
                        onClear={() => handleInputChange(field, "")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={generateStatement}
                disabled={isLoading}
                className="w-full h-14 rounded-full bg-slate-950 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {isLoading ? "Generating..." : "Generate P&L Statement with AI"}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          {showResult && statement && (
            <Card className={`liquid-panel relative overflow-hidden rounded-[36px] border-white/55 bg-white/40 shadow-xl border-2 transition-all duration-500 animate-in fade-in duration-700 ${statement.profitable ? 'border-emerald-300' : 'border-rose-300'}`}>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-bold flex items-center gap-3 text-slate-950">
                  {statement.profitable ? <TrendingUp className="h-6 w-6 text-emerald-600" /> : <TrendingDown className="h-6 w-6 text-rose-600" />}
                  Financial Summary
                </CardTitle>
                <CardDescription className={statement.profitable ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                  Detailed profit & loss breakdown with AI insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/70 border border-slate-200 space-y-3">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">💰 Revenue</h4>
                  {[
                    { label: "Sales", value: statement.sales },
                    { label: "Service Income", value: statement.serviceIncome },
                    { label: "Interest Income", value: statement.interestIncome },
                    { label: "Other Income", value: statement.otherIncome },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/50 border border-slate-200">
                      <span className="text-slate-700 font-medium">{label}</span>
                      <span className="font-bold text-slate-900">₹{value.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-300 mt-1">
                    <span className="font-bold text-emerald-900 text-base">Total Revenue</span>
                    <span className="font-bold text-emerald-800 text-lg">₹{statement.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 border border-slate-200 space-y-3">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">💸 Expenses</h4>
                  {[
                    { label: "Cost of Materials", value: statement.costOfMaterials },
                    { label: "Salaries", value: statement.salaries },
                    { label: "Rent", value: statement.rent },
                    { label: "Utilities", value: statement.utilities },
                    { label: "Finance Cost", value: statement.financeCost },
                    { label: "Depreciation", value: statement.depreciation },
                    { label: "Amortization", value: statement.amortization },
                    { label: "Other Expenses", value: statement.otherExpenses },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/50 border border-slate-200">
                      <span className="text-slate-700 font-medium">{label}</span>
                      <span className="font-bold text-slate-900">₹{value.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-300 mt-1">
                    <span className="font-bold text-rose-900 text-base">Total Expenses</span>
                    <span className="font-bold text-rose-800 text-lg">₹{statement.totalExpenses.toFixed(2)}</span>
                  </div>
                </div>

                <div className={`flex justify-between items-center p-5 rounded-2xl border-2 mt-4 ${statement.profitable ? 'bg-emerald-500/10 border-emerald-300 text-emerald-900' : 'bg-rose-500/10 border-rose-300 text-rose-900'}`}>
                  <span className="text-xl font-black">Net {statement.profitable ? 'Profit' : 'Loss'}</span>
                  <span className="text-3xl font-black">₹{statement.netProfit.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 text-white border border-slate-900 shadow-lg">
                  <span className="font-bold">Profit Margin</span>
                  <span className="font-bold text-sky-300 text-lg">{statement.profitMargin.toFixed(2)}%</span>
                </div>

                {/* AI Insights Section */}
                {aiInsights && (
                  <div className="space-y-4">
                    <div className="space-y-2 mt-4">
                      <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-600" />
                        🤖 AI CFO Insights
                      </h4>
                      {aiInsights.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/5 border border-yellow-300/50">
                          <span className="text-yellow-600">📌</span>
                          <span className="text-slate-800 text-sm font-medium">{insight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-sky-600" />
                        💡 Recommendations
                      </h4>
                      {aiInsights.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-sky-500/5 border border-sky-300/50">
                          <span className="text-sky-600">•</span>
                          <span className="text-slate-800 text-sm font-medium">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  className="group rounded-full bg-slate-950 font-semibold text-white px-8 py-4 w-full shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 mt-6"
                  onClick={downloadPDF}
                >
                  <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                  Download P&L Statement
                </Button>
              </CardContent>
            </Card>
          )}

          {!showResult && (
            <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 bg-white/40 flex items-center justify-center min-h-[600px]">
              <div className="text-center p-8">
                <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Analyze</h3>
                <p className="text-slate-500">Enter your financial data to generate a statement with AI insights</p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfitLoss;