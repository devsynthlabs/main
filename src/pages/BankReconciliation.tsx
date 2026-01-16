import { useState, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, RefreshCw, CheckCircle, XCircle, AlertCircle, Download, FileText, BanknoteIcon, TrendingUp, Plus } from "lucide-react";

interface LedgerEntry {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'Income' | 'Expense';
    reference?: string;
}

interface BankEntry {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'Credit' | 'Debit';
    reference?: string;
}

interface ReconciliationResult {
    id: string;
    ledgerEntry: LedgerEntry | null;
    bankEntry: BankEntry | null;
    status: 'Matched' | 'Unmatched Ledger' | 'Unmatched Bank' | 'Pending';
    matchScore: number;
    notes?: string;
    reconciledAt: string;
}

interface ReconciliationSummary {
    totalLedgerEntries: number;
    totalBankEntries: number;
    matchedEntries: number;
    unmatchedLedger: number;
    unmatchedBank: number;
    reconciliationRate: string;
}

const BankReconciliation = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("reconcile");
    const [isReconciling, setIsReconciling] = useState(false);

    // Sample Data State
    const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([
        { id: "L1", date: "2024-01-15", description: "Office Rent Payment", amount: 25000, type: "Expense", reference: "INV-001" },
        { id: "L2", date: "2024-01-16", description: "Client Payment - ABC Corp", amount: 50000, type: "Income", reference: "PMT-001" },
        { id: "L3", date: "2024-01-17", description: "Utility Bills", amount: 8000, type: "Expense", reference: "INV-002" },
        { id: "L4", date: "2024-01-18", description: "Equipment Purchase", amount: 30000, type: "Expense", reference: "INV-003" },
        { id: "L5", date: "2024-01-19", description: "Consulting Fee", amount: 25000, type: "Income", reference: "PMT-002" },
    ]);

    const [bankData, setBankData] = useState<BankEntry[]>([
        { id: "B1", date: "2024-01-15", description: "OFFICE RENT", amount: 25000, type: "Debit", reference: "TRN-001" },
        { id: "B2", date: "2024-01-16", description: "CREDIT ABC CORP", amount: 50000, type: "Credit", reference: "TRN-002" },
        { id: "B3", date: "2024-01-17", description: "ELECTRICITY BILL", amount: 8000, type: "Debit", reference: "TRN-003" },
        { id: "B4", date: "2024-01-18", description: "EQUIPMENT SUPPLIER", amount: 30000, type: "Debit", reference: "TRN-004" },
        { id: "B5", date: "2024-01-25", description: "BANK CHARGES", amount: 500, type: "Debit", reference: "TRN-005" },
        { id: "B6", date: "2024-01-26", description: "INTEREST EARNED", amount: 1200, type: "Credit", reference: "TRN-006" },
    ]);

    // Reconciliation Results
    const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[]>([]);
    const [summary, setSummary] = useState<ReconciliationSummary>({
        totalLedgerEntries: 0,
        totalBankEntries: 0,
        matchedEntries: 0,
        unmatchedLedger: 0,
        unmatchedBank: 0,
        reconciliationRate: "0.00"
    });

    // Filter State
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filteredResults, setFilteredResults] = useState<ReconciliationResult[]>([]);

    // Manual entries
    const [manualLedgerEntry, setManualLedgerEntry] = useState({
        date: "",
        description: "",
        amount: "",
        type: "Expense" as 'Income' | 'Expense',
        reference: ""
    });

    const [manualBankEntry, setManualBankEntry] = useState({
        date: "",
        description: "",
        amount: "",
        type: "Debit" as 'Credit' | 'Debit',
        reference: ""
    });

    // Filter results
    useEffect(() => {
        let filtered = reconciliationResults;

        if (filterStatus !== "all") {
            filtered = filtered.filter(result => result.status === filterStatus);
        }

        setFilteredResults(filtered);
    }, [reconciliationResults, filterStatus]);

    // Calculate summary
    useEffect(() => {
        const totalLedgerEntries = ledgerData.length;
        const totalBankEntries = bankData.length;
        const matchedEntries = reconciliationResults.filter(r => r.status === "Matched").length;
        const unmatchedLedger = reconciliationResults.filter(r => r.status === "Unmatched Ledger").length;
        const unmatchedBank = reconciliationResults.filter(r => r.status === "Unmatched Bank").length;

        const reconciliationRate = totalLedgerEntries > 0
            ? ((matchedEntries / Math.max(totalLedgerEntries, totalBankEntries)) * 100).toFixed(2)
            : "0.00";

        setSummary({
            totalLedgerEntries,
            totalBankEntries,
            matchedEntries,
            unmatchedLedger,
            unmatchedBank,
            reconciliationRate
        });
    }, [ledgerData, bankData, reconciliationResults]);

    // Reconciliation function
    const performReconciliation = () => {
        setIsReconciling(true);

        // Simulate reconciliation process
        setTimeout(() => {
            const results: ReconciliationResult[] = [];

            // Try to match ledger entries with bank entries
            ledgerData.forEach(ledgerEntry => {
                let bestMatch: BankEntry | null = null;
                let bestScore = 0;

                bankData.forEach(bankEntry => {
                    let score = 0;

                    // Amount match
                    if (Math.abs(ledgerEntry.amount - bankEntry.amount) < 0.01) {
                        score += 40;
                    }

                    // Date proximity (within 2 days)
                    const ledgerDate = new Date(ledgerEntry.date);
                    const bankDate = new Date(bankEntry.date);
                    const dateDiff = Math.abs(ledgerDate.getTime() - bankDate.getTime());
                    const daysDiff = dateDiff / (1000 * 60 * 60 * 24);

                    if (daysDiff <= 1) score += 30;
                    else if (daysDiff <= 2) score += 20;
                    else if (daysDiff <= 3) score += 10;

                    // Description similarity
                    const ledgerDesc = ledgerEntry.description.toLowerCase();
                    const bankDesc = bankEntry.description.toLowerCase();

                    if (ledgerDesc.includes(bankDesc.substring(0, 5)) ||
                        bankDesc.includes(ledgerDesc.substring(0, 5))) {
                        score += 30;
                    }

                    if (score > bestScore && score >= 70) {
                        bestScore = score;
                        bestMatch = bankEntry;
                    }
                });

                if (bestMatch) {
                    results.push({
                        id: `R${results.length + 1}`,
                        ledgerEntry,
                        bankEntry: bestMatch,
                        status: "Matched",
                        matchScore: bestScore,
                        reconciledAt: new Date().toLocaleDateString()
                    });
                } else {
                    results.push({
                        id: `R${results.length + 1}`,
                        ledgerEntry,
                        bankEntry: null,
                        status: "Unmatched Ledger",
                        matchScore: 0,
                        reconciledAt: new Date().toLocaleDateString()
                    });
                }
            });

            // Check for unmatched bank entries
            const matchedBankIds = results
                .filter(r => r.bankEntry)
                .map(r => r.bankEntry!.id);

            bankData.forEach(bankEntry => {
                if (!matchedBankIds.includes(bankEntry.id)) {
                    results.push({
                        id: `R${results.length + 1}`,
                        ledgerEntry: null,
                        bankEntry,
                        status: "Unmatched Bank",
                        matchScore: 0,
                        reconciledAt: new Date().toLocaleDateString()
                    });
                }
            });

            setReconciliationResults(results);
            setIsReconciling(false);

            alert(`Reconciliation completed! Found ${results.filter(r => r.status === "Matched").length} matches.`);
        }, 1500);
    };

    // Add manual ledger entry
    const addManualLedgerEntry = () => {
        if (!manualLedgerEntry.date || !manualLedgerEntry.description || !manualLedgerEntry.amount) {
            alert("Please fill in all required fields");
            return;
        }

        const newEntry: LedgerEntry = {
            id: `L${ledgerData.length + 1}`,
            date: manualLedgerEntry.date,
            description: manualLedgerEntry.description,
            amount: parseFloat(manualLedgerEntry.amount),
            type: manualLedgerEntry.type,
            reference: manualLedgerEntry.reference
        };

        setLedgerData(prev => [...prev, newEntry]);
        setManualLedgerEntry({
            date: "",
            description: "",
            amount: "",
            type: "Expense",
            reference: ""
        });

        alert("Ledger entry added successfully!");
    };

    // Add manual bank entry
    const addManualBankEntry = () => {
        if (!manualBankEntry.date || !manualBankEntry.description || !manualBankEntry.amount) {
            alert("Please fill in all required fields");
            return;
        }

        const newEntry: BankEntry = {
            id: `B${bankData.length + 1}`,
            date: manualBankEntry.date,
            description: manualBankEntry.description,
            amount: parseFloat(manualBankEntry.amount),
            type: manualBankEntry.type,
            reference: manualBankEntry.reference
        };

        setBankData(prev => [...prev, newEntry]);
        setManualBankEntry({
            date: "",
            description: "",
            amount: "",
            type: "Debit",
            reference: ""
        });

        alert("Bank entry added successfully!");
    };

    // Export reconciliation report
    const exportReport = () => {
        const reportContent = `
BANK RECONCILIATION REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
Total Ledger Entries: ${summary.totalLedgerEntries}
Total Bank Entries: ${summary.totalBankEntries}
Matched Entries: ${summary.matchedEntries}
Unmatched Ledger Entries: ${summary.unmatchedLedger}
Unmatched Bank Entries: ${summary.unmatchedBank}
Reconciliation Rate: ${summary.reconciliationRate}%

RECONCILIATION RESULTS:
${reconciliationResults.map(result => `
${result.status === 'Matched' ? '✅ MATCHED' : result.status === 'Unmatched Ledger' ? '⚠️ UNMATCHED LEDGER' : '⚠️ UNMATCHED BANK'}
${result.ledgerEntry ? `Ledger: ${result.ledgerEntry.date} | ${result.ledgerEntry.description} | ₹${result.ledgerEntry.amount}` : 'No ledger entry'}
${result.bankEntry ? `Bank: ${result.bankEntry.date} | ${result.bankEntry.description} | ₹${result.bankEntry.amount}` : 'No bank entry'}
Match Score: ${result.matchScore}%
---`).join('\n')}
    `.trim();

        const blob = new Blob([reportContent], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reconciliation_report_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-950 text-white overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                <div className="absolute top-40 right-40 w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-40 left-60 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
            </div>

            <header className="relative backdrop-blur-xl bg-white/5 border-b border-cyan-400/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToDashboard}
                        className="mb-4 text-cyan-200 hover:text-cyan-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-4">
                        <div
                            className="p-3 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl backdrop-blur-xl border border-cyan-400/30 hover:rotate-12 transition-transform duration-300"
                        >
                            <BanknoteIcon className="h-8 w-8 text-cyan-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                                Bank Reconciliation
                            </h1>
                            <p className="text-cyan-200/80 font-medium mt-1">Match ledger entries with bank statements automatically</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 backdrop-blur-2xl bg-white/10 border border-cyan-400/20 rounded-2xl p-1">
                        <TabsTrigger
                            value="reconcile"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reconcile
                        </TabsTrigger>
                        <TabsTrigger
                            value="results"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <FileText className="h-4 w-4" />
                            Results
                        </TabsTrigger>
                        <TabsTrigger
                            value="add"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Upload className="h-4 w-4" />
                            Add Entries
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reconcile">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-cyan-500/40 hover:-translate-y-2"
                        >
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-cyan-100 flex items-center gap-2">
                                    <RefreshCw className="h-5 w-5 text-teal-400" />
                                    Bank Reconciliation
                                </CardTitle>
                                <CardDescription className="text-cyan-300/70">
                                    Upload ledger and bank statements to automatically match transactions
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-cyan-500/30 rounded-lg">
                                                    <FileText className="h-5 w-5 text-cyan-300" />
                                                </div>
                                                <span className="text-cyan-300 text-sm font-medium">Ledger Entries</span>
                                            </div>
                                            <p className="text-3xl font-bold text-cyan-100">{summary.totalLedgerEntries}</p>
                                            <p className="text-cyan-300/60 text-sm mt-1">Total entries to reconcile</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-blue-500/30 rounded-lg">
                                                    <BanknoteIcon className="h-5 w-5 text-blue-300" />
                                                </div>
                                                <span className="text-blue-300 text-sm font-medium">Bank Entries</span>
                                            </div>
                                            <p className="text-3xl font-bold text-blue-100">{summary.totalBankEntries}</p>
                                            <p className="text-blue-300/60 text-sm mt-1">Bank statement entries</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-green-500/30 rounded-lg">
                                                    <TrendingUp className="h-5 w-5 text-green-300" />
                                                </div>
                                                <span className="text-green-300 text-sm font-medium">Reconciliation Rate</span>
                                            </div>
                                            <p className="text-3xl font-bold text-green-100">{summary.reconciliationRate}%</p>
                                            <p className="text-green-300/60 text-sm mt-1">Successfully matched</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="backdrop-blur-xl bg-white/5 border border-cyan-400/20 rounded-2xl">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-bold text-cyan-100">Ledger Data</CardTitle>
                                            <CardDescription className="text-cyan-300/60">
                                                Upload company ledger CSV/Excel file
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="border-2 border-dashed border-cyan-400/30 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors duration-300">
                                                    <Upload className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                                                    <p className="text-cyan-200 font-medium">Upload Ledger File</p>
                                                    <p className="text-cyan-300/60 text-sm">CSV or Excel format</p>
                                                    <Button
                                                        className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white"
                                                        onClick={() => alert("File upload functionality would be implemented here")}
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Choose File
                                                    </Button>
                                                </div>
                                                <div className="text-sm text-cyan-300/80">
                                                    <p className="font-medium">Sample Format:</p>
                                                    <p className="text-xs">Date, Description, Amount, Type, Reference</p>
                                                    <p className="text-xs">2024-01-15, Office Rent, 25000, Expense, INV-001</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="backdrop-blur-xl bg-white/5 border border-blue-400/20 rounded-2xl">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-bold text-blue-100">Bank Statement</CardTitle>
                                            <CardDescription className="text-blue-300/60">
                                                Upload bank statement CSV/Excel file
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="border-2 border-dashed border-blue-400/30 rounded-xl p-8 text-center hover:border-blue-400/50 transition-colors duration-300">
                                                    <BanknoteIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                                                    <p className="text-blue-200 font-medium">Upload Bank Statement</p>
                                                    <p className="text-blue-300/60 text-sm">CSV or Excel format</p>
                                                    <Button
                                                        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white"
                                                        onClick={() => alert("File upload functionality would be implemented here")}
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Choose File
                                                    </Button>
                                                </div>
                                                <div className="text-sm text-blue-300/80">
                                                    <p className="font-medium">Sample Format:</p>
                                                    <p className="text-xs">Date, Description, Amount, Type, Reference</p>
                                                    <p className="text-xs">2024-01-15, OFFICE RENT, 25000, Debit, TRN-001</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="text-center">
                                    <Button
                                        onClick={performReconciliation}
                                        disabled={isReconciling}
                                        className="h-16 px-12 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/70 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isReconciling ? (
                                            <>
                                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                                Reconciling...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="mr-2 h-5 w-5" />
                                                Start Reconciliation
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-cyan-300/60 text-sm mt-2">
                                        AI-powered matching based on amount, date, and description
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="results">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-cyan-500/40 hover:-translate-y-2"
                        >
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-cyan-100 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-teal-400" />
                                            Reconciliation Results
                                        </CardTitle>
                                        <CardDescription className="text-cyan-300/70">
                                            {reconciliationResults.length} transactions analyzed
                                        </CardDescription>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger className="w-[160px] bg-white/5 border-cyan-400/30 text-cyan-100">
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="Matched">Matched</SelectItem>
                                                <SelectItem value="Unmatched Ledger">Unmatched Ledger</SelectItem>
                                                <SelectItem value="Unmatched Bank">Unmatched Bank</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            onClick={exportReport}
                                            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Report
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {filteredResults.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredResults.map((result) => (
                                            <Card
                                                key={result.id}
                                                className="backdrop-blur-xl bg-white/5 border border-cyan-400/10 rounded-2xl hover:border-cyan-400/30 transition-all duration-300 hover:bg-white/10"
                                            >
                                                <CardContent className="pt-6">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                {result.status === "Matched" ? (
                                                                    <Badge className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white px-3 py-1">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        Matched ({result.matchScore}%)
                                                                    </Badge>
                                                                ) : result.status === "Unmatched Ledger" ? (
                                                                    <Badge className="bg-gradient-to-r from-yellow-500/80 to-amber-500/80 text-white px-3 py-1">
                                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                                        Unmatched Ledger
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white px-3 py-1">
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                        Unmatched Bank
                                                                    </Badge>
                                                                )}
                                                                <span className="text-cyan-300/60 text-sm">
                                                                    Reconciled: {result.reconciledAt}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-400/10">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <FileText className="h-4 w-4 text-cyan-400" />
                                                                        <span className="font-medium text-cyan-100">Ledger Entry</span>
                                                                    </div>
                                                                    {result.ledgerEntry ? (
                                                                        <div className="space-y-1">
                                                                            <p className="text-cyan-200">
                                                                                {result.ledgerEntry.description}
                                                                            </p>
                                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                                <div>
                                                                                    <span className="text-cyan-300/60">Date:</span>
                                                                                    <p className="text-cyan-200">{result.ledgerEntry.date}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-cyan-300/60">Amount:</span>
                                                                                    <p className={`font-bold ${result.ledgerEntry.type === 'Income'
                                                                                        ? 'text-green-400'
                                                                                        : 'text-red-400'
                                                                                        }`}>
                                                                                        ₹{result.ledgerEntry.amount.toFixed(2)}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-cyan-300/60">Type:</span>
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className="border-cyan-400/30 text-cyan-300 text-xs"
                                                                                    >
                                                                                        {result.ledgerEntry.type}
                                                                                    </Badge>
                                                                                </div>
                                                                                {result.ledgerEntry.reference && (
                                                                                    <div>
                                                                                        <span className="text-cyan-300/60">Ref:</span>
                                                                                        <p className="text-cyan-200">{result.ledgerEntry.reference}</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-cyan-300/60 italic">No ledger entry</p>
                                                                    )}
                                                                </div>

                                                                <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-400/10">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <BanknoteIcon className="h-4 w-4 text-blue-400" />
                                                                        <span className="font-medium text-blue-100">Bank Entry</span>
                                                                    </div>
                                                                    {result.bankEntry ? (
                                                                        <div className="space-y-1">
                                                                            <p className="text-blue-200">
                                                                                {result.bankEntry.description}
                                                                            </p>
                                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                                <div>
                                                                                    <span className="text-blue-300/60">Date:</span>
                                                                                    <p className="text-blue-200">{result.bankEntry.date}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-blue-300/60">Amount:</span>
                                                                                    <p className={`font-bold ${result.bankEntry.type === 'Credit'
                                                                                        ? 'text-green-400'
                                                                                        : 'text-red-400'
                                                                                        }`}>
                                                                                        ₹{result.bankEntry.amount.toFixed(2)}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <span className="text-blue-300/60">Type:</span>
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className="border-blue-400/30 text-blue-300 text-xs"
                                                                                    >
                                                                                        {result.bankEntry.type}
                                                                                    </Badge>
                                                                                </div>
                                                                                {result.bankEntry.reference && (
                                                                                    <div>
                                                                                        <span className="text-blue-300/60">Ref:</span>
                                                                                        <p className="text-blue-200">{result.bankEntry.reference}</p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-blue-300/60 italic">No bank entry</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-xl border border-cyan-400/30 inline-block mb-4">
                                            <RefreshCw className="h-12 w-12 text-cyan-300" />
                                        </div>
                                        <p className="text-cyan-300/80 text-lg font-medium">No reconciliation results found</p>
                                        <p className="text-cyan-400/60 text-sm">Run reconciliation first to see results</p>
                                        <Button
                                            onClick={() => setActiveTab("reconcile")}
                                            className="mt-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                                        >
                                            Go to Reconcile
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="add">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card
                                className="backdrop-blur-2xl bg-white/10 border border-cyan-400/20 shadow-2xl shadow-cyan-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-cyan-500/40 hover:-translate-y-2"
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-cyan-100 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-teal-400" />
                                        Add Ledger Entry
                                    </CardTitle>
                                    <CardDescription className="text-cyan-300/70">
                                        Manually add ledger transactions
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="ledgerDate" className="text-cyan-100 font-bold">
                                            Date
                                        </Label>
                                        <Input
                                            id="ledgerDate"
                                            type="date"
                                            value={manualLedgerEntry.date}
                                            onChange={(e) => setManualLedgerEntry(prev => ({ ...prev, date: e.target.value }))}
                                            className="bg-white/5 border-cyan-400/30 text-cyan-100"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="ledgerDescription" className="text-cyan-100 font-bold">
                                            Description *
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="ledgerDescription"
                                                placeholder="Enter transaction description"
                                                value={manualLedgerEntry.description}
                                                onChange={(e) => setManualLedgerEntry(prev => ({ ...prev, description: e.target.value }))}
                                                className="bg-white/5 border-cyan-400/30 text-cyan-100"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => setManualLedgerEntry(prev => ({ ...prev, description: text }))}
                                                onClear={() => setManualLedgerEntry(prev => ({ ...prev, description: "" }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="ledgerAmount" className="text-cyan-100 font-bold">
                                                Amount *
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="ledgerAmount"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={manualLedgerEntry.amount}
                                                    onChange={(e) => setManualLedgerEntry(prev => ({ ...prev, amount: e.target.value }))}
                                                    className="bg-white/5 border-cyan-400/30 text-cyan-100"
                                                />
                                                <VoiceButton
                                                    onTranscript={(text) => setManualLedgerEntry(prev => ({ ...prev, amount: text }))}
                                                    onClear={() => setManualLedgerEntry(prev => ({ ...prev, amount: "" }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="ledgerType" className="text-cyan-100 font-bold">
                                                Type
                                            </Label>
                                            <Select
                                                value={manualLedgerEntry.type}
                                                onValueChange={(value: 'Income' | 'Expense') =>
                                                    setManualLedgerEntry(prev => ({ ...prev, type: value }))
                                                }
                                            >
                                                <SelectTrigger className="bg-white/5 border-cyan-400/30 text-cyan-100">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Income">Income</SelectItem>
                                                    <SelectItem value="Expense">Expense</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="ledgerReference" className="text-cyan-100 font-bold">
                                            Reference
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="ledgerReference"
                                                placeholder="Optional reference number"
                                                value={manualLedgerEntry.reference}
                                                onChange={(e) => setManualLedgerEntry(prev => ({ ...prev, reference: e.target.value }))}
                                                className="bg-white/5 border-cyan-400/30 text-cyan-100"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => setManualLedgerEntry(prev => ({ ...prev, reference: text }))}
                                                onClear={() => setManualLedgerEntry(prev => ({ ...prev, reference: "" }))}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={addManualLedgerEntry}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Ledger Entry
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card
                                className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-blue-500/40 hover:-translate-y-2"
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-blue-100 flex items-center gap-2">
                                        <BanknoteIcon className="h-5 w-5 text-indigo-400" />
                                        Add Bank Entry
                                    </CardTitle>
                                    <CardDescription className="text-blue-300/70">
                                        Manually add bank statement transactions
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="bankDate" className="text-blue-100 font-bold">
                                            Date
                                        </Label>
                                        <Input
                                            id="bankDate"
                                            type="date"
                                            value={manualBankEntry.date}
                                            onChange={(e) => setManualBankEntry(prev => ({ ...prev, date: e.target.value }))}
                                            className="bg-white/5 border-blue-400/30 text-blue-100"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="bankDescription" className="text-blue-100 font-bold">
                                            Description *
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="bankDescription"
                                                placeholder="Enter bank description"
                                                value={manualBankEntry.description}
                                                onChange={(e) => setManualBankEntry(prev => ({ ...prev, description: e.target.value }))}
                                                className="bg-white/5 border-blue-400/30 text-blue-100"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => setManualBankEntry(prev => ({ ...prev, description: text }))}
                                                onClear={() => setManualBankEntry(prev => ({ ...prev, description: "" }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="bankAmount" className="text-blue-100 font-bold">
                                                Amount *
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id="bankAmount"
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={manualBankEntry.amount}
                                                    onChange={(e) => setManualBankEntry(prev => ({ ...prev, amount: e.target.value }))}
                                                    className="bg-white/5 border-blue-400/30 text-blue-100"
                                                />
                                                <VoiceButton
                                                    onTranscript={(text) => setManualBankEntry(prev => ({ ...prev, amount: text }))}
                                                    onClear={() => setManualBankEntry(prev => ({ ...prev, amount: "" }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="bankType" className="text-blue-100 font-bold">
                                                Type
                                            </Label>
                                            <Select
                                                value={manualBankEntry.type}
                                                onValueChange={(value: 'Credit' | 'Debit') =>
                                                    setManualBankEntry(prev => ({ ...prev, type: value }))
                                                }
                                            >
                                                <SelectTrigger className="bg-white/5 border-blue-400/30 text-blue-100">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Credit">Credit</SelectItem>
                                                    <SelectItem value="Debit">Debit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="bankReference" className="text-blue-100 font-bold">
                                            Reference
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="bankReference"
                                                placeholder="Optional transaction ID"
                                                value={manualBankEntry.reference}
                                                onChange={(e) => setManualBankEntry(prev => ({ ...prev, reference: e.target.value }))}
                                                className="bg-white/5 border-blue-400/30 text-blue-100"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => setManualBankEntry(prev => ({ ...prev, reference: text }))}
                                                onClear={() => setManualBankEntry(prev => ({ ...prev, reference: "" }))}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={addManualBankEntry}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Bank Entry
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-8 text-center">
                    <p className="text-cyan-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-cyan-400/20">
                        Powered by AI-Powered Reconciliation Engine ✨
                    </p>
                </div>
            </main>
        </div>
    );
};

export default BankReconciliation;