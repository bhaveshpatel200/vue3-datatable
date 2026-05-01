/**
 * Filter strategy pattern — maps column types × filter conditions to predicate functions.
 * Replaces the 130+ line if-else chain with a declarative lookup table.
 */

import type { IColumnType, IFilterCondition } from './types';
import { cellValue, dateFormat } from './utils';

type FilterFn = (cellVal: unknown, filterVal: string | number | boolean) => boolean;

const stringStrategies: Record<string, FilterFn> = {
    contain: (cv, fv) =>
        String(cv ?? '')
            .toLowerCase()
            .includes(String(fv).toLowerCase()),
    not_contain: (cv, fv) =>
        !String(cv ?? '')
            .toLowerCase()
            .includes(String(fv).toLowerCase()),
    equal: (cv, fv) => String(cv ?? '').toLowerCase() === String(fv).toLowerCase(),
    not_equal: (cv, fv) => String(cv ?? '').toLowerCase() !== String(fv).toLowerCase(),
    start_with: (cv, fv) =>
        String(cv ?? '')
            .toLowerCase()
            .startsWith(String(fv).toLowerCase()),
    end_with: (cv, fv) =>
        String(cv ?? '')
            .toLowerCase()
            .endsWith(String(fv).toLowerCase()),
};

const numberStrategies: Record<string, FilterFn> = {
    equal: (cv, fv) => cv != null && parseFloat(String(cv)) === parseFloat(String(fv)),
    not_equal: (cv, fv) => cv != null && parseFloat(String(cv)) !== parseFloat(String(fv)),
    greater_than: (cv, fv) => cv != null && parseFloat(String(cv)) > parseFloat(String(fv)),
    greater_than_equal: (cv, fv) => cv != null && parseFloat(String(cv)) >= parseFloat(String(fv)),
    less_than: (cv, fv) => cv != null && parseFloat(String(cv)) < parseFloat(String(fv)),
    less_than_equal: (cv, fv) => cv != null && parseFloat(String(cv)) <= parseFloat(String(fv)),
};

const dateStrategies: Record<string, FilterFn> = {
    equal: (cv, fv) => cv != null && dateFormat(cv) === String(fv),
    not_equal: (cv, fv) => cv != null && dateFormat(cv) !== String(fv),
    greater_than: (cv, fv) => cv != null && dateFormat(cv) > String(fv),
    less_than: (cv, fv) => cv != null && dateFormat(cv) < String(fv),
};

const boolStrategies: Record<string, FilterFn> = {
    equal: (cv, fv) => cv === fv,
};

const strategies: Record<IColumnType, Record<string, FilterFn>> = {
    string: stringStrategies,
    number: numberStrategies,
    date: dateStrategies,
    bool: boolStrategies,
};

// Shared strategies available for all column types
const sharedStrategies: Record<string, FilterFn> = {
    is_null: (cv) => cv == null || cv === '',
    is_not_null: (cv) => cv != null && cv !== '',
};

export interface INormalizedColumn {
    field: string;
    type: IColumnType;
    condition: IFilterCondition;
    value: string | number | boolean | undefined;
    filter: boolean;
    search: boolean;
    sort: boolean;
    hide: boolean;
    // Display properties passed through from IColumnDefinition
    title?: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    headerClass?: string;
    cellClass?: string;
    isUnique?: boolean;
    html?: boolean;
    cellRenderer?: ((row: Record<string, unknown>) => string) | string;
    filterCallback?: (cellValue: unknown, row: Record<string, unknown>, search: string) => boolean;
}

/**
 * Apply column filters to a row set.
 * Returns a new array — does not mutate the input.
 */
export const applyColumnFilters = (rows: Array<Record<string, unknown>>, columns: INormalizedColumn[]): Array<Record<string, unknown>> => {
    let result = rows;

    for (const col of columns) {
        if (!col.filter) continue;

        const hasValue = col.value !== undefined && col.value !== null && col.value !== '';
        const isNullCondition = col.condition === 'is_null' || col.condition === 'is_not_null';

        if (!hasValue && !isNullCondition) continue;

        // Check shared strategies first (is_null / is_not_null)
        const sharedFn = sharedStrategies[col.condition];
        if (sharedFn) {
            result = result.filter((row) => sharedFn(cellValue(row, col.field), col.value!));
            continue;
        }

        // Bool type uses simple equality
        if (col.type === 'bool') {
            result = result.filter((row) => cellValue(row, col.field) === col.value);
            continue;
        }

        // If a per-column filterCallback is provided, use it to filter rows when a filter value exists
        if (typeof col.filterCallback === 'function' && hasValue) {
            try {
                result = result.filter((row) => col.filterCallback!(cellValue(row, col.field), row, String(col.value)) === true);
            } catch (err) {
                result = result.filter(() => false);
            }
            continue;
        }

        // Lookup type-specific strategy
        const typeFns = strategies[col.type];
        const fn = typeFns?.[col.condition];
        if (fn && col.value !== undefined) {
            result = result.filter((row) => fn(cellValue(row, col.field), col.value!));
        }
    }

    return result;
};

/**
 * Apply global search across searchable columns.
 * Returns a new array — does not mutate the input.
 */
export const applyGlobalSearch = (rows: Array<Record<string, unknown>>, columns: INormalizedColumn[], search: string): Array<Record<string, unknown>> => {
    if (!search || !rows.length) return rows;

    const searchLower = search.toLowerCase();
    const searchableFields = columns.filter((c) => c.search && !c.hide).map((c) => c.field);

    return rows.filter((row) =>
        searchableFields.some((field) => {
            const raw = cellValue(row, field);

            // Prefer a per-column filterCallback when available for this field
            const col = columns.find((c) => c.field === field);
            if (col && typeof col.filterCallback === 'function') {
                try {
                    return col.filterCallback(raw, row, search) === true;
                } catch {
                    return false;
                }
            }

            // Default to case-insensitive substring matching
            const text = String(raw ?? '');
            return text.toLowerCase().includes(searchLower);
        }),
    );
};

/**
 * Apply sorting to a row set.
 * Returns a new sorted array — does not mutate the input.
 */
export const applySorting = (rows: Array<Record<string, unknown>>, sortColumn: string, sortDirection: string, isNumeric: boolean): Array<Record<string, unknown>> => {
    const collator = new Intl.Collator(undefined, {
        numeric: isNumeric,
        sensitivity: 'base',
    });
    const sortOrder = sortDirection === 'desc' ? -1 : 1;

    return [...rows].sort((a, b) => {
        const valA = cellValue(a, sortColumn);
        const valB = cellValue(b, sortColumn);
        return collator.compare(String(valA ?? ''), String(valB ?? '')) * sortOrder;
    });
};
