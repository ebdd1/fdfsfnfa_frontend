import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number; // max attempts within window before lockout
  windowMs: number;    // sliding window size
  lockoutMs: number;   // lockout duration once exceeded
}

interface RateLimitState {
  attempts: number;
  isLocked: boolean;
  lockoutEndsAt: number | null;
  remainingSeconds: number;
}

/**
 * Client-side rate limit + account lockout for login [F-005, F-006, F-017].
 * UX/friction layer only — backend throttler is the real enforcement.
 */
export function useRateLimit(config: RateLimitConfig) {
  const { maxAttempts, windowMs, lockoutMs } = config;
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    isLocked: false,
    lockoutEndsAt: null,
    remainingSeconds: 0,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptTimestamps = useRef<number[]>([]);
  const lockoutEndRef = useRef<number | null>(null);

  const checkAndIncrement = useCallback((): boolean => {
    const now = Date.now();

    // Still locked?
    if (lockoutEndRef.current && now < lockoutEndRef.current) {
      return false;
    }

    // Drop attempts outside the window
    attemptTimestamps.current = attemptTimestamps.current.filter((ts) => now - ts < windowMs);
    attemptTimestamps.current.push(now);

    if (attemptTimestamps.current.length >= maxAttempts) {
      const lockoutEndsAt = now + lockoutMs;
      lockoutEndRef.current = lockoutEndsAt;
      setState({
        attempts: attemptTimestamps.current.length,
        isLocked: true,
        lockoutEndsAt,
        remainingSeconds: Math.ceil(lockoutMs / 1000),
      });

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const remaining = Math.ceil((lockoutEndsAt - Date.now()) / 1000);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          attemptTimestamps.current = [];
          lockoutEndRef.current = null;
          setState({ attempts: 0, isLocked: false, lockoutEndsAt: null, remainingSeconds: 0 });
        } else {
          setState((s) => ({ ...s, remainingSeconds: remaining }));
        }
      }, 1000);

      return false;
    }

    setState((s) => ({ ...s, attempts: attemptTimestamps.current.length }));
    return true;
  }, [maxAttempts, windowMs, lockoutMs]);

  return { ...state, checkAndIncrement };
}
