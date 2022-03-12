import React from 'react';
import styled from '@emotion/styled';
import { FaFlagCheckered } from 'react-icons/fa';

import { colors } from '../../components/_lib/colors';

const Styled = {
    ReleaseTaskStatus: styled.div`
        display: flex;
        flex-direction: row;
        gap: 8px;
    `,
    GreenText: styled.b`
        color: ${colors['green+10']};
    `,
};

export type ReleaseTaskStatusProps = {
    status: StatusType;
    className?: string;
    style?: React.CSSProperties;
};

export enum StatusType {
    FINISHED = 'finished',
}

export default function ReleaseTaskStatus({
    style,
    className,
    status,
}: ReleaseTaskStatusProps): React.ReactElement {
    if (status === StatusType.FINISHED) {
        return (
            <Styled.ReleaseTaskStatus className={className} style={style}>
                <Styled.GreenText>
                    <FaFlagCheckered /> Finished
                </Styled.GreenText>
            </Styled.ReleaseTaskStatus>
        );
    }
    return <>status not found</>;
}
