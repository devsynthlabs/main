import { useState, useEffect } from "react";
import { toast } from "sonner";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfMonth, endOfMonth, subMonths, isSameDay, isToday, isYesterday, startOfDay, endOfDay } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalendarIcon, ArrowLeft, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Filter, BarChart3, FileText, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of month
        to: new Date()
    });

    // Form State
    const [formData, setFormData] = useState({
        description: "",
        type: "Expenses" as 'Income' | 'Expenses',
        amount: "",
        category: "General"
    });

    // Entries State
    const [entries, setEntries] = useState<BookkeepingEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Categories State
    const [customCategories, setCustomCategories] = useState<any[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // Deletion State
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const DEFAULT_CATEGORIES = [
        "General", "Transportation", "Furniture", "Utilities", "Travel",
        "Office Supplies", "Food & Entertainment", "Sales", "Services", "Equipment"
    ];

    // Fetch entries and categories from API
    useEffect(() => {
        fetchEntries();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/bookkeeping/categories`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCustomCategories(data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const addCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/bookkeeping/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (response.ok) {
                const data = await response.json();
                setCustomCategories(prev => [...prev, data.category]);
                setFormData(prev => ({ ...prev, category: data.category.name }));
                setNewCategoryName("");
                setIsAddingCategory(false);
                toast.success("Category added successfully");
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to add category");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Error adding category");
        }
    };

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/bookkeeping/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEntries(data.entries.map((entry: any) => ({
                    ...entry,
                    id: entry._id, // Map MongoDB _id to id
                    date: new Date(entry.date),
                    createdAt: new Date(entry.createdAt),
                    type: (entry.type === 'income' || entry.type === 'Income') ? 'Income' : 'Expenses'
                })));
            } else {
                console.error("Failed to fetch bookkeeping entries");
            }
        } catch (error) {
            console.error("Error fetching entries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter State
    const [filterType, setFilterType] = useState<string>("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    // Financial Summary
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        entryCount: 0
    });

    const [filteredEntries, setFilteredEntries] = useState<BookkeepingEntry[]>([]);

    // Filter entries
    useEffect(() => {
        let filtered = entries;

        // Date Range Filter
        if (dateRange.from && dateRange.to) {
            filtered = filtered.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= dateRange.from! && entryDate <= dateRange.to!;
            });
        }

        if (filterType !== "all") {
            filtered = filtered.filter(entry => entry.type === filterType);
        }

        if (filterCategory !== "all") {
            filtered = filtered.filter(entry => entry.category === filterCategory);
        }

        setFilteredEntries(filtered);
    }, [entries, filterType, filterCategory, dateRange]);

    // Financial Summary (based on filtered entries)
    useEffect(() => {
        const totalIncome = filteredEntries
            .filter(entry => entry.type === 'Income')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const totalExpenses = filteredEntries
            .filter(entry => entry.type === 'Expenses')
            .reduce((sum, entry) => sum + entry.amount, 0);

        const netBalance = totalIncome - totalExpenses;

        setFinancialSummary({
            totalIncome,
            totalExpenses,
            netBalance,
            entryCount: filteredEntries.length
        });
    }, [filteredEntries]);

    // Handle Date Presets
    const handlePreset = (preset: 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth') => {
        const today = new Date();
        let from = today;
        let to = today;

        switch (preset) {
            case 'today':
                from = startOfDay(today);
                to = endOfDay(today);
                break;
            case 'yesterday':
                const yesterday = subDays(today, 1);
                from = startOfDay(yesterday);
                to = endOfDay(yesterday);
                break;
            case 'week':
                from = startOfDay(subDays(today, 6));
                to = endOfDay(today);
                break;
            case 'month':
                from = startOfMonth(today);
                to = endOfMonth(today);
                break;
            case 'lastMonth':
                const lastMonth = subMonths(today, 1);
                from = startOfMonth(lastMonth);
                to = endOfMonth(lastMonth);
                break;
        }
        setDateRange({ from, to });
    };

    // Group entries for display
    const getGroupedEntries = () => {
        const groups: Record<string, BookkeepingEntry[]> = {};
        filteredEntries.forEach(entry => {
            const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(entry);
        });
        return groups;
    };

    const groupedEntries = getGroupedEntries();
    const sortedGroupKeys = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const allCategories = [...DEFAULT_CATEGORIES, ...customCategories.map(c => c.name)];

    // Get unique categories

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Add new entry
    const addEntry = async () => {
        if (!formData.description || !formData.amount) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/bookkeeping/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: selectedDate,
                    description: formData.description,
                    type: formData.type.toLowerCase() === 'income' ? 'income' : 'expense', // Backend expects lowercase
                    amount: parseFloat(formData.amount),
                    category: formData.category
                })
            });

            if (response.ok) {
                const data = await response.json();
                const newEntry = {
                    ...data.entry,
                    id: data.entry._id, // Map MongoDB _id to id
                    date: new Date(data.entry.date),
                    createdAt: new Date(data.entry.createdAt),
                    // Map backend type back to frontend expected capitalization if needed or update frontend to handle lowercase
                    type: data.entry.type === 'income' ? 'Income' : 'Expenses'
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

                toast.success("Entry added successfully!");
                setActiveTab("entries");
            } else {
                const errorData = await response.json();
                toast.error(`Error adding entry: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error adding entry:", error);
            toast.error("Failed to add entry. Please try again.");
        }
    };

    // Delete entry
    const handleDeleteClick = (id: string) => {
        setEntryToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/bookkeeping/${entryToDelete}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setEntries(prev => prev.filter(entry => entry.id !== entryToDelete));
                toast.success("Entry deleted successfully");
            } else {
                toast.error("Failed to delete entry");
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
            toast.error("Error deleting entry");
        } finally {
            setIsDeleteDialogOpen(false);
            setEntryToDelete(null);
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
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <div className="absolute top-40 right-40 w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-40 left-60 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
            </div>

            <header className="relative backdrop-blur-xl bg-white/5 border-b border-emerald-400/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToDashboard}
                        className="mb-4 text-emerald-200 hover:text-emerald-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-4">
                        <div
                            className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl backdrop-blur-xl border border-emerald-400/30 hover:rotate-12 transition-transform duration-300"
                        >
                            <DollarSign className="h-8 w-8 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,184,166,0.8)] leading-tight">
                                Bookkeeping Automation
                            </h1>
                            <p className="text-emerald-200/80 font-medium mt-1">Track income and expenses with financial insights</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                {activeTab === 'analytics' && (
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-2xl bg-white/5 border border-emerald-400/20 rounded-3xl p-6 shadow-2xl">
                        <div>
                            <h2 className="text-xl font-bold text-emerald-100 mb-2">Financial Period</h2>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreset('today')}
                                    className="bg-white/5 border-emerald-400/20 hover:bg-emerald-500/20 text-emerald-100 text-xs h-8"
                                >
                                    Today
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreset('yesterday')}
                                    className="bg-white/5 border-emerald-400/20 hover:bg-emerald-500/20 text-emerald-100 text-xs h-8"
                                >
                                    Yesterday
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreset('week')}
                                    className="bg-white/5 border-emerald-400/20 hover:bg-emerald-500/20 text-emerald-100 text-xs h-8"
                                >
                                    Last 7 Days
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreset('month')}
                                    className="bg-white/5 border-emerald-400/20 hover:bg-emerald-500/20 text-emerald-100 text-xs h-8"
                                >
                                    This Month
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreset('lastMonth')}
                                    className="bg-white/5 border-emerald-400/20 hover:bg-emerald-500/20 text-emerald-100 text-xs h-8"
                                >
                                    Last Month
                                </Button>
                            </div>
                            <p className="text-emerald-300/60 text-sm">Select a date range to filter transactions</p>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full md:w-[300px] justify-start text-left font-normal bg-white/10 border-emerald-400/30 text-emerald-100 hover:bg-white/20 h-12 rounded-xl"
                                >
                                    <CalendarIcon className="mr-2 h-5 w-5 text-teal-400" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <span className="font-semibold text-lg">
                                                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-lg">{format(dateRange.from, "MMM dd, yyyy")}</span>
                                        )
                                    ) : (
                                        <span className="text-lg">Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-900 border-emerald-400/30" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={{ from: dateRange.from, to: dateRange.to }}
                                    onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                                    numberOfMonths={1}
                                    className="bg-slate-900 text-emerald-100"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 backdrop-blur-2xl bg-white/10 border border-emerald-400/20 rounded-2xl p-1">
                        <TabsTrigger
                            value="entries"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <FileText className="h-4 w-4" />
                            Entries
                        </TabsTrigger>
                        <TabsTrigger
                            value="add"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <Plus className="h-4 w-4" />
                            Add Entry
                        </TabsTrigger>
                        <TabsTrigger
                            value="analytics"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="entries">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-emerald-400/20 shadow-2xl shadow-emerald-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/40 hover:-translate-y-2"
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
                                                {DEFAULT_CATEGORIES.map(category => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                                {customCategories.map(cat => (
                                                    <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            onClick={exportToCSV}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export CSV
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="h-10 w-10 text-emerald-400 animate-spin mb-4" />
                                        <p className="text-emerald-300">Loading your entries...</p>
                                    </div>
                                ) : filteredEntries.length > 0 ? (
                                    <div className="space-y-6">
                                        {sortedGroupKeys.map(dateKey => {
                                            const dateObj = new Date(dateKey);
                                            let dateLabel = format(dateObj, 'EEEE, MMMM do, yyyy');
                                            if (isToday(dateObj)) dateLabel = "Today";
                                            if (isYesterday(dateObj)) dateLabel = "Yesterday";

                                            return (
                                                <div key={dateKey} className="space-y-3">
                                                    <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md py-2 px-3 rounded-lg border-l-4 border-emerald-500 inline-block shadow-lg">
                                                        <h4 className="text-emerald-100 font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                                                            <CalendarIcon className="h-4 w-4 text-emerald-400" />
                                                            {dateLabel}
                                                        </h4>
                                                    </div>

                                                    {groupedEntries[dateKey].map((entry) => (
                                                        <div
                                                            key={entry.id}
                                                            className="ml-2 p-4 backdrop-blur-xl bg-white/5 border border-emerald-400/10 rounded-2xl hover:border-emerald-400/30 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 group"
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
                                                                        <span className="text-emerald-300/40 text-xs hidden sm:inline-block">
                                                                            {format(new Date(entry.createdAt), 'h:mm a')}
                                                                        </span>
                                                                    </div>

                                                                    <h3 className="text-lg font-semibold text-emerald-100 mb-1 group-hover:text-emerald-50 transition-colors">
                                                                        {entry.description}
                                                                    </h3>
                                                                </div>

                                                                <div className="flex flex-col items-end gap-2">
                                                                    <div className={`text-2xl font-bold ${entry.type === 'Income' ? 'text-green-400' : 'text-red-400'
                                                                        }`}>
                                                                        {entry.type === 'Income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                                                                    </div>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteClick(entry.id)}
                                                                        className="text-red-300/60 hover:text-red-200 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
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

                    <TabsContent value="add">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-emerald-400/20 shadow-2xl shadow-emerald-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/40 hover:-translate-y-2"
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

                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-emerald-100 font-bold">
                                        Description
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="description"
                                            placeholder="Enter transaction description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            className="bg-white/5 backdrop-blur-xl text-emerald-100 border border-emerald-400/30 rounded-xl placeholder:text-emerald-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                                        />
                                        <VoiceButton
                                            onTranscript={(text) => handleInputChange("description", text)}
                                            onClear={() => handleInputChange("description", "")}
                                        />
                                    </div>
                                </div>

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

                                    <div className="flex flex-col gap-2">
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => handleInputChange("category", value)}
                                        >
                                            <SelectTrigger className="bg-white/5 border-emerald-400/30 text-emerald-100">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEFAULT_CATEGORIES.map(category => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                                {customCategories.map(cat => (
                                                    <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {!isAddingCategory ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsAddingCategory(true)}
                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 justify-start h-8 px-2"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add New Category
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Category name"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    className="h-8 bg-white/5 border-emerald-400/30 text-emerald-100 text-xs"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={addCategory}
                                                    className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white"
                                                >
                                                    Add
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setIsAddingCategory(false)}
                                                    className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="amount" className="text-emerald-100 font-bold">
                                        Amount (₹)
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => handleInputChange("amount", e.target.value)}
                                            className="bg-white/5 backdrop-blur-xl text-emerald-100 border border-emerald-400/30 rounded-xl placeholder:text-emerald-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                                        />
                                        <VoiceButton
                                            onTranscript={(text) => handleInputChange("amount", text)}
                                            onClear={() => handleInputChange("amount", "")}
                                        />
                                    </div>
                                </div>

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

                    <TabsContent value="analytics">
                        <Card
                            className="backdrop-blur-2xl bg-white/10 border border-emerald-400/20 shadow-2xl shadow-emerald-500/20 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-emerald-500/40 hover:-translate-y-2"
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-green-500/30 rounded-lg">
                                                    <TrendingUp className="h-5 w-5 text-green-700" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-green-800 text-sm font-bold">Total Income</span>
                                                    <span className="text-green-700 text-xs font-bold">
                                                        {financialSummary.totalIncome + financialSummary.totalExpenses > 0
                                                            ? Math.round((financialSummary.totalIncome / (financialSummary.totalIncome + financialSummary.totalExpenses)) * 100)
                                                            : 0}% of turnover
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-3xl font-black text-green-900">₹{financialSummary.totalIncome.toLocaleString()}</p>
                                            <p className="text-green-800 text-sm mt-1 font-medium">From {filteredEntries.filter(e => e.type === 'Income').length} income entries</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-red-500/30 rounded-lg">
                                                    <TrendingDown className="h-5 w-5 text-red-700" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-red-800 text-sm font-bold">Total Expenses</span>
                                                    <span className="text-red-700 text-xs font-bold">
                                                        {financialSummary.totalIncome + financialSummary.totalExpenses > 0
                                                            ? Math.round((financialSummary.totalExpenses / (financialSummary.totalIncome + financialSummary.totalExpenses)) * 100)
                                                            : 0}% of turnover
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-3xl font-black text-red-900">₹{financialSummary.totalExpenses.toLocaleString()}</p>
                                            <p className="text-red-800 text-sm mt-1 font-medium">From {filteredEntries.filter(e => e.type === 'Expenses').length} expense entries</p>
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
                                                    <DollarSign className={`h-5 w-5 ${financialSummary.netBalance >= 0 ? 'text-teal-800' : 'text-orange-800'
                                                        }`} />
                                                </div>
                                                <span className={`text-sm font-bold ${financialSummary.netBalance >= 0 ? 'text-teal-800' : 'text-orange-800'
                                                    }`}>
                                                    Net Balance
                                                </span>
                                            </div>
                                            <p className={`text-3xl font-black ${financialSummary.netBalance >= 0 ? 'text-teal-900' : 'text-orange-900'
                                                }`}>
                                                {financialSummary.netBalance >= 0 ? '+' : ''}₹{financialSummary.netBalance.toLocaleString()}
                                            </p>
                                            <p className={`text-sm mt-1 font-medium ${financialSummary.netBalance >= 0 ? 'text-teal-800' : 'text-orange-800'
                                                }`}>
                                                {financialSummary.netBalance >= 0 ? 'Profit Margin' : 'Loss Margin'}: {
                                                    financialSummary.totalIncome > 0
                                                        ? Math.round((financialSummary.netBalance / financialSummary.totalIncome) * 100)
                                                        : 0
                                                }%
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-emerald-100">Category Breakdown</h3>
                                    {/* Chart & Grid Section */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Chart Section */}
                                        <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-emerald-400/20 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[400px]">
                                            <h4 className="absolute top-6 left-6 text-lg font-bold text-emerald-100">Expense Distribution</h4>

                                            {filteredEntries.filter(e => e.type === 'Expenses').length > 0 ? (
                                                <div className="w-full h-[300px] mt-8">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={allCategories.map(cat => ({
                                                                    name: cat,
                                                                    value: filteredEntries
                                                                        .filter(e => e.category === cat && e.type === 'Expenses')
                                                                        .reduce((sum, e) => sum + e.amount, 0)
                                                                })).filter(d => d.value > 0)}
                                                                cx="50%"
                                                                cy="50%"
                                                                innerRadius={60}
                                                                outerRadius={100}
                                                                paddingAngle={5}
                                                                dataKey="value"
                                                            >
                                                                {allCategories.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={[
                                                                        '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
                                                                    ][index % 8]} stroke="rgba(0,0,0,0.2)" />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip
                                                                formatter={(value: number) => `₹${value.toLocaleString()}`}
                                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#34d399', borderRadius: '12px', color: '#fff' }}
                                                                itemStyle={{ color: '#34d399' }}
                                                            />
                                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-emerald-300/40">
                                                    <div className="p-4 rounded-full bg-white/5 mb-4">
                                                        <BarChart3 className="h-8 w-8" />
                                                    </div>
                                                    <p>No expense data to display</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Grid Cards Section */}
                                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {allCategories.map((category, index) => {
                                                const categoryEntries = filteredEntries.filter(e => e.category === category);
                                                const categoryIncome = categoryEntries
                                                    .filter(e => e.type === 'Income')
                                                    .reduce((sum, e) => sum + e.amount, 0);
                                                const categoryExpenses = categoryEntries
                                                    .filter(e => e.type === 'Expenses')
                                                    .reduce((sum, e) => sum + e.amount, 0);

                                                if (categoryEntries.length === 0) return null;

                                                const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
                                                const cardColor = COLORS[index % COLORS.length];

                                                return (
                                                    <div key={category} className="group relative overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 hover:border-emerald-500/30 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: cardColor }} />

                                                        <div className="p-5">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <h4 className="font-bold text-lg text-emerald-50 group-hover:text-white transition-colors">{category}</h4>
                                                                    <p className="text-xs text-emerald-300/60">{categoryEntries.length} transactions</p>
                                                                </div>
                                                                <div className="p-2 rounded-lg bg-white/5 text-emerald-300">
                                                                    <FileText className="h-4 w-4" style={{ color: cardColor }} />
                                                                </div>
                                                            </div>

                                                            <div className="flex items-end justify-between">
                                                                <div>
                                                                    <p className="text-xs text-emerald-200/50 uppercase tracking-wider font-semibold mb-1">Total Flow</p>
                                                                    <p className="text-xl font-bold text-white">₹{(categoryIncome + categoryExpenses).toLocaleString()}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    {categoryExpenses > 0 && (
                                                                        <p className="text-sm font-medium text-red-400">
                                                                            -₹{categoryExpenses.toLocaleString()}
                                                                        </p>
                                                                    )}
                                                                    {categoryIncome > 0 && (
                                                                        <p className="text-sm font-medium text-green-400">
                                                                            +₹{categoryIncome.toLocaleString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="mt-8 text-center">
                    <p className="text-emerald-300/50 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-emerald-400/20">
                        Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED ✨
                    </p>
                </div>
            </main>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-emerald-500/20 text-emerald-50 max-w-md rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Trash2 className="h-6 w-6 text-red-400" />
                            Delete Entry?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-emerald-200/60 text-base">
                            This action cannot be undone. This will permanently delete the bookkeeping entry from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 mt-6">
                        <AlertDialogCancel className="bg-white/5 border-emerald-500/20 text-emerald-100 hover:bg-white/10 hover:text-white rounded-xl h-12 px-6">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border-0 rounded-xl h-12 px-6 font-bold shadow-lg shadow-red-500/20"
                        >
                            Delete Permanently
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
};

export default Bookkeeping;