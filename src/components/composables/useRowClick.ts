/**
 * Row click composable — uses native click/dblclick events.
 *
 * Single clicks fire instantly (no artificial delay).
 * Double-click fires the dblclick callback via native browser event.
 *
 * Note: On double-click, the single-click callback fires twice (once per click event)
 * before the double-click callback fires. This matches the behavior of AG Grid,
 * PrimeVue, and other major datatable libraries. If `selectRowOnClick` is enabled,
 * the two clicks toggle selection twice (select → unselect = net zero change),
 * so selection state remains correct.
 */
export function useRowClick(onSingleClick: (item: Record<string, unknown>, index: number) => void, onDoubleClick: (item: Record<string, unknown>) => void) {
    const handleClick = (item: Record<string, unknown>, index: number) => {
        onSingleClick(item, index);
    };

    const handleDblClick = (item: Record<string, unknown>) => {
        onDoubleClick(item);
    };

    return { handleClick, handleDblClick };
}
