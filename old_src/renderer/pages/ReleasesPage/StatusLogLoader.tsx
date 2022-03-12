import React from 'react';
import styled from '@emotion/styled';

import StatusLog from './StatusLog';

const Styled = {
    StatusLog: styled(StatusLog)``,
};

export type StatusLogLoaderProps = {
    releaseId: string;
    taskId: string;
    showAllSteps: boolean;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Performs API calls to display the status logs for a single task,
 * including the long polling logic to constantly keep it updated.
 */
export default function StatusLogLoader({
    showAllSteps,
    style,
    className,
}: StatusLogLoaderProps): React.ReactElement {
    // TODO load log from release/task IDs and handle long polling
    return (
        <Styled.StatusLog
            log={[]}
            showAllSteps={showAllSteps}
            className={className}
            style={style}
        />
    );
}
