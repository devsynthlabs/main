import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Inventory Schema
const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    lastUpdated: { type: Date, default: Date.now },
});

const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

// ✅ POST route to add inventory item
router.post("/add", async (req, res) => {
    try {
        const { itemName, sku, quantity, price, category } = req.body;
        const newItem = new InventoryItem({
            itemName,
            sku,
            quantity,
            price,
            category
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

// ✅ GET route to fetch all inventory items
router.get("/all", async (req, res) => {
    try {
        const items = await InventoryItem.find().sort({ lastUpdated: -1 });
        res.json(items);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Error fetching inventory" });
    }
});

// ✅ DELETE route
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await InventoryItem.findByIdAndDelete(id);
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
});

export default router;