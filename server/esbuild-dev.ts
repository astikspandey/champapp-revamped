import { type Express } from "express";
import { type Server } from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { watch } from "../esbuild.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupEsbuildDev(server: Server, app: Express) {
  console.log('🔨 Starting esbuild in watch mode...');

  // Start esbuild watch mode
  await watch();

  // Serve static files from dist/public
  const distPath = path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(distPath));

  // Fallback to index.html for client-side routing
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  console.log('✅ esbuild dev server ready');
}
