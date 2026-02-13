# Open Volunteer ChatGPT UI

Open Volunteer Opportunity Search MCP service supporting Chat GPT UI/App

## Prerequisites

- Node.js 18+
- pnpm
- Clone the repo: git clone <TBD>


## Build the React app/widget assets

```bash
cd widget
pnpm install
pnpm build
```

To test the local React/widget build:

```bash
pnpm dev
```


## Start the MCP server

1. Start Ngrok port forwarding to determine the base URL

```bash
ngrok http 8000
```

    Remember the forwarding URL

2. Rebuild the widget with the BASE_URL from ngrok

```bash
cd widget
BASE_URL=https://juliet-noncarnivorous-marna.ngrok-free.dev pnpm build
```

3. Start Open Volunteer MCP Server

```bash
cd server
pnpm start
```

4. Add MCP to ChatGPT

    a. In ChatGPT webpage, click account, then Settings
    b. Click Apps, Advanced Settings, then enable developer mode
    c. In advanced settings, click "Create app"
    d. Use URL in ngrok window + /mcp

5. Chat with tool


## Using MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

OR

```bash
cd server
pnpm inspect
```


### Direct to local MCP

1. Transport type SSE
2. URL: http://127.0.0.1:8000/mcp
3. Connection type: Direct
4. Click "Connect"


### Using NGrok to Local MCP

1. Transport type SSE
2. URL: ngrok window + /mcp
3. Connection type: Via Proxy
3. Click "Connect"
