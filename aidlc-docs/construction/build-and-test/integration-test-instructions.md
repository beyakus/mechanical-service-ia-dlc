# Instrucciones de Integration Tests

## Alcance
Con datos mock (sin DB real), los integration tests validan la comunicación entre capas.

## Escenario 1: shared → api Integration
Verificar que los Zod schemas de shared validan correctamente los datos del seed data de api.

```bash
# Test manual: verificar que seed-data.json pasa validación de schemas
cd api
node -e "
import { VisitSchema } from '../shared/dist/index.js';
import seedData from './src/repositories/seed-data.json' assert { type: 'json' };
// Validate each visit in seed data
console.log('Validating seed data...');
"
```

## Escenario 2: API Gateway → Lambda Handler
Verificar que los handlers procesan correctamente eventos de API Gateway.

```bash
# Test con evento mock de API Gateway
cd api
node -e "
import { handler } from './dist/visits/index.mjs';
const event = {
  httpMethod: 'GET',
  path: '/api/visits',
  headers: { Authorization: 'Bearer ' + Buffer.from(JSON.stringify({
    userId: 'd0000000-0000-4000-8000-000000000005',
    role: 'admin',
    name: 'Test Admin'
  })).toString('base64') },
  queryStringParameters: {},
  requestContext: { requestId: 'test-123' }
};
handler(event).then(r => console.log(r.statusCode, JSON.parse(r.body).data?.length));
"
```

## Escenario 3: app → api Communication
Verificar que el API client del frontend puede comunicarse con el backend.

1. Iniciar api localmente (o usar mock server)
2. Configurar `VITE_API_URL` en app
3. Verificar que los hooks de TanStack Query obtienen datos correctamente

## Nota
Los integration tests completos se implementarán cuando se tenga una base de datos real y ambientes desplegados. Con datos mock, los unit tests cubren la mayoría de los escenarios de integración entre capas.
