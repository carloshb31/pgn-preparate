// Build de un solo archivo para publicar la plataforma como artifact de Claude.
// Uso: npm run build:artifact  →  dist-artifact/pgn-preparate.html
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

const src = path.resolve(__dirname, "src");

export default defineConfig({
  root: path.resolve(src, "artifact"),
  plugins: [react(), viteSingleFile()],
  define: {
    "process.env": JSON.stringify({ NODE_ENV: "production", NEXT_PUBLIC_DESTINO: "artifact" })
  },
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: path.resolve(src, "artifact/shims/link.tsx") },
      { find: /^next\/navigation$/, replacement: path.resolve(src, "artifact/shims/navigation.ts") },
      { find: /^@\/lib\/data\/supabase$/, replacement: path.resolve(src, "artifact/shims/supabase-stub.ts") },
      { find: /^server-only$/, replacement: path.resolve(src, "artifact/shims/supabase-stub.ts") },
      { find: /^@\//, replacement: src + "/" }
    ]
  },
  css: { postcss: path.resolve(__dirname) },
  build: {
    outDir: path.resolve(__dirname, "dist-artifact"),
    emptyOutDir: true,
    target: "es2020",
    chunkSizeWarningLimit: 5000,
    rollupOptions: {
      onwarn(w, warn) {
        if (w.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(w);
      }
    }
  }
});
