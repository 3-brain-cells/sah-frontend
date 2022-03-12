import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import {
    Column,
    Table,
    SortDirection,
    SortDirectionType,
    ScrollEventData,
} from 'react-virtualized';
import {
    defaultRowRenderer,
    SortIndicator,
    TableCellProps,
    TableHeaderProps,
    TableProps,
} from 'react-virtualized/dist/es/Table';
import { cx } from '@emotion/css';
import { rgba } from 'polished';

import Checkbox from './Checkbox';
import { colors } from './_lib/colors';
import { UseSelectionState } from './_lib/use_selection';
import BaseText from './BaseText';

import 'react-virtualized/styles.css';

const ALTERNATE_ROW_BACKGROUND = colors.background15;
const ROW_OVERSCAN_COUNT = 40;
const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 40;
// Amount of space between header row's bottom line
// and the start of the next row.
// Used to make the first row's button bounds look less cramped.
const HEADER_GAP = 4;

const Styled = {
    Table: styled(Table)`
        .ReactVirtualized__Table__Grid {
            outline: none;
        }

        .ReactVirtualized__Table__sortableHeaderColumn {
            outline: none;

            & > * {
                white-space: nowrap;
            }
        }

        .ReactVirtualized__Table__headerRow {
            user-select: none;
            font-weight: normal;
            text-transform: none;
            border-bottom: 2px solid ${colors['foreground-ghost']};
        }

        .ReactVirtualized__Table__sortableHeaderIcon {
            opacity: 0.4;
            transform: scale(1.5) translateY(2px);
            width: 1.5em;
        }

        /* Create a pseudo-element for the drop shadow */
        &::after {
            content: ' ';
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            opacity: 0;
            top: ${HEADER_HEIGHT}px;
            bottom: 0;
            left: 0;
            right: 0;
            box-shadow: inset 0 12px 12px -12px rgba(0, 0, 0, 0.4);
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
        }

        &.is-scrolled {
            &::after {
                opacity: 1;
            }
        }
    `,
    RowWrapper: styled.div<{ isOdd: boolean; isSelected: boolean; isFirst: boolean }>`
        background-color: ${(props) => (props.isOdd ? 'transparent' : ALTERNATE_ROW_BACKGROUND)};
        position: relative;

        & > * {
            padding-top: ${(props) => (props.isFirst ? HEADER_GAP : 0)}px;

            height: 100%;
            background-color: ${(props) =>
                props.isSelected ? rgba(colors.secondary, 0.1) : 'transparent'};
        }
    `,
};

export type DataGridProps =
    // headerHeight & rowHeight are handled internally
    Omit<TableProps, 'headerHeight' | 'rowHeight' | 'rowCount'> &
        // Not sure why this is needed; otherwise TS complains
        Pick<TableProps, 'height' | 'width'> & {
            items: unknown[];
            extractId: (rowData: unknown) => string;
            selectionState: UseSelectionState;
            extractSortKey: (rowData: unknown, column: string) => string | number;
            defaultSortColumn: string;
            className?: string;
            style?: React.CSSProperties;
        };

/**
 * Data grid component that contains base styling for Kairos,
 * in addition to logic for sorting and selection.
 * Use `useSelection` to obtain `selectionState`.
 * `extractSortKey` should be as stable as possible to prevent recomputation.
 */
export default function DataGrid({
    items,
    extractId,
    selectionState,
    extractSortKey,
    defaultSortColumn,
    style,
    className,
    children,
    ...tableProps
}: DataGridProps): React.ReactElement {
    // Handle whether the container is scrolled
    // (to display a small shadow at the top)
    const [isScrolled, setIsScrolled] = useState(false);
    const updateScrollState = (scrollTop: number) => {
        if (scrollTop >= 20 && !isScrolled) {
            setIsScrolled(true);
        } else if (scrollTop < 20 && isScrolled) {
            setIsScrolled(false);
        }
    };

    // Handle sort state
    const [sortBy, setSortBy] = useState<string>(defaultSortColumn);
    const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.DESC);
    const sortedItems = useMemo(() => {
        const baseComparator = (a: unknown, b: unknown) => {
            const aSort = extractSortKey(a, sortBy);
            const bSort = extractSortKey(b, sortBy);
            if (typeof aSort === 'number' && typeof bSort === 'number') {
                return aSort - bSort;
            }

            if (typeof aSort === 'string' && typeof bSort === 'string') {
                return aSort.localeCompare(bSort);
            }

            // Unreachable
            throw new Error(`invalid types for sort keys ${aSort} & ${bSort}`);
        };
        return items.sort((a, b) => {
            const comparatorResult = baseComparator(a, b);
            if (sortDirection === SortDirection.ASC) return -comparatorResult;
            return comparatorResult;
        });
    }, [items, extractSortKey, sortBy, sortDirection]);

    return (
        <Styled.Table
            headerHeight={HEADER_HEIGHT}
            overscanRowCount={ROW_OVERSCAN_COUNT}
            rowHeight={({ index }) => (index === 0 ? HEADER_GAP + ROW_HEIGHT : ROW_HEIGHT)}
            rowGetter={({ index }) => sortedItems[index]}
            rowCount={sortedItems.length}
            sort={({ sortBy: newSortBy, sortDirection: newSortDirection }) => {
                setSortBy(newSortBy);
                setSortDirection(newSortDirection);
            }}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onScroll={({ scrollTop }: ScrollEventData) => updateScrollState(scrollTop)}
            rowRenderer={(props) => (
                <Styled.RowWrapper
                    style={props.style}
                    key={extractId(props.rowData)}
                    isFirst={props.index === 0}
                    isOdd={props.index % 2 === 1}
                    isSelected={selectionState.isSelected(extractId(props.rowData))}
                >
                    {defaultRowRenderer({ ...props, style: {} })}
                </Styled.RowWrapper>
            )}
            style={style}
            className={cx(className, isScrolled && 'is-scrolled')}
            // Pass in the selection state
            // to force the table to re-render when it changes
            selectedTasks={selectionState.selectedIds}
            {...tableProps}
        >
            <Column
                dataKey="selection"
                width={32}
                minWidth={32}
                disableSort
                cellRenderer={({ rowData }: { rowData: unknown }) => (
                    <Checkbox
                        selected={selectionState.isSelected(extractId(rowData))}
                        onClick={() => selectionState.toggleSelected(extractId(rowData))}
                        style={{ marginLeft: 4 }}
                    />
                )}
                headerRenderer={() => (
                    <Checkbox
                        selected={selectionState.allSelected}
                        indeterminate={selectionState.anySelected && !selectionState.allSelected}
                        onClick={() => selectionState.toggleAllSelected()}
                        style={{ marginLeft: 4 }}
                    />
                )}
            />
            {children}
        </Styled.Table>
    );
}

// ==============
// Sub-components
// ==============

/**
 * Header renderer for simple column with just text
 */
export function TextHeaderRenderer({ label }: TableHeaderProps): React.ReactElement {
    return <BaseText>{label}</BaseText>;
}

/**
 * Header renderer for column with a sort indicator
 */
export function SortableHeaderRenderer({
    dataKey,
    label,
    sortBy,
    sortDirection,
}: TableHeaderProps): React.ReactElement {
    return (
        <div>
            <BaseText style={{ display: 'inline' }}>{label}</BaseText>
            {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
        </div>
    );
}

/**
 * Cell renderer for simple text content
 */
export function TextCellRenderer({ cellData }: TableCellProps): React.ReactElement {
    return <BaseText>{cellData}</BaseText>;
}
