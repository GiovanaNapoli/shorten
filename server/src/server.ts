import { server } from "./app.ts";
import { env } from "./env.ts";

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
