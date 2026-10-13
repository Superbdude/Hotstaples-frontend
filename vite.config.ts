import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
  server: { host: true, port: 8080, strictPort: true },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({ spa: { enabled: true }, server: { entry: "server" } }),
    react(),
  ],
});

