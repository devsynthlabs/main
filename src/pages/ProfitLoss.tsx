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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30">
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Profit & Loss Statement
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Generate, analyze with AI, and download P&L reports</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40 hover:-translate-y-2">
            <CardHeader className="relative">
              <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-cyan-400" />
                Enter P&L Data
              </CardTitle>
              <CardDescription className="text-blue-200/70">
                Input your company's financial details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Revenue Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-100 border-b border-blue-400/30 pb-2">💰 Revenue</h3>
                {[
                  { field: "sales", label: "Sales", icon: "📊" },
                  { field: "serviceIncome", label: "Service Income", icon: "🔧" },
                  { field: "interestIncome", label: "Interest Income", icon: "📈" },
                  { field: "otherIncome", label: "Other Income", icon: "💰" },
                ].map(({ field, label, icon }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-blue-100 font-bold flex items-center gap-2">
                      <span>{icon}</span> {label} (₹)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={field}
                        type="number"
                        placeholder="0.00"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(field, text)}
                        onClear={() => handleInputChange(field, "")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Expenses Section - UPDATED with 8 fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-100 border-b border-blue-400/30 pb-2">💸 Expenses</h3>
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
                    <Label htmlFor={field} className="text-blue-100 font-bold flex items-center gap-2">
                      <span>{icon}</span> {label} (₹)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={field}
                        type="number"
                        placeholder="0.00"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
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
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {isLoading ? "Generating..." : "Generate P&L Statement with AI"}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          {showResult && statement && (
            <Card className={`backdrop-blur-2xl bg-white/10 border-2 shadow-2xl rounded-3xl overflow-hidden transition-all duration-700 animate-in fade-in ${statement.profitable ? 'border-emerald-400/60 shadow-emerald-500/60' : 'border-red-400/60 shadow-red-500/60'}`}>
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                  {statement.profitable ? <TrendingUp className="h-6 w-6 text-emerald-400" /> : <TrendingDown className="h-6 w-6 text-red-400" />}
                  Financial Summary
                </CardTitle>
                <CardDescription className={statement.profitable ? 'text-emerald-200/80' : 'text-red-200/80'}>
                  Detailed profit & loss breakdown with AI insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 space-y-3">
                  <h4 className="text-lg font-bold text-cyan-300 flex items-center gap-2 mb-3">💰 Revenue</h4>
                  {[
                    { label: "Sales", value: statement.sales },
                    { label: "Service Income", value: statement.serviceIncome },
                    { label: "Interest Income", value: statement.interestIncome },
                    { label: "Other Income", value: statement.otherIncome },
                  ].map(({ label, value }, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-cyan-400/10">
                      <span className="text-blue-200 font-medium">{label}</span>
                      <span className="font-bold text-cyan-300">₹{value.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/40 mt-1">
                    <span className="font-bold text-white text-base">Total Revenue</span>
                    <span className="font-bold text-cyan-200 text-lg drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">₹{statement.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 space-y-3">
                  <h4 className="text-lg font-bold text-orange-300 flex items-center gap-2 mb-3">💸 Expenses</h4>
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
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-orange-400/10">
                      <span className="text-blue-200 font-medium">{label}</span>
                      <span className="font-bold text-orange-300">₹{value.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/20 border border-red-400/40 mt-1">
                    <span className="font-bold text-white text-base">Total Expenses</span>
                    <span className="font-bold text-red-300 text-lg drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">₹{statement.totalExpenses.toFixed(2)}</span>
                  </div>
                </div>

                <div className={`flex justify-between items-center p-5 rounded-2xl border-2 mt-4 ${statement.profitable ? 'bg-emerald-600/20 border-emerald-400/60' : 'bg-red-600/20 border-red-400/60'}`}>
                  <span className="text-xl font-black text-white">Net {statement.profitable ? 'Profit' : 'Loss'}</span>
                  <span className={`text-3xl font-black drop-shadow-[0_0_20px_rgba(16,185,129,0.8)] ${statement.profitable ? 'text-emerald-300' : 'text-red-300'}`}>₹{statement.netProfit.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                  <span className="font-bold text-white">Profit Margin</span>
                  <span className="font-bold text-yellow-300 text-lg">{statement.profitMargin.toFixed(2)}%</span>
                </div>

                {/* AI Insights Section - NEW */}
                {aiInsights && (
                  <>
                    <div className="space-y-3 mt-4">
                      <h4 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        🤖 AI CFO Insights
                      </h4>
                      {aiInsights.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-400/30">
                          <span className="text-yellow-300">📌</span>
                          <span className="text-white/90">{insight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        💡 Recommendations
                      </h4>
                      {aiInsights.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
                          <span className="text-cyan-300">•</span>
                          <span className="text-white/90">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Button
                  className={`w-full h-14 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 mt-6 ${statement.profitable ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}
                  onClick={downloadPDF}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download P&L Statement with AI Insights
                </Button>
              </CardContent>
            </Card>
          )}

          {!showResult && (
            <Card className="backdrop-blur-2xl bg-white/5 border border-blue-400/10 shadow-xl rounded-3xl overflow-hidden flex items-center justify-center min-h-[600px]">
              <div className="text-center p-8">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-6 animate-pulse" />
                <h3 className="text-2xl font-bold text-blue-200 mb-3">Ready to Analyze</h3>
                <p className="text-blue-300/60">Enter your financial data to generate a statement with AI insights</p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfitLoss;