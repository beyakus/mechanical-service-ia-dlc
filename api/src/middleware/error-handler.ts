import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AppError } from '../utils/errors.js';
import { ValidationError } from '../utils/validation.js';
import { buildErrorResponse } from '../utils/response.js';
import { Logger } from '../utils/logger.js';

type LambdaHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

/**
 * Wraps a Lambda handler with global error handling.
 * Catches all errors and returns safe, generic responses.
 */
export function withErrorHandler(handler: LambdaHandler): LambdaHandler {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestId = event.requestContext?.requestId ?? 'unknown';
    const logger = new Logger(requestId, event.httpMethod, event.path);

    try {
      logger.info('Request received');
      const startTime = Date.now();
      const response = await handler(event);
      const duration = Date.now() - startTime;
      logger.info('Request completed', { statusCode: response.statusCode, duration });
      return response;
    } catch (error) {
      if (error instanceof ValidationError) {
        logger.warn('Validation error', { statusCode: 400 });
        return buildErrorResponse(400, 'VALIDATION_ERROR', error.message, error.details);
      }

      if (error instanceof AppError) {
        logger.warn(`${error.name}: ${error.message}`, { statusCode: error.statusCode });
        return buildErrorResponse(error.statusCode, error.errorCode, error.message);
      }

      // Unknown error — fail closed with generic message
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Unhandled error: ${message}`);
      return buildErrorResponse(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
    }
  };
}
