import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Button } from "@/components/ui/button";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Input } from "@/components/ui/input";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Label } from "@/components/ui/label";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Badge } from "@/components/ui/badge";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { ArrowLeft, Download, Calculator, Sparkles, TrendingUp, Search, FileText, Database, BarChart3 } from "lucide-react";
import { VoiceButton } from "@/components/ui/VoiceButton";

interface FormData {
  currentAssets: string;
  currentLiabilities: string;
  totalAssets: string;
  totalLiabilities: string;
  equity: string;
  totalEquity: string;
  revenue: string;
  expenses: string;
  netIncome: string;
  totalDebt: string;
  sharesOutstanding: string;
  inventory: string;
}

interface RatioRecord {
  id: string;
  companyName: string;
  period: string;
  currentAssets: number;
  currentLiabilities: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  totalEquity: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  totalDebt: number;
  sharesOutstanding: number;
  inventory: number;
  ratios: {
    currentRatio: number;
    debtToEquity: number;
    debtRatio: number;
    quickRatio: number;
    grossProfitMargin: number;
    netProfitMargin: number;
    roe: number;
    roa: number;
    assetsTurnover: number;
    eps: number;
  };
  createdAt: string;
}

interface Trail {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const FinancialRatios = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calculator");

  // Calculator State
  const [formData, setFormData] = useState<FormData>({
    currentAssets: "",
    currentLiabilities: "",
    totalAssets: "",
    totalLiabilities: "",
    equity: "",
    totalEquity: "",
    revenue: "",
    expenses: "",
    netIncome: "",
    totalDebt: "",
    sharesOutstanding: "",
    inventory: ""
  });

  // Results State
  const [calculatedRatios, setCalculatedRatios] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  // History State
  const [searchTerm, setSearchTerm] = useState("");
  const [ratiosHistory, setRatiosHistory] = useState<RatioRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<RatioRecord[]>([]);



  // Initialize with sample data
  useEffect(() => {
    const sampleData: RatioRecord[] = [
      {
        id: "1",
        companyName: "Tech Corp Inc",
        period: "Q4 2024",
        currentAssets: 500000,
        currentLiabilities: 250000,
        totalAssets: 2000000,
        totalLiabilities: 800000,
        equity: 1200000,
        totalEquity: 1200000,
        revenue: 1500000,
        expenses: 900000,
        netIncome: 300000,
        totalDebt: 600000,
        sharesOutstanding: 100000,
        inventory: 100000,
        ratios: {
          currentRatio: 2.0,
          debtToEquity: 0.5,
          debtRatio: 0.3,
          quickRatio: 1.6,
          grossProfitMargin: 40.0,
          netProfitMargin: 20.0,
          roe: 25.0,
          roa: 15.0,
          assetsTurnover: 0.75,
          eps: 3.0
        },
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        companyName: "Global Enterprises",
        period: "Q4 2024",
        currentAssets: 800000,
        currentLiabilities: 400000,
        totalAssets: 3500000,
        totalLiabilities: 1500000,
        equity: 2000000,
        totalEquity: 2000000,
        revenue: 2800000,
        expenses: 1960000,
        netIncome: 420000,
        totalDebt: 1200000,
        sharesOutstanding: 150000,
        inventory: 200000,
        ratios: {
          currentRatio: 2.0,
          debtToEquity: 0.6,
          debtRatio: 0.34,
          quickRatio: 1.5,
          grossProfitMargin: 30.0,
          netProfitMargin: 15.0,
          roe: 21.0,
          roa: 12.0,
          assetsTurnover: 0.8,
          eps: 2.8
        },
        createdAt: "2024-01-14"
      }
    ];

    setRatiosHistory(sampleData);
    setFilteredHistory(sampleData);
  }, []);

