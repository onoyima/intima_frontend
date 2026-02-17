import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PaystackButton } from "react-paystack";

// Replace with your publishable key
const stripePromise = loadStripe("pk_test_mock");

interface PaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

function StripeCheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/wallet",
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message ?? "An unknown error occurred");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Notify backend (optional doubly verification)
      await apiRequest("POST", "/api/wallet/deposit/stripe", {
          amount,
          paymentMethodId: paymentIntent.payment_method
      });
      onSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      <Button disabled={!stripe || isProcessing} className="w-full bg-[#635BFF] hover:bg-[#5851DE] text-white">
        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : `Pay $${amount}`}
      </Button>
    </form>
  );
}

export function PaymentModal({ amount, onSuccess, onClose, userEmail }: PaymentModalProps & { userEmail: string }) {
  const [method, setMethod] = useState<"stripe" | "paystack">("stripe");
  const { toast } = useToast();

  const handlePaystackSuccess = async (reference: any) => {
      try {
          await apiRequest("POST", "/api/wallet/deposit/paystack/verify", { reference: reference.reference });
          toast({ title: "Payment Successful", description: `Credited ${amount} credits.` });
          onSuccess();
      } catch (e) {
          toast({ title: "Verification Failed", variant: "destructive" });
      }
  };

  const paystackConfig = {
      reference: (new Date()).getTime().toString(),
      email: userEmail,
      amount: amount * 100 * 1500, // Conversion rate mock: 1 credit = $1 = 1500 NGN
      publicKey: 'pk_test_mock', // Replace with real key
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-white/10 rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
        
        <h2 className="text-xl font-display font-bold text-white mb-6">Complete Purchase</h2>
        
        <div className="flex gap-4 mb-6">
            <button 
                onClick={() => setMethod('stripe')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${method === 'stripe' ? 'bg-[#635BFF] text-white' : 'bg-white/5 text-white/50'}`}
            >
                Stripe
            </button>
            <button 
                onClick={() => setMethod('paystack')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${method === 'paystack' ? 'bg-[#00C3F7] text-black' : 'bg-white/5 text-white/50'}`}
            >
                Paystack
            </button>
        </div>

        <div className="min-h-[200px]">
            {method === 'stripe' ? (
                // In a real app, fetch clientSecret from backend first
                <Elements stripe={stripePromise} options={{ mode: 'payment', amount: amount * 100, currency: 'usd' }}>
                    <StripeCheckoutForm amount={amount} onSuccess={onSuccess} />
                </Elements>
            ) : (
                <div className="space-y-4">
                    <p className="text-white/70 text-sm">Pay with local cards, bank transfer, or USSD via Paystack.</p>
                    <p className="text-2xl font-bold text-white mb-4">₦ {(amount * 1500).toLocaleString()}</p>
                    {/* @ts-ignore */}
                    <PaystackButton 
                        {...paystackConfig}
                        text="Pay with Paystack"
                        className="w-full py-3 rounded-xl font-bold bg-[#00C3F7] text-black hover:opacity-90 transition-opacity"
                        onSuccess={handlePaystackSuccess}
                        onClose={() => toast({ title: "Payment Cancelled" })}
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
