import { z } from "zod";
import { getNiches, type NicheId } from "./content-engine";

const nicheIds = getNiches().map((item) => item.id) as [NicheId, ...NicheId[]];

export const nicheSchema = z.enum(nicheIds);

export const generateRequestSchema = z.object({
  niche: nicheSchema,
  ideaId: z.string().trim().min(1).max(160),
});

export const savePostSchema = z.object({
  ideaId: z.string().trim().min(1).max(160),
  niche: nicheSchema,
  title: z.string().trim().min(1).max(220),
  postText: z.string().trim().min(1).max(12000),
});

export const affiliateClickSchema = z.object({
  destinationUrl: z.string().url().max(2048),
  source: z.string().trim().min(1).max(80),
  provider: z.string().trim().min(1).max(40),
});

export function normalizeNiche(value: unknown): NicheId | null {
  const result = nicheSchema.safeParse(value);
  return result.success ? result.data : null;
}
