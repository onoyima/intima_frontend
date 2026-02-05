import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useCouples } from "@/hooks/use-couples";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Search, Calendar, ChevronRight, Zap, 
  ShieldCheck, Wallet, Sparkles, TrendingUp,
  Flame, BookOpen, GraduationCap, LifeBuoy, Ghost, Settings, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, isLoading: loadingAuth } = useAuth();
  const { data: couples, isLoading: loadingCouples } = useCouples();
  const activeCouple = couples?.[0];

  const { data: health } = useQuery<any>({
    queryKey: [`/api/couples/${activeCouple?.id}/health`],
    enabled: !!activeCouple
  });

  const { data: aiData } = useQuery<any>({
    queryKey: ["/api/ai/insight"],
  });

  if (loadingAuth || loadingCouples) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black pb-32 px-6 pt-12 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Profile Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <motion.h1 
              variants={item}
              className="text-5xl font-display font-bold text-white tracking-tighter italic"
            >
              INTIMA<span className="text-primary tracking-widest">∞</span>
            </motion.h1>
            <p className="text-muted-foreground uppercase tracking-[0.4em] text-[10px] font-bold mt-2 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Secure Relationship Ecosystem
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/wallet">
              <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-primary">
                <Wallet className="w-5 h-5" />
              </div>
            </Link>
            <Link href="/profile">
              <div className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </Link>
          </div>
        </header>

        {/* AI Daily Insight */}
        <motion.div variants={item} className="mb-10">
          <Card className="p-6 border-primary/20 bg-primary/5 rounded-[32px] flex items-center gap-6 group hover:bg-primary/10 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Morning Insight</p>
              <p className="text-white text-sm font-medium italic">"{aiData?.insight || "Connection isn't just about presence, it's about the quality of the gaps in between. Try a 5-minute deep eye contact session today."}"</p>
            </div>
          </Card>
        </motion.div>

        {/* Bond Status (If paired) */}
        {activeCouple ? (
          <motion.div variants={item} className="mb-10">
            <Card className="p-8 border-white/5 bg-gradient-to-br from-primary/30 to-black/40 backdrop-blur-3xl rounded-[40px] overflow-hidden relative border shadow-[0_0_50px_-12px_rgba(255,107,107,0.2)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border-none">Active Bond</Badge>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-white tracking-tighter">
                    Sync <span className="text-primary italic">Score</span>: {health?.score || '84.3'}
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${health?.score || 84.3}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(255,107,107,1)]" 
                      />
                    </div>
                    <span className="text-xs font-bold text-white/40 uppercase">{health?.status || 'LVL 14 Journey'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/cycle">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center">
                      <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Lust Days</p>
                      <p className="text-lg font-display text-white italic">In 4D</p>
                    </div>
                  </Link>
                  <Link href="/couple">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-center">
                      <Zap className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Games</p>
                      <p className="text-lg font-display text-white">Active</p>
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={item} className="mb-10">
            <Card className="p-8 border-dashed border-white/10 bg-white/2 rounded-[40px] text-center border-2 group hover:border-primary/50 transition-all">
              <Ghost className="w-12 h-12 text-white/10 mx-auto mb-4 group-hover:text-primary/40 transition-colors" />
              <h3 className="text-2xl font-display font-bold text-white mb-2">Initialize Your Bond Strategy</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto font-medium">Connect with a partner to unlock the Private Vault, Shared Health Tracker, and Intimacy Games Engine.</p>
              <Link href="/couple">
                <Button className="rounded-2xl h-14 px-10 font-bold bg-primary hover:bg-primary/90 text-lg gap-2">
                  <ShieldCheck className="w-5 h-5" /> Pair Now
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link href="/dating">
            <Card className="p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer rounded-[32px] group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20" />
               <Search className="w-10 h-10 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tighter italic">Lust Discovery</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">Find your next meaningful connection through interest-based matching & AI Icebreakers.</p>
            </Card>
          </Link>
          <Link href="/community">
            <Card className="p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer rounded-[32px] group relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20" />
               <MessageSquare className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tighter italic">Discovery Rooms</h3>
               <p className="text-sm text-muted-foreground leading-relaxed">Join public text-based rooms to meet others and share relationship insights.</p>
            </Card>
          </Link>
        </div>

        {/* Feature Ecosystem Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: "Intima Games", icon: Zap, color: "text-blue-400", sub: activeCouple ? "Active" : "Locked", href: "/couple" },
            { label: "Health Hub", icon: GraduationCap, color: "text-green-400", sub: "Education", href: "/cycle" },
            { label: "Issue Solver", icon: LifeBuoy, color: "text-orange-400", sub: "Section J", href: "/resolver" },
            { label: "AI Intel", icon: Settings, color: "text-purple-400", sub: "Section D", href: "/preferences" },
          ].map((f, i) => (
            <Link key={i} href={f.href}>
              <button className="w-full p-6 h-full rounded-3xl border border-white/5 bg-white/5 hover:border-primary/20 transition-all text-center group">
                <f.icon className={`w-6 h-6 ${f.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{f.label}</p>
                <p className="text-sm font-display text-white italic">{f.sub}</p>
              </button>
            </Link>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
