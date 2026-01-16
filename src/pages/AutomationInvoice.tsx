import React, { useState, useRef, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate } from "react-router-dom";
import { VoiceButton } from "@/components/ui/VoiceButton";
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
  Banknote
} from "lucide-react";

// Mock API URL - Replace with your actual backend URL
const API_BASE_URL = "http://localhost:5000/api/invoices";

interface InvoiceItem {
  id: string;
  product: string;
  quantity: number;
  rate: number;
  subtotal: number;
  sgst: number;
  cgst: number;
  igst: number;
  total: number;
}

interface Invoice {
  id: string;
  _id?: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentMethod: string;
}

interface Trail {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const AutomationInvoice = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Cursor effects state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Trail[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'ocr' | 'history'>('create');

  // State for invoice creation
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>({
    id: `INV-${Date.now()}`,
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    customerName: "",
    customerEmail: "",
    items: [],
    subtotal: 0,
    totalTax: 0,
    grandTotal: 0,
    status: 'draft',
    paymentMethod: "Bank Transfer"
  });

  // State for new item form
  const [newItem, setNewItem] = useState({
    product: "",
    quantity: 1,
    rate: 0,
    sgst: 9,
    cgst: 9,
    igst: 0
  });

  // State for invoice history
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([
    {
      id: "INV-001",
      invoiceNumber: "INV-2024-001",
      date: "2024-01-15",
      customerName: "Tech Solutions Inc.",
      customerEmail: "accounting@techsolutions.com",
      items: [
        { 
          id: "1", 
          product: "VC Pillow", 
          quantity: 2, 
          rate: 250, 
          subtotal: 500, 
          sgst: 45, 
          cgst: 45, 
          igst: 0, 
          total: 590 
        },
        { 
          id: "2", 
          product: "Pillow Cover VC 85", 
          quantity: 1, 
          rate: 85, 
          subtotal: 85, 
          sgst: 7.65, 
          cgst: 7.65, 
          igst: 0, 
          total: 100.3 
        }
      ],
      subtotal: 585,
      totalTax: 105.3,
      grandTotal: 690.3,
      status: 'paid',
      paymentMethod: "Credit Card"
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-2024-002",
      date: "2024-01-10",
      customerName: "Global Traders Ltd.",
      customerEmail: "finance@globaltraders.com",
      items: [
        { 
          id: "3", 
          product: "Ceramic Bowl", 
          quantity: 5, 
          rate: 150, 
          subtotal: 750, 
          sgst: 67.5, 
          cgst: 67.5, 
          igst: 0, 
          total: 885 
        }
      ],
      subtotal: 750,
      totalTax: 135,
      grandTotal: 885,
      status: 'sent',
      paymentMethod: "Bank Transfer"
    }
  ]);

  // State for OCR
  const [ocrText, setOcrText] = useState("");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Search state for history
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined products
  const predefinedProducts = [
    { name: "VC Pillow", rate: 250 },
    { name: "Pillow Cover VC 85", rate: 85 },
    { name: "Lunch Towel VC25", rate: 25 },
    { name: "Ceramic Bowl", rate: 150 },
    { name: "Ruby Food Cover", rate: 130 },
    { name: "MS Straw Tumbler", rate: 210 }
  ];

  // Mouse tracking with enhanced trail effect
  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create multiple trail particles
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
      
      // Remove trails after animation
      setTimeout(() => {
        setCursorTrail((prev) => prev.filter((t) => !newTrails.find(nt => nt.id === t.id)));
      }, 800);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate item totals
  const calculateItemTotal = () => {
    const subtotal = newItem.quantity * newItem.rate;
    const sgstAmount = (subtotal * newItem.sgst) / 100;
    const cgstAmount = (subtotal * newItem.cgst) / 100;
    const igstAmount = (subtotal * newItem.igst) / 100;
    const total = subtotal + sgstAmount + cgstAmount + igstAmount;
    
    return { subtotal, sgstAmount, cgstAmount, igstAmount, total };
  };

  // Add item to invoice
  const addItemToInvoice = () => {
    if (!newItem.product || newItem.rate <= 0) {
      alert("Please enter product name and rate");
      return;
    }

    const { subtotal, sgstAmount, cgstAmount, igstAmount, total } = calculateItemTotal();

    const newInvoiceItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      product: newItem.product,
      quantity: newItem.quantity,
      rate: newItem.rate,
      subtotal: subtotal,
      sgst: sgstAmount,
      cgst: cgstAmount,
      igst: igstAmount,
      total: total
    };

    const updatedItems = [...currentInvoice.items, newInvoiceItem];
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const newTotalTax = updatedItems.reduce((sum, item) => sum + item.sgst + item.cgst + item.igst, 0);
    const newGrandTotal = newSubtotal + newTotalTax;

    setCurrentInvoice(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: newSubtotal,
      totalTax: newTotalTax,
      grandTotal: newGrandTotal
    }));

    // Reset form
    setNewItem({
      product: "",
      quantity: 1,
      rate: 0,
      sgst: 9,
      cgst: 9,
      igst: 0
    });
  };

  // Remove item from invoice
  const removeItem = (itemId: string) => {
    const updatedItems = currentInvoice.items.filter(item => item.id !== itemId);
    const newSubtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const newTotalTax = updatedItems.reduce((sum, item) => sum + item.sgst + item.cgst + item.igst, 0);
    const newGrandTotal = newSubtotal + newTotalTax;

    setCurrentInvoice(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: newSubtotal,
      totalTax: newTotalTax,
      grandTotal: newGrandTotal
    }));
  };

  // Save invoice
  const saveInvoice = () => {
    if (currentInvoice.items.length === 0) {
      alert("Please add items to the invoice");
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const newInvoice = {
        ...currentInvoice,
        id: `INV-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${(invoiceHistory.length + 1).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'sent' as const
      };

      setInvoiceHistory(prev => [newInvoice, ...prev]);
      
      // Reset current invoice
      setCurrentInvoice({
        id: `INV-${Date.now() + 1}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${(invoiceHistory.length + 2).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        customerName: "",
        customerEmail: "",
        items: [],
        subtotal: 0,
        totalTax: 0,
        grandTotal: 0,
        status: 'draft',
        paymentMethod: "Bank Transfer"
      });

      setIsSaving(false);
      alert("Invoice saved successfully!");
    }, 1000);
  };

  // Handle file upload for OCR
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    setUploadedImage(URL.createObjectURL(file));

    // Simulate OCR processing
    setTimeout(() => {
      const mockOcrText = `INVOICE #INV-2024-003
Date: ${new Date().toISOString().split('T')[0]}
Customer: Global Traders Ltd.

Product                Qty   Rate   Total
VC Pillow              2     250    500
Pillow Cover VC 85     1     85     85

Subtotal: 585
SGST (9%): 52.65
CGST (9%): 52.65
IGST (0%): 0
Grand Total: 690.3`;

      setOcrText(mockOcrText);
      setIsProcessingOcr(false);
    }, 2000);
  };

  // Export invoice
  const exportInvoice = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      let csvContent = "Product,Quantity,Rate,Subtotal,SGST,CGST,IGST,Total\n";
      currentInvoice.items.forEach(item => {
        csvContent += `"${item.product}",${item.quantity},${item.rate},${item.subtotal},${item.sgst},${item.cgst},${item.igst},${item.total}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${currentInvoice.invoiceNumber}.csv`;
      a.click();
    } else {
      alert("PDF export would be implemented with a PDF library");
    }
  };

  // Print invoice
  const printInvoice = () => {
    window.print();
  };

  // Copy invoice details
  const copyInvoiceDetails = () => {
    const details = `
Invoice: ${currentInvoice.invoiceNumber}
Date: ${currentInvoice.date}
Customer: ${currentInvoice.customerName}
Email: ${currentInvoice.customerEmail}

Items:
${currentInvoice.items.map(item => `- ${item.product}: ${item.quantity} x $${item.rate} = $${item.total}`).join('\n')}

Subtotal: $${currentInvoice.subtotal.toFixed(2)}
Tax: $${currentInvoice.totalTax.toFixed(2)}
Grand Total: $${currentInvoice.grandTotal.toFixed(2)}
Status: ${currentInvoice.status}
Payment Method: ${currentInvoice.paymentMethod}`;

    navigator.clipboard.writeText(details)
      .then(() => alert("Invoice details copied to clipboard!"))
      .catch(err => console.error("Failed to copy:", err));
  };

  // Load predefined product
  const loadPredefinedProduct = (productName: string, rate: number) => {
    setNewItem(prev => ({
      ...prev,
      product: productName,
      rate: rate
    }));
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Calculate item preview
  const itemPreview = calculateItemTotal();

  // Filter invoice history
  const filteredHistory = invoiceHistory.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Enhanced Custom Cursor */}
      <div 
        className="fixed pointer-events-none z-[99999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-blue-400/60 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full -translate-x-1/2"></div>
            </div>
          </div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <div className="w-full h-full border-2 border-blue-400/80 rounded-full animate-pulse"></div>
          </div>
          
          {/* Inner glow */}
          <div className="absolute inset-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-blue-400/30 rounded-full blur-md"></div>
          
          {/* Center dot */}
          <div className={`absolute inset-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
            isHovering ? 'bg-yellow-400 scale-150' : 'bg-blue-400'
          }`}></div>
          
          {/* Crosshair lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-16 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent -translate-x-1/2"></div>
            <div className="absolute h-16 w-[2px] bg-gradient-to-b from-transparent via-blue-400 to-transparent -translate-y-1/2"></div>
          </div>
        </div>
      </div>

      {/* Cursor Trail Particles */}
      {cursorTrail.map((trail) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[99998] animate-[trail_0.8s_ease-out_forwards]"
          style={{
            left: trail.x,
            top: trail.y,
            width: trail.size,
            height: trail.size,
            animationDelay: `${trail.delay}ms`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-[2px] shadow-lg shadow-blue-400/50"></div>
        </div>
      ))}

      <style>{`
        @keyframes trail {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) translateY(-40px);
            opacity: 0;
          }
        }
        
        input, select, button, textarea, [role="button"], [role="tab"] {
          cursor: auto !important;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-following gradient */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-purple-500/30 rounded-full blur-3xl transition-all duration-1000"
          style={{
            top: mousePosition.y / 20 - 400,
            left: mousePosition.x / 20 - 400,
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-40 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-60 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-blue-400/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={handleBackToDashboard}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="flex items-center text-blue-200 hover:text-blue-100 hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 mb-6 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div 
              className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl backdrop-blur-xl border border-blue-400/30 hover:rotate-12 transition-transform duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Receipt className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                Invoice Automation System
              </h1>
              <p className="text-blue-200/80 font-medium mt-1">OCR + Voice Input Powered Invoice Generation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tabs Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setActiveTab('create')}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`flex items-center justify-between p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${
              activeTab === 'create' 
                ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30' 
                : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                activeTab === 'create' 
                  ? 'bg-blue-500/20 border border-blue-400/30' 
                  : 'bg-white/5 border border-blue-400/20'
              }`}>
                <Plus className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Create Invoice</h3>
                <p className="text-blue-200/70 text-sm">Manual invoice creation</p>
              </div>
            </div>
            <ChevronRight className={`h-5 w-5 transition-transform ${
              activeTab === 'create' ? 'text-blue-400 rotate-90' : 'text-blue-400/60'
            }`} />
          </button>

          <button
            onClick={() => setActiveTab('ocr')}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`flex items-center justify-between p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${
              activeTab === 'ocr' 
                ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30' 
                : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                activeTab === 'ocr' 
                  ? 'bg-blue-500/20 border border-blue-400/30' 
                  : 'bg-white/5 border border-blue-400/20'
              }`}>
                <Camera className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">OCR Scan</h3>
                <p className="text-blue-200/70 text-sm">Upload invoice images</p>
              </div>
            </div>
            <ChevronRight className={`h-5 w-5 transition-transform ${
              activeTab === 'ocr' ? 'text-blue-400 rotate-90' : 'text-blue-400/60'
            }`} />
          </button>

          <button
            onClick={() => setActiveTab('history')}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`flex items-center justify-between p-6 rounded-2xl backdrop-blur-2xl border transition-all duration-300 ${
              activeTab === 'history' 
                ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-400/50 shadow-2xl shadow-blue-500/30' 
                : 'bg-white/10 border-blue-400/20 hover:bg-white/15 hover:border-blue-400/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                activeTab === 'history' 
                  ? 'bg-blue-500/20 border border-blue-400/30' 
                  : 'bg-white/5 border border-blue-400/20'
              }`}>
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Invoice History</h3>
                <p className="text-blue-200/70 text-sm">View all past invoices</p>
              </div>
            </div>
            <ChevronRight className={`h-5 w-5 transition-transform ${
              activeTab === 'history' ? 'text-blue-400 rotate-90' : 'text-blue-400/60'
            }`} />
          </button>
        </div>

        {/* Create Invoice Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <User className="h-6 w-6 text-blue-400" />
                  Customer Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={currentInvoice.invoiceNumber}
                      onChange={(e) => setCurrentInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Date
                    </label>
                    <input
                      type="date"
                      value={currentInvoice.date}
                      onChange={(e) => setCurrentInvoice(prev => ({ ...prev, date: e.target.value }))}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={currentInvoice.customerName}
                      onChange={(e) => setCurrentInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Enter customer name"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={currentInvoice.customerEmail}
                      onChange={(e) => setCurrentInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                      placeholder="customer@example.com"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                </div>
              </div>

              {/* Add Items */}
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Package className="h-6 w-6 text-blue-400" />
                  Add Invoice Items
                </h2>
                
                {/* Quick Product Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-100 mb-3">
                    Quick Product Selection
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {predefinedProducts.map((product, index) => (
                      <button
                        key={index}
                        onClick={() => loadPredefinedProduct(product.name, product.rate)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="px-4 py-2 bg-white/5 text-blue-100 rounded-xl text-sm hover:bg-blue-500/20 hover:text-white transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40 backdrop-blur-xl"
                      >
                        {product.name} (${product.rate})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newItem.product}
                      onChange={(e) => setNewItem(prev => ({ ...prev, product: e.target.value }))}
                      placeholder="Enter product name"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                  
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      min="1"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                  
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Rate ($)
                    </label>
                    <input
                      type="number"
                      value={newItem.rate}
                      onChange={(e) => setNewItem(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                    />
                  </div>
                  
                  <div className="space-y-3 group">
                    <label className="block text-sm font-medium text-blue-100">
                      Tax (%)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        value={newItem.sgst}
                        onChange={(e) => setNewItem(prev => ({ ...prev, sgst: parseFloat(e.target.value) || 0 }))}
                        placeholder="SGST"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="px-3 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl text-sm focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                      />
                      <input
                        value={newItem.cgst}
                        onChange={(e) => setNewItem(prev => ({ ...prev, cgst: parseFloat(e.target.value) || 0 }))}
                        placeholder="CGST"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="px-3 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl text-sm focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                      />
                      <input
                        value={newItem.igst}
                        onChange={(e) => setNewItem(prev => ({ ...prev, igst: parseFloat(e.target.value) || 0 }))}
                        placeholder="IGST"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="px-3 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl text-sm focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Item Preview */}
                {newItem.product && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-2xl mb-6 border border-blue-400/20 backdrop-blur-xl">
                    <h3 className="font-bold text-blue-300 mb-4 text-lg flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Item Preview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <div className="text-blue-200/70 text-sm">Product:</div>
                        <div className="font-medium text-white">{newItem.product}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-blue-200/70 text-sm">Quantity:</div>
                        <div className="font-medium text-white">{newItem.quantity}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-blue-200/70 text-sm">Rate:</div>
                        <div className="font-medium text-blue-300">${newItem.rate.toFixed(2)}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-blue-200/70 text-sm">Subtotal:</div>
                        <div className="font-medium text-indigo-300">${itemPreview.subtotal.toFixed(2)}</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-blue-200/70 text-sm">Total:</div>
                        <div className="font-bold text-blue-400 text-lg">${itemPreview.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={addItemToInvoice}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3"
                >
                  <Plus className="h-5 w-5" />
                  Add Item to Invoice
                </button>
              </div>

              {/* Current Items Table */}
              {currentInvoice.items.length > 0 && (
                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-blue-400" />
                    Current Invoice Items
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 backdrop-blur-xl">
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Product</th>
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Qty</th>
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Rate</th>
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Subtotal</th>
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Tax</th>
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Total</th>
                          <th className="text-left py-4 px-6 font-bold text-blue-100">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items.map((item) => (
                          <tr key={item.id} className="border-b border-blue-400/10 hover:bg-white/5 transition-colors duration-300">
                            <td className="py-4 px-6 text-white">{item.product}</td>
                            <td className="py-4 px-6 text-blue-200">{item.quantity}</td>
                            <td className="py-4 px-6 text-blue-300">${item.rate.toFixed(2)}</td>
                            <td className="py-4 px-6 text-indigo-300">${item.subtotal.toFixed(2)}</td>
                            <td className="py-4 px-6">
                              <div className="text-xs space-y-1">
                                <div className="text-blue-400">SGST: ${item.sgst.toFixed(2)}</div>
                                <div className="text-indigo-400">CGST: ${item.cgst.toFixed(2)}</div>
                                <div className="text-purple-400">IGST: ${item.igst.toFixed(2)}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-blue-400">${item.total.toFixed(2)}</td>
                            <td className="py-4 px-6">
                              <button
                                onClick={() => removeItem(item.id)}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                              >
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
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Invoice Summary */}
              <div className="backdrop-blur-2xl bg-gradient-to-b from-blue-900/90 via-indigo-900/80 to-purple-900/90 rounded-3xl p-8 shadow-2xl shadow-blue-500/30 border-2 border-blue-400/60 sticky top-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-blue-400" />
                  Invoice Summary
                </h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-blue-400/20">
                    <span className="text-blue-100 text-lg">Subtotal</span>
                    <span className="text-xl font-bold text-blue-300">
                      ${currentInvoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-b border-blue-400/20">
                    <span className="text-blue-100 text-lg">Total Tax</span>
                    <span className="text-xl font-semibold text-blue-400">
                      ${currentInvoice.totalTax.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-white">Grand Total</span>
                      <span className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        ${currentInvoice.grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Payment */}
                <div className="mt-8 space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-blue-100">
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        value={currentInvoice.paymentMethod}
                        onChange={(e) => setCurrentInvoice(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10 appearance-none"
                      >
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Stripe">Stripe</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronRight className="h-4 w-4 text-blue-400 rotate-90" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-blue-100">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setCurrentInvoice(prev => ({ ...prev, status }))}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                            currentInvoice.status === status 
                              ? 'bg-blue-500/30 text-white border border-blue-400/50 shadow-lg shadow-blue-500/30' 
                              : 'bg-white/5 text-blue-200 border border-blue-400/20 hover:bg-white/10 hover:border-blue-400/30'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={saveInvoice}
                    disabled={currentInvoice.items.length === 0 || isSaving}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                      currentInvoice.items.length === 0 || isSaving
                        ? 'bg-gray-700/30 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-[1.02] shadow-2xl shadow-blue-500/30'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Save Invoice
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => exportInvoice('csv')}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-blue-500/20 transition-all duration-300 border border-blue-400/20 hover:border-blue-400/40 flex items-center justify-center gap-2 backdrop-blur-xl"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                    
                    <button
                      onClick={printInvoice}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="py-3 bg-white/5 text-indigo-300 rounded-xl font-medium hover:bg-indigo-500/20 transition-all duration-300 border border-indigo-400/20 hover:border-indigo-400/40 flex items-center justify-center gap-2 backdrop-blur-xl"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </button>
                  </div>
                  
                  <button
                    onClick={copyInvoiceDetails}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="w-full py-3 bg-white/5 text-blue-200 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 border border-blue-400/20 hover:border-blue-400/30 flex items-center justify-center gap-2 backdrop-blur-xl"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Details
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart className="h-5 w-5 text-blue-400" />
                  Quick Stats
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-blue-400/10">
                    <span className="text-blue-200">Total Items</span>
                    <span className="font-bold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-400/30">
                      {currentInvoice.items.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-blue-400/10">
                    <span className="text-blue-200">Avg. Item Value</span>
                    <span className="font-medium text-blue-300">
                      ${currentInvoice.items.length > 0 ? (currentInvoice.subtotal / currentInvoice.items.length).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-blue-200">Tax Rate</span>
                    <span className="font-medium text-indigo-300">
                      {((currentInvoice.totalTax / currentInvoice.subtotal) * 100 || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OCR Tab */}
        {activeTab === 'ocr' && (
          <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Camera className="h-6 w-6 text-blue-400" />
              OCR Image Processing
            </h2>
            <p className="text-blue-200/70 mb-8">
              Upload an invoice image to automatically extract text and populate fields
            </p>
            
            {/* Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-blue-100 mb-4">
                Upload Invoice Image
              </label>
              <div className="border-2 border-dashed border-blue-400/30 rounded-3xl p-12 text-center bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-6">
                  <div className="p-6 bg-blue-500/20 rounded-full border border-blue-400/30">
                    <Upload className="h-12 w-12 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white mb-2">
                      {uploadedImage ? "Image Uploaded" : "Drag & drop or click to upload"}
                    </p>
                    <p className="text-sm text-blue-300/80">
                      Supports JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="px-6 py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-blue-500/20 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50 backdrop-blur-xl"
                  >
                    {uploadedImage ? "Change Image" : "Browse Files"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Preview & Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Preview */}
              {uploadedImage && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-blue-100">
                    Image Preview
                  </label>
                  <div className="border border-blue-400/20 rounded-2xl overflow-hidden bg-black/20 backdrop-blur-xl">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded invoice" 
                      className="w-full h-80 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* OCR Results */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-blue-100">
                  Extracted Text
                </label>
                {isProcessingOcr ? (
                  <div className="border border-blue-400/20 rounded-2xl p-12 text-center bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 border-2 border-blue-400 border-t-blue-600 rounded-full animate-spin" />
                      <p className="text-white font-bold text-lg">Processing OCR...</p>
                      <p className="text-sm text-blue-300/80">Extracting text from image</p>
                    </div>
                  </div>
                ) : ocrText ? (
                  <div className="border border-blue-400/20 rounded-2xl p-6 bg-gradient-to-b from-blue-500/10 to-indigo-500/10 backdrop-blur-xl">
                    <textarea
                      value={ocrText}
                      onChange={(e) => setOcrText(e.target.value)}
                      className="w-full min-h-[280px] bg-black/30 text-white rounded-xl p-4 font-mono text-sm border border-blue-400/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300"
                      readOnly
                    />
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => {
                          if (ocrText.includes("VC Pillow")) {
                            setNewItem({
                              product: "VC Pillow",
                              quantity: 2,
                              rate: 250,
                              sgst: 9,
                              cgst: 9,
                              igst: 0
                            });
                            setActiveTab('create');
                            alert("Auto-filled VC Pillow from OCR text!");
                          }
                        }}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/30"
                      >
                        Auto-fill Fields
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(ocrText)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="px-6 py-3 bg-white/5 text-blue-300 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 border border-blue-400/20 hover:border-blue-400/30"
                      >
                        Copy Text
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-blue-400/20 rounded-2xl p-12 text-center bg-gradient-to-b from-blue-500/5 to-indigo-500/5 backdrop-blur-xl">
                    <p className="text-blue-300/60">Upload an image to see extracted text</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            {/* Search Section */}
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 border border-blue-400/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Eye className="h-6 w-6 text-blue-400" />
                    Invoice History
                  </h2>
                  <p className="text-blue-300/70 mt-2">
                    {invoiceHistory.length} invoice{invoiceHistory.length !== 1 ? 's' : ''} in history
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      className="pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 hover:bg-white/10 w-64"
                    />
                  </div>
                </div>
              </div>

              {filteredHistory.length > 0 ? (
                <div className="grid gap-6">
                  {filteredHistory.map((invoice, index) => (
                    <div 
                      key={invoice.id} 
                      className="backdrop-blur-2xl bg-white/5 border border-blue-400/20 rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 group"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 flex-wrap">
                            <h3 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors duration-300">
                              {invoice.invoiceNumber}
                            </h3>
                            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              invoice.status === 'paid' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                              invoice.status === 'sent' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30' :
                              invoice.status === 'overdue' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                              'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                            }`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <p className="text-blue-300/80">
                              Date: {invoice.date} | Customer: {invoice.customerName}
                            </p>
                            <p className="text-blue-300/80">
                              Email: {invoice.customerEmail}
                            </p>

                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-blue-300">
                                  {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-blue-400" />
                                <span className="text-sm text-blue-300 font-medium">
                                  Subtotal: ${invoice.subtotal.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4 text-indigo-400" />
                                <span className="text-sm text-indigo-300 font-medium">
                                  Tax: ${invoice.totalTax.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-blue-400/20">
                              <p className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text group-hover:from-blue-200 group-hover:to-indigo-200">
                                Grand Total: ${invoice.grandTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setCurrentInvoice(invoice);
                              setActiveTab('create');
                            }}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-xl font-medium hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 hover:border-blue-400/50"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              let csvContent = "Product,Quantity,Rate,Subtotal,SGST,CGST,IGST,Total\n";
                              invoice.items.forEach(item => {
                                csvContent += `"${item.product}",${item.quantity},${item.rate},${item.subtotal},${item.sgst},${item.cgst},${item.igst},${item.total}\n`;
                              });
                              
                              const blob = new Blob([csvContent], { type: 'text/csv' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `${invoice.invoiceNumber}.csv`;
                              a.click();
                            }}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className="px-6 py-3 bg-indigo-500/20 text-indigo-300 rounded-xl font-medium hover:bg-indigo-500/30 transition-all duration-300 border border-indigo-400/30 hover:border-indigo-400/50 flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="flex flex-col items-center gap-6">
                    <div className="p-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-500/30">
                      <FileText className="h-16 w-16 text-blue-400" />
                    </div>
                    <p className="text-blue-300/80 text-lg font-medium">No invoices found</p>
                    <p className="text-blue-400/60 text-sm">Try adjusting your search terms or create a new invoice</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-blue-400/20 relative backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-300/60 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-blue-400/20">
            Invoice Automation System • Powered by OCR & Voice Recognition ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AutomationInvoice;