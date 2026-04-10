import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withErrorHandler } from '../middleware/error-handler.js';
import { extractToken, verifyAndExtractUser, checkRole } from '../middleware/auth.js';
import { parseApiGatewayEvent, matchRoute, type RouteDefinition, type ParsedEvent } from '../utils/router.js';
import { buildResponse } from '../utils/response.js';
import { validateInput } from '../utils/validation.js';
import { Logger } from '../utils/logger.js';
import {
  VisitFiltersSchema, CalendarFiltersSchema,
  CreateVisitInputSchema, RescheduleInputSchema, CancelInputSchema,
  CompleteInputSchema, FinalizeInputSchema, ReassignInputSchema,
} from '../../../shared/src/index.js';
import type { UserContext } from '../../../shared/src/index.js';
import * as visitService from '../services/visit.service.js';

const routes: RouteDefinition[] = [
  { method: 'GET', path: '/api/visits', handler: listVisits, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'GET', path: '/api/visits/calendar', handler: getCalendar, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'GET', path: '/api/visits/:id', handler: getVisit, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'POST', path: '/api/visits', handler: createVisit, roles: ['supervisor', 'admin'] },
  { method: 'PUT', path: '/api/visits/:id/reschedule', handler: rescheduleVisit, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'PUT', path: '/api/visits/:id/cancel', handler: cancelVisit, roles: ['supervisor', 'admin'] },
  { method: 'PUT', path: '/api/visits/:id/complete', handler: completeVisit, roles: ['technician'] },
  { method: 'PUT', path: '/api/visits/:id/finalize', handler: finalizeVisit, roles: ['supervisor', 'admin'] },
  { method: 'PUT', path: '/api/visits/:id/reassign', handler: reassignVisit, roles: ['supervisor', 'admin'] },
];

async function listVisits(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const filters = validateInput(VisitFiltersSchema, event.queryStringParameters);
  const result = visitService.list(filters, user);
  return buildResponse(200, result);
}

async function getCalendar(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const filters = validateInput(CalendarFiltersSchema, event.queryStringParameters);
  const result = visitService.getCalendarData(filters.startDate, filters.endDate, user, filters);
  return buildResponse(200, result);
}

async function getVisit(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const visit = visitService.getById(event.pathParameters.id, user);
  return buildResponse(200, visit);
}

async function createVisit(event: ParsedEvent, _user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(CreateVisitInputSchema, event.body);
  // Mock: return a fake created visit
  return buildResponse(201, { id: crypto.randomUUID(), status: 'scheduled', ...input });
}

async function rescheduleVisit(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(RescheduleInputSchema, event.body);
  const visit = visitService.reschedule(event.pathParameters.id, input, user);
  return buildResponse(200, visit);
}

async function cancelVisit(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(CancelInputSchema, event.body);
  const visit = visitService.cancel(event.pathParameters.id, input, user);
  return buildResponse(200, visit);
}

async function completeVisit(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(CompleteInputSchema, event.body);
  const visit = visitService.complete(event.pathParameters.id, input, user);
  return buildResponse(200, visit);
}

async function finalizeVisit(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(FinalizeInputSchema, event.body);
  const visit = visitService.finalize(event.pathParameters.id, input, user);
  return buildResponse(200, visit);
}

async function reassignVisit(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(ReassignInputSchema, event.body);
  const visit = visitService.reassign(event.pathParameters.id, input, user);
  return buildResponse(200, visit);
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
