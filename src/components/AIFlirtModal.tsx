import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAIFlirt } from "@/hooks/use-ai";
import { useToast } from "@/hooks/use-toast";

interface AIFlirtModalProps {
  onSelect?: (text: string) => void;
  trigger?: React.ReactNode;
}

export function AIFlirtModal({ onSelect, trigger }: AIFlirtModalProps) {
  const [tone, setTone] = useState<"romantic" | "playful" | "spicy" | "intellectual">("romantic");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const { mutate, isPending } = useAIFlirt();
  const { toast } = useToast();

  const handleGenerate = () => {
    mutate(
      { tone, recipientContext: context },
      {
        onSuccess: (data) => setResult(data.text),
        onError: () => toast({ title: "Error", description: "Failed to generate AI response", variant: "destructive" }),
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copied!", description: "Flirt copied to clipboard." });
    if (onSelect) onSelect(result);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Assist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-display">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            Cupid's Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tone</label>
            <Select value={tone} onValueChange={(v: any) => setTone(v)}>
              <SelectTrigger className="bg-background/50 border-white/10">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="romantic">Romantic & Sweet</SelectItem>
                <SelectItem value="playful">Playful & Fun</SelectItem>
                <SelectItem value="spicy">Spicy & Bold</SelectItem>
                <SelectItem value="intellectual">Intellectual & Deep</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Context (Optional)</label>
            <Textarea 
              placeholder="e.g., Mentioning our date last night..." 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="bg-background/50 border-white/10 resize-none"
            />
          </div>

          {result && (
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 relative animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm italic text-foreground/90 pr-8">{result}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-primary"
                onClick={handleCopy}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/20"
            onClick={handleGenerate}
            disabled={isPending}
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {result ? "Regenerate Magic" : "Generate Magic"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
