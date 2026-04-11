import { createServer } from 'node:http';
import { handler as visitsHandler } from './handlers/visits.js';
import { handler as catalogsHandler } from './handlers/catalogs.js';
import { handler as analyticsHandler } from './handlers/analytics.js';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const PORT = 3001;

function buildEvent(req: { method: string; url: string; headers: Record<string, string>; body: string }): APIGatewayProxyEvent {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const qs: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { qs[k] = v; });

  return {
    httpMethod: req.method,
    path: url.pathname,
    pathParameters: null,
    queryStringParameters: Object.keys(qs).length > 0 ? qs : null,
    body: req.body || null,
    headers: req.headers,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    isBase64Encoded: false,
    stageVariables: null,
    resource: '',
    requestContext: {
      requestId: crypto.randomUUID(),
      accountId: '',
      apiId: '',
      authorizer: null,
      protocol: 'HTTP/1.1',
      httpMethod: req.method,
      identity: {} as never,
      path: url.pathname,
      stage: 'local',
      requestTimeEpoch: Date.now(),
      resourceId: '',
      resourcePath: '',
    },
  };
}

function selectHandler(path: string) {
  if (path.startsWith('/api/analytics')) return analyticsHandler;
  if (path.startsWith('/api/catalogs')) return catalogsHandler;
  if (path.startsWith('/api/visits')) return visitsHandler;
  return null;
}

const server = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    });
    res.end();
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const body = Buffer.concat(chunks).toString();

  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const handler = selectHandler(url.pathname);

  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'NOT_FOUND', message: 'Route not found', statusCode: 404 }));
    return;
  }

  const event = buildEvent({
    method: req.method ?? 'GET',
    url: req.url ?? '/',
    headers: req.headers as Record<string, string>,
    body,
  });

  try {
    const result = await handler(event) as APIGatewayProxyResult;
    const headers: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      ...result.headers as Record<string, string>,
    };
    res.writeHead(result.statusCode, headers);
    res.end(result.body);
  } catch (err) {
    console.error('Handler error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'INTERNAL_ERROR', message: 'Server error', statusCode: 500 }));
  }
});

server.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log('Routes: /api/visits, /api/catalogs, /api/analytics');
});
