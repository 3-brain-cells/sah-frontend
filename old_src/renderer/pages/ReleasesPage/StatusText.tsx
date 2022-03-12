import React from 'react';
import styled from '@emotion/styled';
import { FaCheck, FaClock, FaFlagCheckered, FaRunning, FaStop } from 'react-icons/fa';

import { resolveStatusTypeColor, resolveStatusTypeText, StatusType } from '../../types/task';
import BaseText from '../../components/BaseText';

const Styled = {
    StatusText: styled.span<StatusProps>`
        color: ${(props) => resolveStatusTypeColor(props.status)};

        /* Nudge the icon down slightly */
        svg {
            top: 2px;
            position: relative;
        }
    `,
};

export type StatusTextProps = StatusProps & {
    className?: string;
    style?: React.CSSProperties;
};

export type StatusProps = {
    status: StatusType | null;
};

function StatusTextIcon({ status }: StatusProps): React.ReactElement {
    switch (status) {
        case StatusType.CANCELLED: {
            return <FaStop />;
        }
        case StatusType.FAILED: {
            return <FaStop />;
        }
        case StatusType.FINISHED: {
            return <FaFlagCheckered />;
        }
        case StatusType.RUNNING: {
            return <FaRunning />;
        }
        case StatusType.WAITING: {
            return <FaClock />;
        }
        case StatusType.WAITING_FOR_PROXY: {
            return <FaClock />;
        }
        // if status is null the task status is READY
        case null: {
            return <FaCheck />;
        }
        default: {
            return <>error lol</>;
        }
    }
}

/*
 ** StatusText is a icon/string that is mapped from a StatusType use this to describe the status of a task.
 */
export default function StatusText({
    style,
    className,
    status,
}: StatusTextProps): React.ReactElement {
    return (
        <BaseText>
            <Styled.StatusText status={status} className={className} style={style}>
                <StatusTextIcon status={status} />
                &ensp;{resolveStatusTypeText(status)}
            </Styled.StatusText>
        </BaseText>
    );
}
