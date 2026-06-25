import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, TrendingUp, TrendingDown, FileText, BarChart3, Plus, Trash2, Database, DollarSign, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DEFAULT_REPORT_COMPANY_NAME, REPORT_FOOTER_COMPANY, getReportCompanyName } from "@/lib/reportBranding";

interface CashFlowStatement {
  _id?: string;
  companyName?: string;
  period: string;
  sales: number;
  serviceIncome: number;
  interestIncome: number;
  otherIncome: number;
  costOfMaterials: number;
  salaries: number;
  rent: number;
  utilities: number;
  financeCost: number;
  depreciation: number;
  amortization: number;
  otherExpenses: number;
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  status: "positive" | "negative" | "neutral";
  createdAt: string;
}

const CashFlowStatement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    companyName: DEFAULT_REPORT_COMPANY_NAME,
    period: "",
    sales: "",
    serviceIncome: "",
    interestIncome: "",
    otherIncome: "",
    costOfMaterials: "",
    salaries: "",
    rent: "",
    utilities: "",
    financeCost: "",
    depreciation: "",
    amortization: "",
    otherExpenses: "",
  });

  const [statements, setStatements] = useState<CashFlowStatement[]>([]);
  const [result, setResult] = useState<{
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    status: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cashflow-statement/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStatements(data);
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const calculateCashFlow = async () => {
    if (!formData.period) {
      toast({
        variant: "destructive",
        title: "Missing Period",
        description: "Please enter a period",
      });
      return;
    }

    const sales = parseFloat(formData.sales) || 0;
    const serviceIncome = parseFloat(formData.serviceIncome) || 0;
    const interestIncome = parseFloat(formData.interestIncome) || 0;
    const otherIncome = parseFloat(formData.otherIncome) || 0;
    
    const costOfMaterials = parseFloat(formData.costOfMaterials) || 0;
    const salaries = parseFloat(formData.salaries) || 0;
    const rent = parseFloat(formData.rent) || 0;
    const utilities = parseFloat(formData.utilities) || 0;
    const financeCost = parseFloat(formData.financeCost) || 0;
    const depreciation = parseFloat(formData.depreciation) || 0;
    const amortization = parseFloat(formData.amortization) || 0;
    const otherExpenses = parseFloat(formData.otherExpenses) || 0;

    const totalInflow = sales + serviceIncome + interestIncome + otherIncome;
    const totalOutflow = costOfMaterials + salaries + rent + utilities + financeCost + depreciation + amortization + otherExpenses;
    const netCashFlow = totalInflow - totalOutflow;

    let status = "neutral";
    if (netCashFlow > 0) status = "positive";
    if (netCashFlow < 0) status = "negative";

    setResult({
      totalInflow,
      totalOutflow,
      netCashFlow,
      status
    });

    toast({
      title: "Calculation Complete",
      description: `Net Cash Flow: ₹${netCashFlow.toFixed(2)} (${status})`,
    });

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/cashflow-statement/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: getReportCompanyName(formData.companyName),
          period: formData.period,
          sales,
          serviceIncome,
          interestIncome,
          otherIncome,
          costOfMaterials,
          salaries,
          rent,
          utilities,
          financeCost,
          depreciation,
          amortization,
          otherExpenses,
        }),
      });

      if (response.ok) {
        toast({
          title: "Saved to History",
          description: "Cash flow statement saved successfully to database!",
        });
        fetchStatements();
      } else {
        const error = await response.json();
        console.error("Auto-save failed:", error);
      }
    } catch (error) {
      console.error("Error auto-saving statement:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStatement = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this cash flow statement?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cashflow-statement/delete/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Statement deleted successfully!",
        });
        fetchStatements();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to delete statement",
        });
      }
    } catch (error) {
      console.error("Error deleting statement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete statement",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSlip = (statement?: CashFlowStatement) => {
    let dataToUse: any;

    if (!statement && result) {
      dataToUse = {
        period: formData.period || "Current Statement",
        companyName: formData.companyName,
        sales: parseFloat(formData.sales) || 0,
        serviceIncome: parseFloat(formData.serviceIncome) || 0,
        interestIncome: parseFloat(formData.interestIncome) || 0,
        otherIncome: parseFloat(formData.otherIncome) || 0,
        costOfMaterials: parseFloat(formData.costOfMaterials) || 0,
        salaries: parseFloat(formData.salaries) || 0,
        rent: parseFloat(formData.rent) || 0,
        utilities: parseFloat(formData.utilities) || 0,
        financeCost: parseFloat(formData.financeCost) || 0,
        depreciation: parseFloat(formData.depreciation) || 0,
        amortization: parseFloat(formData.amortization) || 0,
        otherExpenses: parseFloat(formData.otherExpenses) || 0,
        totalInflow: result.totalInflow,
        totalOutflow: result.totalOutflow,
        netCashFlow: result.netCashFlow,
        status: result.status,
        createdAt: new Date().toISOString()
      };
    } else if (statement) {
      dataToUse = statement;
    } else {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No data available to download",
      });
      return;
    }

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
    doc.text(getReportCompanyName(dataToUse.companyName || formData.companyName), pageW / 2, 10, { align: "center" });
    doc.setFontSize(16);
    doc.text("CASH FLOW STATEMENT", pageW / 2, 20, { align: "center" });
    y = 36;

    // Subtitle / Period
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Period: ${dataToUse.period}`, pageW / 2, y, { align: "center" });
    y += 5;
    doc.text(`Date: ${new Date(dataToUse.createdAt).toLocaleDateString('en-IN')}`, pageW / 2, y, { align: "center" });
    y += 10;

    // Inflow rows
    const inflowRows = [
      ["1", "Sales", `Rs. ${(dataToUse.sales || 0).toFixed(2)}`],
      ["2", "Service Income", `Rs. ${(dataToUse.serviceIncome || 0).toFixed(2)}`],
      ["3", "Interest Income", `Rs. ${(dataToUse.interestIncome || 0).toFixed(2)}`],
      ["4", "Other Income", `Rs. ${(dataToUse.otherIncome || 0).toFixed(2)}`]
    ];

    // Outflow rows
    const outflowRows = [
      ["1", "Cost of Materials", `Rs. ${(dataToUse.costOfMaterials || 0).toFixed(2)}`],
      ["2", "Salaries", `Rs. ${(dataToUse.salaries || 0).toFixed(2)}`],
      ["3", "Rent", `Rs. ${(dataToUse.rent || 0).toFixed(2)}`],
      ["4", "Utilities", `Rs. ${(dataToUse.utilities || 0).toFixed(2)}`],
      ["5", "Finance Cost", `Rs. ${(dataToUse.financeCost || 0).toFixed(2)}`],
      ["6", "Depreciation", `Rs. ${(dataToUse.depreciation || 0).toFixed(2)}`],
      ["7", "Amortization", `Rs. ${(dataToUse.amortization || 0).toFixed(2)}`],
      ["8", "Other Expenses", `Rs. ${(dataToUse.otherExpenses || 0).toFixed(2)}`]
    ];

    // 1. Draw Inflows Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(21, 128, 61); // green-700
    doc.text("CASH INFLOWS", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["#", "Category", "Amount"]],
      body: inflowRows,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74] }, // green-600
      margin: { left: margin, right: margin },
      foot: [["", "Total Cash Inflow", `Rs. ${dataToUse.totalInflow.toFixed(2)}`]],
      footStyles: { fillColor: [240, 253, 244], textColor: [21, 128, 61], fontStyle: "bold" }
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // 2. Draw Outflows Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(194, 65, 12); // orange-700
    doc.text("CASH OUTFLOWS", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["#", "Category", "Amount"]],
      body: outflowRows,
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] }, // red-600
      margin: { left: margin, right: margin },
      foot: [["", "Total Cash Outflow", `Rs. ${dataToUse.totalOutflow.toFixed(2)}`]],
      footStyles: { fillColor: [254, 242, 242], textColor: [194, 65, 12], fontStyle: "bold" }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // Summary Section
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("Net Cash Flow", margin + 5, y + 8);
    doc.setTextColor(147, 197, 253);
    doc.text(`Rs. ${dataToUse.netCashFlow.toFixed(2)}`, margin + contentW - 5, y + 8, { align: "right" });
    y += 18;

    // Status box
    const status = dataToUse.status;
    const isPositive = status === 'positive';
    const isNegative = status === 'negative';

    doc.setFillColor(...(isPositive ? ([240, 253, 244] as [number,number,number]) : isNegative ? ([254, 242, 242] as [number,number,number]) : ([248, 250, 252] as [number,number,number])));
    doc.setDrawColor(...(isPositive ? ([22, 163, 74] as [number,number,number]) : isNegative ? ([220, 38, 38] as [number,number,number]) : ([148, 163, 184] as [number,number,number])));
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, contentW, 18, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...(isPositive ? ([22, 163, 74] as [number,number,number]) : isNegative ? ([220, 38, 38] as [number,number,number]) : ([71, 85, 105] as [number,number,number])));
    
    const statusText = isPositive ? "POSITIVE CASH FLOW" : isNegative ? "NEGATIVE CASH FLOW" : "BALANCED CASH FLOW";
    doc.text(statusText, pageW / 2, y + 7, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const adviceText = isPositive 
      ? "Healthy cash position. Consider investment opportunities." 
      : isNegative 
        ? "Monitor expenses closely. Consider cost optimization." 
        : "Cash flow is balanced. Maintain current operations.";
    doc.text(adviceText, pageW / 2, y + 13, { align: "center" });
    y += 26;

    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + contentW, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated by ${REPORT_FOOTER_COMPANY} | Financial Analytics Engine`,
      pageW / 2,
      y,
      { align: "center" }
    );

    doc.save(`CashFlow_Statement_${dataToUse.period.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

    toast({
      title: "PDF Saved",
      description: "Cash flow statement PDF downloaded successfully!",
    });
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
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="rounded-full border border-white/60 bg-white/45 text-slate-700 hover:bg-white/70 hover:text-slate-950"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="liquid-icon flex h-16 w-16 items-center justify-center rounded-[22px]">
              <BarChart3 className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Cash Flow Statement
              </h1>
              <p className="mt-1 text-slate-600 font-medium">
                Generate and track financial cash flows
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 transition-all duration-500 bg-white/40">
            <div className="absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 bg-gradient-to-b from-sky-200/60 to-transparent blur-2xl" />

            <CardHeader className="relative">
              <CardTitle className="text-2xl font-bold text-slate-950 flex items-center gap-3">
                <FileText className="h-6 w-6 text-sky-700" />
                Enter Cash Flow Data
              </CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                Input your company's inflow and outflow details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-[24px] bg-white/60 border border-white/80 shadow-sm">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-700 font-semibold">Enter Your Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period" className="text-slate-700 font-semibold">Period</Label>
                  <div className="relative flex items-center gap-2">
                    <Input
                      id="period"
                      type="text"
                      placeholder="e.g., Q1 2026 or February 2026"
                      value={formData.period}
                      onChange={(e) => handleInputChange("period", e.target.value)}
                      className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleInputChange("period", text)}
                      onClear={() => handleInputChange("period", "")}
                    />
                  </div>
                </div>
              </div>

              {/* Inflow Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-white/60 border border-white/80 shadow-sm backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">💰 Cash Inflows</h3>
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
                        value={formData[field as keyof typeof formData]}
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

              {/* Outflow Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-orange-50/60 border border-orange-100 shadow-sm backdrop-blur-xl">
                <h3 className="text-lg font-bold text-slate-900 border-b border-orange-100/30 pb-2">💸 Cash Outflows</h3>
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
                        value={formData[field as keyof typeof formData]}
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

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={calculateCashFlow}
                  disabled={loading}
                  className="w-full h-14 rounded-full bg-slate-950 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  {loading ? "Calculating & Saving..." : "Calculate Net Cash Flow"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Column */}
          <div className="space-y-8">
            {/* Results Display */}
            {result && (
              <Card className="liquid-panel relative overflow-hidden rounded-[36px] border-white/55 p-8 bg-white/40 animate-in fade-in duration-700">
                <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-bold text-slate-950">Statement Summary</CardTitle>
                  <CardDescription className="text-slate-600 mt-1">
                    Cash flow results for period: <span className="font-bold text-slate-800">{formData.period || "current"}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/70 border border-slate-200">
                      <p className="text-slate-500 font-medium mb-1">Total Inflow</p>
                      <p className="text-xl font-bold text-emerald-600">₹{result.totalInflow.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/70 border border-slate-200">
                      <p className="text-slate-500 font-medium mb-1">Total Outflow</p>
                      <p className="text-xl font-bold text-rose-600">₹{result.totalOutflow.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 text-white flex justify-between items-center shadow-lg">
                    <div>
                      <p className="text-slate-400 font-medium">Net Cash Flow</p>
                      <p className="text-3xl font-black mt-1">₹{result.netCashFlow.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Status</span>
                      <Badge className={`border-0 rounded-xl px-3 py-1 font-semibold ${
                        result.status === 'positive' 
                          ? 'bg-emerald-500 text-white' 
                          : result.status === 'negative' 
                            ? 'bg-rose-500 text-white' 
                            : 'bg-slate-500 text-white'
                      }`}>
                        {result.status}
                      </Badge>
                    </div>
                  </div>

                  <Button onClick={() => downloadSlip()} className="group rounded-full bg-slate-950 font-semibold text-white w-full py-4 shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800">
                    <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" /> Download Statement
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* History Card */}
            <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 bg-white/40">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-950">Statements History</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto p-6">
                {statements.length === 0 ? (
                  <div className="text-center py-16 text-slate-500">
                    <Database className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-800 text-lg font-medium">No statements generated yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {statements.map((stmt) => (
                      <Card key={stmt._id} className="liquid-panel overflow-hidden rounded-[24px] border-white/60 bg-white/50 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-800 font-bold text-lg">{stmt.period}</span>
                          <span className={`font-black text-lg ${
                            stmt.status === 'positive' 
                              ? 'text-emerald-600' 
                              : stmt.status === 'negative' 
                                ? 'text-rose-600' 
                                : 'text-slate-600'
                          }`}>
                            ₹{(stmt.netCashFlow || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 p-2 bg-white/70 rounded-xl border border-slate-100">
                          <div>Inflow: <span className="text-emerald-600 font-bold">₹{(stmt.totalInflow || 0).toFixed(2)}</span></div>
                          <div>Outflow: <span className="text-rose-600 font-bold">₹{(stmt.totalOutflow || 0).toFixed(2)}</span></div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => downloadSlip(stmt)} size="sm" className="flex-1 rounded-full bg-slate-950 text-white hover:bg-slate-800">
                            <Download className="h-3 w-3 mr-2" /> Download
                          </Button>
                          <Button onClick={() => stmt._id && deleteStatement(stmt._id)} size="sm" variant="outline" className="rounded-full border-red-200 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 text-center pb-8">
            <p className="text-slate-500 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/40">
                Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED ✨
            </p>
        </div>
      </main>
    </div>
  );
};

export default CashFlowStatement;
