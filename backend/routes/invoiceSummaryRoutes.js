import express from "express";
import InvoiceSummary from "../models/InvoiceSummary.js";

const router = express.Router();

// ✅ 1. Create New Invoice Summary
router.post("/create", async (req, res) => {
    try {
        const { productName, quantity, rate, tax, createdbyid } = req.body;

        // Validate required fields
        if (!productName || quantity === undefined || rate === undefined || !createdbyid) {
            return res.status(400).json({
                message: "Missing required fields: productName, quantity, rate, and createdbyid are required"
            });
        }

        // Validate numeric fields
        if (quantity < 0 || rate < 0 || (tax !== undefined && tax < 0)) {
            return res.status(400).json({
                message: "Quantity, rate, and tax must be non-negative numbers"
            });
        }

        const newInvoiceSummary = new InvoiceSummary({
            productName,
            quantity,
            rate,
            tax: tax || 0,
            createdbyid
        });

        await newInvoiceSummary.save();

        res.status(201).json({
            message: "Invoice summary created successfully!",
            data: newInvoiceSummary
        });
    } catch (error) {
        console.error("Error creating invoice summary:", error);
        res.status(500).json({
            message: "Error creating invoice summary",
            error: error.message
        });
    }
});

// ✅ 2. Get All Invoice Summaries
router.get("/all", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'id',
            sortOrder = 'desc'
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const invoiceSummaries = await InvoiceSummary.find()
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await InvoiceSummary.countDocuments();

        res.json({
            invoiceSummaries,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching invoice summaries:", error);
        res.status(500).json({
            message: "Error fetching invoice summaries",
            error: error.message
        });
    }
});

// ✅ 3. Get Single Invoice Summary by ID
router.get("/:id", async (req, res) => {
    try {
        const invoiceSummary = await InvoiceSummary.findOne({
            id: parseInt(req.params.id)
        });

        if (!invoiceSummary) {
            return res.status(404).json({
                message: "Invoice summary not found"
            });
        }

        res.json(invoiceSummary);
    } catch (error) {
        console.error("Error fetching invoice summary:", error);
        res.status(500).json({
            message: "Error fetching invoice summary",
            error: error.message
        });
    }
});

// ✅ 4. Get Invoice Summaries by User ID
router.get("/user/:userId", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const invoiceSummaries = await InvoiceSummary.find({
            createdbyid: req.params.userId
        })
            .sort({ id: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await InvoiceSummary.countDocuments({
            createdbyid: req.params.userId
        });

        res.json({
            invoiceSummaries,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching user invoice summaries:", error);
        res.status(500).json({
            message: "Error fetching user invoice summaries",
            error: error.message
        });
    }
});

// ✅ 5. Update Invoice Summary
router.put("/:id", async (req, res) => {
    try {
        const { productName, quantity, rate, tax } = req.body;

        const updateData = {};
        if (productName !== undefined) updateData.productName = productName;
        if (quantity !== undefined) {
            if (quantity < 0) {
                return res.status(400).json({
                    message: "Quantity must be non-negative"
                });
            }
            updateData.quantity = quantity;
        }
        if (rate !== undefined) {
            if (rate < 0) {
                return res.status(400).json({
                    message: "Rate must be non-negative"
                });
            }
            updateData.rate = rate;
        }
        if (tax !== undefined) {
            if (tax < 0) {
                return res.status(400).json({
                    message: "Tax must be non-negative"
                });
            }
            updateData.tax = tax;
        }

        updateData.updatedAt = new Date();

        const updatedInvoiceSummary = await InvoiceSummary.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedInvoiceSummary) {
            return res.status(404).json({
                message: "Invoice summary not found"
            });
        }

        res.json({
            message: "Invoice summary updated successfully!",
            data: updatedInvoiceSummary
        });
    } catch (error) {
        console.error("Error updating invoice summary:", error);
        res.status(500).json({
            message: "Error updating invoice summary",
            error: error.message
        });
    }
});

// ✅ 6. Delete Invoice Summary
router.delete("/:id", async (req, res) => {
    try {
        const deletedInvoiceSummary = await InvoiceSummary.findOneAndDelete({
            id: parseInt(req.params.id)
        });

        if (!deletedInvoiceSummary) {
            return res.status(404).json({
                message: "Invoice summary not found"
            });
        }

        res.json({
            message: "Invoice summary deleted successfully!",
            data: deletedInvoiceSummary
        });
    } catch (error) {
        console.error("Error deleting invoice summary:", error);
        res.status(500).json({
            message: "Error deleting invoice summary",
            error: error.message
        });
    }
});

// ✅ 7. Get Invoice Summary Statistics
router.get("/stats/overview", async (req, res) => {
    try {
        const { userId } = req.query;

        const matchQuery = userId ? { createdbyid: userId } : {};

        const stats = await InvoiceSummary.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalRecords: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalValue: {
                        $sum: {
                            $multiply: ["$quantity", "$rate"]
                        }
                    },
                    totalTax: { $sum: "$tax" },
                    avgRate: { $avg: "$rate" },
                    avgQuantity: { $avg: "$quantity" }
                }
            }
        ]);

        res.json(stats[0] || {
            totalRecords: 0,
            totalQuantity: 0,
            totalValue: 0,
            totalTax: 0,
            avgRate: 0,
            avgQuantity: 0
        });
    } catch (error) {
        console.error("Error fetching invoice summary statistics:", error);
        res.status(500).json({
            message: "Error fetching invoice summary statistics",
            error: error.message
        });
    }
});

// ✅ 8. Search Invoice Summaries by Product Name
router.get("/search/:productName", async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const invoiceSummaries = await InvoiceSummary.find({
            productName: { $regex: req.params.productName, $options: 'i' }
        })
            .sort({ id: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await InvoiceSummary.countDocuments({
            productName: { $regex: req.params.productName, $options: 'i' }
        });

        res.json({
            invoiceSummaries,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("Error searching invoice summaries:", error);
        res.status(500).json({
            message: "Error searching invoice summaries",
            error: error.message
        });
    }
});

export default router;
