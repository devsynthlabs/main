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
import { ArrowLeft, Plus, Trash2, Package, Search, Archive, ShoppingCart, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface InventoryItem {
    _id?: string;
    itemName: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
    lastUpdated?: Date;
}

interface SaleItem {
    _id: string;
    itemName: string;
    sku: string;
    quantitySold: number;
    unitPrice: number;
    subtotal: number;
    gstRate: number;
    gstAmount: number;
    grandTotal: number;
    saleDate: Date;
}

const Inventory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("items");
    const [activeSubTab, setActiveSubTab] = useState<"instock" | "sold">("instock");

    const [items, setItems] = useState<InventoryItem[]>([]);
    const [sales, setSales] = useState<SaleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Sell Dialog State
    const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [sellQuantity, setSellQuantity] = useState("1");
    const [gstRate, setGstRate] = useState("18");
    const [isSelling, setIsSelling] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        itemName: "",
        sku: "",
        quantity: "",
        price: "",
        category: "General"
    });

    // Fetch Items
    useEffect(() => {
        if (activeTab === "items") {
            if (activeSubTab === "instock") {
                fetchItems();
            } else {
                fetchSales();
            }
        }
    }, [activeTab, activeSubTab]);

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
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    const fetchSales = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/sales`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSales(data);
            }
        } catch (error) {
            console.error("Error fetching sales:", error);
            toast.error("Failed to load sales history");
        } finally {
            setLoading(false);
        }
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
                    quantity: "",
                    price: "",
                    category: "General"
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

    const deleteItem = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE_URL}/inventory/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                setItems(prev => prev.filter(item => item._id !== id));
                toast.success("Item deleted");
            } else {
                toast.error("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Error deleting item");
        }
    };

    const handleSellClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setSellQuantity("1");
        setGstRate("18"); // Default GST
        setIsSellDialogOpen(true);
    };

    const submitSell = async () => {
        if (!selectedItem || !sellQuantity) return;

        const qty = parseInt(sellQuantity);
        const gst = parseFloat(gstRate) || 0;

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
                    gstRate: gst
                })
            });

            if (res.ok) {
                toast.success(`Sold ${qty} units of ${selectedItem.itemName}`);
                setIsSellDialogOpen(false);
                fetchItems(); // Refresh items
                // Optionally switch to sales tab or fetch sales
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-purple-950 text-white overflow-hidden relative">
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
                    <TabsList className="grid w-full grid-cols-2 backdrop-blur-2xl bg-white/10 border border-violet-400/20 rounded-2xl p-1">
                        <TabsTrigger value="items" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-xl">
                            <Archive className="h-4 w-4 mr-2" /> Items
                        </TabsTrigger>
                        <TabsTrigger value="add" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-xl">
                            <Plus className="h-4 w-4 mr-2" /> Add Item
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
                                                        <p className="text-violet-300/60 text-sm">SKU: {item.sku}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-violet-100 font-bold text-lg">₹{item.price}</p>
                                                            <p className="text-violet-300/60 text-sm">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={() => handleSellClick(item)}
                                                                className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30"
                                                            >
                                                                <ShoppingCart className="h-4 w-4 mr-2" /> Sell
                                                            </Button>
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
                                                        <p className="text-violet-300/60 text-xs uppercase">GST ({sale.gstRate}%)</p>
                                                        <p className="text-violet-100 font-medium">₹{sale.gstAmount.toFixed(2)}</p>
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
                                            <div className="grid grid-cols-2 gap-4">
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
                                                    <p className="text-xs text-violet-400">Stock: {selectedItem?.quantity}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>GST Rate (%)</Label>
                                                    <Input
                                                        type="number"
                                                        value={gstRate}
                                                        onChange={(e) => setGstRate(e.target.value)}
                                                        className="bg-white/5 border-violet-400/30 text-white"
                                                        placeholder="18"
                                                    />
                                                </div>
                                            </div>

                                            {/* Preview Calculation */}
                                            <div className="bg-white/5 p-4 rounded-lg space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-violet-300">Subtotal ({sellQuantity} x ₹{selectedItem?.price})</span>
                                                    <span>₹{((parseInt(sellQuantity) || 0) * (selectedItem?.price || 0)).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-violet-300">GST ({gstRate}%)</span>
                                                    <span>₹{(((parseInt(sellQuantity) || 0) * (selectedItem?.price || 0) * (parseFloat(gstRate) || 0)) / 100).toFixed(2)}</span>
                                                </div>
                                                <div className="border-t border-violet-400/20 pt-2 flex justify-between font-bold text-emerald-400">
                                                    <span>Grand Total</span>
                                                    <span>₹{((parseInt(sellQuantity) || 0) * (selectedItem?.price || 0) * (1 + (parseFloat(gstRate) || 0) / 100)).toFixed(2)}</span>
                                                </div>
                                            </div>
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
                                        <Label className="text-violet-100">Category</Label>
                                        <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                                            <SelectTrigger className="bg-white/5 border-violet-400/30 text-violet-100">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Electronics">Electronics</SelectItem>
                                                <SelectItem value="Furniture">Furniture</SelectItem>
                                                <SelectItem value="Stationery">Stationery</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                <Button onClick={addItem} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold h-12 rounded-xl mt-4">
                                    Add Item
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Inventory;