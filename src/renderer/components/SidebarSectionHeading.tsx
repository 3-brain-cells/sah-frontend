import React from 'react';
import styled from '@emotion/styled';

import BaseText from './BaseText';
import { colors } from './_lib/colors';

const Styled = {
    SidebarSectionHeading: styled(BaseText)`
        margin-left: 24px;
        margin-bottom: 8px;
        margin-top: 20px;
        letter-spacing: 0.1em;
        color: ${colors['foreground-light']};
        user-select: none;
    `,
};

export type SidebarSectionHeadingProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export default function SidebarSectionHeading({
    children,
    className,
    style,
}: SidebarSectionHeadingProps): React.ReactElement {
    return (
        <Styled.SidebarSectionHeading className={className} style={style}>
            {children}
        </Styled.SidebarSectionHeading>
    );
}
