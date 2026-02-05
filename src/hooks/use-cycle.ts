import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useCycleLogs() {
  return useQuery({
    queryKey: [api.cycle.list.path],
    queryFn: async () => {
      const res = await fetch(api.cycle.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cycle logs");
      return api.cycle.list.responses[200].parse(await res.json());
    },
  });
}

export function useLogCycle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.cycle.log.input>) => {
      // Ensure date objects are handled correctly by JSON.stringify
      const res = await fetch(api.cycle.log.path, {
        method: api.cycle.log.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to log cycle data");
      }
      return api.cycle.log.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cycle.list.path] });
    },
  });
}
