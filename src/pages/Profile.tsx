import { useAuth } from "@/hooks/use-auth";
import { useProfile, useUpdateProfile } from "@/hooks/use-profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { LogOut, Save, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user, logout } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id || "");
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { toast } = useToast();

  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setGoals(profile.relationshipGoals || "");
    }
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [profile, user]);

  if (isLoading || !user) return <div className="p-8 space-y-4"><Skeleton className="h-32 w-32 rounded-full mx-auto" /><Skeleton className="h-12 w-full" /></div>;

  const handleSave = async () => {
    // Update user details
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, profileImageUrl }),
    });

    updateProfile(
      { bio, relationshipGoals: goals },
      {
        onSuccess: () => toast({ title: "Saved", description: "Profile updated successfully." }),
        onError: () => toast({ title: "Error", description: "Could not update profile.", variant: "destructive" })
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 px-6 pt-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

      <div className="max-w-xl mx-auto z-10 relative">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
              My <span className="text-primary italic">Identity</span>
            </h1>
            <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Profile & Preferences</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()} className="text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
          </Button>
        </header>

        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <Avatar className="w-40 h-40 border-4 border-white/5 p-1 bg-white/5">
              <AvatarImage src={profileImageUrl || undefined} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">{firstName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
               <Button size="icon" className="rounded-full h-12 w-12 shadow-2xl bg-primary hover:bg-primary/90 border-4 border-black" variant="default">
                 <Camera className="w-5 h-5" />
               </Button>
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold italic">{firstName} {lastName}</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">{user.email}</p>
        </div>

        <Card className="p-8 border-white/5 bg-white/5 rounded-[40px] space-y-8 backdrop-blur-3xl shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">First Name</label>
               <Input 
                 placeholder="First Name" 
                 className="bg-white/5 border-white/10 h-12 rounded-2xl"
                 value={firstName}
                 onChange={(e) => setFirstName(e.target.value)}
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Last Name</label>
               <Input 
                 placeholder="Last Name" 
                 className="bg-white/5 border-white/10 h-12 rounded-2xl"
                 value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
               />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Profile Image URL</label>
            <Input 
              placeholder="https://images.unsplash.com/..." 
              className="bg-white/5 border-white/10 h-12 rounded-2xl font-mono text-xs"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">About Me (Bio)</label>
            <Textarea 
              placeholder="Tell us about yourself..." 
              className="bg-white/5 border-white/10 min-h-[120px] rounded-2xl resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Relationship Goals</label>
            <Input 
              placeholder="e.g. Seeking serious connection" 
              className="bg-white/5 border-white/10 h-12 rounded-2xl"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>

          <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold gap-3 shadow-xl shadow-primary/20" onClick={handleSave} disabled={isPending}>
            <Save className="w-5 h-5" />
            {isPending ? "Syncing..." : "Publish Changes"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
