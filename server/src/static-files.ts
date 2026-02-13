import { IncomingMessage, ServerResponse } from "node:http";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, stat } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "../../widget/dist");

const MIME_TYPES: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".ico": "image/x-icon",
};

export async function serveStaticFile(req: IncomingMessage, res: ServerResponse) {
    console.log(`serving static file for: ${req.url}`);
    if (!req.url) return false;

    try {
        const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
        let pathname = url.pathname;

        if (pathname === "/") {
            pathname = "/index.html";
        }

        const filePath = join(DIST_DIR, pathname);

        // Security: Ensure path is within DIST_DIR
        if (!filePath.startsWith(DIST_DIR)) {
            console.log(`Security check failed: ${filePath} does not start with ${DIST_DIR}`);
            return false;
        }

        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) {
            return false;
        }

        const content = await readFile(filePath);
        const ext = extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": content.length,
            "Access-Control-Allow-Origin": "*",
        });
        res.end(content);
        return true;
    } catch (error) {
        // File not found or other error
        return false;
    }
}