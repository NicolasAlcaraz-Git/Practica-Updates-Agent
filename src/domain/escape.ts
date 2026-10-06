export const ESCAPE_ALERT_THRESHOLD = 75;

export type EscapeOutcome = 'escape' | 'normal' | null;

export function evaluateEscape(alertLevel: number, goalReached: boolean): EscapeOutcome {
  if (!goalReached) {
    return null;
  }
  return alertLevel >= ESCAPE_ALERT_THRESHOLD ? 'escape' : 'normal';
}
