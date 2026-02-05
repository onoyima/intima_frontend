import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProfileSchema, type InsertProfile } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const INTERESETS_OPTIONS = ["Slow & Passionate", "Playful & Kinky", "Deep Conversations", "Physical Touch", "Adventure", "Netflix & Chill"];

export function ProfileForm({ defaultValues, onSuccess }: { defaultValues?: any, onSuccess?: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: defaultValues || {
      bio: "",
      gender: "",
      orientation: "",
      interests: [],
      relationshipGoals: "dating",
      isPublic: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: InsertProfile) => {
      const res = await fetch(api.profiles.update.path, {
        method: api.profiles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profiles.get.path.replace(":userId", user!.id)] });
      toast({ title: "Profile Updated", description: "Your identity has been saved to the ecosystem." });
      onSuccess?.();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  value={field.value || ""}
                  placeholder="Tell the world who you are..." 
                  className="bg-white/5 border-white/10 min-h-[120px] resize-none text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Interests</FormLabel>
          <div className="grid grid-cols-2 gap-3">
            {INTERESETS_OPTIONS.map((interest) => (
              <FormField
                key={interest}
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(interest)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const updated = checked 
                            ? [...current, interest]
                            : current.filter((i: string) => i !== interest);
                          field.onChange(updated);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-medium cursor-pointer">{interest}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20"
        >
          {mutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