  // Function to update form inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to calculate ratios
  const calculateRatios = () => {
    const currentAssets = parseFloat(formData.currentAssets) || 0;
    const currentLiabilities = parseFloat(formData.currentLiabilities) || 0;
    const totalAssets = parseFloat(formData.totalAssets) || 0;
    const totalLiabilities = parseFloat(formData.totalLiabilities) || 0;
    const equity = parseFloat(formData.equity) || 0;
    const totalEquity = parseFloat(formData.totalEquity) || 0;
    const revenue = parseFloat(formData.revenue) || 0;
    const expenses = parseFloat(formData.expenses) || 0;
    const netIncome = parseFloat(formData.netIncome) || 0;
    const totalDebt = parseFloat(formData.totalDebt) || 0;
    const sharesOutstanding = parseFloat(formData.sharesOutstanding) || 0;
    const inventory = parseFloat(formData.inventory) || 0;

    // Calculate ratios
    const ratios = {
      currentRatio: currentLiabilities ? currentAssets / currentLiabilities : 0,
      debtToEquity: totalEquity ? totalDebt / totalEquity : 0,
      debtRatio: totalAssets ? totalDebt / totalAssets : 0,
      quickRatio: currentLiabilities ? (currentAssets - inventory) / currentLiabilities : 0,
      grossProfitMargin: revenue ? ((revenue - expenses) / revenue) * 100 : 0,
      netProfitMargin: revenue ? (netIncome / revenue) * 100 : 0,
      roe: totalEquity ? (netIncome / totalEquity) * 100 : 0,
      roa: totalAssets ? (netIncome / totalAssets) * 100 : 0,
      assetsTurnover: totalAssets ? revenue / totalAssets : 0,
      eps: sharesOutstanding ? netIncome / sharesOutstanding : 0,
    };

    setCalculatedRatios(ratios);
    setShowResult(true);

    // Create new record
    const newRecord: RatioRecord = {
      id: Date.now().toString(),
      companyName: "Current Calculation",
      period: new Date().toLocaleDateString(),
      currentAssets,
      currentLiabilities,
      totalAssets,
      totalLiabilities,
      equity,
      totalEquity,
      revenue,
      expenses,
      netIncome,
      totalDebt,
      sharesOutstanding,
      inventory,
      ratios,
      createdAt: new Date().toLocaleDateString()
    };

    // Add to history
    setRatiosHistory(prev => [newRecord, ...prev]);
    setFilteredHistory(prev => [newRecord, ...prev]);
  };

