import type { JsonRpcRequest } from "@agentic-profile/a2a-mcp-express";
import { widgetsById } from "./widgets.js";
import { widgetDescriptorMeta } from "./widgets.js";
import { toolInputParser } from "./tools.js";
import { queryVolunteerOpportunities, type VolunteerOpportunitiesQuery } from "./query.js";


export async function handleJrpcQuery( request: JsonRpcRequest ) {
    const widget = widgetsById.get(request.params.name);
    console.log(`Calling tool: ${JSON.stringify(request)}`);

    if (!widget) {
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
    const _meta = widgetDescriptorMeta(widget);

    try {
        const query = toolInputParser.parse(request.params.arguments ?? {});
        console.log(`Parsed Query: ${JSON.stringify(query, null, 2)}`);
        const opportunities = await queryVolunteerOpportunities(query as VolunteerOpportunitiesQuery);
        console.log(`Query results: ${JSON.stringify({query, opportunities: opportunities.slice(0,3), count: opportunities.length}, null, 2)}`);

        return {
            content: [
                {
                    type: "text",
                    text: widget.responseText,
                },
            ],
            structuredContent: {
                query,
                opportunities,
            },
            _meta,
        };
    } catch (error) {
        console.error("Failed to call tool", error);
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error}`
                },
            ],
            _meta,
        };
    }
}