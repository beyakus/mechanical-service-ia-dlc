import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { matchRoute, type RouteDefinition } from '../../utils/router.js';

const dummyHandler = async () => ({ statusCode: 200, headers: {}, body: '' });

const testRoutes: RouteDefinition[] = [
  { method: 'GET', path: '/api/visits', handler: dummyHandler, roles: ['admin'] },
  { method: 'GET', path: '/api/visits/:id', handler: dummyHandler, roles: ['admin'] },
  { method: 'POST', path: '/api/visits', handler: dummyHandler, roles: ['admin'] },
];

describe('Router - Property-Based Tests', () => {
  it('invariant: unregistered methods never match (PBT-03)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('DELETE', 'PATCH', 'OPTIONS', 'HEAD'),
        fc.string(),
        (method, path) => {
          const result = matchRoute(testRoutes, method, `/api/visits${path}`);
          expect(result).toBeNull();
        },
      ),
      { numRuns: 50 },
    );
  });

  it('invariant: matched route always has correct method (PBT-03)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('GET', 'POST'),
        (method) => {
          const result = matchRoute(testRoutes, method, '/api/visits');
          if (result) {
            expect(result.route.method).toBe(method);
          }
        },
      ),
      { numRuns: 20 },
    );
  });

  it('invariant: path param extraction is consistent (PBT-03)', () => {
    const uuidArb = fc.uuid();
    fc.assert(
      fc.property(uuidArb, (id) => {
        const result = matchRoute(testRoutes, 'GET', `/api/visits/${id}`);
        expect(result).not.toBeNull();
        expect(result!.params.id).toBe(id);
      }),
      { numRuns: 50 },
    );
  });
});