  // Search function
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredHistory(ratiosHistory);
      return;
    }

    const filtered = ratiosHistory.filter(
      (record) =>
        record.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.period?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  // Reset search when search term is cleared
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(ratiosHistory);
    }
  }, [searchTerm, ratiosHistory]);

  const downloadReport = (record: RatioRecord) => {
    const reportContent = `
╔════════════════════════════════════════════╗
║        FINANCIAL RATIOS REPORT             ║
║                 ${record.period}                 ║
╚════════════════════════════════════════════╝

Company: ${record.companyName || "N/A"}
Analysis Date: ${record.createdAt || "N/A"}

FINANCIAL DATA:
  Current Assets:       ₹${record.currentAssets.toLocaleString()}
  Current Liabilities:  ₹${record.currentLiabilities.toLocaleString()}
  Total Assets:         ₹${record.totalAssets.toLocaleString()}
  Total Liabilities:    ₹${record.totalLiabilities.toLocaleString()}
  Total Equity:         ₹${record.totalEquity.toLocaleString()}
  Revenue:              ₹${record.revenue.toLocaleString()}
  Net Income:           ₹${record.netIncome.toLocaleString()}

FINANCIAL RATIOS:

LIQUIDITY RATIOS:
  Current Ratio:        ${record.ratios.currentRatio.toFixed(2)}
  Quick Ratio:          ${record.ratios.quickRatio.toFixed(2)}

SOLVENCY RATIOS:
  Debt-to-Equity:       ${record.ratios.debtToEquity.toFixed(2)}
  Debt Ratio:           ${record.ratios.debtRatio.toFixed(2)}

PROFITABILITY RATIOS:
  Gross Profit Margin:  ${record.ratios.grossProfitMargin.toFixed(2)}%
  Net Profit Margin:    ${record.ratios.netProfitMargin.toFixed(2)}%
  Return on Equity:     ${record.ratios.roe.toFixed(2)}%
  Return on Assets:     ${record.ratios.roa.toFixed(2)}%

EFFICIENCY RATIOS:
  Assets Turnover:      ${record.ratios.assetsTurnover.toFixed(2)}

MARKET RATIOS:
  EPS:                  ₹${record.ratios.eps.toFixed(2)}

-------------------------------------------
Generated by Financial Analysis Platform
Powered by Advanced Ratio Engine ✨
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financial_ratios_${record.companyName.replace(/\s+/g, "_")}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const getRatioColor = (value: number, type: string) => {
    switch (type) {
      case 'currentRatio':
        return value > 2 ? 'text-green-400' : value > 1 ? 'text-yellow-400' : 'text-red-400';
      case 'debtToEquity':
        return value < 0.5 ? 'text-green-400' : value < 1 ? 'text-yellow-400' : 'text-red-400';
      case 'profitMargin':
        return value > 20 ? 'text-green-400' : value > 10 ? 'text-yellow-400' : 'text-red-400';
      case 'roe':
        return value > 15 ? 'text-green-400' : value > 8 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-following gradient */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-indigo-500/30 rounded-full blur-3xl transition-all duration-1000"
          style={{
            top: -400,
            left: -400,
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-40 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-60 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>

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
            <div
              className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30 hover:rotate-12 transition-transform duration-300"


            >
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Financial Ratios Analyzer
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Calculate and analyze key financial metrics</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-2xl p-1">
            <TabsTrigger
              value="calculator"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"


            >
              <Calculator className="h-4 w-4" />
              Ratio Calculator
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"


            >
              <FileText className="h-4 w-4" />
              Analysis History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card
              className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40 hover:-translate-y-2"


            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl" />

              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black text-blue-100 flex items-center gap-3">
                      <BarChart3 className="h-7 w-7 text-cyan-400 hover:rotate-12 transition-transform duration-300" />
                      Financial Ratios Calculator
                    </CardTitle>
                    <CardDescription className="text-blue-200/70 mt-2 text-base">
                      Enter financial data to calculate key performance ratios
                    </CardDescription>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-200 font-semibold">Live Analysis</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 p-8">
                {/* Financial Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { id: "currentAssets", label: "Current Assets", icon: "💰" },
                    { id: "currentLiabilities", label: "Current Liabilities", icon: "📊" },
                    { id: "totalAssets", label: "Total Assets", icon: "🏦" },
                    { id: "totalLiabilities", label: "Total Liabilities", icon: "📉" },
                    { id: "equity", label: "Equity", icon: "⚖️" },
                    { id: "totalEquity", label: "Total Equity", icon: "📈" },
                    { id: "revenue", label: "Revenue", icon: "💸" },
                    { id: "expenses", label: "Expenses", icon: "💳" },
                    { id: "netIncome", label: "Net Income", icon: "🎯" },
                    { id: "totalDebt", label: "Total Debt", icon: "🏷️" },
                    { id: "sharesOutstanding", label: "Shares Outstanding", icon: "📊" },
                    { id: "inventory", label: "Inventory", icon: "📦" }
                  ].map((field) => (
                    <div key={field.id} className="space-y-3 group">
                      <Label htmlFor={field.id} className="text-blue-100 font-bold flex items-center gap-2">
                        <span>{field.icon}</span>
                        {field.label} (₹)
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.id}
                          type="number"
                          placeholder="0.00"
                          value={formData[field.id as keyof FormData]}
                          onChange={(e) => handleInputChange(field.id as keyof FormData, e.target.value)}


                          className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10 pl-4"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculate Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={calculateRatios}


                    className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/70 border border-blue-400/30"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Ratios & Add to History
                  </Button>
                </div>

                {/* Display Results */}
                {showResult && calculatedRatios && (
                  <Card
                    className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/60 rounded-3xl overflow-hidden animate-in fade-in duration-700 relative"


                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full backdrop-blur-md border border-yellow-400/50 flex items-center gap-1 shadow-lg shadow-yellow-400/30">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      <span className="text-xs text-yellow-100 font-bold">Calculated</span>
                    </div>

                    <CardContent className="pt-12 pb-12 px-8 text-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 blur-2xl" />

                      <div className="relative z-10">
                        <p className="text-xl text-cyan-300 mb-8 font-semibold tracking-wide uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                          Financial Ratios Analysis
                        </p>

                        {/* Ratios Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {Object.entries(calculatedRatios).map(([key, value]) => (
                            <div key={key} className="p-4 bg-white/5 rounded-2xl border border-blue-400/20 hover:border-cyan-400/40 transition-all duration-300">
                              <p className="text-sm text-blue-300 mb-2 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </p>
                              <p className={`text-2xl font-bold ${getRatioColor(value as number, key)}`}>
                                {typeof value === 'number' ? (value as number).toFixed(2) : value}
                                {key.includes('Margin') || key.includes('roe') || key.includes('roa') ? '%' : ''}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() => {
                              const currentRecord: RatioRecord = {
                                id: Date.now().toString(),
                                companyName: "Current Calculation",
                                period: new Date().toLocaleDateString(),
                                currentAssets: parseFloat(formData.currentAssets) || 0,
                                currentLiabilities: parseFloat(formData.currentLiabilities) || 0,
                                totalAssets: parseFloat(formData.totalAssets) || 0,
                                totalLiabilities: parseFloat(formData.totalLiabilities) || 0,
                                equity: parseFloat(formData.equity) || 0,
                                totalEquity: parseFloat(formData.totalEquity) || 0,
                                revenue: parseFloat(formData.revenue) || 0,
                                expenses: parseFloat(formData.expenses) || 0,
                                netIncome: parseFloat(formData.netIncome) || 0,
                                totalDebt: parseFloat(formData.totalDebt) || 0,
                                sharesOutstanding: parseFloat(formData.sharesOutstanding) || 0,
                                inventory: parseFloat(formData.inventory) || 0,
                                ratios: calculatedRatios,
                                createdAt: new Date().toLocaleDateString()
                              };
                              downloadReport(currentRecord);
                            }}


                            className="px-8 py-4 h-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/70 border border-cyan-400/30 group"
                          >
                            <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                            Download Report
                          </Button>
                          <Button
                            onClick={() => setActiveTab("history")}


                            variant="outline"
                            className="px-8 py-4 h-auto border-2 border-cyan-400/40 hover:bg-cyan-400/10 text-cyan-300 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                          >
                            View in History
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            {/* Search Section */}
            <Card
              className="mb-8 backdrop-blur-2xl bg-white/10 border border-blue-400/30 rounded-3xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:-translate-y-2"


            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-cyan-400" />
                  <CardTitle className="text-2xl font-bold text-blue-100">Analysis History</CardTitle>
                </div>
                <CardDescription className="text-blue-300/70">
                  {ratiosHistory.length} analysis{ratiosHistory.length !== 1 ? 's' : ''} in history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                    <Input
                      placeholder="Search by company name or period..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}


                      className="pl-12 h-12 bg-white/5 backdrop-blur-xl text-blue-100 border-blue-400/30 focus:border-cyan-400/50 rounded-2xl placeholder:text-blue-400/40 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}


                    className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Records List */}
            {filteredHistory.length > 0 ? (
              <div className="grid gap-6">
                {filteredHistory.map((record, index) => (
                  <Card
                    key={record.id}
                    className="backdrop-blur-2xl bg-white/5 border border-blue-400/20 rounded-3xl shadow-2xl shadow-blue-500/20 hover:shadow-cyan-500/60 hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] group relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}


                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="pt-6 relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-xl text-blue-100 group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                              {record.companyName}
                            </h3>
                            <Badge
                              variant="outline"
                              className="border-blue-400/40 text-blue-300 backdrop-blur-xl bg-blue-500/10 px-3 py-1 rounded-xl font-semibold group-hover:border-cyan-400/60 group-hover:text-cyan-300 transition-all duration-300"
                            >
                              {record.period}
                            </Badge>
                            <Badge className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white border-0 px-3 py-1 rounded-xl font-semibold shadow-lg shadow-green-500/30 flex items-center gap-1 group-hover:shadow-green-500/50 transition-all duration-300">
                              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                              {record.createdAt === new Date().toLocaleDateString() ? 'Today' : 'Saved'}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-blue-300/80 flex items-center gap-2 group-hover:text-blue-200 transition-colors duration-300">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-shadow duration-300" />
                              Date: {record.createdAt} | Revenue: ₹{record.revenue.toLocaleString()} | Net Income: ₹{record.netIncome.toLocaleString()}
                            </p>

                            {/* Key Ratios Display */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                              <div className="text-center p-3 bg-white/5 rounded-xl border border-blue-400/20 group-hover:border-cyan-400/30 transition-colors duration-300">
                                <p className="text-xs text-blue-300 mb-1">Current Ratio</p>
                                <p className={`text-lg font-bold ${getRatioColor(record.ratios.currentRatio, 'currentRatio')}`}>
                                  {record.ratios.currentRatio.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-xl border border-blue-400/20 group-hover:border-cyan-400/30 transition-colors duration-300">
                                <p className="text-xs text-blue-300 mb-1">ROE</p>
                                <p className={`text-lg font-bold ${getRatioColor(record.ratios.roe, 'roe')}`}>
                                  {record.ratios.roe.toFixed(2)}%
                                </p>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-xl border border-blue-400/20 group-hover:border-cyan-400/30 transition-colors duration-300">
                                <p className="text-xs text-blue-300 mb-1">Net Margin</p>
                                <p className={`text-lg font-bold ${getRatioColor(record.ratios.netProfitMargin, 'profitMargin')}`}>
                                  {record.ratios.netProfitMargin.toFixed(2)}%
                                </p>
                              </div>
                              <div className="text-center p-3 bg-white/5 rounded-xl border border-blue-400/20 group-hover:border-cyan-400/30 transition-colors duration-300">
                                <p className="text-xs text-blue-300 mb-1">EPS</p>
                                <p className="text-lg font-bold text-cyan-300">
                                  ₹{record.ratios.eps.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => downloadReport(record)}


                          className="text-blue-200 border-2 border-blue-400/40 hover:bg-gradient-to-r hover:from-blue-600/80 hover:to-cyan-600/80 hover:border-cyan-400/60 hover:text-white backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-6 font-bold shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-110 group/btn"
                        >
                          <Download className="mr-2 h-5 w-5 group-hover/btn:animate-bounce" />
                          Download Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card
                className="backdrop-blur-2xl bg-white/5 border border-blue-400/20 rounded-3xl shadow-2xl shadow-blue-500/30"


              >
                <CardContent className="pt-6 text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-500/40">
                      <Database className="h-12 w-12 text-blue-300 animate-pulse" />
                    </div>
                    <p className="text-blue-300/80 text-lg font-medium">No financial analysis records found.</p>
                    <p className="text-blue-400/60 text-sm">Try adjusting your search terms or make a new analysis</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom floating info */}
        <div className="mt-8 text-center">
          <p className="text-blue-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
            Powered by Advanced Financial Analysis Engine ✨
          </p>
        </div>
      </main>
    </div>
  );
};

export default FinancialRatios;