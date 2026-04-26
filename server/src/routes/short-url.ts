import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { Url } from "../models/url-schema";
import { encode, objectIdToNumber } from "../utils/crypto.ts";
import { ObjectId } from "mongodb";
import { env } from "../env.ts";

export const shortUrl: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/short",
    {
      schema: {
        tags: ["Short URL"],
        body: z.object({
          longUrl: z.string().url(),
        }),
        response: {
          201: z
            .object({ shortUrl: z.string().url() })
            .describe("Url shortened successfully"),
          400: z
            .object({ message: z.string() })
            .describe("Invalid URL provided"),
        },
      },
    },
    async (request, reply) => {
      const { longUrl } = request.body;

      if (!longUrl) {
        return reply.status(400).send({ message: "longUrl is required" });
      }

      if (z.string().url().safeParse(longUrl).success === false) {
        return reply.status(400).send({ message: "Invalid URL provided" });
      }

      const _id = new ObjectId();

      const shortCode = encode(objectIdToNumber(_id));
      const newUrl: Url = { _id, longUrl, shortCode, createdAt: new Date() };
      await server.mongo.db.collection("urls").insertOne(newUrl);
      const shortUrl = `${env.BASE_URL}/${shortCode}`;
      return reply.status(201).send({
        shortUrl,
      });
    },
  );
};
