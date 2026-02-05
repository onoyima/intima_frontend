import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, Sparkles, MessageSquare, ShieldAlert, 
  HelpCircle, ChevronRight, BrainCircuit, RefreshCw
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Resolver() {
  const [issue, setIssue] = useState("");
  const [advice, setAdvice] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/ai/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setAdvice(data);
    }
  });

  return (
    <div className="min-h-screen bg-black pb-32 px-6 pt-12 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="max-w-3xl mx-auto z-10 relative">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
            Issue <span className="text-primary italic">Solver</span>
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Section J: Marital & Relationship Support</p>
        </header>

        <AnimatePresence mode="wait">
          {!advice ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Card className="p-10 border-white/5 bg-white/5 backdrop-blur-3xl rounded-[40px] shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-bold text-white">Share your challenge</h3>
                </div>
                
                <Textarea 
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe what's on your mind... (e.g., 'We've been feeling distant lately' or 'Mismatched libido after childbirth')"
                  className="min-h-[200px] bg-black/40 border-white/10 rounded-3xl text-white text-lg p-6 focus:border-primary/50 transition-all resize-none mb-8"
                />

                <Button 
                  disabled={!issue.trim() || mutation.isPending}
                  onClick={() => mutation.mutate({ issue })}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-lg font-bold rounded-2xl gap-3 shadow-xl shadow-primary/20"
                >
                  {mutation.isPending ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing Dynamics...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Insight
                    </>
                  )}
                </Button>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-4 items-start text-xs">
                  <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0" />
                  <p className="text-white/60 leading-relaxed font-medium">
                    Our AI uses your Section D preferences to tailor its advice to your specific intimacy style.
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-4 items-start text-xs">
                  <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-white/60 leading-relaxed font-medium">
                    This is a safe, non-judgmental space. All inputs are ephemeral and encrypted in your vault.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <Card className="p-10 border-white/5 bg-white/5 backdrop-blur-3xl rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="w-10 h-10 text-primary opacity-20" />
                </div>
                
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                    AI Perspective Plan
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-display font-bold text-white italic leading-tight">
                      Intimacy Logic: Path to Resolution
                    </h3>
                    <p className="text-lg text-white/90 leading-relaxed font-medium italic">
                      "{advice.advice}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Context Mode</p>
                      <p className="text-white font-bold">{advice.style}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Intensity Sync</p>
                      <p className="text-white font-bold">Level {advice.intensity}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setAdvice(null)}
                  className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white/40 hover:text-white"
                >
                  New Support Request
                </Button>
                <Button className="flex-1 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/20 gap-2 font-bold">
                  <Heart className="w-5 h-5 text-white" /> Apply to Private Vault
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
