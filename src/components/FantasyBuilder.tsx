import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { Wand2, Sparkles, BookOpen, Quote, ChevronRight } from "lucide-react";

const TAGS = ["Secret Lounge", "Luxury Yacht", "Rainy Cabin", "Blindfold", "Feather Touch", "Slow Dance", "Roleplay"];

export function FantasyBuilder() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fantasy, setFantasy] = useState<any>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/fantasy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: selectedTags, style: "Romantic" }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      setFantasy(data);
    }
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {!fantasy ? (
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-2 italic tracking-tight">Fantasy Builder</h2>
            <p className="text-muted-foreground uppercase tracking-[0.2em] text-[10px] font-bold">Collaborative AI Narration</p>
          </div>

          <Card className="p-10 border-white/5 bg-white/5 backdrop-blur-3xl rounded-[40px] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Select your elements
            </h3>
            <div className="flex flex-wrap gap-3">
              {TAGS.map(tag => (
                <Badge
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-xl border cursor-pointer transition-all text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-primary border-primary text-white scale-105 shadow-lg shadow-primary/20'
                      : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Button
              disabled={selectedTags.length === 0 || mutation.isPending}
              onClick={() => mutation.mutate()}
              className="w-full h-16 mt-12 bg-primary hover:bg-primary/90 text-lg font-bold rounded-2xl gap-3 shadow-xl shadow-primary/20"
            >
              <Wand2 className="w-6 h-6" />
              {mutation.isPending ? "Weaving your reality..." : "Manifest Fantasy"}
            </Button>
          </Card>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8 pb-20"
        >
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary px-4 py-1.5 uppercase tracking-widest text-[10px] font-bold">
              Generated Narrative
            </Badge>
            <h2 className="text-3xl font-display font-bold text-white mb-6 italic">{fantasy.title}</h2>
          </div>

          <div className="grid gap-6">
            {[fantasy.act1, fantasy.act2, fantasy.act3].map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
              >
                <Card className="p-8 border-white/5 bg-white/5 backdrop-blur-xl rounded-[32px] relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div className="flex gap-4">
                    <span className="text-primary font-display text-4xl opacity-20">0{i+1}</span>
                    <p className="text-lg text-white/90 leading-relaxed font-medium">
                      {act}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-8 border-primary/20 bg-primary/5 rounded-[32px] border-dashed text-center">
            <Quote className="w-8 h-8 text-primary mx-auto mb-4 opacity-50" />
            <p className="text-primary font-bold italic">{fantasy.suggestion}</p>
          </Card>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5"
              onClick={() => setFantasy(null)}
            >
              New Elements
            </Button>
            <Button className="flex-1 h-14 rounded-2xl shadow-xl shadow-primary/20 gap-2">
              <BookOpen className="w-5 h-5" /> Save to Vault
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
