import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Wallet, Gift, Sparkles, Zap, Flower2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const GIFTS = [
  { id: "rose", name: "Rose Touch", price: 10, icon: Flower2, color: "text-red-400" },
  { id: "spark", name: "Love Spark", price: 50, icon: Sparkles, color: "text-blue-400" },
  { id: "flame", name: "Flame", price: 100, icon: Zap, color: "text-orange-500" },
  { id: "gem", name: "Desire Gem", price: 200, icon: Heart, color: "text-pink-400" },
  { id: "kiss", name: "Midnight Kiss", price: 500, icon: Heart, color: "text-purple-400" },
  { id: "crown", name: "Intima Crown", price: 1000, icon: Sparkles, color: "text-yellow-400" },
  { id: "bond", name: "Infinity Bond", price: 5000, icon: Zap, color: "text-green-400" },
];

export function GiftingModal({ toUserId, recipientName }: { toUserId: string, recipientName: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (gift: any) => {
      const res = await fetch("/api/gifts/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId, giftType: gift.id, amount: gift.price }),
      });
      if (!res.ok) throw new Error("Gifting failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Gift Sent!", description: `Your token of appreciation has been delivered to ${recipientName}.` });
      queryClient.invalidateQueries({ queryKey: ["/api/user/me"] });
      setOpen(false);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "You might not have enough credits." });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 text-primary hover:bg-primary/10">
          <Gift className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card/90 backdrop-blur-3xl border-white/5 p-8 rounded-[40px] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-white italic text-center">Gift of Intimacy</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Balance</span>
          </div>
          <span className="text-lg font-display text-white">{user?.credits || 0} <span className="text-xs text-primary">CREDITS</span></span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {GIFTS.map((gift) => (
            <Card 
              key={gift.id}
              onClick={() => mutation.mutate(gift)}
              className="p-6 border-white/5 bg-white/5 hover:bg-primary/10 transition-all cursor-pointer group flex flex-col items-center text-center rounded-[32px]"
            >
              <gift.icon className={`w-10 h-10 mb-4 ${gift.color} group-hover:scale-110 transition-transform`} />
              <p className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{gift.name}</p>
              <p className="text-sm font-display text-primary">{gift.price} CR</p>
            </Card>
          ))}
        </div>

        <p className="text-[10px] text-center text-muted-foreground mt-8 uppercase tracking-widest leading-relaxed">
          Gifting increases your bond synchronicity and supports the ecosystem economy.
        </p>
      </DialogContent>
    </Dialog>
  );
}
