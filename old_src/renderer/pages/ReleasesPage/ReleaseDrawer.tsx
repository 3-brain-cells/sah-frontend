import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useHistory, useParams } from 'react-router-dom';
import { FaRedo, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import { rgba } from 'polished';
import { useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import Drawer from '../../components/Drawer';
import {
    resolveStatusTypeBgColor,
    Status,
    StatusType,
    Task,
    TaskDefinition,
} from '../../types/task';
import IconButton from '../../components/IconButton';
import ActionButton from '../../components/ActionButton';
import Button from '../../components/Button';
import InlineLink from '../../components/InlineLink';
import FormLabel from '../../components/FormLabel';
import BaseText from '../../components/BaseText';
import Details from '../../components/Details';
import Heading from '../../components/Heading';
import StatusText from './StatusText';
import { Store, useSelector } from '../../store';
import { removeTasks } from '../../slices/tasks';
import { SelectItem, SingleSelect, MultiSelect } from '../../components/Select';
import useConfirmation, { DELETE_TASK_CONFIRMATION } from '../../components/_lib/use_confirmation';
import { shadows } from '../../components/_lib/colors';
import Checkbox from '../../components/Checkbox';
import PageTitle from '../../components/PageTitle';
import StatusLogLoader from './StatusLogLoader';

const TOP_PADDING = 20;
const SIDE_PADDING = 24;

const Styled = {
    Drawer: styled(Drawer)`
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-top: ${TOP_PADDING - 2}px;
        flex-shrink: 0;
        gap: 20px;
    `,
    TitleRow: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        /* Use an offset of -10px to visually align the X icon
           with the rest of the drawer*/
        padding-left: ${SIDE_PADDING - 10}px;
        padding-right: ${SIDE_PADDING}px;
        padding-bottom: 12px;
    `,
    Title: styled.div`
        position: relative;
        flex-grow: 1;
    `,
    SubTitleText: styled(BaseText)`
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% - 4px);
    `,
    ActionButtonRow: styled.div`
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: 12px;
        padding-left: ${SIDE_PADDING}px;
        padding-right: ${SIDE_PADDING}px;
    `,
    StatusRow: styled.div<{ status: StatusType | undefined }>`
        display: flex;
        flex-direction: row;
        background-color: ${(props) => rgba(resolveStatusTypeBgColor(props.status), 0.35)};
        padding-left: ${SIDE_PADDING}px;
        padding-right: ${SIDE_PADDING}px;
        padding-top: 16px;
        padding-bottom: 16px;
        box-shadow: ${shadows.height10};
    `,
    StatusText: styled.div`
        display: flex;
        flex-direction: column;
    `,
    ReleaseTaskStatus: styled.span`
        display: flex;
        flex-direction: row;
        gap: 10px;
    `,
    InputFields: styled.div`
        display: grid;
        grid-template-columns: 80px auto;
        grid-auto-rows: auto;
        row-gap: 16px;
        column-gap: 12px;
        align-items: center;
        padding-left: ${SIDE_PADDING}px;
        padding-right: ${SIDE_PADDING}px;
    `,
    Label: styled.div`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    `,
    LogTitleRow: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: ${SIDE_PADDING}px;
        padding-right: ${SIDE_PADDING}px;
        margin-top: 8px;
    `,
    LogWrapper: styled.div`
        flex-grow: 1;
        padding-left: 8px;
        padding-right: 8px;
        box-shadow: inset 0 12px 12px -12px rgba(0, 0, 0, 0.4);
        margin-top: -8px;
    `,
};

const taskById = createSelector(
    [
        (state: Store, props: { releaseId: string; taskId: string }) =>
            state.tasks.releases[props.releaseId].tasks[props.taskId] ?? null,
        (state: Store, props: { releaseId: string; taskId: string }) =>
            state.tasks.taskStatuses?.[props.releaseId]?.[props.taskId] ?? null,
    ],
    (taskDefinition: TaskDefinition | null, taskStatus: Status | null): Task | null => {
        if (taskDefinition === null) {
            return null;
        }

        return { definition: taskDefinition, status: taskStatus };
    }
);

export type ReleaseDrawerProps = {
    className?: string;
    style?: React.CSSProperties;
    releaseId: string;
};

export default function ReleaseDrawer({
    style,
    className,
    releaseId,
}: ReleaseDrawerProps): React.ReactElement {
    const { taskId } = useParams<{ taskId: string }>();
    const history = useHistory();
    const currentTask = useSelector((state) => taskById(state, { releaseId, taskId }));
    if (!currentTask) {
        history.push('/');
    }

    // Obtain the store's dispatch function
    const dispatch = useDispatch();

    const [selectedSizes, setSelectedSizes] = React.useState<SelectItem[]>(
        currentTask?.definition.sizes.map((size) => ({
            value: size,
            label: size,
        })) ?? []
    );

    const profiles = ['1', '2', '3'].map((profile) => ({
        value: profile,
        label: profile,
    }));

    const [selectedProfile, setSelectedProfile] = React.useState<SelectItem>(profiles[0]);

    const deleteTask = () => {
        dispatch(
            removeTasks({
                releaseId,
                taskIds: [taskId],
            })
        );
        history.push('..');
    };
    const deleteConfirmation = useConfirmation({
        ...DELETE_TASK_CONFIRMATION,
        onConfirm: deleteTask,
    });

    const returnToRelease = () => history.push('..');

    const [showAllLogSteps, setShowAllLogSteps] = useState(false);

    return (
        <>
            <Styled.Drawer className={className} style={style}>
                <Styled.TitleRow>
                    <IconButton onClick={returnToRelease} icon={<FaTimes />} />
                    <Styled.Title>
                        <PageTitle>Task Details</PageTitle>
                        <Styled.SubTitleText variant="faded">
                            Task #{currentTask?.definition.number}
                        </Styled.SubTitleText>
                    </Styled.Title>
                    <ActionButton onClick={() => {}} icon={<FaRedo />} />
                    <ActionButton
                        variant="danger"
                        iconColor="danger"
                        onClick={(e) => {
                            if (currentTask !== null) {
                                deleteConfirmation.handleClickWithConfirmation(e, currentTask);
                            }
                        }}
                        icon={<FaTrash />}
                    />
                </Styled.TitleRow>
                <Styled.StatusRow status={currentTask?.status?.status || undefined}>
                    <Styled.StatusText>
                        <Styled.ReleaseTaskStatus className="text">
                            <BaseText>Current Status:</BaseText>{' '}
                            <StatusText status={currentTask?.status?.status ?? null} />
                        </Styled.ReleaseTaskStatus>
                        <Details>
                            <i>4 minutes ago</i>
                        </Details>
                    </Styled.StatusText>
                </Styled.StatusRow>
                <Styled.InputFields>
                    <Styled.Label>
                        <FormLabel>Sizes</FormLabel>
                    </Styled.Label>
                    <MultiSelect
                        clearable
                        selectedOptions={selectedSizes}
                        onAdd={(next) => {
                            setSelectedSizes([...next]);
                        }}
                        onRemove={(next) => {
                            setSelectedSizes([...next]);
                        }}
                        onClear={() => {
                            setSelectedSizes([]);
                        }}
                        options={
                            currentTask?.definition?.sizes.map((size) => ({
                                value: size,
                                label: size,
                            })) ?? []
                        }
                    />
                    <Styled.Label>
                        <FormLabel style={{ marginBottom: -2 }}>Profile</FormLabel>
                        <InlineLink to="/">(Configure)</InlineLink>
                    </Styled.Label>

                    <SingleSelect
                        selectedOption={selectedProfile}
                        onSelect={(item) => {
                            setSelectedProfile(item);
                        }}
                        options={profiles}
                    />
                </Styled.InputFields>

                <Styled.ActionButtonRow>
                    <Button variant="secondary" text="Save" onClick={() => {}} icon={<FaSave />} />
                    <Button
                        text="Discard Changes"
                        onClick={returnToRelease}
                        variant="background"
                        icon={<FaTimes />}
                        iconColor="danger"
                    />
                </Styled.ActionButtonRow>
                <Styled.LogTitleRow>
                    <Heading>Status Log</Heading>
                    <Checkbox
                        selected={showAllLogSteps}
                        onClick={() => setShowAllLogSteps(!showAllLogSteps)}
                        label="Show All Steps"
                    />
                </Styled.LogTitleRow>
                <Styled.LogWrapper>
                    <StatusLogLoader
                        releaseId={releaseId}
                        taskId={taskId}
                        showAllSteps={showAllLogSteps}
                    />
                </Styled.LogWrapper>
            </Styled.Drawer>
            {deleteConfirmation.confirmationModal}
        </>
    );
}
