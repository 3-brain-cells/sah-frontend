import React from 'react';
import styled from '@emotion/styled';

import { LogEntry } from '../../types/log';

const Styled = {
    StatusLog: styled.div``,
};

export type StatusLogProps = {
    log: LogEntry[];
    showAllSteps: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Simple display-only component that shows a series of log entries
 * and potentially groups them together according to the value of `showAllSteps`
 */
export default function StatusLog({ style, className }: StatusLogProps): React.ReactElement {
    // TODO implement
    return <Styled.StatusLog className={className} style={style} />;
}
