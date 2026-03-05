import dotenv from 'dotenv/config';
import log from "loglevel";
import httpServer, { ssePath, postPath } from './src/server.ts';

log.setLevel( process.env.LOG_LEVEL ?? "trace" );
console.log( "log level", log.getLevel() );

/*
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.info(`Matchwise Agents REST API listening on http://localhost:${port}`);
});
*/

const port = process.env.PORT || 3003;
httpServer.on("clientError", (err, socket) => {
    console.error("HTTP client error", err);
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

httpServer.listen(port, () => {
    console.log(`Open Volunteer MCP server listening on http://localhost:${port}`);
    console.log(`  SSE stream: GET http://localhost:${port}${ssePath}`);
    console.log(
        `  Message post endpoint: POST http://localhost:${port}${postPath}?sessionId=...`
    );
});
  
