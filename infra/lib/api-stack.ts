import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import type { Construct } from 'constructs';
import type { EnvironmentConfig } from '../environments/config.js';

interface ApiStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

export class ApiStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const { config } = props;

    // Lambda functions
    const visitsLambda = this.createLambda('VisitsHandler', 'visits', config);
    const catalogsLambda = this.createLambda('CatalogsHandler', 'catalogs', config);
    const analyticsLambda = this.createLambda('AnalyticsHandler', 'analytics', config);

    // API Gateway
    const api = new apigateway.RestApi(this, 'VisitsApi', {
      restApiName: `visits-api-${config.envName}`,
      deployOptions: {
        stageName: config.envName,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        accessLogDestination: new apigateway.LogGroupLogDestination(
          new logs.LogGroup(this, 'ApiAccessLogs', {
            retention: config.logRetentionDays,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
          }),
        ),
        throttlingRateLimit: 100,
        throttlingBurstLimit: 50,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: config.corsAllowedOrigins,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
        maxAge: cdk.Duration.hours(24),
      },
    });

    // Routes - Visits
    const visits = api.root.addResource('api').addResource('visits');
    visits.addMethod('GET', new apigateway.LambdaIntegration(visitsLambda));
    visits.addMethod('POST', new apigateway.LambdaIntegration(visitsLambda));

    const visitsCalendar = visits.addResource('calendar');
    visitsCalendar.addMethod('GET', new apigateway.LambdaIntegration(visitsLambda));

    const visitById = visits.addResource('{id}');
    visitById.addMethod('GET', new apigateway.LambdaIntegration(visitsLambda));

    const visitReschedule = visitById.addResource('reschedule');
    visitReschedule.addMethod('PUT', new apigateway.LambdaIntegration(visitsLambda));

    const visitCancel = visitById.addResource('cancel');
    visitCancel.addMethod('PUT', new apigateway.LambdaIntegration(visitsLambda));

    const visitComplete = visitById.addResource('complete');
    visitComplete.addMethod('PUT', new apigateway.LambdaIntegration(visitsLambda));

    const visitFinalize = visitById.addResource('finalize');
    visitFinalize.addMethod('PUT', new apigateway.LambdaIntegration(visitsLambda));

    const visitReassign = visitById.addResource('reassign');
    visitReassign.addMethod('PUT', new apigateway.LambdaIntegration(visitsLambda));

    // Routes - Catalogs
    const catalogs = api.root.getResource('api')!.addResource('catalogs');
    const serviceTypes = catalogs.addResource('service-types');
    serviceTypes.addMethod('GET', new apigateway.LambdaIntegration(catalogsLambda));
    serviceTypes.addMethod('POST', new apigateway.LambdaIntegration(catalogsLambda));

    const reasons = catalogs.addResource('reasons');
    reasons.addMethod('GET', new apigateway.LambdaIntegration(catalogsLambda));
    reasons.addMethod('POST', new apigateway.LambdaIntegration(catalogsLambda));

    const zones = catalogs.addResource('zones');
    zones.addMethod('GET', new apigateway.LambdaIntegration(catalogsLambda));
    zones.addMethod('POST', new apigateway.LambdaIntegration(catalogsLambda));

    // Routes - Analytics
    const analytics = api.root.getResource('api')!.addResource('analytics');
    const summary = analytics.addResource('summary');
    summary.addMethod('GET', new apigateway.LambdaIntegration(analyticsLambda));

    const cancellationReasons = analytics.addResource('cancellation-reasons');
    cancellationReasons.addMethod('GET', new apigateway.LambdaIntegration(analyticsLambda));

    const rescheduleReasons = analytics.addResource('reschedule-reasons');
    rescheduleReasons.addMethod('GET', new apigateway.LambdaIntegration(analyticsLambda));

    const trends = analytics.addResource('trends');
    trends.addMethod('GET', new apigateway.LambdaIntegration(analyticsLambda));

    this.apiUrl = api.url;

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
  }

  private createLambda(id: string, handlerName: string, config: EnvironmentConfig): lambda.Function {
    return new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(`../api/dist/${handlerName}`),
      memorySize: config.lambdaMemory,
      timeout: cdk.Duration.seconds(config.lambdaTimeout),
      environment: {
        NODE_ENV: config.envName,
        CLERK_PUBLISHABLE_KEY: config.clerkPublishableKey,
      },
      logRetention: config.logRetentionDays,
    });
  }
}
