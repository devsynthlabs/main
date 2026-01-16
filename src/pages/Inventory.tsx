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
import { ArrowLeft, Plus, Trash2, Package, Search, BarChart3, Archive } from "lucide-react";
import { VoiceButton } from "@/components/ui/VoiceButton";

interface InventoryItem {
    _id?: string;
    itemName: string;
    sku: string;
    quantity: number;
    price: number;
    category: string;
    lastUpdated?: Date;
}

const Inventory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("items");
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/inventory/all');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addItem = async () => {
        if (!formData.itemName || !formData.sku || !formData.quantity || !formData.price) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/inventory/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    quantity: Number(formData.quantity),
                    price: Number(formData.price)
                })
            });

            if (res.ok) {
                alert("Item added successfully!");
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
                alert("Failed to add item");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Error adding item");
        }
    };

    const deleteItem = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setItems(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-purple-950 text-white overflow-hidden relative">
            <style>{`
                * { cursor: default !important; }
                button, input, select, [role="button"] { cursor: pointer !important; }
            `}</style>

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
                        <Card className="backdrop-blur-2xl bg-white/10 border border-violet-400/20 rounded-3xl">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-violet-100">Inventory Items</CardTitle>
                                        <CardDescription className="text-violet-300/70">{items.length} total items in stock</CardDescription>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-300" />
                                        <Input
                                            placeholder="Search items..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 bg-white/5 border-violet-400/30 text-violet-100 placeholder:text-violet-300/40 w-64"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {loading ? (
                                        <p className="text-center text-violet-300">Loading inventory...</p>
                                    ) : filteredItems.length > 0 ? (
                                        filteredItems.map((item) => (
                                            <div key={item._id} className="p-4 backdrop-blur-xl bg-white/5 border border-violet-400/10 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center">
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
                                                    <Button variant="ghost" size="sm" onClick={() => deleteItem(item._id!)} className="text-red-300 hover:text-red-100 hover:bg-red-500/20">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-violet-300/60">No items found matching your search.</div>
                                    )}
                                </div>
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
                                    <Input
                                        value={formData.itemName}
                                        onChange={(e) => handleInputChange("itemName", e.target.value)}
                                        className="bg-white/5 border-violet-400/30 text-violet-100"
                                        placeholder="e.g. Office Chair"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">SKU</Label>
                                        <Input
                                            value={formData.sku}
                                            onChange={(e) => handleInputChange("sku", e.target.value)}
                                            className="bg-white/5 border-violet-400/30 text-violet-100"
                                            placeholder="e.g. FURN-001"
                                        />
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
                                        <Input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => handleInputChange("price", e.target.value)}
                                            className="bg-white/5 border-violet-400/30 text-violet-100"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-violet-100">Quantity</Label>
                                        <Input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                                            className="bg-white/5 border-violet-400/30 text-violet-100"
                                            placeholder="0"
                                        />
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