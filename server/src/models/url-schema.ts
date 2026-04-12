import { ObjectId } from "mongodb";
import z from "zod";

const objectIdSchema = z.instanceof(ObjectId);

export const UrlSchema = z.object({
  _id: objectIdSchema,
  longUrl: z.string().url(),
  shortCode: z.string().length(7),
  createdAt: z.date().default(() => new Date()),
});

export type Url = z.infer<typeof UrlSchema>;