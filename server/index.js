// Force stdout to flush immediately in Lambda (avoids lost logs when callbackWaitsForEmptyEventLoop=false)
if (process.env.AWS_LAMBDA_FUNCTION_NAME && process.stdout._handle?.setBlocking) {
    process.stdout._handle.setBlocking(true);
    process.stderr._handle?.setBlocking(true);
}

import log from "loglevel";
import serverlessExpress from "@codegenie/serverless-express";
import { app } from "./dist/express-server/express-server.js";

log.setLevel( process.env.LOG_LEVEL || "info" );
console.log( "log level", log.getLevel() );

const seHandler = serverlessExpress({ app });

export function handler(event, context, callback ) {
    context.callbackWaitsForEmptyEventLoop = false;

    // fall through to the serverless express handler
    return seHandler( event, context, callback );
}
