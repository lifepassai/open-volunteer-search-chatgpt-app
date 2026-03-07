import { IncomingMessage, ServerResponse } from "node:http";
import { loadFile } from "../www-path.js";

export async function serveStaticFile(req: IncomingMessage, res: ServerResponse) {
    console.log(`serving static file for: ${req.url}`);
    if (!req.url) return false;

    try {
        const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
        let pathname = url.pathname;

        if (pathname === "/") {
            pathname = "/index.html";
        }

        const { content, contentType } = await loadFile(pathname);

        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": content.length,
            "Access-Control-Allow-Origin": "*",
        });
        res.end(content);
        return true;
    } catch (error) {
        // File not found or other error
        console.error(`Error serving static file: ${error}`);
        return false;
    }
}
