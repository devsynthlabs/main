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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Calendar } from "@/components/ui/calendar";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { format } from "date-fns";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { CalendarIcon, ArrowLeft, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Filter, BarChart3, FileText } from "lucide-react";
import { VoiceButton } from "@/components/ui/VoiceButton";

interface BookkeepingEntry {
    id: string;
    date: Date;
    description: string;
    type: 'Income' | 'Expenses';
    amount: number;
    category: string;
    createdAt: Date;
}

interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    entryCount: number;
}

const Bookkeeping = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("entries");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isHovering, setIsHovering] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        description: "",
        type: "Expenses" as 'Income' | 'Expenses',
        amount: "",
        category: "General"
    });

    // Entries State
    const [entries, setEntries] = useState<BookkeepingEntry[]>([
        {
            id: "1",
            date: new Date("2025-07-01"),
            description: "Uber ride to meeting",
            type: "Expenses",
            amount: 1500,
            category: "Transportation",
            createdAt: new Date()
        },
        {
            id: "2",
            date: new Date("2025-07-02"),
            description: "Office chair purchase",
            type: "Expenses",
            amount: 12000,
            category: "Furniture",
            createdAt: new Date()
        },
        {
            id: "3",
            date: new Date("2025-07-03"),
            description: "Monthly Internet bill",
            type: "Expenses",
            amount: 6000,
            category: "Utilities",
            createdAt: new Date()
        },
        {
            id: "4",
            date: new Date("2025-07-04"),
            description: "Flight to conference",
            type: "Expenses",
            amount: 30000,
            category: "Travel",
            createdAt: new Date()
        },
        {
            id: "5",
            date: new Date("2025-07-05"),
            description: "Printer ink order",
            type: "Expenses",
            amount: 4500,
            category: "Office Supplies",
            createdAt: new Date()
        },
        {
            id: "6",
            date: new Date("2025-07-07"),
            description: "Team Lunch",
            type: "Expenses",
            amount: 8000,
            category: "Food & Entertainment",
            createdAt: new Date()
        },
        {
            id: "7",
            date: new Date("2025-07-08"),
            description: "Hotel stay for seminar",
            type: "Expenses",
            amount: 50000,
            category: "Travel",
            createdAt: new Date()
        },
        {
            id: "8",
            date: new Date("2025-07-09"),
            description: "Sale of Goods",
            type: "Income",
            amount: 150000,
            category: "Sales",
            createdAt: new Date()
        }
    ]);

    // Filter State
    const [filterType, setFilterType] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [filteredEntries, setFilteredEntries] = useState<BookkeepingEntry[]>([]);

    // Financial Summary
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        entryCount: 0
    });

    // Calculate financial summary
    useEffect(() => {
        const totalIncome = entries
            .filter(entry => entry.type === 'Income')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const totalExpenses = entries
            .filter(entry => entry.type === 'Expenses')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const netBalance = totalIncome - totalExpenses;

        setFinancialSummary({
            totalIncome,
            totalExpenses,
            netBalance,
            entryCount: entries.length
        });
    }, [entries]);

    // Filter entries
    useEffect(() => {
        let filtered = entries;

        if (filterType !== "all") {
            filtered = filtered.filter(entry => entry.type === filterType);
        }

        if (filterCategory !== "all") {
            filtered = filtered.filter(entry => entry.category === filterCategory);
        }

        setFilteredEntries(filtered);
    }, [entries, filterType, filterCategory]);

    // Get unique categories
    const categories = Array.from(new Set(entries.map(entry => entry.category)));

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Add new entry
    const addEntry = () => {
        if (!formData.description || !formData.amount) {
            alert("Please fill in all required fields");
            return;
        }

        const newEntry: BookkeepingEntry = {
            id: Date.now().toString(),
            date: selectedDate,
            description: formData.description,
            type: formData.type,
            amount: parseFloat(formData.amount),
            category: formData.category,
            createdAt: new Date()
        };

        setEntries(prev => [newEntry, ...prev]);

        // Reset form
        setFormData({
            description: "",
            type: "Expenses",
            amount: "",
            category: "General"
        });
        setSelectedDate(new Date());

        alert("Entry added successfully!");
    };

    // Delete entry
    const deleteEntry = (id: string) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            setEntries(prev => prev.filter(entry => entry.id !== id));
        }
    };

    // Export data to CSV
    const exportToCSV = () => {
        const headers = ['Date', 'Description', 'Type', 'Category', 'Amount'];
        const csvContent = [
            headers.join(','),
            ...filteredEntries.map(entry => [
                format(new Date(entry.date), 'yyyy-MM-dd'),
                `"${entry.description}"`,
                entry.type,
                entry.category,
                entry.amount.toFixed(2)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookkeeping_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white overflow-hidden relative">
            {/* NORMAL CURSOR - No custom cursor effects */}
            <style>{`
        * {
          cursor: default !important;
        }
        button, input, select, [role="button"] {
          cursor: pointer !important;
        }
      `}</style>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute top-40 right-40 w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-40 left-60 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <header className="relative backdrop-blur-xl bg-white/5 border-b border-emerald-400/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Button
                        variant="ghost"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={handleBackToDashboard}
                        className="mb-4 text-emerald-200 hover:text-emerald-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-4">
                        <div
                            className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl backdrop-blur-xl border border-emerald-400/30 hover:rotate-12 transition-transform duration-300"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,184,166,0.8)]">
                                Office Bookkeeping
                            </h1>
                            <p className="text-emerald-200/80 font-medium mt-1">Track income and expenses with financial insights</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 backdrop-blur-2xl bg-white/10 border border-emerald-400/20 rounded-2xl p-1">
                        <TabsTrigger
                            value="entries"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <FileText className="h-4 w-4" />
                            Entries
                        </TabsTrigger>
                        <TabsTrigger
                            value="add"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <Plus className="h-4 w-4" />
                            Add Entry
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Entries Tab */}
                    <TabsContent value="entries">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-emerald-400/20 shadow-2xl shadow-emerald-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/40 hover:-translate-y-2"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-emerald-100 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-teal-400" />
                                            Bookkeeping Entries
                                        </CardTitle>
                                        <CardDescription className="text-emerald-300/70">
                                            {entries.length} total entries • {financialSummary.netBalance >= 0 ? 'Positive' : 'Negative'} balance
                                        </CardDescription>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Select value={filterType} onValueChange={setFilterType}>
                                            <SelectTrigger className="w-[140px] bg-white/5 border-emerald-400/30 text-emerald-100">
                                                <Filter className="h-4 w-4 mr-2" />
                                                <SelectValue placeholder="Filter by type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Types</SelectItem>
                                                <SelectItem value="Income">Income</SelectItem>
                                                <SelectItem value="Expenses">Expenses</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                                            <SelectTrigger className="w-[140px] bg-white/5 border-emerald-400/30 text-emerald-100">
                                                <SelectValue placeholder="Filter by category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map(category => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            onClick={exportToCSV}
                                            onMouseEnter={() => setIsHovering(true)}
                                            onMouseLeave={() => setIsHovering(false)}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export CSV
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {filteredEntries.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredEntries.map((entry) => (
                                            <div
                                                key={entry.id}
                                                className="p-4 backdrop-blur-xl bg-white/5 border border-emerald-400/10 rounded-2xl hover:border-emerald-400/30 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Badge
                                                                className={`px-3 py-1 rounded-full ${entry.type === 'Income'
                                                                    ? 'bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white'
                                                                    : 'bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white'
                                                                    }`}
                                                            >
                                                                {entry.type === 'Income' ? '💰 Income' : '💸 Expense'}
                                                            </Badge>
                                                            <Badge
                                                                variant="outline"
                                                                className="border-emerald-400/40 text-emerald-300"
                                                            >
                                                                {entry.category}
                                                            </Badge>
                                                            <span className="text-emerald-300/60 text-sm">
                                                                {format(new Date(entry.date), 'MMM dd, yyyy')}
                                                            </span>
                                                        </div>

                                                        <h3 className="text-lg font-semibold text-emerald-100 mb-1">
                                                            {entry.description}
                                                        </h3>

                                                        <div className="flex items-center gap-4 text-sm text-emerald-300/80">
                                                            <span>Added: {format(new Date(entry.createdAt), 'MMM dd, yyyy')}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className={`text-2xl font-bold ${entry.type === 'Income' ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {entry.type === 'Income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteEntry(entry.id)}
                                                            className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="p-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 inline-block mb-4">
                                            <FileText className="h-12 w-12 text-emerald-300" />
                                        </div>
                                        <p className="text-emerald-300/80 text-lg font-medium">No entries found</p>
                                        <p className="text-emerald-400/60 text-sm">Try adjusting your filters or add a new entry</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Add Entry Tab */}
                    <TabsContent value="add">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-emerald-400/20 shadow-2xl shadow-emerald-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/40 hover:-translate-y-2"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-emerald-100 flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-teal-400" />
                                    Add New Bookkeeping Entry
                                </CardTitle>
                                <CardDescription className="text-emerald-300/70">
                                    Record income or expenses to track your financial transactions
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <Label className="text-emerald-100 font-bold flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4 text-teal-400" />
                                        Transaction Date
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal bg-white/5 border-emerald-400/30 text-emerald-100 hover:bg-white/10"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-800 border-emerald-400/30">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={(date) => date && setSelectedDate(date)}
                                                initialFocus
                                                className="bg-slate-800 text-emerald-100"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-emerald-100 font-bold">
                                        Description
                                    </Label>
                                    <Input
                                        id="description"
                                        placeholder="Enter transaction description"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        className="bg-white/5 backdrop-blur-xl text-emerald-100 border border-emerald-400/30 rounded-xl placeholder:text-emerald-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                                    />
                                </div>

                                {/* Type and Category */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-emerald-100 font-bold">Type</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={formData.type === "Income" ? "default" : "outline"}
                                                onClick={() => handleInputChange("type", "Income")}
                                                className={`flex-1 ${formData.type === "Income"
                                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                                                    : "border-emerald-400/30 text-emerald-300"
                                                    }`}
                                            >
                                                <TrendingUp className="h-4 w-4 mr-2" />
                                                Income
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.type === "Expenses" ? "default" : "outline"}
                                                onClick={() => handleInputChange("type", "Expenses")}
                                                className={`flex-1 ${formData.type === "Expenses"
                                                    ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                                                    : "border-emerald-400/30 text-emerald-300"
                                                    }`}
                                            >
                                                <TrendingDown className="h-4 w-4 mr-2" />
                                                Expense
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="category" className="text-emerald-100 font-bold">
                                            Category
                                        </Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => handleInputChange("category", value)}
                                        >
                                            <SelectTrigger className="bg-white/5 border-emerald-400/30 text-emerald-100">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Transportation">Transportation</SelectItem>
                                                <SelectItem value="Furniture">Furniture</SelectItem>
                                                <SelectItem value="Utilities">Utilities</SelectItem>
                                                <SelectItem value="Travel">Travel</SelectItem>
                                                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                                                <SelectItem value="Food & Entertainment">Food & Entertainment</SelectItem>
                                                <SelectItem value="Sales">Sales</SelectItem>
                                                <SelectItem value="Services">Services</SelectItem>
                                                <SelectItem value="Equipment">Equipment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="space-y-3">
                                    <Label htmlFor="amount" className="text-emerald-100 font-bold">
                                        Amount (₹)
                                    </Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => handleInputChange("amount", e.target.value)}
                                        className="bg-white/5 backdrop-blur-xl text-emerald-100 border border-emerald-400/30 rounded-xl placeholder:text-emerald-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                                    />
                                </div>

                                {/* Add Button */}
                                <Button
                                    onClick={addEntry}
                                    className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/70"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Add Entry
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-emerald-400/20 shadow-2xl shadow-emerald-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/40 hover:-translate-y-2"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-emerald-100 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-teal-400" />
                                    Financial Analytics
                                </CardTitle>
                                <CardDescription className="text-emerald-300/70">
                                    Insights and summary of your bookkeeping data
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-green-500/30 rounded-lg">
                                                    <TrendingUp className="h-5 w-5 text-green-300" />
                                                </div>
                                                <span className="text-green-300 text-sm font-medium">Total Income</span>
                                            </div>
                                            <p className="text-3xl font-bold text-green-100">₹{financialSummary.totalIncome.toLocaleString()}</p>
                                            <p className="text-green-300/60 text-sm mt-1">From {entries.filter(e => e.type === 'Income').length} income entries</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-red-500/30 rounded-lg">
                                                    <TrendingDown className="h-5 w-5 text-red-300" />
                                                </div>
                                                <span className="text-red-300 text-sm font-medium">Total Expenses</span>
                                            </div>
                                            <p className="text-3xl font-bold text-red-100">₹{financialSummary.totalExpenses.toLocaleString()}</p>
                                            <p className="text-red-300/60 text-sm mt-1">From {entries.filter(e => e.type === 'Expenses').length} expense entries</p>
                                        </CardContent>
                                    </Card>

                                    <Card className={`backdrop-blur-xl border rounded-2xl ${financialSummary.netBalance >= 0
                                        ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-400/30'
                                        : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/30'
                                        }`}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-lg ${financialSummary.netBalance >= 0
                                                    ? 'bg-teal-500/30'
                                                    : 'bg-orange-500/30'
                                                    }`}>
                                                    <DollarSign className={`h-5 w-5 ${financialSummary.netBalance >= 0 ? 'text-teal-300' : 'text-orange-300'
                                                        }`} />
                                                </div>
                                                <span className={`text-sm font-medium ${financialSummary.netBalance >= 0 ? 'text-teal-300' : 'text-orange-300'
                                                    }`}>
                                                    Net Balance
                                                </span>
                                            </div>
                                            <p className={`text-3xl font-bold ${financialSummary.netBalance >= 0 ? 'text-teal-100' : 'text-orange-100'
                                                }`}>
                                                {financialSummary.netBalance >= 0 ? '+' : ''}₹{financialSummary.netBalance.toLocaleString()}
                                            </p>
                                            <p className={`text-sm mt-1 ${financialSummary.netBalance >= 0 ? 'text-teal-300/60' : 'text-orange-300/60'
                                                }`}>
                                                {financialSummary.netBalance >= 0 ? 'Profit' : 'Loss'}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Category Breakdown */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-emerald-100">Category Breakdown</h3>
                                    <div className="space-y-3">
                                        {categories.map(category => {
                                            const categoryEntries = entries.filter(e => e.category === category);
                                            const categoryIncome = categoryEntries
                                                .filter(e => e.type === 'Income')
                                                .reduce((sum, e) => sum + e.amount, 0);
                                            const categoryExpenses = categoryEntries
                                                .filter(e => e.type === 'Expenses')
                                                .reduce((sum, e) => sum + e.amount, 0);
                                            const total = categoryIncome + categoryExpenses;

                                            return (
                                                <div key={category} className="p-4 backdrop-blur-xl bg-white/5 border border-emerald-400/10 rounded-2xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-emerald-100">{category}</span>
                                                        <Badge className="bg-emerald-500/20 text-emerald-300">
                                                            {categoryEntries.length} entries
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-green-300">Income: ₹{categoryIncome.toLocaleString()}</span>
                                                            <span className="text-red-300">Expenses: ₹{categoryExpenses.toLocaleString()}</span>
                                                        </div>

                                                        <div className="flex h-2 bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-green-500 h-full"
                                                                style={{ width: `${total > 0 ? (categoryIncome / total) * 100 : 0}%` }}
                                                            />
                                                            <div
                                                                className="bg-red-500 h-full"
                                                                style={{ width: `${total > 0 ? (categoryExpenses / total) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Bottom floating info */}
                <div className="mt-8 text-center">
                    <p className="text-emerald-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-emerald-400/20">
                        Powered by Financial Automation Engine ✨
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Bookkeeping;