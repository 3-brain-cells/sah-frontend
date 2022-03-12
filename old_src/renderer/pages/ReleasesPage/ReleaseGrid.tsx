import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Column, AutoSizer } from 'react-virtualized';
import { useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Task, resolveStatusTypeText } from '../../types/task';
import TaskActions from './TaskActions';
import { api } from '../../api';
import BaseText from '../../components/BaseText';
import InlineLink from '../../components/InlineLink';
import TaskStatus from './TaskStatus';
import ReleaseGridActionBar from './ReleaseGridActionBar';
import { addTasks, removeTasks } from '../../slices/tasks';
import { logError } from '../../util';
import Empty from '../../components/Empty';
import useSelection from '../../components/_lib/use_selection';
import DataGrid, {
    SortableHeaderRenderer,
    TextCellRenderer,
    TextHeaderRenderer,
} from '../../components/DataGrid';
import useConfirmation, { DELETE_TASK_CONFIRMATION } from '../../components/_lib/use_confirmation';

const Styled = {
    Wrapper: styled.div`
        display: flex;
        flex-direction: column;
        align-items: stretch;
    `,
    ActionsCell: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
    `,
};

export type ReleaseGridProps = {
    tasks: Task[];
    releaseId: string;
    onCreateNewTask: () => void;
    onOpenMassEdit: () => void;
    onChangeSelection: (selectedTaskIds: string[]) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Extension of Task that contains pre-computed fields
 * used for sorting, displaying, and (potentially) filtering.
 */
type TransformedTask = Task & {
    profileName: string;
    statusText: string;
    sizesText: string;
};

enum SortColumns {
    NUMBER = 'number',
    PROFILE = 'profile',
    SIZES = 'sizes',
    STATUS = 'status',
}

function extractTaskId(task: unknown): string {
    return (task as TransformedTask).definition.id;
}

function extractSortKey(task: unknown, sortColumn: string): string | number {
    const typedTask = task as TransformedTask;
    switch (sortColumn) {
        case SortColumns.NUMBER:
            return typedTask.definition.number;
        case SortColumns.PROFILE:
            return typedTask.profileName;
        case SortColumns.SIZES:
            return typedTask.sizesText;
        case SortColumns.STATUS:
            return typedTask.statusText;
        default:
            // Unreachable
            throw new Error(`unknown sort column ${sortColumn}`);
    }
}

/**
 * Renders the inner release content with each task organized in a table
 * with selectable rows and sortable columns,
 * as well as the toolbar at the top for performing actions on subsets of tasks.
 */
export default function ReleaseGrid({
    tasks,
    releaseId,
    className,
    style,
    onCreateNewTask,
    onOpenMassEdit,
    onChangeSelection,
}: ReleaseGridProps): React.ReactElement {
    const dispatch = useDispatch();
    const { url } = useRouteMatch();

    // Transform each task to eagerly attach metadata
    const transformedTasks = useMemo<TransformedTask[]>(
        () =>
            tasks.map((task) => ({
                ...task,
                // TODO provide real implementation once profile slice is added to store
                profileName: '<todo resolve>',
                statusText: resolveStatusTypeText(task.status?.status ?? null),
                sizesText: task.definition.sizes.join(','),
            })),
        [tasks]
    );

    // Use the useSelection hook to manage selection state management
    const selectionState = useSelection({
        source: transformedTasks,
        extractId: extractTaskId,
        onChangeSelection,
    });

    const deleteTasks = (taskIds: string[]) => {
        // Remove the tasks from the selection state if they are selected
        selectionState.removeSelection(taskIds);
        dispatch(removeTasks({ releaseId, taskIds }));
    };
    const duplicateSelectedTasks = () => {
        // Collect the tasks that have been selected for duplication
        const taskMap: Record<string, TransformedTask> = {};
        transformedTasks.forEach((task) => {
            taskMap[task.definition.id] = task;
        });
        const toDuplicateTasks: TransformedTask[] = [];
        Object.keys(selectionState.selectedIds).forEach((id) => {
            if (Object.prototype.hasOwnProperty.call(taskMap, id)) {
                toDuplicateTasks.push(taskMap[id]);
            }
        });

        dispatch(
            addTasks({
                releaseId,
                tasks: toDuplicateTasks.map((task) => {
                    const { definition } = task;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { number, id, ...partialDefinition } = definition;
                    return partialDefinition;
                }),
            })
        );
    };

    const deleteTaskConfirmation = useConfirmation({
        ...DELETE_TASK_CONFIRMATION,
        onConfirm: (task: Task) => deleteTasks([task.definition.id]),
    });
    const batchDeleteTasksConfirmation = useConfirmation({
        title: 'Delete Tasks',
        onConfirm: (taskIds: string[]) => deleteTasks(taskIds),
        // eslint-disable-next-line react/display-name
        renderBody: (taskIds: string[]) => (
            <BaseText variant="strong">
                Are you sure you want to delete {taskIds.length} task
                {taskIds.length === 1 ? '' : 's'}? Any in-progress tasks will be stopped.
            </BaseText>
        ),
    });

    // CellRenderer for the "Actions" column
    const ActionsCellRenderer = ({ rowData }: { rowData: TransformedTask }) => (
        <Styled.ActionsCell>
            <TaskActions
                status={rowData.status}
                onStart={() =>
                    api.releases.startTasks({
                        releaseId,
                        taskIds: [rowData.definition.id],
                    })
                }
                onRestart={() =>
                    api.releases.startTasks({
                        releaseId,
                        taskIds: [rowData.definition.id],
                    })
                }
                onStop={() =>
                    api.releases.stopTasks({
                        releaseId,
                        taskIds: [rowData.definition.id],
                    })
                }
                onDelete={(e: React.MouseEvent) =>
                    deleteTaskConfirmation.handleClickWithConfirmation(e, rowData)
                }
            />
            <InlineLink to={`${url}/tasks/${rowData.definition.id}`}>View Details</InlineLink>
        </Styled.ActionsCell>
    );

    return (
        <Styled.Wrapper className={className} style={style}>
            <ReleaseGridActionBar
                hasAny={transformedTasks.length > 0}
                hasAnySelected={selectionState.anySelected}
                onNew={onCreateNewTask}
                onStartAll={() => {
                    api.releases
                        .startTasks({ releaseId, taskIds: transformedTasks.map(extractTaskId) })
                        .catch((err) => logError(err, `Starting all tasks failed`));
                }}
                onStartSelected={() => {
                    api.releases
                        .startTasks({ releaseId, taskIds: Object.keys(selectionState.selectedIds) })
                        .catch((err) => logError(err, `Starting selected tasks failed`));
                }}
                onStopAll={() => {
                    api.releases
                        .stopTasks({ releaseId, taskIds: transformedTasks.map(extractTaskId) })
                        .catch((err) => logError(err, `Stopping all tasks failed`));
                }}
                onStopSelected={() => {
                    api.releases
                        .stopTasks({ releaseId, taskIds: Object.keys(selectionState.selectedIds) })
                        .catch((err) => logError(err, `Stopping selected tasks failed`));
                }}
                onMassEdit={onOpenMassEdit}
                onDuplicate={duplicateSelectedTasks}
                onDelete={(e) => {
                    const taskIds = Object.keys(selectionState.selectedIds);
                    batchDeleteTasksConfirmation.handleClickWithConfirmation(e, taskIds);
                }}
            />
            <div style={{ flexGrow: 1 }}>
                <AutoSizer>
                    {({ width, height }) => (
                        <DataGrid
                            width={width}
                            height={height}
                            items={transformedTasks}
                            extractId={extractTaskId}
                            selectionState={selectionState}
                            extractSortKey={extractSortKey}
                            defaultSortColumn={SortColumns.NUMBER}
                            noRowsRenderer={() => (
                                <Empty
                                    text="No tasks found"
                                    linkText="create a new task"
                                    onClick={onCreateNewTask}
                                />
                            )}
                        >
                            {/* The selection column is automatically included by <DataGrid /> */}
                            <Column
                                dataKey={SortColumns.NUMBER}
                                label="No"
                                width={60}
                                headerRenderer={SortableHeaderRenderer}
                                cellRenderer={TextCellRenderer}
                                cellDataGetter={({ rowData }: { rowData: TransformedTask }) =>
                                    String(rowData.definition.number)
                                }
                            />
                            <Column
                                dataKey={SortColumns.SIZES}
                                label="Sizes"
                                width={140}
                                headerRenderer={SortableHeaderRenderer}
                                cellRenderer={TextCellRenderer}
                                cellDataGetter={({ rowData }: { rowData: TransformedTask }) =>
                                    rowData.sizesText
                                }
                            />
                            <Column
                                dataKey={SortColumns.PROFILE}
                                label="Profile"
                                width={140}
                                headerRenderer={SortableHeaderRenderer}
                                cellRenderer={TextCellRenderer}
                                cellDataGetter={({ rowData }: { rowData: TransformedTask }) =>
                                    rowData.profileName
                                }
                            />
                            <Column
                                dataKey={SortColumns.STATUS}
                                label="Status"
                                width={220}
                                headerRenderer={SortableHeaderRenderer}
                                headerStyle={{ paddingLeft: 22 }}
                                // eslint-disable-next-line react/no-unused-prop-types
                                cellRenderer={({ rowData }: { rowData: TransformedTask }) => (
                                    <TaskStatus status={rowData.status} />
                                )}
                            />
                            <Column
                                dataKey="actions"
                                label="Actions"
                                width={180}
                                disableSort
                                headerRenderer={TextHeaderRenderer}
                                cellRenderer={ActionsCellRenderer}
                            />
                        </DataGrid>
                    )}
                </AutoSizer>
            </div>

            {deleteTaskConfirmation.confirmationModal}
            {batchDeleteTasksConfirmation.confirmationModal}
        </Styled.Wrapper>
    );
}
