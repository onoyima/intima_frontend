import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function CommunityFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPost, setNewPost] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: posts, isLoading } = useQuery<any[]>({
    queryKey: [api.communityFeed.listPosts.path],
    queryFn: async () => {
      const res = await fetch(api.communityFeed.listPosts.path);
      return res.json();
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; imageUrl?: string }) => {
      const res = await fetch(api.communityFeed.createPost.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.communityFeed.listPosts.path] });
      setNewPost("");
      setImageUrl("");
      toast({ title: "Post published!", description: "Your post is now live in the community." });
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.communityFeed.listPosts.path] });
    }
  });

  const [expandedComments, setExpandedComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const { data: comments, refetch: refetchComments } = useQuery<any[]>({
    queryKey: [api.communityFeed.listComments.path, expandedComments],
    queryFn: async () => {
      const res = await fetch(`/api/community/posts/${expandedComments}/comments`);
      return res.json();
    },
    enabled: !!expandedComments,
  });

  const commentMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
      return res.json();
    },
    onSuccess: () => {
      setCommentText("");
      refetchComments();
      queryClient.invalidateQueries({ queryKey: [api.communityFeed.listPosts.path] });
    }
  });

  if (isLoading) return <div className="p-20 text-center text-white/20"><Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />LOADING FEED...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Create Post */}
      <Card className="p-6 border-white/5 bg-white/5 rounded-[32px] overflow-hidden">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback>{user?.firstName?.[0].toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea 
              placeholder="Share an intimacy insight or a playful thought..." 
              className="bg-transparent border-none focus-visible:ring-0 text-lg resize-none p-0 min-h-[100px]"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <Button variant="ghost" size="sm" className="gap-2 text-white/40 hover:text-primary">
                <ImageIcon className="w-4 h-4" />
                Add Image
              </Button>
              <Button 
                disabled={!newPost.trim() || createPostMutation.isPending}
                onClick={() => createPostMutation.mutate({ content: newPost, imageUrl: imageUrl || undefined })}
                className="rounded-2xl px-8 bg-primary hover:bg-primary/90 gap-2"
              >
                <Send className="w-4 h-4" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts?.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-6 border-white/5 bg-white/5 rounded-[32px] space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border border-white/10">
                    <AvatarImage src={post.user.profileImageUrl || undefined} />
                    <AvatarFallback>{(post.user.firstName || '?')[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-white">{post.user.firstName} {post.user.lastName}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <p className="text-white/80 leading-relaxed font-medium">{post.content}</p>

                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/5">
                    <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2">
                  <button 
                    onClick={() => likeMutation.mutate(post.id)}
                    className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${post.likesCount > 0 ? 'fill-red-400 text-red-400' : ''}`} />
                    {post.likesCount}
                  </button>
                  <button 
                    onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-primary transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {post.commentsCount}
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments === post.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 border-t border-white/5 space-y-4"
                  >
                    <div className="space-y-3">
                       {comments?.map((c) => (
                         <div key={c.id} className="flex gap-3 bg-white/5 p-3 rounded-2xl">
                            <Avatar className="w-8 h-8">
                               <AvatarImage src={c.user.profileImageUrl || undefined} />
                               <AvatarFallback>{c.user.firstName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                               <p className="text-[10px] font-bold text-primary">{c.user.firstName}</p>
                               <p className="text-xs text-white/80">{c.content}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="flex gap-2">
                       <Input 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..." 
                        className="bg-transparent border-white/10 rounded-xl h-10 text-xs" 
                       />
                       <Button 
                        size="sm" 
                        onClick={() => commentMutation.mutate(post.id)}
                        disabled={!commentText.trim() || commentMutation.isPending}
                        className="rounded-xl px-4"
                       >
                         <Send className="w-3 h-3" />
                       </Button>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
