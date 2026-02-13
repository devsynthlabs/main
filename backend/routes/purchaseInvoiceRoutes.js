import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();

// Purchase Invoice Schema
const purchaseInvoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    supplierName: { type: String, required: true },
    phone: { type: String, default: "" },
    gstin: { type: String, default: "" },
    billNo: { type: String, required: true },
    billDate: { type: String, required: true },
    stateOfSupply: { type: String, required: true },
    businessState: { type: String, default: "Tamil Nadu" },
    items: [{
        itemName: { type: String, required: true },
        itemCode: { type: String, default: "" },
        hsnCode: { type: String, default: "" },
        quantity: { type: Number, required: true },
        unit: { type: String, default: "Pcs" },
        pricePerUnit: { type: Number, required: true },
        priceWithTax: { type: Boolean, default: false },
        discountPercent: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        taxPercent: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        sgstRate: { type: Number, default: 0 },
        sgstAmount: { type: Number, default: 0 },
        cgstRate: { type: Number, default: 0 },
        cgstAmount: { type: Number, default: 0 },
        igstRate: { type: Number, default: 0 },
        igstAmount: { type: Number, default: 0 },
        isInterState: { type: Boolean, default: false },
        amount: { type: Number, required: true },
    }],
    subtotal: { type: Number, default: 0 },
    totalSgst: { type: Number, default: 0 },
    totalCgst: { type: Number, default: 0 },
    totalIgst: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const PurchaseInvoice = mongoose.model("PurchaseInvoice", purchaseInvoiceSchema);

// Get the InventoryItem model (already registered by inventoryRoutes)
const getInventoryModel = () => mongoose.model("InventoryItem");

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// GET - Public (no auth) purchase invoice by ID
router.get("/public/:id", async (req, res) => {
    try {
        const invoice = await PurchaseInvoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: "Purchase invoice not found" });
        }
        res.json(invoice);
    } catch (error) {
        console.error("Error fetching public purchase invoice:", error);
        res.status(500).json({ message: "Error fetching purchase invoice" });
    }
});

// POST - Create purchase invoice & add items to inventory stock
router.post("/create", verifyToken, async (req, res) => {
    try {
        const invoiceData = req.body;

        const newInvoice = new PurchaseInvoice({
            userId: req.user.id,
            ...invoiceData,
        });
        await newInvoice.save();

        // Add purchased items to inventory stock
        const InventoryItem = getInventoryModel();
        const stockResults = [];

        for (const item of invoiceData.items) {
            const sku = item.itemCode || `PUR-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

            // Check if item with same SKU already exists for this user
            const existingItem = await InventoryItem.findOne({
                userId: req.user.id,
                sku: sku,
            });

            if (existingItem) {
                // Update quantity of existing item
                existingItem.quantity += item.quantity;
                existingItem.price = item.pricePerUnit;
                existingItem.lastUpdated = Date.now();
                await existingItem.save();
                stockResults.push({ itemName: item.itemName, action: "updated", quantity: existingItem.quantity });
            } else {
                // Create new inventory item
                const newStockItem = new InventoryItem({
                    userId: req.user.id,
                    itemName: item.itemName,
                    sku: sku,
                    quantity: item.quantity,
                    price: item.pricePerUnit,
                    category: "General",
                    gstRate: item.taxPercent || 0,
                    sgst: item.isInterState ? 0 : (item.taxPercent || 0) / 2,
                    cgst: item.isInterState ? 0 : (item.taxPercent || 0) / 2,
                    igst: item.isInterState ? (item.taxPercent || 0) : 0,
                    stateOfSupply: invoiceData.stateOfSupply || "",
                });
                await newStockItem.save();
                stockResults.push({ itemName: item.itemName, action: "created", quantity: item.quantity });
            }
        }

        res.status(201).json({
            message: "Purchase invoice saved & items added to stock!",
            invoice: newInvoice,
            stockUpdates: stockResults,
        });
    } catch (error) {
        console.error("Error creating purchase invoice:", error);
        res.status(500).json({ message: "Error saving purchase invoice", error: error.message });
    }
});

// GET - All purchase invoices for authenticated user
router.get("/all", verifyToken, async (req, res) => {
    try {
        const invoices = await PurchaseInvoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ invoices });
    } catch (error) {
        console.error("Error fetching purchase invoices:", error);
        res.status(500).json({ message: "Error fetching purchase invoices" });
    }
});

// GET - Single purchase invoice by ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const invoice = await PurchaseInvoice.findOne({ _id: req.params.id, userId: req.user.id });
        if (!invoice) {
            return res.status(404).json({ message: "Purchase invoice not found" });
        }
        res.json(invoice);
    } catch (error) {
        console.error("Error fetching purchase invoice:", error);
        res.status(500).json({ message: "Error fetching purchase invoice" });
    }
});

// DELETE - Delete purchase invoice
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deleted = await PurchaseInvoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deleted) {
            return res.status(404).json({ message: "Purchase invoice not found" });
        }
        res.json({ message: "Purchase invoice deleted" });
    } catch (error) {
        console.error("Error deleting purchase invoice:", error);
        res.status(500).json({ message: "Error deleting purchase invoice" });
    }
});

export default router;
