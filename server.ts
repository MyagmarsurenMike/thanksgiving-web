import { createServer } from "http";
import next from "next";
import { getIO, initSocket } from "./lib/socket";

const HOSTNAME = "localhost";
const PORT = 3000;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, port: PORT, hostname: HOSTNAME });
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler);

  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server listening on http://${HOSTNAME}:${PORT}`);
  });
});
