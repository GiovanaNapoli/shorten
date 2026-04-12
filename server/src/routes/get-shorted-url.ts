import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getShortedUrl: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/:shortCode",
    {
      schema: {
        tags: ["Short URL"],
        params: z.object({
          shortCode: z.string().length(7),
        }),
        response: {
          301: z
            .object({ longUrl: z.string().url() })
            .describe("Redirect to the original URL"),
          404: z
            .object({ message: z.string() })
            .describe("Short URL not found"),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      const url = await server.mongo.db
        .collection("urls")
        .findOne({ shortCode });

      if (!url) {
        return reply.status(404).send({ message: "Short URL not found" });
      }

      return reply.status(301).redirect(url.longUrl);
    },
  );
};
