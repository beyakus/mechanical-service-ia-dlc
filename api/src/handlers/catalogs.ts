import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { withErrorHandler } from '../middleware/error-handler.js';
import { extractToken, verifyAndExtractUser, checkRole } from '../middleware/auth.js';
import { parseApiGatewayEvent, matchRoute, type RouteDefinition, type ParsedEvent } from '../utils/router.js';
import { buildResponse } from '../utils/response.js';
import { validateInput } from '../utils/validation.js';
import { Logger } from '../utils/logger.js';
import {
  CreateServiceTypeInputSchema, CreateReasonInputSchema, CreateZoneInputSchema,
} from '../../../shared/src/index.js';
import type { UserContext } from '../../../shared/src/index.js';
import * as catalogService from '../services/catalog.service.js';

const routes: RouteDefinition[] = [
  { method: 'GET', path: '/api/catalogs/service-types', handler: listServiceTypes, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'POST', path: '/api/catalogs/service-types', handler: createServiceType, roles: ['admin'] },
  { method: 'GET', path: '/api/catalogs/reasons', handler: listReasons, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'POST', path: '/api/catalogs/reasons', handler: createReason, roles: ['admin'] },
  { method: 'GET', path: '/api/catalogs/zones', handler: listZones, roles: ['technician', 'supervisor', 'admin'] },
  { method: 'POST', path: '/api/catalogs/zones', handler: createZone, roles: ['admin'] },
];

async function listServiceTypes(event: ParsedEvent, user: UserContext): Promise<APIGatewayProxyResult> {
  const includeInactive = user.role === 'admin' && event.queryStringParameters.includeInactive === 'true';
  return buildResponse(200, catalogService.listServiceTypes(includeInactive));
}

async function createServiceType(event: ParsedEvent, _user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(CreateServiceTypeInputSchema, event.body);
  return buildResponse(201, catalogService.createServiceType(input));
}

async function listReasons(event: ParsedEvent, _user: UserContext): Promise<APIGatewayProxyResult> {
  const type = event.queryStringParameters.type;
  return buildResponse(200, catalogService.listReasons(type));
}

async function createReason(event: ParsedEvent, _user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(CreateReasonInputSchema, event.body);
  return buildResponse(201, catalogService.createReason(input));
}

async function listZones(_event: ParsedEvent, _user: UserContext): Promise<APIGatewayProxyResult> {
  return buildResponse(200, catalogService.listZones());
}

async function createZone(event: ParsedEvent, _user: UserContext): Promise<APIGatewayProxyResult> {
  const input = validateInput(CreateZoneInputSchema, event.body);
  return buildResponse(201, catalogService.createZone(input));
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
