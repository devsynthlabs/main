import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Plus, Trash2, TrendingUp, TrendingDown, Minus, Download, Sparkles, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CashFlowItem {
  description: string;
  amount: string;
  category: string;
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
  
  const [formData, setFormData] = useState({
    period: "",
  });

  const [inflowItems, setInflowItems] = useState<CashFlowItem[]>([
    { description: "", amount: "", category: "Revenue" }
  ]);

  const [outflowItems, setOutflowItems] = useState<CashFlowItem[]>([
    { description: "", amount: "", category: "Expense" }
  ]);

  const [statements, setStatements] = useState<CashFlowStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    totalInflow: number;
    totalOutflow: number;
    netCashFlow: number;
    status: string;
  } | null>(null);

  // Fetch existing statements
  useEffect(() => {
    fetchStatements();
  }, []);

  const fetchStatements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/cashflow-statement/all", {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
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
  };

  const handleInflowItemChange = (index: number, field: keyof CashFlowItem, value: string) => {
    const updatedItems = [...inflowItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInflowItems(updatedItems);
  };

  const handleOutflowItemChange = (index: number, field: keyof CashFlowItem, value: string) => {
    const updatedItems = [...outflowItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setOutflowItems(updatedItems);
  };

  const addInflowItem = () => {
    setInflowItems([...inflowItems, { description: "", amount: "", category: "Revenue" }]);
  };

  const addOutflowItem = () => {
    setOutflowItems([...outflowItems, { description: "", amount: "", category: "Expense" }]);
  };

  const removeInflowItem = (index: number) => {
    if (inflowItems.length > 1) {
      setInflowItems(inflowItems.filter((_, i) => i !== index));
    }
  };

  const removeOutflowItem = (index: number) => {
    if (outflowItems.length > 1) {
      setOutflowItems(outflowItems.filter((_, i) => i !== index));
    }
  };

  const calculateCashFlow = () => {
    const validInflowItems = inflowItems.filter(item => item.description && item.amount);
    const validOutflowItems = outflowItems.filter(item => item.description && item.amount);

    if (validInflowItems.length === 0 || validOutflowItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Data",
        description: "Please add at least one inflow and one outflow item with description and amount.",
      });
      return;
    }

    const totalInflow = validInflowItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalOutflow = validOutflowItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
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
  };

  const saveStatement = async () => {
    if (!formData.period) {
      toast({
        variant: "destructive",
        title: "Missing Period",
        description: "Please enter a period (e.g., January 2024)",
      });
      return;
    }

    // Filter out empty items
    const validInflowItems = inflowItems.filter(item => item.description && item.amount);
    const validOutflowItems = outflowItems.filter(item => item.description && item.amount);

    if (validInflowItems.length === 0 || validOutflowItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Incomplete Data",
        description: "Please add at least one inflow and one outflow item with description and amount.",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/cashflow-statement/create", {
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
        const result = await response.json();
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
        description: "Failed to save statement. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enhanced Download Slip with Professional Format
  const downloadSlip = (statement?: CashFlowStatement) => {
    const dataToUse = statement || (result ? {
      period: formData.period || "Current Statement",
      inflowItems: inflowItems.filter(item => item.description && item.amount),
      outflowItems: outflowItems.filter(item => item.description && item.amount),
      totalInflow: result.totalInflow,
      totalOutflow: result.totalOutflow,
      netCashFlow: result.netCashFlow,
      status: result.status as "positive" | "negative" | "neutral",
      createdAt: new Date().toISOString()
    } : null);

    if (!dataToUse) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No data available to download. Please create or calculate a statement first.",
      });
      return;
    }

    const slipContent = `
╔══════════════════════════════════════════════════════════════════════╗
║                        CASH FLOW STATEMENT                           ║
║                     ${dataToUse.period.toUpperCase().padEnd(30)}         ║
╚══════════════════════════════════════════════════════════════════════╝

Date: ${new Date(dataToUse.createdAt).toLocaleDateString('en-IN', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

────────────────────────────────────────────────────────────────────────
                            CASH INFLOWS
────────────────────────────────────────────────────────────────────────
${dataToUse.inflowItems.map((item, index) => 
  `${(index + 1).toString().padStart(2)}. ${item.description.padEnd(35)} ${item.category.padEnd(15)} ₹${parseFloat(item.amount).toFixed(2).padStart(12)}`
).join('\n')}
${' '.repeat(55)}────────────────
${'TOTAL CASH INFLOW:'.padEnd(52)} ₹${dataToUse.totalInflow.toFixed(2).padStart(12)}
────────────────────────────────────────────────────────────────────────
                           CASH OUTFLOWS
────────────────────────────────────────────────────────────────────────
${dataToUse.outflowItems.map((item, index) => 
  `${(index + 1).toString().padStart(2)}. ${item.description.padEnd(35)} ${item.category.padEnd(15)} ₹${parseFloat(item.amount).toFixed(2).padStart(12)}`
).join('\n')}
${' '.repeat(55)}────────────────
${'TOTAL CASH OUTFLOW:'.padEnd(52)} ₹${dataToUse.totalOutflow.toFixed(2).padStart(12)}
────────────────────────────────────────────────────────────────────────
                            SUMMARY
────────────────────────────────────────────────────────────────────────
Total Cash Inflow:        ₹${dataToUse.totalInflow.toFixed(2).padStart(12)}
Total Cash Outflow:       ₹${dataToUse.totalOutflow.toFixed(2).padStart(12)}
────────────────────────────────────────────────────────────────────────
NET CASH FLOW:            ₹${dataToUse.netCashFlow.toFixed(2).padStart(12)}

STATUS: ${dataToUse.status === 'positive' ? '🟢 POSITIVE CASH FLOW' : 
          dataToUse.status === 'negative' ? '🔴 NEGATIVE CASH FLOW' : 
          '🟡 BALANCED CASH FLOW'}

${dataToUse.status === 'positive' ? 
  '✓ Healthy cash position. Consider investment opportunities.' :
  dataToUse.status === 'negative' ? 
  '⚠️  Monitor expenses closely. Consider cost optimization.' :
  '⚖️  Cash flow is balanced. Maintain current operations.'}

────────────────────────────────────────────────────────────────────────
Generated: ${new Date().toLocaleString('en-IN')}
Powered by Financial Automation Platform • www.finance-automation.com
    `.trim();

    // Create and download text file
    const blob = new Blob([slipContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CashFlow_Statement_${dataToUse.period.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Cash flow statement downloaded successfully!",
    });
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive": return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "negative": return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive": return "text-green-400";
      case "negative": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "positive": return "bg-green-500/20 border-green-400/30";
      case "negative": return "bg-red-500/20 border-red-400/30";
      default: return "bg-gray-500/20 border-gray-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
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
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Cash Flow Statement
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">
                Track your cash inflows and outflows with professional reporting
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                <FileText className="h-6 w-6 text-cyan-400" />
                Create Cash Flow Statement
              </CardTitle>
              <CardDescription className="text-blue-200/70">
                Enter your cash inflows and outflows for a specific period
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              {/* Period Input */}
              <div className="space-y-3">
                <Label className="text-blue-100 font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Period
                </Label>
                <Input
                  placeholder="e.g., January 2024, Q1 2024"
                  value={formData.period}
                  onChange={(e) => handleInputChange("period", e.target.value)}
                  className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                />
              </div>

              {/* Cash Inflows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-blue-100 font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Cash Inflows
                  </Label>
                  <Button
                    onClick={addInflowItem}
                    className="bg-green-600 hover:bg-green-700 text-white border-green-500/30"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {inflowItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleInflowItemChange(index, 'description', e.target.value)}
                        className="bg-white/5 border-blue-400/30 text-blue-100 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => handleInflowItemChange(index, 'amount', e.target.value)}
                        className="bg-white/5 border-blue-400/30 text-blue-100 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Category"
                        value={item.category}
                        onChange={(e) => handleInflowItemChange(index, 'category', e.target.value)}
                        className="bg-white/5 border-blue-400/30 text-blue-100 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeInflowItem(index)}
                        disabled={inflowItems.length === 1}
                        className="hover:scale-110 transition-transform duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cash Outflows */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-blue-100 font-bold text-lg flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    Cash Outflows
                  </Label>
                  <Button
                    onClick={addOutflowItem}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-500/30"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {outflowItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleOutflowItemChange(index, 'description', e.target.value)}
                        className="bg-white/5 border-blue-400/30 text-blue-100 focus:border-red-400 focus:ring-2 focus:ring-red-400/30 transition-all duration-300"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => handleOutflowItemChange(index, 'amount', e.target.value)}
                        className="bg-white/5 border-blue-400/30 text-blue-100 focus:border-red-400 focus:ring-2 focus:ring-red-400/30 transition-all duration-300"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Category"
                        value={item.category}
                        onChange={(e) => handleOutflowItemChange(index, 'category', e.target.value)}
                        className="bg-white/5 border-blue-400/30 text-blue-100 focus:border-red-400 focus:ring-2 focus:ring-red-400/30 transition-all duration-300"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOutflowItem(index)}
                        disabled={outflowItems.length === 1}
                        className="hover:scale-110 transition-transform duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={calculateCashFlow}
                  className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
                >
                  Calculate Cash Flow
                </Button>
                <Button
                  onClick={saveStatement}
                  disabled={loading || !result}
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Statement"}
                </Button>
              </div>

              {/* Download Button for Current Data */}
              {result && (
                <div className="pt-4 border-t border-blue-400/20">
                  <Button
                    onClick={() => downloadSlip()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 group"
                  >
                    <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                    Download Cash Flow Statement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results & History */}
          <div className="space-y-8">
            {/* Results Card */}
            {result && (
              <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-cyan-400" />
                    Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-blue-400/20">
                      <span className="text-blue-200 font-semibold">Total Cash Inflow:</span>
                      <span className="text-green-400 font-bold text-xl">₹{result.totalInflow.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-blue-400/20">
                      <span className="text-blue-200 font-semibold">Total Cash Outflow:</span>
                      <span className="text-red-400 font-bold text-xl">₹{result.totalOutflow.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-blue-400/20 border-t-2 border-t-cyan-400/50">
                      <span className="text-blue-200 font-bold text-lg">Net Cash Flow:</span>
                      <span className={`font-bold text-2xl ${getStatusColor(result.status)} flex items-center gap-2`}>
                        {getStatusIcon(result.status)}
                        ₹{result.netCashFlow.toFixed(2)}
                      </span>
                    </div>
                    <div className={`text-center p-4 rounded-xl border-2 ${getStatusBgColor(result.status)}`}>
                      <div className="text-lg font-bold mb-2">
                        {result.status === 'positive' ? '✅ Positive Cash Flow' :
                         result.status === 'negative' ? '⚠️ Negative Cash Flow' :
                         '⚖️ Balanced Cash Flow'}
                      </div>
                      <div className="text-sm opacity-80">
                        {result.status === 'positive' ? 
                          'Healthy cash position. Consider investment opportunities.' :
                         result.status === 'negative' ? 
                          'Monitor expenses closely. Consider cost optimization.' :
                         'Cash flow is balanced. Maintain current operations.'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* History Card */}
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-cyan-400" />
                  Statement History
                </CardTitle>
                <CardDescription className="text-blue-200/70">
                  {statements.length} statement{statements.length !== 1 ? 's' : ''} recorded
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-y-auto p-6">
                {statements.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-blue-400/40 mx-auto mb-4" />
                    <p className="text-blue-300/60">No statements yet.</p>
                    <p className="text-blue-400/40 text-sm mt-1">Create your first cash flow statement!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {statements.map((statement) => (
                      <div
                        key={statement._id}
                        className="bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-xl p-4 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-cyan-400 font-bold text-lg group-hover:text-cyan-300 transition-colors duration-300">
                            {statement.period}
                          </span>
                          <span className={`font-bold text-lg flex items-center gap-2 ${getStatusColor(statement.status)}`}>
                            {getStatusIcon(statement.status)}
                            ₹{statement.netCashFlow.toFixed(2)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-2">
                            <div className="text-green-400 font-semibold">Inflow</div>
                            <div className="text-green-300">₹{statement.totalInflow.toFixed(2)}</div>
                          </div>
                          <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-2">
                            <div className="text-red-400 font-semibold">Outflow</div>
                            <div className="text-red-300">₹{statement.totalOutflow.toFixed(2)}</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => downloadSlip(statement)}
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white group/btn transition-all duration-300 hover:scale-105"
                        >
                          <Download className="h-3 w-3 mr-2 group-hover/btn:animate-bounce" />
                          Download Statement
                        </Button>
                        <div className="text-xs text-blue-300/60 mt-2 text-center">
                          {new Date(statement.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashFlowStatement;