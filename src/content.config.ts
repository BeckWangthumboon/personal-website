import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    sortOrder: z.number().int().optional(),
    repoUrl: z.string().url().optional(),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
