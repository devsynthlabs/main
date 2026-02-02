import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Calculator, Sparkles, DollarSign, Search, FileText, Database } from "lucide-react";

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
  pfDeduction: string;
  taxDeduction: string;
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
  pfDeduction: number;
  taxDeduction: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  createdAt: string;
}

const Payroll = () => {
  const navigate = useNavigate();
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
    otherAllowance: "",
    bonuses: "",
    pfDeduction: "",
    taxDeduction: "",
  });

  const [netSalary, setNetSalary] = useState<number | null>(null);
  const [grossSalary, setGrossSalary] = useState<number | null>(null);
  const [totalDeductions, setTotalDeductions] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<PayrollRecord[]>([]);

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
        pfDeduction: 3300,
        taxDeduction: 8660,
        grossSalary: 75000,
        totalDeductions: 11960,
        netSalary: 63040,
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
        pfDeduction: 2000,
        taxDeduction: 5300,
        grossSalary: 106000,
        totalDeductions: 7300,
        netSalary: 98700,
        createdAt: "2024-01-14"
      }
    ];

    setPayrollHistory(sampleData);
    setFilteredHistory(sampleData);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const da = parseFloat(formData.da) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const travelAllowance = parseFloat(formData.travelAllowance) || 0;
    const otherAllowance = parseFloat(formData.otherAllowance) || 0;
    const bonus = parseFloat(formData.bonuses) || 0;
    const pfDeductionInput = parseFloat(formData.pfDeduction) || 0;
    const taxDeductionInput = parseFloat(formData.taxDeduction) || 0;

    const grossSalaryCalc = basic + da + hra + travelAllowance + otherAllowance + bonus;
    const totalDeductionsCalc = pfDeductionInput + taxDeductionInput;
    const netSalaryCalc = grossSalaryCalc - totalDeductionsCalc;

    setGrossSalary(grossSalaryCalc);
    setTotalDeductions(totalDeductionsCalc);
    setNetSalary(netSalaryCalc);
    setShowResult(true);

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
      pfDeduction: pfDeductionInput,
      taxDeduction: taxDeductionInput,
      grossSalary: grossSalaryCalc,
      totalDeductions: totalDeductionsCalc,
      netSalary: netSalaryCalc,
      createdAt: new Date().toLocaleDateString()
    };

    setPayrollHistory(prev => [newRecord, ...prev]);
    setFilteredHistory(prev => [newRecord, ...prev]);
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

Generated by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED
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
              <p className="text-blue-200/80 font-medium mt-1">Calculate and track salary slips</p>
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
                  Enter employee details below to calculate net salary
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: "basicSalary", label: "Basic Salary" },
                    { id: "da", label: "DA" },
                    { id: "hra", label: "HRA" },
                    { id: "travelAllowance", label: "Travel Allowance" },
                    { id: "otherAllowance", label: "Other Allowance" },
                    { id: "bonuses", label: "Bonuses" },
                    { id: "pfDeduction", label: "PF Deduction" },
                    { id: "taxDeduction", label: "Tax Deduction" }
                  ].map((field) => (
                    <div key={field.id} className="space-y-3">
                      <Label className="text-blue-100 font-bold">{field.label} (₹)</Label>
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

                <Button
                  onClick={calculateSalary}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate & Add to History
                </Button>

                {showResult && netSalary !== null && grossSalary !== null && totalDeductions !== null && (
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
                          otherAllowance: parseFloat(formData.otherAllowance) || 0,
                          bonuses: parseFloat(formData.bonuses) || 0,
                          pfDeduction: parseFloat(formData.pfDeduction) || 0,
                          taxDeduction: parseFloat(formData.taxDeduction) || 0,
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
                          <h3 className="font-bold text-xl text-blue-100">{record.employeeName}</h3>
                          <Badge variant="outline" className="border-blue-400/40 text-blue-300">{record.employeeRole}</Badge>
                        </div>
                        <p className="text-sm text-blue-400">ID: {record.employeeId} | Dept: {record.employeeDepartment} | Date: {record.createdAt}</p>
                        <p className="text-lg font-bold text-cyan-400 mt-2">Net Salary: ₹{record.netSalary.toFixed(2)}</p>
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