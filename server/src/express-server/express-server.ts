import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction, Application } from 'express';
import { createMcpRouter } from "./router.js";
import { wwwDir } from '../www-path.js';

// Create Express app
const app: Application = express();

// Trust proxy for accurate req.protocol when behind reverse proxy (e.g., AWS API Gateway)
app.set('trust proxy', true);

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'mcp-protocol-version',
        'Content-Type',
        'Authorization',
        'WWW-Authenticate',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Origin',
        'WWW-Authenticate'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware to log HTTP method and path
app.use((req, _res, next) => {
    console.log(`Starting ${req.method} ${req.path}`); //, req.body);
    next();
});

// Health check endpoint
const started = new Date().toISOString();
app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        started,
        timestamp: new Date().toISOString(),
        service: 'chat-gpt-app-server',
        url: req.originalUrl
    });
});

app.use('/mcp', createMcpRouter());

// Serve the web interface for non-API routes
app.get('/', (_req: Request, res: Response) => {
    res.sendFile('index.html', { root: wwwDir });
});

// Serve static files from www directory (after specific routes)
app.use(express.static(wwwDir));

// Error handling middleware
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        jsonrpc: '2.0',
        id: 'unhandled-error',
        error: {
            code: -32603,
            message: 'Internal error',
            data: error.message
        }
    });
});

export { app }; 
