import React from 'react';
import styled from '@emotion/styled';
import { FaCopy, FaPlus, FaTrash } from 'react-icons/fa';

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

export type ProfileGroupGridActionBarProps = {
    hasAnySelected: boolean;
    onNew: (e: React.MouseEvent) => void;
    onDuplicate: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Shows all of the buttons at the top of the `<ProfileGroupGrid>` component,
 * showing different buttons based on whether the grid has:
 * - any tasks selected
 */
export default function ProfileGroupGridActionBar({
    hasAnySelected,
    onNew,
    onDuplicate,
    onDelete,
    style,
    className,
}: ProfileGroupGridActionBarProps): React.ReactElement {
    return (
        <Styled.Row className={className} style={style}>
            <Button icon={<FaPlus />} text="New" onClick={onNew} />
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
