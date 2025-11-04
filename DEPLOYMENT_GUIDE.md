# 🚀 Production Deployment Guide

## 📋 Environment Configuration

### Development Mode (Current)
- **Frontend:** `VITE_DEV_MODE=true` → Uses `http://localhost:5000/api`
- **Backend:** `DEV_MODE=true` → Uses local MongoDB + bypasses payment

### Production Mode
- **Frontend:** `VITE_DEV_MODE=false` → Uses `https://software.saaiss.in/api`
- **Backend:** `DEV_MODE=false` → Uses cloud MongoDB + real Razorpay payment

## 🔧 Switching to Production

### 1. Frontend Configuration
```bash
# Update .env file
VITE_DEV_MODE=false
```

Or use the production environment file:
```bash
# Copy .env.production to .env for production build
cp .env.production .env
```

### 2. Backend Configuration
```bash
# Update backend/.env file
DEV_MODE=false
```

Or use the production environment file:
```bash
# Copy backend/.env.production to backend/.env for production
cp backend/.env.production backend/.env
```

### 3. Build and Deploy

#### Frontend Build
```bash
npm run build
```

#### Backend Deployment
```bash
cd backend
node server.js
```

## 🔒 Security Features

### Production Backend Includes:
- ✅ HTTPS-only CORS configuration
- ✅ Security headers (HSTS, XSS Protection, etc.)
- ✅ Cloud MongoDB connection
- ✅ Real Razorpay payment processing

### API Endpoints:
- **Development:** `http://localhost:5000/api`
- **Production:** `https://software.saaiss.in/api`

## 🧪 Testing Configuration

### Check Current Mode:
The console will show:
```
🔧 API Configuration: {
  isDevelopment: false,
  apiUrl: 'https://software.saaiss.in/api',
  environment: 'Production'
}
```

### Verify Payment Flow:
- **Development:** No payment required, instant signup
- **Production:** Requires ₹1000 payment via Razorpay

## 🚨 Important Notes

1. **HTTPS Required:** Production API must use HTTPS to avoid mixed content errors
2. **CORS Configuration:** Backend automatically configures CORS for production domains
3. **Environment Variables:** All API calls now use centralized configuration
4. **Database:** Production uses cloud MongoDB, development uses local MongoDB with cloud fallback

## 📁 File Structure
```
├── .env                    # Development environment
├── .env.production         # Production environment template
├── backend/
│   ├── .env               # Development backend config
│   ├── .env.production    # Production backend config
│   └── server.js          # Auto-detects environment
└── src/
    └── lib/
        └── api.ts         # Centralized API configuration
```