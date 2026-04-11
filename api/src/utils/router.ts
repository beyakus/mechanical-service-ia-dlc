import type { UserContext } from '@visits/shared';
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
  pathParameters?: Record<string, string | undefined> | null;
  queryStringParameters?: Record<string, string | undefined> | null;
  body?: string | null;
  headers?: Record<string, string | undefined> | null;
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

  const cleanRecord = (rec?: Record<string, string | undefined> | null): Record<string, string> => {
    if (!rec) return {};
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(rec)) {
      if (v !== undefined) result[k] = v;
    }
    return result;
  };

  return {
    method: event.httpMethod,
    path: event.path,
    pathParameters: cleanRecord(event.pathParameters),
    queryStringParameters: cleanRecord(event.queryStringParameters),
    body,
    headers: cleanRecord(event.headers),
    requestId: event.requestContext?.requestId ?? 'unknown',
  };
}
