import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useProfiles(filters?: { gender?: string; relationshipGoals?: string }) {
  return useQuery({
    queryKey: [api.profiles.list.path, filters],
    queryFn: async () => {
      let url = api.profiles.list.path;
      if (filters) {
        const params = new URLSearchParams();
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.relationshipGoals) params.append("relationshipGoals", filters.relationshipGoals);
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return api.profiles.list.responses[200].parse(await res.json());
    },
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: [api.profiles.get.path, userId],
    queryFn: async () => {
      const url = buildUrl(api.profiles.get.path, { userId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profiles.get.responses[200].parse(await res.json());
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.profiles.update.input>) => {
      const res = await fetch(api.profiles.update.path, {
        method: api.profiles.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 401) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error("Failed to update profile");
      }
      return api.profiles.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.profiles.list.path] });
      // Invalidate specific profile query if we knew the ID, but for now generic invalidation is safer
    },
  });
}
