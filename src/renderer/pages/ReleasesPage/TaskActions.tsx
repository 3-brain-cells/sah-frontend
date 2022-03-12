import React from 'react';
import styled from '@emotion/styled';
import { FaPlay, FaRedoAlt, FaStop, FaTrash } from 'react-icons/fa';

import { getStatusExecutionType, Status, StatusExecutionType } from '../../types/task';
import ActionButton from '../../components/ActionButton';

const Styled = {
    ActionRow: styled.div`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    `,
};

export type TaskActionsProps = {
    status: Status | null;
    onStart: (e: React.MouseEvent) => void;
    onRestart: (e: React.MouseEvent) => void;
    onStop: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Shows the related actions for a single task for use in the release grid.
 * Tasks always have a delete action,
 * and the other action is dependent on the status.
 * Ready tasks have the option to start,
 * finished, cancelled, and failed tasks have the option to restart,
 * and all other (running) tasks have the option to stop.
 */
export default function TaskActions({
    status,
    onStart,
    onRestart,
    onStop,
    onDelete,
    style,
    className,
}: TaskActionsProps): React.ReactElement {
    let statusDependentAction: React.ReactElement;
    const executionStatusType = getStatusExecutionType(status);
    switch (executionStatusType) {
        case StatusExecutionType.READY:
            // Start action
            statusDependentAction = (
                <ActionButton icon={<FaPlay />} onClick={onStart} iconColor="green" size="small" />
            );
            break;
        case StatusExecutionType.STOPPED:
            // Restart action
            statusDependentAction = (
                <ActionButton
                    icon={<FaRedoAlt />}
                    onClick={onRestart}
                    iconColor="blue"
                    size="small"
                />
            );
            break;
        case StatusExecutionType.RUNNING:
            // Stop action
            statusDependentAction = (
                <ActionButton icon={<FaStop />} onClick={onStop} iconColor="danger" size="small" />
            );
            break;
        default:
            // Unreachable
            throw new Error(`invalid status execution type ${executionStatusType}`);
    }

    return (
        <Styled.ActionRow className={className} style={style}>
            {statusDependentAction}
            <ActionButton
                icon={<FaTrash />}
                onClick={onDelete}
                iconColor="danger"
                variant="danger"
                size="small"
            />
        </Styled.ActionRow>
    );
}
