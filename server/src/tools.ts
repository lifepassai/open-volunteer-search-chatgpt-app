import { z } from "zod";
import {
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { widgets, widgetDescriptorMeta } from "./widgets.js";


const toolInputSchema = {
  type: "object",
  properties: {
    geolocation: {
      type: "object",
      properties: {
        latitude: {
          type: "number",
          description: "The latitude of the geolocation"
        },
        longitude: {
          type: "number",
          description: "The longitude of the geolocation"
        }
      },
      required: ["latitude", "longitude"],
      description: "The geolocation of the user"
    },
    keywords: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Keywords and descriptive words that represent what the user is looking for in a volunteering opportunity. Include any descriptive terms from the user's request that have NOT been captured in other specific fields (skills, workLocation, timeCommitment, etc.)"
    },
    flexibleHours: {
      type: "boolean",
      description: "Whether the user is looking for a volunteering opportunity that has flexible hours",
    },
    workLocation: {
      type: "string",
      enum: ["remote", "in-person"],
      description: "Whether the user is looking for a volunteering opportunity that can be done remotely or must be in-person",
    },
    timeCommitment: {
      type: "string",
      enum: ["ongoing", "one-time"],
      description: "Whether the user is looking for a volunteering opportunity that is ongoing or one-time"
    },
    distance: {
      type: "number",
      description: "The maximum distance in kilometers that the user is willing to travel to the volunteering opportunity"
    },
    skills: {
      type: "array",
      items: {
        type: "string",
        enum: ["mental health", "well-being", "family", "child-care", "animals", "environment", "education", "health", "community", "arts", "culture", "sports", "technology", "business"],
      },
      description: "The skills the volunteer can offer in a volunteering opportunity"
    },
    age: {
      type: "number",
      description: "The age of the volunteer"
    },
  },
  required: [],
  additionalProperties: false,
} as const;

export const toolInputParser = z.object({
  geolocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  keywords: z.array(z.string()).optional(),
  flexibleHours: z.boolean().optional(),
  workLocation: z.enum(["remote", "in-person"]).optional(),
  timeCommitment: z.enum(["ongoing", "one-time"]).optional(),
  distance: z.number().optional(),
  skills: z.array(z.string()).optional(),
  age: z.number().optional(),
});

export const tools: Tool[] = widgets.map((widget) => ({
  name: widget.id,
  description: widget.title,
  inputSchema: toolInputSchema,
  title: widget.title,
  _meta: widgetDescriptorMeta(widget),
  // To disable the approval prompt for the widgets
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
}));
