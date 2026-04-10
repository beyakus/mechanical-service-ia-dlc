# Instrucciones de Build - Portal de Visitas Mecánicas

## Prerrequisitos
- Node.js >= 22 LTS
- npm >= 10
- AWS CDK CLI (`npm install -g aws-cdk`) — solo para deploy
- Cuenta de Clerk configurada (publishable key + secret key)
- AWS CLI configurado (solo para deploy)

## Variables de Entorno

### Desarrollo Local
```bash
# app/.env
VITE_API_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

## Build Steps

### 1. Instalar dependencias (todas las unidades)
```bash
cd shared && npm ci
cd ../api && npm ci
cd ../app && npm ci
cd ../infra && npm ci
cd ..
```

### 2. Build shared (primero, es dependencia de api y app)
```bash
cd shared
npm run build
```
Resultado esperado: `shared/dist/` con archivos `.js` y `.d.ts`

### 3. Build api (Lambda bundles)
```bash
cd api
npm run build
```
Resultado esperado: `api/dist/visits/index.mjs`, `api/dist/catalogs/index.mjs`, `api/dist/analytics/index.mjs`

### 4. Build app (TanStack Start)
```bash
cd app
npm run build
```
Resultado esperado: `app/.output/` con build de producción

### 5. Verificar builds
```bash
# Verificar que los artefactos existen
ls shared/dist/index.js
ls api/dist/visits/index.mjs
ls api/dist/catalogs/index.mjs
ls api/dist/analytics/index.mjs
ls app/.output/
```

## Build desde root (atajo)
```bash
# Desde la raíz del monorepo
npm run build
```
Ejecuta build:shared → build:api → build:app en secuencia.

## Troubleshooting

### Error: Cannot find module '@visits/shared'
- Asegúrate de hacer `npm run build` en shared/ primero
- Verifica que `shared/dist/` existe

### Error: esbuild failed
- Verifica que `api/src/handlers/*.ts` compilan sin errores: `cd api && npm run typecheck`

### Error: Clerk key not found
- Crea `app/.env` con las variables de entorno de Clerk
