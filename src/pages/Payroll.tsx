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
import { ArrowLeft, Download, Calculator, Sparkles, DollarSign, Search, FileText, Database } from "lucide-react";
import { VoiceButton } from "@/components/ui/VoiceButton";

interface FormData {
  employeeName: string;
  employeeId: string;
  employeeRole: string;
  employeeDepartment: string;
  employeeExperience: string;
  basicSalary: string;
  da: string;
  hra: string;
  travelAllowance: string;
  otherAllowance: string;
  bonuses: string;
  pfDeduction: string; // Added PF Deduction input
  taxDeduction: string; // Added Tax Deduction input
}

interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  employeeRole: string;
  employeeDepartment: string;
  employeeExperience: number;
  basicSalary: number;
  da: number;
  hra: number;
  travelAllowance: number;
  otherAllowance: number;
  bonuses: number;
  pfDeduction: number; // Added PF Deduction
  taxDeduction: number; // Added Tax Deduction
  grossSalary: number;
  totalDeductions: number; // Added total deductions
  netSalary: number;
  createdAt: string;
}

const Payroll = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("calculator");

  // Calculator State
  const [formData, setFormData] = useState<FormData>({
    employeeName: "",
    employeeId: "",
    employeeRole: "",
    employeeDepartment: "",
    employeeExperience: "",
    basicSalary: "",
    da: "",
    hra: "",
    travelAllowance: "",
    otherAllowance: "",
    bonuses: "",
    pfDeduction: "", // Initialize PF Deduction
    taxDeduction: "", // Initialize Tax Deduction
  });

  // Results State
  const [netSalary, setNetSalary] = useState<number | null>(null);
  const [grossSalary, setGrossSalary] = useState<number | null>(null);
  const [totalDeductions, setTotalDeductions] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // History State - Stores all calculations in current session
  const [searchTerm, setSearchTerm] = useState("");
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PayrollRecord[]>([]);

  // Mouse tracking for background animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize with some sample data (updated with PF and Tax deductions)
  useEffect(() => {
    const sampleData: PayrollRecord[] = [
      {
        id: "1",
        employeeName: "John Doe",
        employeeId: "EMP001",
        employeeRole: "Software Engineer",
        employeeDepartment: "IT",
        employeeExperience: 3,
        basicSalary: 50000,
        da: 5000,
        hra: 10000,
        travelAllowance: 3000,
        otherAllowance: 2000,
        bonuses: 5000,
        pfDeduction: 3300, // Added PF Deduction
        taxDeduction: 8660, // Added Tax Deduction
        grossSalary: 75000,
        totalDeductions: 11960, // PF + Tax deductions
        netSalary: 63040, // Updated net salary
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        employeeName: "Jane Smith",
        employeeId: "EMP002",
        employeeRole: "Product Manager",
        employeeDepartment: "Product",
        employeeExperience: 5,
        basicSalary: 70000,
        da: 7000,
        hra: 14000,
        travelAllowance: 4000,
        otherAllowance: 3000,
        bonuses: 8000,
        pfDeduction: 2000, // Added PF Deduction
        taxDeduction: 5300, // Added Tax Deduction
        grossSalary: 106000,
        totalDeductions: 7300, // PF + Tax deductions
        netSalary: 98700, // Updated net salary
        createdAt: "2024-01-14"
      }
    ];
    
    setPayrollHistory(sampleData);
    setFilteredHistory(sampleData);
  }, []);

  // Function to update form inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to calculate net salary and add to history
  const calculateSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const da = parseFloat(formData.da) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const travelAllowance = parseFloat(formData.travelAllowance) || 0;
    const otherAllowance = parseFloat(formData.otherAllowance) || 0;
    const bonus = parseFloat(formData.bonuses) || 0;
    const pfDeductionInput = parseFloat(formData.pfDeduction) || 0; // Get PF Deduction input
    const taxDeductionInput = parseFloat(formData.taxDeduction) || 0; // Get Tax Deduction input

    // Python calculation logic - Updated to include manual deductions
    const grossSalaryCalc = basic + da + hra + travelAllowance + otherAllowance + bonus;
    const totalDeductionsCalc = pfDeductionInput + taxDeductionInput;
    const netSalaryCalc = grossSalaryCalc - totalDeductionsCalc;

    setGrossSalary(grossSalaryCalc);
    setTotalDeductions(totalDeductionsCalc);
    setNetSalary(netSalaryCalc);
    setShowResult(true);

    // Create new payroll record
    const newRecord: PayrollRecord = {
      id: Date.now().toString(),
      employeeName: formData.employeeName,
      employeeId: formData.employeeId,
      employeeRole: formData.employeeRole,
      employeeDepartment: formData.employeeDepartment,
      employeeExperience: parseFloat(formData.employeeExperience) || 0,
      basicSalary: basic,
      da: da,
      hra: hra,
      travelAllowance: travelAllowance,
      otherAllowance: otherAllowance,
      bonuses: bonus,
      pfDeduction: pfDeductionInput, // Store PF Deduction
      taxDeduction: taxDeductionInput, // Store Tax Deduction
      grossSalary: grossSalaryCalc,
      totalDeductions: totalDeductionsCalc,
      netSalary: netSalaryCalc,
      createdAt: new Date().toLocaleDateString()
    };

    // Add to history
    setPayrollHistory(prev => [newRecord, ...prev]);
    setFilteredHistory(prev => [newRecord, ...prev]);
  };

  // Search function for payroll history
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredHistory(payrollHistory);
      return;
    }

    const filtered = payrollHistory.filter(
      (record) =>
        record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeDepartment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeRole?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(filtered);
  };

  // Reset search when search term is cleared
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(payrollHistory);
    }
  }, [searchTerm, payrollHistory]);

  const downloadSlip = (record: PayrollRecord) => {
    const slipContent = `
╔════════════════════════════════════════════╗
║        SALARY SLIP - ${record.createdAt}        ║
╚════════════════════════════════════════════╝

Employee Details:
  Name: ${record.employeeName || "N/A"}
  ID: ${record.employeeId || "N/A"}
  Role: ${record.employeeRole || "N/A"}
  Department: ${record.employeeDepartment || "N/A"}
  Experience: ${record.employeeExperience || "0"} years

-------------------------------------------

EARNINGS:
  Basic Salary:     ₹${record.basicSalary.toFixed(2)}
  DA:               ₹${record.da.toFixed(2)}
  HRA:              ₹${record.hra.toFixed(2)}
  Travel Allowance: ₹${record.travelAllowance.toFixed(2)}
  Other Allowance:  ₹${record.otherAllowance.toFixed(2)}
  Bonuses:          ₹${record.bonuses.toFixed(2)}

DEDUCTIONS:
  PF Deduction:     ₹${record.pfDeduction.toFixed(2)}
  Tax Deduction:    ₹${record.taxDeduction.toFixed(2)}

-------------------------------------------
GROSS SALARY:       ₹${record.grossSalary.toFixed(2)}
TOTAL DEDUCTIONS:   ₹${record.totalDeductions.toFixed(2)}
NET SALARY:         ₹${record.netSalary.toFixed(2)}
-------------------------------------------

Generated by Financial Automation Platform
Powered by Advanced Payroll Engine ✨
    `.trim();

    const blob = new Blob([slipContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `salary_slip_${record.employeeName.replace(/\s+/g, "_")}_${Date.now()}.txt`;
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-following gradient */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-indigo-500/30 rounded-full blur-3xl transition-all duration-1000"
          style={{
            top: mousePosition.y / 20 - 400,
            left: mousePosition.x / 20 - 400,
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
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Payroll Automation
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Calculate and track salary slips</p>
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
              Salary Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              Calculation History
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
                      <Calculator className="h-7 w-7 text-cyan-400 hover:rotate-12 transition-transform duration-300" />
                      Employee Salary Calculator
                    </CardTitle>
                    <CardDescription className="text-blue-200/70 mt-2 text-base">
                      Enter employee details below to calculate net salary
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
                {/* Employee Name */}
                <div className="space-y-3 group">
                  <Label htmlFor="employeeName" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    Employee Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="employeeName"
                      placeholder="Enter full employee name"
                      value={formData.employeeName}
                      onChange={(e) => handleInputChange("employeeName", e.target.value)}
                      className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                {/* Employee Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee ID */}
                  <div className="space-y-3 group">
                    <Label htmlFor="employeeId" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      Employee ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="employeeId"
                        placeholder="Enter employee ID"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Employee Role */}
                  <div className="space-y-3 group">
                    <Label htmlFor="employeeRole" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      Employee Role
                    </Label>
                    <div className="relative">
                      <Input
                        id="employeeRole"
                        placeholder="Enter employee role"
                        value={formData.employeeRole}
                        onChange={(e) => handleInputChange("employeeRole", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Employee Department */}
                  <div className="space-y-3 group">
                    <Label htmlFor="employeeDepartment" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      Employee Department
                    </Label>
                    <div className="relative">
                      <Input
                        id="employeeDepartment"
                        placeholder="Enter department"
                        value={formData.employeeDepartment}
                        onChange={(e) => handleInputChange("employeeDepartment", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>

                  {/* Employee Experience */}
                  <div className="space-y-3 group">
                    <Label htmlFor="employeeExperience" className="text-blue-100 font-bold text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      Experience (years)
                    </Label>
                    <div className="relative">
                      <Input
                        id="employeeExperience"
                        type="number"
                        placeholder="0"
                        value={formData.employeeExperience}
                        onChange={(e) => handleInputChange("employeeExperience", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 placeholder:text-blue-300/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 hover:bg-white/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Salary Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: "basicSalary", label: "Basic Salary", icon: "💰" },
                    { id: "da", label: "DA (Dearness Allowance)", icon: "💵" },
                    { id: "hra", label: "HRA (House Rent Allowance)", icon: "🏠" },
                    { id: "travelAllowance", label: "Travel Allowance", icon: "🚗" },
                    { id: "otherAllowance", label: "Other Allowance", icon: "📊" },
                    { id: "bonuses", label: "Bonuses", icon: "🎁" },
                    { id: "pfDeduction", label: "PF Deduction", icon: "🏦" }, // Added PF Deduction
                    { id: "taxDeduction", label: "Tax Deduction", icon: "📋" } // Added Tax Deduction
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
                    onClick={calculateSalary}
                    className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/70 border border-blue-400/30"
                  >
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate & Add to History
                  </Button>
                </div>

                {/* Display Net Salary */}
                {showResult && netSalary !== null && grossSalary !== null && totalDeductions !== null && (
                  <Card 
                    className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/60 rounded-3xl overflow-hidden animate-in fade-in duration-700 relative"
                  >
                    {/* Top glow effect */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                    
                    {/* Corner badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 rounded-full backdrop-blur-md border border-yellow-400/50 flex items-center gap-1 shadow-lg shadow-yellow-400/30">
                      <Sparkles className="h-3 w-3 text-yellow-300" />
                      <span className="text-xs text-yellow-100 font-bold">Calculated</span>
                    </div>

                    <CardContent className="pt-12 pb-12 px-8 text-center relative">
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 blur-2xl" />
                      
                      <div className="relative z-10">
                        <p className="text-xl text-cyan-300 mb-4 font-semibold tracking-wide uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">Salary Breakdown</p>
                        
                        {/* Gross Salary */}
                        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-blue-400/20">
                          <p className="text-lg text-blue-200 mb-2">Gross Salary</p>
                          <p className="text-3xl font-bold text-green-400">₹{grossSalary.toFixed(2)}</p>
                        </div>

                        {/* Deductions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-white/5 rounded-2xl border border-red-400/20">
                            <p className="text-sm text-red-300 mb-1">PF Deduction</p>
                            <p className="text-xl font-semibold text-red-400">₹{parseFloat(formData.pfDeduction || '0').toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-red-400/20">
                            <p className="text-sm text-red-300 mb-1">Tax Deduction</p>
                            <p className="text-xl font-semibold text-red-400">₹{parseFloat(formData.taxDeduction || '0').toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Total Deductions */}
                        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-red-400/20">
                          <p className="text-lg text-red-300 mb-2">Total Deductions</p>
                          <p className="text-2xl font-bold text-red-400">₹{totalDeductions.toFixed(2)}</p>
                        </div>

                        {/* Net Salary */}
                        <div className="relative inline-block mb-8">
                          <p className="text-2xl text-cyan-300 mb-2 font-semibold">Net Salary</p>
                          <p className="text-7xl font-black text-white drop-shadow-[0_0_50px_rgba(6,182,212,0.9)] animate-pulse">
                            ₹{netSalary.toFixed(2)}
                          </p>
                          {/* Glow rings */}
                          <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
                        </div>
                        
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() => {
                              const currentRecord: PayrollRecord = {
                                id: Date.now().toString(),
                                employeeName: formData.employeeName,
                                employeeId: formData.employeeId,
                                employeeRole: formData.employeeRole,
                                employeeDepartment: formData.employeeDepartment,
                                employeeExperience: parseFloat(formData.employeeExperience) || 0,
                                basicSalary: parseFloat(formData.basicSalary) || 0,
                                da: parseFloat(formData.da) || 0,
                                hra: parseFloat(formData.hra) || 0,
                                travelAllowance: parseFloat(formData.travelAllowance) || 0,
                                otherAllowance: parseFloat(formData.otherAllowance) || 0,
                                bonuses: parseFloat(formData.bonuses) || 0,
                                pfDeduction: parseFloat(formData.pfDeduction) || 0,
                                taxDeduction: parseFloat(formData.taxDeduction) || 0,
                                grossSalary: grossSalary,
                                totalDeductions: totalDeductions,
                                netSalary: netSalary,
                                createdAt: new Date().toLocaleDateString()
                              };
                              downloadSlip(currentRecord);
                            }}
                            className="px-8 py-4 h-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/70 border border-cyan-400/30 group"
                          >
                            <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                            Download Slip
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
                  <CardTitle className="text-2xl font-bold text-blue-100">Calculation History</CardTitle>
                </div>
                <CardDescription className="text-blue-300/70">
                  {payrollHistory.length} calculation{payrollHistory.length !== 1 ? 's' : ''} in history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                    <Input
                      placeholder="Search by employee name, ID, department or role..."
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
                              {record.employeeName}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className="border-blue-400/40 text-blue-300 backdrop-blur-xl bg-blue-500/10 px-3 py-1 rounded-xl font-semibold group-hover:border-cyan-400/60 group-hover:text-cyan-300 transition-all duration-300"
                            >
                              {record.employeeRole}
                            </Badge>
                            <Badge className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white border-0 px-3 py-1 rounded-xl font-semibold shadow-lg shadow-green-500/30 flex items-center gap-1 group-hover:shadow-green-500/50 transition-all duration-300">
                              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                              {record.createdAt === new Date().toLocaleDateString() ? 'Today' : 'Saved'}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-blue-300/80 flex items-center gap-2 group-hover:text-blue-200 transition-colors duration-300">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-shadow duration-300" />
                              Date: {record.createdAt} | ID: {record.employeeId} | Dept: {record.employeeDepartment}
                            </p>

                            <p className="text-base font-bold text-blue-200 group-hover:text-white transition-colors duration-300">
                              Basic Salary: <span className="text-cyan-300 group-hover:text-cyan-200 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">₹{record.basicSalary.toLocaleString()}</span>
                            </p>

                            <div className="space-y-1 pl-4 border-l-2 border-blue-400/30 group-hover:border-cyan-400/50 transition-colors duration-300">
                              <p className="text-sm text-blue-300 group-hover:text-blue-200">DA: ₹{record.da.toFixed(2)} | HRA: ₹{record.hra.toFixed(2)}</p>
                              <p className="text-sm text-blue-300 group-hover:text-blue-200">Travel: ₹{record.travelAllowance.toFixed(2)} | Other: ₹{record.otherAllowance.toFixed(2)}</p>
                              <p className="text-sm text-blue-300 group-hover:text-blue-200">Bonuses: ₹{record.bonuses.toFixed(2)}</p>
                            </div>

                            <div className="space-y-1 pl-4 border-l-2 border-red-400/30 group-hover:border-red-400/50 transition-colors duration-300">
                              <p className="text-sm text-red-300 group-hover:text-red-200">PF Deduction: ₹{record.pfDeduction.toFixed(2)}</p>
                              <p className="text-sm text-red-300 group-hover:text-red-200">Tax Deduction: ₹{record.taxDeduction.toFixed(2)}</p>
                              <p className="text-sm text-red-300 group-hover:text-red-200 font-semibold">Total Deductions: ₹{record.totalDeductions.toFixed(2)}</p>
                            </div>

                            <p className="text-lg font-black text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text group-hover:from-cyan-200 group-hover:to-blue-200 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300">
                              Net Salary: ₹{record.netSalary.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <Button 
                          variant="outline"
                          onClick={() => downloadSlip(record)}
                          className="text-blue-200 border-2 border-blue-400/40 hover:bg-gradient-to-r hover:from-blue-600/80 hover:to-cyan-600/80 hover:border-cyan-400/60 hover:text-white backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-6 font-bold shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-110 group/btn"
                        >
                          <Download className="mr-2 h-5 w-5 group-hover/btn:animate-bounce" />
                          Download Slip
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
                    <p className="text-blue-300/80 text-lg font-medium">No payroll records found.</p>
                    <p className="text-blue-400/60 text-sm">Try adjusting your search terms or make a new calculation</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Bottom floating info */}
        <div className="mt-8 text-center">
          <p className="text-blue-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
            Powered by Advanced Payroll Engine ✨
          </p>
        </div>
      </main>
    </div>
  );
};

export default Payroll;