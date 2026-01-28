import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense", "all"],
        default: "all",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevention of duplicate category names for the same user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
