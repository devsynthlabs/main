import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Download, TrendingUp, AlertCircle, CheckCircle, Building, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DEFAULT_REPORT_COMPANY_NAME, REPORT_FOOTER_COMPANY, getReportCompanyName } from "@/lib/reportBranding";

const BalanceSheet = () => {
  const navigate = useNavigate();

  const currentAssetFields = [
    { id: "cashInHand", label: "Cash in Hand (₹)", reportLabel: "Cash in Hand", placeholder: "e.g., 150000.00" },
    { id: "tradeReceivable", label: "Trade Receivable (₹)", reportLabel: "Trade Receivable", placeholder: "e.g., 100000.00" },
    { id: "inventory", label: "Inventory (₹)", reportLabel: "Inventory", placeholder: "e.g., 200000.00" },
    { id: "currentAssetsOthers", label: "Others (₹)", reportLabel: "Others", placeholder: "e.g., 50000.00" },
  ];

  const nonCurrentAssetFields = [
    { id: "fixedAssets", label: "Fixed Assets (₹)", reportLabel: "Fixed Assets", placeholder: "e.g., 500000.00" },
    { id: "machinery", label: "Machinery (₹)", reportLabel: "Machinery", placeholder: "e.g., 300000.00" },
    { id: "laptops", label: "Laptops (₹)", reportLabel: "Laptops", placeholder: "e.g., 150000.00" },
    { id: "nonCurrentAssetsOthers", label: "Others (₹)", reportLabel: "Others", placeholder: "e.g., 50000.00" },
  ];

  const currentLiabilityFields = [
    { id: "currentTradePayable", label: "Trade Payable (₹)", reportLabel: "Trade Payable", subLabel: "Short term / Less than 1 year", placeholder: "e.g., 100000.00" },
    { id: "currentGstPayable", label: "GST Payable (₹)", reportLabel: "GST Payable", placeholder: "e.g., 100000.00" },
    { id: "currentBankLoan", label: "Bank Loan (₹)", reportLabel: "Bank Loan", placeholder: "e.g., 100000.00" },
    { id: "currentLiabilitiesOthers", label: "Others (₹)", reportLabel: "Others", placeholder: "e.g., 50000.00" },
  ];

  const nonCurrentLiabilityFields = [
    { id: "nonCurrentTradePayable", label: "Trade Payable (₹)", reportLabel: "Trade Payable", subLabel: "Long term / More than 1 year", placeholder: "e.g., 400000.00" },
    { id: "nonCurrentGstPayable", label: "GST Payable (₹)", reportLabel: "GST Payable", placeholder: "e.g., 100000.00" },
    { id: "nonCurrentBankLoan", label: "Bank Loan (₹)", reportLabel: "Bank Loan", placeholder: "e.g., 500000.00" },
    { id: "nonCurrentLiabilitiesOthers", label: "Others (₹)", reportLabel: "Others", placeholder: "e.g., 50000.00" },
  ];

  const equityFields = [
    { id: "shareCapital", label: "Share Capital (₹)", reportLabel: "Share Capital", placeholder: "e.g., 1000000.00" },
    { id: "reservesSurplus", label: "Reserves & Surplus (₹)", reportLabel: "Reserves & Surplus", placeholder: "e.g., 500000.00" },
    { id: "equityOthers", label: "Others (₹)", reportLabel: "Others", placeholder: "e.g., 100000.00" },
  ];

  const [formData, setFormData] = useState({
    companyName: DEFAULT_REPORT_COMPANY_NAME,
    financialYear: "2025-2026",
    // Current Assets sub-items
    cashInHand: "",
    tradeReceivable: "",
    inventory: "",
    currentAssetsOthers: "",
    // Non-Current Assets sub-items
    fixedAssets: "",
    machinery: "",
    laptops: "",
    nonCurrentAssetsOthers: "",
    // Current Liabilities sub-items
    currentTradePayable: "",
    currentGstPayable: "",
    currentBankLoan: "",
    currentLiabilitiesOthers: "",
    // Non-Current Liabilities sub-items
    nonCurrentTradePayable: "",
    nonCurrentGstPayable: "",
    nonCurrentBankLoan: "",
    nonCurrentLiabilitiesOthers: "",
    // Equity sub-items
    shareCapital: "",
    reservesSurplus: "",
    equityOthers: "",
  });
  const [balanceSheet, setBalanceSheet] = useState(null);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (val) => `₹${(parseFloat(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const buildLineItems = (fields) =>
    fields.map(({ id, reportLabel }) => ({
      label: reportLabel,
      value: parseFloat(formData[id]) || 0,
    }));

  const sumFields = (fields) =>
    fields.reduce((sum, { id }) => sum + (parseFloat(formData[id]) || 0), 0);

  const renderReportRows = (rows = []) => (
    <div className="space-y-2 rounded-2xl bg-white/55 border border-slate-100 p-3">
      {rows.map((row, index) => (
        <div key={`${row.label}-${index}`} className="flex justify-between items-center text-sm text-slate-700">
          <span>{row.label}</span>
          <span className="font-semibold text-slate-900">{formatCurrency(row.value)}</span>
        </div>
      ))}
    </div>
  );

  const generateBalanceSheet = async () => {
    // Sum sub-items for each section (matching Python requirement logic)
    const currentAssets = sumFields(currentAssetFields);
    const nonCurrentAssets = sumFields(nonCurrentAssetFields);
    const currentLiabilities = sumFields(currentLiabilityFields);
    const nonCurrentLiabilities = sumFields(nonCurrentLiabilityFields);
    const equity = sumFields(equityFields);

    // Calculate totals like Python file
    const totalAssets = currentAssets + nonCurrentAssets;
    const totalLiabilities = currentLiabilities + nonCurrentLiabilities;
    const totalLiabilitiesEquity = totalLiabilities + equity;

    const balanced = Math.abs(totalAssets - totalLiabilitiesEquity) < 0.01;

    const dataToSave = {
      currentAssets,
      nonCurrentAssets,
      totalAssets,
      currentLiabilities,
      nonCurrentLiabilities,
      totalLiabilities,
      equity,
      totalLiabilitiesEquity,
      balanced,
      companyName: getReportCompanyName(formData.companyName),
      financialYear: formData.financialYear,
      breakdown: {
        assets: {
          currentAssets: buildLineItems(currentAssetFields),
          nonCurrentAssets: buildLineItems(nonCurrentAssetFields),
        },
        liabilities: {
          currentLiabilities: buildLineItems(currentLiabilityFields),
          nonCurrentLiabilities: buildLineItems(nonCurrentLiabilityFields),
        },
        equity: buildLineItems(equityFields),
      },
    };

    setBalanceSheet(dataToSave);

    try {
      const res = await fetch(`${API_ENDPOINTS.BALANCE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      const result = await res.json();
      if (!res.ok) console.error("Error saving data:", result);
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  const downloadReport = () => {
    if (!balanceSheet) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Blue Header Banner
    doc.setFillColor(26, 54, 164);
    doc.rect(0, 0, pageWidth, 38, "F");

    // Company Name (white, small uppercase, centered)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(getReportCompanyName(balanceSheet.companyName || formData.companyName), pageWidth / 2, 14, { align: "center" });

    // Main Title
    doc.setFontSize(18);
    doc.text("BALANCE SHEET", pageWidth / 2, 26, { align: "center" });

    // 2. Subtitle Date
    const day = new Date().getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[new Date().getMonth()];
    const year = new Date().getFullYear();
    const formattedDate = `Financial Year: ${balanceSheet.financialYear || formData.financialYear}  |  As of ${day} ${month} ${year}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(formattedDate, pageWidth / 2, 48, { align: "center" });

    // Format Currency Helper
    const formatCurrency = (val) => `Rs. ${(parseFloat(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const startX = 15;
    const contentWidth = pageWidth - 30; // 180mm
    const drawDetailRows = (rows = []) => {
      rows.forEach((row) => {
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(95, 95, 95);
        doc.text(row.label, startX + 8, y);
        doc.text(formatCurrency(row.value), startX + contentWidth - 3, y, { align: "right" });
      });
      y += 3;
      doc.setDrawColor(240, 240, 240);
      doc.line(startX, y, startX + contentWidth, y);
    };

    // --- ASSETS SECTION ---
    let y = 56;
    doc.setFillColor(239, 246, 255); // Very light blue
    doc.rect(startX, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(29, 78, 216); // Blue text
    doc.text("ASSETS", startX + 3, y + 5.5);

    // Current Assets row
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text("Current Assets", startX + 3, y);
    doc.text(formatCurrency(balanceSheet.currentAssets), startX + contentWidth - 3, y, { align: "right" });
    drawDetailRows(balanceSheet.breakdown?.assets?.currentAssets);

    // Non-Current Assets row
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text("Non-Current Assets", startX + 3, y);
    doc.text(formatCurrency(balanceSheet.nonCurrentAssets), startX + contentWidth - 3, y, { align: "right" });
    drawDetailRows(balanceSheet.breakdown?.assets?.nonCurrentAssets);

    // Total Assets row
    y += 2;
    doc.setFillColor(248, 250, 252); // Light grey
    doc.rect(startX, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total Assets", startX + 3, y + 5.5);
    doc.text(formatCurrency(balanceSheet.totalAssets), startX + contentWidth - 3, y + 5.5, { align: "right" });

    // --- LIABILITIES SECTION ---
    y += 18;
    doc.setFillColor(255, 247, 237); // Very light orange
    doc.rect(startX, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(194, 65, 12); // Orange text
    doc.text("LIABILITIES", startX + 3, y + 5.5);

    // Current Liabilities row
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text("Current Liabilities", startX + 3, y);
    doc.text(formatCurrency(balanceSheet.currentLiabilities), startX + contentWidth - 3, y, { align: "right" });
    drawDetailRows(balanceSheet.breakdown?.liabilities?.currentLiabilities);

    // Non-Current Liabilities row
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    doc.text("Non-Current Liabilities", startX + 3, y);
    doc.text(formatCurrency(balanceSheet.nonCurrentLiabilities), startX + contentWidth - 3, y, { align: "right" });
    drawDetailRows(balanceSheet.breakdown?.liabilities?.nonCurrentLiabilities);

    // Total Liabilities row
    y += 2;
    doc.setFillColor(248, 250, 252); // Light grey
    doc.rect(startX, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total Liabilities", startX + 3, y + 5.5);
    doc.text(formatCurrency(balanceSheet.totalLiabilities), startX + contentWidth - 3, y + 5.5, { align: "right" });

    // --- EQUITY SECTION ---
    y += 18;
    doc.setFillColor(240, 253, 244); // Very light green
    doc.rect(startX, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // Green text
    doc.text("EQUITY", startX + 3, y + 5.5);

    // Equity row
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text("Equity", startX + 3, y);
    doc.text(formatCurrency(balanceSheet.equity), startX + contentWidth - 3, y, { align: "right" });
    drawDetailRows(balanceSheet.breakdown?.equity);

    // Total Equity row
    y += 2;
    doc.setFillColor(248, 250, 252); // Light grey
    doc.rect(startX, y, contentWidth, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Total Equity", startX + 3, y + 5.5);
    doc.text(formatCurrency(balanceSheet.equity), startX + contentWidth - 3, y + 5.5, { align: "right" });

    // --- TOTAL LIABILITIES + EQUITY ROW ---
    y += 16;
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(startX, y, contentWidth, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Total Liabilities + Equity", startX + 5, y + 7.5);
    doc.setTextColor(147, 197, 253); // Light blue
    doc.text(formatCurrency(balanceSheet.totalLiabilitiesEquity), startX + contentWidth - 5, y + 7.5, { align: "right" });

    // --- BALANCED/UNBALANCED BOX ---
    y += 20;
    const isBalanced = balanceSheet.balanced;
    if (isBalanced) {
      doc.setFillColor(240, 253, 244); // Light green
      doc.setDrawColor(34, 197, 94); // Green border
    } else {
      doc.setFillColor(254, 242, 242); // Light red
      doc.setDrawColor(239, 68, 68); // Red border
    }
    
    // Draw rounded rect
    doc.roundedRect(startX, y, contentWidth, 18, 2, 2, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    if (isBalanced) {
      doc.setTextColor(22, 163, 74);
      doc.text("BALANCED", pageWidth / 2, y + 6.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text("The balance sheet is in balance. Assets equal Liabilities + Equity.", pageWidth / 2, y + 12.5, { align: "center" });
    } else {
      doc.setTextColor(220, 38, 38);
      doc.text("UNBALANCED", pageWidth / 2, y + 6.5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      const diff = Math.abs(balanceSheet.totalAssets - balanceSheet.totalLiabilitiesEquity);
      doc.text(`The balance sheet is unbalanced. Difference: ${formatCurrency(diff)}`, pageWidth / 2, y + 12.5, { align: "center" });
    }

    // --- FOOTER ---
    y += 28;
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, y, startX + contentWidth, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(156, 163, 175);
    doc.text(`Generated by ${REPORT_FOOTER_COMPANY}  |  Powered by Advanced Financial Analytics Engine`, pageWidth / 2, y + 5, { align: "center" });

    // Save PDF
    doc.save(`Balance_Sheet_${Date.now()}.pdf`);
  };


  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <div className="liquid-backdrop fixed inset-0 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/24 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 rounded-full border border-white/60 bg-white/45 text-slate-700 hover:bg-white/70 hover:text-slate-950"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="liquid-icon flex h-16 w-16 items-center justify-center rounded-[22px]">
              <Scale className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Balance Sheet Generator
              </h1>
              <p className="mt-1 text-slate-600 font-medium">Create comprehensive financial statements with real-time validation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Card */}
          <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 transition-all duration-500 bg-white/40">
            <div className="absolute left-1/2 top-0 h-32 w-96 -translate-x-1/2 bg-gradient-to-b from-sky-200/60 to-transparent blur-2xl" />

            <CardHeader className="relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-950">Enter Balance Sheet Data</CardTitle>
              <CardDescription className="text-slate-600 mt-1">Input your financial values below</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-[28px] bg-white/60 border border-white/80 shadow-sm backdrop-blur-xl">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-700 font-semibold">Enter Your Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financialYear" className="text-slate-700 font-semibold">Financial Year</Label>
                  <Input
                    id="financialYear"
                    type="text"
                    placeholder="e.g., 2025-2026"
                    value={formData.financialYear}
                    onChange={(e) => handleInputChange("financialYear", e.target.value)}
                    className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Assets Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-white/60 border border-white/80 shadow-sm backdrop-blur-xl">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shadow-sm">
                    <Building className="h-4 w-4 text-sky-700" />
                  </div>
                  Assets
                </h3>

                {/* Current Assets Sub-items */}
                <p className="text-sky-800 text-xs font-bold uppercase tracking-wider pl-1">Current Assets</p>
                {currentAssetFields.map(({ id, label, placeholder }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id} className="text-slate-700 font-semibold">{label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={id}
                        type="number"
                        placeholder={placeholder}
                        value={formData[id]}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(id, text)}
                        onClear={() => handleInputChange(id, "")}
                      />
                    </div>
                  </div>
                ))}

                {/* Non-Current Assets Sub-items */}
                <p className="text-sky-800 text-xs font-bold uppercase tracking-wider mt-4 pl-1">Non-Current Assets</p>
                {nonCurrentAssetFields.map(({ id, label, placeholder }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id} className="text-slate-700 font-semibold">{label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={id}
                        type="number"
                        placeholder={placeholder}
                        value={formData[id]}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(id, text)}
                        onClear={() => handleInputChange(id, "")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Liabilities Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-orange-50/60 border border-orange-100 shadow-sm backdrop-blur-xl">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shadow-sm">
                    <TrendingUp className="h-4 w-4 text-orange-700" />
                  </div>
                  Liabilities
                </h3>

                {/* Current Liabilities Sub-items */}
                <p className="text-orange-800 text-xs font-bold uppercase tracking-wider pl-1">Current Liabilities</p>
                {currentLiabilityFields.map(({ id, label, subLabel, placeholder }) => (
                  <div className="space-y-2" key={id}>
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor={id} className="text-slate-700 font-semibold">{label}</Label>
                      {subLabel && <span className="text-xs text-slate-500 font-normal pl-0.5">{subLabel}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id={id}
                        type="number"
                        placeholder={placeholder}
                        value={formData[id]}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(id, text)}
                        onClear={() => handleInputChange(id, "")}
                      />
                    </div>
                  </div>
                ))}

                {/* Non-Current Liabilities Sub-items */}
                <p className="text-orange-800 text-xs font-bold uppercase tracking-wider mt-4 pl-1">Non-Current Liabilities</p>
                {nonCurrentLiabilityFields.map(({ id, label, subLabel, placeholder }) => (
                  <div className="space-y-2" key={id}>
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor={id} className="text-slate-700 font-semibold">{label}</Label>
                      {subLabel && <span className="text-xs text-slate-500 font-normal pl-0.5">{subLabel}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id={id}
                        type="number"
                        placeholder={placeholder}
                        value={formData[id]}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(id, text)}
                        onClear={() => handleInputChange(id, "")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Equity Section */}
              <div className="space-y-4 p-6 rounded-[28px] bg-emerald-50/60 border border-emerald-100 shadow-sm backdrop-blur-xl">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shadow-sm">
                    <Calculator className="h-4 w-4 text-emerald-700" />
                  </div>
                  Equity
                </h3>
                {equityFields.map(({ id, label, placeholder }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id} className="text-slate-700 font-semibold">{label}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={id}
                        type="number"
                        placeholder={placeholder}
                        value={formData[id]}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="h-12 rounded-[18px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:ring-0 transition-all duration-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => handleInputChange(id, text)}
                        onClear={() => handleInputChange(id, "")}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={generateBalanceSheet}
                className="w-full h-14 rounded-full bg-slate-950 text-lg font-semibold text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Generate Balance Sheet
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          {balanceSheet && (
            <Card
              className={`liquid-panel relative overflow-hidden rounded-[36px] border-white/55 bg-white/40 shadow-xl border-2 transition-all duration-500 animate-in fade-in duration-700`}
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-10">
                <div className={`px-4 py-2 rounded-full backdrop-blur-xl shadow-md border ${balanceSheet.balanced ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'} flex items-center gap-2`}>
                  {balanceSheet.balanced ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-700" />
                      <span className="font-bold text-sm">Balanced</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-700" />
                      <span className="font-bold text-sm">Unbalanced</span>
                    </>
                  )}
                </div>
              </div>

              <CardHeader className="relative pt-8">
                <CardTitle className="text-2xl font-bold text-slate-950">Balance Sheet Report</CardTitle>
                <div className="flex flex-col gap-1 mt-1">
                  {balanceSheet.financialYear && (
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Financial Year: {balanceSheet.financialYear}
                    </span>
                  )}
                  <CardDescription className={balanceSheet.balanced ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
                    {balanceSheet.balanced ? "Balance sheet is balanced ✓" : "Balance sheet is NOT balanced"}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 relative">
                {/* Assets Display */}
                <div className="p-6 rounded-2xl bg-white/70 border border-slate-200 hover:scale-[1.01] transition-all duration-300">
                  <h3 className="font-bold mb-4 text-slate-900 text-lg">Assets</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-slate-800 py-1">
                        <span className="font-semibold">Current Assets</span>
                        <span className="font-bold text-slate-900">{formatCurrency(balanceSheet.currentAssets)}</span>
                      </div>
                      {renderReportRows(balanceSheet.breakdown?.assets?.currentAssets)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-slate-800 py-1">
                        <span className="font-semibold">Non-Current Assets</span>
                        <span className="font-bold text-slate-900">{formatCurrency(balanceSheet.nonCurrentAssets)}</span>
                      </div>
                      {renderReportRows(balanceSheet.breakdown?.assets?.nonCurrentAssets)}
                    </div>
                    <div className="flex justify-between items-center font-bold border-t border-slate-200 pt-3 mt-3">
                      <span className="text-slate-950 text-lg">Total Assets</span>
                      <span className="text-xl text-slate-950">{formatCurrency(balanceSheet.totalAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities Display */}
                <div className="p-6 rounded-2xl bg-white/70 border border-slate-200 hover:scale-[1.01] transition-all duration-300">
                  <h3 className="font-bold mb-4 text-slate-900 text-lg">Liabilities</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-slate-800 py-1">
                        <span className="font-semibold">Current Liabilities</span>
                        <span className="font-bold text-slate-900">{formatCurrency(balanceSheet.currentLiabilities)}</span>
                      </div>
                      {renderReportRows(balanceSheet.breakdown?.liabilities?.currentLiabilities)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-slate-800 py-1">
                        <span className="font-semibold">Non-Current Liabilities</span>
                        <span className="font-bold text-slate-900">{formatCurrency(balanceSheet.nonCurrentLiabilities)}</span>
                      </div>
                      {renderReportRows(balanceSheet.breakdown?.liabilities?.nonCurrentLiabilities)}
                    </div>
                    <div className="flex justify-between items-center font-bold border-t border-slate-200 pt-3 mt-3">
                      <span className="text-slate-950 text-lg">Total Liabilities</span>
                      <span className="text-xl text-slate-950">{formatCurrency(balanceSheet.totalLiabilities)}</span>
                    </div>
                  </div>
                </div>

                {/* Equity Display */}
                <div className="p-6 rounded-2xl bg-white/70 border border-slate-200 hover:scale-[1.01] transition-all duration-300">
                  <h3 className="font-bold mb-4 text-slate-900 text-lg">Equity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-slate-800 py-1">
                      <span className="font-medium">Equity</span>
                      <span className="font-bold text-slate-900">{formatCurrency(balanceSheet.equity)}</span>
                    </div>
                    {renderReportRows(balanceSheet.breakdown?.equity)}
                    <div className="flex justify-between items-center font-bold border-t border-slate-200 pt-3 mt-3">
                      <span className="text-slate-950 text-lg">Total Liabilities + Equity</span>
                      <span className="text-xl text-slate-950">{formatCurrency(balanceSheet.totalLiabilitiesEquity)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={downloadReport}
                  className="group rounded-full bg-slate-950 font-semibold text-white px-8 py-4 w-full shadow-[0_20px_48px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="mt-8 text-center pb-8">
            <p className="text-slate-500 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/40">
                Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED ✨
            </p>
        </div>
      </main>
    </div>
  );
};

export default BalanceSheet;
