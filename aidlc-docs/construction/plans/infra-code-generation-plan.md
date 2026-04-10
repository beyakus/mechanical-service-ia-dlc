# Plan de Code Generation - Unit 4: infra

## Contexto
- Unit: infra (AWS CDK + GitHub Actions)
- Ubicación: `infra/` y `.github/workflows/` en workspace root
- Dependencias: api (Lambda bundles), app (build output)
- Stacks: ApiStack, FrontendStack, environment configs

---

## Steps

### Step 1: CDK Project Setup
- [ ] Crear `infra/package.json`
- [ ] Crear `infra/tsconfig.json`
- [ ] Crear `infra/cdk.json`

### Step 2: Environment Config
- [ ] Crear `infra/environments/config.ts` (dev/staging/prod configs)

### Step 3: API Stack
- [ ] Crear `infra/lib/api-stack.ts` (API Gateway + 3 Lambdas + IAM)

### Step 4: Frontend Stack
- [ ] Crear `infra/lib/frontend-stack.ts` (S3 + CloudFront)

### Step 5: CDK App Entry Point
- [ ] Crear `infra/bin/app.ts` (instantiate stacks per environment)

### Step 6: GitHub Actions CI Pipeline
- [ ] Crear `.github/workflows/ci.yml` (lint + typecheck + build + test)

### Step 7: Root package.json
- [ ] Crear root `package.json` con scripts para monorepo

### Step 8: Documentation
- [ ] Crear `aidlc-docs/construction/infra/code/code-summary.md`
