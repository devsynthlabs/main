import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import payrollRoutes from "./routes/payrollRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";
import balanceSheetRoutes from "./routes/balanceSheetRoutes.js";
import profitLossRoutes from "./routes/profitLossRoutes.js";
import cashflowRoutes from "./routes/cashflowRoutes.js";
import financialRatiosRoutes from "./routes/financialRatiosRoutes.js";
import cashFlowStatementRoutes from "./routes/cashFlowStatementRoutes.js";
import civilRoutes from "./routes/civilRoutes.js";
import bookkeepingRoutes from "./routes/bookkeepingRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import bankReconciliationRoutes from "./routes/bankReconciliationRoutes.js";
import fraudDetectionRoutes from "./routes/fraudDetectionRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import invoiceSummaryRoutes from "./routes/invoiceSummaryRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import purchaseInvoiceRoutes from "./routes/purchaseInvoiceRoutes.js";
import scannedDocRoutes from "./routes/scannedDocRoutes.js";
import civilEngineeringRoutes from "./routes/civilEngineeringRoutes.js";

dotenv.config();
const app = express();

// ✅ Razorpay Configuration
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️  Razorpay keys not configured. Payment features will not work.");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Middleware
// Increase payload limit for image/PDF uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration for production
const corsOptions = {
  origin: process.env.DEV_MODE === 'true'
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000']
    : ['https://software.saaiss.in', 'https://www.software.saaiss.in'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Security headers for production
if (process.env.DEV_MODE !== 'true') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

// ✅ MongoDB Connection - Dynamic based on DEV_MODE with fallback
const isDevelopment = process.env.DEV_MODE === 'true';
let mongoUri = isDevelopment ? process.env.DEV_MONGO_URI : process.env.PRO_MONGO_URI;

console.log(`🔧 Environment: ${isDevelopment ? 'Development' : 'Production'}`);
console.log(`🔧 Primary MongoDB: ${isDevelopment ? 'Local Database' : 'Cloud Database'}`);

// Connect to MongoDB with fallback mechanism
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📍 Database: ${isDevelopment ? 'localhost:27017' : 'Cloud Atlas'}`);
  } catch (err) {
    console.error("❌ Primary MongoDB Connection Failed:", err.message);

    if (isDevelopment) {
      console.log("🔄 Falling back to Cloud Database...");
      try {
        await mongoose.connect(process.env.PRO_MONGO_URI);
        console.log("✅ MongoDB Connected Successfully (Fallback to Cloud)");
        console.log("📍 Database: Cloud Atlas (Fallback)");
      } catch (fallbackErr) {
        console.error("❌ Fallback MongoDB Connection Failed:", fallbackErr.message);
        console.error("💡 Please ensure MongoDB is running locally or check your internet connection");
        throw fallbackErr; // Throw error to prevent server from starting without DB
      }
    } else {
      console.error("❌ Production MongoDB Connection Failed");
      console.error("💡 Please check your cloud database configuration");
      throw err; // Throw error to prevent server from starting without DB
    }
  }
};

// Don't call it here - we'll call it before starting the server
// connectToMongoDB();

// ✅ User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  subscriptionStatus: { type: String, enum: ["pending", "active"], default: "pending" },
  subscriptionPlan: { type: String, enum: ["trial", "monthly", "annual", "lifetime"], default: "monthly" },
  subscriptionAmount: { type: Number },
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
  trialEndDate: { type: Date },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ✅ REGISTER (Sign Up)
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Email already exists" });

    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ START FREE TRIAL
app.post("/api/signup-trial", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const subscriptionStartDate = new Date();
    const trialEndDate = new Date(subscriptionStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name: name || email.split("@")[0],
      password: hashedPassword,
      subscriptionStatus: "active",
      subscriptionPlan: "trial",
      subscriptionAmount: 0,
      subscriptionStartDate,
      subscriptionEndDate: trialEndDate,
      trialEndDate,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Free trial started successfully",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        subscriptionStatus: newUser.subscriptionStatus,
        subscriptionPlan: newUser.subscriptionPlan,
        subscriptionAmount: newUser.subscriptionAmount,
        subscriptionStartDate: newUser.subscriptionStartDate,
        subscriptionEndDate: newUser.subscriptionEndDate,
        trialEndDate: newUser.trialEndDate,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error("Trial Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ LOGIN (Sign In)
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionAmount: user.subscriptionAmount,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        trialEndDate: user.trialEndDate,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Middleware to verify JWT token
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

// ✅ GET USER INFO (Protected Route)
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      name: user.name,
      id: user._id,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionAmount: user.subscriptionAmount,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      trialEndDate: user.trialEndDate,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ UPDATE USER PROFILE (Protected Route)
app.put("/api/user", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const duplicateUser = await User.findOne({
      email: trimmedEmail,
      _id: { $ne: req.user.id },
    });

    if (duplicateUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name?.trim() || trimmedEmail.split("@")[0],
        email: trimmedEmail,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionAmount: user.subscriptionAmount,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        trialEndDate: user.trialEndDate,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error("Update User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Subscription Plans Configuration (matching frontend)
const subscriptionPlans = {
  monthly: {
    id: "monthly",
    name: "Monthly Subscription",
    price: 1500,
    gst: 270,
    totalAmount: 1770,
    duration: "month"
  },
  annual: {
    id: "annual",
    name: "Annual Subscription",
    price: 16200,
    gst: 2916,
    totalAmount: 19116,
    duration: "year"
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime Access",
    price: 45000,
    gst: 8100,
    totalAmount: 53100,
    duration: "lifetime"
  }
};

// ✅ CREATE RAZORPAY ORDER
app.post("/api/create-order", async (req, res) => {
  try {
    const { email, plan = "monthly" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate plan
    if (!subscriptionPlans[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const selectedPlan = subscriptionPlans[plan];

    if (process.env.DEV_MODE === "true") {
      return res.json({
        orderId: `dev_order_${Date.now()}`,
        amount: selectedPlan.totalAmount * 100, // Convert to paise for consistency
        currency: "INR",
        key: "rzp_test_dev_mode",
        devMode: true,
        plan: plan,
        planDetails: selectedPlan
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_ID === "rzp_test_1234567890") {
      return res.status(500).json({
        message: "Payment system not configured. Please contact administrator."
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInPaise = selectedPlan.totalAmount * 100;

    console.log(`💰 Creating Razorpay order for ${plan} plan:`);
    console.log(`   Base Price: ₹${selectedPlan.price}`);
    console.log(`   GST: ₹${selectedPlan.gst}`);
    console.log(`   Total: ₹${selectedPlan.totalAmount}`);
    console.log(`   Amount in Paise: ${amountInPaise}`);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${plan}_${Date.now()}`,
      notes: {
        email: email,
        purpose: "subscription",
        plan: plan,
        planName: selectedPlan.name,
        basePrice: selectedPlan.price,
        gst: selectedPlan.gst,
        totalAmount: selectedPlan.totalAmount
      }
    };

    const order = await razorpay.orders.create(options);

    console.log(`✅ Razorpay order created: ${order.id} for ₹${order.amount / 100}`);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      plan: plan,
      planDetails: selectedPlan
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    if (error.statusCode === 401) {
      res.status(500).json({
        message: "Payment system authentication failed. Please contact administrator."
      });
    } else {
      res.status(500).json({
        message: "Failed to create payment order. Please try again."
      });
    }
  }
});

