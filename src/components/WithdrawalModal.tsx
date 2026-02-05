import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Banknote, CreditCard } from "lucide-react";

export function WithdrawalModal({ isOpen, onClose, balance }: { isOpen: boolean, onClose: () => void, balance: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("PayPal");
  const [details, setDetails] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Request Sent", description: "Your withdrawal request is pending approval." });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/10 rounded-[40px] max-w-md p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display font-bold text-white italic">Withdraw <span className="text-primary tracking-widest italic">Funds</span></DialogTitle>
          <DialogDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold py-2">Section L: Gifting Economy Withdrawal</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-white/60 text-xs font-bold uppercase tracking-widest">Amount (Credits)</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-white/5 border-white/10 text-white h-14 rounded-2xl pl-12 text-lg"
              />
              <Banknote className="absolute left-4 top-4 w-6 h-6 text-primary" />
            </div>
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">Available: {balance} credits</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-xs font-bold uppercase tracking-widest">Payment Method</Label>
            <div className="flex gap-2">
              {["PayPal", "Bank", "Crypto"].map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 h-12 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest ${
                    method === m ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/5 text-white/40'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 text-xs font-bold uppercase tracking-widest">{method} Details</Label>
            <Input 
              value={details} 
              onChange={(e) => setDetails(e.target.value)}
              placeholder={`Enter your ${method} info`}
              className="bg-white/5 border-white/10 text-white h-14 rounded-2xl"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex gap-4">
          <Button variant="ghost" onClick={onClose} className="rounded-xl h-12 text-white/40">Cancel</Button>
          <Button 
            disabled={!amount || !details || mutation.isPending}
            onClick={() => mutation.mutate({ amount: Number(amount), paymentMethod: method, paymentDetails: { info: details } })}
            className="flex-1 rounded-xl h-12 bg-primary font-bold shadow-lg shadow-primary/20"
          >
            Confirm Withdrawal
          </Button>
        </DialogFooter>

        <div className="mt-8 flex items-center gap-2 p-3 rounded-2xl bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary/60 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Secure Gateway: Approved by Admin in 24h
        </div>
      </DialogContent>
    </Dialog>
  );
}
