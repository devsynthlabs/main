import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Calculator, Sparkles, DollarSign, Search, FileText, Database, TrendingUp, Shield } from "lucide-react";
import { API_ENDPOINTS, apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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
  overtimeAllowance: string;
  otherAllowance: string;
  bonuses: string;
  pfDeduction: string;
  epfDeduction: string;
  esiDeduction: string;
  taxDeduction: string;
  extraLeaveDeduction: string;
  advanceRecoveryDeduction: string;
  loanDeduction: string;
  otherDeduction: string;
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
  overtimeAllowance: number;
  otherAllowance: number;
  bonuses: number;
  pfDeduction: number;
  epfDeduction: number;
  esiDeduction: number;
  taxDeduction: number;
  extraLeaveDeduction: number;
  advanceRecoveryDeduction: number;
  loanDeduction: number;
  otherDeduction: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  createdAt: string;
}

const Payroll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("calculator");

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
    overtimeAllowance: "",
    otherAllowance: "",
    bonuses: "",
    pfDeduction: "",
    epfDeduction: "",
    esiDeduction: "",
    taxDeduction: "",
    extraLeaveDeduction: "",
    advanceRecoveryDeduction: "",
    loanDeduction: "",
    otherDeduction: "",
  });

  const [netSalary, setNetSalary] = useState<number | null>(null);
  const [grossSalary, setGrossSalary] = useState<number | null>(null);
  const [totalDeductions, setTotalDeductions] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PayrollRecord[]>([]);
  const [aiInsight, setAiInsight] = useState<string>("");

  const fetchHistory = async () => {
    try {
      const res = await apiRequest(`${API_ENDPOINTS.PAYROLL}/all`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const mappedData = data.map((item: any) => ({
            ...item,
            id: item._id || item.id,
            createdAt: new Date(item.createdAt).toLocaleDateString()
          }));
          setPayrollHistory(mappedData);
          setFilteredHistory(mappedData);
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching payroll data from DB:", error);
    }

    // Fallback to sample data if database is empty or fetch fails
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
        overtimeAllowance: 2000,
        otherAllowance: 2000,
        bonuses: 5000,
        pfDeduction: 3300,
        epfDeduction: 9000,
        esiDeduction: 1200,
        taxDeduction: 8660,
        extraLeaveDeduction: 0,
        advanceRecoveryDeduction: 0,
        loanDeduction: 0,
        otherDeduction: 0,
        grossSalary: 77000,
        totalDeductions: 22160,
        netSalary: 54840,
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
        overtimeAllowance: 3000,
        otherAllowance: 3000,
        bonuses: 8000,
        pfDeduction: 2000,
        epfDeduction: 12720,
        esiDeduction: 1400,
        taxDeduction: 5300,
        extraLeaveDeduction: 0,
        advanceRecoveryDeduction: 0,
        loanDeduction: 0,
        otherDeduction: 0,
        grossSalary: 109000,
        totalDeductions: 21420,
        netSalary: 87580,
        createdAt: "2024-01-14"
      }
    ];

    setPayrollHistory(sampleData);
    setFilteredHistory(sampleData);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate AI insights based on salary calculations
  const generateAIInsight = (gross: number, net: number, deductions: number, epf: number, esi: number, tax: number) => {
    const deductionPercentage = (deductions / gross) * 100;
    const netPercentage = (net / gross) * 100;
    
    if (deductionPercentage > 40) {
      return "⚠️ High deduction rate detected (>40%). Consider reviewing tax saving investments to reduce TDS liability.";
    } else if (deductionPercentage < 20) {
      return "✅ Optimal deduction structure! Your net take-home is excellent at " + netPercentage.toFixed(1) + "% of gross.";
    } else if (epf > 10000) {
      return "💰 Strong EPF contribution building long-term retirement corpus. Current EPF: ₹" + epf.toFixed(2);
    } else if (esi > 0 && gross < 21000) {
      return "🏥 ESI benefits active. You're covered for medical expenses and disability benefits.";
    } else if (tax > 5000) {
      return "📊 Tax deduction of ₹" + tax.toFixed(2) + ". Consider Section 80C investments to optimize tax.";
    } else {
      return "💡 Salary structure is balanced. Total deductions: " + deductionPercentage.toFixed(1) + "% of gross salary.";
    }
  };

  const calculateSalary = () => {
    if (!formData.employeeName || !formData.employeeId || !formData.employeeRole || !formData.employeeDepartment) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all employee information fields before calculating.",
      });
      return;
    }

    const basic = parseFloat(formData.basicSalary) || 0;
    const da = parseFloat(formData.da) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const travelAllowance = parseFloat(formData.travelAllowance) || 0;
    const overtimeAllowance = parseFloat(formData.overtimeAllowance) || 0;
    const otherAllowance = parseFloat(formData.otherAllowance) || 0;
    const bonus = parseFloat(formData.bonuses) || 0;
    
    // New deduction fields from requirement
    const extraLeaveDeduction = parseFloat(formData.extraLeaveDeduction) || 0;
    const advanceRecoveryDeduction = parseFloat(formData.advanceRecoveryDeduction) || 0;
    const loanDeduction = parseFloat(formData.loanDeduction) || 0;
    const otherDeduction = parseFloat(formData.otherDeduction) || 0;
    const esiDeduction = parseFloat(formData.esiDeduction) || 0;

    // Calculate Gross Salary (following requirement formula)
    const grossSalaryCalc = basic + da + hra + travelAllowance + overtimeAllowance + otherAllowance + bonus - extraLeaveDeduction;
    
    // Auto-calculate EPF (12% of gross) and Tax (5% of gross) per requirement
    const epfDeductionCalc = 0.12 * grossSalaryCalc;
    const taxDeductionCalc = 0.05 * grossSalaryCalc;
    
    // Manual PF deduction (if provided, otherwise use auto)
    const manualPfDeduction = parseFloat(formData.pfDeduction) || 0;
    const finalPfDeduction = manualPfDeduction > 0 ? manualPfDeduction : epfDeductionCalc;
    
    // Total deductions (following requirement formula)
    const totalDeductionsCalc = finalPfDeduction + taxDeductionCalc + extraLeaveDeduction + esiDeduction + advanceRecoveryDeduction + loanDeduction + otherDeduction;
    
    const netSalaryCalc = grossSalaryCalc - totalDeductionsCalc;

    // Update state
    setGrossSalary(grossSalaryCalc);
    setTotalDeductions(totalDeductionsCalc);
    setNetSalary(netSalaryCalc);
    setShowResult(true);
    
    // Generate AI insight
    const insight = generateAIInsight(grossSalaryCalc, netSalaryCalc, totalDeductionsCalc, finalPfDeduction, esiDeduction, taxDeductionCalc);
    setAiInsight(insight);

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
      overtimeAllowance: overtimeAllowance,
      otherAllowance: otherAllowance,
      bonuses: bonus,
      pfDeduction: finalPfDeduction,
      epfDeduction: epfDeductionCalc,
      esiDeduction: esiDeduction,
      taxDeduction: taxDeductionCalc,
      extraLeaveDeduction: extraLeaveDeduction,
      advanceRecoveryDeduction: advanceRecoveryDeduction,
      loanDeduction: loanDeduction,
      otherDeduction: otherDeduction,
      grossSalary: grossSalaryCalc,
      totalDeductions: totalDeductionsCalc,
      netSalary: netSalaryCalc,
      createdAt: new Date().toISOString()
    };

    // Save to local database
    const savePayroll = async (record: PayrollRecord) => {
      try {
        const res = await apiRequest(`${API_ENDPOINTS.PAYROLL}/add`, {
          method: "POST",
          body: JSON.stringify(record),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to save payroll to DB");
        // Reload history from DB
        fetchHistory();
      } catch (err) {
        console.error("Error saving payroll to database:", err);
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Could not save to database, using local state fallback.",
        });
        setPayrollHistory(prev => [record, ...prev]);
        setFilteredHistory(prev => [record, ...prev]);
      }
    };

    savePayroll(newRecord);
  };

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

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(payrollHistory);
    }
  }, [searchTerm, payrollHistory]);

  const downloadSlip = (record: PayrollRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // 1. Blue Header Banner
    doc.setFillColor(26, 54, 164);
    doc.rect(0, 0, pageWidth, 38, "F");

    // Company Name (white, small uppercase, centered)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED", pageWidth / 2, 14, { align: "center" });

    // Main Title
    doc.setFontSize(18);
    doc.text("PAYROLL SLIP", pageWidth / 2, 26, { align: "center" });

    // 2. Subtitle Date
    const formattedDate = record.createdAt ? new Date(record.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Statement Date: ${formattedDate}`, pageWidth / 2, 48, { align: "center" });

    // Format Currency Helper
    const formatCurrency = (val: any) => `Rs. ${(parseFloat(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const startX = 15;
    const contentWidth = pageWidth - 30; // 180mm

    // --- EMPLOYEE DETAILS BLOCK ---
    let y = 56;
    doc.setFillColor(248, 250, 252); // Very light grey/slate
    doc.rect(startX, y, contentWidth, 32, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(startX, y, contentWidth, 32, "S");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text("EMPLOYEE DETAILS", startX + 5, y + 6);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    
    // Left column details
    doc.text(`Name: ${record.employeeName || "N/A"}`, startX + 5, y + 14);
    doc.text(`Employee ID: ${record.employeeId || "N/A"}`, startX + 5, y + 21);
    doc.text(`Experience: ${record.employeeExperience ?? 0} Years`, startX + 5, y + 28);
    
    // Right column details
    doc.text(`Role: ${record.employeeRole || "N/A"}`, startX + contentWidth / 2, y + 14);
    doc.text(`Department: ${record.employeeDepartment || "N/A"}`, startX + contentWidth / 2, y + 21);

    // --- EARNINGS & DEDUCTIONS SIDE BY SIDE ---
    y += 40;
    const colWidth = (contentWidth - 10) / 2; // 85mm each
    const rightColX = startX + colWidth + 10;
    
    // Earnings header
    doc.setFillColor(239, 246, 255); // Very light blue
    doc.rect(startX, y, colWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(29, 78, 216); // Blue text
    doc.text("EARNINGS", startX + 3, y + 5.5);
    
    // Deductions header
    doc.setFillColor(254, 242, 242); // Very light red
    doc.rect(rightColX, y, colWidth, 8, "F");
    doc.setTextColor(220, 38, 38); // Red text
    doc.text("DEDUCTIONS", rightColX + 3, y + 5.5);
    
    // List values
    const safeNum = (val: any) => (typeof val === 'number' ? val : parseFloat(val) || 0);

    const earnings = [
      { label: "Basic Salary", val: safeNum(record.basicSalary) },
      { label: "Dearness Allowance (DA)", val: safeNum(record.da) },
      { label: "House Rent Allowance (HRA)", val: safeNum(record.hra) },
      { label: "Travel Allowance", val: safeNum(record.travelAllowance) },
      { label: "Overtime Allowance", val: safeNum(record.overtimeAllowance) },
      { label: "Other Allowance", val: safeNum(record.otherAllowance) },
      { label: "Bonuses", val: safeNum(record.bonuses) },
    ];
    
    const deductions = [
      { label: "PF Deduction (Manual)", val: safeNum(record.pfDeduction) },
      { label: "EPF Deduction (Auto 12%)", val: safeNum(record.epfDeduction) },
      { label: "ESI Deduction", val: safeNum(record.esiDeduction) },
      { label: "Tax Deduction (Auto 5%)", val: safeNum(record.taxDeduction) },
      { label: "Extra Leave", val: safeNum(record.extraLeaveDeduction) },
      { label: "Advance Recovery", val: safeNum(record.advanceRecoveryDeduction) },
      { label: "Loan Deduction", val: safeNum(record.loanDeduction) },
      { label: "Other Deduction", val: safeNum(record.otherDeduction) },
    ];

    let currentY = y + 14;
    doc.setFontSize(8.5);
    
    const maxRows = Math.max(earnings.length, deductions.length);
    for (let i = 0; i < maxRows; i++) {
      // Draw earnings row
      if (i < earnings.length) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(earnings[i].label, startX + 3, currentY);
        doc.text(formatCurrency(earnings[i].val), startX + colWidth - 3, currentY, { align: "right" });
        doc.setDrawColor(240, 240, 240);
        doc.line(startX, currentY + 2.5, startX + colWidth, currentY + 2.5);
      }
      
      // Draw deductions row
      if (i < deductions.length) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(deductions[i].label, rightColX + 3, currentY);
        doc.text(formatCurrency(deductions[i].val), rightColX + colWidth - 3, currentY, { align: "right" });
        doc.setDrawColor(240, 240, 240);
        doc.line(rightColX, currentY + 2.5, rightColX + colWidth, currentY + 2.5);
      }
      
      currentY += 8;
    }
    
    // Totals Rows
    currentY += 2;
    // Gross Salary Row
    doc.setFillColor(248, 250, 252);
    doc.rect(startX, currentY, colWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("GROSS SALARY", startX + 3, currentY + 5.5);
    doc.text(formatCurrency(safeNum(record.grossSalary)), startX + colWidth - 3, currentY + 5.5, { align: "right" });
    
    // Total Deductions Row
    doc.setFillColor(248, 250, 252);
    doc.rect(rightColX, currentY, colWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("TOTAL DEDUCTIONS", rightColX + 3, currentY + 5.5);
    doc.text(formatCurrency(safeNum(record.totalDeductions)), rightColX + colWidth - 3, currentY + 5.5, { align: "right" });

    // --- NET PAYABLE BANNER ---
    currentY += 18;
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(startX, currentY, contentWidth, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text("NET PAYABLE AMOUNT", startX + 5, currentY + 7.5);
    doc.setTextColor(147, 197, 253); // Light blue
    doc.text(formatCurrency(safeNum(record.netSalary)), startX + contentWidth - 5, currentY + 7.5, { align: "right" });

    // --- FOOTER ---
    currentY += 25;
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, currentY, startX + contentWidth, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text("Generated by Advanced Payroll Engine v2.0  |  Powered by SHREE ANDAL AI SOLUTIONS (OPC) PRIVATE LIMITED", pageWidth / 2, currentY + 5, { align: "center" });

    // Save PDF
    doc.save(`Salary_Slip_${(record.employeeName || "employee").replace(/\s+/g, "_")}_${Date.now()}.pdf`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

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
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Payroll Automation
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Calculate and track salary slips with AI insights</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-2xl p-1">
            <TabsTrigger value="calculator" className="flex items-center gap-2 rounded-xl transition-all duration-300">
              <Calculator className="h-4 w-4" />
              Salary Calculator
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 rounded-xl transition-all duration-300">
              <FileText className="h-4 w-4" />
              Calculation History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-3xl font-black text-blue-100 flex items-center gap-3">
                  <Calculator className="h-7 w-7 text-cyan-400" />
                  Employee Salary Calculator
                </CardTitle>
                <CardDescription className="text-blue-200/70 mt-2 text-base">
                  Enter employee details below - EPF (12%) and Tax (5%) are auto-calculated
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-blue-100 font-bold text-lg">Employee Name</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter full name"
                        value={formData.employeeName}
                        onChange={(e) => handleInputChange("employeeName", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange("employeeName", text)}
                        onClear={() => handleInputChange("employeeName", "")}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-100 font-bold text-lg">Employee ID</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter ID"
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange("employeeId", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange("employeeId", text)}
                        onClear={() => handleInputChange("employeeId", "")}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-100 font-bold text-lg">Employee Role</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter role"
                        value={formData.employeeRole}
                        onChange={(e) => handleInputChange("employeeRole", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange("employeeRole", text)}
                        onClear={() => handleInputChange("employeeRole", "")}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-100 font-bold text-lg">Department</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter department"
                        value={formData.employeeDepartment}
                        onChange={(e) => handleInputChange("employeeDepartment", e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange("employeeDepartment", text)}
                        onClear={() => handleInputChange("employeeDepartment", "")}
                      />
                    </div>
                  </div>
                </div>

                {/* Earnings Section */}
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Earnings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: "basicSalary", label: "Basic Salary", required: true },
                      { id: "da", label: "Dearness Allowance (DA)" },
                      { id: "hra", label: "House Rent Allowance (HRA)" },
                      { id: "travelAllowance", label: "Travel Allowance" },
                      { id: "overtimeAllowance", label: "Overtime Allowance" },
                      { id: "otherAllowance", label: "Other Allowance" },
                      { id: "bonuses", label: "Bonuses" }
                    ].map((field) => (
                      <div key={field.id} className="space-y-3">
                        <Label className="text-blue-100 font-bold">{field.label} {field.required && <span className="text-red-400">*</span>} (₹)</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={formData[field.id as keyof FormData]}
                            onChange={(e) => handleInputChange(field.id as keyof FormData, e.target.value)}
                            className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                          />
                          <VoiceButton
                            onTranscript={(text) => handleInputChange(field.id as keyof FormData, text)}
                            onClear={() => handleInputChange(field.id as keyof FormData, "")}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deductions Section */}
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Deductions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: "pfDeduction", label: "PF Deduction (Manual, optional)" },
                      { id: "epfDeduction", label: "EPF Deduction (Auto: 12% of Gross)", auto: true, readOnly: true },
                      { id: "esiDeduction", label: "ESI Deduction" },
                      { id: "taxDeduction", label: "Tax Deduction (Auto: 5% of Gross)", auto: true, readOnly: true },
                      { id: "extraLeaveDeduction", label: "Extra Leave Deduction" },
                      { id: "advanceRecoveryDeduction", label: "Advance Recovery Deduction" },
                      { id: "loanDeduction", label: "Loan Deduction" },
                      { id: "otherDeduction", label: "Other Deduction" }
                    ].map((field) => (
                      <div key={field.id} className="space-y-3">
                        <Label className="text-blue-100 font-bold">{field.label} (₹)</Label>
                        <Input
                          type="number"
                          placeholder={field.auto ? "Auto-calculated on submit" : "0.00"}
                          value={formData[field.id as keyof FormData]}
                          onChange={(e) => !field.readOnly && handleInputChange(field.id as keyof FormData, e.target.value)}
                          readOnly={field.readOnly}
                          className={`bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12 ${field.readOnly ? 'opacity-60' : ''}`}
                        />
                        {field.auto && (
                          <p className="text-xs text-cyan-400 mt-1">✓ Auto-calculated when you click Calculate</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={calculateSalary}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate & Add to History
                </Button>

                {showResult && netSalary !== null && grossSalary !== null && totalDeductions !== null && (
                  <>
                    {/* AI Insights Card */}
                    <Card className="backdrop-blur-2xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-2 border-purple-400/60 rounded-2xl p-6">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-purple-300 font-bold text-lg mb-2">AI Salary Insight</h3>
                          <p className="text-purple-100">{aiInsight}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Salary Breakdown */}
                    <Card className="backdrop-blur-2xl bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-indigo-900/90 border-2 border-cyan-400/60 shadow-2xl rounded-3xl p-8 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 animate-pulse" />
                      <h3 className="text-2xl text-cyan-300 mb-6 font-bold uppercase">Salary Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-4 bg-white/5 rounded-2xl border border-blue-400/20">
                          <p className="text-blue-200 mb-1">Gross Salary</p>
                          <p className="text-2xl font-bold text-green-400">₹{grossSalary.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-red-400/20">
                          <p className="text-red-300 mb-1">Total Deductions</p>
                          <p className="text-2xl font-bold text-red-400">₹{totalDeductions.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-cyan-400/20">
                          <p className="text-cyan-200 mb-1">Net Salary</p>
                          <p className="text-2xl font-bold text-white">₹{netSalary.toFixed(2)}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          const rec = {
                            ...formData,
                            basicSalary: parseFloat(formData.basicSalary) || 0,
                            da: parseFloat(formData.da) || 0,
                            hra: parseFloat(formData.hra) || 0,
                            travelAllowance: parseFloat(formData.travelAllowance) || 0,
                            overtimeAllowance: parseFloat(formData.overtimeAllowance) || 0,
                            otherAllowance: parseFloat(formData.otherAllowance) || 0,
                            bonuses: parseFloat(formData.bonuses) || 0,
                            pfDeduction: parseFloat(formData.pfDeduction) || 0,
                            epfDeduction: 0.12 * (parseFloat(formData.basicSalary) || 0 + parseFloat(formData.da) || 0 + parseFloat(formData.hra) || 0 + parseFloat(formData.travelAllowance) || 0 + parseFloat(formData.overtimeAllowance) || 0 + parseFloat(formData.otherAllowance) || 0 + parseFloat(formData.bonuses) || 0 - (parseFloat(formData.extraLeaveDeduction) || 0)),
                            esiDeduction: parseFloat(formData.esiDeduction) || 0,
                            taxDeduction: 0.05 * (parseFloat(formData.basicSalary) || 0 + parseFloat(formData.da) || 0 + parseFloat(formData.hra) || 0 + parseFloat(formData.travelAllowance) || 0 + parseFloat(formData.overtimeAllowance) || 0 + parseFloat(formData.otherAllowance) || 0 + parseFloat(formData.bonuses) || 0 - (parseFloat(formData.extraLeaveDeduction) || 0)),
                            extraLeaveDeduction: parseFloat(formData.extraLeaveDeduction) || 0,
                            advanceRecoveryDeduction: parseFloat(formData.advanceRecoveryDeduction) || 0,
                            loanDeduction: parseFloat(formData.loanDeduction) || 0,
                            otherDeduction: parseFloat(formData.otherDeduction) || 0,
                            grossSalary,
                            totalDeductions,
                            netSalary,
                            id: Date.now().toString(),
                            createdAt: new Date().toLocaleDateString(),
                            employeeExperience: parseFloat(formData.employeeExperience) || 0
                          };
                          downloadSlip(rec);
                        }}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Download className="mr-2 h-5 w-5" /> Download Salary Slip
                      </Button>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/30 rounded-3xl p-6">
              <div className="flex gap-3 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                  <Input
                    placeholder="Search by name, ID, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-white/5 text-blue-100 border-blue-400/30 rounded-2xl"
                  />
                </div>
                <Button onClick={handleSearch} className="h-12 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl">
                  Search
                </Button>
              </div>

              <div className="space-y-4">
                {filteredHistory.map((record) => (
                  <Card key={record.id} className="bg-white/5 border border-blue-400/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-xl text-blue-100">{record.employeeName || "N/A"}</h3>
                          <Badge variant="outline" className="border-blue-400/40 text-blue-300">{record.employeeRole || "Employee"}</Badge>
                        </div>
                        <p className="text-sm text-blue-400">ID: {record.employeeId || "N/A"} | Dept: {record.employeeDepartment || "N/A"} | Date: {record.createdAt || "N/A"}</p>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm text-green-400">Gross: ₹{(record.grossSalary ?? 0).toFixed(2)}</p>
                          <p className="text-lg font-bold text-cyan-400">Net: ₹{(record.netSalary ?? 0).toFixed(2)}</p>
                        </div>
                      </div>
                      <Button onClick={() => downloadSlip(record)} variant="outline" className="border-blue-400/40 text-blue-300 hover:bg-blue-400/10">
                        <Download className="mr-2 h-4 w-4" /> Download Slip
                      </Button>
                    </div>
                  </Card>
                ))}
                {filteredHistory.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-blue-400/20 mx-auto mb-4" />
                    <p className="text-blue-300/60">No records found.</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Payroll;