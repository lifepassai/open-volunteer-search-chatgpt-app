# Open Volunteer ChatGPT UI

Open Volunteer Opportunity Search MCP service supporting Chat GPT UI/App

## Prerequisites

- Node.js 18+
- pnpm
- Clone the repo: git clone <TBD>
- ngrok for local development


## Build the React app/widget assets

```bash
cd widget
pnpm install
pnpm build
```

To test the local React/widget build:

```bash
cd widget
pnpm dev
```


## Start the MCP server

1. Start Ngrok port forwarding to determine the base URL

```bash
ngrok http 8000
```

    Remember the forwarding URL for the next step...

2. Rebuild the widget with the BASE_URL from ngrok

```bash
cd widget
BASE_URL=https://juliet-noncarnivorous-marna.ngrok-free.dev pnpm build
```

3. Start Open Volunteer MCP Server

```bash
cd server
pnpm dev
```

## Add MCP to ChatGPT

1. In ChatGPT webpage, click account, then Settings
2. Click Apps, Advanced Settings, then enable developer mode
3. In advanced settings, click "Create app"
4. Use URL in ngrok window + /mcp

## Chat with tool

1. Start a new ChatGPT chat
2. Use the "+" to add the Open Volunteer tool
3. Type in "Find a volunteering opportunity near London"


## Using MCP Inspector

```bash
npx @modelcontextprotocol/inspector
```

OR

```bash
cd server
pnpm inspect
```



### Direct to local MCP using express server

```bash
pnpm dev:express
```

1. Transport type Streamable HTTP
2. URL: http://127.0.0.1:3003/mcp
3. Connection type: Direct
4. Click "Connect"


### Direct to local MCP using MCP SDK server

```bash
pnpm dev:mcp-sdk
```

1. Transport type SSE
2. URL: http://127.0.0.1:8000/mcp
3. Connection type: Direct
4. Click "Connect"


### Using NGrok to Local MCP

1. Transport type SSE
2. URL: ngrok window + /mcp
3. Connection type: Via Proxy
3. Click "Connect"
