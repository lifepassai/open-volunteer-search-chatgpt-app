import path, { join } from 'path';
import { dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';

export const wwwPath = process.env.WWW_PATH || "dist/www";

const metaDir = fromMeta( wwwPath );
const cwdDir = fromCwd( wwwPath );

export const wwwDir = metaDir;
console.log(`Found metaDir: ${metaDir} and cwdDir: ${cwdDir}, using ${wwwDir} for wwwDir`);

function fromMeta( wwwPath: string ) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    console.log(`fromMeta _dirname: ${__dirname}`);
    return join(__dirname, wwwPath);
}

function fromCwd( wwwPath: string ) {
    const workingDir = process.cwd();
    console.log(`fromCwd workingDir: ${workingDir}`);
    return path.join(workingDir, wwwPath);
}

interface LoadFileResult {
    content: Buffer | string;
    contentType: string;
}

export async function loadFile( pathname: string ): Promise<LoadFileResult> {
    const filePath = join(wwwDir, pathname);
    console.log(`readFile filePath: ${filePath} from pathname: ${pathname} and wwwDir: ${wwwDir}`);

    // Security: Ensure path is within DIST_DIR
    if (!filePath.startsWith(wwwDir))
        throw new Error(`Security check failed: ${filePath} does not start with ${wwwDir}`);

    const fileStat = await stat(filePath);
    if (!fileStat.isFile())
        throw new Error(`File is not a file: ${filePath}`);

    const content = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return {
        content,
        contentType,
    }
}

export async function loadFileAsString( pathname: string ) {
    const { content, contentType } = await loadFile(pathname);
    return {
        text: content.toString(),
        contentType,
    }
}

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
