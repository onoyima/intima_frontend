import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useAIFlirt() {
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.ai.generateFlirt.input>) => {
      const res = await fetch(api.ai.generateFlirt.path, {
        method: api.ai.generateFlirt.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to generate flirt");
      }
      return api.ai.generateFlirt.responses[200].parse(await res.json());
    },
  });
}
