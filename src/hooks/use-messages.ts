import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useMessages(coupleId: number) {
  return useQuery({
    queryKey: [api.messages.list.path, coupleId],
    queryFn: async () => {
      const url = buildUrl(api.messages.list.path, { coupleId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    enabled: !!coupleId,
    refetchInterval: 3000, // Simple polling for real-time feel
  });
}

export function useSendMessage(coupleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.messages.send.input>) => {
      const url = buildUrl(api.messages.send.path, { coupleId });
      const res = await fetch(url, {
        method: api.messages.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      return api.messages.send.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.messages.list.path, coupleId] });
    },
  });
}
