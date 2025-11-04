import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Plus, BarChart3, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CashFlowEntry {
  year: string;
  month: string;
  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;
  time: number;
}

interface PredictionData {
  month: string;
  predictedNetCashFlow: number;
  time: number;
}

interface Trail {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const CashFlow = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Trail[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  const [formData, setFormData] = useState({
    year: "",
    month: "",
    cashInflow: "",
    cashOutflow: "",
  });

  const [cashflowData, setCashflowData] = useState<CashFlowEntry[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [showPrediction, setShowPrediction] = useState(false);

  // Mouse tracking with enhanced trail effect
  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const newTrails: Trail[] = [];
      for (let i = 0; i < 3; i++) {
        const trail: Trail = {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addEntry = () => {
    if (!formData.year || !formData.month || !formData.cashInflow || !formData.cashOutflow) {
      alert("Please fill all fields!");
      return;
    }

    // Split comma-separated values
    const months = formData.month.split(',').map(m => m.trim());
    const inflows = formData.cashInflow.split(',').map(val => parseFloat(val.trim()) || 0);
    const outflows = formData.cashOutflow.split(',').map(val => parseFloat(val.trim()) || 0);

    // Validate arrays have same length
    if (months.length !== inflows.length || months.length !== outflows.length) {
      alert("Number of months, cash inflows, and cash outflows must match!");
      return;
    }

    // Create multiple entries
    const newEntries: CashFlowEntry[] = months.map((month, index) => ({
      year: formData.year,
      month: month,
      cashInflow: inflows[index],
      cashOutflow: outflows[index],
      netCashFlow: inflows[index] - outflows[index],
      time: cashflowData.length + index,
    }));

    setCashflowData((prev) => [...prev, ...newEntries]);
    setFormData({ year: "", month: "", cashInflow: "", cashOutflow: "" });
    setShowPrediction(false);
  };

  const predictCashflow = () => {
    if (cashflowData.length < 2) {
      alert("Enter at least 2 entries to predict!");
      return;
    }

    // Simple Linear Regression
    const n = cashflowData.length;
    const sumX = cashflowData.reduce((sum, entry) => sum + entry.time, 0);
    const sumY = cashflowData.reduce((sum, entry) => sum + entry.netCashFlow, 0);
    const sumXY = cashflowData.reduce((sum, entry) => sum + entry.time * entry.netCashFlow, 0);
    const sumXX = cashflowData.reduce((sum, entry) => sum + entry.time * entry.time, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict next 6 months
    const futurePredictions: PredictionData[] = [];
    for (let i = 0; i < 6; i++) {
      const futureTime = n + i;
      const predictedValue = slope * futureTime + intercept;
      futurePredictions.push({
        month: `Month ${futureTime + 1}`,
        predictedNetCashFlow: predictedValue,
        time: futureTime,
      });
    }

    setPredictions(futurePredictions);
    setShowPrediction(true);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Prepare chart data
  const chartData = [
    ...cashflowData.map((entry) => ({
      name: entry.month,
      actual: entry.netCashFlow,
      time: entry.time,
    })),
    ...predictions.map((pred) => ({
      name: pred.month,
      predicted: pred.predictedNetCashFlow,
      time: pred.time,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Custom Cursor */}
      <div 
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-cyan-400/60 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full -translate-x-1/2"></div>
            </div>
          </div>
          <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-blue-400/80 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-cyan-400/30 rounded-full blur-md"></div>
          <div className={`absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
            isHovering ? 'bg-yellow-400 scale-150' : 'bg-cyan-400'
          }`}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-1/2"></div>
            <div className="absolute h-16 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Cursor Trail Particles */}
      {cursorTrail.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[99998] animate-[trail_0.8s_ease-out_forwards]"
          style={{
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            animationDelay: `${trail.delay}ms`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-full blur-[2px] shadow-lg shadow-cyan-400/50"></div>
        </div>
      ))}

      <style>{`
        @keyframes trail {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) translateY(-40px);
            opacity: 0;
          }
        }
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Animated Background */}
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
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={handleBackToDashboard}
            className="mb-4 text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div 
              className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30 hover:rotate-12 transition-transform duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Cash Flow Prediction
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">AI-powered financial forecasting for the next 6 months</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card 
            className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40 hover:-translate-y-2"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl" />
            
            <CardHeader className="relative">
              <CardTitle className="text-2xl font-black text-blue-100 flex items-center gap-3">
                <Plus className="h-6 w-6 text-cyan-400" />
                Add Cash Flow Entry
              </CardTitle>
              <CardDescription className="text-blue-200/70 mt-2">
                Enter monthly financial data (comma-separated for multiple months)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <Label className="text-blue-100 font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  Year
                </Label>
                <Input
                  placeholder="e.g., 2025"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-blue-100 font-bold">📅 Month</Label>
                <Input
                  placeholder="e.g., Jan,Feb,Mar or January,February,March"
                  value={formData.month}
                  onChange={(e) => handleInputChange("month", e.target.value)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-blue-100 font-bold">💰 Cash Inflow (₹)</Label>
                <Input
                  placeholder="e.g., 5000,4800,5100 (comma-separated)"
                  value={formData.cashInflow}
                  onChange={(e) => handleInputChange("cashInflow", e.target.value)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-blue-100 font-bold">💸 Cash Outflow (₹)</Label>
                <Input
                  placeholder="e.g., 7000,6500,5900 (comma-separated)"
                  value={formData.cashOutflow}
                  onChange={(e) => handleInputChange("cashOutflow", e.target.value)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={addEntry}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl shadow-2xl shadow-green-500/50 transition-all duration-300 hover:scale-[1.02] border border-green-400/30"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add Entry
                </Button>
                <Button
                  onClick={predictCashflow}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="flex-1 h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl shadow-amber-500/50 transition-all duration-300 hover:scale-[1.02] border border-amber-400/30"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Predict
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card 
            className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-black text-blue-100">Current Entries</CardTitle>
              <CardDescription className="text-blue-200/70">
                {cashflowData.length} entries recorded
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {cashflowData.length === 0 ? (
                <p className="text-blue-300/60 text-center py-8">No entries yet. Add your first entry!</p>
              ) : (
                <div className="space-y-3">
                  {cashflowData.map((entry, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-xl border border-blue-400/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cyan-400 font-bold">{entry.month} {entry.year}</span>
                        <span className={`font-bold ${entry.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ₹{entry.netCashFlow.toFixed(2)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-blue-200/80">
                        <div>Inflow: ₹{entry.cashInflow.toFixed(2)}</div>
                        <div>Outflow: ₹{entry.cashOutflow.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Prediction Chart */}
        {showPrediction && predictions.length > 0 && (
          <Card 
            className="mt-8 backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/60 rounded-3xl overflow-hidden animate-in fade-in duration-700"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-black text-blue-100">AI Prediction Results</CardTitle>
                  <CardDescription className="text-blue-200/70 mt-2">
                    Forecasted net cash flow for the next 6 months
                  </CardDescription>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full backdrop-blur-md border border-yellow-400/50 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm text-yellow-100 font-bold">AI Powered</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#93c5fd" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#93c5fd"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                    }}
                    labelStyle={{ color: '#93c5fd' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 6 }}
                    name="Actual Net Cash Flow"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#f59e0b', r: 6 }}
                    name="Predicted Net Cash Flow"
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Prediction Values */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.map((pred, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                  >
                    <p className="text-cyan-300 text-sm font-semibold">{pred.month}</p>
                    <p className={`text-2xl font-black mt-2 ${pred.predictedNetCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{pred.predictedNetCashFlow.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-blue-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
            Powered by Linear Regression AI Model ✨
          </p>
        </div>
      </main>
    </div>
  );
};

export default CashFlow;