import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


type Widget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  responseText: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const DIST_DIR = path.resolve(ROOT_DIR, "widget", "dist");

function readWidgetHtml(componentName: string): string {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(
      `Widget assets not found. Expected directory ${DIST_DIR}. Run "pnpm run build" before starting the server.`
    );
  }

  const directPath = path.join(DIST_DIR, `${componentName}.html`);
  let htmlContents: string | null = null;

  if (fs.existsSync(directPath)) {
    htmlContents = fs.readFileSync(directPath, "utf8");
  } else {
    const candidates = fs
      .readdirSync(DIST_DIR)
      .filter(
        (file) => file.startsWith(`${componentName}-`) && file.endsWith(".html")
      )
      .sort();
    const fallback = candidates[candidates.length - 1];
    if (fallback) {
      htmlContents = fs.readFileSync(path.join(DIST_DIR, fallback), "utf8");
    }
  }

  if (!htmlContents) {
    throw new Error(
      `Widget HTML for "${componentName}" not found in ${DIST_DIR}. Run "pnpm run build" to generate the assets.`
    );
  }

  return htmlContents;
}

export function widgetDescriptorMeta(widget: Widget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": true,
  } as const;
}

export function widgetInvocationMeta(widget: Widget) {
  return {
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
  } as const;
}

export const widgets: Widget[] = [
  {
    id: "volunteering-opportunity-map",
    title: "Show Volunteering Opportunity Map",
    templateUri: "ui://widget/volunteering-opportunity-map.html",
    invoking: "Creating a map of volunteering opportunities",
    invoked: "Your map is ready!",
    html: readWidgetHtml("index"),
    responseText: "Here is a map of volunteering opportunities!",
  }
  /*,
  {
    id: "pizza-carousel",
    title: "Show Pizza Carousel",
    templateUri: "ui://widget/pizza-carousel.html",
    invoking: "Carousel some spots",
    invoked: "Served a fresh carousel",
    html: readWidgetHtml("pizzaz-carousel"),
    responseText: "Rendered a pizza carousel!",
  },
  {
    id: "pizza-albums",
    title: "Show Pizza Album",
    templateUri: "ui://widget/pizza-albums.html",
    invoking: "Hand-tossing an album",
    invoked: "Served a fresh album",
    html: readWidgetHtml("pizzaz-albums"),
    responseText: "Rendered a pizza album!",
  },
  {
    id: "pizza-list",
    title: "Show Pizza List",
    templateUri: "ui://widget/pizza-list.html",
    invoking: "Hand-tossing a list",
    invoked: "Served a fresh list",
    html: readWidgetHtml("pizzaz-list"),
    responseText: "Rendered a pizza list!",
  },
  {
    id: "pizza-shop",
    title: "Open Pizzaz Shop",
    templateUri: "ui://widget/pizza-shop.html",
    invoking: "Opening the shop",
    invoked: "Shop opened",
    html: readWidgetHtml("pizzaz-shop"),
    responseText: "Rendered the Pizzaz shop!",
  },*/
];

export const widgetsById = new Map<string, Widget>();
export const widgetsByUri = new Map<string, Widget>();

widgets.forEach((widget) => {
  widgetsById.set(widget.id, widget);
  widgetsByUri.set(widget.templateUri, widget);
});
