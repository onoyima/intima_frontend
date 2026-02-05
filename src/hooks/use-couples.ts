import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useCouples() {
  return useQuery({
    queryKey: [api.couples.list.path],
    queryFn: async () => {
      const res = await fetch(api.couples.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch couples");
      return api.couples.list.responses[200].parse(await res.json());
    },
  });
}

export function useCouple(id: number) {
  return useQuery({
    queryKey: [api.couples.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.couples.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch couple");
      return api.couples.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateCouple() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.couples.create.input>) => {
      const res = await fetch(api.couples.create.path, {
        method: api.couples.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error("Failed to create couple connection");
      }
      return api.couples.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.couples.list.path] });
    },
  });
}
