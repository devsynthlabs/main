import React, { useState, useRef, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  Download,
  Plus,
  Trash2,
  Printer,
  Calculator,
  Eye,
  Copy,
  MessageCircle,
  CheckCircle,
  Camera,
  Loader2,
  Search,
  Calendar,
  User,
  Mail,
  Package,
  DollarSign,
  Percent,
  Sparkles,
  Database,
  ChevronRight,
  BarChart,
  TrendingUp,
  CreditCard,
  Receipt,
  Building,
  Shield,
  Banknote,
  Mic,
  ShoppingCart,
  Building2,
  Smartphone,
  X,
  IndianRupee,
  Wallet,
  AlertCircle,
  Share2,
  Save
} from "lucide-react";
import { parseVoiceInvoiceText, parseInvoiceText } from "@/lib/voiceInvoiceParser";
import { API_ENDPOINTS } from "@/lib/api";
import Tesseract from "tesseract.js";
import DocScanner from "@/components/DocScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Indian States for GST
const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const GST_SLABS = ["0", "5", "12", "18", "28"];
const UNITS = ["Pcs", "Kg", "Ltr", "Mtr", "Box", "Dozen", "Pair", "Set", "Nos"];

// Vyapar-style Invoice Item interface
interface InvoiceItem {
  id: string;
  itemName: string;
  itemCode: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  priceWithTax: boolean;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  amount: number;
}

// Vyapar-style Invoice Data interface
interface InvoiceData {
  type: 'sales' | 'purchase';
  saleType: 'credit' | 'cash';
  partyName: string;
  phoneNo: string;
  eWayBillNo: string;
  invoiceNo: string;
  invoiceDate: string;
  stateOfSupply: string;
  items: InvoiceItem[];
  total: number;
  paid: number;
  balance: number;
  paymentMethod: string;
  uploadedBill: string | null;
  customerEmail?: string;
  customerGSTIN?: string;
}

