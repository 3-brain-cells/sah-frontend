import { useLocation, useRouteMatch } from 'react-router-dom';

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
    const { url } = useRouteMatch();
    const { pathname } = useLocation();
    const suffix = pathname.substring(url.length);

    if (suffix.length === 0) return null;
    const withoutLeadingSlash = suffix.substring(1);

    // If there are any segments after this,
    // make sure to remove them
    const nextSlashIdx = withoutLeadingSlash.indexOf('/');
    if (nextSlashIdx !== -1) {
        return withoutLeadingSlash.substring(0, nextSlashIdx);
    }

    return withoutLeadingSlash;
}
