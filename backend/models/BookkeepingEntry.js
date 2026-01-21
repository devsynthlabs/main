import mongoose from "mongoose";

const bookkeepingEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const BookkeepingEntry = mongoose.model("BookkeepingEntry", bookkeepingEntrySchema);

export default BookkeepingEntry;