const AutomationInvoice = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const billUploadRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'create' | 'ocr' | 'history' | 'voice'>('create');
  const [invoiceType, setInvoiceType] = useState<'sales' | 'purchase'>('sales');

  // Generate invoice number
  const generateInvoiceNo = (type: 'sales' | 'purchase') => {
    const prefix = type === 'sales' ? 'INV' : 'PUR';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}${month}-${random}`;
  };

  // Invoice state (Vyapar-style)
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>({
    type: 'sales',
    saleType: 'cash',
    partyName: '',
    phoneNo: '',
    eWayBillNo: '',
    invoiceNo: generateInvoiceNo('sales'),
    invoiceDate: new Date().toISOString().split('T')[0],
    stateOfSupply: '',
    items: [],
    total: 0,
    paid: 0,
    balance: 0,
    paymentMethod: 'cash',
    uploadedBill: null,
    customerEmail: '',
    customerGSTIN: ''
  });

  // New item form state
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    itemName: '',
    itemCode: '',
    hsnCode: '',
    quantity: 1,
    unit: 'Pcs',
    pricePerUnit: 0,
    priceWithTax: false,
    discountPercent: 0,
    taxPercent: 18
  });

  // State for invoice history
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceData[]>([]);

  // State for OCR
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // State for voice dictation
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Search state for history
  const [searchTerm, setSearchTerm] = useState("");

  // Load saved invoices from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedInvoices');
    if (saved) {
      setInvoiceHistory(JSON.parse(saved));
    }
  }, []);

  // Switch between Sales and Purchase
  const handleInvoiceTypeChange = (type: 'sales' | 'purchase') => {
    setInvoiceType(type);
    setCurrentInvoice(prev => ({
      ...prev,
      type: type,
      invoiceNo: generateInvoiceNo(type),
      items: [],
      total: 0,
      paid: 0,
      balance: 0
    }));
  };

  // Calculate item amounts
  const calculateItemAmounts = (item: Partial<InvoiceItem>): Partial<InvoiceItem> => {
    const qty = item.quantity || 0;
    const price = item.pricePerUnit || 0;
    const discountPct = item.discountPercent || 0;
    const taxPct = item.taxPercent || 0;
    const priceWithTax = item.priceWithTax || false;

    let baseAmount = qty * price;
    let discountAmount = (baseAmount * discountPct) / 100;
    let afterDiscount = baseAmount - discountAmount;

    let taxAmount: number;
    let finalAmount: number;

    if (priceWithTax) {
      const taxMultiplier = 1 + (taxPct / 100);
      const preTaxAmount = afterDiscount / taxMultiplier;
      taxAmount = afterDiscount - preTaxAmount;
      finalAmount = afterDiscount;
    } else {
      taxAmount = (afterDiscount * taxPct) / 100;
      finalAmount = afterDiscount + taxAmount;
    }

    return {
      ...item,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      amount: Math.round(finalAmount * 100) / 100
    };
  };

  // Add item to invoice
  const addItemToInvoice = () => {
    if (!newItem.itemName || !newItem.pricePerUnit) {
      toast.error("Please enter item name and price");
      return;
    }

    const calculatedItem = calculateItemAmounts(newItem);
    const item: InvoiceItem = {
      id: `item-${Date.now()}`,
      itemName: newItem.itemName || '',
      itemCode: newItem.itemCode || '',
      hsnCode: newItem.hsnCode || '',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'Pcs',
      pricePerUnit: newItem.pricePerUnit || 0,
      priceWithTax: newItem.priceWithTax || false,
      discountPercent: newItem.discountPercent || 0,
      discountAmount: calculatedItem.discountAmount || 0,
      taxPercent: newItem.taxPercent || 0,
      taxAmount: calculatedItem.taxAmount || 0,
      amount: calculatedItem.amount || 0
    };

    const updatedItems = [...currentInvoice.items, item];
    const newTotal = updatedItems.reduce((sum, i) => sum + i.amount, 0);

    setCurrentInvoice(prev => ({
      ...prev,
      items: updatedItems,
      total: newTotal,
      balance: newTotal - prev.paid
    }));

    // Reset new item form
    setNewItem({
      itemName: '',
      itemCode: '',
      hsnCode: '',
      quantity: 1,
      unit: 'Pcs',
      pricePerUnit: 0,
      priceWithTax: false,
      discountPercent: 0,
      taxPercent: 18
    });

    toast.success("Item added to invoice");
  };

  // Remove item from invoice
  const removeItem = (itemId: string) => {
    const updatedItems = currentInvoice.items.filter(i => i.id !== itemId);
    const newTotal = updatedItems.reduce((sum, i) => sum + i.amount, 0);

    setCurrentInvoice(prev => ({
      ...prev,
      items: updatedItems,
      total: newTotal,
      balance: newTotal - prev.paid
    }));
  };

  // Update paid amount
  const updatePaidAmount = (paid: number) => {
    setCurrentInvoice(prev => ({
      ...prev,
      paid: paid,
      balance: prev.total - paid
    }));
  };

  // Handle file upload for purchase bill
  const handleBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentInvoice(prev => ({
          ...prev,
          uploadedBill: event.target?.result as string
        }));
        toast.success("Bill uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  // Save invoice
  const saveInvoice = async () => {
    if (currentInvoice.items.length === 0) {
      toast.error("Please add at least one item to the invoice.");
      return;
    }

    if (!currentInvoice.partyName?.trim()) {
      toast.error(`Please enter ${currentInvoice.type === 'sales' ? 'customer' : 'party'} name.`);
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage
      const savedList = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const invoiceToSave = { ...currentInvoice, savedAt: new Date().toISOString(), id: `inv-${Date.now()}` };
      savedList.unshift(invoiceToSave);
      localStorage.setItem('savedInvoices', JSON.stringify(savedList));
      setInvoiceHistory(savedList);

      toast.success(`${currentInvoice.type === 'sales' ? 'Invoice' : 'Purchase Bill'} saved successfully!`);

      // Reset form
      resetForm();
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(`Error saving invoice: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save and create new
  const saveAndNew = async () => {
    await saveInvoice();
  };

  // Reset form
  const resetForm = () => {
    setCurrentInvoice({
      type: invoiceType,
      saleType: 'cash',
      partyName: '',
      phoneNo: '',
      eWayBillNo: '',
      invoiceNo: generateInvoiceNo(invoiceType),
      invoiceDate: new Date().toISOString().split('T')[0],
      stateOfSupply: '',
      items: [],
      total: 0,
      paid: 0,
      balance: 0,
      paymentMethod: 'cash',
      uploadedBill: null,
      customerEmail: '',
      customerGSTIN: ''
    });
  };

  // Handle file upload for OCR
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    setOcrProgress(0);
    setUploadedImage(URL.createObjectURL(file));

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      setOcrText(result.data.text);
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("Failed to extract text from image.");
    } finally {
      setIsProcessingOcr(false);
      setOcrProgress(0);
    }
  };

  // Export invoice
  const exportInvoice = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      let csvContent = "Item,Code,HSN,Quantity,Unit,Price,Discount,Tax,Amount\n";
      currentInvoice.items.forEach(item => {
        csvContent += `"${item.itemName}","${item.itemCode}","${item.hsnCode}",${item.quantity},"${item.unit}",${item.pricePerUnit},${item.discountAmount},${item.taxAmount},${item.amount}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${currentInvoice.invoiceNo}.csv`;
      a.click();
    } else {
      toast.info("PDF export coming soon!");
    }
  };

  // Print invoice
  const printInvoice = () => {
    window.print();
  };

  // Copy invoice details
  const copyInvoiceDetails = () => {
    const itemsList = currentInvoice.items.map(item =>
      `- ${item.itemName}: ${item.quantity} ${item.unit} x ₹${item.pricePerUnit} = ₹${item.amount}`
    ).join('\n');

    const details = `
Invoice: ${currentInvoice.invoiceNo}
Date: ${currentInvoice.invoiceDate}
${currentInvoice.type === 'sales' ? 'Customer' : 'Party'}: ${currentInvoice.partyName}
Phone: ${currentInvoice.phoneNo}

Items:
${itemsList}

Total: ₹${currentInvoice.total.toFixed(2)}
Paid: ₹${currentInvoice.paid.toFixed(2)}
Balance: ₹${currentInvoice.balance.toFixed(2)}`;

    navigator.clipboard.writeText(details)
      .then(() => toast.success("Invoice details copied to clipboard!"))
      .catch(err => console.error("Failed to copy:", err));
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    if (currentInvoice.items.length === 0) {
      toast.error("Add items before sharing");
      return;
    }

    const customerName = currentInvoice.partyName || 'Valued Customer';
    const isSales = currentInvoice.type === 'sales';

    // Items list
    const itemsList = currentInvoice.items.map((item, idx) =>
      `${idx + 1}. ${item.itemName} × ${item.quantity} = ₹${item.amount.toFixed(2)}`
    ).join('\n');

    // Build professional message
    let message = `Dear *${customerName}*,

Thank you for your ${isSales ? 'purchase' : 'business'}! Please find your ${isSales ? 'invoice' : 'bill'} details below:

📄 *${isSales ? 'Invoice' : 'Bill'} No:* ${currentInvoice.invoiceNo}
📅 *Date:* ${currentInvoice.invoiceDate}
${currentInvoice.stateOfSupply ? `📍 *State:* ${currentInvoice.stateOfSupply}\n` : ''}
*Items:*
${itemsList}

💰 *Total Amount: ₹${currentInvoice.total.toFixed(2)}*`;

    if (currentInvoice.paid > 0) {
      message += `\n✅ *Paid:* ₹${currentInvoice.paid.toFixed(2)}`;
    }
    if (currentInvoice.balance > 0) {
      message += `\n⚠️ *Balance Due:* ₹${currentInvoice.balance.toFixed(2)}`;
    }

    message += `

For any queries, please contact us.

Thank you for choosing us! 🙏`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  // Apply parsed voice data
  const handleApplyVoiceData = () => {
    if (!voiceTranscript) return;

    setIsProcessingVoice(true);

    const parsedData = parseVoiceInvoiceText(voiceTranscript);

    setTimeout(() => {
      let fieldsUpdated = 0;

      if (parsedData.invoiceNumber) {
        setCurrentInvoice(prev => ({ ...prev, invoiceNo: parsedData.invoiceNumber || prev.invoiceNo }));
        fieldsUpdated++;
      }

      if (parsedData.customerName) {
        setCurrentInvoice(prev => ({ ...prev, partyName: parsedData.customerName || prev.partyName }));
        fieldsUpdated++;
      }

      if (parsedData.items.length > 0) {
        let newItems: InvoiceItem[] = [...currentInvoice.items];

        parsedData.items.forEach(item => {
          const subtotal = item.quantity * item.rate;
          const taxPct = 18;
          const taxAmount = (subtotal * taxPct) / 100;

          newItems.push({
            id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            itemName: item.product,
            itemCode: '',
            hsnCode: '',
            quantity: item.quantity,
            unit: 'Pcs',
            pricePerUnit: item.rate,
            priceWithTax: false,
            discountPercent: 0,
            discountAmount: 0,
            taxPercent: taxPct,
            taxAmount: taxAmount,
            amount: subtotal + taxAmount
          });
        });

        const newTotal = newItems.reduce((sum, item) => sum + item.amount, 0);

        setCurrentInvoice(prev => ({
          ...prev,
          items: newItems,
          total: newTotal,
          balance: newTotal - prev.paid
        }));

        fieldsUpdated += parsedData.items.length;
      }

      setIsProcessingVoice(false);

      if (fieldsUpdated > 0) {
        toast.success(`Voice data applied! Updated ${fieldsUpdated} fields/items.`);
        setActiveTab('create');
      } else {
        toast.error("Could not extract any invoice details from the transcript.");
      }
    }, 1000);
  };

  // Calculate item preview
  const itemPreview = calculateItemAmounts(newItem);

  // Filter invoice history
  const filteredHistory = invoiceHistory.filter(invoice =>
    invoice.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.partyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-40 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-60 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 mb-6 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30">
              <Receipt className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Invoice & Billing
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">Vyapar-style Invoice with OCR & Voice Input</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center justify-between p-4 md:p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${activeTab === 'create'
              ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30'
              : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl ${activeTab === 'create' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5 border border-blue-400/20'}`}>
                <Plus className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-xl font-bold text-white">Create</h3>
                <p className="text-blue-200/70 text-xs hidden md:block">Sales & Purchase</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center justify-between p-4 md:p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${activeTab === 'ocr'
              ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30'
              : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl ${activeTab === 'ocr' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5 border border-blue-400/20'}`}>
                <Camera className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-xl font-bold text-white">OCR Scan</h3>
                <p className="text-blue-200/70 text-xs hidden md:block">Camera & upload</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center justify-between p-4 md:p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${activeTab === 'voice'
              ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30'
              : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl ${activeTab === 'voice' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5 border border-blue-400/20'}`}>
                <Mic className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-xl font-bold text-white">Voice</h3>
                <p className="text-blue-200/70 text-xs hidden md:block">Dictate invoice</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center justify-between p-4 md:p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${activeTab === 'history'
              ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30'
              : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 md:p-3 rounded-xl ${activeTab === 'history' ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5 border border-blue-400/20'}`}>
                <Eye className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-xl font-bold text-white">History</h3>
                <p className="text-blue-200/70 text-xs hidden md:block">Past invoices</p>
              </div>
            </div>
          </button>
        </div>

        {/* Create Invoice Tab - Vyapar Style */}
        {activeTab === 'create' && (
          <>
            {/* Sales/Purchase Toggle */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleInvoiceTypeChange('sales')}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  invoiceType === 'sales'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-2xl shadow-emerald-500/30'
                    : 'bg-white/10 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/10'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                Sales Invoice
              </button>
              <button
                onClick={() => handleInvoiceTypeChange('purchase')}
                className={`flex-1 py-3 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  invoiceType === 'purchase'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-2xl shadow-orange-500/30'
                    : 'bg-white/10 text-orange-300 border border-orange-400/30 hover:bg-orange-500/10'
                }`}
              >
                <Package className="h-5 w-5" />
                Purchase Bill
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Sale Type (Only for Sales) */}
                {invoiceType === 'sales' && (
                  <div className="backdrop-blur-2xl bg-white/10 rounded-2xl p-5 border border-blue-400/20">
                    <Label className="text-blue-100 mb-3 block font-medium">Sale Type</Label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCurrentInvoice(prev => ({ ...prev, saleType: 'cash' }))}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          currentInvoice.saleType === 'cash'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/5 text-emerald-300 border border-emerald-400/30'
                        }`}
                      >
                        <Banknote className="h-4 w-4" />
                        Cash
                      </button>
                      <button
                        onClick={() => setCurrentInvoice(prev => ({ ...prev, saleType: 'credit' }))}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          currentInvoice.saleType === 'credit'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-blue-300 border border-blue-400/30'
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        Credit
                      </button>
                    </div>
                  </div>
                )}

                {/* Customer/Party Details */}
                <div className="backdrop-blur-2xl bg-white/10 rounded-2xl p-5 border border-blue-400/20">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    {invoiceType === 'sales' ? 'Customer Details' : 'Party Details'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-blue-100 text-sm">{invoiceType === 'sales' ? 'Customer' : 'Party'} Name *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={currentInvoice.partyName}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, partyName: e.target.value }))}
                          placeholder="Enter name"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                        <VoiceButton
                          onTranscript={(text) => setCurrentInvoice(prev => ({ ...prev, partyName: text }))}
                          onClear={() => setCurrentInvoice(prev => ({ ...prev, partyName: '' }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-100 text-sm">Phone No.</Label>
                      <div className="flex gap-2">
                        <Input
                          value={currentInvoice.phoneNo}
                          onChange={(e) => setCurrentInvoice(prev => ({ ...prev, phoneNo: e.target.value }))}
                          placeholder="Phone number"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                        <VoiceButton
                          onTranscript={(text) => setCurrentInvoice(prev => ({ ...prev, phoneNo: text.replace(/\s/g, '') }))}
                          onClear={() => setCurrentInvoice(prev => ({ ...prev, phoneNo: '' }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-100 text-sm">E-Way Bill No.</Label>
                      <Input
                        value={currentInvoice.eWayBillNo}
                        onChange={(e) => setCurrentInvoice(prev => ({ ...prev, eWayBillNo: e.target.value }))}
                        placeholder="E-Way bill"
                        className="bg-white/5 border-blue-400/30 text-white h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-100 text-sm">{invoiceType === 'sales' ? 'Invoice' : 'Bill'} No.</Label>
                      <Input
                        value={currentInvoice.invoiceNo}
                        onChange={(e) => setCurrentInvoice(prev => ({ ...prev, invoiceNo: e.target.value }))}
                        className="bg-white/5 border-blue-400/30 text-white h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-100 text-sm">{invoiceType === 'sales' ? 'Invoice' : 'Bill'} Date</Label>
                      <Input
                        type="date"
                        value={currentInvoice.invoiceDate}
                        onChange={(e) => setCurrentInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                        className="bg-white/5 border-blue-400/30 text-white h-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-blue-100 text-sm">State of Supply</Label>
                      <Select
                        value={currentInvoice.stateOfSupply}
                        onValueChange={(val) => setCurrentInvoice(prev => ({ ...prev, stateOfSupply: val }))}
                      >
                        <SelectTrigger className="bg-white/5 border-blue-400/30 text-white h-9">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-blue-400/20 text-white max-h-[250px]">
                          {INDIAN_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Add Items Section */}
                <div className="backdrop-blur-2xl bg-white/10 rounded-2xl p-5 border border-blue-400/20">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-400" />
                    Add Items
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="col-span-2 space-y-2">
                        <Label className="text-blue-100 text-sm">Item Name *</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newItem.itemName}
                            onChange={(e) => setNewItem(prev => ({ ...prev, itemName: e.target.value }))}
                            placeholder="Enter item name"
                            className="bg-white/5 border-blue-400/30 text-white h-9"
                          />
                          <VoiceButton
                            onTranscript={(text) => setNewItem(prev => ({ ...prev, itemName: text }))}
                            onClear={() => setNewItem(prev => ({ ...prev, itemName: '' }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Item Code</Label>
                        <Input
                          value={newItem.itemCode}
                          onChange={(e) => setNewItem(prev => ({ ...prev, itemCode: e.target.value }))}
                          placeholder="SKU"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">HSN Code</Label>
                        <Input
                          value={newItem.hsnCode}
                          onChange={(e) => setNewItem(prev => ({ ...prev, hsnCode: e.target.value }))}
                          placeholder="HSN"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Qty</Label>
                        <Input
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                          min="1"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Unit</Label>
                        <Select value={newItem.unit} onValueChange={(val) => setNewItem(prev => ({ ...prev, unit: val }))}>
                          <SelectTrigger className="bg-white/5 border-blue-400/30 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-blue-400/20 text-white">
                            {UNITS.map(unit => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Price *</Label>
                        <Input
                          type="number"
                          value={newItem.pricePerUnit}
                          onChange={(e) => setNewItem(prev => ({ ...prev, pricePerUnit: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Disc %</Label>
                        <Input
                          type="number"
                          value={newItem.discountPercent}
                          onChange={(e) => setNewItem(prev => ({ ...prev, discountPercent: parseFloat(e.target.value) || 0 }))}
                          min="0"
                          max="100"
                          className="bg-white/5 border-blue-400/30 text-white h-9"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Tax %</Label>
                        <Select value={newItem.taxPercent?.toString()} onValueChange={(val) => setNewItem(prev => ({ ...prev, taxPercent: parseFloat(val) }))}>
                          <SelectTrigger className="bg-white/5 border-blue-400/30 text-white h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-blue-400/20 text-white">
                            {GST_SLABS.map(rate => (
                              <SelectItem key={rate} value={rate}>{rate}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-blue-100 text-sm">Price Type</Label>
                        <button
                          onClick={() => setNewItem(prev => ({ ...prev, priceWithTax: !prev.priceWithTax }))}
                          className={`w-full h-9 px-2 rounded-lg text-xs font-medium transition-all ${
                            newItem.priceWithTax
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/5 text-blue-300 border border-blue-400/30'
                          }`}
                        >
                          {newItem.priceWithTax ? 'With Tax' : 'Without Tax'}
                        </button>
                      </div>
                    </div>

                    {/* Item Preview */}
                    {newItem.itemName && newItem.pricePerUnit ? (
                      <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-400/20 flex justify-between items-center">
                        <div className="flex gap-4 text-sm">
                          <span className="text-blue-300/70">Disc: <span className="text-blue-100">₹{(itemPreview.discountAmount || 0).toFixed(2)}</span></span>
                          <span className="text-blue-300/70">Tax: <span className="text-blue-100">₹{(itemPreview.taxAmount || 0).toFixed(2)}</span></span>
                        </div>
                        <span className="text-lg font-bold text-emerald-400">₹{(itemPreview.amount || 0).toFixed(2)}</span>
                      </div>
                    ) : null}

                    <Button
                      onClick={addItemToInvoice}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>

                {/* Items Table */}
                {currentInvoice.items.length > 0 && (
                  <div className="backdrop-blur-2xl bg-white/10 rounded-2xl p-5 border border-blue-400/20 overflow-hidden">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-blue-400" />
                      Items ({currentInvoice.items.length})
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-white/5">
                            <th className="text-left py-2 px-3 text-blue-200">Item</th>
                            <th className="text-left py-2 px-3 text-blue-200">HSN</th>
                            <th className="text-center py-2 px-3 text-blue-200">Qty</th>
                            <th className="text-right py-2 px-3 text-blue-200">Price</th>
                            <th className="text-right py-2 px-3 text-blue-200">Disc.</th>
                            <th className="text-right py-2 px-3 text-blue-200">Tax</th>
                            <th className="text-right py-2 px-3 text-blue-200">Amount</th>
                            <th className="text-center py-2 px-3 text-blue-200"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentInvoice.items.map((item) => (
                            <tr key={item.id} className="border-b border-blue-400/10 hover:bg-white/5">
                              <td className="py-2 px-3 text-white">{item.itemName}</td>
                              <td className="py-2 px-3 text-blue-300">{item.hsnCode || '-'}</td>
                              <td className="py-2 px-3 text-center text-blue-200">{item.quantity}</td>
                              <td className="py-2 px-3 text-right text-blue-200">₹{item.pricePerUnit}</td>
                              <td className="py-2 px-3 text-right text-orange-300">₹{item.discountAmount}</td>
                              <td className="py-2 px-3 text-right text-indigo-300">₹{item.taxAmount}</td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-400">₹{item.amount}</td>
                              <td className="py-2 px-3 text-center">
                                <button onClick={() => removeItem(item.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Payment Type (Only for Purchase) */}
                {invoiceType === 'purchase' && (
                  <div className="backdrop-blur-2xl bg-white/10 rounded-2xl p-5 border border-orange-400/20">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-orange-400" />
                      Payment Type
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {[
                        { value: 'cash', label: 'Cash', icon: Banknote },
                        { value: 'cheque', label: 'Cheque', icon: FileText },
                        { value: 'razorpay', label: 'Razorpay', icon: CreditCard },
                        { value: 'gpay', label: 'GPay', icon: Smartphone },
                        { value: 'bank', label: 'Bank', icon: Building2 }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setCurrentInvoice(prev => ({ ...prev, paymentMethod: value }))}
                          className={`py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                            currentInvoice.paymentMethod === value
                              ? 'bg-orange-600 text-white'
                              : 'bg-white/5 text-orange-300 border border-orange-400/30'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Upload Bill */}
                    <div className="mt-4">
                      <div
                        onClick={() => billUploadRef.current?.click()}
                        className="border-2 border-dashed border-orange-400/30 rounded-xl p-4 text-center cursor-pointer hover:bg-orange-500/5 transition-all"
                      >
                        {currentInvoice.uploadedBill ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            <span className="text-emerald-300 text-sm">Bill uploaded</span>
                            <button onClick={(e) => { e.stopPropagation(); setCurrentInvoice(prev => ({ ...prev, uploadedBill: null })); }} className="p-1 text-red-400">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                            <p className="text-orange-300/70 text-sm">Upload Bill</p>
                          </>
                        )}
                      </div>
                      <input ref={billUploadRef} type="file" accept="image/*" onChange={handleBillUpload} className="hidden" />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6">
                <div className={`backdrop-blur-2xl rounded-2xl p-5 border-2 sticky top-6 ${
                  invoiceType === 'sales'
                    ? 'bg-gradient-to-b from-emerald-900/50 to-green-900/50 border-emerald-400/40'
                    : 'bg-gradient-to-b from-orange-900/50 to-amber-900/50 border-orange-400/40'
                }`}>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <IndianRupee className={`h-5 w-5 ${invoiceType === 'sales' ? 'text-emerald-400' : 'text-orange-400'}`} />
                    Summary
                  </h2>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80">Total</span>
                      <span className={`text-2xl font-bold ${invoiceType === 'sales' ? 'text-emerald-400' : 'text-orange-400'}`}>
                        ₹{currentInvoice.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-white/80 text-sm">Paid Amount</Label>
                      <Input
                        type="number"
                        value={currentInvoice.paid}
                        onChange={(e) => updatePaidAmount(parseFloat(e.target.value) || 0)}
                        min="0"
                        className="bg-white/10 border-white/20 text-white font-bold h-10"
                      />
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-white/10">
                      <span className="text-white/80">Balance</span>
                      <span className={`text-xl font-bold ${currentInvoice.balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        ₹{currentInvoice.balance.toFixed(2)}
                      </span>
                    </div>

                    {currentInvoice.balance > 0 && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <span>Due: ₹{currentInvoice.balance.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-2">
                    <Button
                      onClick={saveInvoice}
                      disabled={isSaving || currentInvoice.items.length === 0}
                      className={`w-full py-3 font-bold rounded-xl ${
                        invoiceType === 'sales'
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500'
                          : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500'
                      }`}
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      Save
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={printInvoice} variant="outline" className="py-2 bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      <Button onClick={copyInvoiceDetails} variant="outline" className="py-2 bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>

                    {/* WhatsApp Share Button */}
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-full py-3 bg-[#25D366]/10 text-[#25D366] rounded-xl font-bold hover:bg-[#25D366]/20 transition-all duration-300 border border-[#25D366]/30 hover:border-[#25D366]/50 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/10"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Share on WhatsApp
                    </button>

                    <Button onClick={saveAndNew} disabled={isSaving || currentInvoice.items.length === 0} variant="outline" className="w-full py-2 bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Save & New
                    </Button>

                    <Button onClick={() => exportInvoice('csv')} variant="outline" className="w-full py-2 bg-white/5 border-white/20 text-white hover:bg-white/10 text-sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* OCR Tab */}
        {activeTab === 'ocr' && (
          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Camera className="h-6 w-6 text-blue-400" />
              Document Scanner
            </h2>
            <p className="text-blue-200/70 mb-8">
              Scan documents using camera or upload images. Apply filters, crop, and extract text with OCR.
            </p>

            <DocScanner
              onTextExtracted={(text) => {
                setOcrText(text);
                const parsed = parseInvoiceText(text);
                if (parsed.items.length > 0 || parsed.invoiceNumber || parsed.customerName) {
                  const newInvoiceItems = parsed.items.map(item => {
                    const subtotal = item.quantity * item.rate;
                    const taxPct = 18;
                    const taxAmount = (subtotal * taxPct) / 100;
                    return {
                      id: Math.random().toString(36).substr(2, 9),
                      itemName: item.product,
                      itemCode: '',
                      hsnCode: '',
                      quantity: item.quantity,
                      unit: 'Pcs',
                      pricePerUnit: item.rate,
                      priceWithTax: false,
                      discountPercent: 0,
                      discountAmount: 0,
                      taxPercent: taxPct,
                      taxAmount: taxAmount,
                      amount: subtotal + taxAmount
                    };
                  });

                  const newTotal = newInvoiceItems.reduce((sum, item) => sum + item.amount, 0);

                  setCurrentInvoice(prev => ({
                    ...prev,
                    invoiceNo: parsed.invoiceNumber || prev.invoiceNo,
                    partyName: parsed.customerName || prev.partyName,
                    invoiceDate: parsed.invoiceDate || prev.invoiceDate,
                    items: newInvoiceItems.length > 0 ? newInvoiceItems : prev.items,
                    total: newInvoiceItems.length > 0 ? newTotal : prev.total,
                    balance: newInvoiceItems.length > 0 ? newTotal - prev.paid : prev.balance
                  }));

                  toast.success("Data extracted! Go to Create tab to review.");
                }
              }}
              onImageProcessed={(imageData) => {
                setUploadedImage(imageData);
              }}
            />
          </div>
        )}

        {/* Voice Tab */}
        {activeTab === 'voice' && (
          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Mic className="h-6 w-6 text-blue-400" />
              Voice Dictation Mode
            </h2>
            <p className="text-blue-200/70 mb-8">
              Dictate your invoice details naturally. Mention invoice number, customer name, and items with quantities and rates.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-blue-400/30 rounded-3xl p-12 text-center bg-gradient-to-b from-blue-500/10 to-indigo-500/10">
                  <div className="flex flex-col items-center gap-6">
                    <VoiceButton
                      onTranscript={(text) => setVoiceTranscript(prev => prev + " " + text)}
                      onClear={() => setVoiceTranscript("")}
                      size="lg"
                      className="scale-150 mb-4"
                    />
                    <div>
                      <p className="text-xl font-bold text-white mb-2">Hold the mic to speak</p>
                      <p className="text-sm text-blue-300/80">
                        Try: "Invoice number INV-101, customer John Doe, add item Table quantity 2 rate 5000"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleApplyVoiceData}
                    disabled={!voiceTranscript || isProcessingVoice}
                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${!voiceTranscript || isProcessingVoice
                      ? 'bg-gray-700/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                      }`}
                  >
                    {isProcessingVoice ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    Apply Voice Data
                  </button>
                  <button
                    onClick={() => setVoiceTranscript("")}
                    className="px-6 py-4 bg-white/5 text-blue-300 rounded-2xl font-medium hover:bg-red-500/20 hover:text-red-300 border border-blue-400/20"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-blue-100">Live Transcript Preview</label>
                <div className="border border-blue-400/20 rounded-2xl p-6 bg-gradient-to-b from-blue-500/10 to-indigo-500/10 min-h-[300px]">
                  <textarea
                    value={voiceTranscript}
                    onChange={(e) => setVoiceTranscript(e.target.value)}
                    placeholder="Transcript will appear here..."
                    className="w-full h-full min-h-[250px] bg-transparent text-white font-medium resize-none focus:outline-none placeholder:text-blue-300/20"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-400/10">
              <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Voice Command Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-bold text-white">Invoice No:</p>
                  <p className="text-blue-200/60 font-mono">"invoice number ABC-123"</p>
                </div>
                <div>
                  <p className="font-bold text-white">Customer:</p>
                  <p className="text-blue-200/60 font-mono">"customer name Jane Smith"</p>
                </div>
                <div>
                  <p className="font-bold text-white">Adding Items:</p>
                  <p className="text-blue-200/60 font-mono">"item Laptop quantity 1 price 45000"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Eye className="h-6 w-6 text-blue-400" />
                    Invoice History
                  </h2>
                  <p className="text-blue-300/70 mt-2">{invoiceHistory.length} invoice{invoiceHistory.length !== 1 ? 's' : ''} saved</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/5 text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 w-64"
                  />
                </div>
              </div>

              {filteredHistory.length > 0 ? (
                <div className="grid gap-4">
                  {filteredHistory.map((invoice, index) => (
                    <div
                      key={invoice.invoiceNo + index}
                      className="backdrop-blur-2xl bg-white/5 border border-blue-400/20 rounded-2xl p-5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-white">{invoice.invoiceNo}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              invoice.type === 'sales' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                            }`}>
                              {invoice.type === 'sales' ? 'SALES' : 'PURCHASE'}
                            </span>
                          </div>
                          <p className="text-blue-300/80 text-sm">
                            {invoice.partyName} | {invoice.invoiceDate}
                          </p>
                          <p className="text-blue-400/60 text-xs mt-1">{invoice.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${invoice.type === 'sales' ? 'text-emerald-400' : 'text-orange-400'}`}>
                            ₹{invoice.total.toFixed(2)}
                          </p>
                          {invoice.balance > 0 && (
                            <p className="text-red-400 text-sm">Due: ₹{invoice.balance.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-blue-400/40 mx-auto mb-4" />
                  <p className="text-blue-300/80 text-lg">No invoices found</p>
                  <p className="text-blue-400/60 text-sm">Create your first invoice to see it here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-blue-400/20 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300/60 text-sm">
            Invoice & Billing System • OCR & Voice Powered
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AutomationInvoice;
