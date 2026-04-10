import type { UserContext } from '../../shared/src/index.js';
import type { APIGatewayProxyResult } from 'aws-lambda';

export interface ParsedEvent {
  method: string;
  path: string;
  pathParameters: Record<string, string>;
  queryStringParameters: Record<string, string>;
  body: unknown;
  headers: Record<string, string>;
  requestId: string;
}

export type RouteHandler = (
  event: ParsedEvent,
  user: UserContext,
) => Promise<APIGatewayProxyResult>;

export interface RouteDefinition {
  method: string;
  path: string;
  handler: RouteHandler;
  roles: string[];
}

interface MatchResult {
  route: RouteDefinition;
  params: Record<string, string>;
}

/**
 * Convert a route path pattern like /api/visits/:id to a regex.
 */
function pathToRegex(pattern: string): { regex: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];
  const regexStr = pattern.replace(/:([^/]+)/g, (_match, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });
  return { regex: new RegExp(`^${regexStr}$`), paramNames };
}

/**
 * Match a request against the route definitions.
 */
export function matchRoute(
  routes: RouteDefinition[],
  method: string,
  path: string,
): MatchResult | null {
  for (const route of routes) {
    if (route.method !== method) continue;
    const { regex, paramNames } = pathToRegex(route.path);
    const match = path.match(regex);
    if (match) {
      const params: Record<string, string> = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { route, params };
    }
  }
  return null;
}

/**
 * Parse an API Gateway event into a normalized ParsedEvent.
 */
export function parseApiGatewayEvent(event: {
  httpMethod: string;
  path: string;
  pathParameters?: Record<string, string> | null;
  queryStringParameters?: Record<string, string> | null;
  body?: string | null;
  headers?: Record<string, string> | null;
  requestContext?: { requestId?: string };
}): ParsedEvent {
  let body: unknown = null;
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = null;
    }
  }

  return {
    method: event.httpMethod,
    path: event.path,
    pathParameters: event.pathParameters ?? {},
    queryStringParameters: event.queryStringParameters ?? {},
    body,
    headers: event.headers ?? {},
    requestId: event.requestContext?.requestId ?? 'unknown',
  };
}