// ✅ VERIFY PAYMENT AND COMPLETE SIGNUP
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      password,
      plan = "monthly",
      name
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate plan
    if (!subscriptionPlans[plan]) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const selectedPlan = subscriptionPlans[plan];

    // Calculate subscription dates
    const subscriptionStartDate = new Date();
    let subscriptionEndDate = null;

    if (plan === "monthly") {
      subscriptionEndDate = new Date(subscriptionStartDate);
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else if (plan === "annual") {
      subscriptionEndDate = new Date(subscriptionStartDate);
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }
    // Lifetime plan has no end date (null)

    if (process.env.DEV_MODE === "true" || razorpay_order_id?.startsWith("dev_order_")) {
      console.log("🔧 Development mode: Bypassing payment verification");

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionAmount: selectedPlan.totalAmount,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        razorpayPaymentId: "dev_payment_" + Date.now(),
        razorpayOrderId: razorpay_order_id || "dev_order_" + Date.now()
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.status(201).json({
        message: "Development mode: User registered successfully",
        token,
        subscriptionStatus: "active",
        subscriptionPlan: plan,
        subscriptionEndDate: subscriptionEndDate
      });
    }

    if (!razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ message: "Payment details are required" });
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      subscriptionStatus: "active",
      subscriptionPlan: plan,
      subscriptionAmount: selectedPlan.totalAmount,
      subscriptionStartDate: subscriptionStartDate,
      subscriptionEndDate: subscriptionEndDate,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "Payment verified and user registered successfully",
      token,
      subscriptionStatus: "active",
      subscriptionPlan: plan,
      subscriptionEndDate: subscriptionEndDate
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// ✅ Use Routes
app.use("/api/payroll", payrollRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/balance", balanceSheetRoutes);
app.use("/api/profitloss", profitLossRoutes);
app.use("/api/cashflow", cashflowRoutes);
app.use("/api/financial-ratios", financialRatiosRoutes);
app.use("/api/cashflow-statement", cashFlowStatementRoutes);
app.use("/api/civil", civilRoutes);
app.use("/api/bookkeeping", bookkeepingRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/bank-reconciliation", bankReconciliationRoutes);
app.use("/api/fraud-detection", fraudDetectionRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/invoice-summary", invoiceSummaryRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/purchase-invoice", purchaseInvoiceRoutes);
app.use("/api/scanned-docs", scannedDocRoutes);
app.use("/api/civil-engineering", civilEngineeringRoutes);

// ✅ Start Server (after MongoDB connection)
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectToMongoDB();

    // Then start the server
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log(`🌐 Local access: http://localhost:${PORT}`);
      console.log(`📡 Network access: http://192.168.29.49:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
