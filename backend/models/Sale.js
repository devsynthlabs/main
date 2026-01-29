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
    sgstRate: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    gstRate: { type: Number, required: true, default: 18 }, // Total GST percentage
    gstAmount: { type: Number, required: true }, // Total GST amount
    grandTotal: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
