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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Package, Search, Archive, ShoppingCart, Loader2, Shield, Mic, Save, FileText, Calculator, IndianRupee, AlertCircle, Download, Printer, Copy, MessageCircle } from "lucide-react";
import { parseVoiceInventoryText } from "@/lib/voiceInventoryParser";
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

interface InventoryItem {
    _id?: string;
    itemName: string;
    sku: string;
    hsnCode?: string;
    quantity: number;
    unit: string;
    price: number;
    category: string;
    gstRate?: number;
    sgst?: number;
    cgst?: number;
    igst?: number;
    lastUpdated?: Date;
    stateOfSupply: string;
}

interface SaleItem {
    _id: string;
    itemName: string;
    sku: string;
    quantitySold: number;
    unitPrice: number;
    subtotal: number;
    sgstRate: number;
    cgstRate: number;
    igstRate: number;
    sgstAmount: number;
    cgstAmount: number;
    igstAmount: number;
    gstRate: number;
    gstAmount: number;
    grandTotal: number;
    saleDate: Date;
    stateOfSupply: string;
}

interface PurchaseItem {
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
    sgstRate: number;
    sgstAmount: number;
    cgstRate: number;
    cgstAmount: number;
    igstRate: number;
    igstAmount: number;
    isInterState: boolean;
    amount: number;
}

interface PurchaseInvoice {
    type: 'purchase';
    supplierName: string;
    phone: string;
    gstin: string;
    billNo: string;
    billDate: string;
    stateOfSupply: string;
    businessState: string;
    items: PurchaseItem[];
    subtotal: number;
    totalSgst: number;
    totalCgst: number;
    totalIgst: number;
    totalTax: number;
    total: number;
    paid: number;
    balance: number;
}

const BUSINESS_STATE = "Tamil Nadu";

