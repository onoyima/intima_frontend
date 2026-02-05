import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, Flame, Sparkles, Heart, 
  Settings, Lock, Zap, Save 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SEX_STYLES = [
  "Slow & Sensual", "Romantic", "Passionate", 
  "Playful & Kinky", "Dominant", "Submissive", 
  "Explorative", "High-Intensity"
];

const BOUNDARIES = [
  "No Rough Play", "Mutual Consent Always", 
  "Safe Words Mandatory", "No Third Parties",
  "Digital Privacy Only", "Physical Only"
];

export default function Preferences() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: prefs, isLoading } = useQuery<any>({ queryKey: ["/api/preferences"] });

  const [localPrefs, setLocalPrefs] = useState({
    sexStyle: "",
    boundaries: [] as string[],
    intensityPreference: 1,
    fantasies: [] as string[]
  });

  useEffect(() => {
    if (prefs) {
      setLocalPrefs({
        sexStyle: prefs.sexStyle || "",
        boundaries: prefs.boundaries || [],
        intensityPreference: prefs.intensityPreference || 1,
        fantasies: prefs.fantasies || []
      });
    }
  }, [prefs]);

  const mutation = useMutation({
    mutationFn: async (newPrefs: any) => {
      const res = await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrefs),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({ title: "Preferences Saved", description: "Your private intimacy logic has been updated." });
    }
  });

  const toggleBoundary = (b: string) => {
    setLocalPrefs(prev => ({
      ...prev,
      boundaries: prev.boundaries.includes(b) 
        ? prev.boundaries.filter(item => item !== b)
        : [...prev.boundaries, b]
    }));
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-black pb-32 px-6 pt-12 overflow-hidden relative">
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
              Intimacy <span className="text-primary italic">Intelligence</span>
            </h1>
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Section D: Styles & Boundaries</p>
          </div>
          <Button 
            onClick={() => mutation.mutate(localPrefs)}
            disabled={mutation.isPending}
            className="rounded-2xl bg-primary hover:bg-primary/90 gap-2 h-12 px-6 shadow-xl shadow-primary/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Sex Styles */}
          <section className="space-y-6">
            <h3 className="text-xl font-display font-bold text-white italic flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              Dominant Style
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {SEX_STYLES.map(style => (
                <button
                  key={style}
                  onClick={() => setLocalPrefs(p => ({ ...p, sexStyle: style }))}
                  className={`p-4 rounded-2xl border transition-all text-xs font-bold text-left ${
                    localPrefs.sexStyle === style 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                      : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </section>

          {/* Intensity & Boundaries */}
          <div className="space-y-10">
            <Card className="p-8 border-white/5 bg-white/5 backdrop-blur-3xl rounded-[32px]">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Intensity Preference
              </h3>
              <div className="px-2">
                <Slider 
                  value={[localPrefs.intensityPreference]} 
                  onValueChange={([v]) => setLocalPrefs(p => ({ ...p, intensityPreference: v }))}
                  max={10} 
                  step={1}
                  className="mb-4"
                />
                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <span>Mellow</span>
                  <span>Extreme</span>
                </div>
              </div>
            </Card>

            <section className="space-y-6">
              <h3 className="text-xl font-display font-bold text-white italic flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Hard Boundaries
              </h3>
              <div className="flex flex-wrap gap-2">
                {BOUNDARIES.map(b => (
                  <Badge
                    key={b}
                    onClick={() => toggleBoundary(b)}
                    className={`px-4 py-2 rounded-xl border cursor-pointer transition-all text-[10px] uppercase tracking-widest ${
                      localPrefs.boundaries.includes(b)
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                    }`}
                  >
                    {b}
                  </Badge>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-16 p-8 rounded-[40px] bg-primary/5 border border-primary/10 flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">Encrypted Logic Storage</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These preferences are only used by the INTIMA∞ AI to curate your Experience Feed and Game Sessions. 
              They are never visible to the public or other users unless explicitly shared in a Private Vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
