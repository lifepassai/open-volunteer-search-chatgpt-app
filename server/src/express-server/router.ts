import { Router } from 'express';
import {
    DEFAULT_MCP_INITIALIZE_RESPONSE,
    type JsonRpcRequest,
    type JsonRpcResponse,
    type JsonRpcRequestContext,
    jrpcError,
    jrpcResult,
    createMcpServiceRouter,
} from '@agentic-profile/a2a-mcp-express';
import { tools } from '../tools.js';
import {
    resources, 
    //resourceTemplates
} from "../resources.js";
import { loadFileAsString } from '../www-path.js';
import log from "loglevel";
import { handleJrpcQuery } from '../mcp-query.js';


/** Dummy session store for when no auth is used. */
const store: any = {
    async createClientAgentSession() {
        return 1;
    },
    async fetchClientAgentSession() {
        return undefined;
    },
    async updateClientAgentSession() {},
};

/** Dummy DID resolver that returns a minimal document for any DID. */
const didResolver = {
    resolve: async (didUrl: string) => ({
        didResolutionMetadata: {},
        didDocument: { id: didUrl },
        didDocumentMetadata: {},
    }),
};

export function createMcpRouter(): Router {
    return createMcpServiceRouter({
        store,
        didResolver: didResolver as any,
        handlers: {
            toolsCall: handleToolsCall,
            resourcesRead: handleReadResource
        },
        initializeResponse: INITIALIZE_RESPONSE,
        lists: {
            tools,
            resources
        }
    });
}

const INITIALIZE_RESPONSE = {
    ...DEFAULT_MCP_INITIALIZE_RESPONSE,
    "serverInfo": {
        "name": "Presence Service",
        "title": "Find nearby people",
        "version": "1.0.0"
    }
};

export async function handleToolsCall(request: JsonRpcRequest, context: JsonRpcRequestContext): Promise<JsonRpcResponse> {
    const { name } = request.params || {};
    console.log('🔍 handleToolsCall', name);

    switch (name) {
        case 'volunteering-opportunity-map':
            return await queryVolunteerOpportunities(request, context);
        default:
            return jrpcError(request.id, -32601, `Tool ${name} not found`);
    }
}

async function queryVolunteerOpportunities(request: JsonRpcRequest, _context: JsonRpcRequestContext): Promise<JsonRpcResponse> {
    const result = await handleJrpcQuery(request);
    return jrpcResult(request.id, result);
}

async function handleReadResource(request: JsonRpcRequest, _context: JsonRpcRequestContext): Promise<JsonRpcResponse | null> {
    const { uri } = request.params || {};
    console.log('🔍 handleReadResource', uri);
    
    const prefix = "ui://widget/";
    if (!uri.startsWith(prefix)) {
        return jrpcError(request.id, -32601, `Invalid resource URI: ${uri}`);
    }

    const pathname = uri.substring(prefix.length);
    console.log( `pathname: ${pathname}` );

    const { text, contentType } = await loadFileAsString(pathname);
    if( contentType !== "text/html")
        log.warn(`Content type ${contentType} is not supported for resource ${uri}`);

    return jrpcResult(request.id, {
        contents: [
            {
                uri,
                mimeType: "text/html+skybridge",
                text,
            },
        ],
    });
}

/*
{
  "result": {
    "resources": [
      {
        "uri": "ui://widget/volunteering-opportunity-map.html",
        "name": "Show Volunteering Opportunity Map",
        "description": "Show Volunteering Opportunity Map widget markup",
        "mimeType": "text/html+skybridge",
        "_meta": {
          "openai/outputTemplate": "ui://widget/volunteering-opportunity-map.html",
          "openai/toolInvocation/invoking": "Creating a map of volunteering opportunities",
          "openai/toolInvocation/invoked": "Your map is ready!",
          "openai/widgetAccessible": true
        }
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 1
}

        contents: [
          {
            uri: widget.templateUri,
            mimeType: "text/html+skybridge",
            text: widget.html,
            _meta: widgetDescriptorMeta(widget),
          },
        ],
*/
