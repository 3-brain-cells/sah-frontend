import React from 'react';
import styled from '@emotion/styled';

import { shadows, colors } from './_lib/colors';
import HeightLayer, { Height } from './_lib/height';

const Styled = {
    Drawer: styled.div`
        border-top-left-radius: 24px;
        box-shadow: ${shadows.height20};
        overflow: hidden;
        width: 350px;
        padding-top: 20px;
        background-color: ${colors.background40};
    `,
};

export type DrawerProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

/**
 * Drawer is a drawer on the right of the screen generally used as a window for for looking at a detailed item.
 */
export default function Drawer({ children, className, style }: DrawerProps): React.ReactElement {
    return (
        <Styled.Drawer className={className} style={style}>
            <HeightLayer height={Height.h40}>{children}</HeightLayer>
        </Styled.Drawer>
    );
}
