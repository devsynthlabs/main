import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Inventory Schema
const inventorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    itemName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    sgst: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
});

const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

import jwt from "jsonwebtoken";
import Sale from "../models/Sale.js";
import Category from "../models/Category.js";

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

// ✅ POST route to add inventory item
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { itemName, sku, quantity, price, category, sgst, cgst, igst } = req.body;
        const newItem = new InventoryItem({
            userId: req.user.id,
            itemName,
            sku,
            quantity,
            price,
            category,
            sgst: Number(sgst) || 0,
            cgst: Number(cgst) || 0,
            igst: Number(igst) || 0
        });
        await newItem.save();
        res.status(201).json({
            message: "Item added successfully!",
            item: newItem
        });
    } catch (error) {
        console.error("Error adding inventory item:", error);
        res.status(500).json({ message: "Error adding item", error });
    }
});

// ✅ GET route to fetch all inventory items (User Specific)
router.get("/all", verifyToken, async (req, res) => {
    try {
        const items = await InventoryItem.find({ userId: req.user.id }).sort({ lastUpdated: -1 });
        res.json(items);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Error fetching inventory" });
    }
});

// ✅ POST route to sell item (Decrement stock & Record Sale)
router.post("/sell/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { quantitySold, gstRate = 18 } = req.body; // Default GST 18% if not provided

        const item = await InventoryItem.findOne({ _id: id, userId: req.user.id });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.quantity < quantitySold) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Financial Calculations using Item's stored taxes
        const subtotal = item.price * quantitySold;

        const sgstAmount = (subtotal * (item.sgst || 0)) / 100;
        const cgstAmount = (subtotal * (item.cgst || 0)) / 100;
        const igstAmount = (subtotal * (item.igst || 0)) / 100;

        const totalGstAmount = sgstAmount + cgstAmount + igstAmount;
        const totalGstRate = (item.sgst || 0) + (item.cgst || 0) + (item.igst || 0);

        const grandTotal = subtotal + totalGstAmount;

        // Create Sale Record with breakdown
        const newSale = new Sale({
            userId: req.user.id,
            inventoryItemId: item._id,
            itemName: item.itemName,
            sku: item.sku,
            quantitySold,
            unitPrice: item.price,
            subtotal,
            sgstRate: item.sgst || 0,
            cgstRate: item.cgst || 0,
            igstRate: item.igst || 0,
            sgstAmount,
            cgstAmount,
            igstAmount,
            gstRate: totalGstRate,
            gstAmount: totalGstAmount,
            grandTotal
        });

        // Update Inventory
        item.quantity -= quantitySold;
        item.lastUpdated = Date.now();

        await Promise.all([item.save(), newSale.save()]);

        res.json({
            message: "Item sold successfully",
            item,
            sale: newSale
        });
    } catch (error) {
        console.error("Error selling item:", error);
        res.status(500).json({ message: "Error selling item", error });
    }
});

// ✅ GET route to fetch sales history
router.get("/sales", verifyToken, async (req, res) => {
    try {
        const sales = await Sale.find({ userId: req.user.id }).sort({ saleDate: -1 });
        res.json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: "Error fetching sales history" });
    }
});

// ✅ DELETE route
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await InventoryItem.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found or unauthorized" });
        }

        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
});

// ✅ GET route to fetch all categories for the user
router.get("/categories", verifyToken, async (req, res) => {
    try {
        const customCategories = await Category.find({ userId: req.user.id, type: "inventory" });
        res.json({ categories: customCategories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories" });
    }
});

// ✅ POST route to add a new category
router.post("/categories", verifyToken, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const newCategory = new Category({
            userId: req.user.id,
            name,
            type: "inventory"
        });

        await newCategory.save();
        res.status(201).json({
            message: "Category added successfully",
            category: newCategory
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category name already exists" });
        }
        console.error("Error adding category:", error);
        res.status(500).json({ message: "Error adding category" });
    }
});

// ✅ DELETE route to remove a category
router.delete("/categories/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findOneAndDelete({ _id: id, userId: req.user.id, type: "inventory" });

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found or unauthorized" });
        }

        res.json({ message: "Category deleted successfully", deletedCategory });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Error deleting category" });
    }
});

export default router;