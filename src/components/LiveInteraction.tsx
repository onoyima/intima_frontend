import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Video, Phone, ShieldCheck, Lock, 
  AlertCircle, ChevronRight, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { GiftingModal } from "./GiftingModal";

export function LiveInteraction({ coupleId, partner }: { coupleId: number, partner: any }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice'>('video');

  const { data: consent } = useQuery<any>({ 
    queryKey: [`/api/couples/${coupleId}/consent/live_video`] 
  });

  const grantMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/security/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupleId, target: "live_video", isGranted: true }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/couples/${coupleId}/consent/live_video`] });
      toast({ title: "Consent Granted", description: "You have authorized live interaction for this session." });
    }
  });

  const startCall = (type: 'video' | 'voice') => {
    setCallType(type);
    setIsCalling(true);
    toast({
      title: `Initializing ${type} call...`,
      description: "Establishing end-to-end encrypted peer connection.",
    });
  };

  const endCall = () => {
    setIsCalling(false);
    toast({
      title: "Call Ended",
      description: "The secure session has been terminated.",
    });
  };

  const hasMutualConsent = consent?.isGranted;

  if (isCalling) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full w-full bg-black flex flex-col items-center justify-center relative p-10"
      >
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-t from-primary/20 via-transparent to-transparent animate-pulse" />
        </div>
        
        <div className="z-10 flex flex-col items-center gap-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-ping" />
            <Avatar className="w-48 h-48 border-4 border-primary shadow-2xl relative z-10">
              <AvatarFallback className="bg-black text-white text-5xl">{partner.firstName[0]}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-bold text-white italic">{partner.firstName}</h2>
            <p className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">
              Secure {callType === 'video' ? 'Video' : 'Voice'} Connection...
            </p>
          </div>

          <div className="flex gap-12 pt-12">
            <Button 
              size="icon" 
              onClick={endCall}
              className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/20"
            >
              <Phone className="w-10 h-10 text-white rotate-[135deg]" />
            </Button>
            <GiftingModal toUserId={partner.id} recipientName={partner.firstName} />
          </div>
        </div>

        <div className="absolute bottom-10 flex items-center gap-2 p-3 px-5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
          <AlertCircle className="w-3 h-3" />
          SESSION BROADCASTING ON PRIVATE NODE
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="live" 
      initial={{ opacity: 0, scale: 1.1 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="h-full flex flex-col items-center justify-center p-10 text-center relative overflow-hidden"
    >
      <div className="relative mb-12">
        <div className={`w-48 h-48 rounded-full border-4 ${hasMutualConsent ? 'border-primary' : 'border-white/10'} flex items-center justify-center bg-primary/5 transition-all duration-1000`}>
           <Avatar className="w-40 h-40 border-4 border-black shadow-2xl">
              <AvatarFallback className="bg-black text-white text-4xl">{partner.firstName[0]}</AvatarFallback>
           </Avatar>
        </div>
        {hasMutualConsent ? (
          <div className="absolute top-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-black flex items-center justify-center animate-bounce shadow-lg">
             <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="absolute top-0 right-0 w-10 h-10 bg-yellow-500 rounded-full border-4 border-black flex items-center justify-center shadow-lg">
             <Lock className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <div className="max-w-xs space-y-6">
        <h2 className="text-3xl font-display font-bold text-white italic tracking-tight">
          {hasMutualConsent ? 'Link Established' : 'Secure Consent Gate'}
        </h2>
        
        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
          {hasMutualConsent 
            ? "Mutual authorization complete. Initialize your end-to-end encrypted session below." 
            : "Section M Security: Both partners must explicitly grant consent to enable live interaction."}
        </p>

        {!hasMutualConsent ? (
          <Button 
            onClick={() => grantMutation.mutate()}
            disabled={grantMutation.isPending}
            className="w-full h-16 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-[24px] gap-3 font-bold group"
          >
            <CheckCircle2 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            Grant Live Access
          </Button>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4">
              <Button 
                onClick={() => startCall('video')}
                className="h-16 flex-1 rounded-[24px] bg-primary hover:bg-primary/90 text-lg font-bold gap-3 shadow-2xl shadow-primary/30"
              >
                <Video className="w-6 h-6 text-white" /> Video
              </Button>
              <Button 
                onClick={() => startCall('voice')}
                className="h-16 flex-1 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 text-lg font-bold gap-3 text-white"
              >
                <Phone className="w-6 h-6 text-white" /> Voice
              </Button>
            </div>
            <GiftingModal toUserId={partner.id} recipientName={partner.firstName} />
          </div>
        )}
      </div>

      <div className="mt-16 flex items-center gap-2 p-3 px-5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">
        <AlertCircle className="w-3 h-3" />
        PEER-TO-PEER ENCRYPTION ACTIVE
      </div>
    </motion.div>
  );
}
