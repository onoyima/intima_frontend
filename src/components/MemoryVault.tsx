import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Sparkles, Mic, Image, 
  Trash2, Plus, Calendar, Shield
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export function MemoryVault({ coupleId }: { coupleId: number }) {
  const queryClient = useQueryClient();
  const { data: memories, isLoading } = useQuery<any[]>({ 
    queryKey: [`/api/couples/${coupleId}/memories`] 
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/couples/${coupleId}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/couples/${coupleId}/memories`] });
      setIsAdding(false);
      setNewTitle("");
    }
  });

  if (isLoading) return null;

  return (
    <div className="space-y-8 p-6">
      <header className="flex justify-between items-center bg-white/5 p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookOpen className="w-20 h-20 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tighter italic">Memory <span className="text-primary italic">Vault</span></h2>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold mt-1">Section K: Encrypted Milestones</p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)}
          className="rounded-2xl h-14 w-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 border-primary/20 bg-primary/5 rounded-[32px] space-y-4">
              <Input 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Name your memory... (e.g., 'First Night in Paris')"
                className="bg-black/40 border-white/10 text-white rounded-2xl h-14"
              />
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1 rounded-xl h-12 border-white/5">Cancel</Button>
                <Button 
                  onClick={() => addMutation.mutate({ title: newTitle, type: 'text' })}
                  disabled={!newTitle.trim()}
                  className="flex-1 rounded-xl h-12 bg-primary font-bold"
                >Save Highlight</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memories?.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center space-y-4">
            <Shield className="w-12 h-12 text-white/5 mx-auto" />
            <p className="text-white/20 font-bold uppercase tracking-[0.2em] text-xs">The vault is empty. Store your first shared spark.</p>
          </div>
        )}
        
        {memories?.map((memory) => (
          <Card key={memory.id} className="p-6 border-white/5 bg-white/5 hover:bg-white/10 transition-all rounded-[32px] group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-white/5 text-primary">
                {memory.type === 'voice' ? <Mic className="w-5 h-5" /> : 
                 memory.type === 'photo' ? <Image className="w-5 h-5" /> : 
                 <Sparkles className="w-5 h-5" />}
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  {format(new Date(memory.createdAt), "MMM dd, yyyy")}
                </p>
                <p className="text-[8px] font-bold text-primary uppercase tracking-tighter mt-1 flex items-center gap-1">
                  <Shield className="w-2 h-2" /> Encrypted
                </p>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{memory.title}</h3>
            {memory.content && <p className="text-sm text-white/60 leading-relaxed italic">"{memory.content}"</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