const INDIAN_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Inventory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("items");
    const [activeSubTab, setActiveSubTab] = useState<"instock" | "sold">("instock");

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [sales, setSales] = useState<SaleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Custom Category State
    const [customCategories, setCustomCategories] = useState<{ _id: string, name: string }[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isSavingCategory, setIsSavingCategory] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [isCategoryDeleteDialogOpen, setIsCategoryDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isItemDeleteDialogOpen, setIsItemDeleteDialogOpen] = useState(false);

    // Sell Dialog State
    const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [sellQuantity, setSellQuantity] = useState("1");
    const [sellStateOfSupply, setSellStateOfSupply] = useState("");
    const [isSelling, setIsSelling] = useState(false);

    // GST Rate Options
    const GST_SLABS = ["0", "5", "12", "18", "28"];
    const UNITS = ["Pcs", "Kg", "Ltr", "Mtr", "Box", "Dozen", "Pair", "Set", "Nos"];

    // Form State
    const [formData, setFormData] = useState({
        itemName: "",
        sku: "",
        hsnCode: "",
        quantity: "",
        unit: "Pcs",
        price: "",
        category: "General",
        gstRate: "0",
        stateOfSupply: ""
    });

    // Purchase Invoice State
    const generatePurchaseNo = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `PUR-${year}${month}-${random}`;
    };

    const [purchaseInvoice, setPurchaseInvoice] = useState<PurchaseInvoice>({
        type: 'purchase',
        supplierName: '',
        phone: '',
        gstin: '',
        billNo: generatePurchaseNo(),
        billDate: new Date().toISOString().split('T')[0],
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
    });

    const [purchaseNewItem, setPurchaseNewItem] = useState<Partial<PurchaseItem>>({
        itemName: '',
        itemCode: '',
        hsnCode: '',
        quantity: 1,
        unit: 'Pcs',
        pricePerUnit: 0,
        priceWithTax: false,
        discountPercent: 0,
        taxPercent: 18,
    });

    const [isPurchaseSaving, setIsPurchaseSaving] = useState(false);
    const [lastSavedPurchaseId, setLastSavedPurchaseId] = useState<string | null>(null);

    const isInterStatePurchase = (): boolean => {
        const supplierState = purchaseInvoice.stateOfSupply;
        return supplierState !== '' && BUSINESS_STATE !== '' && supplierState !== BUSINESS_STATE;
    };

    const calculatePurchaseItemAmounts = (item: Partial<PurchaseItem>): Partial<PurchaseItem> => {
        const qty = item.quantity || 0;
        const price = item.pricePerUnit || 0;
        const discountPct = item.discountPercent || 0;
        const taxPct = item.taxPercent || 0;
        const priceWithTax = item.priceWithTax || false;

        let baseAmount = qty * price;
        let discountAmount = (baseAmount * discountPct) / 100;
        let afterDiscount = baseAmount - discountAmount;

        const isInterState = isInterStatePurchase();

        let sgstRate = 0, cgstRate = 0, igstRate = 0;
        let sgstAmount = 0, cgstAmount = 0, igstAmount = 0;
        let taxAmount = 0;
        let finalAmount = 0;

        if (isInterState) {
            igstRate = taxPct;
            if (priceWithTax) {
                const taxMultiplier = 1 + (igstRate / 100);
                const preTaxAmount = afterDiscount / taxMultiplier;
                igstAmount = afterDiscount - preTaxAmount;
                finalAmount = afterDiscount;
            } else {
                igstAmount = (afterDiscount * igstRate) / 100;
                finalAmount = afterDiscount + igstAmount;
            }
            taxAmount = igstAmount;
        } else {
            sgstRate = taxPct / 2;
            cgstRate = taxPct / 2;
            if (priceWithTax) {
                const taxMultiplier = 1 + (taxPct / 100);
                const preTaxAmount = afterDiscount / taxMultiplier;
                taxAmount = afterDiscount - preTaxAmount;
                sgstAmount = taxAmount / 2;
                cgstAmount = taxAmount / 2;
                finalAmount = afterDiscount;
            } else {
                sgstAmount = (afterDiscount * sgstRate) / 100;
                cgstAmount = (afterDiscount * cgstRate) / 100;
                taxAmount = sgstAmount + cgstAmount;
                finalAmount = afterDiscount + taxAmount;
            }
        }

        return {
            ...item,
            discountAmount: Math.round(discountAmount * 100) / 100,
            taxAmount: Math.round(taxAmount * 100) / 100,
            sgstRate: Math.round(sgstRate * 100) / 100,
            sgstAmount: Math.round(sgstAmount * 100) / 100,
            cgstRate: Math.round(cgstRate * 100) / 100,
            cgstAmount: Math.round(cgstAmount * 100) / 100,
            igstRate: Math.round(igstRate * 100) / 100,
            igstAmount: Math.round(igstAmount * 100) / 100,
            isInterState,
            amount: Math.round(finalAmount * 100) / 100,
        };
    };

    const calculatePurchaseTotals = (items: PurchaseItem[]) => {
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
            total: Math.round(total * 100) / 100,
        };
    };

    const addPurchaseItem = () => {
        if (!purchaseNewItem.itemName || !purchaseNewItem.pricePerUnit) {
            toast.error("Please enter item name and price");
            return;
        }
        if (!purchaseInvoice.stateOfSupply) {
            toast.error("Please select State of Supply for GST calculation");
            return;
        }

        const calculatedItem = calculatePurchaseItemAmounts(purchaseNewItem);
        const item: PurchaseItem = {
            id: `pur-item-${Date.now()}`,
            itemName: purchaseNewItem.itemName || '',
            itemCode: purchaseNewItem.itemCode || '',
            hsnCode: purchaseNewItem.hsnCode || '',
            quantity: purchaseNewItem.quantity || 1,
            unit: purchaseNewItem.unit || 'Pcs',
            pricePerUnit: purchaseNewItem.pricePerUnit || 0,
            priceWithTax: purchaseNewItem.priceWithTax || false,
            discountPercent: purchaseNewItem.discountPercent || 0,
            discountAmount: calculatedItem.discountAmount || 0,
            taxPercent: purchaseNewItem.taxPercent || 0,
            taxAmount: calculatedItem.taxAmount || 0,
            sgstRate: calculatedItem.sgstRate || 0,
            sgstAmount: calculatedItem.sgstAmount || 0,
            cgstRate: calculatedItem.cgstRate || 0,
            cgstAmount: calculatedItem.cgstAmount || 0,
            igstRate: calculatedItem.igstRate || 0,
            igstAmount: calculatedItem.igstAmount || 0,
            isInterState: calculatedItem.isInterState || false,
            amount: calculatedItem.amount || 0,
        };

        const updatedItems = [...purchaseInvoice.items, item];
        const totals = calculatePurchaseTotals(updatedItems);

        setPurchaseInvoice(prev => ({
            ...prev,
            items: updatedItems,
            ...totals,
            balance: totals.total - prev.paid,
        }));

        setPurchaseNewItem({
            itemName: '',
            itemCode: '',
            hsnCode: '',
            quantity: 1,
            unit: 'Pcs',
            pricePerUnit: 0,
            priceWithTax: false,
            discountPercent: 0,
            taxPercent: 18,
        });

        toast.success("Item added to purchase invoice");
    };

    const removePurchaseItem = (itemId: string) => {
        const updatedItems = purchaseInvoice.items.filter(i => i.id !== itemId);
        const totals = calculatePurchaseTotals(updatedItems);
        setPurchaseInvoice(prev => ({
            ...prev,
            items: updatedItems,
            ...totals,
            balance: totals.total - prev.paid,
        }));
    };

    const savePurchaseInvoice = async () => {
        if (purchaseInvoice.items.length === 0) {
            toast.error("Please add at least one item");
            return;
        }
        if (!purchaseInvoice.supplierName.trim()) {
            toast.error("Please enter supplier name");
            return;
        }

        setIsPurchaseSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/purchase-invoice/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(purchaseInvoice),
            });

            if (res.ok) {
                const data = await res.json();
                const stockUpdates = data.stockUpdates || [];
                const added = stockUpdates.filter((s: { action: string }) => s.action === 'created').length;
                const updated = stockUpdates.filter((s: { action: string }) => s.action === 'updated').length;

                let msg = "Purchase invoice saved!";
                if (added > 0) msg += ` ${added} new item(s) added to stock.`;
                if (updated > 0) msg += ` ${updated} item(s) stock updated.`;

                toast.success(msg);
                setLastSavedPurchaseId(data.invoice?._id || null);
                fetchItems(); // Refresh inventory items list
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to save purchase invoice");
            }
        } catch (error) {
            console.error("Error saving purchase invoice:", error);
            toast.error("Error saving purchase invoice");
        } finally {
            setIsPurchaseSaving(false);
        }
    };

    const resetPurchaseForm = () => {
        setPurchaseInvoice({
            type: 'purchase',
            supplierName: '',
            phone: '',
            gstin: '',
            billNo: generatePurchaseNo(),
            billDate: new Date().toISOString().split('T')[0],
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
        });
        setLastSavedPurchaseId(null);
    };

    // Export purchase invoice as CSV
    const exportPurchaseCSV = () => {
        if (purchaseInvoice.items.length === 0) {
            toast.error("No items to export. Please add items first.");
            return;
        }

        const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
        const items = purchaseInvoice.items;
        const anyTax = items.some(i => i.taxAmount > 0);
        const anyDiscount = items.some(i => i.discountAmount > 0);
        const anyCode = items.some(i => i.itemCode);
        const anyHSN = items.some(i => i.hsnCode);

        // Header — only non-empty fields
        let csvContent = "PURCHASE INVOICE DETAILS\n";
        if (purchaseInvoice.billNo) csvContent += `Bill No,${purchaseInvoice.billNo}\n`;
        if (purchaseInvoice.billDate) csvContent += `Bill Date,${purchaseInvoice.billDate}\n`;
        if (purchaseInvoice.supplierName) csvContent += `Supplier Name,${esc(purchaseInvoice.supplierName)}\n`;
        if (purchaseInvoice.phone) csvContent += `Phone,${purchaseInvoice.phone}\n`;
        if (purchaseInvoice.gstin) csvContent += `GSTIN,${purchaseInvoice.gstin}\n`;
        if (purchaseInvoice.stateOfSupply) csvContent += `State of Supply,${purchaseInvoice.stateOfSupply}\n`;
        if (purchaseInvoice.businessState) csvContent += `Business State,${purchaseInvoice.businessState}\n`;
        csvContent += "\n";

        // Items — dynamic columns, no 6 GST columns
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

        // Summary — recalculate from items, only non-zero values
        csvContent += "\nSUMMARY\n";
        const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.pricePerUnit) - i.discountAmount, 0);
        const totalTax = items.reduce((sum, i) => sum + i.taxAmount, 0);
        const grandTotal = items.reduce((sum, i) => sum + i.amount, 0);

        if (subtotal > 0) csvContent += `Subtotal,${Math.round(subtotal * 100) / 100}\n`;
        if (anyDiscount) {
            const discTotal = items.reduce((sum, i) => sum + i.discountAmount, 0);
            if (discTotal > 0) csvContent += `Total Discount,${Math.round(discTotal * 100) / 100}\n`;
        }
        if (totalTax > 0) csvContent += `Total Tax,${Math.round(totalTax * 100) / 100}\n`;
        csvContent += `Grand Total,${Math.round(grandTotal * 100) / 100}\n`;
        if (purchaseInvoice.paid > 0) csvContent += `Amount Paid,${purchaseInvoice.paid}\n`;
        const balance = grandTotal - purchaseInvoice.paid;
        if (balance > 0) csvContent += `Balance Due,${Math.round(balance * 100) / 100}\n`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `purchase_invoice_${purchaseInvoice.billNo}_${purchaseInvoice.billDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Purchase invoice exported to CSV!");
    };

    // Print purchase invoice
    const printPurchaseInvoice = () => {
        window.print();
    };

    // Copy purchase invoice details to clipboard
    const copyPurchaseDetails = () => {
        const itemsList = purchaseInvoice.items.map(item =>
            `- ${item.itemName}: ${item.quantity} ${item.unit} x ${item.pricePerUnit} = ${item.amount}`
        ).join('\n');

        const details = `Purchase Invoice: ${purchaseInvoice.billNo}
