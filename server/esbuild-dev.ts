import { type Express } from "express";
import { type Server } from "http";
import express from "express";
import path from "path";
// @ts-ignore - esbuild.config.js doesn't have type definitions
import { watch } from "../esbuild.config.js";
import fs from "fs";

export async function setupEsbuildDev(server: Server, app: Express) {
  console.log('🔨 Starting esbuild in watch mode...');

  // Start esbuild watch mode
  await watch();

  // Serve static files from dist/public
  // Use process.cwd() to get the project root reliably
  const distPath = path.join(process.cwd(), "dist", "public");

  console.log('📁 Serving static files from:', distPath);

  // Check if directory exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist/public directory not found at:', distPath);
    throw new Error(`Build directory not found: ${distPath}`);
  }

  // Log what files are available
  const files = fs.readdirSync(distPath);
  console.log('📄 Available files:', files.join(', '));

  app.use(express.static(distPath));

  // Fallback to index.html for client-side routing
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  console.log('✅ esbuild dev server ready');
}
