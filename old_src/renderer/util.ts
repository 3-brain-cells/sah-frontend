// TODO remove test site id
export const siteIds = ['footlocker', 'footaction', 'eastbay', 'champssports', '__test_site'];

/**
 * Converts a site ID to its human-readable name
 */
export function formatSite(site: string): string {
    switch (site) {
        case 'footlocker':
            return 'Foot Locker';
        case 'footaction':
            return 'Foot Action';
        case 'eastbay':
            return 'Eastbay';
        case 'champssports':
            return 'Champs Sports';
        case '__test_site':
            return '[dev] Test Site';
        default:
            return '<Unknown>';
    }
}

/**
 * Logs an error to the console, and potentially to some type of telemetry
 * @param err - Source error
 * @param message - Message that describes the context of the error
 */
export function logError(err: unknown, message: string): void {
    // eslint-disable-next-line no-console
    console.error(`${message}: ${err}`);
}
