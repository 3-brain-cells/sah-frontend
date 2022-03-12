import React from 'react';
import { Column, TableCellProps } from 'react-virtualized';

import BaseText from '../../components/BaseText';
import DataGrid, { SortableHeaderRenderer, TextCellRenderer } from '../../components/DataGrid';
import useSelection from '../../components/_lib/use_selection';

type SampleItem = {
    owner: string;
    color: string;
    id: string;
};

/* eslint-disable no-plusplus */
let nextId = 0;
const SAMPLE_ITEMS: SampleItem[] = [
    {
        owner: 'john',
        color: 'blue',
        id: String(nextId++),
    },
    {
        owner: 'charlie',
        color: 'green',
        id: String(nextId++),
    },
    {
        owner: 'peter',
        color: 'red',
        id: String(nextId++),
    },
    {
        owner: 'frank',
        color: '#333232',
        id: String(nextId++),
    },
    {
        owner: 'ted',
        color: '#9ABCA7',
        id: String(nextId++),
    },
    {
        owner: 'donald',
        color: '#F7B2AD',
        id: String(nextId++),
    },
    {
        owner: 'joe',
        color: 'white',
        id: String(nextId++),
    },
    {
        owner: 'alexander',
        color: 'magenta',
        id: String(nextId++),
    },
    {
        owner: 'fred',
        color: 'cyan',
        id: String(nextId++),
    },
];
/* eslint-enable no-plusplus */

function extractSampleId(item: unknown): string {
    return (item as SampleItem).id;
}

function extractSampleSortKey(item: unknown, sortColumn: string): string | number {
    const typedItem = item as SampleItem;
    switch (sortColumn) {
        case 'owner':
            return typedItem.owner;
        case 'color':
        default:
            return typedItem.color;
    }
}

function ColorCellRenderer({ cellData }: TableCellProps): React.ReactElement {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <div style={{ height: 16, width: 16, backgroundColor: cellData }} />
            <BaseText>{cellData}</BaseText>
        </div>
    );
}

/**
 * Displays a small demo of the `<DataGrid>` component showing some items
 * in a sortable/selectable grid
 */
export default function DataGridDemo(): React.ReactElement {
    const selectionState = useSelection({ source: SAMPLE_ITEMS, extractId: extractSampleId });
    return (
        <>
            <BaseText>{Object.keys(selectionState.selectedIds).length} items selected</BaseText>
            <DataGrid
                width={500}
                height={300}
                items={SAMPLE_ITEMS}
                extractId={extractSampleId}
                extractSortKey={extractSampleSortKey}
                selectionState={selectionState}
                defaultSortColumn="owner"
            >
                {/* The selection column is automatically included by <DataGrid /> */}
                <Column
                    dataKey="owner"
                    label="Owner"
                    width={250}
                    headerRenderer={SortableHeaderRenderer}
                    cellRenderer={TextCellRenderer}
                    cellDataGetter={({ rowData }: { rowData: SampleItem }) => rowData.owner}
                />
                <Column
                    dataKey="color"
                    label="Color"
                    width={250}
                    headerRenderer={SortableHeaderRenderer}
                    cellRenderer={ColorCellRenderer}
                    cellDataGetter={({ rowData }: { rowData: SampleItem }) => rowData.color}
                />
            </DataGrid>
        </>
    );
}
