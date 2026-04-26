import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { env } from "../env.ts";

export const listUrls: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/history",
    {
      schema: {
        tags: ["Short URL"],
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).default(10),
        }),
        response: {
          200: z
            .object({
              items: z.array(
                z.object({
                  longUrl: z.string().url(),
                  shortUrl: z.string().url(),
                })
              ),
              meta: z.object({
                page: z.number().int(),
                limit: z.number().int(),
                total: z.number().int(),
                totalPages: z.number().int(),
              }),
            })
            .describe("Paginated list of shortened URLs"),
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Get total count
      const total = await server.mongo.db.collection("urls").countDocuments();

      // Get paginated URLs, ordered by most recent first
      const urls = await server.mongo.db
        .collection("urls")
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      // Build items with complete shortUrl
      const items = urls.map((url) => ({
        longUrl: url.longUrl,
        shortUrl: `${env.BASE_URL}/${url.shortCode}`,
      }));

      return reply.status(200).send({
        items,
        meta: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    }
  );
};
