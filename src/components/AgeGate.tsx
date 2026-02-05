import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function AgeGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.verifyAge.path, {
        method: api.auth.verifyAge.method,
      });
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  if (isLoading || !user) return children;
  
  if (!user.isAgeVerified) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="p-8 border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-display text-white text-center mb-4">
              Age Verification
            </h1>
            
            <p className="text-muted-foreground text-center mb-8 leading-relaxed">
              INTIMA∞ is an 18+ relationship ecosystem. By entering, you confirm you are of legal age and consent to viewing adult-oriented content.
            </p>

            <div className="space-y-4">
              <Button 
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
              >
                {mutation.isPending ? "Verifying..." : "I am 18 or older"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = "https://google.com"}
                className="w-full h-12 border-white/10 text-muted-foreground hover:bg-white/5"
              >
                Exit
              </Button>
            </div>

            <div className="mt-8 flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-orange-200/70 uppercase tracking-widest leading-normal">
                Strict Privacy: Screenshot protection and local laws apply.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
