import dotenv from 'dotenv/config';
import log from "loglevel";

log.setLevel( process.env.LOG_LEVEL ?? "trace" );
console.log( "log level", log.getLevel() );

import httpServer, { ssePath, postPath } from './src/mcp-sdk-server/mcp-sdk-server.ts';
import { app } from './src/express-server/express-server.ts';

const port = process.env.PORT || 3003;

if( process.env.USE_MCP_SDK !== 'true' ) {
    log.info(`Using Express server on port ${port}`);

    app.listen(port, () => {
        log.info(`Listening on http://localhost:${port}`);
    });
} else {
    log.info(`Using MCP SDK server on port ${port}`);

    httpServer.on("clientError", (err, socket) => {
        log.error("HTTP client error", err);
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });

    httpServer.listen(port, () => {
        log.info(`Open Volunteer MCP server listening on http://localhost:${port}`);
        log.info(`  SSE stream: GET http://localhost:${port}${ssePath}`);
        log.info(
            `  Message post endpoint: POST http://localhost:${port}${postPath}?sessionId=...`
        );
    });
}
  
