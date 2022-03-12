/**
 * Gets the current ID that exists as the next URL segment,
 * relative to the most recent route match.
 * For example, with a component that has its most recent match be
 * /releases:
 * - Current URL /releases/XXX => return `"XXX"`
 * - Current URL /releases/XXX/abc => return `"XXX"`
 * - Current URL /releases => return `null`
 */
export default function useRouteId(): string | null {
  return null;
}
