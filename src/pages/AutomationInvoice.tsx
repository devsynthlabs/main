import React, { useState, useRef, useEffect } from "react";
import { VoiceButton } from "@/components/ui/VoiceButton";
import { useNavigate, useLocation } from "react-router-dom";
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
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api";
import Tesseract from "tesseract.js";
import DocScanner from "@/components/DocScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Indian States for GST
const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const GST_SLABS = ["0", "5", "12", "18", "28", "40"];
const UNITS = ["Pcs", "Kg", "Ltr", "Mtr", "Box", "Dozen", "Pair", "Set", "Nos"];
const COMPANY_NAME = "SHREE ANDAL AI SOFTWARE SOLUTIONS";
const COMPANY_EMAIL = "support@saaiss.in";

const HSN_SAC_AUTOMATION: Record<string, { code: string; codeType: 'HSN' | 'SAC'; gstRate: number }> = {
  laptop: { code: "8471", codeType: "HSN", gstRate: 18 },
  computer: { code: "8471", codeType: "HSN", gstRate: 18 },
  keyboard: { code: "8471", codeType: "HSN", gstRate: 18 },
  mouse: { code: "8471", codeType: "HSN", gstRate: 18 },
  software: { code: "9983", codeType: "SAC", gstRate: 18 },
  consulting: { code: "9983", codeType: "SAC", gstRate: 18 },
  service: { code: "9983", codeType: "SAC", gstRate: 18 },
  hotel: { code: "9963", codeType: "SAC", gstRate: 5 },
  restaurant: { code: "9963", codeType: "SAC", gstRate: 5 },
};

// Invoice Item interface
interface InvoiceItem {
  id: string;
  inventoryItemId?: string; // Track which inventory item this came from
  itemName: string;
  itemCode: string;
  codeType: 'HSN' | 'SAC';
  hsnCode: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  priceWithTax: boolean;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  // GST Breakdown
  sgstRate: number;
  sgstAmount: number;
  cgstRate: number;
  cgstAmount: number;
  igstRate: number;
  igstAmount: number;
  isInterState: boolean;
  amount: number;
  stockReserved?: boolean; // Track if stock was reserved for this item
}

// Default Business State (can be made configurable)
const BUSINESS_STATE = "Tamil Nadu";

// Invoice Data interface
interface InvoiceData {
  type: 'sales' | 'purchase';
  saleType: 'credit' | 'cash' | 'gpay' | 'netbanking';
  partyName: string;
  phoneNo: string;
  sellerName: string;
  sellerPhone: string;
  sellerGSTIN: string;
  transactionType: 'B2B' | 'B2C';
  invoiceSize: 'A4' | 'QUARTER_A4' | 'A6';
  dueReminderDays: number;
  dueReminderDate?: string;
  eWayBillNo: string;
  invoiceNo: string;
  invoiceDate: string;
  stateOfSupply: string;
  businessState: string;
  items: InvoiceItem[];
  subtotal: number;
  totalSgst: number;
  totalCgst: number;
  totalIgst: number;
  totalTax: number;
  total: number;
  paid: number;
  balance: number;
  paymentMethod: string;
  uploadedBill: string | null;
  customerEmail?: string;
  customerGSTIN?: string;
  ocrJson?: unknown;
}

// Inventory Item interface (from Inventory Management)
interface InventoryStockItem {
  _id: string;
  itemName: string;
  sku: string;
  hsnCode?: string;
  quantity: number;
  unit?: string;
  price: number;
  category: string;
  gstRate?: number;
  stateOfSupply?: string;
}

const AutomationInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const billUploadRef = useRef<HTMLInputElement>(null);
  const inventoryDropdownRef = useRef<HTMLDivElement>(null);

  const initialTab = location.pathname === '/invoice/ocr' ? 'ocr' : 'create';
  const [activeTab, setActiveTabState] = useState<'create' | 'ocr' | 'history' | 'voice'>(initialTab);
  const [invoiceType, setInvoiceType] = useState<'sales' | 'purchase'>('sales');

  // Sync URL with active tab
  const setActiveTab = (tab: 'create' | 'ocr' | 'history' | 'voice') => {
    setActiveTabState(tab);
    if (tab === 'ocr') {
      navigate('/invoice/ocr', { replace: true });
    } else if (location.pathname === '/invoice/ocr') {
      navigate('/invoice', { replace: true });
    }
  };

  // Generate invoice number
  const generateInvoiceNo = (type: 'sales' | 'purchase') => {
    const prefix = type === 'sales' ? 'INV' : 'PUR';
    const year = new Date().getFullYear();
    const saved = localStorage.getItem('savedInvoices');
    let next = 1;
    if (saved) {
      try {
        const invoices = JSON.parse(saved) as InvoiceData[];
        const matchingNos = invoices
          .filter(inv => inv.type === type && inv.invoiceNo && inv.invoiceNo.startsWith(`${prefix}-${year}-`))
          .map(inv => {
            const parts = inv.invoiceNo.split('-');
            const numStr = parts[parts.length - 1];
            const num = parseInt(numStr, 10);
            return isNaN(num) ? 0 : num;
          });

        if (matchingNos.length > 0) {
          next = Math.max(...matchingNos) + 1;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return `${prefix}-${year}-${String(next).padStart(5, '0')}`;
  };

  const classifyTransaction = (sellerGSTIN = currentInvoice.sellerGSTIN, customerGSTIN = currentInvoice.customerGSTIN || ''): 'B2B' | 'B2C' => {
    return sellerGSTIN.trim().length >= 15 && customerGSTIN.trim().length >= 15 ? 'B2B' : 'B2C';
  };

  const getDueReminderDate = (invoiceDate: string, reminderDays: number) => {
    if (!reminderDays) return undefined;
    const reminderDate = new Date(invoiceDate);
    reminderDate.setDate(reminderDate.getDate() + Math.max(reminderDays - 1, 0));
    return reminderDate.toISOString().split('T')[0];
  };

  const getAutomatedCode = (itemName = '', itemCode = '') => {
    const haystack = `${itemName} ${itemCode}`.toLowerCase();
    return Object.entries(HSN_SAC_AUTOMATION).find(([keyword]) => haystack.includes(keyword))?.[1];
  };

  const updateNewItemWithAutomation = (field: 'itemName' | 'itemCode', value: string) => {
    setNewItem(prev => {
      const next = { ...prev, [field]: value };
      const automation = getAutomatedCode(next.itemName, next.itemCode);
      if (automation && !next.hsnCode) {
        next.hsnCode = automation.code;
        next.codeType = automation.codeType;
        next.taxPercent = automation.gstRate;
      }
      return next;
    });
  };

  const downloadJsonFile = (filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildGstPortalJson = (invoice: InvoiceData, rawOcrText = ocrText) => ({
    title: "Invoice Automation GST Export",
    generatedAt: new Date().toISOString(),
    transactionType: invoice.transactionType,
    forms: {
      gstr1: invoice.type === 'sales' ? [{
        invoiceNumber: invoice.invoiceNo,
        invoiceDate: invoice.invoiceDate,
        customerName: invoice.partyName,
        customerGSTIN: invoice.customerGSTIN || null,
        taxableValue: invoice.subtotal,
        taxAmount: invoice.totalTax,
        totalValue: invoice.total,
        items: invoice.items.map(item => ({
          productName: item.itemName,
          codeType: item.codeType,
          hsnSacCode: item.hsnCode,
          quantity: item.quantity,
          taxableValue: item.amount - item.taxAmount,
          taxRate: item.taxPercent,
          taxAmount: item.taxAmount,
          totalValue: item.amount
        }))
      }] : [],
      gstr2b: invoice.type === 'purchase' ? [{
        billNumber: invoice.invoiceNo,
        billDate: invoice.invoiceDate,
        supplierName: invoice.sellerName || invoice.partyName,
        supplierGSTIN: invoice.sellerGSTIN || null,
        totalValue: invoice.total,
        taxAmount: invoice.totalTax
      }] : [],
      gstr3b: {
        outwardTaxableSupply: invoice.type === 'sales' ? invoice.subtotal : 0,
        inwardTaxableSupply: invoice.type === 'purchase' ? invoice.subtotal : 0,
        outputTax: invoice.type === 'sales' ? invoice.totalTax : 0,
        inputTaxCredit: invoice.type === 'purchase' ? invoice.totalTax : 0,
        netTax: invoice.type === 'sales' ? invoice.totalTax : -invoice.totalTax
      }
    },
    ocr: {
      rawText: rawOcrText || "",
      uploadedImagePresent: Boolean(uploadedImage)
    }
  });

  // Invoice state
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>({
    type: 'sales',
    saleType: 'cash',
    partyName: '',
    phoneNo: '',
    sellerName: '',
    sellerPhone: '',
    sellerGSTIN: '',
    transactionType: 'B2C',
    invoiceSize: 'A4',
    dueReminderDays: 7,
    eWayBillNo: '',
    invoiceNo: generateInvoiceNo('sales'),
    invoiceDate: new Date().toISOString().split('T')[0],
    stateOfSupply: '',
    businessState: BUSINESS_STATE,
    items: [],
    subtotal: 0,
    totalSgst: 0,
    totalCgst: 0,
    totalIgst: 0,
    totalTax: 0,
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
    inventoryItemId: undefined,
    itemName: '',
    itemCode: '',
    codeType: 'HSN',
    hsnCode: '',
    quantity: 1,
    unit: 'Pcs',
    pricePerUnit: 0,
    priceWithTax: false,
    discountPercent: 0,
    taxPercent: 18
  });

  // Track max available quantity for selected inventory item
  const [selectedInventoryMaxQty, setSelectedInventoryMaxQty] = useState<number | null>(null);

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
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  // Search state for history
  const [searchTerm, setSearchTerm] = useState("");

  // Inventory stock items state
  const [inventoryItems, setInventoryItems] = useState<InventoryStockItem[]>([]);
  const [inventorySearchTerm, setInventorySearchTerm] = useState("");
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Fetch inventory items on mount
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoadingInventory(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/inventory/all`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter only items with quantity > 0 (in stock)
          const inStockItems = data.filter((item: InventoryStockItem) => item.quantity > 0);
          setInventoryItems(inStockItems);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoadingInventory(false);
      }
    };
    fetchInventory();
  }, []);

  // Load saved invoices from localStorage and backend on mount
  useEffect(() => {
    const loadInvoices = async () => {
      let mergedInvoices: InvoiceData[] = [];

      // Load from localStorage
      const saved = localStorage.getItem('savedInvoices');
      if (saved) {
        try {
          mergedInvoices = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }

      // Load from backend
      try {
        const response = await fetch(`${API_BASE_URL}/invoice/all?limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.invoices && Array.isArray(data.invoices)) {
            const backendInvoices = data.invoices.map((inv: any) => ({
              ...inv,
              id: inv._id,
              type: inv.sourceInvoiceType || 'sales',
              saleType: inv.paymentMethod || 'cash',
              partyName: inv.customerName,
              phoneNo: inv.customerPhone,
              items: inv.items ? inv.items.map((item: any) => ({
                itemName: item.productName,
                quantity: item.quantity,
                pricePerUnit: item.unitPrice,
                amount: item.total,
                taxPercent: item.taxRate,
                discountAmount: item.discount,
                codeType: item.codeType || 'HSN',
                hsnCode: item.hsnCode || item.sacCode || ''
              })) : [],
              subtotal: inv.subtotal,
              totalTax: inv.taxAmount,
              totalSgst: inv.sgst || 0,
              totalCgst: inv.cgst || 0,
              totalIgst: inv.igst || 0,
              total: inv.grandTotal,
              paid: inv.amountPaid || 0,
              balance: inv.balanceDue || 0
            }));

            // Merge and de-duplicate by invoiceNo
            const existingNos = new Set(mergedInvoices.map(inv => inv.invoiceNo));
            backendInvoices.forEach((inv: InvoiceData) => {
              if (!existingNos.has(inv.invoiceNo)) {
                mergedInvoices.push(inv);
              }
            });
          }
        }
      } catch (err) {
        console.warn("Failed to fetch backend invoices:", err);
      }

      setInvoiceHistory(mergedInvoices);

      // Recalculate invoice number dynamically based on maximum sequence number
      const prefix = invoiceType === 'sales' ? 'INV' : 'PUR';
      const year = new Date().getFullYear();
      const matchingNos = mergedInvoices
        .filter(inv => inv.type === invoiceType && inv.invoiceNo && inv.invoiceNo.startsWith(`${prefix}-${year}-`))
        .map(inv => {
          const parts = inv.invoiceNo.split('-');
          const numStr = parts[parts.length - 1];
          const num = parseInt(numStr, 10);
          return isNaN(num) ? 0 : num;
        });

      let next = 1;
      if (matchingNos.length > 0) {
        next = Math.max(...matchingNos) + 1;
      }

      const newNo = `${prefix}-${year}-${String(next).padStart(5, '0')}`;
      setCurrentInvoice(prev => ({
        ...prev,
        invoiceNo: newNo
      }));
    };

    loadInvoices();
  }, [invoiceType]);

  // Close inventory dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inventoryDropdownRef.current && !inventoryDropdownRef.current.contains(event.target as Node)) {
        setIsInventoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Switch between Sales and Purchase
  const handleInvoiceTypeChange = (type: 'sales' | 'purchase') => {
    setLastSavedId(null);
    setInvoiceType(type);
    setCurrentInvoice(prev => ({
      ...prev,
      type: type,
      invoiceNo: generateInvoiceNo(type),
      items: [],
      subtotal: 0,
      totalSgst: 0,
      totalCgst: 0,
      totalIgst: 0,
      totalTax: 0,
      total: 0,
      paid: 0,
      balance: 0
    }));
  };

  // Check if inter-state transaction
  const isInterStateTransaction = (): boolean => {
    const customerState = currentInvoice.stateOfSupply;
    const businessState = currentInvoice.businessState || BUSINESS_STATE;
    return customerState !== '' && businessState !== '' && customerState !== businessState;
  };

  // Calculate item amounts with GST breakdown
  const calculateItemAmounts = (item: Partial<InvoiceItem>, forceInterState?: boolean): Partial<InvoiceItem> => {
    const qty = item.quantity || 0;
    const price = item.pricePerUnit || 0;
    const discountPct = item.discountPercent || 0;
    const priceWithTax = item.priceWithTax || false;
    const taxPct = priceWithTax ? (item.taxPercent || 0) : 0;

    let baseAmount = qty * price;
    let discountAmount = (baseAmount * discountPct) / 100;
    let afterDiscount = baseAmount - discountAmount;

    // Determine if inter-state
    const isInterState = forceInterState !== undefined ? forceInterState : isInterStateTransaction();

    let sgstRate = 0, cgstRate = 0, igstRate = 0;
    let sgstAmount = 0, cgstAmount = 0, igstAmount = 0;
    let taxAmount = 0;
    let finalAmount = afterDiscount;

    if (priceWithTax && taxPct > 0) {
      if (isInterState) {
        igstRate = taxPct;
        igstAmount = (afterDiscount * igstRate) / 100;
        taxAmount = igstAmount;
      } else {
        sgstRate = taxPct / 2;
        cgstRate = taxPct / 2;
        sgstAmount = (afterDiscount * sgstRate) / 100;
        cgstAmount = (afterDiscount * cgstRate) / 100;
        taxAmount = sgstAmount + cgstAmount;
      }
      finalAmount = afterDiscount + taxAmount;
    }

    return {
      ...item,
      taxPercent: taxPct,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      sgstRate: Math.round(sgstRate * 100) / 100,
      sgstAmount: Math.round(sgstAmount * 100) / 100,
      cgstRate: Math.round(cgstRate * 100) / 100,
      cgstAmount: Math.round(cgstAmount * 100) / 100,
      igstRate: Math.round(igstRate * 100) / 100,
      igstAmount: Math.round(igstAmount * 100) / 100,
      isInterState,
      amount: Math.round(finalAmount * 100) / 100
    };
  };

  // Calculate invoice totals from items
  const calculateInvoiceTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.pricePerUnit) - i.discountAmount, 0);
    const totalSgst = items.reduce((sum, i) => sum + i.sgstAmount, 0);
    const totalCgst = items.reduce((sum, i) => sum + i.cgstAmount, 0);
    const totalIgst = items.reduce((sum, i) => sum + i.igstAmount, 0);
    const totalTax = totalSgst + totalCgst + totalIgst;
    const total = items.reduce((sum, i) => sum + i.amount, 0);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      totalSgst: Math.round(totalSgst * 100) / 100,
      totalCgst: Math.round(totalCgst * 100) / 100,
      totalIgst: Math.round(totalIgst * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  };

  // Refresh inventory items
  const refreshInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/inventory/all`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const inStockItems = data.filter((item: InventoryStockItem) => item.quantity > 0);
        setInventoryItems(inStockItems);
      }
    } catch (error) {
      console.error("Error refreshing inventory:", error);
    }
  };

  const deleteInventoryItem = async (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item from inventory?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success("Item deleted from inventory");
        refreshInventory();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item from inventory");
    }
  };

  // Add item to invoice
  const addItemToInvoice = async () => {
    if (!newItem.itemName || !newItem.pricePerUnit) {
      toast.error("Please enter item name and price");
      return;
    }

    // Check if state is selected for GST calculation
    if (!currentInvoice.stateOfSupply) {
      toast.error("Please select State of Supply for GST calculation");
      return;
    }

    const quantity = newItem.quantity || 1;

    // If item is from inventory, check stock and reserve it
    if (newItem.inventoryItemId) {
      if (selectedInventoryMaxQty !== null && quantity > selectedInventoryMaxQty) {
        toast.error(`Insufficient stock! Only ${selectedInventoryMaxQty} available.`);
        return;
      }

      // Reserve stock in inventory
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/inventory/reserve/${newItem.inventoryItemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity })
        });

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.message || "Failed to reserve stock");
          return;
        }

        // Refresh inventory to show updated stock
        refreshInventory();
      } catch (error) {
        console.error("Error reserving stock:", error);
        toast.error("Error reserving stock from inventory");
        return;
      }
    }

    const calculatedItem = calculateItemAmounts(newItem);
    const item: InvoiceItem = {
      id: `item-${Date.now()}`,
      inventoryItemId: newItem.inventoryItemId,
      itemName: newItem.itemName || '',
      itemCode: newItem.itemCode || '',
      codeType: newItem.codeType || 'HSN',
      hsnCode: newItem.hsnCode || '',
      quantity: quantity,
      unit: newItem.unit || 'Pcs',
      pricePerUnit: newItem.pricePerUnit || 0,
      priceWithTax: newItem.priceWithTax || false,
      discountPercent: newItem.discountPercent || 0,
      discountAmount: calculatedItem.discountAmount || 0,
      taxPercent: newItem.taxPercent || 0,
      taxAmount: calculatedItem.taxAmount || 0,
      sgstRate: calculatedItem.sgstRate || 0,
      sgstAmount: calculatedItem.sgstAmount || 0,
      cgstRate: calculatedItem.cgstRate || 0,
      cgstAmount: calculatedItem.cgstAmount || 0,
      igstRate: calculatedItem.igstRate || 0,
      igstAmount: calculatedItem.igstAmount || 0,
      isInterState: calculatedItem.isInterState || false,
      amount: calculatedItem.amount || 0,
      stockReserved: !!newItem.inventoryItemId
    };

    const updatedItems = [...currentInvoice.items, item];
    const totals = calculateInvoiceTotals(updatedItems);

    setLastSavedId(null);
    setCurrentInvoice(prev => ({
      ...prev,
      items: updatedItems,
      ...totals,
      balance: totals.total - prev.paid
    }));

    // Reset new item form
    setNewItem({
      inventoryItemId: undefined,
      itemName: '',
      itemCode: '',
      codeType: 'HSN',
      hsnCode: '',
      quantity: 1,
      unit: 'Pcs',
      pricePerUnit: 0,
      priceWithTax: false,
      discountPercent: 0,
      taxPercent: 18
    });
    setSelectedInventoryMaxQty(null);

    toast.success(newItem.inventoryItemId ? "Item added & stock reserved" : "Item added to invoice");
  };

  const resetItemForm = () => {
    setNewItem({
      inventoryItemId: undefined,
      itemName: '',
      itemCode: '',
      codeType: 'HSN',
      hsnCode: '',
      quantity: 1,
      unit: 'Pcs',
      pricePerUnit: 0,
      priceWithTax: false,
      discountPercent: 0,
      taxPercent: 18
    });
    setSelectedInventoryMaxQty(null);
    toast.info("Item form cleared");
  };

  // Select inventory item and auto-populate form
  const selectInventoryItem = (inventoryItem: InventoryStockItem) => {
    setNewItem({
      inventoryItemId: inventoryItem._id,
      itemName: inventoryItem.itemName,
      itemCode: inventoryItem.sku,
      codeType: 'HSN',
      hsnCode: inventoryItem.hsnCode || '',
      quantity: 1,
      unit: inventoryItem.unit || 'Pcs',
      pricePerUnit: inventoryItem.price,
      priceWithTax: false,
      discountPercent: 0,
      taxPercent: inventoryItem.gstRate || 18
    });
    setSelectedInventoryMaxQty(inventoryItem.quantity);
    setInventorySearchTerm("");
    setIsInventoryDropdownOpen(false);
    toast.success(`Selected: ${inventoryItem.itemName} (${inventoryItem.quantity} in stock)`);
  };

  // Filter inventory items based on search
  const filteredInventoryItems = inventoryItems.filter(item =>
    item.itemName.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(inventorySearchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(inventorySearchTerm.toLowerCase())
  );

  // Remove item from invoice
  const removeItem = async (itemId: string) => {
    // Find the item being removed
    const itemToRemove = currentInvoice.items.find(i => i.id === itemId);

    // If item was from inventory and stock was reserved, restore it
    if (itemToRemove?.inventoryItemId && itemToRemove?.stockReserved) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/inventory/restore/${itemToRemove.inventoryItemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: itemToRemove.quantity })
        });

        if (res.ok) {
          toast.success(`Stock restored: ${itemToRemove.quantity} ${itemToRemove.itemName}`);
          refreshInventory();
        } else {
          console.error("Failed to restore stock");
        }
      } catch (error) {
        console.error("Error restoring stock:", error);
      }
    }

    setLastSavedId(null);
    const updatedItems = currentInvoice.items.filter(i => i.id !== itemId);
    const totals = calculateInvoiceTotals(updatedItems);

    setCurrentInvoice(prev => ({
      ...prev,
      items: updatedItems,
      ...totals,
      balance: totals.total - prev.paid
    }));
  };

  // Update paid amount
  const updatePaidAmount = (paid: number) => {
    setLastSavedId(null);
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
      const dueReminderDate = getDueReminderDate(currentInvoice.invoiceDate, currentInvoice.dueReminderDays);
      // 1. Save to Backend to get a real ID for sharing
      const backendData = {
        invoiceNumber: currentInvoice.invoiceNo,
        invoiceDate: currentInvoice.invoiceDate,
        dueDate: new Date(new Date(currentInvoice.invoiceDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerName: currentInvoice.partyName,
        customerEmail: currentInvoice.customerEmail || `${currentInvoice.partyName.toLowerCase().replace(/\s/g, '')}@example.com`,
        customerPhone: currentInvoice.phoneNo,
        customerGSTIN: currentInvoice.customerGSTIN,
        businessName: currentInvoice.sellerName || COMPANY_NAME,
        businessEmail: COMPANY_EMAIL,
        businessPhone: currentInvoice.sellerPhone,
        businessGSTIN: currentInvoice.sellerGSTIN,
        transactionType: currentInvoice.transactionType,
        invoiceSize: currentInvoice.invoiceSize,
        dueReminderDays: currentInvoice.dueReminderDays,
        dueReminderDate,
        sourceInvoiceType: currentInvoice.type,
        eWayBillNo: currentInvoice.eWayBillNo,
        stateOfSupply: currentInvoice.stateOfSupply,
        items: currentInvoice.items.map(item => ({
          productName: item.itemName,
          description: `${item.codeType}: ${item.hsnCode || 'N/A'} | Unit: ${item.unit}`,
          codeType: item.codeType,
          hsnCode: item.codeType === 'HSN' ? item.hsnCode : '',
          sacCode: item.codeType === 'SAC' ? item.hsnCode : '',
          unit: item.unit,
          priceWithTax: item.priceWithTax,
          quantity: item.quantity,
          unitPrice: item.pricePerUnit,
          taxRate: item.taxPercent,
          discount: item.discountAmount,
          total: item.amount
        })),
        subtotal: currentInvoice.total - currentInvoice.items.reduce((sum, item) => sum + item.taxAmount, 0),
        taxAmount: currentInvoice.items.reduce((sum, item) => sum + item.taxAmount, 0),
        // GST Breakdown
        sgst: currentInvoice.items.reduce((sum, item) => sum + item.sgstAmount, 0),
        cgst: currentInvoice.items.reduce((sum, item) => sum + item.cgstAmount, 0),
        igst: currentInvoice.items.reduce((sum, item) => sum + item.igstAmount, 0),
        grandTotal: currentInvoice.total,
        amountPaid: currentInvoice.paid,
        balanceDue: currentInvoice.balance,
        paymentMethod: currentInvoice.saleType || 'cash',
        gstPortalJson: buildGstPortalJson({ ...currentInvoice, dueReminderDate }),
        status: currentInvoice.balance <= 0 ? 'paid' : 'sent'
      };

      let backendId = '';
      try {
        const response = await fetch(`${API_ENDPOINTS.INVOICE}/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendData)
        });
        const result = await response.json();
        if (response.ok) {
          backendId = result.invoiceId || result.invoice?._id;
          setLastSavedId(backendId);
        } else {
          toast.error(result.message || "Failed to save invoice to server. Try changing the invoice number.");
          setIsSaving(false);
          return;
        }
      } catch (err) {
        console.warn("Backend save failed:", err);
        toast.error("Failed to connect to the server. Please check your network.");
        setIsSaving(false);
        return;
      }

      // 2. Save to localStorage
      const savedList = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      const invoiceToSave = {
        ...currentInvoice,
        dueReminderDate,
        ocrJson: buildGstPortalJson({ ...currentInvoice, dueReminderDate }),
        savedAt: new Date().toISOString(),
        id: backendId
      };
      savedList.unshift(invoiceToSave);
      localStorage.setItem('savedInvoices', JSON.stringify(savedList));
      setInvoiceHistory(savedList);

      toast.success(`${currentInvoice.type === 'sales' ? 'Invoice' : 'Purchase Bill'} saved! You can now share on WhatsApp.`);

      // Don't reset form - keep data visible until WhatsApp share or Save & New
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(`Error saving invoice: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save and create new
  const saveAndNew = async () => {
    if (currentInvoice.items.length === 0) {
      toast.error("Please add items before saving");
      return;
    }
    await saveInvoice();
    // Reset form after saving for new invoice
    setTimeout(() => {
      resetForm();
      toast.info("Ready for new invoice");
    }, 500);
  };

  // Reset form
  const resetForm = () => {
    setLastSavedId(null);
    setCurrentInvoice({
      type: invoiceType,
      saleType: 'cash',
      partyName: '',
      phoneNo: '',
      sellerName: '',
      sellerPhone: '',
      sellerGSTIN: '',
      transactionType: 'B2C',
      invoiceSize: 'A4',
      dueReminderDays: 7,
      eWayBillNo: '',
      invoiceNo: generateInvoiceNo(invoiceType),
      invoiceDate: new Date().toISOString().split('T')[0],
      stateOfSupply: '',
      businessState: BUSINESS_STATE,
      items: [],
      subtotal: 0,
      totalSgst: 0,
      totalCgst: 0,
      totalIgst: 0,
      totalTax: 0,
      total: 0,
      paid: 0,
      balance: 0,
      paymentMethod: 'cash',
      uploadedBill: null,
      customerEmail: '',
      customerGSTIN: ''
    });
    // Reset new item form
    setNewItem({
      inventoryItemId: undefined,
      itemName: '',
      itemCode: '',
      codeType: 'HSN',
      hsnCode: '',
      quantity: 1,
      unit: 'Pcs',
      pricePerUnit: 0,
      priceWithTax: false,
      discountPercent: 0,
      taxPercent: 18
    });
    setSelectedInventoryMaxQty(null);
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

  // Generate Invoice PDF using jsPDF and jspdf-autotable
  const generateInvoicePDF = (data: InvoiceData) => {
    try {
      const doc = new jsPDF();
      const sellerName = data.sellerName || COMPANY_NAME;
      const customerName = data.partyName || 'Valued Customer';

      // Header Banner
      doc.setFillColor(79, 70, 229); // Indigo banner
      doc.rect(0, 0, 210, 38, 'F');

      // Invoice Title & Company Info
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(sellerName, 15, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const sellerInfo = [
        data.sellerPhone ? `Phone: ${data.sellerPhone}` : '',
        data.sellerGSTIN ? `GSTIN: ${data.sellerGSTIN}` : ''
      ].filter(Boolean).join(' | ');
      doc.text(sellerInfo, 15, 26);

      // TAX INVOICE label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("TAX INVOICE", 150, 18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Invoice No: #${data.invoiceNo}`, 150, 26);
      doc.text(`Date: ${data.invoiceDate}`, 150, 32);

      // Billing details block
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("BILL TO:", 15, 52);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Customer Name: ${customerName}`, 15, 58);
      if (data.phoneNo) doc.text(`Phone: ${data.phoneNo}`, 15, 64);
      if (data.customerGSTIN) doc.text(`GSTIN: ${data.customerGSTIN}`, 15, 70);
      if (data.stateOfSupply) doc.text(`State of Supply: ${data.stateOfSupply}`, 15, 76);

      // Payment mode on the right
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT SUMMARY:", 120, 52);
      doc.setFont("helvetica", "normal");
      doc.text(`Payment Mode: ${data.saleType?.toUpperCase() || 'CASH'}`, 120, 58);
      doc.text(`Transaction Type: ${data.transactionType || 'B2C'}`, 120, 64);
      if (data.eWayBillNo) doc.text(`E-Way Bill: ${data.eWayBillNo}`, 120, 70);

      // Draw horizontal line
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.line(15, 82, 195, 82);

      // Items Table using autoTable
      const tableBody = data.items.map((item, index) => [
        index + 1,
        item.itemName,
        item.hsnCode || item.itemCode || '-',
        item.quantity,
        item.unit,
        `INR ${item.pricePerUnit.toFixed(2)}`,
        item.discountAmount > 0 ? `INR ${item.discountAmount.toFixed(2)}` : '0.00',
        item.taxAmount > 0 ? `${item.taxPercent}%` : '0%',
        `INR ${item.amount.toFixed(2)}`
      ]);

      (doc as any).autoTable({
        startY: 88,
        head: [['#', 'Item Description', 'HSN/SKU', 'Qty', 'Unit', 'Price/Unit', 'Discount', 'Tax Rate', 'Amount']],
        body: tableBody,
        theme: 'striped',
        headStyles: {
          fillColor: [79, 70, 229], // Indigo
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          textColor: [15, 23, 42],
          fontSize: 9
        },
        columnStyles: {
          1: { cellWidth: 40 },
          5: { halign: 'right' },
          6: { halign: 'right' },
          7: { halign: 'center' },
          8: { halign: 'right' }
        }
      });

      // Totals block below the table
      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Subtotal:`, 130, finalY);
      doc.text(`INR ${data.subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });

      let currentY = finalY + 6;
      if (data.totalSgst > 0) {
        doc.text(`SGST:`, 130, currentY);
        doc.text(`INR ${data.totalSgst.toFixed(2)}`, 190, currentY, { align: 'right' });
        currentY += 6;
      }
      if (data.totalCgst > 0) {
        doc.text(`CGST:`, 130, currentY);
        doc.text(`INR ${data.totalCgst.toFixed(2)}`, 190, currentY, { align: 'right' });
        currentY += 6;
      }
      if (data.totalIgst > 0) {
        doc.text(`IGST:`, 130, currentY);
        doc.text(`INR ${data.totalIgst.toFixed(2)}`, 190, currentY, { align: 'right' });
        currentY += 6;
      }

      doc.text(`Total Tax:`, 130, currentY);
      doc.text(`INR ${data.totalTax.toFixed(2)}`, 190, currentY, { align: 'right' });
      currentY += 8;

      // Grand Total in box
      doc.setFillColor(243, 244, 246); // Gray 100
      doc.rect(125, currentY - 5, 70, 10, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`Grand Total:`, 130, currentY + 1);
      doc.text(`INR ${data.total.toFixed(2)}`, 190, currentY + 1, { align: 'right' });

      currentY += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Amount Paid:`, 130, currentY);
      doc.text(`INR ${data.paid.toFixed(2)}`, 190, currentY, { align: 'right' });

      currentY += 6;
      doc.text(`Balance Due:`, 130, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(`INR ${data.balance.toFixed(2)}`, 190, currentY, { align: 'right' });

      // Footer message
      const footerY = 280;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("This is a digitally generated invoice. No signature required.", 15, footerY);
      doc.text("Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS", 120, footerY);

      // Save PDF
      doc.save(`invoice_${data.invoiceNo}.pdf`);
      toast.success("PDF generated & downloaded successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    }
  };

  // Export invoice
  const exportInvoice = (format: 'csv' | 'pdf') => {
    if (currentInvoice.items.length === 0) {
      toast.error("No items to export. Please add items first.");
      return;
    }

    if (format === 'csv') {
      const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
      const items = currentInvoice.items;
      const anyTax = items.some(i => i.taxAmount > 0);
      const anyDiscount = items.some(i => i.discountAmount > 0);
      const anyCode = items.some(i => i.itemCode);
      const anyHSN = items.some(i => i.hsnCode);

      // Invoice Header — only non-empty fields
      let csvContent = "INVOICE DETAILS\n";
      if (currentInvoice.invoiceNo) csvContent += `Invoice No,${currentInvoice.invoiceNo}\n`;
      if (currentInvoice.invoiceDate) csvContent += `Invoice Date,${currentInvoice.invoiceDate}\n`;
      if (currentInvoice.partyName) csvContent += `Customer Name,${esc(currentInvoice.partyName)}\n`;
      if (currentInvoice.phoneNo) csvContent += `Phone,${currentInvoice.phoneNo}\n`;
      if (currentInvoice.stateOfSupply) csvContent += `State of Supply,${currentInvoice.stateOfSupply}\n`;
      if (currentInvoice.businessState) csvContent += `Business State,${currentInvoice.businessState}\n`;
      if (currentInvoice.saleType) csvContent += `Payment Mode,${currentInvoice.saleType}\n`;
      csvContent += "\n";

      // Items — dynamic columns based on actual data
      csvContent += "ITEMS\n";
      const cols: string[] = ['Item Name'];
      if (anyCode) cols.push('Item Code');
      if (anyHSN) cols.push('HSN Code');
      cols.push('Quantity', 'Unit', 'Price');
      if (anyDiscount) cols.push('Discount');
      if (anyTax) cols.push('Tax %', 'Tax Amt');
      cols.push('Line Total');
      csvContent += cols.join(',') + '\n';

      items.forEach(item => {
        const row: string[] = [esc(item.itemName)];
        if (anyCode) row.push(esc(item.itemCode || ''));
        if (anyHSN) row.push(esc(item.hsnCode || ''));
        row.push(String(item.quantity), esc(item.unit), String(item.pricePerUnit));
        if (anyDiscount) row.push(String(item.discountAmount));
        if (anyTax) {
          const taxPct = item.isInterState ? `IGST ${item.igstRate}%` : `${item.sgstRate + item.cgstRate}%`;
          row.push(item.taxAmount > 0 ? taxPct : '0%');
          row.push(String(item.taxAmount));
        }
        row.push(String(item.amount));
        csvContent += row.join(',') + '\n';
      });

      // Summary — only non-zero values
      csvContent += "\nSUMMARY\n";
      // Recalculate from items to ensure correctness
      const grandTotal = items.reduce((sum, i) => sum + i.amount, 0);
      const totalTax = items.reduce((sum, i) => sum + i.taxAmount, 0);
      const subtotal = grandTotal - totalTax;

      if (subtotal > 0) csvContent += `Subtotal,${Math.round(subtotal * 100) / 100}\n`;
      if (anyDiscount) {
        const discTotal = items.reduce((sum, i) => sum + i.discountAmount, 0);
        if (discTotal > 0) csvContent += `Total Discount,${Math.round(discTotal * 100) / 100}\n`;
      }
      if (totalTax > 0) csvContent += `Total Tax,${Math.round(totalTax * 100) / 100}\n`;
      csvContent += `Grand Total,${Math.round(grandTotal * 100) / 100}\n`;
      if (currentInvoice.paid > 0) csvContent += `Amount Paid,${currentInvoice.paid}\n`;
      const balance = grandTotal - currentInvoice.paid;
      if (balance > 0) csvContent += `Balance Due,${Math.round(balance * 100) / 100}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${currentInvoice.invoiceNo}_${currentInvoice.invoiceDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice exported to CSV!");
    } else {
      generateInvoicePDF(currentInvoice);
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
    if (currentInvoice.items.length === 0 && invoiceHistory.length === 0) {
      toast.error("Generate an invoice before sharing");
      return;
    }

    // Enforce save before sharing if there's unsaved data
    if (!lastSavedId && currentInvoice.items.length > 0) {
      toast.error("Please save the invoice first to generate a secure sharing link.");
      return;
    }

    // If form is empty but we have history, use the last one
    const data = lastSavedId ? currentInvoice : (invoiceHistory[0] || currentInvoice);
    const customerName = data.partyName || 'Valued Customer';

    // Build professional message based on user template
    let message = `*INVOICE: ${data.invoiceNo}*\n`;
    message += `__________________________\n\n`;
    message += `Dear *${customerName}*,\n\n`;
    message += `A new invoice has been generated for your recent transaction with *Saaiss Software Solution*.\n\n`;
    message += `*Bill Summary:*\n`;
    message += `• Invoice ID: #${data.invoiceNo}\n`;
    message += `• Date: ${data.invoiceDate}\n`;
    message += `• Total Amount: ₹${data.total.toFixed(2)}\n\n`;
    message += `You can view, download, or pay your invoice online using the secure link below:\n`;

    const idToUse = lastSavedId || (data as any).id;
    if (!idToUse) {
      toast.error("Please save the invoice first.");
      return;
    }
    const shareLink = `https://software.saaiss.in/invoice/view/${idToUse}`;

    message += `🔗 ${shareLink}\n\n`;
    message += `If you have any questions regarding this invoice, please feel free to reach out to us.\n\n`;
    message += `Best regards,\n`;
    message += `*Saaiss Software Solution*\n`;
    message += `__________________________\n`;
    message += `_Powered by Sri Andal Financial Automation_`;

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
          const automation = getAutomatedCode(item.product, '');
          const taxPct = automation?.gstRate || 18;
          const calculated = calculateItemAmounts({
            ...newItem,
            itemName: item.product,
            codeType: automation?.codeType || 'HSN',
            hsnCode: automation?.code || '',
            quantity: item.quantity,
            unit: 'Pcs',
            pricePerUnit: item.rate,
            priceWithTax: false,
            taxPercent: taxPct
          });

          newItems.push({
            id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            itemName: item.product,
            itemCode: '',
            codeType: automation?.codeType || 'HSN',
            hsnCode: automation?.code || '',
            quantity: item.quantity,
            unit: 'Pcs',
            pricePerUnit: item.rate,
            priceWithTax: false,
            discountPercent: 0,
            discountAmount: 0,
            taxPercent: taxPct,
            ...calculated
          } as InvoiceItem);
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
  const filteredHistory = invoiceHistory.filter(invoice => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return [
      invoice.invoiceNo,
      invoice.partyName,
      invoice.phoneNo,
      invoice.customerGSTIN,
      invoice.sellerName,
      invoice.sellerGSTIN,
      invoice.transactionType,
      invoice.invoiceDate,
      invoice.saleType
    ].some(value => String(value || '').toLowerCase().includes(query));
  });

  const deleteHistoryInvoice = (invoiceId?: string, invoiceNo?: string) => {
    const savedList = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
    const updatedList = savedList.filter((invoice: InvoiceData & { id?: string }) => {
      if (invoiceId) return invoice.id !== invoiceId;
      return invoice.invoiceNo !== invoiceNo;
    });
    localStorage.setItem('savedInvoices', JSON.stringify(updatedList));
    setInvoiceHistory(updatedList);
    toast.success("Invoice deleted from history");
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="liquid-page min-h-screen overflow-hidden text-slate-950">
      <div className="liquid-backdrop fixed inset-0 pointer-events-none" />

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          /* Reset containers for print */
          body, html, .liquid-page, main {
            background: white !important;
            color: #0f172a !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #invoice-official-copy {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }
          @page {
            size: ${currentInvoice.invoiceSize === 'A6' ? '105mm 148mm' : 'A4'};
            margin: 8mm;
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/24 backdrop-blur-2xl no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <Receipt className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Invoice Automation
              </h1>
              <p className="mt-1 text-slate-600">Professional Invoice with OCR & Voice Input</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tabs Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 no-print">
          {[
            { id: 'create', label: 'Create Invoice', icon: Plus, desc: 'Generate new' },
            { id: 'ocr', label: 'Invoice OCR', icon: Camera, desc: 'Scan & Auto-Extract' },
            { id: 'voice', label: 'Voice', icon: Mic, desc: 'Dictate invoice' },
            { id: 'history', label: 'History', icon: Eye, desc: 'Past invoices' }
          ].map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center justify-between p-4 md:p-6 rounded-[24px] border transition-all duration-300 ${activeTab === id
                ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                : 'bg-white/42 border-white/55 text-slate-700 hover:bg-white/70 hover:text-slate-950'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 md:p-3 rounded-[16px] ${activeTab === id ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${activeTab === id ? 'text-white' : 'text-slate-900'}`} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm md:text-xl font-bold">{label}</h3>
                  {desc && <p className={`text-xs ${activeTab === id ? 'text-white/70' : 'text-slate-500'} hidden md:block`}>{desc}</p>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Create Invoice Tab */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6 no-print">
              {/* Payment and Document Options */}
              <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-5">
                <Label className="text-slate-900 mb-3 block font-bold">Payment Mode</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: 'cash', label: 'Cash', icon: Banknote, activeClass: 'bg-emerald-600 text-white' },
                    { type: 'credit', label: 'Credit', icon: CreditCard, activeClass: 'bg-blue-600 text-white' },
                    { type: 'gpay', label: 'GPay', icon: Smartphone, activeClass: 'bg-violet-600 text-white' },
                    { type: 'netbanking', label: 'Netbanking', icon: Building2, activeClass: 'bg-indigo-600 text-white' }
                  ].map((mode) => (
                    <button
                      key={mode.type}
                      onClick={() => {
                        setLastSavedId(null);
                        setCurrentInvoice(prev => ({ ...prev, saleType: mode.type as any }));
                      }}
                      className={`py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${currentInvoice.saleType === mode.type
                        ? mode.activeClass
                        : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      <mode.icon className="h-4 w-4" />
                      {mode.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">Print Size</Label>
                    <Select value={currentInvoice.invoiceSize} onValueChange={(val: 'A4' | 'QUARTER_A4' | 'A6') => setCurrentInvoice(prev => ({ ...prev, invoiceSize: val }))}>
                      <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 text-slate-900">
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A6">A6 Receipt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">Due Reminder</Label>
                    <Select value={String(currentInvoice.dueReminderDays)} onValueChange={(val) => setCurrentInvoice(prev => ({ ...prev, dueReminderDays: Number(val) }))}>
                      <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 text-slate-900">
                        <SelectItem value="0">No reminder</SelectItem>
                        <SelectItem value="7">1 week</SelectItem>
                        <SelectItem value="14">2 weeks</SelectItem>
                        <SelectItem value="30">1 month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">Transaction Type</Label>
                    <Select value={currentInvoice.transactionType} onValueChange={(val: 'B2B' | 'B2C') => setCurrentInvoice(prev => ({ ...prev, transactionType: val }))}>
                      <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 text-slate-900">
                        <SelectItem value="B2B">B2B</SelectItem>
                        <SelectItem value="B2C">B2C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {invoiceType === 'sales' && (
                <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-5">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-slate-800" />
                    Seller Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Seller Name *</Label>
                      <Input
                        value={currentInvoice.sellerName}
                        onChange={(e) => setCurrentInvoice(prev => ({ ...prev, sellerName: e.target.value }))}
                        placeholder="Enter seller name"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Phone Number</Label>
                      <Input
                        value={currentInvoice.sellerPhone}
                        onChange={(e) => setCurrentInvoice(prev => ({ ...prev, sellerPhone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Seller GSTIN</Label>
                      <Input
                        value={currentInvoice.sellerGSTIN}
                        onChange={(e) => {
                          const sellerGSTIN = e.target.value.toUpperCase();
                          setCurrentInvoice(prev => ({ ...prev, sellerGSTIN, transactionType: classifyTransaction(sellerGSTIN, prev.customerGSTIN || '') }));
                        }}
                        placeholder="Enter seller GSTIN"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Customer Details */}
              <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-5">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-800" />
                  {invoiceType === 'sales' ? 'Customer Details' : 'Customer Details (Purchase Invoice)'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">Customer Name *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentInvoice.partyName}
                        onChange={(e) => {
                          setLastSavedId(null);
                          setCurrentInvoice(prev => ({ ...prev, partyName: e.target.value }));
                        }}
                        placeholder="Enter name"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => {
                          setLastSavedId(null);
                          setCurrentInvoice(prev => ({ ...prev, partyName: text }));
                        }}
                        onClear={() => {
                          setLastSavedId(null);
                          setCurrentInvoice(prev => ({ ...prev, partyName: '' }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">Phone No.</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentInvoice.phoneNo}
                        onChange={(e) => {
                          setLastSavedId(null);
                          setCurrentInvoice(prev => ({ ...prev, phoneNo: e.target.value }));
                        }}
                        placeholder="Phone number"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
                      />
                      <VoiceButton
                        onTranscript={(text) => {
                          setLastSavedId(null);
                          setCurrentInvoice(prev => ({ ...prev, phoneNo: text.replace(/\s/g, '') }));
                        }}
                        onClear={() => {
                          setLastSavedId(null);
                          setCurrentInvoice(prev => ({ ...prev, phoneNo: '' }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">Customer GSTIN</Label>
                    <Input
                      value={currentInvoice.customerGSTIN || ''}
                      onChange={(e) => {
                        setLastSavedId(null);
                        const customerGSTIN = e.target.value.toUpperCase();
                        setCurrentInvoice(prev => ({ ...prev, customerGSTIN, transactionType: classifyTransaction(prev.sellerGSTIN, customerGSTIN) }));
                      }}
                      placeholder="Enter GSTIN"
                      className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">E-Way Bill No.</Label>
                    <Input
                      value={currentInvoice.eWayBillNo}
                      onChange={(e) => {
                        setLastSavedId(null);
                        setCurrentInvoice(prev => ({ ...prev, eWayBillNo: e.target.value }));
                      }}
                      placeholder="E-Way bill"
                      className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:border-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">{invoiceType === 'sales' ? 'Invoice' : 'Bill'} No.</Label>
                    <Input
                      value={currentInvoice.invoiceNo}
                      onChange={(e) => {
                        setLastSavedId(null);
                        setCurrentInvoice(prev => ({ ...prev, invoiceNo: e.target.value }));
                      }}
                      className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">{invoiceType === 'sales' ? 'Invoice' : 'Bill'} Date</Label>
                    <Input
                      type="date"
                      value={currentInvoice.invoiceDate}
                      onChange={(e) => {
                        setLastSavedId(null);
                        setCurrentInvoice(prev => ({ ...prev, invoiceDate: e.target.value }));
                      }}
                      className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-800 text-sm font-semibold">State of Supply</Label>
                    <Select
                      value={currentInvoice.stateOfSupply}
                      onValueChange={(val) => setCurrentInvoice(prev => ({ ...prev, stateOfSupply: val }))}
                    >
                      <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-slate-200 text-slate-900 max-h-[250px]">
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Add Items Section */}
              <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-5">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-slate-800" />
                  Add Items
                </h2>

                <div className="space-y-4">
                  {/* Select from Inventory Stock */}
                  {inventoryItems.length > 0 && (
                    <div className="relative" ref={inventoryDropdownRef}>
                      <Label className="text-slate-800 text-sm mb-2 block font-semibold">Select from Inventory Stock</Label>
                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                              value={inventorySearchTerm}
                              onChange={(e) => {
                                setInventorySearchTerm(e.target.value);
                                setIsInventoryDropdownOpen(true);
                              }}
                              onFocus={() => setIsInventoryDropdownOpen(true)}
                              placeholder="Search inventory by name, SKU, or category..."
                              className="pl-10 h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                            />
                          </div>
                          <button
                            onClick={() => setIsInventoryDropdownOpen(!isInventoryDropdownOpen)}
                            className="px-4 h-10 bg-slate-950 text-white rounded-xl transition-all flex items-center gap-2 hover:bg-slate-800"
                          >
                            <Database className="h-4 w-4" />
                            <span className="hidden md:inline">{inventoryItems.length} in stock</span>
                          </button>
                        </div>

                        {/* Inventory Dropdown */}
                        {isInventoryDropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                            {isLoadingInventory ? (
                              <div className="p-4 text-center text-slate-650">
                                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-slate-800" />
                                Loading inventory...
                              </div>
                            ) : filteredInventoryItems.length > 0 ? (
                              filteredInventoryItems.map((item) => (
                                <div
                                  key={item._id}
                                  className="w-full px-4 py-3 hover:bg-slate-100 transition-all border-b border-slate-100 last:border-b-0 flex items-center justify-between group"
                                >
                                  <div
                                    onClick={() => selectInventoryItem(item)}
                                    className="flex-1 cursor-pointer flex justify-between items-center mr-4"
                                  >
                                    <div>
                                      <p className="font-medium text-slate-900 group-hover:text-slate-950 transition-colors">{item.itemName}</p>
                                      <p className="text-xs text-slate-500">SKU: {item.sku} • {item.category}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-emerald-700">₹{item.price}</p>
                                      <p className="text-xs text-slate-500">{item.quantity} in stock</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => deleteInventoryItem(e, item._id)}
                                    className="text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-full h-8 w-8 shrink-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-slate-500">
                                No items found matching "{inventorySearchTerm}"
                              </div>
                            )}
                            {filteredInventoryItems.length > 0 && (
                              <button
                                onClick={() => setIsInventoryDropdownOpen(false)}
                                className="w-full py-2 text-xs text-slate-600 hover:text-slate-800 border-t border-slate-100"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Item Name *</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newItem.itemName}
                          onChange={(e) => updateNewItemWithAutomation('itemName', e.target.value)}
                          placeholder="Enter item name"
                          className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                        />
                        <VoiceButton
                          onTranscript={(text) => setNewItem(prev => ({ ...prev, itemName: text }))}
                          onClear={() => setNewItem(prev => ({ ...prev, itemName: '' }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Item Code</Label>
                      <Input
                        value={newItem.itemCode}
                        onChange={(e) => updateNewItemWithAutomation('itemCode', e.target.value)}
                        placeholder="SKU"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">HSN / SAC Code</Label>
                      <div className="grid grid-cols-[88px_1fr] gap-2">
                        <Select value={newItem.codeType || 'HSN'} onValueChange={(val: 'HSN' | 'SAC') => setNewItem(prev => ({ ...prev, codeType: val }))}>
                          <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-slate-200 text-slate-900">
                            <SelectItem value="HSN">HSN</SelectItem>
                            <SelectItem value="SAC">SAC</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={newItem.hsnCode}
                          onChange={(e) => setNewItem(prev => ({ ...prev, hsnCode: e.target.value }))}
                          placeholder={newItem.codeType === 'SAC' ? 'SAC' : 'HSN'}
                          className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">
                        Qty {selectedInventoryMaxQty !== null && (
                          <span className="text-emerald-700 text-xs">(max: {selectedInventoryMaxQty})</span>
                        )}
                      </Label>
                      <Input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          if (selectedInventoryMaxQty !== null && val > selectedInventoryMaxQty) {
                            toast.error(`Max available: ${selectedInventoryMaxQty}`);
                            setNewItem(prev => ({ ...prev, quantity: selectedInventoryMaxQty }));
                          } else {
                            setNewItem(prev => ({ ...prev, quantity: val }));
                          }
                        }}
                        min="1"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Unit</Label>
                      <Select value={newItem.unit} onValueChange={(val) => setNewItem(prev => ({ ...prev, unit: val }))}>
                        <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 text-slate-900">
                          {UNITS.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Price *</Label>
                      <Input
                        type="number"
                        value={newItem.pricePerUnit ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewItem(prev => ({ ...prev, pricePerUnit: val }));
                        }}
                        onFocus={() => {
                          if (parseFloat(String(newItem.pricePerUnit)) === 0) {
                            setNewItem(prev => ({ ...prev, pricePerUnit: '' }));
                          }
                        }}
                        onBlur={() => {
                          if (newItem.pricePerUnit === '' || newItem.pricePerUnit === undefined) {
                            setNewItem(prev => ({ ...prev, pricePerUnit: 0 }));
                          } else {
                            setNewItem(prev => ({ ...prev, pricePerUnit: parseFloat(String(newItem.pricePerUnit)) || 0 }));
                          }
                        }}
                        min="0"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Disc %</Label>
                      <Input
                        type="number"
                        value={newItem.discountPercent ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewItem(prev => ({ ...prev, discountPercent: val }));
                        }}
                        onFocus={() => {
                          if (parseFloat(String(newItem.discountPercent)) === 0) {
                            setNewItem(prev => ({ ...prev, discountPercent: '' }));
                          }
                        }}
                        onBlur={() => {
                          if (newItem.discountPercent === '' || newItem.discountPercent === undefined) {
                            setNewItem(prev => ({ ...prev, discountPercent: 0 }));
                          } else {
                            setNewItem(prev => ({ ...prev, discountPercent: parseFloat(String(newItem.discountPercent)) || 0 }));
                          }
                        }}
                        min="0"
                        max="100"
                        className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Tax %</Label>
                      <Select 
                        value={newItem.priceWithTax ? (newItem.taxPercent?.toString() || "18") : "0"} 
                        onValueChange={(val) => setNewItem(prev => ({ ...prev, taxPercent: parseFloat(val) }))}
                        disabled={!newItem.priceWithTax}
                      >
                        <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 text-slate-900">
                          {GST_SLABS.map(rate => (
                            <SelectItem key={rate} value={rate}>{rate}%</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-800 text-sm font-semibold">Price Type</Label>
                      <Select
                        value={newItem.priceWithTax ? 'with_tax' : 'without_tax'}
                        onValueChange={(val) => setNewItem(prev => ({ ...prev, priceWithTax: val === 'with_tax' }))}
                      >
                        <SelectTrigger className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 focus:border-slate-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-200 text-slate-900">
                          <SelectItem value="without_tax">Without Tax</SelectItem>
                          <SelectItem value="with_tax">With Tax</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Item Preview with GST Breakdown */}
                  {newItem.itemName && newItem.pricePerUnit ? (
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 space-y-3">
                      {currentInvoice.stateOfSupply && (
                        <div className={`text-xs py-1.5 px-3 rounded-lg inline-block ${isInterStateTransaction()
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                          {isInterStateTransaction()
                            ? `Inter-State: ${currentInvoice.businessState} → ${currentInvoice.stateOfSupply} (IGST ${newItem.priceWithTax ? newItem.taxPercent || 0 : 0}%)`
                            : `Intra-State: ${currentInvoice.stateOfSupply} (SGST ${(newItem.priceWithTax ? newItem.taxPercent || 0 : 0) / 2}% + CGST ${(newItem.priceWithTax ? newItem.taxPercent || 0 : 0) / 2}%)`
                          }
                        </div>
                      )}
                      <div className="flex justify-between items-center text-slate-800">
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span>Disc: <span className="font-semibold">₹{(itemPreview.discountAmount || 0).toFixed(2)}</span></span>
                          {isInterStateTransaction() ? (
                            <span>IGST ({newItem.priceWithTax ? newItem.taxPercent || 0 : 0}%): <span className="font-semibold text-orange-700">₹{(itemPreview.igstAmount || 0).toFixed(2)}</span></span>
                          ) : (
                            <>
                              <span>SGST ({(newItem.priceWithTax ? newItem.taxPercent || 0 : 0) / 2}%): <span className="font-semibold text-emerald-700">₹{(itemPreview.sgstAmount || 0).toFixed(2)}</span></span>
                              <span>CGST ({(newItem.priceWithTax ? newItem.taxPercent || 0 : 0) / 2}%): <span className="font-semibold text-emerald-700">₹{(itemPreview.cgstAmount || 0).toFixed(2)}</span></span>
                            </>
                          )}
                        </div>
                        <span className="text-lg font-bold text-slate-950">₹{(itemPreview.amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-3">
                    <Button
                      onClick={addItemToInvoice}
                      className="flex-1 h-12 rounded-full bg-slate-950 font-semibold text-white transition-all duration-300 hover:bg-slate-800"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetItemForm}
                      className="px-6 h-12 rounded-full border-slate-200 text-slate-700 hover:bg-slate-100"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Items Table */}
              {currentInvoice.items.length > 0 && (
                <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-5">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-slate-850" />
                    Items ({currentInvoice.items.length})
                  </h2>
                  <div className="overflow-x-auto">
                    {(() => {
                      const items = currentInvoice.items;
                      const anyTax = items.some(i => i.taxAmount > 0);
                      const anyDiscount = items.some(i => i.discountAmount > 0);
                      return (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left py-2.5 px-2 text-slate-700 font-bold">Item</th>
                              <th className="text-center py-2.5 px-2 text-slate-700 font-bold">Qty</th>
                              <th className="text-right py-2.5 px-2 text-slate-700 font-bold">Price</th>
                              {anyDiscount && <th className="text-right py-2.5 px-2 text-slate-700 font-bold">Disc.</th>}
                              {anyTax && <th className="text-right py-2.5 px-2 text-slate-700 font-bold">Tax %</th>}
                              {anyTax && <th className="text-right py-2.5 px-2 text-slate-700 font-bold">Tax Amt</th>}
                              <th className="text-right py-2.5 px-2 text-slate-700 font-bold">Amount</th>
                              <th className="text-center py-2.5 px-2 text-slate-700 font-bold"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => (
                              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-slate-900 font-semibold">{item.itemName}</span>
                                    {item.stockReserved && (
                                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">STOCK</span>
                                    )}
                                  </div>
                                  <div className="text-slate-500 text-xs">{item.hsnCode || item.itemCode || ''}</div>
                                </td>
                                <td className="py-3 px-2 text-center text-slate-700 font-medium">{item.quantity}</td>
                                <td className="py-3 px-2 text-right text-slate-700 font-medium">₹{item.pricePerUnit.toFixed(2)}</td>
                                {anyDiscount && (
                                  <td className="py-3 px-2 text-right text-orange-600 font-medium">
                                    {item.discountAmount > 0 ? `₹${item.discountAmount.toFixed(2)}` : ''}
                                  </td>
                                )}
                                {anyTax && (
                                  <td className="py-3 px-2 text-right text-slate-600 text-xs">
                                    {item.taxAmount > 0
                                      ? item.isInterState
                                        ? `IGST ${item.igstRate}%`
                                        : `${item.sgstRate + item.cgstRate}%`
                                      : ''}
                                  </td>
                                )}
                                {anyTax && (
                                  <td className="py-3 px-2 text-right text-slate-600 font-medium">
                                    {item.taxAmount > 0 ? `₹${item.taxAmount.toFixed(2)}` : ''}
                                  </td>
                                )}
                                <td className="py-3 px-2 text-right font-bold text-slate-900">₹{item.amount.toFixed(2)}</td>
                                <td className="py-3 px-2 text-center">
                                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6 no-print">
              <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-5 sticky top-6">
                <h2 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-slate-900" />
                  Summary
                </h2>

                {/* Business State Info */}
                <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-600">Business State: <span className="text-slate-900 font-medium">{currentInvoice.businessState}</span></p>
                  {currentInvoice.stateOfSupply && (
                    <p className="text-xs text-slate-600 mt-1.5">
                      Customer State: <span className="text-slate-900 font-medium">{currentInvoice.stateOfSupply}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${isInterStateTransaction() ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {isInterStateTransaction() ? 'INTER-STATE' : 'INTRA-STATE'}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-slate-900 font-medium">₹{currentInvoice.subtotal.toFixed(2)}</span>
                  </div>

                  {currentInvoice.totalSgst > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">SGST</span>
                      <span className="text-slate-900">₹{currentInvoice.totalSgst.toFixed(2)}</span>
                    </div>
                  )}
                  {currentInvoice.totalCgst > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">CGST</span>
                      <span className="text-slate-900">₹{currentInvoice.totalCgst.toFixed(2)}</span>
                    </div>
                  )}
                  {currentInvoice.totalIgst > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">IGST (18%)</span>
                      <span className="text-slate-900">₹{currentInvoice.totalIgst.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-2">
                    <span className="text-slate-600 font-semibold">Total Tax</span>
                    <span className="text-slate-900">₹{currentInvoice.totalTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-slate-200">
                    <span className="text-slate-900 font-bold text-lg">Grand Total</span>
                    <span className="text-2xl font-black text-slate-950">
                      ₹{currentInvoice.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-slate-800 text-sm font-semibold">Paid Amount</Label>
                    <Input
                      type="number"
                      value={currentInvoice.paid}
                      onChange={(e) => updatePaidAmount(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="h-10 rounded-[14px] border-slate-200 bg-white/80 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-slate-200">
                    <span className="text-slate-600 font-semibold">Balance</span>
                    <span className={`text-xl font-bold ${currentInvoice.balance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      ₹{currentInvoice.balance.toFixed(2)}
                    </span>
                  </div>

                  {currentInvoice.balance > 0 && (
                    <div className="flex items-center gap-2 text-rose-700 text-sm bg-rose-50 p-2.5 rounded-lg border border-rose-100">
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
                    className="w-full h-12 rounded-full bg-slate-950 font-semibold text-white transition-all duration-300 hover:bg-slate-800"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Invoice
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={printInvoice} variant="outline" className="h-10 rounded-xl bg-white/60 border-slate-200 text-slate-850 hover:bg-slate-50">
                      <Printer className="h-4 w-4 mr-1.5" />
                      Print
                    </Button>
                    <Button onClick={copyInvoiceDetails} variant="outline" className="h-10 rounded-xl bg-white/60 border-slate-200 text-slate-850 hover:bg-slate-50">
                      <Copy className="h-4 w-4 mr-1.5" />
                      Copy
                    </Button>
                  </div>

                  <button
                    onClick={shareOnWhatsApp}
                    className="w-full py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#20ba56] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Share on WhatsApp
                  </button>

                  <Button onClick={saveAndNew} disabled={isSaving || currentInvoice.items.length === 0} variant="outline" className="w-full h-10 rounded-xl bg-white/60 border-slate-200 text-slate-850 hover:bg-slate-50">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Save & New
                  </Button>

                  <Button onClick={() => exportInvoice('csv')} variant="outline" className="w-full h-10 rounded-xl bg-white/60 border-slate-200 text-slate-850 hover:bg-slate-50">
                    <Download className="h-4 w-4 mr-1.5" />
                    Export CSV
                  </Button>
                </div>
              </Card>
            </div>

            {/* Print Preview Copy */}
            {currentInvoice.items.length > 0 && (
              <div className="lg:col-span-3 mt-8">
                <h3 className="text-xl font-bold text-slate-950 mb-4 no-print">Invoice Print Preview</h3>
                <div id="invoice-official-copy" className="bg-white border border-slate-300 rounded-[12px] shadow-md overflow-hidden text-slate-950 p-8 lg:p-12 space-y-6 max-w-4xl mx-auto">
                  {/* Header: Company Name & Invoice Number */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-700">Tax Invoice</p>
                      <h2 className="mt-2 text-2xl lg:text-3xl font-black text-slate-900">{currentInvoice.businessName || 'Saaiss Software Solution'}</h2>
                      <p className="mt-1 text-sm text-slate-700 font-medium">{currentInvoice.businessEmail || 'billing@saaiss.in'}{currentInvoice.businessPhone ? ` | ${currentInvoice.businessPhone}` : ""}</p>
                      {currentInvoice.businessGSTIN && <p className="text-sm text-slate-700 font-medium">GSTIN: {currentInvoice.businessGSTIN}</p>}
                    </div>
                    <div className="md:text-right">
                      <p className="text-sm text-slate-500 font-medium">Invoice Number</p>
                      <p className="text-2xl font-black text-slate-900">#{currentInvoice.invoiceNo}</p>
                      <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 border border-slate-300">
                        {currentInvoice.saleType?.toUpperCase() || "CASH"} | {currentInvoice.invoiceSize || "A4"}
                      </p>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200 pb-6">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 border-l-2 border-indigo-500 pl-2">From</h2>
                        <div className="space-y-0.5 text-sm">
                          <p className="font-bold text-slate-950">{currentInvoice.businessName || 'Saaiss Software Solution'}</p>
                          <p className="text-slate-650">{currentInvoice.businessEmail || 'billing@saaiss.in'}</p>
                          {currentInvoice.businessGSTIN && <p className="text-slate-650">GSTIN: {currentInvoice.businessGSTIN}</p>}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 border-l-2 border-indigo-500 pl-2">Bill To</h2>
                        <div className="space-y-0.5 text-sm">
                          <p className="font-bold text-slate-950">{currentInvoice.partyName || 'Valued Customer'}</p>
                          {currentInvoice.phoneNo && <p className="text-slate-650">Phone: {currentInvoice.phoneNo}</p>}
                          {currentInvoice.stateOfSupply && <p className="text-slate-650">State: {currentInvoice.stateOfSupply}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 md:text-right flex flex-col md:items-end text-sm">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 w-48 text-left md:text-right">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Invoice Date</h2>
                        <p className="text-slate-950 font-bold">{currentInvoice.invoiceDate}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 w-48 text-left md:text-right">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Due Date</h2>
                        <p className="text-slate-950 font-bold">{currentInvoice.invoiceDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-300 text-left bg-slate-50">
                          <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-700">Item Name</th>
                          <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-700">Code/Type</th>
                          <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-700 text-center">Qty</th>
                          <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-700 text-right">Price</th>
                          <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-700 text-right">Tax %</th>
                          <th className="py-3 px-2 text-xs font-bold uppercase tracking-wider text-slate-700 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentInvoice.items.map((item, idx) => (
                          <tr key={item.id || idx} className="text-sm">
                            <td className="py-4 px-2">
                              <p className="text-slate-950 font-semibold">{item.itemName}</p>
                              {item.itemCode && <p className="text-slate-500 text-xs mt-0.5">Code: {item.itemCode}</p>}
                            </td>
                            <td className="py-4 px-2 text-slate-650">{item.codeType || "HSN"}: {item.hsnCode || "-"}</td>
                            <td className="py-4 px-2 text-center text-slate-700">{item.quantity} {item.unit || "Pcs"}</td>
                            <td className="py-4 px-2 text-right text-slate-700">₹{item.pricePerUnit.toFixed(2)}</td>
                            <td className="py-4 px-2 text-right text-slate-700">{item.taxPercent}%</td>
                            <td className="py-4 px-2 text-right text-slate-950 font-bold">₹{item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Summary */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6 border-t border-slate-200">
                    <div className="text-xs text-slate-500">
                      <p>Thank you for your business!</p>
                      <p className="mt-1">This is a system-generated document.</p>
                    </div>

                    <div className="w-full md:w-72 space-y-2.5 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>₹{currentInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      {currentInvoice.totalSgst > 0 && (
                        <div className="flex justify-between text-slate-500 text-xs">
                          <span>SGST</span>
                          <span>₹{currentInvoice.totalSgst.toFixed(2)}</span>
                        </div>
                      )}
                      {currentInvoice.totalCgst > 0 && (
                        <div className="flex justify-between text-slate-500 text-xs">
                          <span>CGST</span>
                          <span>₹{currentInvoice.totalCgst.toFixed(2)}</span>
                        </div>
                      )}
                      {currentInvoice.totalIgst > 0 && (
                        <div className="flex justify-between text-slate-500 text-xs">
                          <span>IGST</span>
                          <span>₹{currentInvoice.totalIgst.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>Total Tax</span>
                        <span>₹{currentInvoice.totalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-base font-bold text-slate-900">Grand Total</span>
                        <span className="text-xl font-black text-slate-950 border-t-2 border-b-2 border-slate-900 py-1 px-3">
                          ₹{currentInvoice.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="px-8 lg:px-12 py-8 bg-slate-50 border-t border-slate-200 text-center">
                    <p className="text-slate-650 text-sm">
                      This is a digitally generated invoice. No signature required.
                    </p>
                    <p className="text-indigo-600/60 text-[10px] mt-2 tracking-widest font-bold uppercase">
                      Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED ✨
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* OCR Tab */}
        {activeTab === 'ocr' && (
          <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 mb-4 flex items-center gap-3">
              <Camera className="h-6 w-6 text-slate-900" />
              Invoice OCR Scanner
            </h2>
            <p className="text-slate-600 mb-6">
              Capture or upload invoice images to automatically extract vendor details, line items, taxes, and totals using AI-powered OCR.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="h-4 w-4 text-slate-800" />
                  <span className="text-slate-900 font-bold text-sm">Capture / Upload</span>
                </div>
                <p className="text-slate-600 text-xs">Scan with camera or upload invoice images & PDFs</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span className="text-slate-900 font-bold text-sm">AI Extract & Share</span>
                </div>
                <p className="text-slate-600 text-xs">Auto-enhanced, AI auto-fill, download PDF, share via WhatsApp</p>
              </div>
            </div>

            <DocScanner
              onTextExtracted={(text) => {
                setOcrText(text);
                const parsed = parseInvoiceText(text);
                if (parsed.items.length > 0 || parsed.invoiceNumber || parsed.customerName) {
                  const newInvoiceItems = parsed.items.map(item => {
                    const automation = getAutomatedCode(item.product, '');
                    const taxPct = automation?.gstRate || 18;
                    const calculated = calculateItemAmounts({
                      ...newItem,
                      itemName: item.product,
                      codeType: automation?.codeType || 'HSN',
                      hsnCode: automation?.code || '',
                      quantity: item.quantity,
                      unit: 'Pcs',
                      pricePerUnit: item.rate,
                      priceWithTax: false,
                      taxPercent: taxPct
                    });
                    return {
                      id: Math.random().toString(36).substr(2, 9),
                      itemName: item.product,
                      itemCode: '',
                      codeType: automation?.codeType || 'HSN',
                      hsnCode: automation?.code || '',
                      quantity: item.quantity,
                      unit: 'Pcs',
                      pricePerUnit: item.rate,
                      priceWithTax: false,
                      discountPercent: 0,
                      discountAmount: 0,
                      taxPercent: taxPct,
                      ...calculated
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
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  const gstJson = buildGstPortalJson(currentInvoice, ocrText);
                  setCurrentInvoice(prev => ({ ...prev, ocrJson: gstJson }));
                  downloadJsonFile(`gst-export-${currentInvoice.invoiceNo}.json`, gstJson);
                  toast.success("GST portal JSON exported for GSTR-1, GSTR-2B, and GSTR-3B.");
                }}
                className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Export GST JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('create')}
                className="rounded-full border-slate-200 bg-white/80 text-slate-800 hover:bg-white"
              >
                Review Invoice
              </Button>
            </div>
          </Card>
        )}

        {/* Voice Tab */}
        {activeTab === 'voice' && (
          <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 mb-6 flex items-center gap-3">
              <Mic className="h-6 w-6 text-slate-900" />
              Voice Dictation Mode
            </h2>
            <p className="text-slate-600 mb-8">
              Dictate your invoice details naturally. Mention invoice number, customer name, and items with quantities and rates.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-[24px] p-12 text-center bg-slate-50">
                  <div className="flex flex-col items-center gap-6">
                    <VoiceButton
                      onTranscript={(text) => setVoiceTranscript(prev => prev + " " + text)}
                      onClear={() => setVoiceTranscript("")}
                      size="lg"
                      className="scale-150 mb-4"
                    />
                    <div>
                      <p className="text-xl font-bold text-slate-900 mb-2">Hold the mic to speak</p>
                      <p className="text-sm text-slate-500">
                        Try: "Invoice number INV-101, customer John Doe, add item Table quantity 2 rate 5000"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleApplyVoiceData}
                    disabled={!voiceTranscript || isProcessingVoice}
                    className={`flex-1 h-14 rounded-full font-bold flex items-center justify-center gap-3 transition-all duration-300 ${!voiceTranscript || isProcessingVoice
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-950 text-white hover:bg-slate-800'
                      }`}
                  >
                    {isProcessingVoice ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    Apply Voice Data
                  </button>
                  <button
                    onClick={() => setVoiceTranscript("")}
                    className="px-6 py-4 bg-white border border-slate-200 text-slate-850 rounded-[24px] font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-800">Live Transcript Preview</label>
                <div className="border border-slate-200 rounded-[24px] p-6 bg-slate-50 min-h-[300px]">
                  <textarea
                    value={voiceTranscript}
                    onChange={(e) => setVoiceTranscript(e.target.value)}
                    placeholder="Transcript will appear here..."
                    className="w-full h-full min-h-[250px] bg-transparent text-slate-900 font-medium resize-none focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-[24px] bg-slate-100/60 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-700" />
                Voice Command Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Invoice No:</p>
                  <p className="font-mono text-xs">"invoice number ABC-123"</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Customer:</p>
                  <p className="font-mono text-xs">"customer name Jane Smith"</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Adding Items:</p>
                  <p className="font-mono text-xs">"item Laptop quantity 1 price 45000"</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <Card className="liquid-panel overflow-hidden rounded-[36px] border-white/55 p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950 flex items-center gap-3">
                    <Eye className="h-6 w-6 text-slate-900" />
                    Invoice History
                  </h2>
                  <p className="text-slate-500 mt-1">{invoiceHistory.length} invoice{invoiceHistory.length !== 1 ? 's' : ''} saved</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-2.5 h-11 border border-slate-200 text-slate-900 rounded-[14px] focus:ring-2 focus:ring-slate-350 focus:border-slate-350 w-full sm:w-64"
                  />
                </div>
              </div>

              {filteredHistory.length > 0 ? (
                <div className="grid gap-4">
                  {filteredHistory.map((invoice, index) => (
                    <div
                      key={invoice.invoiceNo + index}
                      className="rounded-[24px] border border-white/55 bg-white/42 p-5 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-slate-900">{invoice.invoiceNo}</h3>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                              {invoice.type === 'sales' ? 'SALES' : 'PURCHASE'}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                              {invoice.transactionType || 'B2C'}
                            </span>
                          </div>
                          <p className="text-slate-650 text-sm">
                            {invoice.partyName} | {invoice.invoiceDate}
                          </p>
                          <p className="text-slate-500 text-xs mt-1">
                            {invoice.items.length} items | {invoice.saleType?.toUpperCase()} | {invoice.invoiceSize || 'A4'}
                            {invoice.dueReminderDate ? ` | Reminder: ${invoice.dueReminderDate}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-950">
                              ₹{invoice.total.toFixed(2)}
                            </p>
                            {invoice.balance > 0 && (
                              <p className="text-rose-700 text-sm font-semibold">Due: ₹{invoice.balance.toFixed(2)}</p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteHistoryInvoice((invoice as InvoiceData & { id?: string }).id, invoice.invoiceNo)}
                            className="rounded-full border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-800 text-lg">No invoices found</p>
                  <p className="text-slate-600 text-sm">Create your first invoice to see it here</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm backdrop-blur-md inline-block px-6 py-2 rounded-full border border-white/40 bg-white/30">
          Powered by SHREE ANDAL AI SOFTWARE SOLUTIONS (OPC) PRIVATE LIMITED ✨
        </p>
      </div>
    </div>
  );
};

export default AutomationInvoice;
