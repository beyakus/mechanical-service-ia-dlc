import type { APIGatewayProxyResult } from 'aws-lambda';

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export function buildResponse(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { ...SECURITY_HEADERS },
    body: JSON.stringify(body),
  };
}

export function buildErrorResponse(
  statusCode: number,
  error: string,
  message: string,
  details?: Record<string, string[]>,
): APIGatewayProxyResult {
  return buildResponse(statusCode, { error, message, statusCode, ...(details && { details }) });
}
