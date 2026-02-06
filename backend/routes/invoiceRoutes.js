import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Invoice Schema
const invoiceSchema = new mongoose.Schema({
  // Invoice Details
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },

  // Customer Details
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  customerAddress: { type: String },
  customerGSTIN: { type: String },

  // Business Details
  businessName: { type: String, required: true },
  businessEmail: { type: String, required: true },
  businessPhone: { type: String },
  businessAddress: { type: String },
  businessGSTIN: { type: String },

  // Invoice Items
  items: [{
    productName: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  }],

  // Calculations
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingCharges: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },

  // Tax Breakdown
  sgst: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },

  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'upi', 'gpay', 'netbanking', 'cheque', 'paypal', 'stripe', 'other'],
    default: 'bank_transfer'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, required: true },

  // Additional Information
  notes: { type: String },
  termsAndConditions: { type: String },
  invoiceType: {
    type: String,
    enum: ['proforma', 'tax', 'commercial', 'retail'],
    default: 'tax'
  },

  // System Fields
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  createdBy: { type: String },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// ✅ 1. Create New Invoice
router.post("/create", async (req, res) => {
  try {
    console.log("📥 Received Invoice Data:", JSON.stringify(req.body, null, 2));
    const invoiceData = req.body;

    // Generate invoice number if not provided
    if (!invoiceData.invoiceNumber) {
      const count = await Invoice.countDocuments();
      invoiceData.invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(5, '0')}`;
    }

    // Calculate balance due
    invoiceData.balanceDue = invoiceData.grandTotal - (invoiceData.amountPaid || 0);

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json({
      message: "Invoice created successfully!",
      invoice: newInvoice,
      invoiceId: newInvoice._id
    });
  } catch (error) {
    console.error("❌ Error creating invoice:", error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages
      });
    }

    // Handle duplicate invoice number
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Invoice number already exists",
        error: "Duplicate invoice number"
      });
    }

    res.status(500).json({
      message: "Error creating invoice",
      error: error.message
    });
  }
});

// ✅ 2. Get All Invoices
router.get("/all", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      customerName,
      startDate,
      endDate,
      sortBy = 'invoiceDate',
      sortOrder = 'desc'
    } = req.query;

    const query = { isDeleted: false };

    // Apply filters
    if (status) query.status = status;
    if (customerName) {
      query.customerName = { $regex: customerName, $options: 'i' };
    }
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const invoices = await Invoice.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-isDeleted'); // Exclude isDeleted field

    const total = await Invoice.countDocuments(query);

    // Calculate summary statistics
    const summary = await Invoice.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$grandTotal" },
          totalPaid: { $sum: "$amountPaid" },
          totalDue: { $sum: "$balanceDue" }
        }
      }
    ]);

    res.json({
      invoices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      summary: summary[0] || {
        totalInvoices: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0
      }
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({
      message: "Error fetching invoices",
      error: error.message
    });
  }
});

// ✅ 3. Get Single Invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      message: "Error fetching invoice",
      error: error.message
    });
  }
});

// ✅ 4. Get Invoice by Invoice Number
router.get("/number/:invoiceNumber", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      invoiceNumber: req.params.invoiceNumber,
      isDeleted: false
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      message: "Error fetching invoice",
      error: error.message
    });
  }
});

// ✅ 5. Update Invoice
router.put("/:id", async (req, res) => {
  try {
    const updateData = req.body;

    // Recalculate balance due if payment is updated
    if (updateData.amountPaid !== undefined) {
      const currentInvoice = await Invoice.findById(req.params.id);
      if (currentInvoice) {
        updateData.balanceDue = currentInvoice.grandTotal - updateData.amountPaid;

        // Update payment status based on balance
        if (updateData.balanceDue === 0) {
          updateData.paymentStatus = 'paid';
          updateData.status = 'paid';
        } else if (updateData.amountPaid > 0) {
          updateData.paymentStatus = 'partial';
        }
      }
    }

    // Set updated timestamp
    updateData.updatedAt = new Date();

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.json({
      message: "Invoice updated successfully!",
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({
      message: "Error updating invoice",
      error: error.message
    });
  }
});

// ✅ 6. Delete Invoice (Soft Delete)
router.delete("/:id", async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
        status: 'cancelled',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!deletedInvoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.json({
      message: "Invoice deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({
      message: "Error deleting invoice",
      error: error.message
    });
  }
});

// ✅ 7. Update Invoice Status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.json({
      message: "Invoice status updated successfully!",
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({
      message: "Error updating invoice status",
      error: error.message
    });
  }
});

// ✅ 8. Update Payment Status
router.patch("/:id/payment", async (req, res) => {
  try {
    const { paymentStatus, amountPaid, paymentMethod, paymentDate } = req.body;

    const validPaymentStatuses = ['pending', 'partial', 'paid', 'overdue', 'cancelled'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status"
      });
    }

    const updateData = {
      paymentStatus,
      updatedAt: new Date()
    };

    if (amountPaid !== undefined) updateData.amountPaid = amountPaid;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (paymentDate) updateData.paymentDate = paymentDate;

    // Recalculate balance due
    if (amountPaid !== undefined) {
      const currentInvoice = await Invoice.findById(req.params.id);
      if (currentInvoice) {
        updateData.balanceDue = currentInvoice.grandTotal - amountPaid;
      }
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    res.json({
      message: "Payment status updated successfully!",
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      message: "Error updating payment status",
      error: error.message
    });
  }
});

// ✅ 9. Search Invoices
router.get("/search", async (req, res) => {
  try {
    const {
      query,
      field = 'all',
      page = 1,
      limit = 20
    } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    const searchQuery = { isDeleted: false };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search based on field
    if (field === 'all' || field === 'customer') {
      searchQuery.$or = [
        { customerName: { $regex: query, $options: 'i' } },
        { customerEmail: { $regex: query, $options: 'i' } },
        { customerPhone: { $regex: query, $options: 'i' } }
      ];
    } else if (field === 'invoice') {
      searchQuery.invoiceNumber = { $regex: query, $options: 'i' };
    } else if (field === 'product') {
      searchQuery['items.productName'] = { $regex: query, $options: 'i' };
    }

    const invoices = await Invoice.find(searchQuery)
      .sort({ invoiceDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(searchQuery);

    res.json({
      invoices,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error searching invoices:", error);
    res.status(500).json({
      message: "Error searching invoices",
      error: error.message
    });
  }
});

// ✅ 10. Get Invoice Statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchQuery = { isDeleted: false };

    // Add date filter if provided
    if (startDate || endDate) {
      matchQuery.invoiceDate = {};
      if (startDate) matchQuery.invoiceDate.$gte = new Date(startDate);
      if (endDate) matchQuery.invoiceDate.$lte = new Date(endDate);
    }

    // Get current month's start and end dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get previous month's start and end dates
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Aggregate statistics
    const stats = await Invoice.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          // Overall statistics
          overall: [
            {
              $group: {
                _id: null,
                totalInvoices: { $sum: 1 },
                totalAmount: { $sum: "$grandTotal" },
                totalPaid: { $sum: "$amountPaid" },
                totalDue: { $sum: "$balanceDue" },
                avgInvoiceAmount: { $avg: "$grandTotal" }
              }
            }
          ],

          // Status distribution
          statusDistribution: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$grandTotal" }
              }
            }
          ],

          // Payment status distribution
          paymentDistribution: [
            {
              $group: {
                _id: "$paymentStatus",
                count: { $sum: 1 },
                totalAmount: { $sum: "$grandTotal" }
              }
            }
          ],

          // Current month statistics
          currentMonth: [
            {
              $match: {
                invoiceDate: {
                  $gte: currentMonthStart,
                  $lte: currentMonthEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalAmount: { $sum: "$grandTotal" }
              }
            }
          ],

          // Previous month statistics
          previousMonth: [
            {
              $match: {
                invoiceDate: {
                  $gte: prevMonthStart,
                  $lte: prevMonthEnd
                }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                totalAmount: { $sum: "$grandTotal" }
              }
            }
          ],

          // Top customers
          topCustomers: [
            {
              $group: {
                _id: "$customerName",
                invoiceCount: { $sum: 1 },
                totalSpent: { $sum: "$grandTotal" }
              }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    // Format response
    const result = {
      overall: stats[0]?.overall[0] || {},
      statusDistribution: stats[0]?.statusDistribution || [],
      paymentDistribution: stats[0]?.paymentDistribution || [],
      currentMonth: stats[0]?.currentMonth[0] || { count: 0, totalAmount: 0 },
      previousMonth: stats[0]?.previousMonth[0] || { count: 0, totalAmount: 0 },
      topCustomers: stats[0]?.topCustomers || []
    };

    // Calculate month-over-month growth
    const currentMonthTotal = result.currentMonth.totalAmount || 0;
    const previousMonthTotal = result.previousMonth.totalAmount || 0;
    const growthRate = previousMonthTotal > 0
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(2)
      : 0;

    result.monthlyGrowth = {
      currentMonthTotal,
      previousMonthTotal,
      growthRate: parseFloat(growthRate),
      isPositive: currentMonthTotal > previousMonthTotal
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching invoice statistics:", error);
    res.status(500).json({
      message: "Error fetching invoice statistics",
      error: error.message
    });
  }
});

// ✅ 11. Generate Invoice Report
router.get("/reports/generate", async (req, res) => {
  try {
    const {
      format = 'json',
      startDate,
      endDate,
      status,
      paymentStatus
    } = req.query;

    const query = { isDeleted: false };

    // Apply filters
    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const invoices = await Invoice.find(query)
      .sort({ invoiceDate: -1 })
      .select('-isDeleted -__v');

    // Generate report based on format
    if (format === 'csv') {
      // Convert to CSV
      let csvContent = "Invoice Number,Date,Customer,Total Amount,Amount Paid,Balance Due,Status,Payment Status\n";

      invoices.forEach(invoice => {
        csvContent += `"${invoice.invoiceNumber}","${invoice.invoiceDate.toISOString().split('T')[0]}","${invoice.customerName}",${invoice.grandTotal},${invoice.amountPaid},${invoice.balanceDue},"${invoice.status}","${invoice.paymentStatus}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=invoice_report_${Date.now()}.csv`);
      return res.send(csvContent);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=invoice_report_${Date.now()}.json`);
      return res.json(invoices);
    } else {
      // Default JSON response
      res.json({
        reportGenerated: new Date(),
        totalRecords: invoices.length,
        filters: {
          startDate,
          endDate,
          status,
          paymentStatus
        },
        data: invoices
      });
    }
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      message: "Error generating report",
      error: error.message
    });
  }
});

// ✅ 12. Get Overdue Invoices
router.get("/overdue", async (req, res) => {
  try {
    const today = new Date();

    const overdueInvoices = await Invoice.find({
      isDeleted: false,
      paymentStatus: { $ne: 'paid' },
      dueDate: { $lt: today },
      balanceDue: { $gt: 0 }
    })
      .sort({ dueDate: 1 })
      .limit(50);

    // Calculate total overdue amount
    const totalOverdue = overdueInvoices.reduce((sum, invoice) => sum + invoice.balanceDue, 0);

    res.json({
      totalOverdueInvoices: overdueInvoices.length,
      totalOverdueAmount: totalOverdue,
      overdueInvoices
    });
  } catch (error) {
    console.error("Error fetching overdue invoices:", error);
    res.status(500).json({
      message: "Error fetching overdue invoices",
      error: error.message
    });
  }
});

// ✅ 13. Bulk Update Invoices
router.post("/bulk/update", async (req, res) => {
  try {
    const { invoiceIds, updateData } = req.body;

    if (!invoiceIds || !Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({
        message: "Invoice IDs array is required"
      });
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    const result = await Invoice.updateMany(
      { _id: { $in: invoiceIds }, isDeleted: false },
      updateData
    );

    res.json({
      message: `${result.modifiedCount} invoices updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error bulk updating invoices:", error);
    res.status(500).json({
      message: "Error bulk updating invoices",
      error: error.message
    });
  }
});

export default router;