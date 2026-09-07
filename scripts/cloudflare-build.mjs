import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const run = (command, args) => {
  execFileSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });
};

const workerName = process.env.CLOUDFLARE_WORKER_NAME || "ide-posting-fb";

// Cloudflare's current Next.js path is vinext. Initialize the Worker
// configuration inside the build so dashboard-based Workers Builds and
// GitHub Actions use the same deterministic setup.
run("npx", ["--yes", "vinext@latest", "init", "--skip-check", "--platform=cloudflare"]);

const configPath = "wrangler.jsonc";
if (!existsSync(configPath)) {
  throw new Error("vinext init did not create wrangler.jsonc");
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.name = workerName;
config.preview_urls = true;
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

console.log(`Cloudflare Worker configured: ${workerName}`);
run("npx", ["--yes", "vinext@latest", "build"]);
