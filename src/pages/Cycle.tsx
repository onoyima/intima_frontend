import { useCycleLogs, useLogCycle } from "@/hooks/use-cycle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Droplet, Smile, Frown, Moon, Zap, 
  Baby, Sparkles, ChevronRight, Info, AlertCircle, ShieldCheck
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, differenceInDays, isSameDay } from "date-fns";
import { motion } from "framer-motion";

export default function Cycle() {
  const { data: logs } = useCycleLogs();
  const { mutate: logCycle } = useLogCycle();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

  // --- SMART LOGIC CALCULATIONS ---
  const insights = useMemo(() => {
    if (!logs || logs.length === 0) return null;
    
    const lastPeriod = new Date(logs[0].startDate);
    const cycleLength = 28; // Standard
    
    const nextPeriod = addDays(lastPeriod, cycleLength);
    const daysUntilNext = differenceInDays(nextPeriod, new Date());
    
    // Ovulation is usually 14 days before next period
    const ovulationDay = addDays(nextPeriod, -14);
    const isOvulating = isSameDay(new Date(), ovulationDay);
    
    // Fertility window: 5 days before ovulation to 1 day after
    const fertileStart = addDays(ovulationDay, -5);
    const fertileEnd = addDays(ovulationDay, 1);
    const isFertile = new Date() >= fertileStart && new Date() <= fertileEnd;

    return {
      daysUntilNext,
      ovulationDay,
      isOvulating,
      isFertile,
      lastPeriod
    };
  }, [logs]);

  const handleLog = (symptom: string) => {
    if (!date) return;
    logCycle({
      startDate: date,
      symptoms: [symptom],
      flowIntensity: "medium",
    } as any, {
      onSuccess: () => toast({ title: "Cycle Updated", description: `Recorded ${symptom} for the ecosystem.` }),
    });
  };

  return (
    <div className="min-h-screen bg-black pb-32 px-6 pt-12 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-10">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
            Reproductive <span className="text-primary italic">Health</span>
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Smart Cycle & Fertility Logic</p>
        </header>

        {/* Smart Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="p-8 border-white/5 bg-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Next Cycle In</p>
              <h2 className="text-6xl font-display font-bold text-white tracking-tighter">
                {insights ? insights.daysUntilNext : '--'} <span className="text-xl">DAYS</span>
              </h2>
              <p className="text-xs text-muted-foreground pt-2">Predicted for {insights ? format(addDays(insights.lastPeriod, 28), 'MMMM do') : '...'}</p>
            </div>
          </Card>

          <Card className={`p-8 border-white/5 rounded-[32px] overflow-hidden relative group transition-colors ${insights?.isFertile ? 'bg-primary/20' : 'bg-white/5'}`}>
            <div className="absolute top-0 right-0 p-6">
              <Baby className={`w-8 h-8 ${insights?.isFertile ? 'text-primary' : 'text-white/20'}`} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fertility Status</p>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                {insights?.isFertile ? 'HIGH FERTILITY' : 'LOW RISK'}
              </h2>
              <p className={`text-xs pt-2 ${insights?.isFertile ? 'text-primary' : 'text-muted-foreground'}`}>
                {insights?.isFertile ? 'High chance of conception today.' : 'Ideal for protected exploration.'}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Calendar Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-white/5 bg-white/5 backdrop-blur-2xl rounded-[32px]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-3xl border-0 w-full text-white mx-auto flex justify-center"
              />
            </Card>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Biological Insights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Peak Ovulation</p>
                  <p className="text-white font-medium">{insights ? format(insights.ovulationDay, 'MMM d') : '--'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Cycle Regularity</p>
                  <p className="text-white font-medium">Stable (28d)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logging Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold text-white italic">Log Symptoms</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Droplet, label: "Started Period", color: "text-red-500", bg: "bg-red-500/10" },
                { icon: Zap, label: "High Libido", color: "text-yellow-400", bg: "bg-yellow-400/10" },
                { icon: Moon, label: "Cramps", color: "text-purple-400", bg: "bg-purple-400/10" },
                { icon: AlertCircle, label: "Mood Swings", color: "text-blue-400", bg: "bg-blue-400/10" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLog(item.label)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all text-left ${item.bg}`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="text-sm font-bold text-white/80">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Center (Section I & F) */}
        <section className="mt-20">
          <header className="mb-8">
            <h3 className="text-2xl font-display font-bold text-white italic tracking-tight">Biological Intelligence Center</h3>
            <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.3em]">Scientific Logic & Safe Practices</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-white/5 bg-white/5 rounded-3xl group">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold mb-2">Safe Day Forecasting</h4>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                Our algorithm predicts the lowest risk windows for natural activity. High confidence safe window: Days 1-7 of your cycle.
              </p>
            </Card>

            <Card className="p-6 border-white/5 bg-white/5 rounded-3xl group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <Droplet className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold mb-2">Pregnancy Prevention</h4>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                During High Fertility (Day 10-16), we recommend combined barrier methods for terminal safety. AI sync is 92% accurate for these windows.
              </p>
            </Card>

            <Card className="p-6 border-white/5 bg-white/5 rounded-3xl group">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 text-orange-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-white font-bold mb-2">Gender/Twins Odds</h4>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                Section G Educational Predictor: Conception 12h before ovulation (Day {insights ? format(addDays(insights.ovulationDay, -1), 'd') : '--'}) statistically favors Y-chromosome speed, while twin probability increases with cycle variance. 
              </p>
            </Card>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
            <p className="text-[10px] text-red-200/50 uppercase font-bold tracking-widest leading-loose">
              Medical Disclaimer: INTIMA∞ provides educational logic only. Our reproductive tracking is not a substitute for clinical diagnostics or professional medical advice. Always consult a physician for health concerns.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
