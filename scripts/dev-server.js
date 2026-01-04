import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

// Programmatic dev server avoids esbuild trying to parse a config file path that includes "*".
const server = await createServer({
  root,
  configFile: false,
  plugins: [react()],
  server: {
    port: 5173,
  },
});

await server.listen();
server.printUrls();
