import React from 'react';
import styled from '@emotion/styled';
import { FaCopy, FaPencilAlt, FaPlay, FaPlus, FaStop, FaTrash } from 'react-icons/fa';

import Button from '../../components/Button';

const Styled = {
    Row: styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;

        padding: 12px;
        gap: 12px;
    `,
};

export type ReleaseGridActionBarProps = {
    hasAny: boolean;
    hasAnySelected: boolean;
    onNew: (e: React.MouseEvent) => void;
    onStartAll: (e: React.MouseEvent) => void;
    onStartSelected: (e: React.MouseEvent) => void;
    onStopAll: (e: React.MouseEvent) => void;
    onStopSelected: (e: React.MouseEvent) => void;
    onMassEdit: (e: React.MouseEvent) => void;
    onDuplicate: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Shows all of the buttons at the top of the `<ReleaseGrid>` component,
 * showing different buttons based on whether the grid has:
 * - any tasks in it
 * - any tasks selected
 */
export default function ReleaseGridActionBar({
    hasAny,
    hasAnySelected,
    onNew,
    onStartAll,
    onStartSelected,
    onStopAll,
    onStopSelected,
    onMassEdit,
    onDuplicate,
    onDelete,
    style,
    className,
}: ReleaseGridActionBarProps): React.ReactElement {
    return (
        <Styled.Row className={className} style={style}>
            <Button icon={<FaPlus />} text="New" onClick={onNew} />
            {hasAny &&
                (hasAnySelected ? (
                    <Button
                        icon={<FaPlay />}
                        text="Start Selected"
                        onClick={onStartSelected}
                        disabled={!hasAny}
                        variant="background"
                        iconColor="green"
                    />
                ) : (
                    <Button
                        icon={<FaPlay />}
                        text="Start All"
                        onClick={onStartAll}
                        disabled={!hasAny}
                        variant="background"
                        iconColor="green"
                    />
                ))}
            {hasAny &&
                (hasAnySelected ? (
                    <Button
                        icon={<FaStop />}
                        text="Stop Selected"
                        onClick={onStopSelected}
                        disabled={!hasAny}
                        variant="background"
                        iconColor="red"
                    />
                ) : (
                    <Button
                        icon={<FaStop />}
                        text="Stop All"
                        onClick={onStopAll}
                        disabled={!hasAny}
                        variant="background"
                        iconColor="red"
                    />
                ))}
            <Button
                icon={<FaPencilAlt />}
                text="Mass Edit"
                onClick={onMassEdit}
                disabled={!hasAnySelected}
                variant="background"
                iconColor="blue"
            />
            <Button
                icon={<FaCopy />}
                text="Duplicate"
                onClick={onDuplicate}
                disabled={!hasAnySelected}
                variant="background"
                iconColor="green"
            />
            <Button
                icon={<FaTrash />}
                text="Delete"
                onClick={onDelete}
                disabled={!hasAnySelected}
                variant="danger"
                iconColor="danger"
            />
        </Styled.Row>
    );
}
