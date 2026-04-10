#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack.js';
import { FrontendStack } from '../lib/frontend-stack.js';
import { environments } from '../environments/config.js';

const app = new cdk.App();
const envName = app.node.tryGetContext('env') ?? 'dev';
const config = environments[envName];

if (!config) {
  throw new Error(`Unknown environment: ${envName}. Valid: ${Object.keys(environments).join(', ')}`);
}

const envProps: cdk.Environment = {
  account: config.account ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: config.region,
};

const apiStack = new ApiStack(app, `VisitsApi-${config.envName}`, {
  env: envProps,
  config,
});

new FrontendStack(app, `VisitsFrontend-${config.envName}`, {
  env: envProps,
  config,
  apiUrl: apiStack.apiUrl,
});
