import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, EyeOff } from "lucide-react";

export function PrivacyGuard({ children }: { children: React.ReactNode }) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    
    // Detect window blur (user switching tabs/apps)
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    const logIncident = async () => {
      try {
        await fetch("/api/security/logAudit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            eventType: "SCREENSHOT_ATTEMPT", 
            details: "System detected a potential screenshot or recording action." 
          }),
        });
      } catch (err) {
        console.error("Failed to log privacy incident", err);
      }
    };

    // Detect print screen / screenshot keys (best effort)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        setIsBlurred(true);
        logIncident();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className={isBlurred ? "blur-3xl grayscale transition-all duration-500 pointer-events-none" : "transition-all duration-500"}>
        {children}
      </div>
      
      <AnimatePresence>
        {isBlurred && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <ShieldAlert className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2 italic">Privacy Shield Active</h2>
            <p className="text-muted-foreground text-sm max-w-xs uppercase tracking-widest font-bold leading-relaxed">
              Content is hidden while you are away or attempting a capture.
            </p>
            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <EyeOff className="w-4 h-4 text-white/40" />
              <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Encryption Protected</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
