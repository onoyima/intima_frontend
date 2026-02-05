import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export function MatchChat({ coupleId, partnerName }: { coupleId: number, partnerName: string }) {
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<any[]>({
    queryKey: [`/api/messages/${coupleId}`],
    queryFn: async () => {
      const res = await fetch(`/api/messages/${coupleId}`);
      return res.json();
    },
    refetchInterval: 3000, // Poll for new messages
  });

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/messages/${coupleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, type: "text" }),
      });
      return res.json();
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${coupleId}`] });
    },
  });

  // Icebreaker logic
  const icebreakerMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/icebreaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupleId }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setContent(data.suggestion);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] w-full bg-card/20 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-bold text-white tracking-tight">{partnerName}</h3>
          <p className="text-xs text-primary flex items-center gap-1 uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Public Match Channel
          </p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => icebreakerMutation.mutate()}
          className="rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 gap-2 h-10 px-4"
        >
          <Wand2 className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">AI Icebreaker</span>
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          <AnimatePresence>
            {messages?.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.senderId === user?.id 
                    ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                    : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 bg-black/40 border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); if (content.trim()) sendMutation.mutate(content); }}
          className="flex gap-3"
        >
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Whisper something sweet..."
            className="flex-1 bg-white/5 border-white/10 h-14 rounded-2xl px-6 text-white focus:ring-primary focus:border-primary transition-all shadow-inner"
          />
          <Button 
            disabled={sendMutation.isPending || !content.trim()}
            className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-2xl shadow-xl shadow-primary/20"
          >
            <Send className="w-5 h-5 fill-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}
