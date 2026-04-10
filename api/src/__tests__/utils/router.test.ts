import { describe, it, expect } from 'vitest';
import { matchRoute, parseApiGatewayEvent, type RouteDefinition } from '../../utils/router.js';

const testRoutes: RouteDefinition[] = [
  { method: 'GET', path: '/api/visits', handler: async () => ({ statusCode: 200, headers: {}, body: '' }), roles: ['admin'] },
  { method: 'GET', path: '/api/visits/:id', handler: async () => ({ statusCode: 200, headers: {}, body: '' }), roles: ['admin'] },
  { method: 'PUT', path: '/api/visits/:id/cancel', handler: async () => ({ statusCode: 200, headers: {}, body: '' }), roles: ['admin'] },
];

describe('matchRoute', () => {
  it('should match exact path', () => {
    const result = matchRoute(testRoutes, 'GET', '/api/visits');
    expect(result).not.toBeNull();
    expect(result!.route.path).toBe('/api/visits');
  });

  it('should match path with parameter', () => {
    const result = matchRoute(testRoutes, 'GET', '/api/visits/abc-123');
    expect(result).not.toBeNull();
    expect(result!.params.id).toBe('abc-123');
  });

  it('should match nested path with parameter', () => {
    const result = matchRoute(testRoutes, 'PUT', '/api/visits/abc-123/cancel');
    expect(result).not.toBeNull();
    expect(result!.params.id).toBe('abc-123');
  });

  it('should return null for unmatched path', () => {
    const result = matchRoute(testRoutes, 'GET', '/api/unknown');
    expect(result).toBeNull();
  });

  it('should return null for unmatched method', () => {
    const result = matchRoute(testRoutes, 'DELETE', '/api/visits');
    expect(result).toBeNull();
  });
});

describe('parseApiGatewayEvent', () => {
  it('should parse event with body', () => {
    const event = {
      httpMethod: 'POST',
      path: '/api/visits',
      body: '{"name":"test"}',
      headers: { 'Content-Type': 'application/json' },
      requestContext: { requestId: 'req-123' },
    };
    const parsed = parseApiGatewayEvent(event);
    expect(parsed.method).toBe('POST');
    expect(parsed.body).toEqual({ name: 'test' });
    expect(parsed.requestId).toBe('req-123');
  });

  it('should handle null body', () => {
    const event = { httpMethod: 'GET', path: '/api/visits', body: null };
    const parsed = parseApiGatewayEvent(event);
    expect(parsed.body).toBeNull();
  });
});
