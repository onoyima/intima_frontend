import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, Eye, ShieldCheck, AlertCircle, 
  Camera, Plus, Trash2, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function MediaVault({ coupleId, partner }: { coupleId: number, partner: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  // SECTION H: Consent Gate check
  const { data: consent } = useQuery<any>({ 
    queryKey: [`/api/couples/${coupleId}/consent/explicit_media`] 
  });

  const grantMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/api/ai/consent/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "explicit_media", partnerId: partner.id }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/couples/${coupleId}/consent/explicit_media`] });
      toast({ title: "Consent Granted", description: "You have authorized explicit media sharing." });
    }
  });

  const hasMutualConsent = consent?.isGranted;

  if (!hasMutualConsent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-8 bg-black/60 backdrop-blur-3xl rounded-[40px] border border-white/5">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
          <Lock className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <div className="max-w-xs space-y-4">
          <h2 className="text-3xl font-display font-bold text-white italic tracking-tight">Explicit Media Vault</h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-bold uppercase tracking-widest text-[10px]">
            Section H Security: This vault contains sensitive content. Both partners must explicitly grant consent to access or share media here.
          </p>
        </div>
        <Button 
          onClick={() => grantMutation.mutate()}
          disabled={grantMutation.isPending}
          className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-8 font-bold shadow-xl shadow-primary/20 gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          {grantMutation.isPending ? "Logging Consent..." : "Authorize Media Vault"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Camera className="w-20 h-20 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tighter italic">Encrypted <span className="text-primary italic">Media</span></h2>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Section H: Private Gallery</p>
        </div>
        <Button className="rounded-2xl h-14 w-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
          <Plus className="w-6 h-6" />
        </Button>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
         {[1,2,3].map(i => (
           <Card key={i} className="aspect-square bg-white/5 border-white/5 rounded-[32px] overflow-hidden group cursor-pointer relative">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                <Eye className="w-8 h-8 text-white/20 group-hover:text-white/60 transition-all" />
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Badge className="bg-primary/20 text-primary border-none text-[8px] tracking-widest uppercase font-bold">E2EE</Badge>
              </div>
           </Card>
         ))}
         
         <Card className="aspect-square border-2 border-dashed border-white/10 bg-white/5 rounded-[32px] flex flex-col items-center justify-center text-center p-6 hover:border-primary/50 transition-all">
            <Plus className="w-8 h-8 text-white/20 mb-2" />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Add Private Photo</p>
         </Card>
      </div>

      <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
        <p className="text-[9px] text-yellow-200/50 uppercase font-bold tracking-widest leading-loose">
          Privacy Notice: Screenshots are blocked. Attempting to capture media will log a security violation.
        </p>
      </div>
    </div>
  );
}
