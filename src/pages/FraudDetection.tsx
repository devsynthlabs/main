import { useState, useRef, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Upload, Search, FileText, Download, Shield, AlertTriangle, Filter, Plus, Cpu, Database, Calculator, History, Trash2, Eye } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  fraudScore: number;
  status: 'Normal' | 'Suspicious' | 'Fraud';
  method: string;
}

interface DetectionHistory {
  id: string;
  timestamp: Date;
  algorithm: string;
  totalTransactions: number;
  flaggedCount: number;
  parameters: {
    amountThreshold?: number;
    zscoreThreshold?: number;
    iforestContamination?: number;
  };
}

interface FormData {
  algorithm: 'rule' | 'zscore' | 'iforest';
  amountThreshold: number;
  zscoreThreshold: number;
  iforestContamination: number;
  dateColumn: string;
  amountColumn: string;
  descriptionColumn: string;
}

const FraudDetection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("detection");

  // Form State
  const [formData, setFormData] = useState<FormData>({
    algorithm: 'rule',
    amountThreshold: 10000,
    zscoreThreshold: 3.0,
    iforestContamination: 0.01,
    dateColumn: 'Date',
    amountColumn: 'Amount',
    descriptionColumn: 'Description'
  });

  // Data State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [detectionStats, setDetectionStats] = useState({
    total: 0,
    fraud: 0,
    suspicious: 0,
    normal: 0
  });

  // History State
  const [detectionHistory, setDetectionHistory] = useState<DetectionHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPosition, setHistoryPosition] = useState(0);

  // Sample Data
  const sampleTransactions: Transaction[] = [
    { id: "1", date: "2024-01-15", amount: 150.00, description: "Online Shopping", fraudScore: 0, status: 'Normal', method: 'Rule-based' },
    { id: "2", date: "2024-01-15", amount: 12500.00, description: "Wire Transfer", fraudScore: 1, status: 'Fraud', method: 'Rule-based' },
    { id: "3", date: "2024-01-14", amount: 75.50, description: "Grocery Store", fraudScore: 0, status: 'Normal', method: 'Rule-based' },
    { id: "4", date: "2024-01-14", amount: 3200.00, description: "ATM Withdrawal", fraudScore: 0.8, status: 'Suspicious', method: 'Z-score' },
    { id: "5", date: "2024-01-13", amount: 280.00, description: "Restaurant", fraudScore: 0, status: 'Normal', method: 'Rule-based' },
    { id: "6", date: "2024-01-13", amount: 18500.00, description: "International Transfer", fraudScore: 1, status: 'Fraud', method: 'Rule-based' },
    { id: "7", date: "2024-01-12", amount: 4500.00, description: "Electronics Purchase", fraudScore: 0.6, status: 'Suspicious', method: 'Z-score' },
    { id: "8", date: "2024-01-12", amount: 95.00, description: "Fuel Station", fraudScore: 0, status: 'Normal', method: 'Rule-based' },
  ];

  // Initialize with sample data
  useEffect(() => {
    setTransactions(sampleTransactions);
    const flagged = sampleTransactions.filter(t => t.status !== 'Normal');
    setFlaggedTransactions(flagged);
    setDetectionStats({
      total: sampleTransactions.length,
      fraud: sampleTransactions.filter(t => t.status === 'Fraud').length,
      suspicious: sampleTransactions.filter(t => t.status === 'Suspicious').length,
      normal: sampleTransactions.filter(t => t.status === 'Normal').length
    });

    // Load sample history
    const sampleHistory: DetectionHistory[] = [
      {
        id: "1",
        timestamp: new Date('2024-01-15T10:30:00'),
        algorithm: 'Rule-based',
        totalTransactions: 8,
        flaggedCount: 2,
        parameters: { amountThreshold: 10000 }
      },
      {
        id: "2",
        timestamp: new Date('2024-01-14T14:45:00'),
        algorithm: 'Z-score',
        totalTransactions: 12,
        flaggedCount: 3,
        parameters: { zscoreThreshold: 3.0 }
      },
      {
        id: "3",
        timestamp: new Date('2024-01-13T09:15:00'),
        algorithm: 'Isolation Forest',
        totalTransactions: 15,
        flaggedCount: 4,
        parameters: { iforestContamination: 0.05 }
      }
    ];
    setDetectionHistory(sampleHistory);
  }, []);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real app, you would parse the CSV/Excel file here
      // For now, we'll use sample data
      setTransactions(sampleTransactions);
      const flagged = sampleTransactions.filter(t => t.status !== 'Normal');
      setFlaggedTransactions(flagged);
      setDetectionStats({
        total: sampleTransactions.length,
        fraud: sampleTransactions.filter(t => t.status === 'Fraud').length,
        suspicious: sampleTransactions.filter(t => t.status === 'Suspicious').length,
        normal: sampleTransactions.filter(t => t.status === 'Normal').length
      });
    }
  };

  // Isolation Forest Algorithm Implementation
  const isolationForestDetection = (transactions: Transaction[], contamination: number) => {
    // Mock implementation of Isolation Forest
    // In production, this would use a proper ML library

    const flaggedCount = Math.max(1, Math.floor(transactions.length * contamination));

    // Simple heuristic: flag transactions with highest amounts
    const sortedTransactions = [...transactions]
      .sort((a, b) => b.amount - a.amount);

    const flagged = sortedTransactions
      .slice(0, flaggedCount)
      .map(t => ({
        ...t,
        fraudScore: Math.random() * 0.5 + 0.5, // Random score 0.5-1.0
        status: Math.random() > 0.7 ? 'Fraud' as const : 'Suspicious' as const,
        method: 'Isolation Forest'
      }));

    return flagged;
  };

  // Run detection algorithm
  const runDetection = () => {
    setIsProcessing(true);
    setDetectionComplete(false);

    // Simulate processing delay
    setTimeout(() => {
      let newFlagged: Transaction[] = [];

      switch (formData.algorithm) {
        case 'rule':
          // Rule-based detection
          newFlagged = transactions.map(t => ({
            ...t,
            fraudScore: t.amount >= formData.amountThreshold ? 1 : 0,
            status: (t.amount >= formData.amountThreshold ? 'Fraud' : 'Normal') as 'Normal' | 'Suspicious' | 'Fraud',
            method: 'Rule-based'
          })).filter(t => t.status !== 'Normal');
          break;

        case 'zscore': {
          // Z-score detection simulation
          const amounts = transactions.map(t => t.amount);
          const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
          const std = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length);

          newFlagged = transactions.map(t => {
            const zScore = Math.abs((t.amount - mean) / std);
            const isFraud = zScore > formData.zscoreThreshold;
            return {
              ...t,
              fraudScore: isFraud ? Math.min(zScore / 10, 1) : 0,
              status: (isFraud ? (zScore > 5 ? 'Fraud' : 'Suspicious') : 'Normal') as 'Normal' | 'Suspicious' | 'Fraud',
              method: 'Z-score'
            };
          }).filter(t => t.status !== 'Normal');
          break;
        }

        case 'iforest':
          // Isolation Forest detection
          newFlagged = isolationForestDetection(transactions, formData.iforestContamination);
          break;
      }

      setFlaggedTransactions(newFlagged);
      setDetectionStats({
        total: transactions.length,
        fraud: newFlagged.filter(t => t.status === 'Fraud').length,
        suspicious: newFlagged.filter(t => t.status === 'Suspicious').length,
        normal: transactions.length - newFlagged.length
      });

      // Add to history
      const historyEntry: DetectionHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        algorithm: formData.algorithm === 'rule' ? 'Rule-based' :
          formData.algorithm === 'zscore' ? 'Z-score' : 'Isolation Forest',
        totalTransactions: transactions.length,
        flaggedCount: newFlagged.length,
        parameters: formData.algorithm === 'rule' ? { amountThreshold: formData.amountThreshold } :
          formData.algorithm === 'zscore' ? { zscoreThreshold: formData.zscoreThreshold } :
            { iforestContamination: formData.iforestContamination }
      };

      setDetectionHistory(prev => [historyEntry, ...prev]);
      setIsProcessing(false);
      setDetectionComplete(true);
    }, 1500);
  };

  // Export results
  const exportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Date,Amount,Description,Fraud Score,Status,Detection Method\n"
      + flaggedTransactions.map(t =>
        `${t.id},${t.date},${t.amount},${t.description},${t.fraudScore},${t.status},${t.method}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fraud_detection_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add custom rule (placeholder)
  const addCustomRule = () => {
    alert("Custom rule functionality would be implemented here!");
  };

  // Clear history
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all detection history?")) {
      setDetectionHistory([]);
    }
  };

  // Load historical detection
  const loadHistoricalDetection = (history: DetectionHistory) => {
    setFormData(prev => ({
      ...prev,
      algorithm: history.algorithm === 'Rule-based' ? 'rule' :
        history.algorithm === 'Z-score' ? 'zscore' : 'iforest',
      amountThreshold: history.parameters.amountThreshold || 10000,
      zscoreThreshold: history.parameters.zscoreThreshold || 3.0,
      iforestContamination: history.parameters.iforestContamination || 0.01
    }));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle history slider
  const handleHistoryScroll = (direction: 'left' | 'right') => {
    if (!historyContainerRef.current) return;

    const container = historyContainerRef.current;
    const scrollAmount = 300;
    const newPosition = direction === 'left'
      ? Math.max(0, historyPosition - scrollAmount)
      : historyPosition + scrollAmount;

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setHistoryPosition(newPosition);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // View results function - separate from detection
  const viewResults = () => {
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4 text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Fraud Detection System
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">AI-Powered Transaction Monitoring & Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-2xl p-1">
            <TabsTrigger
              value="detection"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl"
            >
              <Search className="h-4 w-4" />
              Detection Engine
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl"
            >
              <FileText className="h-4 w-4" />
              Detection Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detection">
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 shadow-2xl shadow-blue-500/20 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl" />

              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black text-blue-100 flex items-center gap-3">
                      <Cpu className="h-7 w-7 text-cyan-400" />
                      Fraud Detection Engine
                    </CardTitle>
                    <CardDescription className="text-blue-200/70 mt-2 text-base">
                      Upload transaction data and configure detection parameters
                    </CardDescription>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-md border border-blue-400/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-200 font-semibold">AI Engine Ready</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 p-8">
                {/* File Upload */}
                <div className="space-y-4">
                  <Label className="text-blue-100 font-bold text-lg flex items-center gap-2">
                    <Upload className="h-4 w-4 text-cyan-400" />
                    Upload Transaction Data
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 bg-white/5 backdrop-blur-xl text-blue-100 border-2 border-dashed border-blue-400/30 hover:border-blue-400/60 hover:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-6 w-6" />
                      <span className="font-medium">
                        {uploadedFile ? `Uploaded: ${uploadedFile.name}` : "Click to upload CSV or Excel file"}
                      </span>
                      <span className="text-sm text-blue-300/60">Supports .csv, .xlsx, .xls</span>
                    </Button>
                  </div>
                </div>

                {/* Detection Algorithm Selection */}
                <div className="space-y-4">
                  <Label className="text-blue-100 font-bold text-lg flex items-center gap-2">
                    <Filter className="h-4 w-4 text-cyan-400" />
                    Detection Algorithm
                  </Label>
                  <Select
                    value={formData.algorithm}
                    onValueChange={(value: 'rule' | 'zscore' | 'iforest') => handleInputChange('algorithm', value)}
                  >
                    <SelectTrigger className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border border-blue-400/30 text-white">
                      <SelectItem
                        value="rule"
                        className="text-blue-100 hover:bg-blue-600/50 focus:bg-blue-600/50 cursor-pointer"
                      >
                        Rule-based (amount threshold)
                      </SelectItem>
                      <SelectItem
                        value="zscore"
                        className="text-blue-100 hover:bg-blue-600/50 focus:bg-blue-600/50 cursor-pointer"
                      >
                        Z-score (statistical outliers)
                      </SelectItem>
                      <SelectItem
                        value="iforest"
                        className="text-blue-100 hover:bg-blue-600/50 focus:bg-blue-600/50 cursor-pointer"
                      >
                        Isolation Forest (ML)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Algorithm Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount Threshold */}
                  <div className="space-y-3">
                    <Label className="text-blue-300 text-sm">Amount Threshold ($)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={formData.amountThreshold}
                        onChange={(e) => handleInputChange('amountThreshold', parseFloat(e.target.value) || 0)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton onTranscript={(text) => handleInputChange('amountThreshold', text)} />
                    </div>
                  </div>

                  {/* Z-score Threshold */}
                  <div className="space-y-3">
                    <Label className="text-blue-300 text-sm">Z-score Threshold: {formData.zscoreThreshold.toFixed(2)}</Label>
                    <div className="relative">
                      <Slider
                        value={[formData.zscoreThreshold]}
                        onValueChange={(value) => handleInputChange('zscoreThreshold', value[0])}
                        min={1}
                        max={6}
                        step={0.1}
                        className="[&>span]:bg-blue-400"
                      />
                      <div className="flex justify-between text-xs text-blue-300/60 mt-2">
                        <span>1.0</span>
                        <span>6.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Isolation Forest Contamination */}
                  {formData.algorithm === 'iforest' && (
                    <div className="space-y-3 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-blue-300 text-sm">Isolation Forest Contamination</Label>
                        <span className="text-cyan-300 font-bold">{formData.iforestContamination.toFixed(3)}</span>
                      </div>
                      <div className="relative">
                        <Slider
                          value={[formData.iforestContamination]}
                          onValueChange={(value) => handleInputChange('iforestContamination', value[0])}
                          min={0}
                          max={0.3}
                          step={0.005}
                          className="[&>span]:bg-cyan-400"
                        />
                        <div className="flex justify-between text-xs text-blue-300/60 mt-2">
                          <span>0.000</span>
                          <span>0.300</span>
                        </div>
                      </div>
                      <p className="text-xs text-blue-300/60 mt-1">
                        Contamination: The proportion of outliers in the data set (0.01 = 1% expected fraud)
                      </p>
                    </div>
                  )}
                </div>

                {/* Column Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label className="text-blue-300 text-sm">Date Column</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.dateColumn}
                        onChange={(e) => handleInputChange('dateColumn', e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton onTranscript={(text) => handleInputChange('dateColumn', text)} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-300 text-sm">Amount Column</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.amountColumn}
                        onChange={(e) => handleInputChange('amountColumn', e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton onTranscript={(text) => handleInputChange('amountColumn', text)} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-300 text-sm">Description Column</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.descriptionColumn}
                        onChange={(e) => handleInputChange('descriptionColumn', e.target.value)}
                        className="bg-white/5 backdrop-blur-xl text-blue-100 border border-blue-400/30 rounded-xl h-12"
                      />
                      <VoiceButton onTranscript={(text) => handleInputChange('descriptionColumn', text)} />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={runDetection}
                    disabled={isProcessing || transactions.length === 0}
                    className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-lg rounded-xl shadow-2xl shadow-blue-500/50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-5 w-5" />
                        Run Detection
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={addCustomRule}
                    variant="outline"
                    className="h-14 border-2 border-blue-400/40 hover:bg-blue-400/10 text-blue-300 text-lg font-bold rounded-xl"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Rules
                  </Button>
                </div>

                {/* Detection Complete Message */}
                {detectionComplete && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <div>
                          <p className="text-green-300 font-semibold">Detection Complete!</p>
                          <p className="text-green-200/70 text-sm">
                            Found {flaggedTransactions.length} suspicious transactions out of {detectionStats.total} total
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={viewResults}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Results
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {/* Results Summary */}
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/30 rounded-3xl shadow-2xl shadow-blue-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <CardTitle className="text-2xl font-bold text-blue-100">Detection Results</CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    {detectionComplete && (
                      <Badge className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white border-0 px-3 py-1 rounded-xl font-semibold shadow-lg shadow-green-500/30">
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2" />
                        Latest Analysis
                      </Badge>
                    )}
                    <Badge className="bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white border-0 px-3 py-1 rounded-xl font-semibold shadow-lg shadow-red-500/30">
                      {detectionStats.fraud + detectionStats.suspicious} Flagged Transactions
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-blue-300/70">
                  {detectionStats.total} total transactions analyzed using {formData.algorithm === 'rule' ? 'Rule-based' : formData.algorithm === 'zscore' ? 'Z-score' : 'Isolation Forest'} algorithm
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-blue-400/20">
                    <p className="text-xs text-blue-400/80">Total Transactions</p>
                    <p className="text-2xl font-bold text-blue-300">{detectionStats.total}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-red-400/20">
                    <p className="text-xs text-red-400/80">Fraud Detected</p>
                    <p className="text-2xl font-bold text-red-300">{detectionStats.fraud}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-yellow-400/20">
                    <p className="text-xs text-yellow-400/80">Suspicious</p>
                    <p className="text-2xl font-bold text-yellow-300">{detectionStats.suspicious}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-green-400/20">
                    <p className="text-xs text-green-400/80">Normal</p>
                    <p className="text-2xl font-bold text-green-300">{detectionStats.normal}</p>
                  </div>
                </div>

                {/* Results Table */}
                {flaggedTransactions.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table className="backdrop-blur-xl bg-white/5 border border-blue-400/20 rounded-2xl">
                        <TableHeader>
                          <TableRow className="border-b border-blue-400/30">
                            <TableHead className="text-blue-300">Date</TableHead>
                            <TableHead className="text-blue-300">Amount</TableHead>
                            <TableHead className="text-blue-300">Description</TableHead>
                            <TableHead className="text-blue-300">Fraud Score</TableHead>
                            <TableHead className="text-blue-300">Status</TableHead>
                            <TableHead className="text-blue-300">Method</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {flaggedTransactions.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-white/5">
                              <TableCell className="text-blue-200">{transaction.date}</TableCell>
                              <TableCell className={`font-semibold ${transaction.amount >= 10000 ? 'text-red-400' : 'text-blue-300'
                                }`}>
                                ${transaction.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-blue-200">{transaction.description}</TableCell>
                              <TableCell>
                                <Badge className={
                                  transaction.fraudScore > 0.7 ? 'bg-red-500/80 text-white' :
                                    transaction.fraudScore > 0.3 ? 'bg-yellow-500/80 text-white' :
                                      'bg-green-500/80 text-white'
                                }>
                                  {transaction.fraudScore.toFixed(2)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={
                                  transaction.status === 'Fraud' ? 'bg-red-500/80 text-white' :
                                    transaction.status === 'Suspicious' ? 'bg-yellow-500/80 text-white' :
                                      'bg-green-500/80 text-white'
                                }>
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-blue-200">{transaction.method}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <Button
                        onClick={exportResults}
                        className="px-8 py-4 h-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-blue-500/50"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Export Results
                      </Button>
                      <Button
                        onClick={() => setActiveTab("detection")}
                        variant="outline"
                        className="px-8 py-4 h-auto border-2 border-blue-400/40 hover:bg-blue-400/10 text-blue-300 text-lg font-bold rounded-2xl"
                      >
                        <Calculator className="mr-2 h-5 w-5" />
                        Run New Analysis
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30">
                        <Database className="h-12 w-12 text-blue-300 animate-pulse" />
                      </div>
                      <p className="text-blue-300/80 text-lg font-medium">No flagged transactions found.</p>
                      <p className="text-blue-400/60 text-sm">Run detection on your transaction data to see results here</p>
                      <Button
                        onClick={() => setActiveTab("detection")}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                      >
                        <Calculator className="mr-2 h-4 w-4" />
                        Run Detection
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detection History Card - only in results tab */}
            <Card className="backdrop-blur-2xl bg-white/10 border border-blue-400/20 rounded-3xl shadow-2xl shadow-blue-500/20 mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-cyan-400" />
                    <CardTitle className="text-2xl font-bold text-blue-100">Detection History</CardTitle>
                    <Badge className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white border-0">
                      {detectionHistory.length} Analyses
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowHistory(!showHistory)}
                      variant="outline"
                      size="sm"
                      className="border-blue-400/30 text-blue-300 hover:bg-blue-400/10"
                    >
                      {showHistory ? 'Hide' : 'Show'} History
                    </Button>
                    <Button
                      onClick={clearHistory}
                      variant="outline"
                      size="sm"
                      className="border-red-400/30 text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-blue-300/70">
                  View and manage your past fraud detection analyses
                </CardDescription>
              </CardHeader>

              {showHistory && (
                <CardContent>
                  {/* History Slider Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      onClick={() => handleHistoryScroll('left')}
                      variant="ghost"
                      size="sm"
                      disabled={historyPosition <= 0}
                      className="text-blue-300 hover:text-blue-100"
                    >
                      ← Previous
                    </Button>
                    <span className="text-blue-300 text-sm">
                      Showing {Math.min(detectionHistory.length, 3)} of {detectionHistory.length} analyses
                    </span>
                    <Button
                      onClick={() => handleHistoryScroll('right')}
                      variant="ghost"
                      size="sm"
                      className="text-blue-300 hover:text-blue-100"
                    >
                      Next →
                    </Button>
                  </div>

                  {/* History Slider */}
                  <div className="relative">
                    <div
                      ref={historyContainerRef}
                      className="flex overflow-x-auto scrollbar-hide gap-4 pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {detectionHistory.map((history) => (
                        <Card
                          key={history.id}
                          className="min-w-[300px] max-w-[350px] backdrop-blur-xl bg-white/5 border border-blue-400/20 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-shadow duration-300"
                        >
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                                    <Calculator className="h-4 w-4 text-cyan-400" />
                                  </div>
                                  <span className="font-semibold text-blue-100">
                                    {history.algorithm}
                                  </span>
                                </div>
                                <Badge className={
                                  history.flaggedCount > 5 ? 'bg-red-500/80' :
                                    history.flaggedCount > 2 ? 'bg-yellow-500/80' :
                                      'bg-green-500/80'
                                }>
                                  {history.flaggedCount} flagged
                                </Badge>
                              </div>

                              {/* Details */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-blue-300/70">Date:</span>
                                  <span className="text-blue-200">
                                    {history.timestamp.toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-blue-300/70">Time:</span>
                                  <span className="text-blue-200">
                                    {history.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-blue-300/70">Total Transactions:</span>
                                  <span className="text-blue-200 font-semibold">
                                    {history.totalTransactions}
                                  </span>
                                </div>

                                {/* Parameters */}
                                <div className="pt-3 border-t border-blue-400/20">
                                  <p className="text-xs text-blue-300/70 mb-2">Parameters:</p>
                                  <div className="space-y-1">
                                    {history.parameters.amountThreshold && (
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-blue-300">Amount Threshold:</span>
                                        <span className="text-cyan-300 font-semibold">
                                          ${history.parameters.amountThreshold.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    {history.parameters.zscoreThreshold && (
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-blue-300">Z-score:</span>
                                        <span className="text-cyan-300 font-semibold">
                                          {history.parameters.zscoreThreshold.toFixed(1)}
                                        </span>
                                      </div>
                                    )}
                                    {history.parameters.iforestContamination && (
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="text-blue-300">Contamination:</span>
                                        <span className="text-cyan-300 font-semibold">
                                          {history.parameters.iforestContamination.toFixed(3)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button
                                onClick={() => loadHistoricalDetection(history)}
                                className="w-full mt-4 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-500/80 hover:to-cyan-500/80 text-white border border-blue-400/30"
                                size="sm"
                              >
                                <Eye className="h-3 w-3 mr-2" />
                                Load This Configuration
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Empty History State */}
                  {detectionHistory.length === 0 && (
                    <div className="text-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full">
                          <Database className="h-8 w-8 text-blue-300/50" />
                        </div>
                        <p className="text-blue-300/70">No detection history yet</p>
                        <p className="text-blue-400/50 text-sm">Run fraud detection to see your history here</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FraudDetection;