Date: ${purchaseInvoice.billDate}
Supplier: ${purchaseInvoice.supplierName}
Phone: ${purchaseInvoice.phone}
GSTIN: ${purchaseInvoice.gstin}

Items:
${itemsList}

Total: ${purchaseInvoice.total.toFixed(2)}
Paid: ${purchaseInvoice.paid.toFixed(2)}
Balance: ${purchaseInvoice.balance.toFixed(2)}`;

        navigator.clipboard.writeText(details)
            .then(() => toast.success("Purchase invoice details copied to clipboard!"))
            .catch(() => toast.error("Failed to copy to clipboard"));
    };

    // Share purchase invoice on WhatsApp
    const sharePurchaseOnWhatsApp = () => {
        if (purchaseInvoice.items.length === 0) {
            toast.error("Add items before sharing");
            return;
        }

        if (!lastSavedPurchaseId) {
            toast.error("Please save the invoice first before sharing.");
            return;
        }

        const supplierName = purchaseInvoice.supplierName || 'Supplier';

        let message = `*PURCHASE INVOICE: ${purchaseInvoice.billNo}*\n`;
        message += `__________________________\n\n`;
        message += `Supplier: *${supplierName}*\n`;
        if (purchaseInvoice.gstin) message += `GSTIN: ${purchaseInvoice.gstin}\n`;
        message += `Date: ${purchaseInvoice.billDate}\n\n`;
        message += `*Items:*\n`;
        purchaseInvoice.items.forEach((item, i) => {
            message += `${i + 1}. ${item.itemName} - ${item.quantity} ${item.unit} x ${item.pricePerUnit} = ${item.amount}\n`;
        });
        message += `\n*Total: ${purchaseInvoice.total.toFixed(2)}*\n`;
        if (purchaseInvoice.paid > 0) {
            message += `Paid: ${purchaseInvoice.paid.toFixed(2)}\n`;
            message += `Balance: ${purchaseInvoice.balance.toFixed(2)}\n`;
        }
        message += `\n__________________________\n`;
        message += `_Powered by Sri Andal Financial Automation_`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    // Save and create new purchase invoice
    const saveAndNewPurchase = async () => {
        await savePurchaseInvoice();
        resetPurchaseForm();
    };

    // Voice State
    const [transcript, setTranscript] = useState("");
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);

    // Fetch Items
    useEffect(() => {
        fetchCustomCategories();
        if (activeTab === "items") {
            if (activeSubTab === "instock") {
                fetchItems();
            } else {
                fetchSales();
            }
        }
    }, [activeTab, activeSubTab]);

    const fetchCustomCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/categories`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCustomCategories(data.categories || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsSavingCategory(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategoryName.trim() })
            });
            if (res.ok) {
                const data = await res.json();
                setCustomCategories(prev => [...prev, data.category]);
                setFormData(prev => ({ ...prev, category: data.category.name }));
                setNewCategoryName("");
                setIsAddingCategory(false);
                toast.success("Category added successfully");
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add category");
            }
        } catch (error) {
            toast.error("Error adding category");
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleDeleteCategory = (id: string) => {
        setCategoryToDelete(id);
        setIsCategoryDeleteDialogOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/categories/${categoryToDelete}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setCustomCategories(prev => prev.filter(cat => cat._id !== categoryToDelete));
                toast.success("Category deleted");
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            toast.error("Error deleting category");
        } finally {
            setIsCategoryDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const checkLowStock = (itemsToCheck: InventoryItem[]) => {
        itemsToCheck.forEach(item => {
            if (item.quantity > 0 && item.quantity < 10) {
                toast("Low Stock Alert", {
                    description: `${item.itemName} (SKU: ${item.sku}) has only ${item.quantity} units left.`,
                    icon: "⚠️",
                    duration: 5000,
                });
            }
        });
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setItems(data);
                // Check for low stock on load
                checkLowStock(data);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    const fetchSales = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/sales`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSales(data.sales || []);
            }
        } catch (error) {
            console.error("Error fetching sales:", error);
            toast.error("Error fetching sales history");
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceApply = async () => {
        if (!transcript.trim()) {
            toast.error("Please provide voice transcript");
            return;
        }

        const parsedSales = parseVoiceInventoryText(transcript);
        if (parsedSales.length === 0) {
            toast.error("Could not find any sale commands. Try: 'Sell 5 units of [item name]'");
            return;
        }

        setIsProcessingVoice(true);
        let successCount = 0;
        let failCount = 0;

        for (const sale of parsedSales) {
            // Find item by name or SKU
            const item = items.find(i =>
                i.itemName.toLowerCase().includes(sale.itemNameOrSku.toLowerCase()) ||
                i.sku.toLowerCase() === sale.itemNameOrSku.toLowerCase()
            );

            if (!item) {
                toast.error(`Item "${sale.itemNameOrSku}" not found`);
                failCount++;
                continue;
            }

            if (item.quantity < sale.quantitySold) {
                toast.error(`Insufficient stock for "${item.itemName}"`);
                failCount++;
                continue;
            }

            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_BASE_URL}/inventory/sell/${item._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        quantitySold: sale.quantitySold
                    })
                });

                if (res.ok) {
                    successCount++;
                } else {
                    const data = await res.json();
                    toast.error(`Error selling ${item.itemName}: ${data.message}`);
                    failCount++;
                }
            } catch (error) {
                toast.error(`Error connecting for ${item.itemName}`);
                failCount++;
            }
        }

        if (successCount > 0) {
            toast.success(`Successfully processed ${successCount} sales!`);
            fetchItems();
            setTranscript("");
            setActiveTab("items");
            setActiveSubTab("sold");
        }

        if (failCount > 0) {
            toast.error(`Failed to process ${failCount} items.`);
        }

        setIsProcessingVoice(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addItem = async () => {
        if (!formData.itemName || !formData.sku || !formData.quantity || !formData.price) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    quantity: Number(formData.quantity),
                    price: Number(formData.price)
                })
            });

            if (res.ok) {
                toast.success("Item added successfully!");
                setFormData({
                    itemName: "",
                    sku: "",
                    hsnCode: "",
                    quantity: "",
                    unit: "Pcs",
                    price: "",
                    category: "General",
                    gstRate: "0",
                    stateOfSupply: ""
                });
                fetchItems();
                setActiveTab("items");
            } else {
                toast.error("Failed to add item");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Error adding item");
        }
    };

    const deleteItem = (id: string) => {
        setItemToDelete(id);
        setIsItemDeleteDialogOpen(true);
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setItems(prev => prev.filter(item => item._id !== itemToDelete));
                toast.success("Item deleted");
            } else {
                toast.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Error deleting item");
        } finally {
            setIsItemDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };

    const handleSellClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setSellQuantity("1");
        setSellStateOfSupply(item.stateOfSupply || "");
        setIsSellDialogOpen(true);
    };

    const submitSell = async () => {
        if (!selectedItem || !sellQuantity) return;

        const qty = parseInt(sellQuantity);

        if (qty <= 0) {
            toast.error("Quantity must be greater than 0");
            return;
        }
        if (qty > selectedItem.quantity) {
            toast.error("Insufficient stock");
            return;
        }

        setIsSelling(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/sell/${selectedItem._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quantitySold: qty,
                    stateOfSupply: sellStateOfSupply
                })
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Sold ${qty} units of ${selectedItem.itemName}`);
                setIsSellDialogOpen(false);

                // Check if remaining stock is low
                const remainingQty = selectedItem.quantity - qty;
                if (remainingQty > 0 && remainingQty < 10) {
                    toast("Low Stock Warning", {
                        description: `${selectedItem.itemName} is now at ${remainingQty} units.`,
                        icon: "🚨",
                        duration: 6000
                    });
                }

                fetchItems(); // Refresh items
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to sell item");
            }
        } catch (error) {
            console.error("Error selling item:", error);
            toast.error("Error selling item");
        } finally {
            setIsSelling(false);
        }
    };

    const filteredItems = items.filter(item =>
        (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
        item.quantity > 0
    );

    const filteredSales = sales.filter(sale =>
        sale.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
                <div className="absolute top-20 left-20 w-2 h-2 bg-violet-400 rounded-full animate-ping" />
                <div className="absolute bottom-40 right-40 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </div>

            {/* Header */}
            <header className="relative backdrop-blur-xl bg-white/5 border-b border-violet-400/20 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToDashboard}
                        className="mb-4 text-violet-200 hover:text-violet-100 hover:bg-white/10"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl border border-violet-400/30">
                            <Package className="h-8 w-8 text-violet-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                Inventory Management
                            </h1>
                            <p className="text-violet-200/80 font-medium mt-1">Track stock, manage items, and monitor assets</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-4 backdrop-blur-2xl bg-white/10 border border-violet-400/20 rounded-2xl p-1">
                        <TabsTrigger value="items" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-xl">
                            <Archive className="h-4 w-4 mr-2" /> Items
                        </TabsTrigger>
                        <TabsTrigger value="add" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-xl">
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </TabsTrigger>
                        <TabsTrigger value="purchase" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-xl">
                            <ShoppingCart className="h-4 w-4 mr-2" /> Purchase
                        </TabsTrigger>
                        <TabsTrigger value="voice" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-xl">
                            <Mic className="h-4 w-4 mr-2" /> Voice
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="items">
                        <div className="flex space-x-2 mb-6 bg-white/5 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setActiveSubTab("instock")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === "instock" ? "bg-violet-600 text-white shadow-lg" : "text-violet-300 hover:bg-white/5"
                                    }`}
                            >
                                <Package className="h-4 w-4 inline-block mr-2" />
                                In Stock
                            </button>
                            <button
                                onClick={() => setActiveSubTab("sold")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === "sold" ? "bg-violet-600 text-white shadow-lg" : "text-violet-300 hover:bg-white/5"
                                    }`}
                            >
                                <ShoppingCart className="h-4 w-4 inline-block mr-2" />
                                Sales History
                            </button>
                        </div>

                        <Card className="backdrop-blur-2xl bg-white/10 border border-violet-400/20 rounded-3xl">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-violet-100">
                                            {activeSubTab === "instock" ? "Inventory Items" : "Sales History"}
                                        </CardTitle>
                                        <CardDescription className="text-violet-300/70">
                                            {activeSubTab === "instock"
                                                ? `${items.length} items in stock`
                                                : `${sales.length} sales transactions record`}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-300" />
                                            <Input
                                                placeholder="Search..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 bg-white/5 border-violet-400/30 text-violet-100 placeholder:text-violet-300/40 w-64"
                                            />
                                        </div>
                                        <VoiceButton
                                            onTranscript={(text) => setSearchTerm(text)}
                                            onClear={() => setSearchTerm("")}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {loading ? (
                                        <p className="text-center text-violet-300 py-12">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                            Loading data...
                                        </p>
                                    ) : activeSubTab === "instock" ? (
                                        // IN STOCK LIST
                                        filteredItems.length > 0 ? (
                                            filteredItems.map((item) => (
                                                <div key={item._id} className="p-4 backdrop-blur-xl bg-white/5 border border-violet-400/10 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center group">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-lg font-semibold text-violet-100">{item.itemName}</h3>
                                                            <Badge variant="outline" className="border-violet-400/30 text-violet-300">{item.category}</Badge>
                                                        </div>
                                                        <p className="text-violet-300/60 text-sm">SKU: {item.sku}{item.hsnCode ? ` | HSN: ${item.hsnCode}` : ''}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-violet-100 font-bold text-lg">₹{item.price}</p>
                                                            <p className="text-violet-300/60 text-sm">Qty: {item.quantity} {item.unit || 'Pcs'}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => handleSellClick(item)}
                                                                className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                                                            >
                                                                <ShoppingCart className="h-4 w-4 mr-2" /> Sell
                                                            </Button> */}
                                                            <Button variant="ghost" size="sm" onClick={() => deleteItem(item._id!)} className="text-red-300 hover:text-red-100 hover:bg-red-500/20">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-violet-300/60">No items found matching your search.</div>
                                        )
                                    ) : (
                                        // SALES HISTORY LIST
                                        filteredSales.length > 0 ? (
                                            filteredSales.map((sale) => (
                                                <div key={sale._id} className="p-4 backdrop-blur-xl bg-white/5 border border-violet-400/10 rounded-2xl hover:bg-white/10 transition-all grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-semibold text-violet-100">{sale.itemName}</h3>
                                                            <Badge className="bg-emerald-500/20 text-emerald-300 border-none">Sold</Badge>
                                                        </div>
                                                        <p className="text-violet-300/60 text-sm">SKU: {sale.sku} • {new Date(sale.saleDate).toLocaleDateString()}</p>
                                                        {sale.stateOfSupply && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Shield className="h-3 w-3 text-violet-400/50" />
                                                                <span className="text-[10px] uppercase tracking-wider text-violet-400/50 font-bold">Supply: {sale.stateOfSupply}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 text-right border-r border-violet-400/10 pr-4">
                                                        <p className="text-violet-300/60 text-xs uppercase">Quantity</p>
                                                        <p className="text-violet-100 font-medium">{sale.quantitySold} x ₹{sale.unitPrice}</p>
                                                    </div>
                                                    <div className="col-span-2 text-right border-r border-violet-400/10 pr-4">
                                                        <p className="text-violet-300/60 text-xs uppercase">Subtotal</p>
                                                        <p className="text-violet-100 font-medium">₹{sale.subtotal.toFixed(2)}</p>
                                                    </div>
                                                    <div className="col-span-2 text-right border-r border-violet-400/10 pr-4">
                                                        <p className="text-violet-300/60 text-xs uppercase">Tax Breakdown</p>
                                                        <div className="text-violet-100 text-xs space-y-0.5">
                                                            {sale.sgstRate > 0 && <p>SGST ({sale.sgstRate}%): ₹{sale.sgstAmount.toFixed(2)}</p>}
                                                            {sale.cgstRate > 0 && <p>CGST ({sale.cgstRate}%): ₹{sale.cgstAmount.toFixed(2)}</p>}
                                                            {sale.igstRate > 0 && <p>IGST ({sale.igstRate}%): ₹{sale.igstAmount.toFixed(2)}</p>}
                                                            {sale.gstRate > 0 && !(sale.sgstRate || sale.cgstRate || sale.igstRate) && (
                                                                <p>GST ({sale.gstRate}%): ₹{sale.gstAmount.toFixed(2)}</p>
                                                            )}
                                                            {sale.gstRate === 0 && <p className="text-violet-400/40 italic">No Tax</p>}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 text-right">
                                                        <p className="text-violet-300/60 text-xs uppercase">Grand Total</p>
                                                        <p className="text-emerald-400 font-bold text-lg">₹{sale.grandTotal.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-violet-300/60">No sales history found.</div>
                                        )
                                    )}
                                </div>

                                <Dialog open={isSellDialogOpen} onOpenChange={setIsSellDialogOpen}>
                                    <DialogContent className="bg-slate-900 border-violet-400/20 text-white">
                                        <DialogHeader>
                                            <DialogTitle>Sell Item: {selectedItem?.itemName}</DialogTitle>
                                            <DialogDescription className="text-violet-300">
                                                Confirm sale details.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Quantity Sold</Label>
                                                <Input
                                                    type="number"
                                                    value={sellQuantity}
                                                    onChange={(e) => setSellQuantity(e.target.value)}
                                                    className="bg-white/5 border-violet-400/30 text-white"
                                                    min="1"
                                                    max={selectedItem?.quantity}
                                                />
                                                <div className="space-y-2">
                                                    <Label>State of Supply</Label>
                                                    <Select value={sellStateOfSupply} onValueChange={setSellStateOfSupply}>
                                                        <SelectTrigger className="bg-white/5 border-violet-400/30 text-white">
                                                            <SelectValue placeholder="Select State" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-slate-900 border-violet-400/20 text-white max-h-[300px]">
                                                            {INDIAN_STATES.map(state => (
                                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <p className="text-xs text-violet-400">Stock: {selectedItem?.quantity}</p>
                                            </div>

                                            {/* Preview Calculation */}
                                            {(() => {
                                                const qty = parseInt(sellQuantity) || 0;
                                                const price = selectedItem?.price || 0;
                                                const subtotal = qty * price;
                                                const itemState = selectedItem?.stateOfSupply || "";
                                                const sellState = sellStateOfSupply;
                                                const isInterState = itemState && sellState && itemState !== sellState;

                                                // Get the GST rate from item (prefer gstRate, fallback to combined old rates)
                                                const itemGstRate = selectedItem?.gstRate || ((selectedItem?.sgst || 0) + (selectedItem?.cgst || 0) + (selectedItem?.igst || 0));

                                                // Inter-state: IGST at item's GST rate, Intra-state: Split GST 50-50
                                                const igstRate = isInterState ? itemGstRate : 0;
                                                const sgstRate = isInterState ? 0 : itemGstRate / 2;
                                                const cgstRate = isInterState ? 0 : itemGstRate / 2;

                                                const igstAmount = (subtotal * igstRate) / 100;
                                                const sgstAmount = (subtotal * sgstRate) / 100;
                                                const cgstAmount = (subtotal * cgstRate) / 100;
                                                const totalTax = igstAmount + sgstAmount + cgstAmount;
                                                const grandTotal = subtotal + totalTax;

                                                return (
                                                    <div className="bg-white/5 p-4 rounded-lg space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-violet-300">Subtotal ({sellQuantity} x ₹{price})</span>
                                                            <span>₹{subtotal.toFixed(2)}</span>
                                                        </div>

                                                        {/* State comparison indicator */}
                                                        {itemState && sellState && (
                                                            <div className={`text-xs py-1 px-2 rounded ${isInterState ? 'bg-orange-500/20 text-orange-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                                                {isInterState
                                                                    ? `Inter-State Sale: ${itemState} → ${sellState} (IGST applies)`
                                                                    : `Intra-State Sale: ${itemState} (SGST + CGST applies)`
                                                                }
                                                            </div>
                                                        )}

                                                        {/* SGST - Intra-state only */}
                                                        {sgstRate > 0 && (
                                                            <div className="flex justify-between text-violet-400/80">
                                                                <span>SGST ({sgstRate.toFixed(1)}%)</span>
                                                                <span>₹{sgstAmount.toFixed(2)}</span>
                                                            </div>
                                                        )}

                                                        {/* CGST - Intra-state only */}
                                                        {cgstRate > 0 && (
                                                            <div className="flex justify-between text-violet-400/80">
                                                                <span>CGST ({cgstRate.toFixed(1)}%)</span>
                                                                <span>₹{cgstAmount.toFixed(2)}</span>
                                                            </div>
                                                        )}

                                                        {/* IGST - Inter-state only */}
                                                        {igstRate > 0 && (
                                                            <div className="flex justify-between text-orange-400/80">
                                                                <span>IGST ({igstRate}%)</span>
                                                                <span>₹{igstAmount.toFixed(2)}</span>
                                                            </div>
                                                        )}

                                                        {/* No tax case */}
                                                        {itemGstRate === 0 && !isInterState && (
                                                            <div className="flex justify-between text-violet-400/40 italic">
                                                                <span>No Tax (0% GST)</span>
                                                                <span>₹0.00</span>
                                                            </div>
                                                        )}

                                                        <div className="border-t border-violet-400/20 pt-2 flex justify-between font-bold text-emerald-400">
                                                            <span>Grand Total</span>
                                                            <span>₹{grandTotal.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsSellDialogOpen(false)} className="border-violet-400/30 text-violet-300 hover:bg-white/5">Cancel</Button>
                                            <Button onClick={submitSell} disabled={isSelling} className="bg-violet-600 hover:bg-violet-500">
                                                {isSelling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                                                Confirm Sale
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="add">
                        <Card className="backdrop-blur-2xl bg-white/10 border border-violet-400/20 rounded-3xl">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-violet-100">Add New Item</CardTitle>
                                <CardDescription className="text-violet-300/70">Add a new item to your inventory</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-violet-100">Item Name</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={formData.itemName}
                                            onChange={(e) => handleInputChange("itemName", e.target.value)}
                                            className="bg-white/5 border-violet-400/30 text-violet-100"
                                            placeholder="e.g. Office Chair"
                                        />
                                        <VoiceButton
                                            onTranscript={(text) => handleInputChange("itemName", text)}
                                            onClear={() => handleInputChange("itemName", "")}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">SKU</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={formData.sku}
                                                onChange={(e) => handleInputChange("sku", e.target.value)}
                                                className="bg-white/5 border-violet-400/30 text-violet-100"
                                                placeholder="e.g. FURN-001"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => handleInputChange("sku", text)}
                                                onClear={() => handleInputChange("sku", "")}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">HSN Code</Label>
                                        <Input
                                            value={formData.hsnCode}
                                            onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                                            className="bg-white/5 border-violet-400/30 text-violet-100"
                                            placeholder="e.g. 9403"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">Unit</Label>
                                        <Select value={formData.unit} onValueChange={(val) => handleInputChange("unit", val)}>
                                            <SelectTrigger className="bg-white/5 border-violet-400/30 text-violet-100 h-10">
                                                <SelectValue placeholder="Select Unit" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-violet-400/20 text-white">
                                                {UNITS.map(unit => (
                                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-violet-100">Category</Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsAddingCategory(!isAddingCategory)}
                                                className="h-6 text-violet-400 hover:text-violet-200"
                                            >
                                                {isAddingCategory ? "Cancel" : "+ Add New"}
                                            </Button>
                                        </div>

                                        {isAddingCategory ? (
                                            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Input
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Category name"
                                                    className="bg-white/5 border-violet-400/30 text-violet-100 h-10"
                                                />
                                                <Button
                                                    onClick={handleAddCategory}
                                                    disabled={isSavingCategory || !newCategoryName.trim()}
                                                    className="bg-violet-600 hover:bg-violet-500 h-10 px-3"
                                                >
                                                    {isSavingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                                                <SelectTrigger className="bg-white/5 border-violet-400/30 text-violet-100 h-10">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-violet-400/20 text-white">
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Electronics">Electronics</SelectItem>
                                                    <SelectItem value="Furniture">Furniture</SelectItem>
                                                    <SelectItem value="Stationery">Stationery</SelectItem>
                                                    {customCategories.map(cat => (
                                                        <div key={cat._id} className="flex items-center justify-between px-2 hover:bg-white/10 transition-colors">
                                                            <SelectItem value={cat.name} className="flex-1">{cat.name}</SelectItem>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDeleteCategory(cat._id);
                                                                }}
                                                                className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">Price (₹)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange("price", e.target.value)}
                                                className="bg-white/5 border-violet-400/30 text-violet-100"
                                                placeholder="0.00"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => handleInputChange("price", text)}
                                                onClear={() => handleInputChange("price", "")}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">State of Supply</Label>
                                        <Select
                                            value={formData.stateOfSupply}
                                            onValueChange={(val) => handleInputChange("stateOfSupply", val)}
                                        >
                                            <SelectTrigger className="bg-white/5 border-violet-400/30 text-violet-100 h-10">
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-violet-400/20 text-white max-h-[300px]">
                                                {INDIAN_STATES.map(state => (
                                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">Quantity</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => handleInputChange("quantity", e.target.value)}
                                                className="bg-white/5 border-violet-400/30 text-violet-100"
                                                placeholder="0"
                                            />
                                            <VoiceButton
                                                onTranscript={(text) => handleInputChange("quantity", text)}
                                                onClear={() => handleInputChange("quantity", "")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Information Section */}
                                <div className="space-y-4 pt-4 border-t border-violet-400/10">
                                    <h3 className="text-lg font-bold text-violet-200 flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> GST Rate
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-violet-100">GST Slab (%)</Label>
                                            <Select
                                                value={formData.gstRate}
                                                onValueChange={(val) => handleInputChange("gstRate", val)}
                                            >
                                                <SelectTrigger className="bg-white/5 border-violet-400/30 text-violet-100 h-10">
                                                    <SelectValue placeholder="Select GST Rate" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-violet-400/20 text-white">
                                                    {GST_SLABS.map(rate => (
                                                        <SelectItem key={rate} value={rate}>{rate}%</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-violet-100 opacity-60">Tax Split Preview</Label>
                                            <div className="bg-white/5 border border-violet-400/20 rounded-lg p-3 text-sm">
                                                <p className="text-violet-300/80">
                                                    <span className="font-semibold text-violet-200">Intra-State:</span> SGST {(parseFloat(formData.gstRate) / 2).toFixed(1)}% + CGST {(parseFloat(formData.gstRate) / 2).toFixed(1)}%
                                                </p>
                                                <p className="text-violet-300/80 mt-1">
                                                    <span className="font-semibold text-violet-200">Inter-State:</span> IGST {formData.gstRate}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={addItem} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold h-12 rounded-xl mt-4">
                                    Add Item
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Purchase Invoice Tab */}
                    <TabsContent value="purchase">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Left Column - Form & Items (2 cols) */}
                            <div className="col-span-2 space-y-6">
                                {/* Supplier Details */}
                                <Card className="backdrop-blur-2xl bg-white/10 border border-amber-400/20 rounded-3xl">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold text-amber-100 flex items-center gap-2">
                                            <FileText className="h-6 w-6 text-amber-400" />
                                            Purchase Invoice
                                        </CardTitle>
                                        <CardDescription className="text-amber-300/70">Enter supplier details and add items</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Supplier Name *</Label>
                                                <Input
                                                    value={purchaseInvoice.supplierName}
                                                    onChange={(e) => setPurchaseInvoice(prev => ({ ...prev, supplierName: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="Supplier name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Phone</Label>
                                                <Input
                                                    value={purchaseInvoice.phone}
                                                    onChange={(e) => setPurchaseInvoice(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">GSTIN</Label>
                                                <Input
                                                    value={purchaseInvoice.gstin}
                                                    onChange={(e) => setPurchaseInvoice(prev => ({ ...prev, gstin: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="Supplier GSTIN"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">State of Supply *</Label>
                                                <Select
                                                    value={purchaseInvoice.stateOfSupply}
                                                    onValueChange={(val) => setPurchaseInvoice(prev => ({ ...prev, stateOfSupply: val }))}
                                                >
                                                    <SelectTrigger className="bg-white/5 border-amber-400/30 text-amber-100">
                                                        <SelectValue placeholder="Select State" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-amber-400/20 text-white max-h-[300px]">
                                                        {INDIAN_STATES.map(state => (
                                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Bill No</Label>
                                                <Input
                                                    value={purchaseInvoice.billNo}
                                                    onChange={(e) => setPurchaseInvoice(prev => ({ ...prev, billNo: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Bill Date</Label>
                                                <Input
                                                    type="date"
                                                    value={purchaseInvoice.billDate}
                                                    onChange={(e) => setPurchaseInvoice(prev => ({ ...prev, billDate: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                />
                                            </div>
                                        </div>

                                        {/* Inter/Intra state indicator */}
                                        {purchaseInvoice.stateOfSupply && (
                                            <div className={`flex items-center gap-2 text-xs py-2 px-3 rounded-lg ${isInterStatePurchase()
                                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                }`}>
                                                <AlertCircle className="h-3 w-3" />
                                                {isInterStatePurchase()
                                                    ? `Inter-State: ${purchaseInvoice.stateOfSupply} → ${BUSINESS_STATE} (IGST)`
                                                    : `Intra-State: ${BUSINESS_STATE} (SGST + CGST)`
                                                }
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Add Item Form */}
                                <Card className="backdrop-blur-2xl bg-white/10 border border-amber-400/20 rounded-3xl">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-amber-100 flex items-center gap-2">
                                            <Plus className="h-5 w-5 text-amber-400" />
                                            Add Item
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Item Name *</Label>
                                                <Input
                                                    value={purchaseNewItem.itemName}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, itemName: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="Item name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Item Code</Label>
                                                <Input
                                                    value={purchaseNewItem.itemCode}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, itemCode: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="SKU / Code"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">HSN Code</Label>
                                                <Input
                                                    value={purchaseNewItem.hsnCode}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, hsnCode: e.target.value }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="HSN"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Qty *</Label>
                                                <Input
                                                    type="number"
                                                    value={purchaseNewItem.quantity}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    min="1"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Unit</Label>
                                                <Select
                                                    value={purchaseNewItem.unit}
                                                    onValueChange={(val) => setPurchaseNewItem(prev => ({ ...prev, unit: val }))}
                                                >
                                                    <SelectTrigger className="bg-white/5 border-amber-400/30 text-amber-100">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-amber-400/20 text-white">
                                                        {UNITS.map(u => (
                                                            <SelectItem key={u} value={u}>{u}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Price/Unit *</Label>
                                                <Input
                                                    type="number"
                                                    value={purchaseNewItem.pricePerUnit}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, pricePerUnit: Number(e.target.value) }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Discount %</Label>
                                                <Input
                                                    type="number"
                                                    value={purchaseNewItem.discountPercent}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, discountPercent: Number(e.target.value) }))}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 items-end">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">GST %</Label>
                                                <Select
                                                    value={String(purchaseNewItem.taxPercent)}
                                                    onValueChange={(val) => setPurchaseNewItem(prev => ({ ...prev, taxPercent: Number(val) }))}
                                                >
                                                    <SelectTrigger className="bg-white/5 border-amber-400/30 text-amber-100">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-amber-400/20 text-white">
                                                        {GST_SLABS.map(rate => (
                                                            <SelectItem key={rate} value={rate}>{rate}%</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex items-center gap-2 pb-1">
                                                <input
                                                    type="checkbox"
                                                    checked={purchaseNewItem.priceWithTax}
                                                    onChange={(e) => setPurchaseNewItem(prev => ({ ...prev, priceWithTax: e.target.checked }))}
                                                    className="rounded border-amber-400/30"
                                                />
                                                <Label className="text-amber-100 text-sm">Price includes tax</Label>
                                            </div>
                                            <Button
                                                onClick={addPurchaseItem}
                                                className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-10 rounded-xl"
                                            >
                                                <Plus className="h-4 w-4 mr-2" /> Add Item
                                            </Button>
                                        </div>

                                        {/* Preview calculation */}
                                        {(purchaseNewItem.pricePerUnit || 0) > 0 && purchaseInvoice.stateOfSupply && (
                                            <div className="bg-amber-500/5 border border-amber-400/10 rounded-lg p-3 text-sm">
                                                {(() => {
                                                    const calc = calculatePurchaseItemAmounts(purchaseNewItem);
                                                    return (
                                                        <div className="flex gap-4 text-amber-200/80">
                                                            <span>Base: ₹{((purchaseNewItem.quantity || 0) * (purchaseNewItem.pricePerUnit || 0)).toFixed(2)}</span>
                                                            {(calc.discountAmount || 0) > 0 && <span>Disc: -₹{calc.discountAmount?.toFixed(2)}</span>}
                                                            {(calc.sgstAmount || 0) > 0 && <span>SGST: ₹{calc.sgstAmount?.toFixed(2)}</span>}
                                                            {(calc.cgstAmount || 0) > 0 && <span>CGST: ₹{calc.cgstAmount?.toFixed(2)}</span>}
                                                            {(calc.igstAmount || 0) > 0 && <span>IGST: ₹{calc.igstAmount?.toFixed(2)}</span>}
                                                            <span className="font-bold text-amber-100">Total: ₹{calc.amount?.toFixed(2)}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Items Table */}
                                {purchaseInvoice.items.length > 0 && (
                                    <Card className="backdrop-blur-2xl bg-white/10 border border-amber-400/20 rounded-3xl">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-bold text-amber-100">
                                                Items ({purchaseInvoice.items.length})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-amber-400/20 text-amber-300/70">
                                                            <th className="text-left py-2 px-2">#</th>
                                                            <th className="text-left py-2 px-2">Item</th>
                                                            <th className="text-right py-2 px-2">Qty</th>
                                                            <th className="text-right py-2 px-2">Price</th>
                                                            <th className="text-right py-2 px-2">Disc</th>
                                                            <th className="text-right py-2 px-2">Tax</th>
                                                            <th className="text-right py-2 px-2">Amount</th>
                                                            <th className="text-center py-2 px-2"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {purchaseInvoice.items.map((item, idx) => (
                                                            <tr key={item.id} className="border-b border-amber-400/10 hover:bg-white/5">
                                                                <td className="py-2 px-2 text-amber-300/60">{idx + 1}</td>
                                                                <td className="py-2 px-2">
                                                                    <div className="text-amber-100 font-medium">{item.itemName}</div>
                                                                    <div className="text-amber-300/50 text-xs">
                                                                        {item.itemCode && `${item.itemCode} • `}{item.hsnCode && `HSN: ${item.hsnCode}`}
                                                                    </div>
                                                                </td>
                                                                <td className="py-2 px-2 text-right text-amber-100">{item.quantity} {item.unit}</td>
                                                                <td className="py-2 px-2 text-right text-amber-100">₹{item.pricePerUnit.toFixed(2)}</td>
                                                                <td className="py-2 px-2 text-right text-amber-200/70">
                                                                    {item.discountAmount > 0 ? `-₹${item.discountAmount.toFixed(2)}` : '-'}
                                                                </td>
                                                                <td className="py-2 px-2 text-right">
                                                                    <div className="text-amber-200/70">₹{item.taxAmount.toFixed(2)}</div>
                                                                    <div className="text-amber-400/50 text-xs">
                                                                        {item.isInterState
                                                                            ? `IGST ${item.igstRate}%`
                                                                            : `S${item.sgstRate}% C${item.cgstRate}%`
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="py-2 px-2 text-right font-bold text-amber-100">₹{item.amount.toFixed(2)}</td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removePurchaseItem(item.id)}
                                                                        className="text-red-300 hover:text-red-100 hover:bg-red-500/20 h-7 w-7 p-0"
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Right Column - Summary Panel (1 col) */}
                            <div className="col-span-1 space-y-6">
                                <Card className="backdrop-blur-2xl bg-white/10 border border-amber-400/20 rounded-3xl sticky top-6">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-amber-100 flex items-center gap-2">
                                            <Calculator className="h-5 w-5 text-amber-400" />
                                            Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Subtotal */}
                                        <div className="flex justify-between text-amber-200/80">
                                            <span>Subtotal</span>
                                            <span>₹{purchaseInvoice.subtotal.toFixed(2)}</span>
                                        </div>

                                        {/* GST Breakdown */}
                                        {purchaseInvoice.totalSgst > 0 && (
                                            <div className="flex justify-between text-amber-300/70 text-sm">
                                                <span>SGST</span>
                                                <span>₹{purchaseInvoice.totalSgst.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {purchaseInvoice.totalCgst > 0 && (
                                            <div className="flex justify-between text-amber-300/70 text-sm">
                                                <span>CGST</span>
                                                <span>₹{purchaseInvoice.totalCgst.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {purchaseInvoice.totalIgst > 0 && (
                                            <div className="flex justify-between text-orange-300/70 text-sm">
                                                <span>IGST</span>
                                                <span>₹{purchaseInvoice.totalIgst.toFixed(2)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-amber-200/80 text-sm">
                                            <span>Total Tax</span>
                                            <span>₹{purchaseInvoice.totalTax.toFixed(2)}</span>
                                        </div>

                                        <div className="border-t border-amber-400/20 pt-3 flex justify-between font-bold text-xl text-amber-100">
                                            <span className="flex items-center gap-1"><IndianRupee className="h-5 w-5" /> Total</span>
                                            <span>₹{purchaseInvoice.total.toFixed(2)}</span>
                                        </div>

                                        {/* Paid / Balance */}
                                        <div className="border-t border-amber-400/20 pt-3 space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-amber-100">Amount Paid</Label>
                                                <Input
                                                    type="number"
                                                    value={purchaseInvoice.paid || ''}
                                                    onChange={(e) => {
                                                        const paid = Number(e.target.value) || 0;
                                                        setPurchaseInvoice(prev => ({
                                                            ...prev,
                                                            paid,
                                                            balance: prev.total - paid,
                                                        }));
                                                    }}
                                                    className="bg-white/5 border-amber-400/30 text-amber-100"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-amber-300/70">Balance Due</span>
                                                <span className={`font-bold ${purchaseInvoice.balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    ₹{purchaseInvoice.balance.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="border-t border-amber-400/20 pt-3 space-y-2">
                                            <Button
                                                onClick={savePurchaseInvoice}
                                                disabled={isPurchaseSaving || purchaseInvoice.items.length === 0}
                                                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 rounded-xl"
                                            >
                                                {isPurchaseSaving ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
                                                ) : (
                                                    <><Save className="h-4 w-4 mr-2" /> Save Purchase Invoice</>
                                                )}
                                            </Button>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Button onClick={printPurchaseInvoice} variant="outline" className="py-2 bg-white/5 border-amber-400/30 text-amber-200 hover:bg-white/10 text-sm rounded-xl">
                                                    <Printer className="h-4 w-4 mr-1" />
                                                    Print
                                                </Button>
                                                <Button onClick={copyPurchaseDetails} variant="outline" className="py-2 bg-white/5 border-amber-400/30 text-amber-200 hover:bg-white/10 text-sm rounded-xl">
                                                    <Copy className="h-4 w-4 mr-1" />
                                                    Copy
                                                </Button>
                                            </div>

                                            <button
                                                onClick={sharePurchaseOnWhatsApp}
                                                className="w-full py-3 bg-[#25D366]/10 text-[#25D366] rounded-xl font-bold hover:bg-[#25D366]/20 transition-all duration-300 border border-[#25D366]/30 hover:border-[#25D366]/50 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/10"
                                            >
                                                <MessageCircle className="h-5 w-5" />
                                                Share on WhatsApp
                                            </button>

                                            <Button
                                                onClick={saveAndNewPurchase}
                                                disabled={isPurchaseSaving || purchaseInvoice.items.length === 0}
                                                variant="outline"
                                                className="w-full py-2 bg-white/5 border-amber-400/30 text-amber-200 hover:bg-white/10 text-sm rounded-xl"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Save & New
                                            </Button>

                                            <Button onClick={exportPurchaseCSV} variant="outline" className="w-full py-2 bg-white/5 border-amber-400/30 text-amber-200 hover:bg-white/10 text-sm rounded-xl">
                                                <Download className="h-4 w-4 mr-1" />
                                                Export CSV
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={resetPurchaseForm}
                                                className="w-full border-amber-400/30 text-amber-300 hover:bg-white/5 rounded-xl"
                                            >
                                                Reset Form
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="voice">
                        <Card className="backdrop-blur-2xl bg-white/10 border border-violet-400/20 rounded-3xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl font-bold text-violet-100 flex items-center gap-3">
                                    <div className="p-2 bg-violet-500/20 rounded-lg">
                                        <Mic className="h-6 w-6 text-violet-400" />
                                    </div>
                                    Voice Inventory Sales
                                </CardTitle>
                                <CardDescription className="text-violet-300/70">
                                    Dictate sales to process them automatically (e.g., "Sell 5 units of [Item Name]")
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-violet-200 font-medium">Live Transcript</Label>
                                        <VoiceButton
                                            onTranscript={(text) => setTranscript(prev => prev + " " + text)}
                                            onClear={() => setTranscript("")}
                                        />
                                    </div>
                                    <textarea
                                        value={transcript}
                                        onChange={(e) => setTranscript(e.target.value)}
                                        placeholder="Speak now or type commands here... e.g. 'Sell 2 MacBook Pro'"
                                        className="w-full h-48 bg-white/5 border border-violet-400/20 rounded-2xl p-6 text-violet-100 placeholder:text-violet-300/20 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all resize-none text-lg leading-relaxed"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleVoiceApply}
                                        disabled={isProcessingVoice || !transcript.trim()}
                                        className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold h-14 rounded-2xl shadow-lg shadow-violet-500/20 transition-all active:scale-[0.98]"
                                    >
                                        {isProcessingVoice ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                Processing Sales...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5 mr-2" />
                                                Apply Voice Sales
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setTranscript("")}
                                        className="h-14 px-8 border-violet-400/20 text-violet-300 hover:bg-white/5 rounded-2xl"
                                    >
                                        Clear
                                    </Button>
                                </div>

                                <div className="p-4 bg-violet-500/5 rounded-2xl border border-violet-400/10">
                                    <h4 className="text-sm font-semibold text-violet-300 mb-2 flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> Usage Tips:
                                    </h4>
                                    <ul className="text-xs text-violet-300/60 space-y-1 ml-6 list-disc">
                                        <li>"Sell 10 units of Office Chairs"</li>
                                        <li>"Sale 5 MacBook Pro"</li>
                                        <li>"Sell 2 quantities of SKU-101"</li>
                                        <li>You can chain multiple commands by saying "and" or using dots.</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                <AlertDialog open={isItemDeleteDialogOpen} onOpenChange={setIsItemDeleteDialogOpen}>
                    <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-emerald-500/20 text-emerald-50 max-w-md rounded-3xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <Trash2 className="h-6 w-6 text-red-400" />
                                Delete Item?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-emerald-200/60 text-base">
                                This action cannot be undone. This will permanently delete the item from your inventory.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 mt-6">
                            <AlertDialogCancel className="bg-white/5 border-emerald-500/20 text-emerald-100 hover:bg-white/10 hover:text-white rounded-xl h-12 px-6">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDeleteItem}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border-0 rounded-xl h-12 px-6 font-bold shadow-lg shadow-red-500/20"
                            >
                                Delete Permanently
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isCategoryDeleteDialogOpen} onOpenChange={setIsCategoryDeleteDialogOpen}>
                    <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border-emerald-500/20 text-emerald-50 max-w-md rounded-3xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                                <Trash2 className="h-6 w-6 text-red-400" />
                                Delete Category?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-emerald-200/60 text-base">
                                Are you sure you want to delete this category? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 mt-6">
                            <AlertDialogCancel className="bg-white/5 border-emerald-500/20 text-emerald-100 hover:bg-white/10 hover:text-white rounded-xl h-12 px-6">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDeleteCategory}
                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border-0 rounded-xl h-12 px-6 font-bold shadow-lg shadow-red-500/20"
                            >
                                Delete Category
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
};

export default Inventory;