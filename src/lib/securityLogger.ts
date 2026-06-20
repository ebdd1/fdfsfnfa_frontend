/**
 * Client-side security event logger [F-016].
 * Dev: logs to console. Prod: fire-and-forget POST to backend (never blocks UI).
 * Emails are masked before transmission (privacy by design).
 */

type SecurityEventType =
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'unauthorized_access'
  | 'rate_limit_hit'
  | 'session_expired';

interface SecurityEvent {
  type: SecurityEventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const maskEmail = (email: string) => email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

class SecurityLogger {
  private isDev = import.meta.env.DEV;
  private apiUrl = import.meta.env.VITE_API_URL || '';

  private log(event: SecurityEvent): void {
    if (this.isDev) {
      console.info('[SECURITY]', event.type, event);
      return;
    }
    // Prod: fire-and-forget. Logging failure must never break the app.
    try {
      fetch(`${this.apiUrl}/logs/security`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(event),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
  }

  loginSuccess(email: string): void {
    this.log({ type: 'login_success', timestamp: new Date().toISOString(), metadata: { email: maskEmail(email) } });
  }

  loginFailure(email: string, reason?: string): void {
    this.log({ type: 'login_failure', timestamp: new Date().toISOString(), metadata: { email: maskEmail(email), reason } });
  }

  rateLimitHit(action: string): void {
    this.log({ type: 'rate_limit_hit', timestamp: new Date().toISOString(), metadata: { action } });
  }

  unauthorizedAccess(path: string): void {
    this.log({ type: 'unauthorized_access', timestamp: new Date().toISOString(), metadata: { path } });
  }

  sessionExpired(): void {
    this.log({ type: 'session_expired', timestamp: new Date().toISOString() });
  }
}

export const securityLogger = new SecurityLogger();
