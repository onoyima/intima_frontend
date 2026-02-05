import { useCouples } from "@/hooks/use-couples";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, Heart, Sparkles, Wand2, Shield, Settings, 
  Zap, MessageSquare, Gamepad2, Video, Phone, Info, BookOpen
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AIFlirtModal } from "@/components/AIFlirtModal";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { PairingScreen } from "@/components/PairingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { PrivacyGuard } from "@/components/PrivacyGuard";
import { GameEngine } from "@/components/GameEngine";
import { FantasyBuilder } from "@/components/FantasyBuilder";
import { MemoryVault } from "@/components/MemoryVault";
import { LiveInteraction } from "@/components/LiveInteraction";
import { MediaVault } from "@/components/MediaVault";

const MODES = [
  { id: "romantic", label: "Romantic", icon: Heart, color: "text-pink-400" },
  { id: "playful", label: "Playful", icon: Zap, color: "text-blue-400" },
  { id: "erotic", label: "Erotic", icon: Sparkles, color: "text-purple-500" },
  { id: "healing", label: "Healing", icon: Shield, color: "text-green-400" },
];

export default function Couple() {
  const { user } = useAuth();
  const { data: couples, isLoading: loadingCouples } = useCouples();
  const activeCouple = couples?.[0]; 
  const { data: messages, isLoading: loadingMessages } = useMessages(activeCouple?.id || 0);
  const { mutate: sendMessage, isPending: sending } = useSendMessage(activeCouple?.id || 0);
  const [inputText, setInputText] = useState("");
  const [activeMode, setActiveMode] = useState("romantic");
  const [view, setView] = useState<'chat' | 'games' | 'live' | 'memories' | 'media'>('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

  const handleSend = (overrideContent?: any) => {
    const content = typeof overrideContent === 'string' ? overrideContent : inputText;
    if (!content.trim()) return;
    sendMessage({ content }, {
      onSuccess: () => typeof overrideContent !== 'string' && setInputText(""),
      onError: () => toast({ title: "Failed", description: "Message not sent", variant: "destructive" })
    });
  };

  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      handleSend("🎤 Voice Note (Recorded)");
    }
    setIsRecording(!isRecording);
  };

  if (loadingCouples) return null;
  if (!activeCouple || !(activeCouple as any).partner) return <div className="min-h-screen pt-24 bg-black"><PairingScreen /></div>;

  const partner = (activeCouple as any).partner;

  return (
    <PrivacyGuard>
      <div className="flex flex-col min-h-screen bg-black relative">
        {/* Mode-specific Background Imagery */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <img 
              src={`/backgrounds/${activeMode}_bg.png`} 
              className="w-full h-full object-cover grayscale-[0.2]" 
              alt="" 
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Background Glow Overlay */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] opacity-10 transition-all duration-1000 z-0 ${
          activeMode === 'romantic' ? 'bg-pink-500' : 
          activeMode === 'playful' ? 'bg-blue-500' :
          activeMode === 'erotic' ? 'bg-purple-600' : 'bg-green-500'
        }`} />

        {/* Header */}
        <header className="px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary/20 p-0.5">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{partner.firstName[0]}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white tracking-tight">{partner.firstName}</h3>
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary flex items-center gap-1">
                <Shield className="w-3 h-3" /> Secure Bond
              </p>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {[
              { id: 'chat', icon: MessageSquare },
              { id: 'games', icon: Gamepad2 },
              { id: 'memories', icon: BookOpen },
              { id: 'media', icon: Shield },
              { id: 'live', icon: Video },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id as any)}
                className={`p-2 px-4 rounded-xl transition-all ${
                  view === t.id ? 'bg-primary text-white shadow-lg' : 'text-white/20 hover:text-white/40'
                }`}
              >
                <t.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 relative overflow-y-auto no-scrollbar z-10 pb-32 md:pb-0">
          <AnimatePresence mode="wait">
            {view === 'chat' && (
              <motion.div 
                key="chat" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col p-6 space-y-6 flex-col-reverse"
                ref={scrollRef}
              >
                {[...(messages || [])].reverse().map((msg, idx) => {
                  const isMe = msg.senderId === user?.id;
                  const isVoice = msg.content.startsWith("🎤");
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl ${
                        isMe ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10' : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                      }`}>
                        {isVoice ? (
                          <div className="flex items-center gap-3 py-1">
                             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                               <Phone className="w-4 h-4 fill-white" />
                             </div>
                             <div className="space-y-1">
                               <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                                  <div className="w-1/2 h-full bg-white" />
                               </div>
                               <p className="text-[10px] font-bold opacity-60">VOICE NOTE • 0:12</p>
                             </div>
                          </div>
                        ) : (
                          <p className="text-sm font-medium">{msg.content}</p>
                        )}
                        <span className="text-[8px] uppercase font-bold opacity-40 mt-1 block tracking-widest">
                          {format(new Date(msg.createdAt!), "HH:mm")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {view === 'games' && (
              <motion.div 
                key="games" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="h-full overflow-y-auto pb-40"
              >
                <div className="p-6 space-y-12">
                  <GameEngine coupleId={activeCouple.id} />
                  <div className="border-t border-white/5 pt-12">
                    <FantasyBuilder />
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'memories' && (
              <motion.div 
                key="memories" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="h-full overflow-y-auto pb-40"
              >
                <MemoryVault coupleId={activeCouple.id} />
              </motion.div>
            )}

            {view === 'media' && (
              <motion.div 
                key="media" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="h-full overflow-y-auto pb-40"
              >
                <MediaVault coupleId={activeCouple.id} partner={partner} />
              </motion.div>
            )}

            {view === 'live' && <LiveInteraction coupleId={activeCouple.id} partner={partner} />}
          </AnimatePresence>
        </main>

        {/* Footer (Only for Chat) */}
        {view === 'chat' && (
          <footer className="p-4 md:p-6 pb-20 md:pb-6 bg-black/60 backdrop-blur-xl border-t border-white/5 sticky bottom-0 z-20">
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              <div className="flex gap-2 justify-center">
                 <Button variant="outline" size="sm" onClick={() => handleSend("Tease me...")} className="rounded-xl border-white/5 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-primary h-8">AI Tease</Button>
                 <Button variant="outline" size="sm" onClick={() => handleSend("Let's talk about our day.")} className="rounded-xl border-white/5 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-green-400 h-8">AI Support</Button>
                 <Button variant="outline" size="sm" onClick={() => handleSend("I'm ready for a game.")} className="rounded-xl border-white/5 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-orange-400 h-8">Request Game</Button>
              </div>
              <div className={`bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 shadow-2xl transition-all ${isRecording ? 'ring-2 ring-red-500/50 scale-[1.02]' : ''}`}>
                <Button 
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-2xl transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10 text-white/40 hover:text-white'}`}
                >
                  <Phone className={`w-5 h-5 ${isRecording ? 'text-white' : ''}`} />
                </Button>
                {!isRecording ? (
                  <Input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Send a whisper...`}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-white text-lg h-12"
                  />
                ) : (
                  <div className="flex-1 flex items-center gap-4 px-4">
                    <div className="flex-1 h-2 bg-red-500/20 rounded-full overflow-hidden">
                       <motion.div 
                        animate={{ x: [-100, 400] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-full bg-red-500" 
                       />
                    </div>
                    <span className="text-red-500 font-bold text-xs animate-pulse">RECORDING...</span>
                  </div>
                )}
                <Button 
                  onClick={handleSend} 
                  disabled={!inputText.trim() || isRecording}
                  className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </footer>
        )}

        {/* Sub-navigation (Only for non-chat views to allow switching back) */}
        {view !== 'chat' && (
          <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
             <Button onClick={() => setView('chat')} className="rounded-full h-12 px-6 bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 text-white font-bold gap-2">
                <MessageSquare className="w-4 h-4" /> Back to Whisper
             </Button>
          </footer>
        )}
      </div>
    </PrivacyGuard>
  );
}
