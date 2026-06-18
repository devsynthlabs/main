import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, TrendingUp, TrendingDown, FileText, BarChart3, Code2, FileCode, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive": return "text-green-400";
      case "negative": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 text-blue-200 hover:text-blue-100 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Cash Flow Statement
                </h1>
                <p className="text-blue-200/80 font-medium mt-1">
                  Dynamic mode or Simple textarea mode (from requirement)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setInputMode("dynamic")}
                variant={inputMode === "dynamic" ? "default" : "outline"}
                className={inputMode === "dynamic" ? "bg-blue-600" : "border-blue-400/40 text-blue-300"}
              >
                <Code2 className="mr-2 h-4 w-4" />
                Dynamic Mode
              </Button>
              <Button
                onClick={() => setInputMode("simple")}
                variant={inputMode === "simple" ? "default" : "outline"}
                className={inputMode === "simple" ? "bg-cyan-600" : "border-blue-400/40 text-blue-300"}
              >
                <FileCode className="mr-2 h-4 w-4" />
                Simple Textarea Mode
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {inputMode === "dynamic" ? (
          // ========== DYNAMIC MODE (ORIGINAL) ==========
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  Create Cash Flow Statement (Dynamic)
                </CardTitle>
                <CardDescription className="text-blue-200/70">
                  Add/remove items with description, amount, and category
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-blue-100 font-bold">Period</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g., January 2024"
                      value={formData.period}
                      onChange={(e) => handleInputChange("period", e.target.value)}
                      className="bg-white/5 text-blue-100 border border-blue-400/30 rounded-xl h-12"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleInputChange("period", text)}
                      onClear={() => handleInputChange("period", "")}
                    />
                  </div>
                </div>

                {/* Inflow Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-blue-100 font-bold text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      Cash Inflows
                    </Label>
                    <Button onClick={addInflowItem} className="bg-green-600 hover:bg-green-700" size="sm">
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
                          className="bg-white/5 border-blue-400/30 text-blue-100"
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
                          className="bg-white/5 border-blue-400/30 text-blue-100"
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
                          className="bg-white/5 border-blue-400/30 text-blue-100"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button variant="destructive" size="sm" onClick={() => removeInflowItem(index)} disabled={inflowItems.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Outflow Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-blue-100 font-bold text-lg flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-red-400" />
                      Cash Outflows
                    </Label>
                    <Button onClick={addOutflowItem} className="bg-red-600 hover:bg-red-700" size="sm">
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
                          className="bg-white/5 border-blue-400/30 text-blue-100"
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
                          className="bg-white/5 border-blue-400/30 text-blue-100"
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
                          className="bg-white/5 border-blue-400/30 text-blue-100"
                        />
                      </div>
                      <div className="col-span-1">
                        <Button variant="destructive" size="sm" onClick={() => removeOutflowItem(index)} disabled={outflowItems.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={calculateDynamicCashFlow} className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-orange-600">
                    Calculate Cash Flow
                  </Button>
                  <Button onClick={saveDynamicStatement} disabled={loading || !result} className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700">
                    {loading ? "Saving..." : "Save Statement"}
                  </Button>
                </div>

                {result && (
                  <div className="pt-4">
                    <Button onClick={() => downloadSlip()} className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                      <Download className="h-5 w-5 mr-2" /> Download Statement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Result & History for Dynamic Mode */}
            <div className="space-y-8">
              {result && (
                <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-blue-100">Calculation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {/* Total Inflow box */}
                      <div className="flex justify-between items-center p-4 bg-white/5 border border-blue-400/20 rounded-2xl h-16">
                        <span className="text-blue-100 font-bold text-lg">Total Cash Inflow:</span>
                        <span className="text-green-400 font-bold text-2xl">₹{result.totalInflow.toFixed(2)}</span>
                      </div>
                      
                      {/* Total Outflow box */}
                      <div className="flex justify-between items-center p-4 bg-white/5 border border-blue-400/20 rounded-2xl h-16">
                        <span className="text-blue-100 font-bold text-lg">Total Cash Outflow:</span>
                        <span className="text-red-400 font-bold text-2xl">₹{result.totalOutflow.toFixed(2)}</span>
                      </div>
                      
                      {/* Net Cash Flow box */}
                      <div className="flex justify-between items-center p-4 bg-white/5 border border-cyan-400/40 rounded-2xl h-16">
                        <span className="text-blue-100 font-bold text-lg">Net Cash Flow:</span>
                        <span className={`font-bold text-2xl ${getStatusColor(result.status)} flex items-center gap-2`}>
                          {getStatusIcon(result.status)} ₹{result.netCashFlow.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Centered Status Box matched with green/red theme borders */}
                    <div className={`mt-6 p-6 rounded-2xl border text-center ${
                      result.status === 'positive' 
                        ? 'bg-green-950/40 border-green-500/50 text-green-200' 
                        : result.status === 'negative' 
                          ? 'bg-red-950/40 border-red-500/50 text-red-200' 
                          : 'bg-slate-900/40 border-slate-500/50 text-slate-200'
                    }`}>
                      <h3 className="text-xl font-bold flex items-center justify-center gap-2 mb-2">
                        {result.status === 'positive' && <span className="text-green-400">✅</span>}
                        {result.status === 'negative' && <span className="text-red-400">⚠️</span>}
                        {result.status === 'positive' ? 'Positive Cash Flow' : result.status === 'negative' ? 'Negative Cash Flow' : 'Balanced Cash Flow'}
                      </h3>
                      <p className="text-sm text-blue-200/60 font-medium">
                        {result.status === 'positive' 
                          ? 'Healthy cash position. Consider investment opportunities.' 
                          : result.status === 'negative' 
                            ? 'Monitor expenses closely. Consider cost optimization.' 
                            : 'Cash flow is balanced. Maintain current operations.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

              )}

              <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-blue-100">Statement History</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto p-6">
                  {statements.length === 0 ? (
                    <div className="text-center py-8 text-blue-300/60">No statements yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {statements.map((stmt) => (
                        <div key={stmt._id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-cyan-400 font-bold">{stmt.period}</span>
                            <span className={`font-bold ${getStatusColor(stmt.status)}`}>₹{stmt.netCashFlow.toFixed(2)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-blue-200/80 mb-3 p-2 bg-white/5 rounded-lg border border-blue-400/10">
                            <div>Inflow: <span className="text-green-400 font-bold">₹{stmt.totalInflow.toFixed(2)}</span></div>
                            <div>Outflow: <span className="text-red-400 font-bold">₹{stmt.totalOutflow.toFixed(2)}</span></div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => downloadSlip(stmt, false)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                              <Download className="h-3 w-3 mr-2" /> Download
                            </Button>
                            <Button onClick={() => stmt._id && deleteStatement(stmt._id)} size="sm" variant="destructive" className="px-3">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // ========== SIMPLE MODE (REQUIREMENT STYLE) ==========
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                  <FileCode className="h-6 w-6 text-cyan-400" />
                  Cash Flow Statement (Simple Mode)
                </CardTitle>
                <CardDescription className="text-blue-200/70">
                  Enter items as "description:amount" (one per line) - from requirement
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Label className="text-blue-100 font-bold">Period</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g., January 2024, Q1 2024"
                      value={simpleFormData.period}
                      onChange={(e) => handleSimpleInputChange("period", e.target.value)}
                      className="bg-white/5 text-blue-100 border border-blue-400/30 rounded-xl h-12"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleSimpleInputChange("period", text)}
                      onClear={() => handleSimpleInputChange("period", "")}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-blue-100 font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Cash Inflows
                  </Label>
                  <div className="flex gap-2">
                    <textarea
                      value={simpleFormData.inflowText}
                      onChange={(e) => handleSimpleInputChange("inflowText", e.target.value)}
                      placeholder="Example:
Sales:300000
bank interest:2000
service income:5000
other income:0"
                      className="w-full h-40 bg-white/5 text-blue-100 border border-blue-400/30 rounded-xl p-3 font-mono text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleSimpleInputChange("inflowText", text)}
                      onClear={() => handleSimpleInputChange("inflowText", "")}
                    />
                  </div>
                  <p className="text-xs text-blue-300/60">Format: description:amount (one per line)</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-blue-100 font-bold flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-400" />
                    Cash Outflows
                  </Label>
                  <div className="flex gap-2">
                    <textarea
                      value={simpleFormData.outflowText}
                      onChange={(e) => handleSimpleInputChange("outflowText", e.target.value)}
                      placeholder="Example:
Cost of Materials:25000
Employee gross salary:125000
Rent:10000
Electricity:5000"
                      className="w-full h-40 bg-white/5 text-blue-100 border border-blue-400/30 rounded-xl p-3 font-mono text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                    />
                    <VoiceButton
                      onTranscript={(text) => handleSimpleInputChange("outflowText", text)}
                      onClear={() => handleSimpleInputChange("outflowText", "")}
                    />
                  </div>
                  <p className="text-xs text-blue-300/60">Format: description:amount (one per line)</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={calculateSimpleCashFlow} className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-orange-600">
                    Calculate Net Cashflow
                  </Button>
                  <Button onClick={saveSimpleStatement} disabled={loading || !simpleResult} className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700">
                    {loading ? "Saving..." : "Save Statement"}
                  </Button>
                </div>

              </CardContent>
            </Card>

            {/* Result & History for Simple Mode */}
            <div className="space-y-8">
              {simpleResult && (
                <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-blue-100">Calculation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {/* Total Inflow box */}
                      <div className="flex justify-between items-center p-4 bg-white/5 border border-blue-400/20 rounded-2xl h-16">
                        <span className="text-blue-100 font-bold text-lg">Total Cash Inflow:</span>
                        <span className="text-green-400 font-bold text-2xl">₹{simpleResult.totalInflow.toFixed(2)}</span>
                      </div>
                      
                      {/* Total Outflow box */}
                      <div className="flex justify-between items-center p-4 bg-white/5 border border-blue-400/20 rounded-2xl h-16">
                        <span className="text-blue-100 font-bold text-lg">Total Cash Outflow:</span>
                        <span className="text-red-400 font-bold text-2xl">₹{simpleResult.totalOutflow.toFixed(2)}</span>
                      </div>
                      
                      {/* Net Cash Flow box */}
                      <div className="flex justify-between items-center p-4 bg-white/5 border border-cyan-400/40 rounded-2xl h-16">
                        <span className="text-blue-100 font-bold text-lg">Net Cash Flow:</span>
                        <span className={`font-bold text-2xl ${getStatusColor(simpleResult.status)} flex items-center gap-2`}>
                          {getStatusIcon(simpleResult.status)} ₹{simpleResult.netCashFlow.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Centered Status Box matched with green/red theme borders */}
                    <div className={`mt-6 p-6 rounded-2xl border text-center ${
                      simpleResult.status === 'positive' 
                        ? 'bg-green-950/40 border-green-500/50 text-green-200' 
                        : simpleResult.status === 'negative' 
                          ? 'bg-red-950/40 border-red-500/50 text-red-200' 
                          : 'bg-slate-900/40 border-slate-500/50 text-slate-200'
                    }`}>
                      <h3 className="text-xl font-bold flex items-center justify-center gap-2 mb-2">
                        {simpleResult.status === 'positive' && <span className="text-green-400">✅</span>}
                        {simpleResult.status === 'negative' && <span className="text-red-400">⚠️</span>}
                        {simpleResult.status === 'positive' ? 'Positive Cash Flow' : simpleResult.status === 'negative' ? 'Negative Cash Flow' : 'Balanced Cash Flow'}
                      </h3>
                      <p className="text-sm text-blue-200/60 font-medium">
                        {simpleResult.status === 'positive' 
                          ? 'Healthy cash position. Consider investment opportunities.' 
                          : simpleResult.status === 'negative' 
                            ? 'Monitor expenses closely. Consider cost optimization.' 
                            : 'Cash flow is balanced. Maintain current operations.'}
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={() => downloadSlip({
                        period: simpleFormData.period,
                        inflowText: simpleFormData.inflowText,
                        outflowText: simpleFormData.outflowText,
                        totalInflow: simpleResult.totalInflow,
                        totalOutflow: simpleResult.totalOutflow,
                        netCashFlow: simpleResult.netCashFlow,
                        status: simpleResult.status,
                        createdAt: new Date().toISOString()
                      } as SimpleCashFlowStatement, true)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                        <Download className="h-5 w-5 mr-2" /> Download Statement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-blue-100">Simple Mode History</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto p-6">
                  {simpleStatements.length === 0 ? (
                    <div className="text-center py-8 text-blue-300/60">No simple mode statements yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {simpleStatements.map((stmt) => (
                        <div key={stmt._id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-cyan-400 font-bold">{stmt.period}</span>
                            <span className={`font-bold ${getStatusColor(stmt.status)}`}>
                              ₹{stmt.netCashFlow.toFixed(2)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-blue-200/80 mb-3 p-2 bg-white/5 rounded-lg border border-blue-400/10">
                            <div>Inflow: <span className="text-green-400 font-bold">₹{stmt.totalInflow.toFixed(2)}</span></div>
                            <div>Outflow: <span className="text-red-400 font-bold">₹{stmt.totalOutflow.toFixed(2)}</span></div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => downloadSlip(stmt, true)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                              <Download className="h-3 w-3 mr-2" /> Download
                            </Button>
                            <Button onClick={() => stmt._id && deleteSimpleStatement(stmt._id)} size="sm" variant="destructive" className="px-3">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
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