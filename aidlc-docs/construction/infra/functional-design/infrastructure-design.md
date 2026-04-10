# Infrastructure Design - Unit: infra

## Decisiones de Infraestructura

| Decisión | Elección | Rationale |
|----------|----------|-----------|
| IaC Tool | AWS CDK (TypeScript) | Consistente con el stack TS, type-safe |
| API | API Gateway REST + 3 Lambda functions | Una Lambda por dominio (visits, catalogs, analytics) |
| Frontend Hosting | S3 + CloudFront | Static site hosting con CDN |
| Auth | Clerk (SaaS) | No infra propia para auth |
| Ambientes | dev / staging / prod | Stacks separados por ambiente |
| CI/CD | GitHub Actions | lint + typecheck + build en cada PR |

## Stacks CDK

### ApiStack
- REST API Gateway con stages
- 3 Lambda functions (visits, catalogs, analytics)
- IAM roles least-privilege por Lambda
- CORS configurado en API Gateway
- API Gateway access logging habilitado (SECURITY-02)
- Rate limiting / throttling en API Gateway (SECURITY-11)
- Lambda: Node 22, 256MB, 30s timeout

### FrontendStack
- S3 bucket (block public access, encryption at rest) (SECURITY-01, SECURITY-09)
- CloudFront distribution con OAI
- CloudFront logging habilitado (SECURITY-02)
- Security headers via CloudFront response headers policy (SECURITY-04)

### Environment Config
- Clerk keys via SSM Parameter Store (SECURITY-12)
- API URL derivado del API Gateway endpoint
- Separate stacks per environment

## Security Compliance (Infrastructure)

| SECURITY Rule | Implementation |
|--------------|----------------|
| SECURITY-01 | S3 encryption at rest (AES-256), CloudFront HTTPS only |
| SECURITY-02 | API Gateway access logs, CloudFront standard logs |
| SECURITY-06 | IAM roles with specific actions, no wildcards |
| SECURITY-07 | N/A (serverless, no VPC needed for mock data) |
| SECURITY-09 | S3 block public access, no default pages |
| SECURITY-10 | CDK pinned version, lock file |
| SECURITY-11 | API Gateway throttling |
| SECURITY-14 | CloudWatch log retention 90 days, alarms for 5xx |

## GitHub Actions Pipeline

### ci.yml (on PR)
1. Checkout
2. Setup Node 22
3. Install dependencies (npm ci)
4. Lint (shared + api + app)
5. Type check (shared + api + app)
6. Build shared
7. Build api (esbuild)
8. Build app (TanStack Start)
9. Run tests (shared + api + app)
