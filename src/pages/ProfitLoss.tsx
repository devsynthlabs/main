import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Download, TrendingUp, TrendingDown, DollarSign, Sparkles, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfitLoss = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState([]);
  const [isHovering, setIsHovering] = useState(false);

  const [formData, setFormData] = useState({
    sales: "",
    serviceIncome: "",
    interestIncome: "",
    otherIncome: "",
    salaries: "",
    rent: "",
    utilities: "",
    otherExpenses: "",
  });

  const [statement, setStatement] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Mouse tracking with trail effect
  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const newTrails = [];
      for (let i = 0; i < 3; i++) {
        const trail = {
          id: trailId++,
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 8 + 4,
          delay: i * 50,
        };
        newTrails.push(trail);
      }

      setCursorTrail((prev) => [...prev, ...newTrails].slice(-30));

      setTimeout(() => {
        setCursorTrail((prev) => prev.filter((t) => !newTrails.find(nt => nt.id === t.id)));
      }, 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateStatement = async () => {
    // Parse all values with default 0
    const sales = parseFloat(formData.sales) || 0;
    const serviceIncome = parseFloat(formData.serviceIncome) || 0;
    const interestIncome = parseFloat(formData.interestIncome) || 0;
    const otherIncome = parseFloat(formData.otherIncome) || 0;
    const salaries = parseFloat(formData.salaries) || 0;
    const rent = parseFloat(formData.rent) || 0;
    const utilities = parseFloat(formData.utilities) || 0;
    const otherExpenses = parseFloat(formData.otherExpenses) || 0;

    // Calculate totals like Python file
    const totalRevenue = sales + serviceIncome + interestIncome + otherIncome;
    const totalExpenses = salaries + rent + utilities + otherExpenses;
    const netProfit = totalRevenue - totalExpenses;

    const result = {
      sales,
      serviceIncome,
      interestIncome,
      otherIncome,
      totalRevenue,
      salaries,
      rent,
      utilities,
      otherExpenses,
      totalExpenses,
      netProfit,
      profitable: netProfit > 0,
    };

    setStatement(result);
    setShowResult(true);

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
    }
  };

  const downloadPDF = () => {
    if (!statement) return;

    const content = `
╔═══════════════════════════════════════════════╗
║       PROFIT & LOSS STATEMENT - ${new Date().toLocaleDateString()}      ║
╚═══════════════════════════════════════════════╝

REVENUE & INCOME
────────────────────────────────────────────────
Sales:                     ₹${statement.sales.toFixed(2)}
Service Income:            ₹${statement.serviceIncome.toFixed(2)}
Interest Income:           ₹${statement.interestIncome.toFixed(2)}
Other Income:              ₹${statement.otherIncome.toFixed(2)}
────────────────────────────────────────────────
TOTAL REVENUE:             ₹${statement.totalRevenue.toFixed(2)}

EXPENSES
────────────────────────────────────────────────
Salaries:                  ₹${statement.salaries.toFixed(2)}
Rent:                      ₹${statement.rent.toFixed(2)}
Utilities:                 ₹${statement.utilities.toFixed(2)}
Other Expenses:            ₹${statement.otherExpenses.toFixed(2)}
────────────────────────────────────────────────
TOTAL EXPENSES:            ₹${statement.totalExpenses.toFixed(2)}

════════════════════════════════════════════════
NET ${statement.profitable ? 'PROFIT' : 'LOSS'}:                ₹${statement.netProfit.toFixed(2)}
════════════════════════════════════════════════

Status: ${statement.profitable ? '✓ PROFITABLE' : '✗ LOSS INCURRED'}

Generated by Financial Automation Platform
Powered by Advanced Financial Analytics Engine ✨
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ProfitLoss_Statement_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Advanced Custom Cursor System */}
      <div
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Main cursor container */}
        <div className="relative">
          {/* 1. Rotating Outer Ring with marker dot */}
          <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-cyan-400/60 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2"></div>
            </div>
          </div>

          {/* 2. Middle Pulsing Ring */}
          <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-blue-400/80 rounded-full animate-pulse"></div>
          </div>

          {/* 3. Inner Glow */}
          <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/30 rounded-full blur-md"></div>

          {/* 4. Center Dot - Main cursor indicator */}
          <div className={`absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${isHovering ? 'bg-yellow-400 scale-150 shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
            }`}></div>

          {/* 5. Crosshair Lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Horizontal line */}
            <div className="absolute w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-1/2"></div>
            {/* Vertical line */}
            <div className="absolute h-16 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* 6. Sparkle Particle Trail System */}
      {cursorTrail.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[99998] animate-[sparkleTrail_0.8s_ease-out_forwards]"
          style={{
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            animationDelay: `${trail.delay}ms`,
          }}
        >
          {/* Sparkle particle with star shape */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-full blur-[2px] shadow-lg shadow-cyan-400/50"></div>
            {/* Star points */}
            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-cyan-400/60 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-cyan-400/60 -translate-y-1/2"></div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes sparkleTrail {
          0% {
            transform: scale(1) translateY(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) translateY(-40px) rotate(180deg);
            opacity: 0;
          }
        }
        
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-indigo-500/30 rounded-full blur-3xl transition-all duration-1000"
          style={{
            top: mousePosition.y / 20 - 400,
            left: mousePosition.x / 20 - 400,
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

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
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="mb-4 text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div
              className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Profit & Loss Statement
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Generate, analyze, and download P&L reports</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card
            className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40 hover:-translate-y-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl" />

            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                    <DollarSign className="h-6 w-6 text-cyan-400 hover:rotate-12 transition-transform duration-300" />
                    Enter P&L Data
                  </CardTitle>
                  <CardDescription className="text-blue-200/70 mt-2">
                    Input your company's financial details
                  </CardDescription>
                </div>
                <div className="hidden sm:block px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-200 font-semibold">Live</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-6">
              {/* Revenue Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-100 border-b border-blue-400/30 pb-2">💰 Revenue</h3>
                {[
                  { field: "sales", label: "Sales", icon: "📊" },
                  { field: "serviceIncome", label: "Service Income", icon: "🔧" },
                  { field: "interestIncome", label: "Interest Income", icon: "📈" },
                  { field: "otherIncome", label: "Other Income", icon: "💰" },
                ].map(({ field, label, icon }) => (
                  <div key={field} className="space-y-2 group">
                    <Label htmlFor={field} className="text-blue-100 font-bold flex items-center gap-2">
                      <span>{icon}</span>
                      {label} (₹)
                    </Label>
                    <div className="relative">
                      <Input
                        id={field}
                        type="number"
                        placeholder="0.00"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Expenses Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-100 border-b border-blue-400/30 pb-2">💸 Expenses</h3>
                {[
                  { field: "salaries", label: "Salaries", icon: "👥" },
                  { field: "rent", label: "Rent", icon: "🏢" },
                  { field: "utilities", label: "Utilities", icon: "⚡" },
                  { field: "otherExpenses", label: "Other Expenses", icon: "📋" },
                ].map(({ field, label, icon }) => (
                  <div key={field} className="space-y-2 group">
                    <Label htmlFor={field} className="text-blue-100 font-bold flex items-center gap-2">
                      <span>{icon}</span>
                      {label} (₹)
                    </Label>
                    <div className="relative">
                      <Input
                        id={field}
                        type="number"
                        placeholder="0.00"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={generateStatement}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/70 border border-blue-400/30 mt-6"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Generate P&L Statement
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          {showResult && statement && (
            <Card
              className={`backdrop-blur-2xl border-2 shadow-2xl rounded-3xl overflow-hidden transition-all duration-700 animate-in fade-in relative ${statement.profitable
                ? 'bg-gradient-to-br from-slate-800/90 via-emerald-900/70 to-green-900/80 border-emerald-400/60 shadow-emerald-500/60'
                : 'bg-gradient-to-br from-slate-800/90 via-red-900/70 to-pink-900/80 border-red-400/60 shadow-red-500/60'
                }`}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent animate-pulse ${statement.profitable ? 'via-emerald-400' : 'via-red-400'
                }`} />

              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-md border flex items-center gap-1 shadow-lg ${statement.profitable
                ? 'bg-gradient-to-r from-emerald-400/30 to-green-400/30 border-emerald-400/50 shadow-emerald-400/30'
                : 'bg-gradient-to-r from-red-400/30 to-pink-400/30 border-red-400/50 shadow-red-400/30'
                }`}>
                <Sparkles className={`h-3 w-3 ${statement.profitable ? 'text-emerald-300' : 'text-red-300'}`} />
                <span className={`text-xs font-bold ${statement.profitable ? 'text-emerald-100' : 'text-red-100'}`}>
                  {statement.profitable ? 'Profitable' : 'Loss'}
                </span>
              </div>

              <CardHeader className="relative">
                <CardTitle className="text-2xl font-black flex items-center gap-3 text-white">
                  {statement.profitable ? (
                    <TrendingUp className="h-6 w-6 text-emerald-400 hover:translate-y-[-4px] transition-transform duration-300" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-400 hover:translate-y-1 transition-transform duration-300" />
                  )}
                  Financial Summary
                </CardTitle>
                <CardDescription className={statement.profitable ? 'text-emerald-200/80' : 'text-red-200/80'}>
                  Detailed profit & loss breakdown
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 p-6 relative">
                <div className={`absolute inset-0 blur-2xl ${statement.profitable
                  ? 'bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10'
                  : 'bg-gradient-to-br from-red-500/10 via-transparent to-pink-500/10'
                  }`} />

                <div className="relative z-10 space-y-3">
                  {/* Revenue Section */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white mb-2">💰 Revenue</h4>
                    {[
                      { label: "Sales", value: statement.sales },
                      { label: "Service Income", value: statement.serviceIncome },
                      { label: "Interest Income", value: statement.interestIncome },
                      { label: "Other Income", value: statement.otherIncome },
                    ].map(({ label, value }, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] bg-white/5 border border-white/10 hover:bg-white/10"
                      >
                        <span className="font-medium text-white/90">{label}</span>
                        <span className="font-bold text-white">₹{value.toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Total Revenue */}
                    <div className="flex justify-between items-center p-3 rounded-xl backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 mt-2">
                      <span className="font-bold text-white">Total Revenue</span>
                      <span className="font-bold text-white">₹{statement.totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white mb-2">💸 Expenses</h4>
                    {[
                      { label: "Salaries", value: statement.salaries },
                      { label: "Rent", value: statement.rent },
                      { label: "Utilities", value: statement.utilities },
                      { label: "Other Expenses", value: statement.otherExpenses },
                    ].map(({ label, value }, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] bg-white/5 border border-white/10 hover:bg-white/10"
                      >
                        <span className="font-medium text-white/90">{label}</span>
                        <span className="font-bold text-white">₹{value.toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Total Expenses */}
                    <div className="flex justify-between items-center p-3 rounded-xl backdrop-blur-md bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 mt-2">
                      <span className="font-bold text-white">Total Expenses</span>
                      <span className="font-bold text-white">₹{statement.totalExpenses.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Net Profit/Loss - Highlighted */}
                  <div className={`flex justify-between items-center p-5 rounded-2xl backdrop-blur-xl border-2 mt-6 shadow-2xl ${statement.profitable
                    ? 'bg-gradient-to-r from-emerald-600/40 to-green-600/40 border-emerald-400/60 shadow-emerald-500/50'
                    : 'bg-gradient-to-r from-red-600/40 to-pink-600/40 border-red-400/60 shadow-red-500/50'
                    }`}>
                    <span className="text-xl font-black text-white drop-shadow-lg">
                      Net {statement.profitable ? 'Profit' : 'Loss'}
                    </span>
                    <span className="text-3xl font-black animate-pulse text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                      ₹{statement.netProfit.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className={`w-full h-14 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 border mt-6 group ${statement.profitable
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-500/50 hover:shadow-emerald-500/70 border-emerald-400/30'
                      : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-red-500/50 hover:shadow-red-500/70 border-red-400/30'
                      }`}
                    onClick={downloadPDF}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                    Download P&L Statement
                  </Button>

                  <p className="text-center text-sm mt-4 flex items-center justify-center gap-2 text-white/70">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statement.profitable ? 'bg-emerald-400' : 'bg-red-400'
                      }`} />
                    Professional report ready to download
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state */}
          {!showResult && (
            <Card
              className="backdrop-blur-2xl bg-white/5 border border-blue-400/10 shadow-xl rounded-3xl overflow-hidden flex items-center justify-center min-h-[600px]"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-blue-400/30">
                  <BarChart3 className="h-12 w-12 text-blue-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-blue-200 mb-3">
                  Ready to Analyze
                </h3>
                <p className="text-blue-300/60 max-w-sm mx-auto">
                  Enter your financial data and generate a comprehensive P&L statement
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Bottom info */}
        <div className="mt-8 text-center">
          <p className="text-blue-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
            Powered by Advanced Financial Analytics Engine ✨
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfitLoss;