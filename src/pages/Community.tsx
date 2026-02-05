import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Send, ArrowLeft, Sparkles, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { CommunityFeed } from "@/components/CommunityFeed";

import { socket } from "@/lib/socket";
import { useEffect } from "react";

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'rooms' | 'feed'>('rooms');

  useEffect(() => {
    if (selectedRoom) {
      const roomId = `community:${selectedRoom.id}`;
      socket.joinRoom(roomId);
      return () => socket.leaveRoom(roomId);
    }
  }, [selectedRoom]);

  const { data: rooms, isLoading: loadingRooms } = useQuery<any[]>({
    queryKey: ["/api/community/rooms"],
  });

  const { data: messages, isLoading: loadingMessages } = useQuery<any[]>({
    queryKey: [`/api/community/rooms/${selectedRoom?.id}/messages`],
    enabled: !!selectedRoom,
  });

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/community/rooms/${selectedRoom.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      return res.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/community/rooms/${selectedRoom?.id}/messages`] });
    }
  });

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate(message);
  };

  return (
    <div className="min-h-screen bg-black pb-24 px-6 pt-12 overflow-hidden relative text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-bold text-white tracking-tighter mb-2 italic">
                The <span className="text-primary italic">Community</span>
              </h1>
              <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">Connect and share insights</p>
            </div>
            {selectedRoom && (
              <Button variant="ghost" onClick={() => setSelectedRoom(null)} className="text-white/40 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}
          </div>

          {!selectedRoom && (
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 w-fit mb-8">
              <button 
                onClick={() => setActiveTab('rooms')}
                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'rooms' ? 'bg-primary text-white shadow-lg' : 'text-white/40'}`}
              >
                Discovery Rooms
              </button>
              <button 
                onClick={() => setActiveTab('feed')}
                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-primary text-white shadow-lg' : 'text-white/40'}`}
              >
                Social Feed
              </button>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!selectedRoom ? (
            activeTab === 'rooms' ? (
              <motion.div 
                key="rooms"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {rooms?.map((room) => (
                  <Card 
                    key={room.id} 
                    onClick={() => setSelectedRoom(room)}
                    className="p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer rounded-[32px] group overflow-hidden relative"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                    <Globe className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-display font-bold text-white mb-2 italic">{room.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{room.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-white/5 text-white/40 border-white/10 uppercase tracking-widest text-[9px]">
                        <Users className="w-3 h-3 mr-1" /> ACTIVE NOW
                      </Badge>
                    </div>
                  </Card>
                ))}
                
                {(!rooms || rooms.length === 0) && [
                  { id: 1, name: "The First Date", description: "Icebreakers and first-time connection stories." },
                  { id: 2, name: "Spiritual Bonds", description: "Deep values and soul-level matching discussions." },
                  { id: 3, name: "Intimacy Lab", description: "Open conversations about boundaries and health." }
                ].map(room => (
                  <Card 
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className="p-8 border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer rounded-[32px] group"
                  >
                     <MessageSquare className="w-8 h-8 text-primary mb-4" />
                     <h3 className="text-xl font-display font-bold text-white mb-2">{room.name}</h3>
                     <p className="text-xs text-muted-foreground">{room.description}</p>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="feed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <CommunityFeed />
              </motion.div>
            )
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[600px] border border-white/5 bg-card/20 backdrop-blur-3xl rounded-[40px] overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">{selectedRoom.name}</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live Community Chat
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages?.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-1">
                    <p className="text-[9px] font-bold text-primary uppercase ml-1">{msg.user?.firstName}</p>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-sm text-white/80">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {(!messages || messages.length === 0) && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-white text-sm">
                    No messages yet. Be the first to spark a conversation.
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/5">
                <div className="flex gap-4">
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a public message..."
                    className="bg-black/40 border-white/5 h-12 rounded-xl text-white"
                  />
                  <Button onClick={handleSend} disabled={sendMutation.isPending} className="w-12 h-12 rounded-xl bg-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[9px] text-white/20 mt-3 text-center uppercase tracking-[0.2em] font-bold">
                  Community Moderation Active • Be Respectful
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
