/**
 * Pure utility functions used across composables and components.
 * No Vue reactivity — these are stateless helpers.
 */

/** Resolve a dot-notation field path from a row object. */
export const cellValue = (item: Record<string, unknown>, field: string | undefined): unknown => {
    return field?.split('.').reduce<unknown>((obj, key) => (obj as Record<string, unknown> | undefined)?.[key], item);
};

/** Format a date value to `YYYY-MM-DD` string. Returns empty string on invalid input. */
export const dateFormat = (date: unknown): string => {
    try {
        if (!date) return '';
        const dt = new Date(date as string | number);
        if (isNaN(dt.getTime())) return '';
        const day = dt.getDate();
        const month = dt.getMonth() + 1;
        const year = dt.getFullYear();
        return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day);
    } catch {
        return '';
    }
};

/** Replace `{0}`, `{1}`, etc. placeholders in a template string. */
export const stringFormat = (template: string, ...args: Array<string | number>): string => {
    return template.replace(/{(\d+)}/g, (match, number: string) => {
        const idx = parseInt(number, 10);
        return idx < args.length ? String(args[idx]) : match;
    });
};
