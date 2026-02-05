import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Dice5, ShieldQuestion, Flame, ChevronRight, CheckCircle2, Zap, Heart, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GameType = 'truth' | 'dare' | 'desire' | 'datingFun' | 'sexStyles';

export function GameEngine({ coupleId }: { coupleId: number }) {
  const [activeTab, setActiveTab] = useState<GameType>('truth');
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/games/content"],
    queryFn: async () => {
      const res = await fetch("/api/games/content");
      return res.json();
    }
  });

  const rollDice = () => {
    if (!content) return;
    const categoryMapping = {
      truth: content.truths,
      dare: content.dares,
      desire: content.desires,
      datingFun: content.datingFun,
      sexStyles: content.sexStyles
    };
    const category = categoryMapping[activeTab];
    const random = category[Math.floor(Math.random() * category.length)];
    setCurrentChallenge(random);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    toast({
      title: "Challenge Accepted!",
      description: "You've earned +5 intimacy credits for this move.",
    });
  };

  if (isLoading) return <div className="p-20 text-center text-white/20 animate-pulse uppercase tracking-[0.3em] text-xs font-bold">Summoning Desires...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-6">
      {/* Tab Switcher */}
      <div className="bg-white/5 p-1 rounded-2xl flex flex-wrap border border-white/5 gap-1">
        {(['truth', 'dare', 'desire', 'datingFun', 'sexStyles'] as GameType[]).map((type) => (
          <button
            key={type}
            onClick={() => { setActiveTab(type); setCurrentChallenge(null); }}
            className={`flex-1 min-w-[100px] py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === type 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105 z-10' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {type.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!currentChallenge ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card 
              onClick={rollDice}
              className="p-12 border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:border-primary/50 transition-all group flex flex-col items-center justify-center text-center rounded-[40px]"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Dice5 className="w-10 h-10 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2 italic">Ready to play?</h3>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Pick a category and tap to begin</p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="p-10 border-white/10 bg-card/60 backdrop-blur-3xl rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                {activeTab === 'truth' && <ShieldQuestion className="w-8 h-8 text-blue-400 opacity-20" />}
                {activeTab === 'dare' && <Zap className="w-8 h-8 text-yellow-400 opacity-20" />}
                {activeTab === 'desire' && <Flame className="w-8 h-8 text-red-400 opacity-20" />}
              </div>

              <div className="space-y-6">
                <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-primary">Your {activeTab}</span>
                <p className="text-2xl md:text-3xl font-display font-bold text-white leading-tight italic">
                  "{currentChallenge}"
                </p>
                
                {isCompleted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 text-green-400 font-bold bg-green-500/10 p-4 rounded-2xl w-fit"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    Challenge Completed
                  </motion.div>
                ) : (
                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={handleComplete}
                      className="flex-1 h-14 bg-primary hover:bg-primary/90 rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                      Completed
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={rollDice}
                      className="h-14 w-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      <Dice5 className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Button 
              variant="ghost" 
              onClick={() => setCurrentChallenge(null)}
              className="w-full text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold"
            >
              Back to selection
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
