import React from 'react';
import styled from '@emotion/styled';

import EditableTitle from '../../components/EditableTitle';
import { colors } from '../../components/_lib/colors';

const Styled = {
    Header: styled.div``,
    EditableTitle: styled(EditableTitle)`
        margin-bottom: -1px;
    `,
    ProfileCount: styled.h4`
        margin-bottom: 0;
        letter-spacing: -0.01em;
        font-weight: 400;
        font-size: 16px;
        line-height: 23.44px;
        margin-top: 0;
        color: ${colors['foreground-light']};
    `,
};

export type ProfileGroupHeaderProps = {
    name: string;
    profileCount: number;
    onChangeName: (next: string) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Profile group header is a simple presentation component that displays a profile group's
 * name (with an editable title) and number of sub-profiles
 */
export default function ProfileGroupHeader({
    name,
    profileCount,
    onChangeName,
    className,
    style,
}: ProfileGroupHeaderProps): React.ReactElement {
    return (
        <Styled.Header className={className} style={style}>
            <Styled.EditableTitle value={name} onCommit={onChangeName} />
            <Styled.ProfileCount>
                {profileCount} profile{profileCount === 1 ? '' : 's'}
            </Styled.ProfileCount>
        </Styled.Header>
    );
}
