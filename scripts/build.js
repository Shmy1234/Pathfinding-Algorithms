import { build } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

// Programmatic build to sidestep config-path glob issues.
await build({
  root,
  configFile: false,
  plugins: [react()],
});
