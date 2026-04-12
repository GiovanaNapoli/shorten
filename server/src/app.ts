import { fastify } from 'fastify';
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

// register database and routes
server.register(registerMongo);
server.register(shortUrl);
server.register(getShortedUrl);

export { server }