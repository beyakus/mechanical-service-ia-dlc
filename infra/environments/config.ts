export interface EnvironmentConfig {
  envName: string;
  account?: string;
  region: string;
  clerkPublishableKey: string;
  frontendDomain?: string;
  corsAllowedOrigins: string[];
  lambdaMemory: number;
  lambdaTimeout: number;
  logRetentionDays: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  dev: {
    envName: 'dev',
    region: 'us-east-1',
    clerkPublishableKey: 'pk_test_placeholder',
    corsAllowedOrigins: ['http://localhost:3000'],
    lambdaMemory: 256,
    lambdaTimeout: 30,
    logRetentionDays: 14,
  },
  staging: {
    envName: 'staging',
    region: 'us-east-1',
    clerkPublishableKey: 'pk_test_placeholder',
    frontendDomain: 'staging.visits.example.com',
    corsAllowedOrigins: ['https://staging.visits.example.com'],
    lambdaMemory: 256,
    lambdaTimeout: 30,
    logRetentionDays: 30,
  },
  prod: {
    envName: 'prod',
    region: 'us-east-1',
    clerkPublishableKey: 'pk_live_placeholder',
    frontendDomain: 'visits.example.com',
    corsAllowedOrigins: ['https://visits.example.com'],
    lambdaMemory: 512,
    lambdaTimeout: 30,
    logRetentionDays: 90,
  },
};
