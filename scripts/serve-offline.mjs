import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)), "out");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function insideRoot(file) {
  const target = resolve(file);
  return target === root || target.startsWith(root + sep);
}

async function read(file) {
  if (!insideRoot(file)) return null;
  try {
    return await readFile(file);
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const relative = decodeURIComponent(url.pathname).replace(/^[/\\]+/, "");
  const base = resolve(root, relative);
  const candidates = [base, join(base, "index.html")];
  if (!base.endsWith(".html")) candidates.push(`${base}.html`);

  for (const file of candidates) {
    const body = await read(file);
    if (!body) continue;
    response.writeHead(200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    response.end(body);
    return;
  }

  const missing = await read(join(root, "404.html"));
  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  response.end(missing ?? "Not found");
});

function localAddresses() {
  const addresses = [];
  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.internal || entry.family !== "IPv4") continue;
      addresses.push(entry.address);
    }
  }
  return addresses;
}

server.listen(port, "0.0.0.0", () => {
  console.log(`This computer: http://127.0.0.1:${port}`);
  for (const address of localAddresses()) {
    console.log(`Other computers on this network: http://${address}:${port}`);
  }
});
