import React from 'react';
import styled from '@emotion/styled';

import { TaskStatusOverview } from '../../slices/tasks';
import { formatSite } from '../../util';
import ReleaseOverviewPills from './ReleaseOverviewPills';
import EditableTitle from '../../components/EditableTitle';
import { colors } from '../../components/_lib/colors';

const Styled = {
    Header: styled.div``,
    EditableTitle: styled(EditableTitle)`
        margin-bottom: -1px;
    `,
    SiteTaskCount: styled.h4`
        margin-bottom: 9px;
        letter-spacing: -0.01em;
        font-weight: 400;
        font-size: 16px;
        line-height: 23.44px;
        margin-top: 0;
        color: ${colors['foreground-light']};
    `,
    ReleaseOverviewPills: styled(ReleaseOverviewPills)``,
};

export type ReleaseHeaderProps = {
    name: string;
    site: string;
    taskCount: number;
    taskOverview: TaskStatusOverview;
    onChangeName: (next: string) => void;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Release header is a simple presentation component that displays a release's
 * name (with an editable title), site, task count, and task overview
 */
export default function ReleaseHeader({
    name,
    site,
    taskCount,
    taskOverview,
    onChangeName,
    className,
    style,
}: ReleaseHeaderProps): React.ReactElement {
    return (
        <Styled.Header className={className} style={style}>
            <Styled.EditableTitle value={name} onCommit={onChangeName} />
            <Styled.SiteTaskCount>
                {formatSite(site)} – {taskCount} task{taskCount === 1 ? '' : 's'}
            </Styled.SiteTaskCount>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Styled.ReleaseOverviewPills {...taskOverview} />
        </Styled.Header>
    );
}
