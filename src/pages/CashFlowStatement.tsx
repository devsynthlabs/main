import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, TrendingUp, TrendingDown, FileText, BarChart3, Code2, FileCode, Plus, Trash2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Existing dynamic item interface
interface CashFlowItem {
  description: string;
  amount: string;
  category: string;
}

// New requirement-style interface
interface SimpleCashFlowStatement {
  _id?: string;
  period: string;
  inflowText: string;
  outflowText: string;
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  status: "positive" | "negative" | "neutral";
  createdAt: string;
}

interface CashFlowStatement {
  _id?: string;
  period: string;
  inflowItems: CashFlowItem[];
  outflowItems: CashFlowItem[];
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  status: "positive" | "negative" | "neutral";
  createdAt: string;
}

const CashFlowStatement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputMode, setInputMode] = useState<"dynamic" | "simple">("dynamic");

  // Dynamic mode state (original)
  const [formData, setFormData] = useState({ period: "" });
  const [inflowItems, setInflowItems] = useState<CashFlowItem[]>([
    { description: "", amount: "", category: "Revenue" }
  ]);
  const [outflowItems, setOutflowItems] = useState<CashFlowItem[]>([
    { description: "", amount: "", category: "Expense" }
  ]);
  const [statements, setStatements] = useState<CashFlowStatement[]>([]);
  const [result, setResult] = useState<{
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    status: string;
  } | null>(null);

  // Simple mode state (requirement)
  const [simpleFormData, setSimpleFormData] = useState({
    period: "",
    inflowText: "",
    outflowText: ""
  });
  const [simpleResult, setSimpleResult] = useState<{
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    status: string;
  } | null>(null);
  const [simpleStatements, setSimpleStatements] = useState<SimpleCashFlowStatement[]>([]);

  const [loading, setLoading] = useState(false);

  // Fetch existing statements for both modes
  useEffect(() => {
    fetchStatements();
    fetchSimpleStatements();
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

  const fetchSimpleStatements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cashflow-statement/simple/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSimpleStatements(data);
      }
    } catch (error) {
      console.error("Error fetching simple statements:", error);
    }
  };

  // ========== REQUIREMENT-STYLE PARSE FUNCTION ==========
  const parseCashItems = (text: string): number => {
    let total = 0;
    const lines = text.trim().split('\n');
    for (const line of lines) {
      try {
        if (line.includes(':')) {
          const value = parseFloat(line.split(':')[1].trim());
          if (!isNaN(value)) {
            total += value;
          }
        }
      } catch (e) {
        // Skip lines that cannot be parsed
      }
    }
    return total;
  };

  // ========== SIMPLE MODE (REQUIREMENT STYLE) ==========
  const handleSimpleInputChange = (field: string, value: string) => {
    setSimpleFormData(prev => ({ ...prev, [field]: value }));
    setSimpleResult(null);
  };

  const calculateSimpleCashFlow = () => {
    const inflowTotal = parseCashItems(simpleFormData.inflowText);
    const outflowTotal = parseCashItems(simpleFormData.outflowText);
    const netCashFlow = inflowTotal - outflowTotal;

    let status = "neutral";
    if (netCashFlow > 0) status = "positive";
    if (netCashFlow < 0) status = "negative";

    setSimpleResult({
      totalInflow: inflowTotal,
      totalOutflow: outflowTotal,
      netCashFlow,
      status
    });

    toast({
      title: "Calculation Complete",
      description: `Net Cash Flow: ₹${netCashFlow.toFixed(2)} (${status})`,
    });
  };

  const saveSimpleStatement = async () => {
    if (!simpleFormData.period) {
      toast({
        variant: "destructive",
        title: "Missing Period",
        description: "Please enter a period",
      });
      return;
    }

    if (!simpleFormData.inflowText || !simpleFormData.outflowText) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Please enter inflow and outflow items",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cashflow-statement/simple/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period: simpleFormData.period,
          inflowText: simpleFormData.inflowText,
          outflowText: simpleFormData.outflowText,
          totalInflow: simpleResult?.totalInflow || parseCashItems(simpleFormData.inflowText),
          totalOutflow: simpleResult?.totalOutflow || parseCashItems(simpleFormData.outflowText),
          netCashFlow: simpleResult?.netCashFlow || (parseCashItems(simpleFormData.inflowText) - parseCashItems(simpleFormData.outflowText)),
          status: simpleResult?.status || "neutral"
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Cash flow statement saved successfully!",
        });
        setSimpleFormData({ period: "", inflowText: "", outflowText: "" });
        setSimpleResult(null);
        fetchSimpleStatements();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save statement",
        });
      }
    } catch (error) {
      console.error("Error saving statement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save statement",
      });
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

  const deleteSimpleStatement = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this cash flow statement?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/cashflow-statement/simple/delete/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Statement deleted successfully!",
        });
        fetchSimpleStatements();
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

  // ========== DYNAMIC MODE (ORIGINAL) ==========
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const handleInflowItemChange = (index: number, field: keyof CashFlowItem, value: string) => {
    const updatedItems = [...inflowItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInflowItems(updatedItems);
    setResult(null);
  };

  const handleOutflowItemChange = (index: number, field: keyof CashFlowItem, value: string) => {
    const updatedItems = [...outflowItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOutflowItems(updatedItems);
    setResult(null);
  };

  const addInflowItem = () => {
    setInflowItems([...inflowItems, { description: "", amount: "", category: "Revenue" }]);
    setResult(null);
  };

  const addOutflowItem = () => {
    setOutflowItems([...outflowItems, { description: "", amount: "", category: "Expense" }]);
    setResult(null);
  };

  const removeInflowItem = (index: number) => {
    if (inflowItems.length > 1) {
      setInflowItems(inflowItems.filter((_, i) => i !== index));
      setResult(null);
    }
  };

  const removeOutflowItem = (index: number) => {
    if (outflowItems.length > 1) {
      setOutflowItems(outflowItems.filter((_, i) => i !== index));
      setResult(null);
    }
  };

  const calculateDynamicCashFlow = () => {
    const validInflowItems = inflowItems.filter(item => item.description && item.amount);
    const validOutflowItems = outflowItems.filter(item => item.description && item.amount);

    if (validInflowItems.length === 0 || validOutflowItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Data",
        description: "Please add at least one inflow and one outflow item",
      });
      return;
    }

    const totalInflow = validInflowItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalOutflow = validOutflowItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const netCashFlow = totalInflow - totalOutflow;

    let status = "neutral";
    if (netCashFlow > 0) status = "positive";
    if (netCashFlow < 0) status = "negative";

    setResult({ totalInflow, totalOutflow, netCashFlow, status });

    toast({
      title: "Calculation Complete",
      description: `Net Cash Flow: ₹${netCashFlow.toFixed(2)} (${status})`,
    });
  };

  const saveDynamicStatement = async () => {
    if (!formData.period) {
      toast({
        variant: "destructive",
        title: "Missing Period",
        description: "Please enter a period",
      });
      return;
    }

    const validInflowItems = inflowItems.filter(item => item.description && item.amount);
    const validOutflowItems = outflowItems.filter(item => item.description && item.amount);

    if (validInflowItems.length === 0 || validOutflowItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Data",
        description: "Please add at least one inflow and one outflow item",
      });
      return;
    }

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
          period: formData.period,
          inflowItems: validInflowItems.map(item => ({
            ...item,
            amount: parseFloat(item.amount)
          })),
          outflowItems: validOutflowItems.map(item => ({
            ...item,
            amount: parseFloat(item.amount)
          }))
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Cash flow statement saved successfully!",
        });
        setFormData({ period: "" });
        setInflowItems([{ description: "", amount: "", category: "Revenue" }]);
        setOutflowItems([{ description: "", amount: "", category: "Expense" }]);
        setResult(null);
        fetchStatements();
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save statement",
        });
      }
    } catch (error) {
      console.error("Error saving statement:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save statement",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSlip = (statement?: CashFlowStatement | SimpleCashFlowStatement, isSimple?: boolean) => {
    let dataToUse: any;

    if (isSimple && statement) {
      const simpleStmt = statement as SimpleCashFlowStatement;
      dataToUse = {
        period: simpleStmt.period,
        inflowText: simpleStmt.inflowText,
        outflowText: simpleStmt.outflowText,
        totalInflow: simpleStmt.totalInflow,
        totalOutflow: simpleStmt.totalOutflow,
        netCashFlow: simpleStmt.netCashFlow,
        status: simpleStmt.status,
        createdAt: simpleStmt.createdAt
      };
    } else if (!isSimple && result) {
      dataToUse = {
        period: formData.period || "Current Statement",
        inflowItems: inflowItems.filter(item => item.description && item.amount),
        outflowItems: outflowItems.filter(item => item.description && item.amount),
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
    doc.text("SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED", pageW / 2, 10, { align: "center" });
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

    // helper to prepare table data for inflows and outflows
    const getInflowRows = () => {
      if (isSimple) {
        if (!dataToUse.inflowText) return [];
        return dataToUse.inflowText.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => {
          const [desc, amt] = line.split(':');
          return [
            (i + 1).toString(),
            desc?.trim() || "Inflow Item",
            "Inflow",
            `Rs. ${(parseFloat(amt) || 0).toFixed(2)}`
          ];
        });
      } else {
        return (dataToUse.inflowItems || []).map((item: any, i: number) => [
          (i + 1).toString(),
          item.description || "Inflow Item",
          item.category || "Inflow",
          `Rs. ${(parseFloat(item.amount) || 0).toFixed(2)}`
        ]);
      }
    };

    const getOutflowRows = () => {
      if (isSimple) {
        if (!dataToUse.outflowText) return [];
        return dataToUse.outflowText.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => {
          const [desc, amt] = line.split(':');
          return [
            (i + 1).toString(),
            desc?.trim() || "Outflow Item",
            "Outflow",
            `Rs. ${(parseFloat(amt) || 0).toFixed(2)}`
          ];
        });
      } else {
        return (dataToUse.outflowItems || []).map((item: any, i: number) => [
          (i + 1).toString(),
          item.description || "Outflow Item",
          item.category || "Outflow",
          `Rs. ${(parseFloat(item.amount) || 0).toFixed(2)}`
        ]);
      }
    };

    // 1. Draw Inflows Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(21, 128, 61); // green-700
    doc.text("CASH INFLOWS", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["#", "Description", "Category", "Amount"]],
      body: getInflowRows(),
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74] }, // green-600
      margin: { left: margin, right: margin },
      foot: [["", "Total Cash Inflow", "", `Rs. ${dataToUse.totalInflow.toFixed(2)}`]],
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
      head: [["#", "Description", "Category", "Amount"]],
      body: getOutflowRows(),
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] }, // red-600
      margin: { left: margin, right: margin },
      foot: [["", "Total Cash Outflow", "", `Rs. ${dataToUse.totalOutflow.toFixed(2)}`]],
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
      "Generated by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED  |  Financial Analytics Engine",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive": return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "negative": return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive": return "text-emerald-600 font-bold";
      case "negative": return "text-rose-600 font-bold";
      default: return "text-slate-600 font-bold";
    }
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

            <div className="flex gap-2">
              <Button
                onClick={() => setInputMode("dynamic")}
                className={`rounded-full px-5 py-2 font-semibold transition-all duration-300 ${
                  inputMode === "dynamic"
                    ? "bg-slate-950 text-white"
                    : "border border-white/60 bg-white/45 text-slate-700 hover:bg-white/75"
                }`}
              >
                <Code2 className="mr-2 h-4 w-4" />
                Dynamic Mode
              </Button>
              <Button
                onClick={() => setInputMode("simple")}
                className={`rounded-full px-5 py-2 font-semibold transition-all duration-300 ${
                  inputMode === "simple"
                    ? "bg-slate-950 text-white"
                    : "border border-white/60 bg-white/45 text-slate-700 hover:bg-white/75"
                }`}
              >
                <FileCode className="mr-2 h-4 w-4" />
                Simple Textarea Mode
              </Button>
            </div>
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
        {inputMode === "dynamic" ? (
          // ========== DYNAMIC MODE (ORIGINAL) ==========
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 transition-all duration-500 bg-white/40">
              <div className="absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 bg-gradient-to-b from-sky-200/60 to-transparent blur-2xl" />

              <CardHeader className="relative">
                <CardTitle className="text-2xl font-bold text-slate-950 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-sky-700" />
                  Create Cash Flow Statement (Dynamic)
                </CardTitle>
                <CardDescription className="text-slate-600 mt-1">
                  Add/remove items with description, amount, and category
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-8">
                <div className="space-y-3 group">
                  <Label className="font-semibold text-slate-700 text-lg">Period</Label>
                  <div className="relative flex items-center gap-2">
                    <Input
                      placeholder="e.g., January 2024"
                      value={formData.period}
                      onChange={(e) => handleInputChange("period", e.target.value)}
                      className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleInputChange("period", text)}
                      onClear={() => handleInputChange("period", "")}
                    />
                  </div>
                </div>

                {/* Inflow Items */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-slate-700 text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      Cash Inflows
                    </Label>
                    <Button onClick={addInflowItem} className="rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  {inflowItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 flex gap-2 items-center">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleInflowItemChange(index, 'description', e.target.value)}
                          className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                        />
                        <VoiceButton
                          onTranscript={(text) => handleInflowItemChange(index, 'description', text)}
                          onClear={() => handleInflowItemChange(index, 'description', "")}
                        />
                      </div>
                      <div className="col-span-3 flex gap-2 items-center">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => handleInflowItemChange(index, 'amount', e.target.value)}
                          className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                        />
                        <VoiceButton
                          onTranscript={(text) => handleInflowItemChange(index, 'amount', text)}
                          onClear={() => handleInflowItemChange(index, 'amount', "")}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="Category"
                          value={item.category}
                          onChange={(e) => handleInflowItemChange(index, 'category', e.target.value)}
                          className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInflowItem(index)}
                          className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                          disabled={inflowItems.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Outflow Items */}
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-slate-700 text-lg flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-rose-600" />
                      Cash Outflows
                    </Label>
                    <Button onClick={addOutflowItem} className="rounded-full bg-slate-950 hover:bg-slate-800 text-white font-medium" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                  {outflowItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5 flex gap-2 items-center">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleOutflowItemChange(index, 'description', e.target.value)}
                          className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                        />
                        <VoiceButton
                          onTranscript={(text) => handleOutflowItemChange(index, 'description', text)}
                          onClear={() => handleOutflowItemChange(index, 'description', "")}
                        />
                      </div>
                      <div className="col-span-3 flex gap-2 items-center">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={(e) => handleOutflowItemChange(index, 'amount', e.target.value)}
                          className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                        />
                        <VoiceButton
                          onTranscript={(text) => handleOutflowItemChange(index, 'amount', text)}
                          onClear={() => handleOutflowItemChange(index, 'amount', "")}
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="Category"
                          value={item.category}
                          onChange={(e) => handleOutflowItemChange(index, 'category', e.target.value)}
                          className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOutflowItem(index)}
                          className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                          disabled={outflowItems.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={calculateDynamicCashFlow}
                    className="h-14 flex-1 rounded-full bg-slate-950 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Calculate Net Cash Flow
                  </Button>
                  <Button
                    onClick={saveDynamicStatement}
                    disabled={loading}
                    className="h-14 px-8 rounded-full bg-sky-700 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Save to DB
                  </Button>
                </div>
              </CardContent>
            </Card>

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

              {/* Dynamic History */}
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
                              ₹{stmt.netCashFlow.toFixed(2)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 p-2 bg-white/70 rounded-xl border border-slate-100">
                            <div>Inflow: <span className="text-emerald-600 font-bold">₹{stmt.totalInflow.toFixed(2)}</span></div>
                            <div>Outflow: <span className="text-rose-600 font-bold">₹{stmt.totalOutflow.toFixed(2)}</span></div>
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
        ) : (
          // ========== SIMPLE TEXTAREA MODE ==========
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 transition-all duration-500 bg-white/40">
              <div className="absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 bg-gradient-to-b from-sky-200/60 to-transparent blur-2xl" />

              <CardHeader className="relative">
                <CardTitle className="text-2xl font-bold text-slate-950 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-sky-700" />
                  Simple Cash Flow (Textarea)
                </CardTitle>
                <CardDescription className="text-slate-600 mt-1">
                  Format: Item Name: Amount (one per line)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="font-semibold text-slate-700 text-lg">Period</Label>
                  <div className="relative flex items-center gap-2">
                    <Input
                      placeholder="e.g., February 2024"
                      value={simpleFormData.period}
                      onChange={(e) => handleSimpleInputChange("period", e.target.value)}
                      className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleSimpleInputChange("period", text)}
                      onClear={() => handleSimpleInputChange("period", "")}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-slate-700 text-lg">Cash Inflows</Label>
                  <div className="relative flex items-stretch gap-2">
                    <textarea
                      placeholder="Sales: 50000&#10;Consulting: 25000"
                      value={simpleFormData.inflowText}
                      onChange={(e) => handleSimpleInputChange("inflowText", e.target.value)}
                      rows={5}
                      className="w-full rounded-[18px] border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 p-4 focus:outline-none focus:border-slate-300 focus:ring-0 transition-all duration-300"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleSimpleInputChange("inflowText", simpleFormData.inflowText + "\n" + text)}
                      onClear={() => handleSimpleInputChange("inflowText", "")}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="font-semibold text-slate-700 text-lg">Cash Outflows</Label>
                  <div className="relative flex items-stretch gap-2">
                    <textarea
                      placeholder="Rent: 15000&#10;Salaries: 30000"
                      value={simpleFormData.outflowText}
                      onChange={(e) => handleSimpleInputChange("outflowText", e.target.value)}
                      rows={5}
                      className="w-full rounded-[18px] border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 p-4 focus:outline-none focus:border-slate-300 focus:ring-0 transition-all duration-300"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleSimpleInputChange("outflowText", simpleFormData.outflowText + "\n" + text)}
                      onClear={() => handleSimpleInputChange("outflowText", "")}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={calculateSimpleCashFlow}
                    className="h-14 flex-1 rounded-full bg-slate-950 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Calculate Net Cash Flow
                  </Button>
                  <Button
                    onClick={saveSimpleStatement}
                    disabled={loading}
                    className="h-14 px-8 rounded-full bg-sky-700 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600"
                  >
                    Save to DB
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {simpleResult && (
                <Card className="liquid-panel relative overflow-hidden rounded-[36px] border-white/55 p-8 bg-white/40 animate-in fade-in duration-700">
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

                  <CardHeader className="relative">
                    <CardTitle className="text-2xl font-bold text-slate-950">Simple Statement Summary</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">
                      Results parsed from text input
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/70 border border-slate-200">
                        <p className="text-slate-500 font-medium mb-1">Calculated Inflow</p>
                        <p className="text-xl font-bold text-emerald-600">₹{simpleResult.totalInflow.toFixed(2)}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/70 border border-slate-200">
                        <p className="text-slate-500 font-medium mb-1">Calculated Outflow</p>
                        <p className="text-xl font-bold text-rose-600">₹{simpleResult.totalOutflow.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-950 text-white flex justify-between items-center shadow-lg">
                      <div>
                        <p className="text-slate-400 font-medium">Net Cash Flow</p>
                        <p className="text-3xl font-black mt-1">₹{simpleResult.netCashFlow.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Status</span>
                        <Badge className={`border-0 rounded-xl px-3 py-1 font-semibold ${
                          simpleResult.status === 'positive' 
                            ? 'bg-emerald-500 text-white' 
                            : simpleResult.status === 'negative' 
                              ? 'bg-rose-500 text-white' 
                              : 'bg-slate-500 text-white'
                        }`}>
                          {simpleResult.status}
                        </Badge>
                      </div>
                    </div>

                    <Button onClick={() => downloadSlip({
                      period: simpleFormData.period,
                      inflowText: simpleFormData.inflowText,
                      outflowText: simpleFormData.outflowText,
                      totalInflow: simpleResult.totalInflow,
                      totalOutflow: simpleResult.totalOutflow,
                      netCashFlow: simpleResult.netCashFlow,
                      status: simpleResult.status,
                      createdAt: new Date().toISOString()
                    } as SimpleCashFlowStatement, true)} className="group rounded-full bg-slate-950 font-semibold text-white w-full py-4 shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800">
                      <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" /> Download Statement
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 bg-white/40">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-950">Simple Mode History</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto p-6">
                  {simpleStatements.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                      <Database className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-pulse" />
                      <p className="text-slate-800 text-lg font-medium">No simple statements generated yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {simpleStatements.map((stmt) => (
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
                              ₹{stmt.netCashFlow.toFixed(2)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 p-2 bg-white/70 rounded-xl border border-slate-100">
                            <div>Inflow: <span className="text-emerald-600 font-bold">₹{stmt.totalInflow.toFixed(2)}</span></div>
                            <div>Outflow: <span className="text-rose-600 font-bold">₹{stmt.totalOutflow.toFixed(2)}</span></div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => downloadSlip(stmt, true)} size="sm" className="flex-1 rounded-full bg-slate-950 text-white hover:bg-slate-800">
                              <Download className="h-3 w-3 mr-2" /> Download
                            </Button>
                            <Button onClick={() => stmt._id && deleteSimpleStatement(stmt._id)} size="sm" variant="outline" className="rounded-full border-red-200 text-red-600 hover:bg-red-50">
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
        )}
      </main>
    </div>
  );
};

export default CashFlowStatement;