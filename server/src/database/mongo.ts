import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { MongoClient, type Db } from "mongodb";

declare module "fastify" {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
    };
  }
}

async function registerMongo(app: FastifyInstance) {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  const client = new MongoClient(mongoUri);

  await client.connect();

  const db = client.db();
  await db.collection("urls").createIndex({ shortCode: 1 }, { unique: true });

  app.decorate("mongo", {
    client,
    db,
  });

  app.addHook("onClose", async () => {
    await client.close();
  });
}

export default fp(registerMongo);
