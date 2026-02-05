import { useState } from "react";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Dating() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 tracking-tighter">
              Discover <span className="text-primary italic">Lust & Love</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-curated connections based on your intimacy styles.
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl gap-2 text-white">
                  <UserCircle className="w-5 h-5 text-primary" />
                  My Preferences
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/90 backdrop-blur-3xl border-white/10 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-white italic">Intimacy Identity</DialogTitle>
                </DialogHeader>
                <ProfileForm onSuccess={() => setIsSetupOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Discovery Feed */}
        <DiscoveryFeed />
      </div>
    </div>
  );
}
