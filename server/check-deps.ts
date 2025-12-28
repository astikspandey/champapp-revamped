import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Check if dependencies are installed and install them if needed
 */
export async function checkAndInstallDependencies() {
  const rootDir = join(__dirname, "..");
  const nodeModulesPath = join(rootDir, "node_modules");
  const packageJsonPath = join(rootDir, "package.json");

  // Check if package.json exists
  if (!existsSync(packageJsonPath)) {
    console.error("❌ package.json not found!");
    return;
  }

  // Check if node_modules exists
  if (!existsSync(nodeModulesPath)) {
    console.log("📦 Dependencies not found. Installing...");
    console.log("⏳ This may take a few minutes on first run...\n");

    try {
      // Run npm install
      execSync("npm install", {
        cwd: rootDir,
        stdio: "inherit",
      });

      console.log("\n✅ Dependencies installed successfully!\n");
    } catch (error) {
      console.error("\n❌ Failed to install dependencies:", error);
      console.error("Please run 'npm install' manually.");
      process.exit(1);
    }
  } else {
    // Quick check if essential dependencies are present
    const essentialDeps = [
      "express",
      "express-session",
      "react",
      "esbuild",
    ];

    const missingDeps = essentialDeps.filter(
      (dep) => !existsSync(join(nodeModulesPath, dep))
    );

    if (missingDeps.length > 0) {
      console.log(`📦 Missing dependencies detected: ${missingDeps.join(", ")}`);
      console.log("⏳ Installing missing dependencies...\n");

      try {
        execSync("npm install", {
          cwd: rootDir,
          stdio: "inherit",
        });

        console.log("\n✅ Dependencies installed successfully!\n");
      } catch (error) {
        console.error("\n❌ Failed to install dependencies:", error);
        console.error("Please run 'npm install' manually.");
        process.exit(1);
      }
    }
  }
}
