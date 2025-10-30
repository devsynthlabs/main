import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, X } from "lucide-react";

interface PaymentCheckoutProps {
  planName: string;
  amount: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentCheckout = ({ planName, amount, onClose, onSuccess }: PaymentCheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = () => {
    setLoading(true);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      const options = {
        key: "rzp_live_RWuD5WAyVeoZep", // Your live Razorpay key
        amount: amount === "Custom" ? 0 : parseInt(amount.replace(/[^0-9]/g, "")) * 100,
        currency: "INR",
        name: "Financial Automation",
        description: `${planName} Plan`,
        image: "https://your-logo-url.com/logo.png",
        handler: function (response: { razorpay_payment_id: string }) {
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          setLoading(false);
          onSuccess();
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      // @ts-expect-error - Razorpay is loaded dynamically
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    };

    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    };

    document.body.appendChild(script);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-400">Complete Payment</h2>
            <p className="text-green-300">{planName} Plan</p>
          </div>

          <div className="bg-green-900/20 p-4 rounded-lg border border-green-600">
            <div className="flex justify-between items-center">
              <span className="text-green-300">Amount</span>
              <span className="text-2xl font-bold text-green-400">
                {amount === "Custom" ? "Contact Sales" : amount}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="bg-black/50 text-green-100 border-green-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-green-200">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="bg-black/50 text-green-100 border-green-600"
              />
            </div>
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-black font-bold"
            size="lg"
            onClick={handlePayment}
            disabled={loading || amount === "Custom"}
          >
            {loading ? "Processing..." : amount === "Custom" ? "Contact Sales" : "Pay Now"}
          </Button>

          <p className="text-xs text-center text-green-300">
            Secured by Razorpay • Your payment information is encrypted
          </p>
        </div>
      </Card>
    </div>
  );
};