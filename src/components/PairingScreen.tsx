import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Heart, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function PairingScreen() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [partnerCode, setPartnerCode] = useState("");

  const pairMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("/api/couples/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Bond Established", description: "You are now connected in Private Couple Mode." });
      queryClient.invalidateQueries({ queryKey: ["/api/couples"] });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Pairing Failed", description: err.message });
    }
  });

  const copyCode = () => {
    navigator.clipboard.writeText(user?.inviteCode || "");
    toast({ title: "Code Copied", description: "Send this to your partner privately." });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 max-w-lg mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Private Couple Vault</h2>
        <p className="text-muted-foreground leading-relaxed">
          Connect with your partner to unlock the full ecosystem of intimacy games, health tracking, and shared desires.
        </p>
      </motion.div>

      <Card className="w-full p-8 border-white/5 bg-card/40 backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="space-y-8">
          {/* My Code */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Your Identity Code</label>
            <div className="flex gap-2">
              <div className="flex-1 h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center font-mono text-2xl tracking-[0.3em] text-white">
                {user?.inviteCode}
              </div>
              <Button onClick={copyCode} variant="outline" className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10">
                <Copy className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center"><span className="bg-transparent px-4 text-xs font-bold text-white/20 uppercase tracking-widest italic">Bond with partner</span></div>
          </div>

          {/* Partner Code */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Partner's Invite Code</label>
            <div className="flex flex-col gap-4">
              <Input 
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="h-14 bg-white/5 border-white/10 rounded-2xl text-center font-mono text-2xl tracking-[0.3em] text-white placeholder:text-white/10"
              />
              <Button 
                disabled={pairMutation.isPending || partnerCode.length < 6}
                onClick={() => pairMutation.mutate(partnerCode)}
                className="h-14 w-full bg-primary hover:bg-primary/90 rounded-2xl gap-2 font-bold text-lg shadow-lg shadow-primary/20"
              >
                <Zap className="w-5 h-5 fill-white" />
                Initialize Bond
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center italic opacity-50">
        All connections in Couple Mode are end-to-end encrypted and completely private.
      </p>
    </div>
  );
}
