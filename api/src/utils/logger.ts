export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  requestId: string;
  method?: string;
  path?: string;
  userId?: string;
  role?: string;
  statusCode?: number;
  duration?: number;
  message: string;
}

export class Logger {
  private requestId: string;
  private method?: string;
  private path?: string;

  constructor(requestId: string, method?: string, path?: string) {
    this.requestId = requestId;
    this.method = method;
    this.path = path;
  }

  info(message: string, extra?: Partial<LogEntry>): void {
    this.log('INFO', message, extra);
  }

  warn(message: string, extra?: Partial<LogEntry>): void {
    this.log('WARN', message, extra);
  }

  error(message: string, extra?: Partial<LogEntry>): void {
    this.log('ERROR', message, extra);
  }

  private log(level: LogEntry['level'], message: string, extra?: Partial<LogEntry>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      requestId: this.requestId,
      method: this.method,
      path: this.path,
      message,
      ...extra,
    };
    console.log(JSON.stringify(entry));
  }
}
