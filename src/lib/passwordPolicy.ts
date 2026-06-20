/**
 * Password strength checker for user registration [F-011].
 * Validates and scores password strength without sending to server.
 */

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  feedback: string[];
  isValid: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Minimal 8 karakter');

  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Tambahkan huruf kapital (A-Z)');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Tambahkan angka (0-9)');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Tambahkan karakter spesial (!@#$%)');

  const finalScore = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  const labels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore],
    feedback,
    isValid: finalScore >= 2 && password.length >= 8,
  };
}

/** Backend-level validation — used in registration form before submit [F-011] */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password wajib diisi';
  if (password.length < 8) return 'Password minimal 8 karakter';
  if (!/[A-Z]/.test(password)) return 'Password harus mengandung minimal 1 huruf kapital';
  if (!/[0-9]/.test(password)) return 'Password harus mengandung minimal 1 angka';
  return null; // valid
}
