// API Configuration utility
const isDevelopment = import.meta.env.VITE_DEV_MODE === 'true';

// Get the appropriate API URL based on environment
export const getApiUrl = (): string => {
  if (isDevelopment) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  }
  return import.meta.env.VITE_PROD_API_URL || 'https://software.saaiss.in/api';
};

// Base API URL
export const API_BASE_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/signup`,
  SIGNIN: `${API_BASE_URL}/signin`,
  USER: `${API_BASE_URL}/user`,

  // Payment endpoints
  CREATE_ORDER: `${API_BASE_URL}/create-order`,
  VERIFY_PAYMENT: `${API_BASE_URL}/verify-payment`,

  // Health check
  HEALTH: `${API_BASE_URL}/health`,

  // Other endpoints
  PAYROLL: `${API_BASE_URL}/payroll`,
  TAX: `${API_BASE_URL}/tax`,
  BALANCE: `${API_BASE_URL}/balance`,
  PROFIT_LOSS: `${API_BASE_URL}/profitloss`,

  // Invoice endpoint
  INVOICE: `${API_BASE_URL}/invoice`,
  INVOICE_SUMMARY: `${API_BASE_URL}/invoice-summary`,

  // AI endpoints
  AI: `${API_BASE_URL}/ai`,
  AI_INVOICE_OCR: `${API_BASE_URL}/ai/invoice-ocr`,
  AI_EXTRACT_TEXT: `${API_BASE_URL}/ai/extract-text`,

  // Civil Engineering endpoints
  CIVIL_CPM_CALCULATE: `${API_BASE_URL}/civil-engineering/calculate-cpm`,
} as const;

// Helper function for making API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(endpoint, config);
};

// Log current API configuration (for debugging)
console.log('🔧 API Configuration:', {
  isDevelopment,
  apiUrl: API_BASE_URL,
  environment: isDevelopment ? 'Development' : 'Production'
});