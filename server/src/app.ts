import { fastify } from 'fastify';
import fastifyCors from '@fastify/cors';
import {
    type ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import { env } from './env';
import registerMongo from "./database/mongo.ts";
import { shortUrl } from './routes/short-url';
import { getShortedUrl } from './routes/get-shorted-url';
import { listUrls } from './routes/list-urls';

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (env.ENVIRONMENT === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Shorten API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "bluePlanet",
    },
  });
}

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
  origin: env.ENVIRONMENT === "development"
    ? ["http://localhost:5173", "http://127.0.0.1:5173"]
    : false,
  methods: ["GET", "POST", "OPTIONS"],
});

// register database and routes
server.register(registerMongo);
server.register(shortUrl);
server.register(getShortedUrl);
server.register(listUrls);

export { server }