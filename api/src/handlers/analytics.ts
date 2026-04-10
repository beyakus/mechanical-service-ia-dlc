import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withErrorHandler } from '../middleware/error-handler.js';
import { extractToken, verifyAndExtractUser, checkRole } from '../middleware/auth.js';
import { parseApiGatewayEvent, matchRoute, type RouteDefinition, type ParsedEvent } from '../utils/router.js';
import { buildResponse } from '../utils/response.js';
import { validateInput } from '../utils/validation.js';
import { Logger } from '../utils/logger.js';
import { AnalyticsFiltersSchema } from '../../../shared/src/index.js';
import type { UserContext } from '../../../shared/src/index.js';
import * as analyticsService from '../services/analytics.service.js';

const routes: RouteDefinition[] = [
  { method: 'GET', path: '/api/analytics/summary', handler: getSummary, roles: ['supervisor', 'admin'] },
  { method: 'GET', path: '/api/analytics/cancellation-reasons', handler: getCancellationReasons, roles: ['supervisor', 'admin'] },
  { method: 'GET', path: '/api/analytics/reschedule-reasons', handler: getRescheduleReasons, roles: ['supervisor', 'admin'] },
  { method: 'GET', path: '/api/analytics/trends', handler: getTrends, roles: ['supervisor', 'admin'] },
];

async function getSummary(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const filters = validateInput(AnalyticsFiltersSchema, event.queryStringParameters);
  const result = analyticsService.getSummary(user, filters.startDate, filters.endDate, filters.technicianId, filters.zoneId);
  return buildResponse(200, result);
}

async function getCancellationReasons(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const filters = validateInput(AnalyticsFiltersSchema, event.queryStringParameters);
  const result = analyticsService.getCancellationReasons(user, filters.startDate, filters.endDate, filters.technicianId, filters.zoneId);
  return buildResponse(200, result);
}

async function getRescheduleReasons(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const filters = validateInput(AnalyticsFiltersSchema, event.queryStringParameters);
  const result = analyticsService.getRescheduleReasons(user, filters.startDate, filters.endDate, filters.technicianId, filters.zoneId);
  return buildResponse(200, result);
}

async function getTrends(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const filters = validateInput(AnalyticsFiltersSchema, event.queryStringParameters);
  const result = analyticsService.getTrends(user, filters.startDate, filters.endDate, filters.technicianId, filters.zoneId);
  return buildResponse(200, result);
}

export const handler = withErrorHandler(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const parsed = parseApiGatewayEvent(event);
  const logger = new Logger(parsed.requestId, parsed.method, parsed.path);

  const match = matchRoute(routes, parsed.method, parsed.path);
  if (!match) return buildResponse(404, { error: 'NOT_FOUND', message: 'Route not found', statusCode: 404 });

  const token = extractToken(parsed.headers);
  const user = await verifyAndExtractUser(token, logger);
  checkRole(user, match.route.roles);

  parsed.pathParameters = { ...parsed.pathParameters, ...match.params };
  return match.route.handler(parsed, user);
});
