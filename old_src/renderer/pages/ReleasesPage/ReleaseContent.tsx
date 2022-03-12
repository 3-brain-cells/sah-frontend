import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { useSelector } from '../../store';
import ReleaseHeader from './ReleaseHeader';
import {
    addTasks,
    allTasks,
    releaseTaskStatusOverview,
    TaskStatusOverview,
    updateRelease,
} from '../../slices/tasks';
import ReleaseDrawer from './ReleaseDrawer';
import ReleaseGrid from './ReleaseGrid';
import { colors, shadows } from '../../components/_lib/colors';
import HeightLayer, { Height } from '../../components/_lib/height';
import ReleaseForm from './ReleaseForm';
import ReleaseMassEditDrawer from './ReleaseMassEditDrawer';
import CreateTaskModal from './CreateTaskModal';

const Styled = {
    PageContent: styled.div`
        overflow: hidden;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: 20px;
        padding-left: 24px;
        gap: 30px;
    `,
    Wrapper: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    `,
    Header: styled(ReleaseHeader)`
        padding-right: 28px;
    `,
    Grid: styled(ReleaseGrid)`
        flex-grow: 1;
        background-color: ${colors.background20};
        border-top-left-radius: 16px;
        position: relative;

        &::after {
            z-index: 1;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: ' ';
            box-shadow: ${shadows.topLeftInner};
            border-top-left-radius: 16px;
            pointer-events: none;
        }
    `,
};

export type ReleaseContentProps = {
    id: string;
};

/**
 * Displays all of the content in the right-most pane of the releases page,
 * handling showing content for the single actively selected release
 */
export default function ReleaseContent({ id }: ReleaseContentProps): React.ReactElement {
    // Subscribe to the store to get the current release
    const release = useSelector((state) => state.tasks.releases[id]);
    const { url, path } = useRouteMatch();
    const history = useHistory();

    // Subscribe to the store to get the task overview
    const taskOverview: TaskStatusOverview = useSelector((state) =>
        releaseTaskStatusOverview(state, { id })
    );

    // Obtain the store's dispatch function
    const dispatch = useDispatch();

    const onChangeName = useCallback(
        (next: string) => dispatch(updateRelease({ id, partial: { name: next.trim() } })),
        [dispatch, id]
    );

    const taskCount = useMemo(() => Object.keys(release.tasks).length, [release.tasks]);

    // Obtain all tasks for the table
    const tasks = useSelector((state) => allTasks(state, { id }));

    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);

    return (
        <Styled.Wrapper>
            <Styled.PageContent>
                <Styled.Header
                    name={release.name}
                    site={release.site}
                    taskCount={taskCount}
                    taskOverview={taskOverview}
                    onChangeName={onChangeName}
                />
                <ReleaseForm />
                <HeightLayer height={Height.h20}>
                    <Styled.Grid
                        tasks={tasks}
                        releaseId={id}
                        onChangeSelection={setSelectedTasks}
                        onOpenMassEdit={() => {
                            history.push(`${url}/edit`);
                        }}
                        onCreateNewTask={() => {
                            setCreateTaskModalOpen(true);
                        }}
                    />
                </HeightLayer>
            </Styled.PageContent>
            <Switch>
                <Route exact path={path} />
                <Route
                    path={`${path}/tasks/:taskId`}
                    render={() => <ReleaseDrawer releaseId={id} />}
                />
                <Route
                    path={`${path}/edit`}
                    render={() => <ReleaseMassEditDrawer selectedTaskIds={selectedTasks} />}
                />
            </Switch>
            <CreateTaskModal
                isOpen={createTaskModalOpen}
                onClose={() => setCreateTaskModalOpen(false)}
                onCreate={() => {
                    dispatch(
                        addTasks({
                            releaseId: id,
                            tasks: [
                                {
                                    sizes: ['9', '10', '11'],
                                    profile: { groupId: '', id: '' },
                                    options: {},
                                },
                            ],
                        })
                    );
                }}
            />
        </Styled.Wrapper>
    );
}
