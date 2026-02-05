import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaGoogle, FaApple } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AuthPage() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleAppleLogin = () => {
    // Apple login logic will go here
    window.location.href = "/api/auth/apple";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src="/logo.png" 
            alt="INTIMA∞ Logo" 
            className="w-32 h-32 mb-6 drop-shadow-[0_0_15px_rgba(255,0,255,0.3)]"
          />
          <h1 className="text-5xl font-display font-bold text-white mb-2 tracking-tighter italic">
            INTIMA<span className="text-primary italic">∞</span>
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">
            The Ultimate Relationship Ecosystem
          </p>
        </div>

        <Card className="p-8 border-white/5 bg-card/40 backdrop-blur-2xl shadow-2xl rounded-3xl">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-14 bg-white text-black hover:bg-white/90 text-lg font-semibold rounded-2xl flex items-center justify-center gap-3"
            >
              <FaGoogle className="text-xl" />
              Continue with Google
            </Button>

            <Button
              onClick={handleAppleLogin}
              className="w-full h-14 bg-black border border-white/10 text-white hover:bg-white/5 text-lg font-semibold rounded-2xl flex items-center justify-center gap-3"
            >
              <FaApple className="text-xl" />
              Continue with Apple
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed">
              By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
