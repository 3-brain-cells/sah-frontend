import { useState, useMemo, useCallback } from 'react';

export interface UseSelectionOptions<T> {
    source: T[];
    extractId: (t: T) => string;
    onChangeSelection?: (selection: string[]) => void;
}

export interface UseSelectionState {
    selectedIds: Record<string, null>;
    anySelected: boolean;
    allSelected: boolean;
    isSelected: (id: string) => boolean;
    removeSelection: (ids: string[]) => void;
    toggleSelected: (id: string) => void;
    toggleAllSelected: () => void;
}

/**
 * Custom hook for managing selection state.
 * @param source - source array of items
 * @param extractId - function to obtain ID value from single item.
 * Should be as stable as possible to prevent unnecessary recomputation.
 * @param onChangeSelection - callback function when the selection is changed.
 * Should be as stable as possible to prevent unnecessary recomputation.
 * @returns
 */
export default function useSelection<T>({
    source,
    extractId,
    onChangeSelection,
}: UseSelectionOptions<T>): UseSelectionState {
    const [selectedIds, setSelectedIds] = useState<Record<string, null>>({});

    const anySelected = useMemo<boolean>(() => Object.keys(selectedIds).length > 0, [selectedIds]);

    const allSelected = useMemo<boolean>(() => {
        if (!anySelected) return false;

        const allSelectedIds = new Set<string>(Object.keys(selectedIds));

        for (const item of source) {
            const id = extractId(item);
            if (allSelectedIds.has(id)) {
                allSelectedIds.delete(id);
            } else {
                return false;
            }
        }

        // If all tasks were selected, then this set should contain nothing
        return allSelectedIds.size === 0;
    }, [anySelected, source, selectedIds, extractId]);

    const isSelected = useCallback(
        (id: string) => Object.prototype.hasOwnProperty.call(selectedIds, id),
        [selectedIds]
    );

    const removeSelection = useCallback(
        (ids: string[]) => {
            let newSelectedIds: Record<string, null> | null = null;
            for (const id of ids) {
                if (isSelected(id)) {
                    if (newSelectedIds === null) {
                        newSelectedIds = { ...selectedIds };
                    }
                    delete newSelectedIds[id];
                }
            }
            if (newSelectedIds !== null) {
                setSelectedIds(newSelectedIds);
                if (onChangeSelection != null) onChangeSelection(Object.keys(newSelectedIds));
            }
        },
        [isSelected, selectedIds, onChangeSelection]
    );

    const toggleSelected = useCallback(
        (id: string) => {
            const newSelectedIds = { ...selectedIds };
            if (isSelected(id)) {
                delete newSelectedIds[id];
            } else {
                newSelectedIds[id] = null;
            }
            setSelectedIds(newSelectedIds);
            if (onChangeSelection != null) onChangeSelection(Object.keys(newSelectedIds));
        },
        [selectedIds, isSelected, onChangeSelection]
    );

    const toggleAllSelected = useCallback(() => {
        if (allSelected) {
            // Unselect all
            setSelectedIds({});
            if (onChangeSelection != null) onChangeSelection([]);
        } else {
            // Select all
            const newSelectedIds: Record<string, null> = {};
            for (const item of source) {
                const id = extractId(item);
                newSelectedIds[id] = null;
            }
            setSelectedIds(newSelectedIds);
            if (onChangeSelection != null) onChangeSelection(Object.keys(newSelectedIds));
        }
    }, [allSelected, extractId, source, onChangeSelection]);

    return {
        selectedIds,
        anySelected,
        allSelected,
        isSelected,
        removeSelection,
        toggleSelected,
        toggleAllSelected,
    };
}
