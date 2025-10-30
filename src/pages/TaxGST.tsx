import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator, Sparkles, Receipt, Shield, TrendingUp } from "lucide-react";

interface Trail {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Results {
  baseAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  type: string;
}

const TaxGST = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Trail[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [transactionType, setTransactionType] = useState("intrastate");
  const [results, setResults] = useState<Results | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Mouse tracking with trail effect
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

  const calculateGST = async () => {
    const baseAmount = parseFloat(amount) || 0;
    const rate = parseFloat(gstRate) / 100;

    let cgst = 0, sgst = 0, igst = 0, total = 0, typeLabel = "";

    if (transactionType === "intrastate") {
      cgst = baseAmount * (rate / 2);
      sgst = baseAmount * (rate / 2);
      total = baseAmount + cgst + sgst;
      typeLabel = "Intrastate (CGST + SGST)";
    } else {
      igst = baseAmount * rate;
      total = baseAmount + igst;
      typeLabel = "Interstate (IGST)";
    }

    const result: Results = { baseAmount, cgst, sgst, igst, total, type: typeLabel };
    setResults(result);
    setShowResult(true);

    const taxData = {
      baseAmount,
      gstRate: parseFloat(gstRate),
      transactionType,
      cgst,
      sgst,
      igst,
      total,
    };

    try {
      const res = await fetch("http://localhost:5000/api/tax/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taxData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error saving data:", data);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
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
          <div className={`absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
            isHovering ? 'bg-yellow-400 scale-150 shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
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
              <Receipt className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Tax & GST Management
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Calculate and store GST, CGST, SGST, and IGST data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Card 
          className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40 hover:-translate-y-2"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl" />
          
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black text-blue-100 flex items-center gap-3">
                  <Calculator className="h-7 w-7 text-cyan-400 hover:rotate-12 transition-transform duration-300" />
                  GST Calculator
                </CardTitle>
                <CardDescription className="text-blue-200/70 mt-2 text-base">
                  Enter transaction details to calculate and save applicable taxes
                </CardDescription>
              </div>
              <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-blue-200 font-semibold">Live System</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* Base Amount Input */}
            <div className="space-y-3 group">
              <Label htmlFor="amount" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Base Amount (₹)
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter transaction amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-14 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10 text-lg"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <p className="text-blue-300/60 text-sm pl-1">
                💡 Enter the base amount before tax calculation
              </p>
            </div>

            {/* GST Rate and Transaction Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GST Rate */}
              <div className="space-y-3 group">
                <Label htmlFor="gstRate" className="text-blue-100 font-bold flex items-center gap-2">
                  <span>📊</span>
                  GST Rate (%)
                </Label>
                <Select value={gstRate} onValueChange={setGstRate}>
                  <SelectTrigger 
                    className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 hover:bg-white/10 transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <SelectValue placeholder="Select GST rate" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl">
                    <SelectItem value="5" className="hover:bg-blue-500/20 cursor-pointer">5%</SelectItem>
                    <SelectItem value="12" className="hover:bg-blue-500/20 cursor-pointer">12%</SelectItem>
                    <SelectItem value="18" className="hover:bg-blue-500/20 cursor-pointer">18%</SelectItem>
                    <SelectItem value="28" className="hover:bg-blue-500/20 cursor-pointer">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction Type */}
              <div className="space-y-3 group">
                <Label htmlFor="transactionType" className="text-blue-100 font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  Transaction Type
                </Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger 
                    className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 hover:bg-white/10 transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl">
                    <SelectItem value="intrastate" className="hover:bg-blue-500/20 cursor-pointer">
                      Intrastate (CGST + SGST)
                    </SelectItem>
                    <SelectItem value="interstate" className="hover:bg-blue-500/20 cursor-pointer">
                      Interstate (IGST)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={calculateGST}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/70 border border-blue-400/30"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate & Save GST
              </Button>
            </div>

            {/* Results Display */}
            {showResult && results && (
              <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/60 rounded-3xl overflow-hidden animate-in fade-in duration-700 relative mt-8">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full backdrop-blur-md border border-cyan-400/50 flex items-center gap-1 shadow-lg shadow-cyan-400/30">
                  <TrendingUp className="h-3 w-3 text-cyan-300" />
                  <span className="text-xs text-cyan-100 font-bold">Calculated</span>
                </div>

                <CardHeader className="relative">
                  <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                    <Receipt className="h-6 w-6 text-cyan-400" />
                    Tax Summary - {results.type}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 blur-2xl" />
                  
                  <div className="relative z-10 space-y-3">
                    {/* Base Amount */}
                    <div className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300">
                      <span className="text-white/90 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                        Base Amount
                      </span>
                      <span className="font-bold text-white text-lg">₹{results.baseAmount.toFixed(2)}</span>
                    </div>

                    {/* CGST and SGST (Intrastate) */}
                    {results.cgst > 0 && (
                      <>
                        <div className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300">
                          <span className="text-white/90 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            CGST ({parseFloat(gstRate) / 2}%)
                          </span>
                          <span className="font-bold text-white text-lg">₹{results.cgst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300">
                          <span className="text-white/90 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            SGST ({parseFloat(gstRate) / 2}%)
                          </span>
                          <span className="font-bold text-white text-lg">₹{results.sgst.toFixed(2)}</span>
                        </div>
                      </>
                    )}

                    {/* IGST (Interstate) */}
                    {results.igst > 0 && (
                      <div className="flex justify-between items-center p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300">
                        <span className="text-white/90 font-medium flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                          IGST ({gstRate}%)
                        </span>
                        <span className="font-bold text-white text-lg">₹{results.igst.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Total Amount - Highlighted */}
                    <div className="flex justify-between items-center p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-cyan-600/40 to-blue-600/40 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/50 mt-6">
                      <span className="text-xl font-black text-white drop-shadow-lg">Total Amount</span>
                      <span className="text-4xl font-black text-white drop-shadow-[0_0_30px_rgba(6,182,212,0.9)] animate-pulse">
                        ₹{results.total.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-center text-sm text-white/70 mt-4 flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                      Tax breakdown saved to database
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Bottom floating info */}
        <div className="mt-8 text-center">
          <p className="text-blue-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
            Powered by Advanced Tax Calculation Engine ✨
          </p>
        </div>
      </main>
    </div>
  );
};

export default TaxGST;