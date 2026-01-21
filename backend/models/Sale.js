import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inventoryItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryItem",
        required: true,
    },
    itemName: { type: String, required: true },
    sku: { type: String, required: true },
    quantitySold: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }, // quantity * unitPrice
    gstRate: { type: Number, required: true, default: 18 }, // Percentage
    gstAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
