import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function DiscoveryFeed() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [matchingUserId, setMatchingUserId] = useState<string | null>(null);

  const { data: profiles, isLoading, error } = useQuery<any[]>({
    queryKey: [api.profiles.list.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.list.path);
      if (!res.ok) throw new Error("Failed to fetch discovery feed");
      return res.json();
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/profiles/${userId}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to record like");
      return res.json();
    },
    onSuccess: (data, userId) => {
      if (data.isMatch) {
        setMatchingUserId(userId);
        toast({
          title: "IT'S A MATCH! 💖",
          description: "You both mutually liked each other. Start a conversation now!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      } else {
        toast({
          title: "Connection Sent",
          description: "We'll let you know if they like you back.",
        });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse uppercase tracking-widest text-xs">Scanning for connections...</p>
      </div>
    );
  }

  if (error || !profiles || profiles.length === 0) {
    return (
      <div className="text-center p-20">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h3 className="text-xl font-display text-white mb-2">No one around yet</h3>
        <p className="text-muted-foreground">Why not invite someone to the ecosystem?</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.userId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group relative overflow-hidden border-white/5 bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-500 rounded-3xl h-[450px]">
              {/* Profile Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10" />
              <img 
                src={profile.user.profileImageUrl || `https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600`} 
                alt={profile.user.firstName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />

              {/* Match Overlay */}
              {matchingUserId === profile.userId && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-30 bg-primary/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm"
                >
                  <Sparkles className="w-16 h-16 text-white mb-4 animate-bounce" />
                  <h2 className="text-3xl font-display font-bold text-white mb-2 italic">MATCHED!</h2>
                  <p className="text-white/80 mb-6 font-medium">You and {profile.user.firstName} are compatible.</p>
                  <Button 
                    variant="secondary" 
                    className="w-full rounded-2xl h-12 font-bold"
                    onClick={() => setMatchingUserId(null)}
                  >
                    Send Message
                  </Button>
                </motion.div>
              )}

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                      {profile.user.firstName}, {profile.user.lastName?.[0]}.
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-1">{profile.bio}</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/20 backdrop-blur-md">
                    {profile.gender}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.interests?.slice(0, 3).map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-[10px] uppercase tracking-wider bg-white/5 border-white/10 text-white/70">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button 
                    disabled={likeMutation.isPending}
                    onClick={() => likeMutation.mutate(profile.userId)}
                    className={`flex-1 h-12 rounded-2xl gap-2 font-bold shadow-lg transition-all ${
                      likeMutation.variables === profile.userId ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likeMutation.variables === profile.userId ? 'fill-white' : ''}`} />
                    {likeMutation.variables === profile.userId ? 'Liked' : 'Connect'}
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
